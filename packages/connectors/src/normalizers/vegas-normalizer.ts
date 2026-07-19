import type { SlateGamePayload } from "../types";
import type { VegasOddsExportRecord, VegasOddsFeedRecord } from "../providers/provider-types";

/** Normalize Vegas odds feed records into game merge payloads. */
export function normalizeVegasOddsFeed(records: VegasOddsFeedRecord[]): SlateGamePayload[] {
  return records.map((record) => ({
    home: record.home.trim().toUpperCase(),
    away: record.away.trim().toUpperCase(),
    spread: record.spread,
    total: record.total,
    impliedHomeTotal: record.impliedHomeTotal,
    impliedAwayTotal: record.impliedAwayTotal,
    lineMovement: record.lineMovement,
  }));
}

export function normalizeVegasOddsExport(exportRecord: VegasOddsExportRecord): VegasOddsFeedRecord[] {
  if (!exportRecord.games?.length) {
    throw new Error("Vegas odds export contains no records");
  }
  return exportRecord.games;
}
