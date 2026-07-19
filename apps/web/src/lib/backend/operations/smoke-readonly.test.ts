import { beforeEach, describe, expect, it } from "vitest";
import { getPrismaClient } from "@alpha-dfs/database";
import { resetCircuits, resetMetrics } from "@alpha-dfs/observability";
import { runReadonlySmokeSteps } from "@/lib/backend/operations/smoke-readonly";
import { ensureTestDatabase, resetTestServiceCaches } from "@/test/helpers/database-setup";
import { resetOperationalStateForTest } from "@/test/helpers/operational-reset";

describe("readonly smoke", () => {
  beforeEach(async () => {
    resetTestServiceCaches();
    resetOperationalStateForTest();
    resetCircuits();
    resetMetrics();
    process.env.CONNECTOR_MODE = "seed";
    await ensureTestDatabase();
  });

  it("passes connector and engine checks without database mutation", async () => {
    const client = getPrismaClient();
    const refreshRunsBefore = await client.dataRefreshRun.count();
    const slateCountBefore = await client.slate.count();

    const result = await runReadonlySmokeSteps("readonly-smoke-test");

    expect(result.ok).toBe(true);
    expect(result.engineIds).toHaveLength(11);
    expect(result.sourceResults.length).toBeGreaterThan(0);
    expect(result.playerCount).toBeGreaterThan(0);

    const refreshRunsAfter = await client.dataRefreshRun.count();
    const slateCountAfter = await client.slate.count();
    expect(refreshRunsAfter).toBe(refreshRunsBefore);
    expect(slateCountAfter).toBe(slateCountBefore);
  });
});
