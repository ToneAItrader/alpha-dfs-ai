import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { PortfolioReadinessPanel } from "@/components/portfolio-readiness/PortfolioReadinessPanel";
import { getAnalysisProvider } from "@/providers/analysis-provider";

export const metadata: Metadata = {
  title: "Portfolio Readiness",
  description:
    "Portfolio readiness assessment from PCE and PIE — confidence, data quality, health snapshot, and checklist.",
};

export default async function PortfolioReadinessPage() {
  const viewModel = await getAnalysisProvider().getPortfolioReadiness();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio Readiness"
        description="Readiness assessment from the Prediction Confidence Engine and Portfolio Intelligence Engine."
      />
      <PortfolioReadinessPanel viewModel={viewModel} />
    </div>
  );
}
