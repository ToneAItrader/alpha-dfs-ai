import { Card } from "@/components/ui/Card";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatOptionalText, formatTimestamp } from "@/lib/format-display";
import type { RecommendedPortfolioViewModel } from "@/types/recommended-portfolio-view-model";

type GenerationMetadataSectionProps = {
  data: RecommendedPortfolioViewModel["generationMetadata"];
};

export function GenerationMetadataSection({ data }: GenerationMetadataSectionProps) {
  return (
    <section aria-label="Generation metadata">
      <SectionHeading title="Generation Metadata" />
      <Card>
        <DetailGrid
          columns={2}
          items={[
            { label: "Analysis Version", value: formatOptionalText(data.analysisVersion) },
            { label: "Generation Time", value: formatTimestamp(data.generationTime) },
            {
              label: "Simulation Status",
              value: formatOptionalText(data.simulationStatus),
            },
            { label: "Data Freshness", value: formatOptionalText(data.dataFreshness) },
          ]}
        />
      </Card>
    </section>
  );
}

type ExplainabilityInsightsSectionProps = {
  insights: string[];
  recommendations?: string[];
};

export function ExplainabilityInsightsSection({
  insights,
  recommendations = [],
}: ExplainabilityInsightsSectionProps) {
  return (
    <section aria-label="Explainability summary">
      <SectionHeading title="Explainability Summary" />
      <Card>
        <ul className="space-y-2">
          {insights.map((insight) => (
            <li
              key={insight}
              className="flex items-start gap-2 text-sm text-foreground before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-accent before:content-['']"
            >
              {insight}
            </li>
          ))}
        </ul>
        {recommendations.length > 0 ? (
          <div className="mt-6 border-t border-surface-border pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Recommendations
            </p>
            <ul className="space-y-2">
              {recommendations.map((item) => (
                <li key={item} className="text-sm text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>
    </section>
  );
}
