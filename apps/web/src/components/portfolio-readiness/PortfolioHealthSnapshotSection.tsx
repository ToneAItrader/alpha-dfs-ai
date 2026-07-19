import { Card } from "@/components/ui/Card";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatOptionalGrade, formatOptionalText } from "@/lib/format-display";
import type { PortfolioReadinessViewModel } from "@/types/portfolio-readiness-view-model";

type PortfolioHealthSnapshotSectionProps = {
  data: PortfolioReadinessViewModel["portfolioHealthSnapshot"];
};

export function PortfolioHealthSnapshotSection({
  data,
}: PortfolioHealthSnapshotSectionProps) {
  return (
    <section aria-label="Portfolio health snapshot">
      <SectionHeading
        title="Portfolio Health Snapshot"
        description="PIE portfolio health metrics (placeholder)."
      />
      <Card>
        <DetailGrid
          columns={3}
          items={[
            { label: "Portfolio Grade", value: formatOptionalGrade(data.portfolioGrade) },
            { label: "Risk", value: formatOptionalText(data.risk) },
            { label: "Exposure Balance", value: formatOptionalText(data.exposureBalance) },
            { label: "Stack Diversity", value: formatOptionalText(data.stackDiversity) },
            { label: "Salary Distribution", value: formatOptionalText(data.salaryDistribution) },
            { label: "Leverage", value: formatOptionalText(data.leverage) },
          ]}
        />
      </Card>
    </section>
  );
}
