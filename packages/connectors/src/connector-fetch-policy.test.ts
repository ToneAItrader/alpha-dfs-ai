import { describe, expect, it } from "vitest";
import type { DataConnector } from "./types";
import {
  applyConnectorFailurePolicy,
  retryOptionsForConnector,
} from "./connector-fetch-policy";

describe("connector-fetch-policy", () => {
  it("uses single attempt for P2 connectors", () => {
    const connector = { priority: "P2" } as DataConnector;
    expect(retryOptionsForConnector(connector)).toEqual({ maxAttempts: 1 });
  });

  it("does not degrade on P2 failure by default", () => {
    const state = { degraded: false, errors: [] as string[] };
    applyConnectorFailurePolicy({ priority: "P2" } as DataConnector, false, state, "failed");
    expect(state.degraded).toBe(false);
    expect(state.errors).toHaveLength(0);
  });

  it("degrades on P2 failure when visibility enabled", () => {
    const previous = process.env.CONNECTOR_P2_VISIBILITY;
    process.env.CONNECTOR_P2_VISIBILITY = "1";

    const state = { degraded: false, errors: [] as string[] };
    applyConnectorFailurePolicy({ priority: "P2" } as DataConnector, false, state, "failed");
    expect(state.degraded).toBe(true);

    process.env.CONNECTOR_P2_VISIBILITY = previous;
  });
});
