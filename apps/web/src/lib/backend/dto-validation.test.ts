import { beforeEach, describe, expect, it } from "vitest";
import { clearCachedAnalysisBundle } from "@/lib/backend/analysis-cache";
import { resetAnalysisRun } from "@/lib/backend/analysis-state";
import { validateAnalysisBundleDto } from "@/lib/backend/dto-validation";
import { createEngineRegistry } from "@/lib/backend/engines/create-engine-registry";
import { createPipelineExecutionManager } from "@/lib/backend/pipeline-execution-manager";
import { createIdleAnalysisBundle } from "@/lib/backend/fixtures/idle-bundle";
import { ensureTestDatabase, resetTestDatabaseFlag } from "@/test/helpers/database-setup";

describe("DTO validation", () => {
  beforeEach(async () => {
    resetTestDatabaseFlag();
    await ensureTestDatabase();
  });

  it("validates idle bundle structure", () => {
    const result = validateAnalysisBundleDto(createIdleAnalysisBundle());
    expect(result.valid).toBe(true);
  });

  it("pipeline execution produces valid DTO bundle", async () => {
    const slate = await ensureTestDatabase();
    const { bundle } = await createPipelineExecutionManager().execute(
      "run-validation",
      createEngineRegistry("real"),
      { slateId: slate.slateId, slateLabel: slate.slateLabel },
    );

    const result = validateAnalysisBundleDto(bundle);
    expect(result.valid).toBe(true);
    expect(bundle.pipeline.status).toBe("complete");
    expect(bundle.confidence.overallConfidence).toBeGreaterThan(0);
  });

  it("reports missing required keys", () => {
    const idle = createIdleAnalysisBundle();
    const invalid = { ...idle, portfolioHealth: undefined } as unknown as typeof idle;
    const result = validateAnalysisBundleDto(invalid);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((error) => error.includes("portfolioHealth"))).toBe(true);
    }
  });
});
