import { portfolioReadinessPlaceholder } from "@/config/portfolio-readiness-placeholders";
import { DataQualitySection } from "@/components/portfolio-readiness/DataQualitySection";
import { PortfolioHealthSnapshotSection } from "@/components/portfolio-readiness/PortfolioHealthSnapshotSection";
import { PredictionConfidenceSection } from "@/components/portfolio-readiness/PredictionConfidenceSection";
import { ReadinessChecklistSection } from "@/components/portfolio-readiness/ReadinessChecklistSection";
import { ReadinessScoreSection } from "@/components/portfolio-readiness/ReadinessScoreSection";
import { SummaryRecommendationsSection } from "@/components/portfolio-readiness/SummaryRecommendationsSection";
import type { PortfolioReadinessViewModel } from "@/types/portfolio-readiness-view-model";

type PortfolioReadinessPanelProps = {
  viewModel?: PortfolioReadinessViewModel;
};

export function PortfolioReadinessPanel({
  viewModel = portfolioReadinessPlaceholder,
}: PortfolioReadinessPanelProps) {
  return (
    <div className="space-y-8">
      <ReadinessScoreSection data={viewModel.readinessScore} />
      <PredictionConfidenceSection data={viewModel.predictionConfidence} />
      <DataQualitySection data={viewModel.dataQuality} />
      <PortfolioHealthSnapshotSection data={viewModel.portfolioHealthSnapshot} />
      <ReadinessChecklistSection items={viewModel.checklist} />
      <SummaryRecommendationsSection insights={viewModel.summary.insights} />
    </div>
  );
}
