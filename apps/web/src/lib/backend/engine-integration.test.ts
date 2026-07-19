import { beforeEach, describe, expect, it } from "vitest";
import { clearCachedAnalysisBundle } from "@/lib/backend/analysis-cache";
import { resetAnalysisRun } from "@/lib/backend/analysis-state";
import { validateAnalysisBundleDto } from "@/lib/backend/dto-validation";
import { createEngineRegistry } from "@/lib/backend/engines/create-engine-registry";
import { createPipelineExecutionManager } from "@/lib/backend/pipeline-execution-manager";
import { mapConfidenceIndicators } from "@/lib/mappers/confidence-mapper";
import { mapPlayerEvidence } from "@/lib/mappers/player-evidence-mapper";
import { mapSimulationResults } from "@/lib/mappers/simulation-results-mapper";
import { ensureTestDatabase, resetTestDatabaseFlag } from "@/test/helpers/database-setup";

describe("real engine integration", () => {
  beforeEach(async () => {
    resetAnalysisRun();
    clearCachedAnalysisBundle();
    resetTestDatabaseFlag();
    await ensureTestDatabase();
  });

  it("executes full real pipeline with database-backed engines", async () => {
    const slate = await ensureTestDatabase();
    const { bundle, result } = await createPipelineExecutionManager().execute(
      "run-real-integration",
      createEngineRegistry("real"),
      { slateId: slate.slateId, slateLabel: slate.slateLabel },
    );

    expect(result.status).toBe("complete");
    expect(validateAnalysisBundleDto(bundle).valid).toBe(true);
    expect(bundle.confidence.metadata.confidenceVersion).toBe("pce-1.0");
    expect(bundle.playerEvidence.metadata.evidenceVersion).toBe("evidence-1.0");
    expect(bundle.simulation.metadata.simulationVersion).toBe("sim-2.0-gpp-field");
    expect(bundle.recommendedPortfolio.portfolioOverview.primaryCount).toBeGreaterThan(0);
    expect(bundle.pipeline.currentSlate).toContain("Week 1");
  });

  it("real engine DTOs map to view models without changes", async () => {
    const slate = await ensureTestDatabase();
    const { bundle } = await createPipelineExecutionManager().execute(
      "run-mapper-compat",
      createEngineRegistry("real"),
      { slateId: slate.slateId, slateLabel: slate.slateLabel },
    );

    const confidenceVm = mapConfidenceIndicators(bundle.confidence);
    const evidenceVm = mapPlayerEvidence(bundle.playerEvidence);
    const simulationVm = mapSimulationResults(bundle.simulation);

    expect(confidenceVm.overview.overallConfidence).toBeGreaterThan(0);
    expect(evidenceVm.players.length).toBe(15);
    expect(simulationVm.overview.simulationCount).toBe(Number(process.env.SIMULATION_COUNT ?? 10000));
  });

  it("fails when confidence engine missing upstream player analysis", async () => {
    const slate = await ensureTestDatabase();
    const registry = createEngineRegistry("real");
    registry.playerAnalysis = {
      engineId: "player_analysis",
      async analyze() {
        return { ok: false, error: { code: "TEST", message: "Blocked" } };
      },
    };

    await expect(
      createPipelineExecutionManager().execute("run-fail-upstream", registry, {
        slateId: slate.slateId,
        slateLabel: slate.slateLabel,
      }),
    ).rejects.toThrow();
  });
});
