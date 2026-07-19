import { describe, expect, it } from "vitest";
import { mapConfidenceIndicators } from "@/lib/mappers/confidence-mapper";
import { mapPlayerEvidence } from "@/lib/mappers/player-evidence-mapper";
import { mapPortfolioReadiness } from "@/lib/mappers/portfolio-readiness-mapper";
import type { AnalysisBundleResponseDto } from "@/types/dto/analysis-responses.dto";

const sampleBundle = {
  confidence: {
    status: "ready",
    overallConfidence: 78,
    confidenceGrade: "B",
    stabilityScore: 72,
    projectionConsistency: "Stable",
    variance: "medium",
    reliability: "B",
    dataCompleteness: 92,
    injuryCoverage: "Available",
    weatherCoverage: "Available",
    marketCoverage: "Partial",
    expertConsensus: "Available",
    internalAgreement: "High",
    externalAgreement: "Moderate",
    historicalAgreement: "High",
    overallAgreement: "Strong",
    insights: ["Stable projection"],
    metadata: {
      confidenceVersion: "pce-1.0",
      timestamp: "2026-07-18T12:00:00.000Z",
      dataFreshness: "Current",
      analysisVersion: "analysis-1.0",
    },
    lastAnalysisAt: "2026-07-18T12:00:00.000Z",
  },
  playerEvidence: {
    overview: {
      totalPlayers: 1,
      highConfidencePlayers: 1,
      moderateConfidencePlayers: 0,
      lowConfidencePlayers: 0,
      lastAnalysisAt: "2026-07-18T12:00:00.000Z",
    },
    filters: {
      positions: ["QB"],
      teams: ["BUF"],
      confidenceTiers: ["high"],
    },
    players: [
      {
        slatePlayerId: "p1",
        name: "Player One",
        position: "QB",
        team: "BUF",
        opponent: "KC",
        salary: 7800,
        projection: 22.5,
        confidenceScore: 85,
        confidenceTier: "high",
        risk: "Low",
        injuryStatus: "healthy",
        matchupSummary: "Favorable",
        ownershipEstimate: 14,
        supportingRationale: "Strong evidence support.",
        evidenceSources: ["historical_performance", "matchup_analysis"],
      },
    ],
    evidenceSourceCategories: [
      { id: "historical_performance", label: "Historical Performance", status: "available" },
    ],
    confidence: {
      overallConfidence: 78,
      projectionStability: 72,
      variance: "medium",
      reliabilityGrade: "B",
    },
    explainabilitySummary: ["Strong matchup"],
    metadata: {
      analysisVersion: "analysis-1.0",
      timestamp: "2026-07-18T12:00:00.000Z",
      dataFreshness: "Current",
      evidenceVersion: "evidence-1.0",
    },
  },
  portfolioReadiness: {
    readinessScore: {
      overallReadinessScore: 82,
      readinessGrade: "B",
      status: "ready",
      lastAnalysisAt: "2026-07-18T12:00:00.000Z",
    },
    predictionConfidence: {
      confidenceScore: 78,
      predictionStability: 72,
      reliabilityGrade: "B",
      projectionVariance: "medium",
    },
    dataQuality: {
      dataCompleteness: 92,
      injuryDataStatus: "available",
      weatherDataStatus: "available",
      marketDataStatus: "partial",
      expertConsensusStatus: "available",
    },
    portfolioHealthSnapshot: {
      portfolioGrade: "B",
      risk: "Moderate",
      exposureBalance: "Balanced",
      stackDiversity: "Sufficient",
      salaryDistribution: "Optimal",
      leverage: "Strong",
    },
    checklist: [{ id: "slate-analyzed", label: "Slate analyzed", state: "complete" }],
    summary: { insights: ["Ready for review"] },
  },
} as Pick<AnalysisBundleResponseDto, "confidence" | "playerEvidence" | "portfolioReadiness">;

describe("analysis mappers", () => {
  it("maps confidence DTO to view model", () => {
    const vm = mapConfidenceIndicators(sampleBundle.confidence);

    expect(vm.overview.overallConfidence).toBe(78);
    expect(vm.overview.confidenceGrade).toBe("B");
    expect(vm.stability.variance).toBe("medium");
  });

  it("maps player evidence DTO to view model", () => {
    const vm = mapPlayerEvidence(sampleBundle.playerEvidence);

    expect(vm.players[0]?.playerId).toBe("p1");
    expect(vm.players[0]?.confidenceTier).toBe("high");
    expect(vm.players[0]?.ownershipOutlook).toBe("14%");
  });

  it("maps portfolio readiness DTO to view model", () => {
    const vm = mapPortfolioReadiness(sampleBundle.portfolioReadiness);

    expect(vm.readinessScore.readinessGrade).toBe("B");
    expect(vm.checklist[0]?.state).toBe("complete");
  });
});
