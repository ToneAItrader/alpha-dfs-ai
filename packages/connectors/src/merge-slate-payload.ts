import type { ConnectorFetchResult, SlateConnectorPayload, SlateGamePayload } from "./types";

function gameKey(game: { home: string; away: string }): string {
  return `${game.home.trim().toUpperCase()}-${game.away.trim().toUpperCase()}`;
}

function mergeGameFields(existing: SlateGamePayload, incoming: SlateGamePayload): SlateGamePayload {
  return {
    home: existing.home,
    away: existing.away,
    spread: incoming.spread !== undefined ? incoming.spread : existing.spread,
    total: incoming.total !== undefined ? incoming.total : existing.total,
    impliedHomeTotal:
      incoming.impliedHomeTotal !== undefined ? incoming.impliedHomeTotal : existing.impliedHomeTotal,
    impliedAwayTotal:
      incoming.impliedAwayTotal !== undefined ? incoming.impliedAwayTotal : existing.impliedAwayTotal,
    lineMovement:
      incoming.lineMovement !== undefined ? incoming.lineMovement : existing.lineMovement,
    temperature: incoming.temperature !== undefined ? incoming.temperature : existing.temperature,
    windMph: incoming.windMph !== undefined ? incoming.windMph : existing.windMph,
    precipitationProbability:
      incoming.precipitationProbability !== undefined
        ? incoming.precipitationProbability
        : existing.precipitationProbability,
    isDome: incoming.isDome !== undefined ? incoming.isDome : existing.isDome,
  };
}

function gameHasMarketData(game: SlateGamePayload): boolean {
  return game.spread !== undefined || game.total !== undefined;
}

function gameHasWeatherData(game: SlateGamePayload): boolean {
  return (
    game.temperature !== undefined ||
    game.windMph !== undefined ||
    game.precipitationProbability !== undefined ||
    game.isDome !== undefined
  );
}

/** Merge P0 slate with P1 partial payloads — each provider overwrites only its owned fields. */
export function mergeConnectorPayloads(results: ConnectorFetchResult[]): SlateConnectorPayload | null {
  const p0 = results.find(
    (result) => result.priority === "P0" && result.ok && result.payload?.slate,
  );
  if (!p0?.payload?.slate || !p0.payload.players) {
    return null;
  }

  const players = p0.payload.players.map((player) => ({
    ...player,
    domains: { ...player.domains },
  }));

  const games = (p0.payload.games ?? []).map((game) => ({ ...game }));

  for (const result of results) {
    if (!result.ok) continue;

    if (result.payload?.players) {
      for (const player of result.payload.players) {
        const index = players.findIndex((entry) => entry.externalId === player.externalId);
        if (index >= 0) {
          players[index] = {
            ...players[index],
            projection: player.projection > 0 ? player.projection : players[index].projection,
            floor: player.floor > 0 ? player.floor : players[index].floor,
            ceiling: player.ceiling > 0 ? player.ceiling : players[index].ceiling,
            ownershipProjected:
              player.ownershipProjected > 0
                ? player.ownershipProjected
                : players[index].ownershipProjected,
            injuryStatus: player.domains.injury ? player.injuryStatus : players[index].injuryStatus,
            practiceStatus: player.practiceStatus ?? players[index].practiceStatus,
            gameStatus: player.gameStatus ?? players[index].gameStatus,
            domains: { ...players[index].domains, ...player.domains },
          };
        }
      }
    }

    if (result.payload?.games) {
      for (const game of result.payload.games) {
        const index = games.findIndex((entry) => gameKey(entry) === gameKey(game));
        if (index >= 0) {
          games[index] = mergeGameFields(games[index], game);
        }
      }
    }
  }

  for (const player of players) {
    const game = games.find((entry) => entry.home === player.team || entry.away === player.team);
    if (!game) continue;
    if (gameHasMarketData(game)) {
      player.domains = { ...player.domains, market: true };
    }
    if (gameHasWeatherData(game)) {
      player.domains = { ...player.domains, weather: true };
    }
  }

  return {
    slate: p0.payload.slate,
    teams: [...(p0.payload.teams ?? [])],
    games,
    players,
  };
}
