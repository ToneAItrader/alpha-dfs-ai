import { Card } from "@/components/ui/Card";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatOptionalText } from "@/lib/format-display";
import type { SimulationResultsViewModel } from "@/types/simulation-results-view-model";

type SimulationInsightsSectionProps = {
  insights: string[];
};

export function SimulationInsightsSection({ insights }: SimulationInsightsSectionProps) {
  return (
    <section aria-label="Simulation insights">
      <SectionHeading title="Simulation Insights" />
      <Card>
        <ul className="space-y-2">
          {insights.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-foreground before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-accent before:content-['']"
            >
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}

type AnalysisMetadataSectionProps = {
  data: SimulationResultsViewModel["metadata"];
};

export function AnalysisMetadataSection({ data }: AnalysisMetadataSectionProps) {
  return (
    <section aria-label="Analysis metadata">
      <SectionHeading title="Analysis Metadata" />
      <Card>
        <DetailGrid
          columns={2}
          items={[
            { label: "Simulation Version", value: formatOptionalText(data.simulationVersion) },
            { label: "Timestamp", value: formatOptionalText(data.timestamp) },
            { label: "Data Freshness", value: formatOptionalText(data.dataFreshness) },
            { label: "Portfolio Version", value: formatOptionalText(data.portfolioVersion) },
          ]}
        />
      </Card>
    </section>
  );
}
