import type { PortfolioReadinessResponseDto } from "@/types/dto/analysis-responses.dto";
import type { PortfolioReadinessViewModel } from "@/types/portfolio-readiness-view-model";

/** Maps composite portfolio readiness backend DTO → PortfolioReadinessViewModel. */
export function mapPortfolioReadiness(
  dto: PortfolioReadinessResponseDto,
): PortfolioReadinessViewModel {
  return {
    readinessScore: { ...dto.readinessScore },
    predictionConfidence: { ...dto.predictionConfidence },
    dataQuality: { ...dto.dataQuality },
    portfolioHealthSnapshot: {
      ...dto.portfolioHealthSnapshot,
      exposureWarnings: dto.portfolioHealthSnapshot.exposureWarnings ?? [],
    },
    checklist: dto.checklist.map((item) => ({ ...item })),
    summary: { insights: [...dto.summary.insights] },
  };
}
