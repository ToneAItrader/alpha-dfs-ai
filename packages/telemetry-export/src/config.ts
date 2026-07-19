import type { MetricsSnapshot, StructuredLogEntry, TraceSpan } from "@alpha-dfs/observability";

export type TelemetryExportMode = "none" | "file" | "otlp";

export type TelemetryExportConfig = {
  mode: TelemetryExportMode;
  intervalMs: number;
  filePath?: string;
  otlpEndpoint?: string;
  otlpHeaders?: Record<string, string>;
};

export type TelemetryExportBatch = {
  exportedAt: string;
  metrics: MetricsSnapshot;
  logs: StructuredLogEntry[];
  traces: TraceSpan[];
};

export function resolveTelemetryExportMode(value?: string): TelemetryExportMode {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "file" || normalized === "otlp") {
    return normalized;
  }
  return "none";
}

export function resolveTelemetryExportConfig(
  env: NodeJS.ProcessEnv = process.env,
): TelemetryExportConfig {
  const mode = resolveTelemetryExportMode(env.TELEMETRY_EXPORT_MODE);
  const intervalMs = Number(env.TELEMETRY_EXPORT_INTERVAL_MS ?? "30000");

  return {
    mode,
    intervalMs: Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 30_000,
    filePath: env.TELEMETRY_EXPORT_PATH,
    otlpEndpoint: env.TELEMETRY_EXPORT_OTLP_ENDPOINT,
    otlpHeaders: parseOptionalJsonRecord(env.TELEMETRY_EXPORT_OTLP_HEADERS),
  };
}

function parseOptionalJsonRecord(value?: string): Record<string, string> | undefined {
  if (!value?.trim()) return undefined;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return undefined;
    }
    const headers: Record<string, string> = {};
    for (const [key, headerValue] of Object.entries(parsed)) {
      if (typeof headerValue === "string") {
        headers[key] = headerValue;
      }
    }
    return headers;
  } catch {
    return undefined;
  }
}

export function validateTelemetryExportConfig(config: TelemetryExportConfig): string[] {
  const errors: string[] = [];
  if (config.mode === "file" && !config.filePath?.trim()) {
    errors.push("TELEMETRY_EXPORT_PATH is required when TELEMETRY_EXPORT_MODE=file");
  }
  if (config.mode === "otlp" && !config.otlpEndpoint?.trim()) {
    errors.push("TELEMETRY_EXPORT_OTLP_ENDPOINT is required when TELEMETRY_EXPORT_MODE=otlp");
  }
  return errors;
}
