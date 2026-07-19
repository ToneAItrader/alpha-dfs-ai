import { NextResponse } from "next/server";
import {
  generateCorrelationId,
  runWithCorrelationContextAsync,
} from "@alpha-dfs/observability";
import {
  completeAnalysisRun,
  failAnalysisRun,
  getAnalysisState,
  startAnalysisRun,
} from "@/lib/backend/analysis-state";
import { clearCachedAnalysisBundle } from "@/lib/backend/analysis-cache";
import { getSlateDataService } from "@/lib/backend/data/slate-data-service";
import { getBackendDependencies } from "@/lib/backend/dependency-container";
import { getPipelineExecutionManager } from "@/lib/backend/pipeline-execution-manager";

export async function POST(request: Request) {
  const correlationId =
    request.headers.get("X-Correlation-ID")?.trim() || generateCorrelationId();

  return runWithCorrelationContextAsync({ correlationId }, async () => {
    clearCachedAnalysisBundle();
    const started = startAnalysisRun();

    return runWithCorrelationContextAsync(
      { correlationId, runId: started.runId ?? undefined },
      async () => {
        try {
          const slate = await getSlateDataService().refreshAndEnsureReady(started.runId ?? undefined);
          const { engines } = getBackendDependencies();
          await getPipelineExecutionManager().execute(started.runId!, engines, {
            slateId: slate.slateId,
            slateLabel: slate.slateLabel,
          });
          completeAnalysisRun();
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Pipeline execution failed";
          failAnalysisRun(message);
          const state = getAnalysisState();
          return NextResponse.json(
            { runId: state.runId, status: state.status, error: message, correlationId },
            { status: 500 },
          );
        }

        const state = getAnalysisState();
        return NextResponse.json({
          runId: state.runId,
          status: state.status,
          correlationId,
        });
      },
    );
  });
}
