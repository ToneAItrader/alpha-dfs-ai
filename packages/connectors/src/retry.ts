import type { ConnectorFetchResult, DataConnector, RetryOptions } from "./types";
import {
  CircuitOpenError,
  classifyFailure,
  getOperationalConfig,
  incrementCounter,
  recordHistogram,
  structuredLog,
  withCircuitBreaker,
  withTimeout,
} from "@alpha-dfs/observability";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Exponential backoff retry wrapper for connector fetch with observability. */
export async function fetchWithRetry(
  connector: DataConnector,
  context: Parameters<DataConnector["fetch"]>[0],
  options: RetryOptions = {},
): Promise<ConnectorFetchResult> {
  const config = getOperationalConfig();
  const maxAttempts = options.maxAttempts ?? config.connectorMaxRetries;
  const baseDelayMs = options.baseDelayMs ?? config.connectorRetryBaseMs;
  let lastResult: ConnectorFetchResult | undefined;

  incrementCounter("connector.fetch.total", { source_id: connector.sourceId });

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const started = Date.now();
    try {
      const result = await withCircuitBreaker(connector.sourceId, () =>
        withTimeout(
          `connector.${connector.sourceId}`,
          config.connectorTimeoutMs,
          () => connector.fetch(context),
        ),
      );

      const durationMs = Date.now() - started;
      recordHistogram("connector.fetch.duration_ms", durationMs, {
        source_id: connector.sourceId,
        status: result.ok ? "ok" : "error",
      });

      if (result.ok) {
        incrementCounter("connector.fetch.success", { source_id: connector.sourceId });
        structuredLog("info", "connector", "connector.fetch.success", `${connector.sourceId} fetched`, {
          sourceId: connector.sourceId,
          attempt,
          durationMs,
          recordCount: result.recordCount,
        });
        return { ...result, attempts: attempt, durationMs };
      }

      lastResult = { ...result, attempts: attempt, durationMs };
      structuredLog("warn", "connector", "connector.fetch.retry", `${connector.sourceId} attempt failed`, {
        sourceId: connector.sourceId,
        attempt,
        error: result.error,
        failureClass: classifyFailure(result.error ?? "failed"),
      });
    } catch (error) {
      const durationMs = Date.now() - started;
      lastResult = {
        sourceId: connector.sourceId,
        priority: connector.priority,
        ok: false,
        capturedAt: new Date().toISOString(),
        recordCount: 0,
        durationMs,
        attempts: attempt,
        error: error instanceof Error ? error.message : "Connector fetch failed",
      };
      structuredLog("warn", "connector", "connector.fetch.error", `${connector.sourceId} threw`, {
        sourceId: connector.sourceId,
        attempt,
        failureClass: classifyFailure(error),
        error: lastResult.error,
      });

      if (error instanceof CircuitOpenError || classifyFailure(error) === "circuit_open") {
        break;
      }
    }

    if (attempt < maxAttempts) {
      await sleep(baseDelayMs * 2 ** (attempt - 1));
    }
  }

  incrementCounter("connector.fetch.failure", { source_id: connector.sourceId });

  return (
    lastResult ?? {
      sourceId: connector.sourceId,
      priority: connector.priority,
      ok: false,
      capturedAt: new Date().toISOString(),
      recordCount: 0,
      durationMs: 0,
      attempts: maxAttempts,
      error: "Connector failed after retries",
    }
  );
}
