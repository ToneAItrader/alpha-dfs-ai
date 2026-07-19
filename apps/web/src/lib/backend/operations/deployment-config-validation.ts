import { accessSync, constants } from "node:fs";
import { getProviderCredentialStatus } from "@alpha-dfs/connectors";

export type ValidationStatus = "pass" | "warn" | "fail";

export type ValidationCheck = {
  id: string;
  category: "environment" | "configuration" | "consistency" | "security";
  status: ValidationStatus;
  message: string;
  details?: Record<string, unknown>;
};

export type DeploymentConfigValidationResult = {
  ok: boolean;
  timestamp: string;
  mode: {
    connector: "live" | "seed";
    engine: "real" | "stub";
    nodeEnv: string;
  };
  checks: ValidationCheck[];
  blockers: string[];
  warnings: string[];
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

function fileExists(path: string): boolean {
  try {
    accessSync(path, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function resolveConnectorMode(): "live" | "seed" {
  return process.env.CONNECTOR_MODE === "seed" ? "seed" : "live";
}

function resolveEngineMode(): "real" | "stub" {
  return process.env.ENGINE_REGISTRY_MODE === "stub" ? "stub" : "real";
}

function isProductionLike(): boolean {
  return process.env.NODE_ENV === "production";
}

/** Synchronous deployment configuration validation (no runtime dependencies). */
export function validateDeploymentConfig(
  env: NodeJS.ProcessEnv = process.env,
): DeploymentConfigValidationResult {
  const checks: ValidationCheck[] = [];
  const blockers: string[] = [];
  const warnings: string[] = [];
  const connectorMode = env.CONNECTOR_MODE === "seed" ? "seed" : "live";
  const engineMode = env.ENGINE_REGISTRY_MODE === "stub" ? "stub" : "real";
  const nodeEnv = env.NODE_ENV ?? "development";

  if (!env.DATABASE_URL?.trim()) {
    pushCheck(checks, blockers, warnings, {
      id: "env.database_url",
      category: "environment",
      status: "fail",
      message: "DATABASE_URL is required",
    });
  } else {
    pushCheck(checks, blockers, warnings, {
      id: "env.database_url",
      category: "environment",
      status: "pass",
      message: "DATABASE_URL is set",
    });
  }

  if (connectorMode === "live") {
    const providers = getProviderCredentialStatus();
    if (!providers.draftkings.configured) {
      pushCheck(checks, blockers, warnings, {
        id: "config.draftkings",
        category: "configuration",
        status: "fail",
        message: "DraftKings P0 provider not configured for live mode",
      });
    } else {
      pushCheck(checks, blockers, warnings, {
        id: "config.draftkings",
        category: "configuration",
        status: "pass",
        message: `DraftKings provider configured (${providers.draftkings.mode})`,
      });

      const exportPath = env.DRAFTKINGS_EXPORT_PATH?.trim();
      if (exportPath && !fileExists(exportPath)) {
        pushCheck(checks, blockers, warnings, {
          id: "config.draftkings.path",
          category: "configuration",
          status: "fail",
          message: `DRAFTKINGS_EXPORT_PATH not readable: ${exportPath}`,
        });
      }
    }

    if (!providers.projection.configured) {
      pushCheck(checks, blockers, warnings, {
        id: "config.projection",
        category: "configuration",
        status: "warn",
        message: "Projection P1 provider not configured — refresh will run degraded",
      });
    } else {
      pushCheck(checks, blockers, warnings, {
        id: "config.projection",
        category: "configuration",
        status: "pass",
        message: `Projection provider configured (${providers.projection.mode})`,
      });

      const exportPath = env.PROJECTION_EXPORT_PATH?.trim();
      if (exportPath && !fileExists(exportPath)) {
        pushCheck(checks, blockers, warnings, {
          id: "config.projection.path",
          category: "configuration",
          status: "fail",
          message: `PROJECTION_EXPORT_PATH not readable: ${exportPath}`,
        });
      }
    }
  } else {
    pushCheck(checks, blockers, warnings, {
      id: "config.connector_mode",
      category: "configuration",
      status: isProductionLike() ? "fail" : "warn",
      message: isProductionLike()
        ? "CONNECTOR_MODE=seed is not allowed in production"
        : "CONNECTOR_MODE=seed — using fixture-backed connectors",
    });
  }

  const dkApiUrl = env.DRAFTKINGS_API_URL?.trim();
  const dkApiKey = env.DRAFTKINGS_API_KEY?.trim();
  if (dkApiUrl && !dkApiKey) {
    pushCheck(checks, blockers, warnings, {
      id: "consistency.draftkings_api",
      category: "consistency",
      status: "fail",
      message: "DRAFTKINGS_API_URL set without DRAFTKINGS_API_KEY",
    });
  }

  const projApiUrl = env.PROJECTION_API_URL?.trim();
  const projApiKey = env.PROJECTION_API_KEY?.trim();
  if (projApiUrl && !projApiKey) {
    pushCheck(checks, blockers, warnings, {
      id: "consistency.projection_api",
      category: "consistency",
      status: "fail",
      message: "PROJECTION_API_URL set without PROJECTION_API_KEY",
    });
  }

  if (engineMode === "stub") {
    pushCheck(checks, blockers, warnings, {
      id: "config.engine_mode",
      category: "configuration",
      status: isProductionLike() ? "fail" : "warn",
      message: isProductionLike()
        ? "ENGINE_REGISTRY_MODE=stub is not allowed in production"
        : "ENGINE_REGISTRY_MODE=stub — using stub engines",
    });
  } else {
    pushCheck(checks, blockers, warnings, {
      id: "config.engine_mode",
      category: "configuration",
      status: "pass",
      message: "Engine registry mode: real",
    });
  }

  if (env.ALPHA_DFS_ALLOW_SEED_FALLBACK === "true") {
    pushCheck(checks, blockers, warnings, {
      id: "security.seed_fallback",
      category: "security",
      status: isProductionLike() ? "fail" : "warn",
      message: isProductionLike()
        ? "ALPHA_DFS_ALLOW_SEED_FALLBACK must not be enabled in production"
        : "ALPHA_DFS_ALLOW_SEED_FALLBACK enabled — connector failures will seed-fallback",
    });
  }

  return {
    ok: blockers.length === 0,
    timestamp: new Date().toISOString(),
    mode: { connector: connectorMode, engine: engineMode, nodeEnv },
    checks,
    blockers,
    warnings,
  };
}

export { resolveConnectorMode, resolveEngineMode };
