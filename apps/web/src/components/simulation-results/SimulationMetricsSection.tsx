import { Card } from "@/components/ui/Card";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatOptionalNumber, formatOptionalText } from "@/lib/format-display";
import type { SimulationResultsViewModel } from "@/types/simulation-results-view-model";

type ProjectionSummarySectionProps = {
  data: SimulationResultsViewModel["projections"];
};

export function ProjectionSummarySection({ data }: ProjectionSummarySectionProps) {
  return (
    <section aria-label="Projection summary">
      <SectionHeading title="Projection Summary" />
      <Card>
        <DetailGrid
          columns={2}
          items={[
            { label: "Median Projection", value: formatOptionalNumber(data.medianProjection) },
            { label: "Floor Projection", value: formatOptionalNumber(data.floorProjection) },
            { label: "Ceiling Projection", value: formatOptionalNumber(data.ceilingProjection) },
            { label: "Average Projection", value: formatOptionalNumber(data.averageProjection) },
          ]}
        />
      </Card>
    </section>
  );
}

type ProbabilitySummarySectionProps = {
  data: SimulationResultsViewModel["probabilities"];
};

export function ProbabilitySummarySection({ data }: ProbabilitySummarySectionProps) {
  return (
    <section aria-label="Probability summary">
      <SectionHeading title="Probability Summary" />
      <Card>
        <DetailGrid
          columns={2}
          items={[
            { label: "Win Probability", value: formatOptionalText(data.winProbability) },
            { label: "Cash Probability", value: formatOptionalText(data.cashProbability) },
            { label: "Top 1% Finish", value: formatOptionalText(data.top1PercentFinish) },
            { label: "Top 10% Finish", value: formatOptionalText(data.top10PercentFinish) },
          ]}
        />
      </Card>
    </section>
  );
}

type OutcomeDistributionSectionProps = {
  data: SimulationResultsViewModel["distribution"];
};

export function OutcomeDistributionSection({ data }: OutcomeDistributionSectionProps) {
  return (
    <section aria-label="Outcome distribution">
      <SectionHeading title="Outcome Distribution" />
      <Card>
        <DetailGrid
          columns={2}
          items={[
            { label: "Low Outcome", value: formatOptionalNumber(data.lowOutcome) },
            { label: "Expected Outcome", value: formatOptionalNumber(data.expectedOutcome) },
            { label: "High Outcome", value: formatOptionalNumber(data.highOutcome) },
            { label: "Volatility Rating", value: formatOptionalText(data.volatilityRating) },
          ]}
        />
      </Card>
    </section>
  );
}
