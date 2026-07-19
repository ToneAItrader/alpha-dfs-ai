import { beforeEach, describe, expect, it } from "vitest";
import {
  completeAnalysisRun,
  resetAnalysisRun,
  startAnalysisRun,
} from "@/lib/backend/analysis-state";
import { clearCachedAnalysisBundle } from "@/lib/backend/analysis-cache";
import { resetBackendDependencies, setBackendDependencies } from "@/lib/backend/dependency-container";
import { createEngineRegistry } from "@/lib/backend/engines/create-engine-registry";
import { createAnalysisProvider } from "@/providers/analysis-provider";
import { ensureTestDatabase, resetTestDatabaseFlag } from "@/test/helpers/database-setup";

describe("analysis provider integration", () => {
  beforeEach(async () => {
    resetAnalysisRun();
    clearCachedAnalysisBundle();
    resetTestDatabaseFlag();
    resetBackendDependencies();
    setBackendDependencies({ engines: createEngineRegistry("stub") });
    await ensureTestDatabase();
  });

  it("returns idle view models before analysis", async () => {
    const provider = createAnalysisProvider();

    const readiness = await provider.getPortfolioReadiness();
    const evidence = await provider.getPlayerEvidence();
    const dashboard = await provider.getDashboardData();

    expect(readiness.readinessScore.status).toBe("idle");
    expect(evidence.players.length).toBeGreaterThan(0);
    expect(evidence.confidenceSummary.overallConfidence).toBeNull();
    expect(dashboard.analysisStatus).toBe("idle");
  });

  it("returns populated view models after analysis completes", async () => {
    startAnalysisRun();
    completeAnalysisRun();

    const provider = createAnalysisProvider();
    const readiness = await provider.getPortfolioReadiness();
    const health = await provider.getPortfolioHealth();
    const simulation = await provider.getSimulationResults();
    const confidence = await provider.getConfidenceIndicators();

    expect(readiness.readinessScore.readinessGrade).toMatch(/^[A-F]$/);
    expect(health.overview.overallHealthScore).toBeGreaterThan(0);
    expect(simulation.overview.simulationCount).toBe(Number(process.env.SIMULATION_COUNT ?? 10000));
    expect(confidence.overview.overallConfidence).toBeGreaterThan(0);
  });

  it("returns slate intelligence view model after analysis completes", async () => {
    startAnalysisRun();
    completeAnalysisRun();

    const provider = createAnalysisProvider();
    const slateIntelligence = await provider.getSlateIntelligence();

    expect(slateIntelligence.liveSections.grade).toBe(true);
    expect(slateIntelligence.grade.overallGrade).toMatch(/\/100$/);
    expect(slateIntelligence.recommendedStrategy.primary).toBeTruthy();
    expect(slateIntelligence).not.toHaveProperty("slateGrade");
  });

  it("never exposes DTO shapes from provider methods", async () => {
    startAnalysisRun();
    completeAnalysisRun();

    const provider = createAnalysisProvider();
    const portfolio = await provider.getRecommendedPortfolio();

    expect(portfolio).toHaveProperty("primaryPortfolios");
    expect(portfolio).not.toHaveProperty("primaryLineups");
  });
});
