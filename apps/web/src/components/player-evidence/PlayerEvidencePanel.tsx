import { playerEvidencePlaceholder } from "@/config/player-evidence-placeholders";
import { EvidenceOverviewSection } from "@/components/player-evidence/EvidenceOverviewSection";
import { EvidenceSourcesSection } from "@/components/player-evidence/EvidenceSourcesSection";
import { PlayerEvidenceCardsSection } from "@/components/player-evidence/PlayerEvidenceCardsSection";
import {
  AnalysisMetadataSection,
  ConfidenceSummarySection,
  ExplainabilitySummarySection,
} from "@/components/player-evidence/PlayerEvidenceMetadataSection";
import type { PlayerEvidenceViewModel } from "@/types/player-evidence-view-model";

type PlayerEvidencePanelProps = {
  viewModel?: PlayerEvidenceViewModel;
};

export function PlayerEvidencePanel({
  viewModel = playerEvidencePlaceholder,
}: PlayerEvidencePanelProps) {
  return (
    <div className="space-y-8">
      <EvidenceOverviewSection data={viewModel.overview} />
      <PlayerEvidenceCardsSection
        players={viewModel.players}
        filters={viewModel.filters}
      />
      <EvidenceSourcesSection categories={viewModel.evidenceSourceCategories} />
      <ConfidenceSummarySection data={viewModel.confidenceSummary} />
      <ExplainabilitySummarySection insights={viewModel.explainabilitySummary} />
      <AnalysisMetadataSection data={viewModel.metadata} />
    </div>
  );
}
