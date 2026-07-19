import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { clearCachedAnalysisBundle } from "@/lib/backend/analysis-cache";
import { resetAnalysisRun } from "@/lib/backend/analysis-state";
import { createEngineRegistry } from "@/lib/backend/engines/create-engine-registry";
import { createPipelineExecutionManager } from "@/lib/backend/pipeline-execution-manager";
import { ensureTestDatabase, resetTestDatabaseFlag } from "@/test/helpers/database-setup";

describe("projection calibration integration", () => {
  const previousFlag = process.env.PROJECTION_CALIBRATION_ENABLED;

  beforeEach(async () => {
    resetAnalysisRun();
    clearCachedAnalysisBundle();
    resetTestDatabaseFlag();
    await ensureTestDatabase();
  });

  afterEach(() => {
    if (previousFlag === undefined) {
      delete process.env.PROJECTION_CALIBRATION_ENABLED;
    } else {
      process.env.PROJECTION_CALIBRATION_ENABLED = previousFlag;
    }
  });

  it("preserves V1 projection path when calibration is disabled", async () => {
    delete process.env.PROJECTION_CALIBRATION_ENABLED;
    const slate = await ensureTestDatabase();
    const { bundle } = await createPipelineExecutionManager().execute(
      "run-calibration-disabled",
      createEngineRegistry("real"),
      { slateId: slate.slateId, slateLabel: slate.slateLabel },
    );

    expect(bundle.confidence.calibratedProjection).toBeNull();
    expect(bundle.confidence.calibrationFactor).toBeNull();
  });

  it("applies calibrated projections before scoring when enabled", async () => {
    process.env.PROJECTION_CALIBRATION_ENABLED = "true";
    const slate = await ensureTestDatabase();
    const { bundle } = await createPipelineExecutionManager().execute(
      "run-calibration-enabled",
      createEngineRegistry("real"),
      { slateId: slate.slateId, slateLabel: slate.slateLabel },
    );

    expect(bundle.confidence.calibratedProjection).not.toBeNull();
    expect(bundle.confidence.calibrationFactor).not.toBeNull();
    expect(bundle.confidence.calibrationNotes?.length).toBeGreaterThan(0);
  });
});
