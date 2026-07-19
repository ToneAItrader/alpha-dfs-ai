import {
  getRecentLogs,
  resetStructuredLogs,
  structuredLog,
  type LogLevel,
} from "@alpha-dfs/observability";

export type OperationalLogEntry = {
  level: LogLevel;
  event: string;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
};

/** Backward-compatible operational logger — delegates to structured diagnostics. */
export function operationalLog(
  level: LogLevel,
  event: string,
  message: string,
  context?: Record<string, unknown>,
): void {
  structuredLog(level, "operations", event, message, context);
}

export function getRecentOperationalLogs(limit = 20): OperationalLogEntry[] {
  return getRecentLogs(limit).map((entry) => ({
    level: entry.level,
    event: entry.event,
    message: entry.message,
    timestamp: entry.timestamp,
    context: entry.context,
  }));
}

export function resetOperationalLogs(): void {
  resetStructuredLogs();
}
