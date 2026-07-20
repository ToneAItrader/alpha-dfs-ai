import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetAdiConfigCache } from "./adi-config";
import { scheduleLearningUpdate } from "./learning-agent";

describe("learning agent (INT-6)", () => {
  beforeEach(() => {
    resetAdiConfigCache();
    delete process.env.ADI_PLATFORM_ENABLED;
    delete process.env.ADI_LEARNING_ENABLED;
  });

  it("does not run when learning is disabled", async () => {
    const spy = vi.fn();
    vi.stubGlobal(
      "setImmediate",
      (callback: () => void) => {
        spy();
        callback();
      },
    );

    scheduleLearningUpdate({ runId: "run-learn", success: true });
    expect(spy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("runs asynchronously when learning enabled", async () => {
    process.env.ADI_PLATFORM_ENABLED = "true";
    process.env.ADI_LEARNING_ENABLED = "true";
    resetAdiConfigCache();

    await new Promise<void>((resolve) => {
      scheduleLearningUpdate({
        runId: "run-learn-enabled",
        success: true,
        bundle: {
          bundleId: "bundle-learn",
          runId: "run-learn-enabled",
          slateId: "slate-learn",
          fusedAt: new Date().toISOString(),
          version: "fusion-1.0",
          subjects: [],
          platformConfidence: 0.5,
          degradationNotes: [],
        },
      });
      setImmediate(() => resolve());
    });
  });
});
