import type { SlatePlayerPayload } from "../types";
import type { ProjectionExportRecord, ProjectionFeedRecord } from "../providers/provider-types";

/** Normalize projection feed records into partial player payloads for merge. */
export function normalizeProjectionFeed(
  records: ProjectionFeedRecord[],
  basePlayers: SlatePlayerPayload[] = [],
): SlatePlayerPayload[] {
  const baseById = new Map(basePlayers.map((player) => [player.externalId, player]));

  return records.map((record) => {
    const existing = baseById.get(String(record.playerId));
    return {
      externalId: String(record.playerId),
      name: existing?.name ?? `Player ${record.playerId}`,
      position: existing?.position ?? "WR",
      team: existing?.team ?? "UNK",
      opponent: existing?.opponent ?? "UNK",
      salary: existing?.salary ?? 0,
      projection: record.projectedPoints,
      floor: record.floor,
      ceiling: record.ceiling,
      injuryStatus: existing?.injuryStatus ?? "unknown",
      ownershipProjected: record.ownershipProjected ?? existing?.ownershipProjected ?? 0,
      domains: {
        statistical: true,
        injury: existing?.domains.injury ?? false,
        expert: true,
        market: existing?.domains.market ?? false,
        weather: existing?.domains.weather ?? false,
        community: existing?.domains.community ?? false,
      },
    };
  });
}

export function normalizeProjectionExport(exportRecord: ProjectionExportRecord): ProjectionFeedRecord[] {
  if (!exportRecord.projections?.length) {
    throw new Error("Projection export contains no records");
  }
  return exportRecord.projections;
}
