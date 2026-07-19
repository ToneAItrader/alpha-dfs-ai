import { beforeEach, describe, expect, it } from "vitest";
import { resetCircuits, resetMetrics } from "@alpha-dfs/observability";
import { fetchWithRetry } from "./retry";
import { createDraftKingsSlateConnector, createFailingConnector } from "./adapters/seed-connectors";

describe("connector retry", () => {
  beforeEach(() => {
    resetCircuits();
    resetMetrics();
  });
  it("retries failing connector up to max attempts", async () => {
    let calls = 0;
    const connector = {
      ...createFailingConnector("retry-test"),
      async fetch() {
        calls += 1;
        throw new Error("temporary failure");
      },
    };

    const result = await fetchWithRetry(connector, { requestedAt: new Date().toISOString() }, {
      maxAttempts: 3,
      baseDelayMs: 1,
    });

    expect(result.ok).toBe(false);
    expect(result.attempts).toBe(3);
    expect(calls).toBe(3);
  });

  it("returns success without extra retries", async () => {
    const connector = createDraftKingsSlateConnector();
    const result = await fetchWithRetry(connector, { requestedAt: new Date().toISOString() });
    expect(result.ok).toBe(true);
    expect(result.recordCount).toBe(15);
  });
});
