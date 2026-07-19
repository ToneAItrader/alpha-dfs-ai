import type { PortfolioHealthResponseDto } from "@/types/dto/analysis-responses.dto";
import type { PortfolioHealthViewModel } from "@/types/portfolio-health-view-model";

/** Maps PIE portfolio health backend DTO → PortfolioHealthViewModel. */
export function mapPortfolioHealth(dto: PortfolioHealthResponseDto): PortfolioHealthViewModel {
  return {
    overview: { ...dto.overview },
    exposure: { ...dto.exposure },
    diversity: { ...dto.diversity },
    ownership: { ...dto.ownership },
    salary: { ...dto.salary },
    risk: { ...dto.risk },
    exposureSummary: dto.exposureSummary
      ? {
          playerExposures: dto.exposureSummary.playerExposures.map((entry) => ({ ...entry })),
          teamExposures: dto.exposureSummary.teamExposures.map((entry) => ({ ...entry })),
          stackExposures: dto.exposureSummary.stackExposures.map((entry) => ({ ...entry })),
          salaryFlexibilityPct: dto.exposureSummary.salaryFlexibilityPct,
          warnings: [...dto.exposureSummary.warnings],
        }
      : {
          playerExposures: [],
          teamExposures: [],
          stackExposures: [],
          salaryFlexibilityPct: null,
          warnings: [],
        },
    recommendations: dto.recommendations,
    metadata: {
      analysisVersion: dto.metadata.analysisVersion,
      timestamp: dto.metadata.timestamp,
      dataFreshness: dto.metadata.dataFreshness,
      portfolioVersion: dto.metadata.portfolioVersion,
    },
  };
}
