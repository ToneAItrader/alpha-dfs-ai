import { beforeEach, describe, expect, it } from "vitest";
import { engineFailure } from "@alpha-dfs/shared";
import { clearCachedAnalysisBundle } from "@/lib/backend/analysis-cache";
import { resetAnalysisRun } from "@/lib/backend/analysis-state";
import { createEngineRegistry } from "@/lib/backend/engines/create-engine-registry";
import { createPipelineExecutionManager } from "@/lib/backend/pipeline-execution-manager";
import { ensureTestDatabase, resetTestDatabaseFlag } from "@/test/helpers/database-setup";

describe("pipeline execution manager", () => {
  beforeEach(async () => {
    resetAnalysisRun();
    clearCachedAnalysisBundle();
    resetTestDatabaseFlag();
    await ensureTestDatabase();
  });

  it("executes all phases and caches complete bundle", async () => {
    const slate = await ensureTestDatabase();
    const manager = createPipelineExecutionManager();
    const { result, bundle } = await manager.execute(
      "run-pipeline-test",
      createEngineRegistry("real"),
      { slateId: slate.slateId, slateLabel: slate.slateLabel },
    );

    expect(result.status).toBe("complete");
    expect(result.phasesCompleted).toEqual([
      "slate_analysis",
      "slate_intelligence",
      "injury_intelligence",
      "vegas_intelligence",
      "weather_intelligence",
      "ownership_intelligence",
      "projection_calibration",
      "player_analysis",
      "confidence",
      "portfolio",
      "simulation",
    ]);
    expect(bundle.pipeline.status).toBe("complete");
    expect(bundle.pipeline.runId).toBe("run-pipeline-test");
    expect(bundle.simulation.overview.simulationCount).toBe(Number(process.env.SIMULATION_COUNT ?? 10000));
    expect(bundle.slateIntelligence?.slateGrade).toBeGreaterThan(0);
    expect(bundle.slateIntelligence?.recommendedStrategy).toBeDefined();
    expect(bundle.injuryIntelligence?.majorInjuries).toBeGreaterThanOrEqual(0);
    expect(bundle.vegasIntelligence?.featuredGames?.length).toBeGreaterThan(0);
    expect(bundle.weatherIntelligence?.gameImpacts?.length).toBeGreaterThan(0);
  });

  it("fails when an engine returns an error", async () => {
    const slate = await ensureTestDatabase();
    const failingRegistry = createEngineRegistry("real");
    failingRegistry.confidence = {
      engineId: "confidence",
      async evaluate() {
        return engineFailure("ENGINE_FAILED", "Confidence engine unavailable", "confidence");
      },
    };

    const manager = createPipelineExecutionManager();

    await expect(
      manager.execute("run-fail-test", failingRegistry, {
        slateId: slate.slateId,
        slateLabel: slate.slateLabel,
      }),
    ).rejects.toThrow("Confidence engine unavailable");
  });
});
