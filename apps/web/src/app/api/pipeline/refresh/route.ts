import { NextResponse } from "next/server";
import { withCorrelationFromRequest } from "@/lib/backend/operations/correlation-middleware";
import { getDataOperationsService } from "@/lib/backend/operations/data-operations-service";
import { operationalLog } from "@/lib/backend/operations/operational-logger";

function mapSourceResults(
  sourceResults: Array<{
    sourceId: string;
    ok: boolean;
    attempts: number;
    error?: string;
  }>,
) {
  return sourceResults.map((result) => ({
    sourceId: result.sourceId,
    ok: result.ok,
    attempts: result.attempts,
    error: result.error,
  }));
}

export async function POST(request: Request) {
  return withCorrelationFromRequest(request, async () => {
    try {
      const result = await getDataOperationsService().refreshAndEnsureReady();
      operationalLog("info", "refresh.api", "Manual refresh completed", {
        slateId: result.slateId,
        degraded: result.degraded,
      });

      return NextResponse.json({
        status: result.degraded ? "degraded" : "complete",
        slateId: result.slateId,
        slateLabel: result.slateLabel,
        degraded: result.degraded,
        sourceResults: mapSourceResults(result.sourceResults),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Refresh failed";
      operationalLog("error", "refresh.api", message);
      return NextResponse.json({ status: "failed", error: message }, { status: 500 });
    }
  });
}
