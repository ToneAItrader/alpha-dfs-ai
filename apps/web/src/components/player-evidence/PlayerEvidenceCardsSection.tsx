import { Card } from "@/components/ui/Card";
import { PlayerEvidenceCard } from "@/components/ui/PlayerEvidenceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import type { PlayerEvidenceViewModel } from "@/types/player-evidence-view-model";

type PlayerEvidenceCardsSectionProps = {
  players: PlayerEvidenceViewModel["players"];
  filters: PlayerEvidenceViewModel["filters"];
};

export function PlayerEvidenceCardsSection({
  players,
  filters,
}: PlayerEvidenceCardsSectionProps) {
  return (
    <section aria-label="Player evidence cards">
      <SectionHeading
        title="Player Evidence"
        description="Evidence packages for recommended slate players."
      />
      <Card className="mb-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Filters
        </p>
        <div className="flex flex-wrap gap-2">
          {filters.positions.map((position) => (
            <FilterChip key={position} label={position} />
          ))}
          {filters.confidenceTiers.map((tier) => (
            <FilterChip key={tier} label={tier} variant="tier" />
          ))}
        </div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {players.map((player) => (
          <PlayerEvidenceCard key={player.playerId} player={player} />
        ))}
      </div>
    </section>
  );
}

function FilterChip({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "tier";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1",
        variant === "tier"
          ? "bg-surface text-muted ring-surface-border"
          : "bg-accent/10 text-accent ring-accent/30",
      )}
    >
      {label}
    </span>
  );
}
