import { SectionHeading } from "@/components/ui/SectionHeading";
import { ConfidenceSummary } from "@/components/ui/confidence";
import {
  formatLastAnalysis,
  formatOptionalGrade,
  formatOptionalNumber,
  formatReadinessStatus,
} from "@/lib/format-display";
import type { ConfidenceIndicatorsViewModel } from "@/types/confidence-indicators-view-model";

type ConfidenceOverviewSectionProps = {
  data: ConfidenceIndicatorsViewModel["overview"];
};

export function ConfidenceOverviewSection({ data }: ConfidenceOverviewSectionProps) {
  return (
    <section aria-label="Confidence overview">
      <SectionHeading title="Confidence Overview" />
      <ConfidenceSummary
        items={[
          {
            label: "Overall Confidence",
            value: formatOptionalNumber(data.overallConfidence),
          },
          {
            label: "Confidence Grade",
            value: formatOptionalGrade(data.confidenceGrade),
          },
          {
            label: "Current Status",
            value: formatReadinessStatus(data.currentStatus),
          },
          {
            label: "Last Analysis",
            value: formatLastAnalysis(data.lastAnalysisAt),
          },
        ]}
      />
    </section>
  );
}
