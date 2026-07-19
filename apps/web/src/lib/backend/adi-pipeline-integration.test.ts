import { beforeEach, describe, expect, it } from "vitest";
import { resetAdiConfigCache } from "@alpha-dfs/adi-platform";
import { clearCachedAnalysisBundle } from "@/lib/backend/analysis-cache";
import { resetAnalysisRun } from "@/lib/backend/analysis-state";
import { createEngineRegistry } from "@/lib/backend/engines/create-engine-registry";
import {
  createPipelineExecutionManager,
  resetPipelineExecutionManager,
} from "@/lib/backend/pipeline-execution-manager";
import { ensureTestDatabase, resetTestDatabaseFlag } from "@/test/helpers/database-setup";

describe("ADI pipeline integration (M4)", () => {
  beforeEach(async () => {
    resetAnalysisRun();
    clearCachedAnalysisBundle();
    resetTestDatabaseFlag();
    resetPipelineExecutionManager();
    resetAdiConfigCache();
    delete process.env.ADI_PLATFORM_ENABLED;
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

  it("completes pipeline when ADI platform is enabled (bootstrap only)", async () => {
    process.env.ADI_PLATFORM_ENABLED = "true";
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
});
