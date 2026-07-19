import { ConfidenceCard, ConfidenceSummary } from "@/components/ui/confidence";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  formatOptionalGrade,
  formatOptionalNumber,
  formatVarianceRating,
} from "@/lib/format-display";
import type { PortfolioReadinessViewModel } from "@/types/portfolio-readiness-view-model";

type PredictionConfidenceSectionProps = {
  data: PortfolioReadinessViewModel["predictionConfidence"];
};

export function PredictionConfidenceSection({ data }: PredictionConfidenceSectionProps) {
  return (
    <section aria-label="Prediction confidence">
      <SectionHeading title="Prediction Confidence" description="PCE outputs." />
      <ConfidenceCard>
        <ConfidenceSummary
          columns={4}
          items={[
            {
              label: "Confidence Score",
              value: formatOptionalNumber(data.confidenceScore),
            },
            {
              label: "Prediction Stability",
              value: formatOptionalNumber(data.predictionStability),
            },
            {
              label: "Reliability Grade",
              value: formatOptionalGrade(data.reliabilityGrade),
            },
            {
              label: "Projection Variance",
              value: formatVarianceRating(data.projectionVariance),
            },
          ]}
        />
      </ConfidenceCard>
    </section>
  );
}
