export type OperationalConfig = {
  pipelineTimeoutMs: number;
  connectorTimeoutMs: number;
  providerHttpTimeoutMs: number;
  connectorMaxRetries: number;
  connectorRetryBaseMs: number;
  circuitBreakerThreshold: number;
  circuitBreakerResetMs: number;
  metricsRetentionCount: number;
  traceRetentionCount: number;
  logRetentionCount: number;
  freshnessThresholdMs: number;
};

function readInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

let cachedConfig: OperationalConfig | null = null;

export function getOperationalConfig(): OperationalConfig {
  if (!cachedConfig) {
    cachedConfig = {
      pipelineTimeoutMs: readInt("PIPELINE_TIMEOUT_MS", 120_000),
      connectorTimeoutMs: readInt("CONNECTOR_TIMEOUT_MS", 15_000),
      providerHttpTimeoutMs: readInt("PROVIDER_HTTP_TIMEOUT_MS", 15_000),
      connectorMaxRetries: readInt("CONNECTOR_MAX_RETRIES", 3),
      connectorRetryBaseMs: readInt("CONNECTOR_RETRY_BASE_MS", 250),
      circuitBreakerThreshold: readInt("CIRCUIT_BREAKER_THRESHOLD", 5),
      circuitBreakerResetMs: readInt("CIRCUIT_BREAKER_RESET_MS", 60_000),
      metricsRetentionCount: readInt("METRICS_RETENTION_COUNT", 500),
      traceRetentionCount: readInt("TRACE_RETENTION_COUNT", 100),
      logRetentionCount: readInt("LOG_RETENTION_COUNT", 100),
      freshnessThresholdMs: readInt("FRESHNESS_THRESHOLD_MS", 86_400_000),
    };
  }
  return cachedConfig;
}

export function resetOperationalConfig(): void {
  cachedConfig = null;
}

export function isFeatureEnabled(name: string, defaultValue = true): boolean {
  const key = `FEATURE_${name.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value === "1" || value.toLowerCase() === "true";
}
