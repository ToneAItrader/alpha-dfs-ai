import type { PrismaClient } from "@prisma/client";
import { mapSlatePlayerToInput, type SlatePlayerInput } from "../mappers/slate-player-mapper";

const slatePlayerInclude = {
  player: true,
  team: true,
  projection: true,
  injuryReport: true,
  evidenceDomains: true,
} as const;

export type SlateRecord = {
  id: string;
  name: string;
  week: number;
  season: number;
  status: string;
};

export function createSlateRepository(client: PrismaClient) {
  return {
    async getActiveSlate(): Promise<SlateRecord | null> {
      return client.slate.findFirst({
        where: { status: "open", platform: "draftkings", sport: "nfl" },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, week: true, season: true, status: true },
      });
    },

    async getSlateById(slateId: string): Promise<SlateRecord | null> {
      return client.slate.findUnique({
        where: { id: slateId },
        select: { id: true, name: true, week: true, season: true, status: true },
      });
    },

    async getSlatePlayers(slateId: string): Promise<SlatePlayerInput[]> {
      const rows = await client.slatePlayer.findMany({
        where: { slateId, isActive: true },
        include: slatePlayerInclude,
        orderBy: { salary: "desc" },
      });
      return rows.map(mapSlatePlayerToInput);
    },

    async getSlateCoverage(slateId: string) {
      const players = await this.getSlatePlayers(slateId);
      const total = players.length;
      if (total === 0) {
        return {
          totalPlayers: 0,
          withProjection: 0,
          withInjury: 0,
          withExpert: 0,
          withMarket: 0,
          withWeather: 0,
          dataCompleteness: 0,
        };
      }

      const withProjection = players.filter((player) => player.projection > 0).length;
      const withInjury = players.filter((player) => player.domains.injury).length;
      const withExpert = players.filter((player) => player.domains.expert).length;
      const withMarket = players.filter((player) => player.domains.market).length;
      const withWeather = players.filter((player) => player.domains.weather).length;

      const completeness =
        ((withProjection / total) * 0.35 +
          (withInjury / total) * 0.2 +
          (withExpert / total) * 0.15 +
          (withMarket / total) * 0.15 +
          (withWeather / total) * 0.15) *
        100;

      return {
        totalPlayers: total,
        withProjection,
        withInjury,
        withExpert,
        withMarket,
        withWeather,
        dataCompleteness: Math.round(completeness),
      };
    },
  };
}

export type SlateRepository = ReturnType<typeof createSlateRepository>;
