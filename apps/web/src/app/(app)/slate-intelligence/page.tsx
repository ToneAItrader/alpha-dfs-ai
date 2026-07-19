import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { SlateIntelligencePanel } from "@/components/slate-intelligence/SlateIntelligencePanel";
import { getAnalysisProvider } from "@/providers/analysis-provider";

export const metadata: Metadata = {
  title: "Slate Intelligence",
  description:
    "Slate-wide intelligence from the Slate Intelligence Agent — grade, strategy, injuries, weather, ownership, and featured games.",
};

export default async function SlateIntelligencePage() {
  const viewModel = await getAnalysisProvider().getSlateIntelligence();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Slate Intelligence"
        description="Slate-wide context produced by the Slate Intelligence Agent before player evaluation."
      />
      <SlateIntelligencePanel viewModel={viewModel} />
    </div>
  );
}
