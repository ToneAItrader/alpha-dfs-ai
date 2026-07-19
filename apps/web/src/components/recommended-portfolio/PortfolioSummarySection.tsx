import { ConfidenceCard, ConfidenceSummary } from "@/components/ui/confidence";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  formatOptionalNumber,
  formatOptionalText,
  formatSalary,
} from "@/lib/format-display";
import type { RecommendedPortfolioViewModel } from "@/types/recommended-portfolio-view-model";

type PortfolioSummarySectionProps = {
  data: RecommendedPortfolioViewModel["portfolioSummary"];
};

export function PortfolioSummarySection({ data }: PortfolioSummarySectionProps) {
  return (
    <section aria-label="Portfolio summary">
      <SectionHeading title="Portfolio Summary" />
      <ConfidenceCard>
        <ConfidenceSummary
          columns={3}
          items={[
            { label: "Portfolio Grade", value: formatOptionalText(data.portfolioGrade) },
            {
              label: "Overall Confidence",
              value: formatOptionalNumber(data.overallConfidence),
            },
            {
              label: "Average Projection",
              value: formatOptionalNumber(data.averageProjection),
            },
            {
              label: "Average Ownership",
              value: formatOptionalNumber(data.averageOwnership, "%"),
            },
            { label: "Average Salary", value: formatSalary(data.averageSalary) },
            { label: "Average Risk", value: formatOptionalText(data.averageRisk) },
          ]}
        />
      </ConfidenceCard>
    </section>
  );
}
