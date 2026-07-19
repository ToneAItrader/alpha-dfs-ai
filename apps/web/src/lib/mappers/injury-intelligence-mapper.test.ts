import { describe, expect, it } from "vitest";
import { mapInjuryIntelligenceOverview } from "./injury-intelligence-mapper";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

describe("injury-intelligence-mapper", () => {
  it("falls back to placeholders when DTO absent", () => {
    const viewModel = mapInjuryIntelligenceOverview(undefined);
    expect(viewModel.isLive).toBe(false);
    expect(viewModel.majorInjuries).toBe(slateIntelligencePlaceholderData.injuries.majorInjuries);
  });

  it("maps live injury overview fields", () => {
    const viewModel = mapInjuryIntelligenceOverview({
      majorInjuries: 2,
      questionablePlayers: 4,
      backupOpportunities: 1,
      rookieOpportunities: 3,
    });

    expect(viewModel.isLive).toBe(true);
    expect(viewModel.majorInjuries).toBe("2");
    expect(viewModel.questionablePlayers).toBe("4");
  });
});
