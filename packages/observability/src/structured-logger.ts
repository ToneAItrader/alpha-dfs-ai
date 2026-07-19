import { getCorrelationContext } from "./correlation-context";
import { getOperationalConfig } from "./operational-config";

export type LogLevel = "info" | "warn" | "error";

export type StructuredLogEntry = {
  timestamp: string;
  level: LogLevel;
  component: string;
  event: string;
  message: string;
  correlationId?: string;
  runId?: string;
  context?: Record<string, unknown>;
};

const recentLogs: StructuredLogEntry[] = [];

export function structuredLog(
  level: LogLevel,
  component: string,
  event: string,
  message: string,
  context?: Record<string, unknown>,
): void {
  const correlation = getCorrelationContext();
  const entry: StructuredLogEntry = {
    timestamp: new Date().toISOString(),
    level,
    component,
    event,
    message,
    correlationId: correlation?.correlationId,
    runId: correlation?.runId,
    context,
  };

  recentLogs.unshift(entry);
  const limit = getOperationalConfig().logRetentionCount;
  if (recentLogs.length > limit) {
    recentLogs.length = limit;
  }

  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.info(line);
  }
}

export function getRecentLogs(limit = 20): StructuredLogEntry[] {
  return recentLogs.slice(0, limit);
}

export function resetStructuredLogs(): void {
  recentLogs.length = 0;
}
