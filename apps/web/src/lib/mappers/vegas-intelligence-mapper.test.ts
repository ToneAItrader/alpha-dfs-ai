import { describe, expect, it } from "vitest";
import { mapVegasIntelligenceFeaturedGames } from "./vegas-intelligence-mapper";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

describe("vegas-intelligence-mapper", () => {
  it("falls back to placeholders when DTO is absent", () => {
    const viewModel = mapVegasIntelligenceFeaturedGames(undefined);

    expect(viewModel.isLive).toBe(false);
    expect(viewModel.games).toEqual(slateIntelligencePlaceholderData.featuredGames);
  });

  it("maps live featured games from DTO", () => {
    const viewModel = mapVegasIntelligenceFeaturedGames({
      featuredGames: [
        {
          id: "vegas-game-1",
          matchup: "KC @ BUF",
          spread: -2.5,
          total: 48.5,
          impliedHomeTotal: 25.5,
          impliedAwayTotal: 23.0,
          lineMovement: 1.0,
          expectedPace: "fast",
          spreadLabel: "BUF 2.5",
          paceLabel: "Fast",
        },
      ],
    });

    expect(viewModel.isLive).toBe(true);
    expect(viewModel.games[0]).toEqual({
      id: "vegas-game-1",
      matchup: "KC @ BUF",
      vegasTotal: "48.5",
      spread: "BUF 2.5",
      expectedPace: "Fast",
    });
  });
});
