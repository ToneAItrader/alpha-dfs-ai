import { recommendedPortfolioPlaceholder } from "@/config/recommended-portfolio-placeholders";
import {
  HailMaryPortfolioSection,
  PrimaryPortfolioSection,
} from "@/components/recommended-portfolio/PortfolioLineupsSection";
import { PortfolioOverviewSection } from "@/components/recommended-portfolio/PortfolioOverviewSection";
import {
  ExplainabilityInsightsSection,
  GenerationMetadataSection,
} from "@/components/recommended-portfolio/PortfolioMetadataSection";
import { PortfolioSummarySection } from "@/components/recommended-portfolio/PortfolioSummarySection";
import type { RecommendedPortfolioViewModel } from "@/types/recommended-portfolio-view-model";

type RecommendedPortfolioPanelProps = {
  viewModel?: RecommendedPortfolioViewModel;
};

export function RecommendedPortfolioPanel({
  viewModel = recommendedPortfolioPlaceholder,
}: RecommendedPortfolioPanelProps) {
  return (
    <div className="space-y-8">
      <PortfolioOverviewSection data={viewModel.portfolioOverview} />
      <PrimaryPortfolioSection lineups={viewModel.primaryPortfolios} />
      <HailMaryPortfolioSection lineups={viewModel.hailMaryPortfolios} />
      <PortfolioSummarySection data={viewModel.portfolioSummary} />
      <ExplainabilityInsightsSection
        insights={viewModel.explainabilitySummary}
        recommendations={viewModel.recommendations}
      />
      <GenerationMetadataSection data={viewModel.generationMetadata} />
    </div>
  );
}
