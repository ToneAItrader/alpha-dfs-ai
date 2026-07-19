import { AsyncLocalStorage } from "node:async_hooks";
import { randomBytes } from "node:crypto";

export type CorrelationContext = {
  correlationId: string;
  runId?: string;
};

const storage = new AsyncLocalStorage<CorrelationContext>();

export function generateCorrelationId(prefix = "corr"): string {
  return `${prefix}-${randomBytes(8).toString("hex")}`;
}

export function getCorrelationContext(): CorrelationContext | undefined {
  return storage.getStore();
}

export function getCorrelationId(): string | undefined {
  return storage.getStore()?.correlationId;
}

export function getRunId(): string | undefined {
  return storage.getStore()?.runId;
}

export function runWithCorrelationContext<T>(
  context: CorrelationContext,
  fn: () => T,
): T {
  return storage.run(context, fn);
}

export async function runWithCorrelationContextAsync<T>(
  context: CorrelationContext,
  fn: () => Promise<T>,
): Promise<T> {
  return storage.run(context, fn);
}
