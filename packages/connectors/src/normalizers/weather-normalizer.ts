import type { SlateGamePayload } from "../types";
import type { WeatherExportRecord, WeatherFeedRecord } from "../providers/provider-types";

/** Normalize weather feed records into game merge payloads. */
export function normalizeWeatherFeed(records: WeatherFeedRecord[]): SlateGamePayload[] {
  return records.map((record) => ({
    home: record.home.trim().toUpperCase(),
    away: record.away.trim().toUpperCase(),
    temperature: record.temperature,
    windMph: record.windMph,
    precipitationProbability: record.precipitationProbability,
    isDome: record.isDome,
  }));
}

export function normalizeWeatherExport(exportRecord: WeatherExportRecord): WeatherFeedRecord[] {
  if (!exportRecord.games?.length) {
    throw new Error("Weather export contains no records");
  }
  return exportRecord.games;
}
