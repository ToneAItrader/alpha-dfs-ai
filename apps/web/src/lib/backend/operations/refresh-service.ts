import type { PrismaClient } from "@prisma/client";
import type { ConnectorFetchResult, ConnectorRegistry } from "@alpha-dfs/connectors";
import {
  applyConnectorFailurePolicy,
  fetchWithRetry,
  mergeConnectorPayloads,
  retryOptionsForConnector,
} from "@alpha-dfs/connectors";
import { setSlateMarketCache } from "@/lib/backend/slate-market-cache";
import {
  createIngestionService,
  createPlayerRepository,
  createRefreshRepository,
  createSlateRepository,
  upsertSlatePayload,
} from "@alpha-dfs/database";
import {
  classifyFailure,
  getCorrelationContext,
  incrementCounter,
  recordHistogram,
  recordTrace,
  structuredLog,
} from "@alpha-dfs/observability";

export type SourceResultRecord = {
  sourceId: string;
  priority: string;
  ok: boolean;
  capturedAt: string;
  recordCount: number;
  durationMs: number;
  attempts: number;
  error?: string;
  degraded?: boolean;
};

export type RefreshResult =
  | {
      ok: true;
      slateId: string;
      degraded: boolean;
      sourceResults: SourceResultRecord[];
      refreshRunId: string;
    }
  | {
      ok: false;
      errors: string[];
      sourceResults: SourceResultRecord[];
      refreshRunId: string;
    };

function toSourceRecord(result: ConnectorFetchResult): SourceResultRecord {
  return {
    sourceId: result.sourceId,
    priority: result.priority,
    ok: result.ok,
    capturedAt: result.capturedAt,
    recordCount: result.recordCount,
    durationMs: result.durationMs,
    attempts: result.attempts,
    error: result.error,
    degraded: result.degraded,
  };
}

export function createRefreshService(client: PrismaClient, connectorRegistry: ConnectorRegistry) {
  const slateRepository = createSlateRepository(client);
  const playerRepository = createPlayerRepository(client);
  const refreshRepository = createRefreshRepository(client);
  const ingestionService = createIngestionService(slateRepository, playerRepository);

  return {
    slateRepository,
    playerRepository,
    ingestionService,
    refreshRepository,

    async refresh(options?: { runId?: string }): Promise<RefreshResult> {
      incrementCounter("refresh.run.total");
      const correlation = getCorrelationContext();
      const refreshStarted = Date.now();
      const refreshRunId = await refreshRepository.createRun(options?.runId);
      const context = {
        runId: options?.runId,
        requestedAt: new Date().toISOString(),
      };

      structuredLog("info", "refresh", "refresh.start", "Refresh run started", {
        refreshRunId,
        runId: options?.runId,
      });

      const sourceResults: ConnectorFetchResult[] = [];
      const state = { degraded: false, errors: [] as string[] };

      for (const connector of connectorRegistry.connectors) {
        const result = await fetchWithRetry(connector, context, retryOptionsForConnector(connector));
        sourceResults.push(result);
        await refreshRepository.upsertSourceStatus(toSourceRecord(result));

        applyConnectorFailurePolicy(connector, result.ok, state, result.error);
      }

      const p0Failed = sourceResults.some(
        (result) => result.priority === "P0" && !result.ok,
      );

      if (p0Failed) {
        incrementCounter("refresh.run.failure");
        const durationMs = Date.now() - refreshStarted;
        recordHistogram("refresh.run.duration_ms", durationMs, { status: "failed" });
        recordTrace({
          component: "refresh",
          name: "refresh.run",
          startedAt: new Date(refreshStarted).toISOString(),
          durationMs,
          status: "error",
          correlationId: correlation?.correlationId,
          runId: correlation?.runId ?? options?.runId,
          failureClass: classifyFailure(state.errors.join("; ")),
          metadata: { refreshRunId, errors: state.errors },
        });
        structuredLog("error", "refresh", "refresh.failed", "Refresh failed — P0 source unavailable", {
          refreshRunId,
          errors: state.errors,
        });
        await refreshRepository.completeRun(refreshRunId, {
          status: "failed",
          degraded: state.degraded,
          sourceResults: sourceResults.map(toSourceRecord),
          errors: state.errors,
        });
        return {
          ok: false,
          errors: state.errors,
          sourceResults: sourceResults.map(toSourceRecord),
          refreshRunId,
        };
      }

      const payload = mergeConnectorPayloads(sourceResults);
      if (!payload) {
        state.errors.push("No valid slate payload from connectors");
        incrementCounter("refresh.run.failure");
        const durationMs = Date.now() - refreshStarted;
        recordHistogram("refresh.run.duration_ms", durationMs, { status: "failed" });
        await refreshRepository.completeRun(refreshRunId, {
          status: "failed",
          degraded: state.degraded,
          sourceResults: sourceResults.map(toSourceRecord),
          errors: state.errors,
        });
        return {
          ok: false,
          errors: state.errors,
          sourceResults: sourceResults.map(toSourceRecord),
          refreshRunId,
        };
      }

      const ingestStarted = Date.now();
      const slateId = await upsertSlatePayload(client, payload);
      setSlateMarketCache(slateId, payload.games);
      recordHistogram("database.operation.duration_ms", Date.now() - ingestStarted, {
        operation: "upsert_slate",
        status: "ok",
      });

      const validateStarted = Date.now();
      const validation = await ingestionService.validateActiveSlate({
        allowMissingProjections: state.degraded,
      });
      recordHistogram("database.operation.duration_ms", Date.now() - validateStarted, {
        operation: "validate_slate",
        status: validation.valid ? "ok" : "error",
      });

      if (!validation.valid) {
        incrementCounter("refresh.run.failure");
        const durationMs = Date.now() - refreshStarted;
        recordHistogram("refresh.run.duration_ms", durationMs, { status: "failed" });
        await refreshRepository.completeRun(refreshRunId, {
          slateId,
          status: "failed",
          degraded: state.degraded,
          sourceResults: sourceResults.map(toSourceRecord),
          errors: validation.errors,
        });
        return {
          ok: false,
          errors: validation.errors,
          sourceResults: sourceResults.map(toSourceRecord),
          refreshRunId,
        };
      }

      const status = state.degraded ? "degraded" : "complete";
      if (state.degraded) {
        incrementCounter("refresh.run.degraded");
      } else {
        incrementCounter("refresh.run.success");
      }

      const durationMs = Date.now() - refreshStarted;
      recordHistogram("refresh.run.duration_ms", durationMs, { status });
      recordTrace({
        component: "refresh",
        name: "refresh.run",
        startedAt: new Date(refreshStarted).toISOString(),
        durationMs,
        status: state.degraded ? "degraded" : "ok",
        correlationId: correlation?.correlationId,
        runId: correlation?.runId ?? options?.runId,
        metadata: { refreshRunId, slateId, degraded: state.degraded },
      });
      structuredLog(
        state.degraded ? "warn" : "info",
        "refresh",
        state.degraded ? "refresh.degraded" : "refresh.complete",
        state.degraded ? "Refresh completed with degraded sources" : "Refresh completed",
        { refreshRunId, slateId, durationMs },
      );

      await refreshRepository.completeRun(refreshRunId, {
        slateId,
        status,
        degraded: state.degraded,
        sourceResults: sourceResults.map(toSourceRecord),
      });

      return {
        ok: true,
        slateId,
        degraded: state.degraded,
        sourceResults: sourceResults.map(toSourceRecord),
        refreshRunId,
      };
    },
  };
}

export type RefreshService = ReturnType<typeof createRefreshService>;
