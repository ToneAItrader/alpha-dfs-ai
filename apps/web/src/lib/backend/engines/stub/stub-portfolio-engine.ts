import {
  engineSuccess,
  type PortfolioEngine,
  type PortfolioEngineOutput,
} from "@alpha-dfs/shared";

const PRIMARY_LINEUPS = [
  { lineupId: "primary-1", rank: 1, rationale: "Primary lineup #1 — explainability from PIE." },
  { lineupId: "primary-2", rank: 2, rationale: "Primary lineup #2 — explainability from PIE." },
  { lineupId: "primary-3", rank: 3, rationale: "Primary lineup #3 — explainability from PIE." },
  { lineupId: "primary-4", rank: 4, rationale: "Primary lineup #4 — explainability from PIE." },
] as const;

const HAIL_MARY_LINEUPS = [
  { lineupId: "hail-1", rank: 1, rationale: "Hail Mary lineup #1 — contrarian thesis from PIE." },
  { lineupId: "hail-2", rank: 2, rationale: "Hail Mary lineup #2 — contrarian thesis from PIE." },
] as const;

export function createStubPortfolioEngine(): PortfolioEngine {
  return {
    engineId: "portfolio",
    async build() {
      const data: PortfolioEngineOutput = {
        healthScore: 84,
        portfolioGrade: "B",
        exposure: {
          qbExposure: "Balanced",
          rbExposure: "Moderate",
          wrExposure: "Balanced",
          teExposure: "Low",
          dstExposure: "Diversified",
        },
        diversity: {
          numberOfStacks: 4,
          teamDiversity: "High",
          opponentDiversity: "Moderate",
          correlationScore: "0.42",
        },
        ownership: {
          averageOwnership: 14.2,
          chalkExposure: "Moderate",
          contrarianExposure: "Balanced",
          leverageBalance: "Strong",
        },
        salary: {
          averageSalaryUsed: 49800,
          remainingSalary: 200,
          salaryEfficiency: "Optimal",
          salaryBalance: "Balanced",
        },
        risk: {
          overallRisk: "Moderate",
          floor: 118.5,
          ceiling: 162.3,
          variance: "Medium",
        },
        recommendations: [
          "Exposure is balanced",
          "Ownership profile acceptable",
          "Increase tournament leverage",
          "Salary allocation healthy",
          "Stack diversity sufficient",
        ],
        exposureSummary: {
          playerExposures: [{ playerId: "stub-qb", name: "Stub QB", exposurePct: 100 }],
          teamExposures: [{ team: "BUF", exposurePct: 22.2 }],
          stackExposures: [{ gameId: "BUF@KC", exposurePct: 16.7 }],
          salaryFlexibilityPct: 0.4,
          warnings: ["Multi-lineup exposure balanced across 2 recommended lineups"],
        },
        primaryLineups: PRIMARY_LINEUPS.map((lineup, index) => ({
          lineupId: lineup.lineupId,
          portfolioType: "primary" as const,
          rank: lineup.rank,
          projectedFantasyPoints: 145 - index * 2,
          confidenceScore: 80 - index * 3,
          confidenceTier: index < 2 ? "high" : "moderate",
          riskScore: "Low",
          ownershipEstimate: 14 + index,
          correlationScore: "0.38",
          salaryUsed: 49800,
          leverageScore: 1.2,
          ceilingRating: null,
          contrarianRating: null,
          optimizerRationale: lineup.rationale,
        })),
        hailMaryLineups: HAIL_MARY_LINEUPS.map((lineup, index) => ({
          lineupId: lineup.lineupId,
          portfolioType: "hail_mary" as const,
          rank: lineup.rank,
          projectedFantasyPoints: null,
          confidenceScore: null,
          confidenceTier: "moderate",
          riskScore: "High",
          ownershipEstimate: 6 + index,
          correlationScore: null,
          salaryUsed: null,
          leverageScore: 2.4 - index * 0.2,
          ceilingRating: 168 - index * 4,
          contrarianRating: "Strong",
          optimizerRationale: lineup.rationale,
        })),
        version: "portfolio-1.0-stub",
      };
      return engineSuccess(data);
    },
  };
}
