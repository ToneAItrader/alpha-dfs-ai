import { describe, expect, it } from "vitest";
import { computeSlateIntelligence } from "./compute-slate-intelligence";

const baseReadiness = {
  slateLabel: "DK NFL Classic",
  dataCompleteness: 90,
  injuryDataStatus: "available" as const,
  weatherDataStatus: "available" as const,
  marketDataStatus: "available" as const,
  expertConsensusStatus: "available" as const,
  checklistComplete: true,
};

describe("computeSlateIntelligence", () => {
  it("produces bounded grade and volatility scores", () => {
    const output = computeSlateIntelligence({
      slateLabel: "DK NFL Classic",
      slateName: "Main Slate",
      week: 5,
      readiness: baseReadiness,
      gameCount: 10,
      teamCount: 20,
      totalPlayers: 150,
    });

    expect(output.slateGrade).toBeGreaterThanOrEqual(0);
    expect(output.slateGrade).toBeLessThanOrEqual(100);
    expect(output.volatilityScore).toBeGreaterThanOrEqual(0);
    expect(output.volatilityScore).toBeLessThanOrEqual(100);
    expect(output.confidenceRating).toBeGreaterThan(0);
    expect(output.factors.length).toBeGreaterThan(0);
    expect(output.recommendedStrategy).toBeDefined();
  });

  it("selects gpp_heavy strategy for high volatility slates", () => {
    const output = computeSlateIntelligence({
      slateLabel: "DK NFL Classic",
      slateName: "Main Slate",
      week: 5,
      readiness: {
        ...baseReadiness,
        dataCompleteness: 55,
        injuryDataStatus: "partial",
        weatherDataStatus: "unavailable",
        marketDataStatus: "partial",
      },
      gameCount: 8,
      teamCount: 16,
      totalPlayers: 120,
    });

    expect(["gpp_heavy", "contrarian", "stack_aggressive"]).toContain(output.recommendedStrategy);
    expect(output.slateRisk).not.toBe("low");
  });

  it("selects primary_heavy for stable high-completeness slates", () => {
    const output = computeSlateIntelligence({
      slateLabel: "DK NFL Classic",
      slateName: "Main Slate",
      week: 5,
      readiness: baseReadiness,
      gameCount: 12,
      teamCount: 24,
      totalPlayers: 180,
    });

    expect(output.recommendedStrategy).toBe("primary_heavy");
    expect(output.contestRecommendation).toContain("Primary");
  });
});
