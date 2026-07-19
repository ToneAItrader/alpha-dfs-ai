import {
  loadDraftKingsCredentials,
  readJsonFile,
} from "../auth/provider-credentials";
import { providerHttpGet } from "../http/provider-http-client";
import { normalizeDraftKingsExport } from "../normalizers/draftkings-normalizer";
import type { DraftKingsExportRecord } from "../providers/provider-types";
import type { ConnectorContext, ConnectorFetchResult, DataConnector } from "../types";

async function loadDraftKingsRecord(): Promise<DraftKingsExportRecord> {
  const credentials = loadDraftKingsCredentials();

  if (credentials.mode === "file") {
    return readJsonFile<DraftKingsExportRecord>(credentials.exportPath);
  }

  if (credentials.mode === "api") {
    return providerHttpGet<DraftKingsExportRecord>({
      providerId: "draftkings-slate",
      url: credentials.apiUrl,
      apiKey: credentials.apiKey,
    });
  }

  throw new Error(
    "DraftKings provider not configured — set DRAFTKINGS_EXPORT_PATH or DRAFTKINGS_API_URL + DRAFTKINGS_API_KEY",
  );
}

/** P0 live DraftKings provider — file export or REST API. */
export function createDraftKingsLiveConnector(): DataConnector {
  return {
    sourceId: "draftkings-slate",
    priority: "P0",
    description: "Live DraftKings NFL Classic slate via export file or API",
    async fetch(_context: ConnectorContext): Promise<ConnectorFetchResult> {
      const started = Date.now();
      const record = await loadDraftKingsRecord();
      const payload = normalizeDraftKingsExport(record);

      return {
        sourceId: "draftkings-slate",
        priority: "P0",
        ok: true,
        capturedAt: new Date().toISOString(),
        recordCount: payload.players.length,
        durationMs: Date.now() - started,
        attempts: 1,
        payload,
      };
    },
  };
}
