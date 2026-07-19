import { beforeEach, describe, expect, it } from "vitest";
import {
  createConnectorRegistry,
  createDraftKingsSlateConnector,
  createFailingConnector,
  createProjectionFeedConnector,
} from "@alpha-dfs/connectors";
import { getPrismaClient } from "@alpha-dfs/database";
import { resetCircuits, resetMetrics } from "@alpha-dfs/observability";
import { createRefreshService } from "@/lib/backend/operations/refresh-service";
import { ensureTestDatabase, resetTestServiceCaches } from "@/test/helpers/database-setup";
import { resetOperationalStateForTest } from "@/test/helpers/operational-reset";

describe("refresh service", () => {
  beforeEach(async () => {
    resetTestServiceCaches();
    resetOperationalStateForTest();
    resetCircuits();
    resetMetrics();
    await ensureTestDatabase();
  });

  it("completes successfully with seed connectors", async () => {
    const client = getPrismaClient();
    const registry = createConnectorRegistry([
      createDraftKingsSlateConnector(),
      createProjectionFeedConnector(),
    ]);
    const refreshService = createRefreshService(client, registry);
    const result = await refreshService.refresh({ runId: "refresh-success" });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.slateId).toBeTruthy();
      expect(result.sourceResults.length).toBeGreaterThan(0);
    }
  });

  it("fails when P0 connector fails", async () => {
    const client = getPrismaClient();
    const registry = createConnectorRegistry([createFailingConnector("draftkings-slate", "P0")]);
    const refreshService = createRefreshService(client, registry);
    const result = await refreshService.refresh({ runId: "refresh-p0-fail" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it("degrades when P1 connector fails", async () => {
    const client = getPrismaClient();
    const registry = createConnectorRegistry([
      createDraftKingsSlateConnector(),
      createFailingConnector("projection-feed", "P1"),
    ]);
    const refreshService = createRefreshService(client, registry);
    const result = await refreshService.refresh({ runId: "refresh-degraded" });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.degraded).toBe(true);
    }
  });
});
