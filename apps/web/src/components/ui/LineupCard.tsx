import { ConfidenceBadge } from "@/components/ui/confidence";
import { Card } from "@/components/ui/Card";
import { DetailGrid } from "@/components/ui/DetailGrid";
import {
  formatOptionalNumber,
  formatOptionalText,
  formatSalary as formatSalaryDisplay,
} from "@/lib/format-display";
import type {
  HailMaryLineupViewModel,
  PrimaryLineupViewModel,
} from "@/types/recommended-portfolio-view-model";

type PrimaryLineupCardProps = {
  lineup: PrimaryLineupViewModel;
};

export function PrimaryLineupCard({ lineup }: PrimaryLineupCardProps) {
  return (
    <Card as="article" aria-label={`Primary lineup rank ${lineup.rank}`}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          Primary · Rank {lineup.rank}
        </h3>
        <div className="flex items-center gap-2">
          {lineup.confidence !== null ? (
            <ConfidenceBadge label={formatOptionalNumber(lineup.confidence)} />
          ) : null}
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent ring-1 ring-accent/30">
            PIE
          </span>
        </div>
      </div>
      <DetailGrid
        columns={2}
        items={[
          { label: "Projected Points", value: formatOptionalNumber(lineup.projectedPoints) },
          { label: "Confidence", value: formatOptionalNumber(lineup.confidence) },
          { label: "Salary", value: formatSalaryDisplay(lineup.salaryUsed) },
          { label: "Ownership", value: formatOptionalNumber(lineup.ownership, "%") },
          { label: "Risk", value: formatOptionalText(lineup.risk) },
          { label: "Correlation", value: formatOptionalText(lineup.correlation) },
        ]}
      />
      <p className="mt-4 border-t border-surface-border pt-4 text-xs text-muted">
        {lineup.explainabilitySummary}
      </p>
    </Card>
  );
}

type HailMaryLineupCardProps = {
  lineup: HailMaryLineupViewModel;
};

export function HailMaryLineupCard({ lineup }: HailMaryLineupCardProps) {
  return (
    <Card as="article" aria-label={`Hail Mary lineup rank ${lineup.rank}`}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          Hail Mary · Rank {lineup.rank}
        </h3>
        <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning ring-1 ring-warning/30">
          GPP
        </span>
      </div>
      <DetailGrid
        columns={2}
        items={[
          { label: "Ceiling", value: formatOptionalNumber(lineup.ceiling) },
          { label: "Leverage", value: formatOptionalNumber(lineup.leverage) },
          { label: "Ownership", value: formatOptionalNumber(lineup.ownership, "%") },
          { label: "Risk", value: formatOptionalText(lineup.risk) },
          {
            label: "Contrarian Rating",
            value: formatOptionalText(lineup.contrarianRating),
          },
        ]}
      />
      <p className="mt-4 border-t border-surface-border pt-4 text-xs text-muted">
        {lineup.explainabilitySummary}
      </p>
    </Card>
  );
}
