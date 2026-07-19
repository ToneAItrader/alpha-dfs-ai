import { beforeEach, describe, expect, it } from "vitest";
import { clearCachedAnalysisBundle } from "@/lib/backend/analysis-cache";
import { resetAnalysisRun } from "@/lib/backend/analysis-state";
import { createEngineRegistry } from "@/lib/backend/engines/create-engine-registry";
import { createPipelineExecutionManager } from "@/lib/backend/pipeline-execution-manager";
import { ensureTestDatabase, resetTestDatabaseFlag } from "@/test/helpers/database-setup";

describe("ownership intelligence integration", () => {
  beforeEach(async () => {
    resetAnalysisRun();
    clearCachedAnalysisBundle();
    resetTestDatabaseFlag();
    await ensureTestDatabase();
  });

  it("applies predicted ownership to player evidence and simulation field weighting", async () => {
    const slate = await ensureTestDatabase();
    const { bundle } = await createPipelineExecutionManager().execute(
      "run-ownership-integration",
      createEngineRegistry("real"),
      { slateId: slate.slateId, slateLabel: slate.slateLabel },
    );

    expect(bundle.ownershipIntelligence?.averagePredictedOwnership).toBeGreaterThan(0);
    expect(bundle.playerEvidence.players.some((player) => player.ownershipEstimate !== null)).toBe(
      true,
    );
    expect(bundle.playerEvidence.players.some((player) => player.ownershipSource === "feed")).toBe(
      true,
    );
    expect(bundle.slateIntelligence?.recommendedStrategy).toBeDefined();
  });
});
