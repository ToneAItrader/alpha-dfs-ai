import { describe, expect, it } from "vitest";
import { mapSimulationResults } from "@/lib/mappers/simulation-results-mapper";
import { idleSimulationDto } from "@/test/fixtures/analysis-dto-fixtures";

describe("simulation-results-mapper", () => {
  it("defaults field metrics when DTO omits fieldMetrics", () => {
    const viewModel = mapSimulationResults(idleSimulationDto);

    expect(viewModel.fieldMetrics).toEqual({
      fieldSize: null,
      fieldPercentile: null,
      topOnePercentRate: null,
      cashRate: null,
    });
  });

  it("maps live GPP field metrics from DTO", () => {
    const viewModel = mapSimulationResults({
      ...idleSimulationDto,
      overview: {
        ...idleSimulationDto.overview,
        simulationStatus: "complete",
        simulationCount: 10000,
      },
      fieldMetrics: {
        fieldSize: 10000,
        fieldPercentile: 72.5,
        topOnePercentRate: 4.2,
        cashRate: 62,
      },
    });

    expect(viewModel.fieldMetrics).toEqual({
      fieldSize: 10000,
      fieldPercentile: 72.5,
      topOnePercentRate: 4.2,
      cashRate: 62,
    });
  });
});
