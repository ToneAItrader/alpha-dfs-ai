import { describe, expect, it } from "vitest";
import { computeMultiLineupExposure, exposureBalanceLabel } from "./multi-lineup-exposure";
import type { PortfolioCandidate } from "./portfolio-builder";

const player = (
  id: string,
  team: string,
  opponent: string,
  position: PortfolioCandidate["position"],
  salary: number,
): PortfolioCandidate => ({
  slatePlayerId: id,
  name: id,
  position,
  team,
  opponent,
  salary,
  projection: 15,
  floor: 8,
  ceiling: 22,
  ownershipEstimate: 10,
  confidenceScore: 75,
  confidenceTier: "moderate",
});

describe("computeMultiLineupExposure", () => {
  it("computes player, team, and stack exposure across two lineups", () => {
    const primary = [
      player("qb1", "BUF", "KC", "QB", 7000),
      player("rb1", "BUF", "KC", "RB", 6500),
      player("wr1", "BUF", "KC", "WR", 6000),
      player("wr2", "MIA", "NYJ", "WR", 5500),
      player("wr3", "CIN", "BAL", "WR", 5000),
      player("rb2", "DAL", "PHI", "RB", 4800),
      player("te1", "SF", "SEA", "TE", 4500),
      player("flex", "PHI", "DAL", "RB", 4200),
      player("dst", "BUF", "KC", "DST", 3000),
    ];
    const hailMary = [
      player("qb1", "BUF", "KC", "QB", 7000),
      player("rb3", "KC", "BUF", "RB", 6400),
      player("wr1", "BUF", "KC", "WR", 6000),
      player("wr4", "KC", "BUF", "WR", 5800),
      player("wr5", "NYJ", "MIA", "WR", 5200),
      player("rb4", "SEA", "SF", "RB", 4700),
      player("te2", "KC", "BUF", "TE", 4300),
      player("flex2", "BAL", "CIN", "WR", 4100),
      player("dst2", "KC", "BUF", "DST", 2900),
    ];

    const summary = computeMultiLineupExposure([primary, hailMary]);

    expect(summary.playerExposures.find((entry) => entry.playerId === "qb1")?.exposurePct).toBe(
      100,
    );
    expect(summary.teamExposures[0]?.team).toBe("BUF");
    expect(summary.stackExposures.length).toBeGreaterThan(0);
    expect(summary.salaryFlexibilityPct).toBeGreaterThan(0);
    expect(summary.warnings.length).toBeGreaterThan(0);
    expect(exposureBalanceLabel(summary)).toBe("Balanced");
  });
});
