import { describe, expect, it } from "vitest";
import { computeInjuryIntelligence } from "./compute-injury-intelligence";

describe("computeInjuryIntelligence", () => {
  it("aggregates injury counts and coverage", () => {
    const output = computeInjuryIntelligence([
      {
        name: "A",
        position: "RB",
        team: "DAL",
        salary: 7000,
        injuryStatus: "questionable",
        domains: { injury: true },
      },
      {
        name: "B",
        position: "WR",
        team: "PHI",
        salary: 6500,
        injuryStatus: "out",
        domains: { injury: true },
      },
      {
        name: "C",
        position: "RB",
        team: "DAL",
        salary: 4500,
        injuryStatus: "healthy",
        domains: { injury: true },
      },
    ]);

    expect(output.majorInjuries).toBe(1);
    expect(output.questionablePlayers).toBe(1);
    expect(output.outPlayers).toBe(1);
    expect(output.injuryCoverage).toBe(100);
    expect(output.factors.length).toBeGreaterThan(0);
  });
});
