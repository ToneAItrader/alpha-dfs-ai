import { fetchAnalysisBundle } from "@/lib/backend/analysis-service";
import {
  mapConfidenceIndicators,
  mapDashboardData,
  mapPlayerEvidence,
  mapPortfolioHealth,
  mapPortfolioReadiness,
  mapRecommendedPortfolio,
  mapSimulationResults,
  mapSlateIntelligenceFromBundle,
} from "@/lib/mappers";
import type { SlateIntelligenceViewModel } from "@/types/slate-intelligence-view-model";
import type { DashboardPlaceholderData } from "@/config/dashboard-placeholders";
import type { ConfidenceIndicatorsViewModel } from "@/types/confidence-indicators-view-model";
import type { PlayerEvidenceViewModel } from "@/types/player-evidence-view-model";
import type { PortfolioHealthViewModel } from "@/types/portfolio-health-view-model";
import type { PortfolioReadinessViewModel } from "@/types/portfolio-readiness-view-model";
import type { RecommendedPortfolioViewModel } from "@/types/recommended-portfolio-view-model";
import type { SimulationResultsViewModel } from "@/types/simulation-results-view-model";
import type { PipelineStatusResponseDto } from "@/types/dto/analysis-responses.dto";

export type AnalysisProvider = {
  getPipelineStatus(): Promise<PipelineStatusResponseDto>;
  getDashboardData(): Promise<DashboardPlaceholderData>;
  getConfidenceIndicators(): Promise<ConfidenceIndicatorsViewModel>;
  getPlayerEvidence(): Promise<PlayerEvidenceViewModel>;
  getPortfolioHealth(): Promise<PortfolioHealthViewModel>;
  getSimulationResults(): Promise<SimulationResultsViewModel>;
  getRecommendedPortfolio(): Promise<RecommendedPortfolioViewModel>;
  getPortfolioReadiness(): Promise<PortfolioReadinessViewModel>;
  getSlateIntelligence(): Promise<SlateIntelligenceViewModel>;
};

/** Backend-backed analysis provider — fetches DTOs and maps to view models. */
export function createAnalysisProvider(): AnalysisProvider {
  return {
    async getPipelineStatus() {
      const bundle = await fetchAnalysisBundle();
      return bundle.pipeline;
    },
    async getDashboardData() {
      const bundle = await fetchAnalysisBundle();
      return mapDashboardData(bundle);
    },
    async getConfidenceIndicators() {
      const bundle = await fetchAnalysisBundle();
      return mapConfidenceIndicators(bundle.confidence);
    },
    async getPlayerEvidence() {
      const bundle = await fetchAnalysisBundle();
      return mapPlayerEvidence(bundle.playerEvidence);
    },
    async getPortfolioHealth() {
      const bundle = await fetchAnalysisBundle();
      return mapPortfolioHealth(bundle.portfolioHealth);
    },
    async getSimulationResults() {
      const bundle = await fetchAnalysisBundle();
      return mapSimulationResults(bundle.simulation);
    },
    async getRecommendedPortfolio() {
      const bundle = await fetchAnalysisBundle();
      return mapRecommendedPortfolio(bundle.recommendedPortfolio);
    },
    async getPortfolioReadiness() {
      const bundle = await fetchAnalysisBundle();
      return mapPortfolioReadiness(bundle.portfolioReadiness);
    },
    async getSlateIntelligence() {
      const bundle = await fetchAnalysisBundle();
      return mapSlateIntelligenceFromBundle(bundle);
    },
  };
}

let cachedProvider: AnalysisProvider | null = null;

export function getAnalysisProvider(): AnalysisProvider {
  if (!cachedProvider) {
    cachedProvider = createAnalysisProvider();
  }
  return cachedProvider;
}
