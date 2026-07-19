import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SlateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

type FeaturedGamesSectionProps = {
  games?: SlateIntelligencePlaceholderData["featuredGames"];
};

export function FeaturedGamesSection({
  games = slateIntelligencePlaceholderData.featuredGames,
}: FeaturedGamesSectionProps) {
  return (
    <section aria-label="Featured games">
      <SectionHeading title="Featured Games" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => (
          <Card key={game.id} as="article">
            <h3 className="text-sm font-semibold text-foreground">{game.matchup}</h3>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted">Vegas Total</dt>
                <dd className="font-medium text-foreground">{game.vegasTotal}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Spread</dt>
                <dd className="font-medium text-foreground">{game.spread}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-muted">Expected Pace</dt>
                <dd className="font-medium text-foreground">{game.expectedPace}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>
    </section>
  );
}
