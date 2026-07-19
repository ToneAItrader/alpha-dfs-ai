import { HailMaryLineupCard, PrimaryLineupCard } from "@/components/ui/LineupCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type {
  HailMaryLineupViewModel,
  PrimaryLineupViewModel,
} from "@/types/recommended-portfolio-view-model";

type PrimaryPortfolioSectionProps = {
  lineups: PrimaryLineupViewModel[];
};

export function PrimaryPortfolioSection({ lineups }: PrimaryPortfolioSectionProps) {
  return (
    <section aria-label="Primary portfolio">
      <SectionHeading
        title="Primary Portfolio"
        description="3–5 lineups maximizing expected value (PIE Strategy A)."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {lineups.map((lineup) => (
          <PrimaryLineupCard key={lineup.lineupId} lineup={lineup} />
        ))}
      </div>
    </section>
  );
}

type HailMaryPortfolioSectionProps = {
  lineups: HailMaryLineupViewModel[];
};

export function HailMaryPortfolioSection({ lineups }: HailMaryPortfolioSectionProps) {
  return (
    <section aria-label="Hail Mary portfolio">
      <SectionHeading
        title="Hail Mary Portfolio"
        description="2–3 high-upside GPP lineups (PIE Strategy B)."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {lineups.map((lineup) => (
          <HailMaryLineupCard key={lineup.lineupId} lineup={lineup} />
        ))}
      </div>
    </section>
  );
}
