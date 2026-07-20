import { beforeEach, describe, expect, it } from "vitest";
import { resetAdiConfigCache } from "@alpha-dfs/adi-platform";
import { resetAdiBootstrap } from "@/lib/backend/adi-bootstrap";
import { clearCachedAnalysisBundle } from "@/lib/backend/analysis-cache";
import { resetAnalysisRun } from "@/lib/backend/analysis-state";
import { createEngineRegistry } from "@/lib/backend/engines/create-engine-registry";
import {
  createPipelineExecutionManager,
  resetPipelineExecutionManager,
} from "@/lib/backend/pipeline-execution-manager";
import { ensureTestDatabase, resetTestDatabaseFlag } from "@/test/helpers/database-setup";

describe("ADI pipeline integration (M4/M6)", () => {
  beforeEach(async () => {
    resetAnalysisRun();
    clearCachedAnalysisBundle();
    resetTestDatabaseFlag();
    resetPipelineExecutionManager();
    resetAdiConfigCache();
    resetAdiBootstrap();
    delete process.env.ADI_PLATFORM_ENABLED;
    delete process.env.ADI_FUSION_ENABLED;
    delete process.env.ADI_PROVIDER_NEWS_ENABLED;
    delete process.env.ADI_PROVIDER_SOCIAL_ENABLED;
    delete process.env.ADI_PROVIDER_SPORTSBOOK_ENABLED;
    await ensureTestDatabase();
  });

  it("preserves V2.1 pipeline output when ADI is disabled", async () => {
    const slate = await ensureTestDatabase();
    const manager = createPipelineExecutionManager();
    const { result, bundle } = await manager.execute(
      "run-adi-disabled",
      createEngineRegistry("real"),
      { slateId: slate.slateId, slateLabel: slate.slateLabel },
    );

    expect(result.status).toBe("complete");
    expect(bundle.pipeline.status).toBe("complete");
    expect(bundle.simulation.overview.simulationCount).toBe(Number(process.env.SIMULATION_COUNT ?? 10000));
  });

  it("completes pipeline when ADI platform is enabled (fetch + fusion)", async () => {
    process.env.ADI_PLATFORM_ENABLED = "true";
    process.env.ADI_PROVIDER_NEWS_ENABLED = "true";
    process.env.ADI_PROVIDER_SOCIAL_ENABLED = "true";
    process.env.ADI_PROVIDER_SPORTSBOOK_ENABLED = "true";
    resetAdiConfigCache();
    resetPipelineExecutionManager();

    const slate = await ensureTestDatabase();
    const manager = createPipelineExecutionManager();
    const { result, bundle } = await manager.execute(
      "run-adi-enabled",
      createEngineRegistry("real"),
      { slateId: slate.slateId, slateLabel: slate.slateLabel },
    );

    expect(result.status).toBe("complete");
    expect(bundle.pipeline.status).toBe("complete");
    expect(result.phasesCompleted).toHaveLength(11);
  });

  it("INT-7: V2.1 outputs remain equivalent when ADI is off vs on", async () => {
    const slate = await ensureTestDatabase();
    const manager = createPipelineExecutionManager();

    const disabled = await manager.execute(
      "run-int7-disabled",
      createEngineRegistry("real"),
      { slateId: slate.slateId, slateLabel: slate.slateLabel },
    );

    process.env.ADI_PLATFORM_ENABLED = "true";
    process.env.ADI_PROVIDER_NEWS_ENABLED = "true";
    process.env.ADI_PROVIDER_CONSENSUS_ENABLED = "true";
    process.env.ADI_PROVIDER_DFS_CONTENT_ENABLED = "true";
    resetAdiConfigCache();
    resetPipelineExecutionManager();

    const enabled = await manager.execute(
      "run-int7-enabled",
      createEngineRegistry("real"),
      { slateId: slate.slateId, slateLabel: slate.slateLabel },
    );

    expect(disabled.result.status).toBe("complete");
    expect(enabled.result.status).toBe("complete");
    expect(enabled.bundle.simulation.overview.simulationCount).toBe(
      disabled.bundle.simulation.overview.simulationCount,
    );
    expect(enabled.bundle.portfolioHealth.overallScore).toBe(
      disabled.bundle.portfolioHealth.overallScore,
    );
  });
});
