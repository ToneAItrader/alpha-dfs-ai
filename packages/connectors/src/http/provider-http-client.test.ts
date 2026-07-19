import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetMetrics, resetStructuredLogs } from "@alpha-dfs/observability";
import { providerHttpGet } from "./provider-http-client";
import { resetRateLimiters } from "./rate-limiter";

describe("providerHttpGet", () => {
  beforeEach(() => {
    resetRateLimiters();
    resetMetrics();
    resetStructuredLogs();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ ok: true }),
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns parsed JSON on success", async () => {
    const result = await providerHttpGet<{ ok: boolean }>({
      providerId: "draftkings-slate",
      url: "https://example.com/slate",
    });
    expect(result.ok).toBe(true);
  });

  it("throws on non-2xx responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 503,
        statusText: "Unavailable",
      })),
    );

    await expect(
      providerHttpGet({
        providerId: "projection-feed",
        url: "https://example.com/projections",
      }),
    ).rejects.toThrow("HTTP 503");
  });
});
