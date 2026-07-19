import { beforeEach, describe, expect, it } from "vitest";
import { POST } from "@/app/api/pipeline/analyze/route";
import { GET } from "@/app/api/pipeline/status/route";
import { clearCachedAnalysisBundle } from "@/lib/backend/analysis-cache";
import {
  resetAnalysisRun,
  startAnalysisRun,
} from "@/lib/backend/analysis-state";
import { setBackendDependencies } from "@/lib/backend/dependency-container";
import { createStubEngineRegistry } from "@/lib/backend/engines/stub/create-stub-engine-registry";
import { engineFailure } from "@alpha-dfs/shared";
import { ensureTestDatabase, resetTestServiceCaches } from "@/test/helpers/database-setup";
import { resetOperationalStateForTest } from "@/test/helpers/operational-reset";

function analyzeRequest(headers?: Record<string, string>) {
  return new Request("http://localhost/api/pipeline/analyze", {
    method: "POST",
    headers,
  });
}

describe("POST /api/pipeline/analyze", () => {
  beforeEach(async () => {
    resetAnalysisRun();
    clearCachedAnalysisBundle();
    resetTestServiceCaches();
    resetOperationalStateForTest();
    await ensureTestDatabase();
  });

  it("returns runId and complete status", async () => {
    const response = await POST(analyzeRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.runId).toMatch(/^run-/);
    expect(body.status).toBe("complete");
    expect(body.correlationId).toMatch(/^corr-/);
  });

  it("accepts X-Correlation-ID header", async () => {
    const response = await POST(
      analyzeRequest({ "X-Correlation-ID": "corr-custom-test" }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.correlationId).toBe("corr-custom-test");
  });

  it("returns failed status when pipeline execution fails", async () => {
    const failingRegistry = createStubEngineRegistry();
    failingRegistry.portfolio = {
      engineId: "portfolio",
      async build() {
        return engineFailure("ENGINE_FAILED", "Portfolio engine unavailable", "portfolio");
      },
    };
    setBackendDependencies({ engines: failingRegistry });

    const response = await POST(analyzeRequest());
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.status).toBe("failed");
    expect(body.error).toContain("Portfolio engine unavailable");
  });
});

describe("GET /api/pipeline/status", () => {
  beforeEach(async () => {
    resetAnalysisRun();
    clearCachedAnalysisBundle();
    resetTestServiceCaches();
    resetOperationalStateForTest();
    await ensureTestDatabase();
  });

  it("returns idle pipeline status initially", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("idle");
    expect(body.currentSlate).toBe("No slate loaded");
  });

  it("returns complete status after analyze", async () => {
    await POST(analyzeRequest());
    const response = await GET();
    const body = await response.json();

    expect(body.status).toBe("complete");
    expect(body.portfolioReadiness).toBe("Ready");
  });

  it("returns analyzing status mid-run", async () => {
    startAnalysisRun();
    const response = await GET();
    const body = await response.json();

    expect(body.status).toBe("analyzing");
  });
});
