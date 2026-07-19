import {
  createIngestionService,
  createPlayerRepository,
  createRefreshRepository,
  createSlateRepository,
  getPrismaClient,
} from "@alpha-dfs/database";
import { getProviderCredentialStatus } from "@alpha-dfs/connectors";
import { getOperationalConfig, recordHistogram } from "@alpha-dfs/observability";
import { getBackendDependencies } from "@/lib/backend/dependency-container";
import { getRecentOperationalLogs } from "@/lib/backend/operations/operational-logger";

export type HealthCheckResponse = {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  checks: {
    database: { status: "up" | "down"; latencyMs: number };
    dataFreshness: { status: "fresh" | "stale" | "unknown"; lastRefreshAt: string | null };
    connectors: Array<{ sourceId: string; status: string; lastSuccessAt: string | null }>;
    providers: {
      draftkings: { mode: string; configured: boolean };
      projection: { mode: string; configured: boolean };
    };
    engines: { mode: string; status: "available" };
  };
};

export type ReadinessCheckResponse = {
  ready: boolean;
  timestamp: string;
  reasons: string[];
  slateValid: boolean;
  playerCount: number;
};

export async function getHealthStatus(): Promise<HealthCheckResponse> {
  const client = getPrismaClient();
  const refreshRepository = createRefreshRepository(client);
  const timestamp = new Date().toISOString();
  const freshnessThresholdMs = getOperationalConfig().freshnessThresholdMs;

  let dbStatus: "up" | "down" = "down";
  let dbLatency = 0;
  try {
    const started = Date.now();
    await client.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - started;
    recordHistogram("database.operation.duration_ms", dbLatency, {
      operation: "health_check",
      status: "ok",
    });
    dbStatus = "up";
  } catch {
    recordHistogram("database.operation.duration_ms", 0, {
      operation: "health_check",
      status: "error",
    });
    dbStatus = "down";
  }

  const latestRun = await refreshRepository.getLatestRun();
  const sourceStatuses = await refreshRepository.getSourceStatuses();

  let freshnessStatus: "fresh" | "stale" | "unknown" = "unknown";
  let lastRefreshAt: string | null = null;
  if (latestRun?.completedAt) {
    lastRefreshAt = latestRun.completedAt.toISOString();
    const age = Date.now() - latestRun.completedAt.getTime();
    freshnessStatus = age <= freshnessThresholdMs ? "fresh" : "stale";
  }

  const engineMode = process.env.ENGINE_REGISTRY_MODE === "stub" ? "stub" : "real";
  const providers = getProviderCredentialStatus();

  let overall: HealthCheckResponse["status"] = "healthy";
  if (dbStatus === "down") {
    overall = "unhealthy";
  } else if (
    freshnessStatus === "stale" ||
    sourceStatuses.some((source) => source.status === "unavailable") ||
    !providers.draftkings.configured
  ) {
    overall = "degraded";
  }

  return {
    status: overall,
    timestamp,
    checks: {
      database: { status: dbStatus, latencyMs: dbLatency },
      dataFreshness: { status: freshnessStatus, lastRefreshAt },
      connectors: sourceStatuses.map((source) => ({
        sourceId: source.sourceId,
        status: source.status,
        lastSuccessAt: source.lastSuccessAt?.toISOString() ?? null,
      })),
      providers,
      engines: { mode: engineMode, status: "available" },
    },
  };
}

export async function getReadinessStatus(): Promise<ReadinessCheckResponse> {
  const client = getPrismaClient();
  const slateRepository = createSlateRepository(client);
  const playerRepository = createPlayerRepository(client);
  const ingestionService = createIngestionService(slateRepository, playerRepository);

  const validation = await ingestionService.validateActiveSlate();
  const reasons: string[] = [];

  if (!validation.valid) {
    reasons.push(...validation.errors);
  }

  getBackendDependencies();

  const playerCount = validation.valid ? validation.playerCount : 0;

  return {
    ready: validation.valid,
    timestamp: new Date().toISOString(),
    reasons,
    slateValid: validation.valid,
    playerCount,
  };
}

export function getOperationalLogs(limit = 20) {
  return getRecentOperationalLogs(limit);
}
