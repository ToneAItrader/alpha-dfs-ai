import { describe, expect, it } from "vitest";
import { buildPortfolioOutput, type PortfolioCandidate } from "./portfolio-builder";

/** Mirrors packages/database/prisma/seed-data.ts — known valid $49,900 lineup exists. */
const CANDIDATES: PortfolioCandidate[] = [
  { slatePlayerId: "p1", name: "Player One", position: "QB", team: "BUF", salary: 7200, projection: 18.5, floor: 14.2, ceiling: 24.8, ownershipEstimate: 12, confidenceScore: 85, confidenceTier: "high" },
  { slatePlayerId: "p2", name: "Player Two", position: "RB", team: "DAL", salary: 7600, projection: 19.5, floor: 12.0, ceiling: 28.0, ownershipEstimate: 15, confidenceScore: 82, confidenceTier: "high" },
  { slatePlayerId: "p3", name: "Player Three", position: "WR", team: "MIA", salary: 8000, projection: 20.5, floor: 11.5, ceiling: 30.2, ownershipEstimate: 18, confidenceScore: 80, confidenceTier: "high" },
  { slatePlayerId: "p4", name: "Player Four", position: "TE", team: "SF", salary: 8400, projection: 21.5, floor: 10.0, ceiling: 32.0, ownershipEstimate: 10, confidenceScore: 76, confidenceTier: "moderate" },
  { slatePlayerId: "p5", name: "Player Five", position: "WR", team: "CIN", salary: 8800, projection: 22.5, floor: 9.5, ceiling: 34.0, ownershipEstimate: 14, confidenceScore: 77, confidenceTier: "moderate" },
  { slatePlayerId: "p6", name: "Player Six", position: "QB", team: "KC", salary: 7000, projection: 17.8, floor: 13.5, ceiling: 23.0, ownershipEstimate: 8, confidenceScore: 80, confidenceTier: "high" },
  { slatePlayerId: "p7", name: "Player Seven", position: "RB", team: "PHI", salary: 6800, projection: 16.2, floor: 10.5, ceiling: 24.0, ownershipEstimate: 11, confidenceScore: 78, confidenceTier: "moderate" },
  { slatePlayerId: "p8", name: "Player Eight", position: "RB", team: "MIA", salary: 6200, projection: 14.8, floor: 9.0, ceiling: 22.5, ownershipEstimate: 9, confidenceScore: 75, confidenceTier: "moderate" },
  { slatePlayerId: "p9", name: "Player Nine", position: "WR", team: "SF", salary: 5900, projection: 13.5, floor: 8.0, ceiling: 21.0, ownershipEstimate: 7, confidenceScore: 72, confidenceTier: "moderate" },
  { slatePlayerId: "p10", name: "Player Ten", position: "WR", team: "DAL", salary: 5600, projection: 12.8, floor: 7.5, ceiling: 20.0, ownershipEstimate: 6, confidenceScore: 70, confidenceTier: "moderate" },
  { slatePlayerId: "p11", name: "Player Eleven", position: "TE", team: "BUF", salary: 4800, projection: 11.2, floor: 6.5, ceiling: 17.5, ownershipEstimate: 5, confidenceScore: 74, confidenceTier: "moderate" },
  { slatePlayerId: "p12", name: "Player Twelve", position: "WR", team: "CIN", salary: 5200, projection: 12.0, floor: 7.0, ceiling: 19.5, ownershipEstimate: 4, confidenceScore: 68, confidenceTier: "moderate" },
  { slatePlayerId: "p13", name: "Player Thirteen", position: "RB", team: "SF", salary: 5400, projection: 12.5, floor: 7.2, ceiling: 20.5, ownershipEstimate: 5, confidenceScore: 73, confidenceTier: "moderate" },
  { slatePlayerId: "p14", name: "Bills DST", position: "DST", team: "BUF", salary: 3200, projection: 8.5, floor: 4.0, ceiling: 14.0, ownershipEstimate: 8, confidenceScore: 65, confidenceTier: "moderate" },
  { slatePlayerId: "p15", name: "Chiefs DST", position: "DST", team: "KC", salary: 3000, projection: 7.8, floor: 3.5, ceiling: 13.0, ownershipEstimate: 6, confidenceScore: 63, confidenceTier: "moderate" },
];

describe("Portfolio Intelligence heuristic builder", () => {
  it("builds primary and hail mary lineups", () => {
    const output = buildPortfolioOutput({ candidates: CANDIDATES, confidenceScore: 78 });

    expect(output.primaryLineups.length).toBeGreaterThan(0);
    expect(output.hailMaryLineups.length).toBeGreaterThan(0);
    expect(output.version).toBe("pie-2.0-exposure");
    expect(output.exposureSummary?.playerExposures.length).toBeGreaterThan(0);
    expect(output.exposureSummary?.teamExposures.length).toBeGreaterThan(0);
    expect(output.primaryLineups[0]?.salaryUsed).toBeLessThanOrEqual(50000);
  });
});
