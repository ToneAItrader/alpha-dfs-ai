import { describe, expect, it } from "vitest";
import { mapConfidenceIndicators } from "@/lib/mappers/confidence-mapper";
import { mapDashboardData } from "@/lib/mappers/dashboard-mapper";
import { mapPlayerEvidence } from "@/lib/mappers/player-evidence-mapper";
import { mapPortfolioHealth } from "@/lib/mappers/portfolio-health-mapper";
import { mapPortfolioReadiness } from "@/lib/mappers/portfolio-readiness-mapper";
import { mapRecommendedPortfolio } from "@/lib/mappers/recommended-portfolio-mapper";
import { mapSimulationResults } from "@/lib/mappers/simulation-results-mapper";
import {
  createIdleAnalysisBundle,
  createPartialPlayerEvidenceDto,
  idleConfidenceDto,
  idlePortfolioHealthDto,
  idlePortfolioReadinessDto,
  idleRecommendedPortfolioDto,
  idleSimulationDto,
} from "@/test/fixtures/analysis-dto-fixtures";

describe("mapper edge cases", () => {
  describe("ConfidenceMapper", () => {
    it("maps idle DTO with all null values", () => {
      const vm = mapConfidenceIndicators(idleConfidenceDto);

      expect(vm.overview.overallConfidence).toBeNull();
      expect(vm.overview.currentStatus).toBe("idle");
      expect(vm.insights).toEqual([]);
      expect(vm.metadata.confidenceVersion).toBeNull();
    });

    it("preserves variance enum values from DTO", () => {
      const vm = mapConfidenceIndicators({
        ...idleConfidenceDto,
        variance: "high",
        status: "ready",
      });

      expect(vm.stability.variance).toBe("high");
      expect(vm.overview.currentStatus).toBe("ready");
    });
  });

  describe("PortfolioReadinessMapper", () => {
    it("maps empty checklist and null scores", () => {
      const vm = mapPortfolioReadiness(idlePortfolioReadinessDto);

      expect(vm.readinessScore.overallReadinessScore).toBeNull();
      expect(vm.checklist).toEqual([]);
      expect(vm.summary.insights).toEqual([]);
      expect(vm.dataQuality.injuryDataStatus).toBe("pending");
    });
  });

  describe("PlayerEvidenceMapper", () => {
    it("maps empty player list", () => {
      const vm = mapPlayerEvidence(createPartialPlayerEvidenceDto());

      expect(vm.players).toHaveLength(1);
      expect(vm.players[0]?.ownershipOutlook).toBeNull();
    });

    it("filters unknown evidence source ids", () => {
      const vm = mapPlayerEvidence(createPartialPlayerEvidenceDto());

      expect(vm.players[0]?.evidenceSources).toEqual(["historical_performance"]);
    });

    it("formats ownership estimate when present", () => {
      const vm = mapPlayerEvidence({
        ...createPartialPlayerEvidenceDto(),
        players: [
          {
            ...createPartialPlayerEvidenceDto().players[0]!,
            ownershipEstimate: 18.5,
          },
        ],
      });

      expect(vm.players[0]?.ownershipOutlook).toBe("18.5%");
    });
  });

  describe("RecommendedPortfolioMapper", () => {
    it("maps empty lineup arrays", () => {
      const vm = mapRecommendedPortfolio(idleRecommendedPortfolioDto);

      expect(vm.primaryPortfolios).toEqual([]);
      expect(vm.hailMaryPortfolios).toEqual([]);
      expect(vm.portfolioOverview.portfolioStatus).toBe("idle");
    });
  });

  describe("PortfolioHealthMapper", () => {
    it("maps idle health overview", () => {
      const vm = mapPortfolioHealth(idlePortfolioHealthDto);

      expect(vm.overview.overallStatus).toBe("idle");
      expect(vm.risk.floor).toBeNull();
      expect(vm.recommendations).toEqual([]);
    });
  });

  describe("SimulationResultsMapper", () => {
    it("maps idle simulation state", () => {
      const vm = mapSimulationResults(idleSimulationDto);

      expect(vm.overview.simulationStatus).toBe("idle");
      expect(vm.projections.medianProjection).toBeNull();
      expect(vm.probabilities.cashProbability).toBeNull();
      expect(vm.fieldMetrics.fieldSize).toBeNull();
      expect(vm.fieldMetrics.fieldPercentile).toBeNull();
    });
  });

  describe("DashboardMapper", () => {
    it("maps idle bundle to dashboard placeholders", () => {
      const vm = mapDashboardData(createIdleAnalysisBundle());

      expect(vm.analysisStatus).toBe("idle");
      expect(vm.summaryCards).toHaveLength(4);
      expect(vm.summaryCards.every((card) => card.value === "—" || card.value === "Idle")).toBe(
        true,
      );
      expect(vm.recentActivity).toEqual([]);
    });

    it("maps failed pipeline status to idle dashboard status", () => {
      const bundle = createIdleAnalysisBundle();
      bundle.pipeline.status = "failed";

      const vm = mapDashboardData(bundle);

      expect(vm.analysisStatus).toBe("idle");
    });

    it("includes recent activity when pipeline is complete", () => {
      const bundle = createIdleAnalysisBundle();
      bundle.pipeline.status = "complete";
      bundle.pipeline.lastAnalysisAt = "2026-07-18T12:00:00.000Z";
      bundle.portfolioReadiness.readinessScore.readinessGrade = "B";

      const vm = mapDashboardData(bundle);

      expect(vm.recentActivity).toHaveLength(1);
      expect(vm.summaryCards[0]?.value).toBe("B");
    });
  });
});
