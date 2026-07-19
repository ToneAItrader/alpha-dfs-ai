import type { SimulationResultsResponseDto } from "@/types/dto/analysis-responses.dto";
import type { SimulationResultsViewModel } from "@/types/simulation-results-view-model";

/** Maps Portfolio Simulation Engine backend DTO → SimulationResultsViewModel. */
export function mapSimulationResults(
  dto: SimulationResultsResponseDto,
): SimulationResultsViewModel {
  return {
    overview: { ...dto.overview },
    projections: { ...dto.projections },
    probabilities: { ...dto.probabilities },
    fieldMetrics: dto.fieldMetrics
      ? { ...dto.fieldMetrics }
      : {
          fieldSize: null,
          fieldPercentile: null,
          topOnePercentRate: null,
          cashRate: null,
        },
    distribution: { ...dto.distribution },
    insights: dto.insights,
    metadata: {
      simulationVersion: dto.metadata.simulationVersion,
      timestamp: dto.metadata.timestamp,
      dataFreshness: dto.metadata.dataFreshness,
      portfolioVersion: dto.metadata.portfolioVersion,
    },
  };
}
