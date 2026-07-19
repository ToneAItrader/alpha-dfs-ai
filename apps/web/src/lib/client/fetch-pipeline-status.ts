import {
  mapPipelineStatusForDisplay,
  type PipelineDisplayStatus,
} from "@/lib/mappers/pipeline-status-mapper";
import type { PipelineStatusResponseDto } from "@/types/dto/analysis-responses.dto";

/** Client fetch for GET /api/pipeline/status — page-load and post-analyze refresh only. */
export async function fetchPipelineDisplayStatus(): Promise<PipelineDisplayStatus> {
  const response = await fetch("/api/pipeline/status");
  if (!response.ok) {
    throw new Error("Pipeline status request failed");
  }
  const body = (await response.json()) as PipelineStatusResponseDto;
  return mapPipelineStatusForDisplay(body.status);
}
