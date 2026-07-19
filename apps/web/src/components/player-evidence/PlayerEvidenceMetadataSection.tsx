import { ConfidenceCard, ConfidenceSummary } from "@/components/ui/confidence";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  formatOptionalGrade,
  formatOptionalNumber,
  formatOptionalText,
} from "@/lib/format-display";
import type { PlayerEvidenceViewModel } from "@/types/player-evidence-view-model";

type ConfidenceSummarySectionProps = {
  data: PlayerEvidenceViewModel["confidenceSummary"];
};

export function ConfidenceSummarySection({ data }: ConfidenceSummarySectionProps) {
  return (
    <section aria-label="Confidence summary">
      <SectionHeading title="Confidence Summary" description="PCE outputs." />
      <ConfidenceCard>
        <ConfidenceSummary
          columns={4}
          items={[
            {
              label: "Overall Confidence",
              value: formatOptionalNumber(data.overallConfidence),
            },
            {
              label: "Projection Stability",
              value: formatOptionalNumber(data.projectionStability),
            },
            { label: "Variance", value: formatOptionalText(data.variance) },
            {
              label: "Reliability Grade",
              value: formatOptionalGrade(data.reliabilityGrade),
            },
          ]}
        />
      </ConfidenceCard>
    </section>
  );
}

type ExplainabilitySummarySectionProps = {
  insights: string[];
};

export function ExplainabilitySummarySection({ insights }: ExplainabilitySummarySectionProps) {
  return (
    <section aria-label="Explainability summary">
      <SectionHeading title="Explainability Summary" />
      <ConfidenceCard>
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
      </ConfidenceCard>
    </section>
  );
}

type AnalysisMetadataSectionProps = {
  data: PlayerEvidenceViewModel["metadata"];
};

export function AnalysisMetadataSection({ data }: AnalysisMetadataSectionProps) {
  return (
    <section aria-label="Analysis metadata">
      <SectionHeading title="Analysis Metadata" />
      <ConfidenceCard>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-muted">Analysis Version</dt>
            <dd className="text-sm font-semibold text-foreground">
              {formatOptionalText(data.analysisVersion)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted">Timestamp</dt>
            <dd className="text-sm font-semibold text-foreground">
              {formatOptionalText(data.timestamp)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted">Data Freshness</dt>
            <dd className="text-sm font-semibold text-foreground">
              {formatOptionalText(data.dataFreshness)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted">Evidence Version</dt>
            <dd className="text-sm font-semibold text-foreground">
              {formatOptionalText(data.evidenceVersion)}
            </dd>
          </div>
        </dl>
      </ConfidenceCard>
    </section>
  );
}
