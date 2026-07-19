import {
  loadProjectionCredentials,
  readJsonFile,
} from "../auth/provider-credentials";
import { providerHttpGet } from "../http/provider-http-client";
import {
  normalizeProjectionExport,
  normalizeProjectionFeed,
} from "../normalizers/projection-normalizer";
import type { ProjectionExportRecord } from "../providers/provider-types";
import type { ConnectorContext, ConnectorFetchResult, DataConnector } from "../types";

async function loadProjectionRecords() {
  const credentials = loadProjectionCredentials();

  if (credentials.mode === "file") {
    const exportRecord = await readJsonFile<ProjectionExportRecord>(credentials.exportPath);
    return normalizeProjectionExport(exportRecord);
  }

  if (credentials.mode === "api") {
    const exportRecord = await providerHttpGet<ProjectionExportRecord>({
      providerId: "projection-feed",
      url: credentials.apiUrl,
      apiKey: credentials.apiKey,
    });
    return normalizeProjectionExport(exportRecord);
  }

  throw new Error(
    "Projection provider not configured — set PROJECTION_EXPORT_PATH or PROJECTION_API_URL + PROJECTION_API_KEY",
  );
}

/** P1 live projection provider — file export or REST API. */
export function createProjectionLiveConnector(): DataConnector {
  return {
    sourceId: "projection-feed",
    priority: "P1",
    description: "Live projection feed via export file or API",
    async fetch(_context: ConnectorContext): Promise<ConnectorFetchResult> {
      const started = Date.now();
      const records = await loadProjectionRecords();
      const players = normalizeProjectionFeed(records);

      return {
        sourceId: "projection-feed",
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
