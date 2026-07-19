import { SummaryCard } from "@/components/ui/SummaryCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPortfolioStatus, formatTimestamp } from "@/lib/format-display";
import type { RecommendedPortfolioViewModel } from "@/types/recommended-portfolio-view-model";

type PortfolioOverviewSectionProps = {
  data: RecommendedPortfolioViewModel["portfolioOverview"];
};

export function PortfolioOverviewSection({ data }: PortfolioOverviewSectionProps) {
  return (
    <section aria-label="Portfolio overview">
      <SectionHeading title="Portfolio Overview" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="Total Portfolios" value={String(data.totalPortfolios)} />
        <SummaryCard label="Primary Portfolios" value={String(data.primaryCount)} />
        <SummaryCard label="Hail Mary Portfolios" value={String(data.hailMaryCount)} />
        <SummaryCard
          label="Generation Timestamp"
          value={formatTimestamp(data.generationTimestamp)}
        />
        <SummaryCard
          label="Portfolio Status"
          value={formatPortfolioStatus(data.portfolioStatus)}
        />
      </div>
    </section>
  );
}
