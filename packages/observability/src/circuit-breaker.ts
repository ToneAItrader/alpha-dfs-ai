import { getOperationalConfig } from "./operational-config";
import { structuredLog } from "./structured-logger";

type CircuitState = {
  failures: number;
  openedAt?: number;
};

const circuits = new Map<string, CircuitState>();

export class CircuitOpenError extends Error {
  constructor(sourceId: string) {
    super(`Circuit open for ${sourceId}`);
    this.name = "CircuitOpenError";
  }
}

export function getCircuitState(sourceId: string): { open: boolean; failures: number } {
  const config = getOperationalConfig();
  const state = circuits.get(sourceId) ?? { failures: 0 };
  if (!state.openedAt) {
    return { open: false, failures: state.failures };
  }
  if (Date.now() - state.openedAt >= config.circuitBreakerResetMs) {
    circuits.set(sourceId, { failures: 0 });
    structuredLog("info", "circuit-breaker", "circuit.half_open", `Circuit reset for ${sourceId}`);
    return { open: false, failures: 0 };
  }
  return { open: true, failures: state.failures };
}

export function assertCircuitClosed(sourceId: string): void {
  if (getCircuitState(sourceId).open) {
    throw new CircuitOpenError(sourceId);
  }
}

export function recordCircuitSuccess(sourceId: string): void {
  circuits.set(sourceId, { failures: 0 });
}

export function recordCircuitFailure(sourceId: string): void {
  const config = getOperationalConfig();
  const state = circuits.get(sourceId) ?? { failures: 0 };
  const failures = state.failures + 1;
  if (failures >= config.circuitBreakerThreshold) {
    circuits.set(sourceId, { failures, openedAt: Date.now() });
    structuredLog("warn", "circuit-breaker", "circuit.open", `Circuit opened for ${sourceId}`, {
      failures,
    });
    return;
  }
  circuits.set(sourceId, { failures });
}

export function resetCircuits(): void {
  circuits.clear();
}

export async function withCircuitBreaker<T>(sourceId: string, fn: () => Promise<T>): Promise<T> {
  assertCircuitClosed(sourceId);
  try {
    const result = await fn();
    recordCircuitSuccess(sourceId);
    return result;
  } catch (error) {
    recordCircuitFailure(sourceId);
    throw error;
  }
}
