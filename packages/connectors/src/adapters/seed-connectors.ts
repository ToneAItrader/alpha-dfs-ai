import { readJsonFile } from "../auth/provider-credentials";
import { connectorFixturePath } from "../fixtures/fixture-paths";
import { normalizeDraftKingsExport } from "../normalizers/draftkings-normalizer";
import {
  normalizeInjuryExport,
  normalizeInjuryFeed,
} from "../normalizers/injury-normalizer";
import {
  normalizeProjectionExport,
  normalizeProjectionFeed,
} from "../normalizers/projection-normalizer";
import {
  normalizeVegasOddsExport,
  normalizeVegasOddsFeed,
} from "../normalizers/vegas-normalizer";
import {
  normalizeWeatherExport,
  normalizeWeatherFeed,
} from "../normalizers/weather-normalizer";
import type {
  DraftKingsExportRecord,
  InjuryExportRecord,
  ProjectionExportRecord,
  VegasOddsExportRecord,
  WeatherExportRecord,
} from "../providers/provider-types";
import type { ConnectorContext, ConnectorFetchResult, DataConnector } from "../types";

async function loadSeedDraftKingsPayload() {
  const record = await readJsonFile<DraftKingsExportRecord>(
    connectorFixturePath("draftkings-classic-export.json"),
  );
  return normalizeDraftKingsExport(record);
}

async function loadSeedProjectionPlayers() {
  const record = await readJsonFile<ProjectionExportRecord>(
    connectorFixturePath("projection-export.json"),
  );
  const feedRecords = normalizeProjectionExport(record);
  return normalizeProjectionFeed(feedRecords);
}

async function loadSeedInjuryPlayers() {
  const record = await readJsonFile<InjuryExportRecord>(connectorFixturePath("injury-export.json"));
  const feedRecords = normalizeInjuryExport(record);
  return normalizeInjuryFeed(feedRecords);
}

async function loadSeedVegasOddsGames() {
  const record = await readJsonFile<VegasOddsExportRecord>(
    connectorFixturePath("vegas-odds-export.json"),
  );
  const feedRecords = normalizeVegasOddsExport(record);
  return normalizeVegasOddsFeed(feedRecords);
}

async function loadSeedWeatherGames() {
  const record = await readJsonFile<WeatherExportRecord>(
    connectorFixturePath("weather-export.json"),
  );
  const feedRecords = normalizeWeatherExport(record);
  return normalizeWeatherFeed(feedRecords);
}

/** P0 DraftKings slate connector — v1 seed-backed via package fixtures. */
export function createDraftKingsSlateConnector(): DataConnector {
  return {
    sourceId: "draftkings-slate",
    priority: "P0",
    description: "DraftKings NFL Classic slate pool and salaries",
    async fetch(_context: ConnectorContext): Promise<ConnectorFetchResult> {
      const started = Date.now();
      const payload = await loadSeedDraftKingsPayload();
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

/** P1 projection feed connector — v1 enriches from fixture projections. */
export function createProjectionFeedConnector(): DataConnector {
  return {
    sourceId: "projection-feed",
    priority: "P1",
    description: "Player projection, floor, ceiling, and ownership estimates",
    async fetch(_context: ConnectorContext): Promise<ConnectorFetchResult> {
      const started = Date.now();
      const players = await loadSeedProjectionPlayers();

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

/** P1 NFL injury feed connector — v1 enriches from fixture injury export. */
export function createInjuryFeedConnector(): DataConnector {
  return {
    sourceId: "nfl-injury-feed",
    priority: "P1",
    description: "Injury designation, practice status, and game status",
    async fetch(_context: ConnectorContext): Promise<ConnectorFetchResult> {
      const started = Date.now();
      const players = await loadSeedInjuryPlayers();

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

/** P1 Vegas odds feed connector — v1 enriches from fixture odds export. */
export function createVegasOddsFeedConnector(): DataConnector {
  return {
    sourceId: "vegas-odds-feed",
    priority: "P1",
    description: "Vegas spreads, totals, and implied team totals",
    async fetch(_context: ConnectorContext): Promise<ConnectorFetchResult> {
      const started = Date.now();
      const games = await loadSeedVegasOddsGames();

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

/** P2 weather feed connector — optional enrichment from fixture weather export. */
export function createWeatherFeedConnector(): DataConnector {
  return {
    sourceId: "weather-feed",
    priority: "P2",
    description: "Outdoor game temperature, wind, and precipitation probability",
    async fetch(_context: ConnectorContext): Promise<ConnectorFetchResult> {
      const started = Date.now();
      const games = await loadSeedWeatherGames();

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

/** Test-only connector that always fails. */
export function createFailingConnector(
  sourceId = "failing-source",
  priority: "P0" | "P1" | "P2" = "P0",
): DataConnector {
  return {
    sourceId,
    priority,
    description: "Intentional failure for resilience tests",
    async fetch(): Promise<ConnectorFetchResult> {
      throw new Error(`${sourceId} unavailable`);
    },
  };
}
