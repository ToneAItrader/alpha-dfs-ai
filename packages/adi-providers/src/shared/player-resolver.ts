import type { AdiEvidenceItem } from "@alpha-dfs/shared";
import type { EvidenceFetchContext } from "@alpha-dfs/adi-platform";

export type PlayerRef = {
  slatePlayerId: string;
  name: string;
  team: string;
};

export function resolvePlayerSubjectId(
  context: EvidenceFetchContext,
  playerName: string,
  team: string,
  fallbackSubjectId: string,
): string {
  const normalizedName = playerName.trim().toLowerCase();
  const normalizedTeam = team.trim().toUpperCase();
  const match = context.players.find(
    (player) =>
      player.name.trim().toLowerCase() === normalizedName &&
      player.team.trim().toUpperCase() === normalizedTeam,
  );
  return match?.slatePlayerId ?? fallbackSubjectId;
}

export function resolveGameSubjectId(
  context: EvidenceFetchContext,
  gameKey: string,
  fallbackSubjectId: string,
): string {
  const match = context.games.find((game) => game.gameKey === gameKey);
  return match?.gameKey ?? fallbackSubjectId;
}

export function dropUnresolvedItems(items: AdiEvidenceItem[]): AdiEvidenceItem[] {
  return items.filter((item) => item.subjectId.length > 0 && item.claim.length > 0);
}

export function isoNow(): string {
  return new Date().toISOString();
}

export function expiresInHours(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}
