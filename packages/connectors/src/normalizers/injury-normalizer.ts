import type { SlatePlayerPayload } from "../types";
import type { InjuryExportRecord, InjuryFeedRecord } from "../providers/provider-types";

function normalizeDesignation(value: string | undefined): string {
  const normalized = (value ?? "unknown").trim().toLowerCase();
  if (["healthy", "questionable", "doubtful", "out", "unknown"].includes(normalized)) {
    return normalized;
  }
  return "unknown";
}

/** Normalize injury feed records into partial player payloads for merge. */
export function normalizeInjuryFeed(
  records: InjuryFeedRecord[],
  basePlayers: SlatePlayerPayload[] = [],
): SlatePlayerPayload[] {
  const baseById = new Map(basePlayers.map((player) => [player.externalId, player]));

  return records.map((record) => {
    const existing = baseById.get(String(record.playerId));
    const injuryStatus = normalizeDesignation(record.injuryStatus);

    return {
      externalId: String(record.playerId),
      name: existing?.name ?? `Player ${record.playerId}`,
      position: existing?.position ?? "WR",
      team: existing?.team ?? "UNK",
      opponent: existing?.opponent ?? "UNK",
      salary: existing?.salary ?? 0,
      projection: existing?.projection ?? 0,
      floor: existing?.floor ?? 0,
      ceiling: existing?.ceiling ?? 0,
      injuryStatus,
      practiceStatus: record.practiceStatus?.trim().toLowerCase(),
      gameStatus: record.gameStatus?.trim().toLowerCase(),
      ownershipProjected: existing?.ownershipProjected ?? 0,
      domains: {
        statistical: existing?.domains.statistical ?? false,
        injury: true,
        expert: existing?.domains.expert ?? false,
        market: existing?.domains.market ?? false,
        weather: existing?.domains.weather ?? false,
        community: existing?.domains.community ?? false,
      },
    };
  });
}

export function normalizeInjuryExport(exportRecord: InjuryExportRecord): InjuryFeedRecord[] {
  if (!exportRecord.injuries?.length) {
    throw new Error("Injury export contains no records");
  }
  return exportRecord.injuries;
}
