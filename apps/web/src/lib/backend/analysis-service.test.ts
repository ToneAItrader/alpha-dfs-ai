import { afterEach, describe, expect, it, vi } from "vitest";
import { clearCachedAnalysisBundle } from "@/lib/backend/analysis-cache";
import {
  completeAnalysisRun,
  getAnalysisState,
  resetAnalysisRun,
  startAnalysisRun,
} from "@/lib/backend/analysis-state";
import { fetchAnalysisBundle } from "@/lib/backend/analysis-service";
import * as slateDataService from "@/lib/backend/data/slate-data-service";

describe("fetchAnalysisBundle", () => {
  afterEach(() => {
    resetAnalysisRun();
    clearCachedAnalysisBundle();
    vi.restoreAllMocks();
  });

  it("returns idle bundle when complete state cannot reconstruct after cache miss", async () => {
    startAnalysisRun();
    completeAnalysisRun();
    clearCachedAnalysisBundle();

    vi.spyOn(slateDataService, "getSlateDataService").mockReturnValue({
      slateRepository: {} as never,
      ensureReady: vi.fn().mockRejectedValue(new Error("Database unavailable")),
      refreshAndEnsureReady: vi.fn(),
    });

    const bundle = await fetchAnalysisBundle();

    expect(bundle.pipeline.status).toBe("idle");
    expect(bundle.pipeline.currentSlate).toBe("No slate loaded");
    expect(getAnalysisState().status).toBe("idle");
  });
});
