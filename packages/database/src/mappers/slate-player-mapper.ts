/** Maps database slate player rows to evidence engine input shape. */
import { decodeInjuryStatus } from "./injury-status-codec";

export type SlatePlayerInput = {
  slatePlayerId: string;
  name: string;
  position: string;
  team: string;
  opponent: string;
  salary: number;
  projection: number;
  floor: number;
  ceiling: number;
  injuryStatus: "healthy" | "questionable" | "doubtful" | "out" | "unknown";
  practiceStatus?: string;
  gameStatus?: string;
  ownershipProjected: number;
  domains: {
    statistical: boolean;
    injury: boolean;
    expert: boolean;
    market: boolean;
    weather: boolean;
    community: boolean;
  };
};

type DbSlatePlayer = {
  id: string;
  opponentAbbr: string;
  salary: number;
  player: { firstName: string; lastName: string; position: string };
  team: { abbreviation: string };
  projection: {
    projectedPoints: number;
    floor: number;
    ceiling: number;
    ownershipProjected: number | null;
  } | null;
  injuryReport: { status: string } | null;
  evidenceDomains: {
    statistical: boolean;
    injury: boolean;
    expert: boolean;
    market: boolean;
    weather: boolean;
    community: boolean;
  } | null;
};

export function mapSlatePlayerToInput(row: DbSlatePlayer): SlatePlayerInput {
  const decoded = decodeInjuryStatus(row.injuryReport?.status ?? "unknown");
  const injury = decoded.injuryStatus;
  const injuryStatus = (
    ["healthy", "questionable", "doubtful", "out", "unknown"].includes(injury)
      ? injury
      : "unknown"
  ) as SlatePlayerInput["injuryStatus"];

  return {
    slatePlayerId: row.id,
    name: `${row.player.firstName} ${row.player.lastName}`.trim(),
    position: row.player.position,
    team: row.team.abbreviation,
    opponent: row.opponentAbbr,
    salary: row.salary,
    projection: row.projection?.projectedPoints ?? 0,
    floor: row.projection?.floor ?? 0,
    ceiling: row.projection?.ceiling ?? 0,
    injuryStatus,
    practiceStatus: decoded.practiceStatus,
    gameStatus: decoded.gameStatus,
    ownershipProjected: row.projection?.ownershipProjected ?? 0,
    domains: row.evidenceDomains ?? {
      statistical: false,
      injury: false,
      expert: false,
      market: false,
      weather: false,
      community: false,
    },
  };
}

export function mapSlatePlayerInputsForPortfolio(players: SlatePlayerInput[]) {
  return players.map((player) => ({
    slatePlayerId: player.slatePlayerId,
    name: player.name,
    position: player.position,
    team: player.team,
    salary: player.salary,
    projection: player.projection,
    floor: player.floor,
    ceiling: player.ceiling,
    ownershipEstimate: player.ownershipProjected,
    confidenceScore: 0,
    confidenceTier: "moderate" as const,
  }));
}
