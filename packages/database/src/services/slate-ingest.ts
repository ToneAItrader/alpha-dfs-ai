import type { PrismaClient } from "@prisma/client";
import { encodeInjuryStatus } from "../mappers/injury-status-codec";

export type SlateIngestPayload = {
  slate: {
    name: string;
    week: number;
    season: number;
    sport: string;
    platform: string;
    slateType: string;
  };
  teams: ReadonlyArray<{ abbreviation: string; name: string }>;
  games: ReadonlyArray<{
    home: string;
    away: string;
    spread?: number;
    total?: number;
    impliedHomeTotal?: number;
    impliedAwayTotal?: number;
    lineMovement?: number;
    temperature?: number;
    windMph?: number;
    precipitationProbability?: number;
    isDome?: boolean;
  }>;
  players: ReadonlyArray<{
    externalId: string;
    name: string;
    position: string;
    team: string;
    opponent: string;
    salary: number;
    projection: number;
    floor: number;
    ceiling: number;
    injuryStatus: string;
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
  }>;
};

/** Upsert slate graph from connector payload — idempotent refresh path. */
export async function upsertSlatePayload(
  client: PrismaClient,
  payload: SlateIngestPayload,
): Promise<string> {
  const teamMap = new Map<string, string>();
  for (const team of payload.teams) {
    const record = await client.team.upsert({
      where: { abbreviation: team.abbreviation },
      create: { abbreviation: team.abbreviation, name: team.name },
      update: { name: team.name },
    });
    teamMap.set(team.abbreviation, record.id);
  }

  const gameMap = new Map<string, string>();
  for (const game of payload.games) {
    const homeTeamId = teamMap.get(game.home);
    const awayTeamId = teamMap.get(game.away);
    if (!homeTeamId || !awayTeamId) continue;

    const existing = await client.game.findFirst({
      where: {
        season: payload.slate.season,
        week: payload.slate.week,
        homeTeamId,
        awayTeamId,
      },
    });

    const record =
      existing ??
      (await client.game.create({
        data: {
          season: payload.slate.season,
          week: payload.slate.week,
          homeTeamId,
          awayTeamId,
        },
      }));
    gameMap.set(`${game.home}-${game.away}`, record.id);
  }

  let slate = await client.slate.findFirst({
    where: {
      status: "open",
      platform: payload.slate.platform,
      sport: payload.slate.sport,
      week: payload.slate.week,
      season: payload.slate.season,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!slate) {
    slate = await client.slate.create({
      data: {
        name: payload.slate.name,
        week: payload.slate.week,
        season: payload.slate.season,
        sport: payload.slate.sport,
        platform: payload.slate.platform,
        slateType: payload.slate.slateType,
        status: "open",
      },
    });
  } else {
    slate = await client.slate.update({
      where: { id: slate.id },
      data: { name: payload.slate.name },
    });
  }

  for (const seedPlayer of payload.players) {
    const [firstName, ...rest] = seedPlayer.name.split(" ");
    const lastName = rest.join(" ") || firstName;

    const player = await client.player.upsert({
      where: { externalId: seedPlayer.externalId },
      create: {
        externalId: seedPlayer.externalId,
        firstName,
        lastName,
        position: seedPlayer.position,
      },
      update: {
        firstName,
        lastName,
        position: seedPlayer.position,
      },
    });

    const gameKey = payload.games.find(
      (game) => game.home === seedPlayer.team || game.away === seedPlayer.team,
    );
    const gameId = gameKey ? gameMap.get(`${gameKey.home}-${gameKey.away}`) : undefined;
    const teamId = teamMap.get(seedPlayer.team);
    if (!teamId) continue;

    const slatePlayer = await client.slatePlayer.upsert({
      where: {
        slateId_playerId: {
          slateId: slate.id,
          playerId: player.id,
        },
      },
      create: {
        slateId: slate.id,
        playerId: player.id,
        teamId,
        gameId,
        salary: seedPlayer.salary,
        rosterPosition: seedPlayer.position,
        opponentAbbr: seedPlayer.opponent,
        isActive: true,
      },
      update: {
        teamId,
        gameId,
        salary: seedPlayer.salary,
        rosterPosition: seedPlayer.position,
        opponentAbbr: seedPlayer.opponent,
        isActive: true,
      },
    });

    await client.projection.upsert({
      where: { slatePlayerId: slatePlayer.id },
      create: {
        slatePlayerId: slatePlayer.id,
        projectedPoints: seedPlayer.projection,
        floor: seedPlayer.floor,
        ceiling: seedPlayer.ceiling,
        ownershipProjected: seedPlayer.ownershipProjected,
      },
      update: {
        projectedPoints: seedPlayer.projection,
        floor: seedPlayer.floor,
        ceiling: seedPlayer.ceiling,
        ownershipProjected: seedPlayer.ownershipProjected,
      },
    });

    await client.injuryReport.upsert({
      where: { slatePlayerId: slatePlayer.id },
      create: {
        slatePlayerId: slatePlayer.id,
        status: encodeInjuryStatus({
          injuryStatus: seedPlayer.injuryStatus,
          practiceStatus: seedPlayer.practiceStatus,
          gameStatus: seedPlayer.gameStatus,
        }),
        capturedAt: new Date(),
      },
      update: {
        status: encodeInjuryStatus({
          injuryStatus: seedPlayer.injuryStatus,
          practiceStatus: seedPlayer.practiceStatus,
          gameStatus: seedPlayer.gameStatus,
        }),
        capturedAt: new Date(),
      },
    });

    await client.evidenceDomainStatus.upsert({
      where: { slatePlayerId: slatePlayer.id },
      create: {
        slatePlayerId: slatePlayer.id,
        ...seedPlayer.domains,
      },
      update: {
        ...seedPlayer.domains,
      },
    });
  }

  return slate.id;
}
