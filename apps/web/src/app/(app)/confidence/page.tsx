import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConfidenceIndicatorsPanel } from "@/components/confidence-indicators/ConfidenceIndicatorsPanel";
import { getAnalysisProvider } from "@/providers/analysis-provider";

export const metadata: Metadata = {
  title: "Confidence Indicators",
  description:
    "Prediction Confidence Engine outputs — shared presentation components for reuse across analysis pages (display only).",
};

export default async function ConfidencePage() {
  const viewModel = await getAnalysisProvider().getConfidenceIndicators();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Confidence Indicators"
        description="PCE presentation layer — confidence, stability, data quality, and model agreement for development and validation."
      />
      <ConfidenceIndicatorsPanel viewModel={viewModel} showComponentShowcase />
    </div>
  );
}
