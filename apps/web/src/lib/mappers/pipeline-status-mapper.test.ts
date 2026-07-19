import { describe, expect, it } from "vitest";
import {
  mapPipelineStatusForDisplay,
  pipelineStatusLabels,
} from "@/lib/mappers/pipeline-status-mapper";

describe("mapPipelineStatusForDisplay", () => {
  it("maps idle, analyzing, and complete unchanged", () => {
    expect(mapPipelineStatusForDisplay("idle")).toBe("idle");
    expect(mapPipelineStatusForDisplay("analyzing")).toBe("analyzing");
    expect(mapPipelineStatusForDisplay("complete")).toBe("complete");
  });

  it("maps failed to idle for operator display", () => {
    expect(mapPipelineStatusForDisplay("failed")).toBe("idle");
  });

  it("provides labels for all display statuses", () => {
    expect(pipelineStatusLabels.idle).toBe("Idle");
    expect(pipelineStatusLabels.analyzing).toBe("Analyzing");
    expect(pipelineStatusLabels.complete).toBe("Complete");
  });
});
