import type { AnalysisBundleResponseDto } from "@/types/dto/analysis-responses.dto";
import {
  assembleAnalyzingBundle,
  assembleFailedBundle,
} from "@/lib/backend/dto-assembler";
import {
  clearCachedAnalysisBundle,
  getCachedAnalysisBundle,
} from "@/lib/backend/analysis-cache";
import { createIdleAnalysisBundle } from "@/lib/backend/fixtures/idle-bundle";
import {
  getAnalysisState,
  isAnalysisComplete,
  resetAnalysisRun,
} from "@/lib/backend/analysis-state";

/** Backend analysis service — returns DTO bundle based on pipeline lifecycle state. */
export async function fetchAnalysisBundle(): Promise<AnalysisBundleResponseDto> {
  const state = getAnalysisState();

  if (state.status === "failed") {
    return assembleFailedBundle(state.runId, state.errorMessage ?? "Analysis failed");
  }

  if (isAnalysisComplete()) {
    const cached = getCachedAnalysisBundle();
    if (cached) {
      return cached;
    }

    // Reconstruct when state is complete but cache is missing (e.g. dev reload).
    if (state.runId) {
      try {
        const { getBackendDependencies } = await import("@/lib/backend/dependency-container");
        const { getPipelineExecutionManager } = await import(
          "@/lib/backend/pipeline-execution-manager"
        );
        const { getSlateDataService } = await import("@/lib/backend/data/slate-data-service");
        const slate = await getSlateDataService().ensureReady();
        const { bundle } = await getPipelineExecutionManager().execute(
          state.runId,
          getBackendDependencies().engines,
          { slateId: slate.slateId, slateLabel: slate.slateLabel },
        );
        return bundle;
      } catch {
        resetAnalysisRun();
        return createIdleAnalysisBundle();
      }
    }
  }

  if (state.status === "analyzing") {
    return assembleAnalyzingBundle(
      state.runId ?? "pending",
      "DraftKings NFL Classic — Week 1 (stub)",
    );
  }

  return createIdleAnalysisBundle();
}

export { clearCachedAnalysisBundle };
