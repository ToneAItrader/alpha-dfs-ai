#!/usr/bin/env npx tsx
/**
 * Production smoke test — in-process pipeline validation.
 * Optional HTTP checks when DEPLOY_BASE_URL is set.
 *
 * Usage:
 *   npm run deploy:smoke                         # full mode (default — writes DB)
 *   SMOKE_MODE=readonly npm run deploy:smoke     # read-only — no DB writes (V2.0-2)
 */
import { validateDeploymentConfig } from "../../apps/web/src/lib/backend/operations/deployment-config-validation.ts";
import { validateStartup } from "../../apps/web/src/lib/backend/operations/startup-validation.ts";
import { getDataOperationsService } from "../../apps/web/src/lib/backend/operations/data-operations-service.ts";
import { getBackendDependencies } from "../../apps/web/src/lib/backend/dependency-container.ts";
import { getPipelineExecutionManager } from "../../apps/web/src/lib/backend/pipeline-execution-manager.ts";
import { runReadonlySmokeSteps } from "../../apps/web/src/lib/backend/operations/smoke-readonly.ts";
import { runWithCorrelationContextAsync } from "@alpha-dfs/observability";

type SmokeStep = {
  name: string;
  status: "pass" | "fail";
  details?: unknown;
};

type SmokeMode = "full" | "readonly";

const steps: SmokeStep[] = [];

function getSmokeMode(): SmokeMode {
  const mode = process.env.SMOKE_MODE?.trim().toLowerCase();
  return mode === "readonly" ? "readonly" : "full";
}

function record(name: string, status: "pass" | "fail", details?: unknown) {
  steps.push({ name, status, details });
}

async function optionalHttpChecks(baseUrl: string): Promise<void> {
  const endpoints = [
    "/api/health/startup",
    "/api/health",
    "/api/health/ready",
    "/api/health/metrics",
    "/api/health/diagnostics",
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      const ok = response.status === 200;
      record(`http${endpoint}`, ok ? "pass" : "fail", { status: response.status });
    } catch (error) {
      record(`http${endpoint}`, "fail", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

async function runFullSmokePipeline(): Promise<void> {
  await runWithCorrelationContextAsync({ correlationId: "smoke-test" }, async () => {
    const refresh = await getDataOperationsService().refreshAndEnsureReady("smoke-refresh");
    record("refresh-pipeline", "pass", {
      slateId: refresh.slateId,
      degraded: refresh.degraded,
      sourceCount: refresh.sourceResults.length,
    });

    const { engines } = getBackendDependencies();
    const { result } = await getPipelineExecutionManager().execute("smoke-run", engines, {
      slateId: refresh.slateId,
      slateLabel: refresh.slateLabel,
    });
    record("analyze-pipeline", result.status === "complete" ? "pass" : "fail", {
      status: result.status,
      phasesCompleted: result.phasesCompleted,
    });
    if (result.status !== "complete") {
      throw new Error("Pipeline execution did not complete");
    }
  });
}

async function runReadonlySmokePipeline(): Promise<void> {
  await runWithCorrelationContextAsync({ correlationId: "smoke-test-readonly" }, async () => {
    const readonlyResult = await runReadonlySmokeSteps("smoke-readonly");
    record("engine-registry", readonlyResult.engineIds.length === 5 ? "pass" : "fail", {
      engineIds: readonlyResult.engineIds,
    });
    if (readonlyResult.engineIds.length !== 5) {
      throw new Error("Engine registry unavailable");
    }

    record("connector-fetch-readonly", readonlyResult.ok ? "pass" : "fail", {
      sourceCount: readonlyResult.sourceResults.length,
      degraded: readonlyResult.degraded,
      playerCount: readonlyResult.playerCount,
      errors: readonlyResult.errors,
    });
    if (!readonlyResult.ok) {
      throw new Error(readonlyResult.errors?.join("; ") ?? "Read-only connector fetch failed");
    }
  });
}

async function main() {
  const smokeMode = getSmokeMode();
  console.log(`Alpha DFS AI — Production Smoke Test (${smokeMode} mode)\n`);

  const deploy = validateDeploymentConfig();
  record("deployment-config", deploy.ok ? "pass" : "fail", {
    blockers: deploy.blockers,
    warnings: deploy.warnings,
  });
  if (!deploy.ok) {
    throw new Error("Deployment config validation failed");
  }

  const startup = await validateStartup();
  record("startup-validation", startup.ok ? "pass" : "fail", {
    ready: startup.ready,
    blockers: startup.blockers,
  });
  if (!startup.ok) {
    throw new Error("Startup validation failed");
  }

  if (smokeMode === "readonly") {
    await runReadonlySmokePipeline();
  } else {
    await runFullSmokePipeline();
  }

  const baseUrl = process.env.DEPLOY_BASE_URL?.replace(/\/$/, "");
  if (baseUrl) {
    console.log(`\nRunning HTTP smoke checks against ${baseUrl}`);
    await optionalHttpChecks(baseUrl);
  } else {
    record("http-checks", "pass", { skipped: true, reason: "DEPLOY_BASE_URL not set" });
  }

  const failed = steps.filter((step) => step.status === "fail");
  const report = {
    timestamp: new Date().toISOString(),
    smokeMode,
    overall: failed.length === 0 ? "pass" : "fail",
    steps,
  };

  console.log(JSON.stringify(report, null, 2));

  if (failed.length > 0) {
    console.error(`\nSmoke test FAILED (${failed.length} step(s))`);
    process.exit(1);
  }

  console.log("\n✓ Smoke test PASSED");
  process.exit(0);
}

main().catch((error) => {
  record("smoke-test", "fail", { error: error instanceof Error ? error.message : String(error) });
  console.error(JSON.stringify({ overall: "fail", steps }, null, 2));
  console.error("\nSmoke test FAILED:", error instanceof Error ? error.message : error);
  process.exit(1);
});
