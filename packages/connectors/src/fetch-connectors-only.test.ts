import { beforeEach, describe, expect, it } from "vitest";
import { resetCircuits, resetMetrics } from "@alpha-dfs/observability";
import {
  createDraftKingsSlateConnector,
  createFailingConnector,
  createProjectionFeedConnector,
} from "./adapters/seed-connectors";
import { createConnectorRegistry } from "./create-connector-registry";
import { fetchConnectorsOnly } from "./fetch-connectors-only";

describe("fetchConnectorsOnly", () => {
  beforeEach(() => {
    resetCircuits();
    resetMetrics();
  });

  it("fetches seed connectors and merges payload in memory without database access", async () => {
    const registry = createConnectorRegistry([
      createDraftKingsSlateConnector(),
      createProjectionFeedConnector(),
    ]);

    const result = await fetchConnectorsOnly(registry, { runId: "readonly-smoke" });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.sourceResults).toHaveLength(2);
      expect(result.mergedPayload.players.length).toBeGreaterThan(0);
      expect(result.mergedPayload.slate.name).toBeTruthy();
    }
  });

  it("fails when P0 connector fails", async () => {
    const registry = createConnectorRegistry([createFailingConnector("draftkings-slate", "P0")]);
    const result = await fetchConnectorsOnly(registry);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it("succeeds with degraded flag when P1 connector fails", async () => {
    const registry = createConnectorRegistry([
      createDraftKingsSlateConnector(),
      createFailingConnector("projection-feed", "P1"),
    ]);

    const result = await fetchConnectorsOnly(registry);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.degraded).toBe(true);
    }
  });
});
