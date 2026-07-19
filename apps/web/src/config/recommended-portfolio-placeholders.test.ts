import { describe, expect, it } from "vitest";
import { recommendedPortfolioPlaceholder } from "@/config/recommended-portfolio-placeholders";
import type { RecommendedPortfolioViewModel } from "@/types/recommended-portfolio-view-model";

describe("recommendedPortfolioPlaceholder", () => {
  it("conforms to RecommendedPortfolioViewModel", () => {
    const vm: RecommendedPortfolioViewModel = recommendedPortfolioPlaceholder;

    expect(vm.primaryPortfolios.length).toBeGreaterThanOrEqual(3);
    expect(vm.primaryPortfolios.length).toBeLessThanOrEqual(5);
    expect(vm.hailMaryPortfolios.length).toBeGreaterThanOrEqual(2);
    expect(vm.hailMaryPortfolios.length).toBeLessThanOrEqual(3);
    expect(vm.explainabilitySummary.length).toBeGreaterThan(0);
  });
});
