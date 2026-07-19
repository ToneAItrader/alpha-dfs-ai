import {
  getMetricsSnapshot,
  getRecentLogs,
  getRecentTraces,
} from "@alpha-dfs/observability";
import type { TelemetryExportBatch } from "./config";

export function collectTelemetryExportBatch(exportedAt = new Date()): TelemetryExportBatch {
  return {
    exportedAt: exportedAt.toISOString(),
    metrics: getMetricsSnapshot(),
    logs: getRecentLogs(),
    traces: getRecentTraces(),
  };
}
