import { getPrismaClient } from "@alpha-dfs/database";
import { getOperationalConfig } from "@alpha-dfs/observability";
import { getBackendDependencies } from "@/lib/backend/dependency-container";
import {
  type DeploymentConfigValidationResult,
  type ValidationCheck,
  validateDeploymentConfig,
} from "@/lib/backend/operations/deployment-config-validation";

export type StartupValidationResult = DeploymentConfigValidationResult & {
  ready: boolean;
  dependencies: {
    database: { status: "up" | "down"; latencyMs: number };
    engines: { status: "available"; mode: string };
    observability: { status: "available" };
  };
};

function pushCheck(
  checks: ValidationCheck[],
  blockers: string[],
  warnings: string[],
  check: ValidationCheck,
): void {
  checks.push(check);
  if (check.status === "fail") {
    blockers.push(check.message);
  } else if (check.status === "warn") {
    warnings.push(check.message);
  }
}

/** Full startup validation including config, dependencies, and diagnostics. */
export async function validateStartup(): Promise<StartupValidationResult> {
  const configResult = validateDeploymentConfig();
  const checks = [...configResult.checks];
  const blockers = [...configResult.blockers];
  const warnings = [...configResult.warnings];

  let dbStatus: "up" | "down" = "down";
  let dbLatency = 0;
  try {
    const started = Date.now();
    const client = getPrismaClient();
    await client.$queryRaw`SELECT 1`;
    await client.slate.count();
    dbLatency = Date.now() - started;
    dbStatus = "up";
    pushCheck(checks, blockers, warnings, {
      id: "dependency.database",
      category: "configuration",
      status: "pass",
      message: `Database reachable with schema (${dbLatency}ms)`,
      details: { latencyMs: dbLatency },
    });
  } catch (error) {
    const schemaMissing =
      error instanceof Error &&
      (error.message.includes("does not exist") || error.message.includes("no such table"));
    pushCheck(checks, blockers, warnings, {
      id: "dependency.database",
      category: "configuration",
      status: "fail",
      message: schemaMissing
        ? "Database schema not initialized — run npm run db:setup"
        : "Database unreachable at startup",
      details: { error: error instanceof Error ? error.message : String(error) },
    });
  }

  try {
    const { engines } = getBackendDependencies();
    const engineIds = [
      engines.slateAnalysis.engineId,
      engines.playerAnalysis.engineId,
      engines.confidence.engineId,
      engines.portfolio.engineId,
      engines.simulation.engineId,
    ];
    pushCheck(checks, blockers, warnings, {
      id: "dependency.engines",
      category: "configuration",
      status: "pass",
      message: `Engine registry loaded (${engineIds.length} engines)`,
      details: { engineIds },
    });
  } catch (error) {
    pushCheck(checks, blockers, warnings, {
      id: "dependency.engines",
      category: "configuration",
      status: "fail",
      message: "Engine registry failed to initialize",
      details: { error: error instanceof Error ? error.message : String(error) },
    });
  }

  const operationalConfig = getOperationalConfig();
  pushCheck(checks, blockers, warnings, {
    id: "dependency.observability",
    category: "configuration",
    status: "pass",
    message: "Observability configuration loaded",
    details: {
      pipelineTimeoutMs: operationalConfig.pipelineTimeoutMs,
      connectorMaxRetries: operationalConfig.connectorMaxRetries,
    },
  });

  const ok = blockers.length === 0;
  const ready = ok && dbStatus === "up";

  return {
    ...configResult,
    ok,
    ready,
    checks,
    blockers,
    warnings,
    dependencies: {
      database: { status: dbStatus, latencyMs: dbLatency },
      engines: { status: "available", mode: configResult.mode.engine },
      observability: { status: "available" },
    },
  };
}
