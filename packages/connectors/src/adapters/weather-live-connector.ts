import {
  loadWeatherCredentials,
  readJsonFile,
} from "../auth/provider-credentials";
import { providerHttpGet } from "../http/provider-http-client";
import {
  normalizeWeatherExport,
  normalizeWeatherFeed,
} from "../normalizers/weather-normalizer";
import type { WeatherExportRecord } from "../providers/provider-types";
import type { ConnectorContext, ConnectorFetchResult, DataConnector } from "../types";

async function loadWeatherRecords() {
  const credentials = loadWeatherCredentials();

  if (credentials.mode === "file") {
    const exportRecord = await readJsonFile<WeatherExportRecord>(credentials.exportPath);
    return normalizeWeatherExport(exportRecord);
  }

  if (credentials.mode === "api") {
    const exportRecord = await providerHttpGet<WeatherExportRecord>({
      providerId: "weather-feed",
      url: credentials.apiUrl,
      apiKey: credentials.apiKey,
    });
    return normalizeWeatherExport(exportRecord);
  }

  throw new Error(
    "Weather provider not configured — set WEATHER_EXPORT_PATH or WEATHER_API_URL + WEATHER_API_KEY",
  );
}

/** P2 live weather provider — file export or REST API. */
export function createWeatherLiveConnector(): DataConnector {
  return {
    sourceId: "weather-feed",
    priority: "P2",
    description: "Outdoor game temperature, wind, and precipitation probability",
    async fetch(_context: ConnectorContext): Promise<ConnectorFetchResult> {
      const started = Date.now();
      const records = await loadWeatherRecords();
      const games = normalizeWeatherFeed(records);

      return {
        sourceId: "weather-feed",
        priority: "P2",
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
