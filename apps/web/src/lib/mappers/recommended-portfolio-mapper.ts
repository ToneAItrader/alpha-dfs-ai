import type { RecommendedPortfolioResponseDto } from "@/types/dto/analysis-responses.dto";
import type { RecommendedPortfolioViewModel } from "@/types/recommended-portfolio-view-model";

/** Maps PIE recommended portfolio backend DTO → RecommendedPortfolioViewModel. */
export function mapRecommendedPortfolio(
  dto: RecommendedPortfolioResponseDto,
): RecommendedPortfolioViewModel {
  return {
    portfolioOverview: { ...dto.portfolioOverview },
    primaryPortfolios: dto.primaryLineups.map((lineup) => ({
      lineupId: lineup.lineupId,
      portfolioType: "primary" as const,
      rank: lineup.rank,
      projectedPoints: lineup.projectedFantasyPoints,
      confidence: lineup.confidenceScore,
      risk: lineup.riskScore,
      salaryUsed: lineup.salaryUsed,
      ownership: lineup.ownershipEstimate,
      correlation: lineup.correlationScore,
      leverage: lineup.leverageScore,
      explainabilitySummary: lineup.optimizerRationale,
    })),
    hailMaryPortfolios: dto.hailMaryLineups.map((lineup) => ({
      lineupId: lineup.lineupId,
      portfolioType: "hail_mary" as const,
      rank: lineup.rank,
      ceiling: lineup.ceilingRating,
      leverage: lineup.leverageScore,
      ownership: lineup.ownershipEstimate,
      risk: lineup.riskScore,
      contrarianRating: lineup.contrarianRating,
      explainabilitySummary: lineup.optimizerRationale,
    })),
    portfolioSummary: { ...dto.portfolioSummary },
    explainabilitySummary: dto.explainabilitySummary,
    generationMetadata: {
      analysisVersion: dto.generationMetadata.analysisVersion,
      generationTime: dto.generationMetadata.generationTime,
      simulationStatus: dto.generationMetadata.simulationStatus,
      dataFreshness: dto.generationMetadata.dataFreshness,
    },
    recommendations: dto.recommendations,
  };
}
