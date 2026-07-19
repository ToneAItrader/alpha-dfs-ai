import { beforeEach, describe, expect, it } from "vitest";
import {
  completeAnalysisRun,
  failAnalysisRun,
  getAnalysisState,
  resetAnalysisRun,
  startAnalysisRun,
} from "@/lib/backend/analysis-state";

describe("analysis state lifecycle", () => {
  beforeEach(() => {
    resetAnalysisRun();
  });

  it("starts in idle state", () => {
    expect(getAnalysisState()).toEqual({
      runId: null,
      status: "idle",
      lastAnalysisAt: null,
      errorMessage: null,
    });
  });

  it("transitions idle → analyzing → complete", () => {
    startAnalysisRun();
    expect(getAnalysisState().status).toBe("analyzing");
    expect(getAnalysisState().runId).toMatch(/^run-/);

    completeAnalysisRun();
    const state = getAnalysisState();
    expect(state.status).toBe("complete");
    expect(state.lastAnalysisAt).not.toBeNull();
    expect(state.errorMessage).toBeNull();
  });

  it("transitions to failed with error message", () => {
    startAnalysisRun();
    failAnalysisRun("Engine timeout");

    expect(getAnalysisState()).toEqual({
      runId: expect.stringMatching(/^run-/),
      status: "failed",
      lastAnalysisAt: null,
      errorMessage: "Engine timeout",
    });
  });

  it("resets to idle", () => {
    startAnalysisRun();
    completeAnalysisRun();
    resetAnalysisRun();

    expect(getAnalysisState().status).toBe("idle");
    expect(getAnalysisState().runId).toBeNull();
  });
});
