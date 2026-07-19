import {
  loadVegasOddsCredentials,
  readJsonFile,
} from "../auth/provider-credentials";
import { providerHttpGet } from "../http/provider-http-client";
import {
  normalizeVegasOddsExport,
  normalizeVegasOddsFeed,
} from "../normalizers/vegas-normalizer";
import type { VegasOddsExportRecord } from "../providers/provider-types";
import type { ConnectorContext, ConnectorFetchResult, DataConnector } from "../types";

async function loadVegasOddsRecords() {
  const credentials = loadVegasOddsCredentials();

  if (credentials.mode === "file") {
    const exportRecord = await readJsonFile<VegasOddsExportRecord>(credentials.exportPath);
    return normalizeVegasOddsExport(exportRecord);
  }

  if (credentials.mode === "api") {
    const exportRecord = await providerHttpGet<VegasOddsExportRecord>({
      providerId: "vegas-odds-feed",
      url: credentials.apiUrl,
      apiKey: credentials.apiKey,
    });
    return normalizeVegasOddsExport(exportRecord);
  }

  throw new Error(
    "Vegas odds provider not configured — set VEGAS_ODDS_EXPORT_PATH or VEGAS_ODDS_API_URL + VEGAS_ODDS_API_KEY",
  );
}

/** P1 live Vegas odds provider — file export or REST API. */
export function createVegasOddsLiveConnector(): DataConnector {
  return {
    sourceId: "vegas-odds-feed",
    priority: "P1",
    description: "Vegas spreads, totals, and implied team totals",
    async fetch(_context: ConnectorContext): Promise<ConnectorFetchResult> {
      const started = Date.now();
      const records = await loadVegasOddsRecords();
      const games = normalizeVegasOddsFeed(records);

      return {
        sourceId: "vegas-odds-feed",
        priority: "P1",
        ok: true,
        capturedAt: new Date().toISOString(),
        recordCount: games.length,
        durationMs: Date.now() - started,
        attempts: 1,
        payload: { games },
      };
    },
  };
}
