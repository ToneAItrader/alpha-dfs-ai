import { mergeConnectorPayloads } from "./merge-slate-payload";
import {
  applyConnectorFailurePolicy,
  retryOptionsForConnector,
} from "./connector-fetch-policy";
import { fetchWithRetry } from "./retry";
import type { ConnectorContext, ConnectorFetchResult, ConnectorRegistry } from "./types";

export type FetchConnectorsOnlyResult =
  | {
      ok: true;
      degraded: boolean;
      sourceResults: ConnectorFetchResult[];
      mergedPayload: SlateConnectorPayload;
    }
  | {
      ok: false;
      errors: string[];
      sourceResults: ConnectorFetchResult[];
    };

/** Fetch all registry connectors without any database persistence (ADR-005). */
export async function fetchConnectorsOnly(
  registry: ConnectorRegistry,
  context?: Partial<ConnectorContext>,
): Promise<FetchConnectorsOnlyResult> {
  const fetchContext: ConnectorContext = {
    requestedAt: context?.requestedAt ?? new Date().toISOString(),
    runId: context?.runId,
    slateId: context?.slateId,
  };

  const sourceResults: ConnectorFetchResult[] = [];
  const state = { degraded: false, errors: [] as string[] };

  for (const connector of registry.connectors) {
    const result = await fetchWithRetry(connector, fetchContext, retryOptionsForConnector(connector));
    sourceResults.push(result);

    applyConnectorFailurePolicy(connector, result.ok, state, result.error);
  }

  const p0Failed = sourceResults.some((result) => result.priority === "P0" && !result.ok);
  if (p0Failed) {
    return { ok: false, errors: state.errors, sourceResults };
  }

  const mergedPayload = mergeConnectorPayloads(sourceResults);
  if (!mergedPayload) {
    return {
      ok: false,
      errors: ["No valid slate payload from connectors"],
      sourceResults,
    };
  }

  return {
    ok: true,
    degraded: state.degraded,
    sourceResults,
    mergedPayload,
  };
}
