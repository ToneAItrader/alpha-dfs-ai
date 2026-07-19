import { Card } from "@/components/ui/Card";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { ConfidenceBadge } from "@/components/ui/confidence";
import {
  formatOptionalNumber,
  formatOptionalText,
  formatSalary,
} from "@/lib/format-display";
import type { PlayerEvidenceItemViewModel } from "@/types/player-evidence-view-model";

type PlayerEvidenceCardProps = {
  player: PlayerEvidenceItemViewModel;
};

const injuryLabels: Record<NonNullable<PlayerEvidenceItemViewModel["injuryStatus"]>, string> = {
  healthy: "Healthy",
  questionable: "Questionable",
  doubtful: "Doubtful",
  out: "Out",
  unknown: "Unknown",
};

export function PlayerEvidenceCard({ player }: PlayerEvidenceCardProps) {
  return (
    <Card as="article">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{player.name}</h3>
          <p className="text-xs text-muted">
            {player.position} · {player.team} vs {player.opponent}
          </p>
        </div>
        {player.confidenceTier ? (
          <ConfidenceBadge label={player.confidenceTier} tier={player.confidenceTier} />
        ) : player.confidence !== null ? (
          <ConfidenceBadge label={formatOptionalNumber(player.confidence)} />
        ) : null}
      </div>
      <DetailGrid
        columns={2}
        items={[
          { label: "Salary", value: formatSalary(player.salary) },
          { label: "Projection", value: formatOptionalNumber(player.projectedPoints) },
          { label: "Confidence", value: formatOptionalNumber(player.confidence) },
          {
            label: "Injury Status",
            value: player.injuryStatus ? injuryLabels[player.injuryStatus] : "—",
          },
          { label: "Matchup", value: formatOptionalText(player.matchupSummary) },
          { label: "Ownership Outlook", value: formatOptionalText(player.ownershipOutlook) },
        ]}
      />
      <p className="mt-4 border-t border-surface-border pt-4 text-xs text-muted">
        {player.explainabilitySummary}
      </p>
    </Card>
  );
}
