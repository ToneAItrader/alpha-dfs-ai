import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { SimulationResultsPanel } from "@/components/simulation-results/SimulationResultsPanel";
import { getAnalysisProvider } from "@/providers/analysis-provider";

export const metadata: Metadata = {
  title: "Simulation Results",
  description:
    "Monte Carlo simulation output from the Portfolio Simulation Engine — projections, probabilities, and distribution (display only).",
};

export default async function SimulationPage() {
  const viewModel = await getAnalysisProvider().getSimulationResults();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Simulation Results"
        description="Portfolio simulation outcomes — median projection, ceiling, floor, cash rate, tournament upside, and stability."
      />
      <SimulationResultsPanel viewModel={viewModel} />
    </div>
  );
}
