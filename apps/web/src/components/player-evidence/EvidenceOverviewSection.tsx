import { SummaryCard } from "@/components/ui/SummaryCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatLastAnalysis } from "@/lib/format-display";
import type { PlayerEvidenceViewModel } from "@/types/player-evidence-view-model";

type EvidenceOverviewSectionProps = {
  data: PlayerEvidenceViewModel["overview"];
};

export function EvidenceOverviewSection({ data }: EvidenceOverviewSectionProps) {
  return (
    <section aria-label="Evidence overview">
      <SectionHeading title="Evidence Overview" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="Total Players" value={String(data.totalPlayers)} />
        <SummaryCard
          label="High Confidence Players"
          value={String(data.highConfidencePlayers)}
        />
        <SummaryCard
          label="Moderate Confidence Players"
          value={String(data.moderateConfidencePlayers)}
        />
        <SummaryCard label="Low Confidence Players" value={String(data.lowConfidencePlayers)} />
        <SummaryCard label="Last Analysis" value={formatLastAnalysis(data.lastAnalysisAt)} />
      </div>
    </section>
  );
}
