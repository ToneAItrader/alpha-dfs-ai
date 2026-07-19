import { PrismaClient } from "@prisma/client";
import { SEED_GAMES, SEED_PLAYERS, SEED_SLATE, SEED_TEAMS } from "./seed-data";
import { upsertSlatePayload } from "../src/services/slate-ingest";

async function findExistingSlate(client: PrismaClient): Promise<string | null> {
  const slate = await client.slate.findFirst({
    where: { status: "open", platform: "draftkings", sport: "nfl" },
    orderBy: { createdAt: "desc" },
  });

  if (!slate) {
    return null;
  }

  const playerCount = await client.slatePlayer.count({ where: { slateId: slate.id } });
  return playerCount >= SEED_PLAYERS.length ? slate.id : null;
}

export async function seedDatabase(client: PrismaClient): Promise<string> {
  const existingSlateId = await findExistingSlate(client);
  if (existingSlateId) {
    return existingSlateId;
  }

  return upsertSlatePayload(client, {
    slate: {
      name: SEED_SLATE.name,
      week: SEED_SLATE.week,
      season: SEED_SLATE.season,
      sport: "nfl",
      platform: "draftkings",
      slateType: "classic",
    },
    teams: SEED_TEAMS.map((team) => ({ abbreviation: team.abbreviation, name: team.name })),
    games: SEED_GAMES.map((game) => ({ home: game.home, away: game.away })),
    players: SEED_PLAYERS.map((player) => ({
      externalId: player.externalId,
      name: player.name,
      position: player.position,
      team: player.team,
      opponent: player.opponent,
      salary: player.salary,
      projection: player.projection,
      floor: player.floor,
      ceiling: player.ceiling,
      injuryStatus: player.injuryStatus,
      ownershipProjected: player.ownershipProjected,
      domains: { ...player.domains },
    })),
  });
}
