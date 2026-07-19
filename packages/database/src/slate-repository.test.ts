import { beforeEach, describe, expect, it } from "vitest";
import { getPrismaClient, seedDatabase } from "@alpha-dfs/database";
import { createIngestionService, createPlayerRepository, createSlateRepository } from "@alpha-dfs/database";

describe("database slate ingestion", () => {
  beforeEach(async () => {
    const client = getPrismaClient();
    await seedDatabase(client);
  });

  it("seeds active slate with required positions", async () => {
    const client = getPrismaClient();
    const slateRepository = createSlateRepository(client);
    const playerRepository = createPlayerRepository(client);
    const ingestion = createIngestionService(slateRepository, playerRepository);

    const result = await ingestion.validateActiveSlate();
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.playerCount).toBeGreaterThanOrEqual(15);
    }
  });

  it("loads slate players for evidence assembly", async () => {
    const client = getPrismaClient();
    const slateRepository = createSlateRepository(client);
    const slate = await slateRepository.getActiveSlate();
    expect(slate).not.toBeNull();

    const players = await slateRepository.getSlatePlayers(slate!.id);
    expect(players.length).toBe(15);
    expect(players.every((player) => player.projection > 0)).toBe(true);
  });
});
