import type { AnalysisRunStatus } from "@/types/dto/analysis-responses.dto";

/** Display status shared by header and dashboard status bar. */
export type PipelineDisplayStatus = "idle" | "analyzing" | "complete";

export const pipelineStatusLabels: Record<PipelineDisplayStatus, string> = {
  idle: "Idle",
  analyzing: "Analyzing",
  complete: "Complete",
};

export const pipelineStatusStyles: Record<PipelineDisplayStatus, string> = {
  idle: "bg-muted/20 text-muted ring-muted/30",
  analyzing: "bg-warning/10 text-warning ring-warning/30",
  complete: "bg-success/10 text-success ring-success/30",
};

/** Maps backend pipeline status → UI display status (failed surfaces as idle). */
export function mapPipelineStatusForDisplay(
  status: AnalysisRunStatus,
): PipelineDisplayStatus {
  if (status === "failed") {
    return "idle";
  }
  if (status === "analyzing" || status === "complete" || status === "idle") {
    return status;
  }
  return "idle";
}
