import { describe, expect, it } from "vitest";
import { portfolioHealthPlaceholder } from "@/config/portfolio-health-placeholders";
import type { PortfolioHealthViewModel } from "@/types/portfolio-health-view-model";

describe("portfolioHealthPlaceholder", () => {
  it("conforms to PortfolioHealthViewModel", () => {
    const vm: PortfolioHealthViewModel = portfolioHealthPlaceholder;

    expect(vm.overview.overallStatus).toBe("idle");
    expect(vm.recommendations.length).toBeGreaterThan(0);
    expect(vm.exposure.qbExposure).toBeNull();
  });
});
