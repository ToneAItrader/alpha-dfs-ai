import type { BackendError } from "./errors";

/** Pipeline lifecycle states — mirrors frontend AnalysisRunStatus contract. */
export type PipelineLifecycleStatus = "idle" | "analyzing" | "complete" | "failed";

/** Ordered pipeline phases for orchestration. */
export type PipelinePhase =
  | "slate_analysis"
  | "slate_intelligence"
  | "injury_intelligence"
  | "vegas_intelligence"
  | "weather_intelligence"
  | "ownership_intelligence"
  | "projection_calibration"
  | "player_analysis"
  | "confidence"
  | "portfolio"
  | "simulation"
  | "readiness";

export const PIPELINE_PHASE_ORDER: readonly PipelinePhase[] = [
  "slate_analysis",
  "slate_intelligence",
  "injury_intelligence",
  "vegas_intelligence",
  "weather_intelligence",
  "ownership_intelligence",
  "projection_calibration",
  "player_analysis",
  "confidence",
  "portfolio",
  "simulation",
  "readiness",
] as const;

/** v1 scope lock — DraftKings · NFL · Classic Salary Cap. */
export type AnalysisRunContext = {
  runId: string;
  platform: "draftkings";
  sport: "nfl";
  contest: "classic_salary_cap";
  slateLabel: string;
  slateId?: string;
  startedAt: string;
  /** Upstream engine outputs — populated by pipeline orchestrator. */
  priorOutputs?: Partial<import("./engines").EngineOutputs>;
};

export function createAnalysisRunContext(
  runId: string,
  options?: { slateId?: string; slateLabel?: string },
): AnalysisRunContext {
  return {
    runId,
    platform: "draftkings",
    sport: "nfl",
    contest: "classic_salary_cap",
    slateLabel: options?.slateLabel ?? "DraftKings NFL Classic — Week 1",
    slateId: options?.slateId,
    startedAt: new Date().toISOString(),
  };
}

export type PipelineExecutionResult = {
  runId: string;
  status: "complete" | "failed";
  completedAt: string;
  phasesCompleted: PipelinePhase[];
  error?: BackendError;
};
