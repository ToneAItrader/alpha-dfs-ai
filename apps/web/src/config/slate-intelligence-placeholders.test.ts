import { describe, expect, it } from "vitest";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

describe("slateIntelligencePlaceholderData", () => {
  it("includes all required section keys", () => {
    expect(slateIntelligencePlaceholderData.summary).toBeDefined();
    expect(slateIntelligencePlaceholderData.grade).toBeDefined();
    expect(slateIntelligencePlaceholderData.recommendedStrategy.options).toHaveLength(5);
    expect(slateIntelligencePlaceholderData.featuredGames.length).toBeGreaterThan(0);
    expect(slateIntelligencePlaceholderData.intelligenceSummary.length).toBeGreaterThan(0);
  });
});
