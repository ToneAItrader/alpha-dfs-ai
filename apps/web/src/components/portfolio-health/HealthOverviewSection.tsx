import { ConfidenceBadge, ConfidenceSummary } from "@/components/ui/confidence";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatLastAnalysis, formatOptionalGrade, formatOptionalNumber } from "@/lib/format-display";
import type { PortfolioHealthViewModel } from "@/types/portfolio-health-view-model";

const statusLabels = {
  idle: "Idle",
  healthy: "Healthy",
  review: "Review",
  warning: "Warning",
} as const;

type HealthOverviewSectionProps = {
  data: PortfolioHealthViewModel["overview"];
};

export function HealthOverviewSection({ data }: HealthOverviewSectionProps) {
  return (
    <section aria-label="Portfolio health overview">
      <SectionHeading title="Portfolio Health Overview" />
      <div className="mb-4 flex flex-wrap gap-2">
        {data.portfolioGrade ? (
          <ConfidenceBadge label={`Grade ${data.portfolioGrade}`} />
        ) : null}
        <ConfidenceBadge label={statusLabels[data.overallStatus]} />
      </div>
      <ConfidenceSummary
        items={[
          {
            label: "Overall Health Score",
            value: formatOptionalNumber(data.overallHealthScore),
          },
          {
            label: "Portfolio Grade",
            value: formatOptionalGrade(data.portfolioGrade),
          },
          {
            label: "Overall Status",
            value: statusLabels[data.overallStatus],
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
