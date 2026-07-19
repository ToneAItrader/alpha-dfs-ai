import type { VegasIntelligenceOutput } from "@alpha-dfs/shared";

export type VegasGameSnapshot = {
  home: string;
  away: string;
  spread?: number;
  total?: number;
  impliedHomeTotal?: number;
  impliedAwayTotal?: number;
  lineMovement?: number;
};

function expectedPace(total: number | undefined): "fast" | "moderate" | "slow" {
  if (total === undefined) return "moderate";
  if (total >= 48) return "fast";
  if (total >= 44) return "moderate";
  return "slow";
}

function paceLabel(pace: "fast" | "moderate" | "slow"): string {
  if (pace === "fast") return "Fast";
  if (pace === "slow") return "Slow";
  return "Moderate";
}

function formatSpread(spread: number | undefined, home: string): string {
  if (spread === undefined) return "—";
  const favorite = spread < 0 ? home : spread > 0 ? "Away" : "Pick'em";
  return `${favorite} ${Math.abs(spread).toFixed(1)}`;
}

/** Pure Vegas intelligence computation — unit-testable without I/O. */
export function computeVegasIntelligence(
  games: VegasGameSnapshot[],
  totalGames: number,
): VegasIntelligenceOutput {
  const marketGames = games.filter(
    (game) => game.total !== undefined || game.spread !== undefined,
  );
  const totals = marketGames
    .map((game) => game.total)
    .filter((total): total is number => total !== undefined);
  const averageTotal =
    totals.length === 0 ? null : Math.round((totals.reduce((sum, total) => sum + total, 0) / totals.length) * 10) / 10;
  const highTotalGames = totals.filter((total) => total >= 48).length;
  const lineMovementGames = marketGames.filter(
    (game) => game.lineMovement !== undefined && game.lineMovement !== 0,
  ).length;

  const marketCoverage =
    totalGames === 0 ? 0 : Math.round((marketGames.length / totalGames) * 100);

  const featuredGames = marketGames
    .slice()
    .sort((left, right) => (right.total ?? 0) - (left.total ?? 0))
    .slice(0, 3)
    .map((game, index) => {
      const pace = expectedPace(game.total);
      return {
        id: `vegas-game-${index + 1}`,
        matchup: `${game.away} @ ${game.home}`,
        spread: game.spread ?? null,
        total: game.total ?? null,
        impliedHomeTotal: game.impliedHomeTotal ?? null,
        impliedAwayTotal: game.impliedAwayTotal ?? null,
        lineMovement: game.lineMovement ?? null,
        expectedPace: pace,
        spreadLabel: formatSpread(game.spread, game.home),
        paceLabel: paceLabel(pace),
      };
    });

  const scoringEnvironment: VegasIntelligenceOutput["scoringEnvironment"] =
    averageTotal === null
      ? "moderate"
      : averageTotal >= 48
        ? "high"
        : averageTotal >= 44
          ? "moderate"
          : "low";

  const factors = [
    `${marketGames.length} of ${totalGames} slate games with Vegas market data`,
    averageTotal !== null ? `Average game total ${averageTotal}` : "Game totals unavailable",
    `${highTotalGames} games with elevated totals (48+)`,
    `${lineMovementGames} games with meaningful line movement`,
    `Market data coverage at ${marketCoverage}%`,
  ];

  const assessment =
    scoringEnvironment === "high"
      ? "Elevated scoring environment — prioritize high-total game stacks and bring-back correlations."
      : scoringEnvironment === "low"
        ? "Lower implied scoring — favor efficient floor plays and conservative game environments."
        : "Balanced scoring environment — standard game selection and stack construction apply.";

  return {
    featuredGames,
    averageTotal,
    highTotalGames,
    lineMovementGames,
    marketCoverage,
    scoringEnvironment,
    assessment,
    factors,
  };
}
