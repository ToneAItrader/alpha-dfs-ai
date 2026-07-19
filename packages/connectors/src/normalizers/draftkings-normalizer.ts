import type { SlateConnectorPayload, SlatePlayerPayload } from "../types";
import type { DraftKingsExportRecord } from "../providers/provider-types";

const VALID_INJURY = new Set(["healthy", "questionable", "doubtful", "out", "unknown"]);

function normalizeInjury(value: string | undefined): string {
  const normalized = (value ?? "unknown").toLowerCase();
  return VALID_INJURY.has(normalized) ? normalized : "unknown";
}

function defaultDomains(hasInjury: boolean): SlatePlayerPayload["domains"] {
  return {
    statistical: true,
    injury: hasInjury,
    expert: false,
    market: true,
    weather: true,
    community: false,
  };
}

/** Normalize DraftKings export/API payload into connector model. */
export function normalizeDraftKingsExport(record: DraftKingsExportRecord): SlateConnectorPayload {
  if (!record.players?.length) {
    throw new Error("DraftKings export contains no players");
  }

  const players: SlatePlayerPayload[] = record.players.map((player) => {
    const injuryStatus = normalizeInjury(player.injuryStatus);
    return {
      externalId: String(player.playerId),
      name: player.displayName,
      position: player.position,
      team: player.teamAbbreviation,
      opponent: player.opponentAbbreviation,
      salary: player.salary,
      projection: 0,
      floor: 0,
      ceiling: 0,
      injuryStatus,
      ownershipProjected: 0,
      domains: defaultDomains(injuryStatus !== "unknown"),
    };
  });

  return {
    slate: {
      name: record.slateName,
      week: record.week,
      season: record.season,
      sport: record.sport ?? "nfl",
      platform: record.platform ?? "draftkings",
      slateType: record.slateType ?? "classic",
    },
    teams: record.teams,
    games: record.games,
    players,
  };
}
