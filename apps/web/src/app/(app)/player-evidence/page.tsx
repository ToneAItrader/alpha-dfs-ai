import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlayerEvidencePanel } from "@/components/player-evidence/PlayerEvidencePanel";
import { getAnalysisProvider } from "@/providers/analysis-provider";

export const metadata: Metadata = {
  title: "Player Evidence",
  description:
    "Player evidence packages from the Evidence Engine and PCE — display only.",
};

export default async function PlayerEvidencePage() {
  const viewModel = await getAnalysisProvider().getPlayerEvidence();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Player Evidence"
        description="Explainability for every recommended player — evidence packages, confidence, and supporting sources."
      />
      <PlayerEvidencePanel viewModel={viewModel} />
    </div>
  );
}
