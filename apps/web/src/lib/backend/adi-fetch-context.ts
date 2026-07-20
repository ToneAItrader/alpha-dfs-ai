import type { EvidenceFetchContext } from "@alpha-dfs/adi-platform";

type SlatePlayerLike = {
  slatePlayerId: string;
  name: string;
  team: string;
  opponent?: string;
};

export function buildAdiFetchContext(
  runId: string,
  slateId: string,
  players: SlatePlayerLike[],
): EvidenceFetchContext {
  const gameMap = new Map<string, { gameKey: string; homeTeam: string; awayTeam: string }>();

  for (const player of players) {
    if (!player.opponent) continue;
    const teams = [player.team, player.opponent].sort();
    const gameKey = `${teams[0]}-${teams[1]}`;
    if (!gameMap.has(gameKey)) {
      gameMap.set(gameKey, {
        gameKey,
        homeTeam: player.team,
        awayTeam: player.opponent,
      });
    }
  }

  return {
    runId,
    slateId,
    players: players.map((player) => ({
      slatePlayerId: player.slatePlayerId,
      name: player.name,
      team: player.team,
    })),
    games: [...gameMap.values()],
  };
}
