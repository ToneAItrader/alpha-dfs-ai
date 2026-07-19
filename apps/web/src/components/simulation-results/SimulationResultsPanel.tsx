import { simulationResultsPlaceholder } from "@/config/simulation-results-placeholders";
import { SimulationOverviewSection } from "@/components/simulation-results/SimulationOverviewSection";
import {
  OutcomeDistributionSection,
  ProbabilitySummarySection,
  ProjectionSummarySection,
} from "@/components/simulation-results/SimulationMetricsSection";
import { FieldMetricsSection } from "@/components/simulation-results/FieldMetricsSection";
import {
  AnalysisMetadataSection,
  SimulationInsightsSection,
} from "@/components/simulation-results/SimulationMetadataSection";
import type { SimulationResultsViewModel } from "@/types/simulation-results-view-model";

type SimulationResultsPanelProps = {
  viewModel?: SimulationResultsViewModel;
};

export function SimulationResultsPanel({
  viewModel = simulationResultsPlaceholder,
}: SimulationResultsPanelProps) {
  return (
    <div className="space-y-8">
      <SimulationOverviewSection data={viewModel.overview} />
      <ProjectionSummarySection data={viewModel.projections} />
      <ProbabilitySummarySection data={viewModel.probabilities} />
      <FieldMetricsSection data={viewModel.fieldMetrics} />
      <OutcomeDistributionSection data={viewModel.distribution} />
      <SimulationInsightsSection insights={viewModel.insights} />
      <AnalysisMetadataSection data={viewModel.metadata} />
    </div>
  );
}
