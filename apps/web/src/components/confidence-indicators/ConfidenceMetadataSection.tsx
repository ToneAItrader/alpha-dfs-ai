import { Card } from "@/components/ui/Card";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatOptionalText } from "@/lib/format-display";
import type { ConfidenceIndicatorsViewModel } from "@/types/confidence-indicators-view-model";

type ConfidenceInsightsSectionProps = {
  insights: string[];
};

export function ConfidenceInsightsSection({ insights }: ConfidenceInsightsSectionProps) {
  return (
    <section aria-label="Confidence insights">
      <SectionHeading title="Confidence Insights" />
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
  data: ConfidenceIndicatorsViewModel["metadata"];
};

export function AnalysisMetadataSection({ data }: AnalysisMetadataSectionProps) {
  return (
    <section aria-label="Analysis metadata">
      <SectionHeading title="Analysis Metadata" />
      <Card>
        <DetailGrid
          columns={2}
          items={[
            { label: "Confidence Version", value: formatOptionalText(data.confidenceVersion) },
            { label: "Timestamp", value: formatOptionalText(data.timestamp) },
            { label: "Data Freshness", value: formatOptionalText(data.dataFreshness) },
            { label: "Analysis Version", value: formatOptionalText(data.analysisVersion) },
          ]}
        />
      </Card>
    </section>
  );
}
