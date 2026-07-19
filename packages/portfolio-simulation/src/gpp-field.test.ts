import { describe, expect, it } from "vitest";
import { buildFieldLineup, runGppFieldSimulation } from "./gpp-field";

const PLAYERS = [
  { id: "qb1", position: "QB", projection: 22, floor: 12, ceiling: 32, ownership: 18 },
  { id: "rb1", position: "RB", projection: 16, floor: 8, ceiling: 24, ownership: 22 },
  { id: "rb2", position: "RB", projection: 14, floor: 7, ceiling: 21, ownership: 12 },
  { id: "wr1", position: "WR", projection: 17, floor: 9, ceiling: 26, ownership: 20 },
  { id: "wr2", position: "WR", projection: 15, floor: 8, ceiling: 23, ownership: 14 },
  { id: "wr3", position: "WR", projection: 13, floor: 7, ceiling: 20, ownership: 10 },
  { id: "te1", position: "TE", projection: 12, floor: 6, ceiling: 18, ownership: 11 },
  { id: "dst1", position: "DST", projection: 8, floor: 2, ceiling: 14, ownership: 8 },
];

describe("gpp-field simulation", () => {
  it("builds a nine-player field lineup", () => {
    const random = () => 0.5;
    const lineup = buildFieldLineup(PLAYERS, random);
    expect(lineup.length).toBeGreaterThanOrEqual(7);
  });

  it("returns deterministic field metrics with fixed seed", () => {
    const result = runGppFieldSimulation({
      playerAnalysis: {
        totalPlayers: PLAYERS.length,
        highConfidencePlayers: 4,
        moderateConfidencePlayers: 2,
        lowConfidencePlayers: 2,
        players: PLAYERS.map((player) => ({
          slatePlayerId: player.id,
          name: player.id,
          position: player.position,
          team: "BUF",
          opponent: "KC",
          salary: 6000,
          projection: player.projection,
          confidenceScore: 80,
          confidenceTier: "high" as const,
          risk: "Low",
          injuryStatus: "healthy" as const,
          matchupSummary: "Test",
          ownershipEstimate: player.ownership,
          supportingRationale: "Test",
          evidenceSources: ["historical_performance"],
        })),
        evidenceSourceStatuses: { historical_performance: "available" },
      },
      lineupMean: 140,
      variance: "medium",
      floor: 110,
      ceiling: 170,
      simulationCount: 100,
      fieldSize: 50,
      seed: 7,
    });

    expect(result.fieldSize).toBe(50);
    expect(result.fieldPercentile).toBeGreaterThanOrEqual(0);
    expect(result.topOnePercentRate).toBeGreaterThanOrEqual(0);
  });
});
