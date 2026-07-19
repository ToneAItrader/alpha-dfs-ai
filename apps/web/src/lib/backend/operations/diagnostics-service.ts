import {
  getCircuitState,
  getMetricsSnapshot,
  getRecentLogs,
  getRecentTraces,
  getOperationalConfig,
} from "@alpha-dfs/observability";
import { getProviderCredentialStatus } from "@alpha-dfs/connectors";

export function getMetricsResponse() {
  return getMetricsSnapshot();
}

export function getDiagnosticsResponse() {
  const config = getOperationalConfig();
  const providers = getProviderCredentialStatus();
  const sourceIds = ["draftkings-slate", "projection-feed"];

  return {
    capturedAt: new Date().toISOString(),
    metrics: getMetricsSnapshot(),
    traces: getRecentTraces(20),
    logs: getRecentLogs(20),
    circuits: sourceIds.map((sourceId) => ({
      sourceId,
      ...getCircuitState(sourceId),
    })),
    config: {
      pipelineTimeoutMs: config.pipelineTimeoutMs,
      connectorTimeoutMs: config.connectorTimeoutMs,
      providerHttpTimeoutMs: config.providerHttpTimeoutMs,
      connectorMaxRetries: config.connectorMaxRetries,
      freshnessThresholdMs: config.freshnessThresholdMs,
    },
    providers,
  };
}
