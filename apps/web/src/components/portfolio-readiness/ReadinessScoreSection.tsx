import { SummaryCard } from "@/components/ui/SummaryCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  formatLastAnalysis,
  formatOptionalGrade,
  formatOptionalNumber,
  formatReadinessStatus,
} from "@/lib/format-display";
import type { PortfolioReadinessViewModel } from "@/types/portfolio-readiness-view-model";

type ReadinessScoreSectionProps = {
  data: PortfolioReadinessViewModel["readinessScore"];
};

export function ReadinessScoreSection({ data }: ReadinessScoreSectionProps) {
  return (
    <section aria-label="Portfolio readiness score">
      <SectionHeading title="Portfolio Readiness Score" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Overall Readiness Score"
          value={formatOptionalNumber(data.overallReadinessScore)}
        />
        <SummaryCard
          label="Readiness Grade"
          value={formatOptionalGrade(data.readinessGrade)}
        />
        <SummaryCard label="Status" value={formatReadinessStatus(data.status)} />
        <SummaryCard label="Last Analysis" value={formatLastAnalysis(data.lastAnalysisAt)} />
      </div>
    </section>
  );
}
