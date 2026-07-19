import { describe, expect, it } from "vitest";
import { computeVegasIntelligence } from "./compute-vegas-intelligence";

describe("computeVegasIntelligence", () => {
  it("ranks featured games by total and computes market coverage", () => {
    const output = computeVegasIntelligence(
      [
        {
          home: "BUF",
          away: "KC",
          spread: -2.5,
          total: 48.5,
          impliedHomeTotal: 25.5,
          impliedAwayTotal: 23.0,
          lineMovement: 1.0,
        },
        {
          home: "DAL",
          away: "PHI",
          spread: 3.0,
          total: 51.0,
          impliedHomeTotal: 24.0,
          impliedAwayTotal: 27.0,
          lineMovement: -0.5,
        },
        {
          home: "MIA",
          away: "NYJ",
          total: 42.0,
        },
      ],
      5,
    );

    expect(output.featuredGames[0]?.matchup).toBe("PHI @ DAL");
    expect(output.featuredGames[0]?.total).toBe(51.0);
    expect(output.marketCoverage).toBe(60);
    expect(output.highTotalGames).toBe(2);
    expect(output.lineMovementGames).toBe(2);
    expect(output.scoringEnvironment).toBe("moderate");
    expect(output.factors.length).toBeGreaterThan(0);
  });
});
