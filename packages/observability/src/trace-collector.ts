import { getOperationalConfig } from "./operational-config";

export type TraceComponent = "pipeline" | "connector" | "engine" | "refresh" | "database" | "health";
export type TraceStatus = "ok" | "error" | "degraded";

export type TraceSpan = {
  spanId: string;
  correlationId?: string;
  runId?: string;
  component: TraceComponent;
  name: string;
  startedAt: string;
  durationMs: number;
  status: TraceStatus;
  failureClass?: string;
  metadata?: Record<string, unknown>;
};

const traces: TraceSpan[] = [];
let spanCounter = 0;

function nextSpanId(): string {
  spanCounter += 1;
  return `span-${spanCounter}`;
}

export function recordTrace(span: Omit<TraceSpan, "spanId"> & { spanId?: string }): TraceSpan {
  const record: TraceSpan = { spanId: span.spanId ?? nextSpanId(), ...span };
  traces.unshift(record);
  const limit = getOperationalConfig().traceRetentionCount;
  if (traces.length > limit) {
    traces.length = limit;
  }
  return record;
}

export function getRecentTraces(limit = 20): TraceSpan[] {
  return traces.slice(0, limit);
}

export function resetTraces(): void {
  traces.length = 0;
  spanCounter = 0;
}

export async function traceAsync<T>(
  component: TraceComponent,
  name: string,
  metadata: Record<string, unknown> | undefined,
  fn: () => Promise<T>,
  onError?: (error: unknown) => TraceStatus,
): Promise<T> {
  const started = Date.now();
  const startedAt = new Date().toISOString();
  try {
    const result = await fn();
    recordTrace({
      component,
      name,
      startedAt,
      durationMs: Date.now() - started,
      status: "ok",
      correlationId: metadata?.correlationId as string | undefined,
      runId: metadata?.runId as string | undefined,
      metadata,
    });
    return result;
  } catch (error) {
    const status = onError?.(error) ?? "error";
    recordTrace({
      component,
      name,
      startedAt,
      durationMs: Date.now() - started,
      status,
      failureClass: error instanceof Error ? error.name : "Error",
      correlationId: metadata?.correlationId as string | undefined,
      runId: metadata?.runId as string | undefined,
      metadata: { ...metadata, error: error instanceof Error ? error.message : String(error) },
    });
    throw error;
  }
}
