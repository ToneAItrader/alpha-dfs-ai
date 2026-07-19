import { describe, expect, it } from "vitest";
import { simulationResultsPlaceholder } from "@/config/simulation-results-placeholders";
import type { SimulationResultsViewModel } from "@/types/simulation-results-view-model";

describe("simulationResultsPlaceholder", () => {
  it("conforms to SimulationResultsViewModel", () => {
    const vm: SimulationResultsViewModel = simulationResultsPlaceholder;

    expect(vm.overview.simulationStatus).toBe("idle");
    expect(vm.insights.length).toBeGreaterThan(0);
    expect(vm.projections.medianProjection).toBeNull();
  });
});
