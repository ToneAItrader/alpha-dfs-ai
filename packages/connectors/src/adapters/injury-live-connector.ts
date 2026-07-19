import {
  loadInjuryCredentials,
  readJsonFile,
} from "../auth/provider-credentials";
import { providerHttpGet } from "../http/provider-http-client";
import {
  normalizeInjuryExport,
  normalizeInjuryFeed,
} from "../normalizers/injury-normalizer";
import type { InjuryExportRecord } from "../providers/provider-types";
import type { ConnectorContext, ConnectorFetchResult, DataConnector } from "../types";

async function loadInjuryRecords() {
  const credentials = loadInjuryCredentials();

  if (credentials.mode === "file") {
    const exportRecord = await readJsonFile<InjuryExportRecord>(credentials.exportPath);
    return normalizeInjuryExport(exportRecord);
  }

  if (credentials.mode === "api") {
    const exportRecord = await providerHttpGet<InjuryExportRecord>({
      providerId: "nfl-injury-feed",
      url: credentials.apiUrl,
      apiKey: credentials.apiKey,
    });
    return normalizeInjuryExport(exportRecord);
  }

  throw new Error(
    "Injury provider not configured — set INJURY_EXPORT_PATH or INJURY_API_URL + INJURY_API_KEY",
  );
}

/** P1 live NFL injury provider — file export or REST API. */
export function createInjuryLiveConnector(): DataConnector {
  return {
    sourceId: "nfl-injury-feed",
    priority: "P1",
    description: "NFL injury designation, practice status, and game status",
    async fetch(_context: ConnectorContext): Promise<ConnectorFetchResult> {
      const started = Date.now();
      const records = await loadInjuryRecords();
      const players = normalizeInjuryFeed(records);

      return {
        sourceId: "nfl-injury-feed",
        priority: "P1",
        ok: true,
        capturedAt: new Date().toISOString(),
        recordCount: players.length,
        durationMs: Date.now() - started,
        attempts: 1,
        payload: { players },
      };
    },
  };
}
