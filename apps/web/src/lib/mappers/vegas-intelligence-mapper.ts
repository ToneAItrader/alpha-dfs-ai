import type { VegasIntelligenceResponseDto } from "@/types/dto/analysis-responses.dto";
import type { SlateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

function formatTotal(total: number | null | undefined): string {
  if (total === null || total === undefined) return "—";
  return total.toFixed(1);
}

/** Maps Vegas Intelligence DTO → Slate Intelligence featured games section. */
export function mapVegasIntelligenceFeaturedGames(
  dto: VegasIntelligenceResponseDto | undefined,
): {
  games: SlateIntelligencePlaceholderData["featuredGames"];
  isLive: boolean;
} {
  if (!dto?.featuredGames?.length) {
    return {
      games: slateIntelligencePlaceholderData.featuredGames,
      isLive: false,
    };
  }

  return {
    isLive: true,
    games: dto.featuredGames.map((game) => ({
      id: game.id,
      matchup: game.matchup,
      vegasTotal: formatTotal(game.total),
      spread: game.spreadLabel ?? "—",
      expectedPace: game.paceLabel ?? "—",
    })),
  };
}
