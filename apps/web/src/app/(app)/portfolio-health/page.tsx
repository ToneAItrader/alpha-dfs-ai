import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { PortfolioHealthPanel } from "@/components/portfolio-health/PortfolioHealthPanel";
import { getAnalysisProvider } from "@/providers/analysis-provider";

export const metadata: Metadata = {
  title: "Portfolio Health",
  description:
    "Portfolio health metrics from PIE — exposure, diversity, ownership, salary, and risk (display only).",
};

export default async function PortfolioHealthPage() {
  const viewModel = await getAnalysisProvider().getPortfolioHealth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio Health"
        description="Portfolio-grade metrics from the Portfolio Intelligence Engine — exposure balance, stack diversity, and risk profile."
      />
      <PortfolioHealthPanel viewModel={viewModel} />
    </div>
  );
}
