import type { PrismaClient } from "@prisma/client";

export function createPlayerRepository(client: PrismaClient) {
  return {
    async countBySlate(slateId: string): Promise<number> {
      return client.slatePlayer.count({ where: { slateId, isActive: true } });
    },

    async countByPosition(slateId: string): Promise<Record<string, number>> {
      const rows = await client.slatePlayer.groupBy({
        by: ["rosterPosition"],
        where: { slateId, isActive: true },
        _count: { rosterPosition: true },
      });

      return Object.fromEntries(
        rows.map((row) => [row.rosterPosition, row._count.rosterPosition]),
      );
    },
  };
}

export type PlayerRepository = ReturnType<typeof createPlayerRepository>;
