import { portfolioHealthPlaceholder } from "@/config/portfolio-health-placeholders";
import { HealthOverviewSection } from "@/components/portfolio-health/HealthOverviewSection";
import {
  ExposureBalanceSection,
  MultiLineupExposureSection,
  OwnershipDistributionSection,
  RiskProfileSection,
  SalaryDistributionSection,
  StackDiversitySection,
} from "@/components/portfolio-health/PortfolioHealthMetricsSection";
import {
  AnalysisMetadataSection,
  HealthRecommendationsSection,
} from "@/components/portfolio-health/PortfolioHealthMetadataSection";
import type { PortfolioHealthViewModel } from "@/types/portfolio-health-view-model";

type PortfolioHealthPanelProps = {
  viewModel?: PortfolioHealthViewModel;
};

export function PortfolioHealthPanel({
  viewModel = portfolioHealthPlaceholder,
}: PortfolioHealthPanelProps) {
  return (
    <div className="space-y-8">
      <HealthOverviewSection data={viewModel.overview} />
      <ExposureBalanceSection data={viewModel.exposure} />
      <MultiLineupExposureSection data={viewModel.exposureSummary} />
      <StackDiversitySection data={viewModel.diversity} />
      <OwnershipDistributionSection data={viewModel.ownership} />
      <SalaryDistributionSection data={viewModel.salary} />
      <RiskProfileSection data={viewModel.risk} />
      <HealthRecommendationsSection recommendations={viewModel.recommendations} />
      <AnalysisMetadataSection data={viewModel.metadata} />
    </div>
  );
}
