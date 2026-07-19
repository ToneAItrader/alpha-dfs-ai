import { confidenceIndicatorsPlaceholder } from "@/config/confidence-indicators-placeholders";
import { ConfidenceOverviewSection } from "@/components/confidence-indicators/ConfidenceOverviewSection";
import {
  DataQualitySection,
  ModelAgreementSection,
  PredictionStabilitySection,
  ProjectionCalibrationSection,
} from "@/components/confidence-indicators/ConfidenceMetricsSection";
import {
  AnalysisMetadataSection,
  ConfidenceInsightsSection,
} from "@/components/confidence-indicators/ConfidenceMetadataSection";
import { SharedComponentsShowcase } from "@/components/confidence-indicators/SharedComponentsShowcase";
import type { ConfidenceIndicatorsViewModel } from "@/types/confidence-indicators-view-model";

type ConfidenceIndicatorsPanelProps = {
  viewModel?: ConfidenceIndicatorsViewModel;
  showComponentShowcase?: boolean;
};

export function ConfidenceIndicatorsPanel({
  viewModel = confidenceIndicatorsPlaceholder,
  showComponentShowcase = false,
}: ConfidenceIndicatorsPanelProps) {
  return (
    <div className="space-y-8">
      <ConfidenceOverviewSection data={viewModel.overview} />
      <PredictionStabilitySection data={viewModel.stability} />
      <ProjectionCalibrationSection data={viewModel.calibration} />
      <DataQualitySection data={viewModel.quality} />
      <ModelAgreementSection data={viewModel.agreement} />
      <ConfidenceInsightsSection insights={viewModel.insights} />
      <AnalysisMetadataSection data={viewModel.metadata} />
      {showComponentShowcase ? <SharedComponentsShowcase /> : null}
    </div>
  );
}
