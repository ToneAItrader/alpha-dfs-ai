import { Card } from "@/components/ui/Card";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatOptionalNumber, formatOptionalText } from "@/lib/format-display";
import type { SimulationResultsViewModel } from "@/types/simulation-results-view-model";

type FieldMetricsSectionProps = {
  data: SimulationResultsViewModel["fieldMetrics"];
};

export function FieldMetricsSection({ data }: FieldMetricsSectionProps) {
  return (
    <section aria-label="GPP field metrics">
      <SectionHeading title="GPP Field Metrics" />
      <Card>
        <DetailGrid
          columns={2}
          items={[
            { label: "Field Size", value: formatOptionalNumber(data.fieldSize) },
            { label: "Field Percentile", value: formatOptionalNumber(data.fieldPercentile) },
            { label: "Top 1% Rate", value: data.topOnePercentRate !== null ? `${data.topOnePercentRate.toFixed(1)}%` : "—" },
            { label: "Cash Rate", value: data.cashRate !== null ? `${data.cashRate.toFixed(1)}%` : "—" },
          ]}
        />
      </Card>
    </section>
  );
}
