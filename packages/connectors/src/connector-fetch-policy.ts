import type { DataConnector, RetryOptions } from "./types";

/** P2 optional enrichment — single attempt, no degrade unless visibility enabled. */
export function retryOptionsForConnector(connector: DataConnector): RetryOptions {
  if (connector.priority === "P2") {
    return { maxAttempts: 1 };
  }
  return {};
}

export function applyConnectorFailurePolicy(
  connector: DataConnector,
  ok: boolean,
  state: { degraded: boolean; errors: string[] },
  error?: string,
): void {
  if (ok) return;

  if (connector.priority === "P0") {
    state.errors.push(`${connector.sourceId}: ${error ?? "failed"}`);
    return;
  }

  if (connector.priority === "P1") {
    state.degraded = true;
    return;
  }

  if (connector.priority === "P2" && process.env.CONNECTOR_P2_VISIBILITY === "1") {
    state.degraded = true;
  }
}
