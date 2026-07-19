import { describe, expect, it } from "vitest";
import { confidenceIndicatorsPlaceholder } from "@/config/confidence-indicators-placeholders";
import type { ConfidenceIndicatorsViewModel } from "@/types/confidence-indicators-view-model";

describe("confidenceIndicatorsPlaceholder", () => {
  it("conforms to ConfidenceIndicatorsViewModel", () => {
    const vm: ConfidenceIndicatorsViewModel = confidenceIndicatorsPlaceholder;

    expect(vm.overview.currentStatus).toBe("idle");
    expect(vm.insights.length).toBeGreaterThan(0);
    expect(vm.stability.stabilityScore).toBeNull();
  });
});
