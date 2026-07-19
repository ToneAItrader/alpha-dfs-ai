import { describe, expect, it } from "vitest";
import { portfolioReadinessPlaceholder } from "@/config/portfolio-readiness-placeholders";
import type { PortfolioReadinessViewModel } from "@/types/portfolio-readiness-view-model";

describe("portfolioReadinessPlaceholder", () => {
  it("conforms to PortfolioReadinessViewModel", () => {
    const vm: PortfolioReadinessViewModel = portfolioReadinessPlaceholder;

    expect(vm.readinessScore.status).toBe("idle");
    expect(vm.checklist).toHaveLength(6);
    expect(vm.summary.insights.length).toBeGreaterThan(0);
  });
});
