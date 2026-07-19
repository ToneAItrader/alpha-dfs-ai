import { describe, expect, it } from "vitest";
import { assemblePlayerEvidence, computeEvidenceQualityScore, FIXTURE_SLATE_PLAYERS } from "@alpha-dfs/evidence";

describe("Evidence Engine", () => {
  it("computes deterministic quality scores", () => {
    const score = computeEvidenceQualityScore(FIXTURE_SLATE_PLAYERS[0]);
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it("assembles player analysis output with five players", () => {
    const output = assemblePlayerEvidence();
    expect(output.totalPlayers).toBe(5);
    expect(output.players.every((player) => player.confidenceScore > 0)).toBe(true);
    expect(output.evidenceSourceStatuses.historical_performance).toBe("available");
  });
});
