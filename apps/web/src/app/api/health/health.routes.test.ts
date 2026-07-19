import { beforeEach, describe, expect, it } from "vitest";
import { createConnectorRegistry, createDraftKingsSlateConnector, createFailingConnector } from "@alpha-dfs/connectors";
import { getPrismaClient } from "@alpha-dfs/database";
import { GET as getStartup } from "@/app/api/health/startup/route";
import { GET as getHealth } from "@/app/api/health/route";
import { GET as getReady } from "@/app/api/health/ready/route";
import { GET as getMetrics } from "@/app/api/health/metrics/route";
import { GET as getDiagnostics } from "@/app/api/health/diagnostics/route";
import { POST as postRefresh } from "@/app/api/pipeline/refresh/route";
import { createRefreshService } from "@/lib/backend/operations/refresh-service";
import { ensureTestDatabase, resetTestServiceCaches } from "@/test/helpers/database-setup";
import { resetOperationalStateForTest } from "@/test/helpers/operational-reset";
import { resetDataOperationsService } from "@/lib/backend/operations/data-operations-service";

function refreshRequest() {
  return new Request("http://localhost/api/pipeline/refresh", { method: "POST" });
}

describe("operational health routes", () => {
  beforeEach(async () => {
    resetTestServiceCaches();
    resetOperationalStateForTest();
    await ensureTestDatabase();
  });

  it("returns startup validation with database up", async () => {
    const response = await getStartup();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.ready).toBe(true);
    expect(body.dependencies.database.status).toBe("up");
  });

  it("returns health status with database up", async () => {
    const response = await getHealth();
    const body = await response.json();

    expect(response.status).toBeLessThan(500);
    expect(body.checks.database.status).toBe("up");
    expect(body.checks.providers.draftkings.configured).toBe(true);
    expect(body.checks.engines.mode).toMatch(/real|stub/);
  });

  it("returns readiness when slate is valid", async () => {
    const response = await getReady();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ready).toBe(true);
    expect(body.playerCount).toBe(15);
  });

  it("manual refresh completes successfully", async () => {
    const response = await postRefresh(refreshRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toMatch(/complete|degraded/);
    expect(body.slateId).toBeTruthy();
  });

  it("refresh service degrades when P1 source fails", async () => {
    resetDataOperationsService();
    const client = getPrismaClient();
    const registry = createConnectorRegistry([
      createDraftKingsSlateConnector(),
      createFailingConnector("projection-feed", "P1"),
    ]);
    const refreshService = createRefreshService(client, registry);
    const result = await refreshService.refresh({ runId: "degraded-test" });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.degraded).toBe(true);
    }
  });

  it("returns metrics snapshot", async () => {
    await postRefresh(refreshRequest());
    const response = await getMetrics();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.counters["refresh.run.total"]).toBeGreaterThan(0);
    expect(body.capturedAt).toBeTruthy();
  });

  it("returns diagnostics bundle", async () => {
    await postRefresh(refreshRequest());
    const response = await getDiagnostics();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.metrics).toBeTruthy();
    expect(Array.isArray(body.traces)).toBe(true);
    expect(Array.isArray(body.logs)).toBe(true);
    expect(body.config.pipelineTimeoutMs).toBeGreaterThan(0);
    expect(body.circuits.length).toBeGreaterThan(0);
  });
});
