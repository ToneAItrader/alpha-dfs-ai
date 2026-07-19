import { describe, expect, it } from "vitest";
import { mapSlateIntelligence, mapSlateIntelligenceFromBundle } from "./slate-intelligence-mapper";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

describe("slate-intelligence-mapper", () => {
  it("falls back to placeholders when DTO is absent", () => {
    const viewModel = mapSlateIntelligence(undefined, "Test Slate");

    expect(viewModel.summary.slateName).toBe("Test Slate");
    expect(viewModel.grade.overallGrade).toBe(slateIntelligencePlaceholderData.grade.overallGrade);
    expect(viewModel.liveSections.summary).toBe(false);
  });

  it("maps live sections 1–3 and 8 from complete DTO", () => {
    const viewModel = mapSlateIntelligence({
      slateGrade: 82,
      volatilityScore: 48,
      recommendedStrategy: "balanced",
      confidenceRating: 0.76,
      factors: ["Strong data completeness", "Moderate volatility"],
      slateSummary: "Week 5 main slate narrative",
      slateName: "Main Slate",
      week: 5,
      gameCount: 11,
      teamCount: 22,
      totalPlayers: 176,
    });

    expect(viewModel.summary.games).toBe("11");
    expect(viewModel.summary.teams).toBe("22");
    expect(viewModel.summary.totalPlayers).toBe("176");
    expect(viewModel.grade.overallGrade).toBe("82/100");
    expect(viewModel.grade.confidence).toBe("76%");
    expect(viewModel.recommendedStrategy.primary).toBe("Balanced");
    expect(viewModel.intelligenceSummary).toEqual([
      "Strong data completeness",
      "Moderate volatility",
    ]);
    expect(viewModel.liveSections.summary).toBe(true);
    expect(viewModel.liveSections.grade).toBe(true);
    expect(viewModel.liveSections.recommendedStrategy).toBe(true);
    expect(viewModel.liveSections.intelligenceSummary).toBe(true);
  });

  it("keeps deferred sections 4–7 on placeholder data when live", () => {
    const viewModel = mapSlateIntelligence({
      slateGrade: 70,
      volatilityScore: 55,
      recommendedStrategy: "gpp_heavy",
      confidenceRating: 0.65,
      factors: ["Factor one"],
    });

    expect(viewModel.injuries).toEqual(slateIntelligencePlaceholderData.injuries);
    expect(viewModel.weather).toEqual(slateIntelligencePlaceholderData.weather);
    expect(viewModel.ownership).toEqual(slateIntelligencePlaceholderData.ownership);
    expect(viewModel.featuredGames).toEqual(slateIntelligencePlaceholderData.featuredGames);
  });

  it("maps from analysis bundle wrapper", () => {
    const viewModel = mapSlateIntelligenceFromBundle({
      pipeline: { currentSlate: "Bundle Slate" },
      slateIntelligence: {
        slateGrade: 75,
        volatilityScore: 40,
        recommendedStrategy: "primary_heavy",
        confidenceRating: 0.8,
        factors: ["Stable slate"],
      },
    });

    expect(viewModel.summary.slateName).toBe("Bundle Slate");
    expect(viewModel.recommendedStrategy.primary).toBe("Primary Heavy");
  });
});
