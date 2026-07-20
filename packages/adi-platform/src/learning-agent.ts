import { structuredLog } from "@alpha-dfs/observability";
import type { AdiNormalizedEvidenceBundle } from "@alpha-dfs/shared";
import { isAdiLearningEnabled } from "./adi-config";

export type LearningAgentInput = {
  runId: string;
  success: boolean;
  bundle?: AdiNormalizedEvidenceBundle;
};

/** ADR-022 adi_learning_agent — async, non-blocking, flag-gated. */
export function scheduleLearningUpdate(input: LearningAgentInput): void {
  if (!isAdiLearningEnabled()) {
    return;
  }

  setImmediate(() => {
    try {
      structuredLog("info", "adi", "adi.learning.completed", "ADI learning agent completed", {
        runId: input.runId,
        success: input.success,
        subjectCount: input.bundle?.subjects.length ?? 0,
        platformConfidence: input.bundle?.platformConfidence ?? 0,
      });
    } catch (error) {
      structuredLog("warn", "adi", "adi.learning.failed", "ADI learning agent failed", {
        runId: input.runId,
        message: error instanceof Error ? error.message : "unknown",
      });
    }
  });
}
