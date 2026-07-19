import { describe, expect, it } from "vitest";
import { mapOwnershipIntelligenceOutlook } from "@/lib/mappers/ownership-intelligence-mapper";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

describe("ownership-intelligence-mapper", () => {
  it("falls back to placeholders when DTO is absent", () => {
    const viewModel = mapOwnershipIntelligenceOutlook(undefined);

    expect(viewModel.isLive).toBe(false);
    expect(viewModel.ownership).toEqual(slateIntelligencePlaceholderData.ownership);
  });

  it("maps live ownership outlook from DTO", () => {
    const viewModel = mapOwnershipIntelligenceOutlook({
      averagePredictedOwnership: 14.2,
      chalkPlayerCount: 3,
      contrarianPlayerCount: 5,
      leverageOpportunities: 2,
      ownershipConcentration: 42.5,
    });

    expect(viewModel.isLive).toBe(true);
    expect(viewModel.ownership.leverageOpportunities).toBe("2 leverage targets");
  });
});
