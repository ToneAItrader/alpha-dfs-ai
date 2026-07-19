import { describe, expect, it } from "vitest";
import type { ConfidenceEngineOutput, PlayerAnalysisOutput, PortfolioEngineOutput } from "@alpha-dfs/shared";
import { runPortfolioSimulation } from "./monte-carlo";

const FIXTURE_PORTFOLIO: PortfolioEngineOutput = {
  healthScore: 84,
  portfolioGrade: "B",
  exposure: { qbExposure: "Balanced", rbExposure: "Moderate", wrExposure: "Balanced", teExposure: "Low", dstExposure: "Diversified" },
  diversity: { numberOfStacks: 4, teamDiversity: "High", opponentDiversity: "Moderate", correlationScore: "0.42" },
  ownership: { averageOwnership: 14.2, chalkExposure: "Moderate", contrarianExposure: "Balanced", leverageBalance: "Strong" },
  salary: { averageSalaryUsed: 49800, remainingSalary: 200, salaryEfficiency: "Optimal", salaryBalance: "Balanced" },
  risk: { overallRisk: "Moderate", floor: 118.5, ceiling: 162.3, variance: "Medium" },
  recommendations: [],
  primaryLineups: [{
    lineupId: "primary-1", portfolioType: "primary", rank: 1,
    projectedFantasyPoints: 145, confidenceScore: 80, confidenceTier: "high",
    riskScore: "Low", ownershipEstimate: 14, correlationScore: "0.38",
    salaryUsed: 49800, leverageScore: 1.2, ceilingRating: null, contrarianRating: null,
    optimizerRationale: "Primary lineup #1",
  }],
  hailMaryLineups: [],
  version: "portfolio-test",
};

const FIXTURE_PLAYERS: PlayerAnalysisOutput = {
  totalPlayers: 1,
  highConfidencePlayers: 1,
  moderateConfidencePlayers: 0,
  lowConfidencePlayers: 0,
  players: [{
    slatePlayerId: "p1", name: "Player One", position: "QB", team: "BUF", opponent: "KC",
    salary: 7200, projection: 18.5, confidenceScore: 85, confidenceTier: "high",
    risk: "Low", injuryStatus: "healthy", matchupSummary: "Favorable",
    ownershipEstimate: 12, supportingRationale: "Test", evidenceSources: ["historical_performance"],
  }],
  evidenceSourceStatuses: { historical_performance: "available" },
};

const FIXTURE_CONFIDENCE: ConfidenceEngineOutput = {
  overallConfidence: 78, confidenceGrade: "B", stabilityScore: 72,
  projectionConsistency: "Stable", variance: "medium", reliability: "B",
  dataCompleteness: 92, injuryCoverage: "Available", weatherCoverage: "Available",
  marketCoverage: "Partial", expertConsensus: "Available", internalAgreement: "High",
  externalAgreement: "Moderate", historicalAgreement: "High", overallAgreement: "Strong",
  insights: [], version: "pce-test",
};

describe("Portfolio Simulation Engine", () => {
  it("runs Monte Carlo simulation with deterministic seed", () => {
    const result = runPortfolioSimulation({
      playerAnalysis: FIXTURE_PLAYERS,
      portfolio: FIXTURE_PORTFOLIO,
      confidence: FIXTURE_CONFIDENCE,
      simulationCount: 200,
      fieldSize: 50,
      seed: 42,
    });

    expect(result.simulationCount).toBe(200);
    expect(result.medianProjection).toBeGreaterThan(0);
    expect(result.floorProjection).toBeLessThanOrEqual(result.medianProjection);
    expect(result.ceilingProjection).toBeGreaterThanOrEqual(result.medianProjection);
    expect(result.fieldSize).toBe(50);
    expect(result.fieldPercentile).toBeGreaterThanOrEqual(0);
    expect(result.version).toBe("sim-2.0-gpp-field");
  });

  it("produces identical results with same seed", () => {
    const input = {
      playerAnalysis: FIXTURE_PLAYERS,
      portfolio: FIXTURE_PORTFOLIO,
      confidence: FIXTURE_CONFIDENCE,
      simulationCount: 100,
      fieldSize: 40,
      seed: 99,
    };
    const a = runPortfolioSimulation(input);
    const b = runPortfolioSimulation(input);
    expect(a.medianProjection).toBe(b.medianProjection);
  });
});
