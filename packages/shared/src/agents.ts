import type { AnalysisRunContext } from "./pipeline";
import type { EngineOutputs } from "./engines";
import type { EngineResult } from "./errors";
import { engineFailure, engineSuccess } from "./errors";

/** Lifecycle state for intelligence agent execution. */
export type AgentStatus = "idle" | "running" | "complete" | "failed";

/** Normalized confidence signal — reusable across V2.1 intelligence agents. */
export type ConfidenceScore = {
  /** 0–1 certainty in agent assessment. */
  value: number;
  /** Optional human-readable grade (A–F or similar). */
  grade?: string;
  /** Short rationale for downstream explainability. */
  rationale?: string;
};

/** Single evidence artifact supporting an agent conclusion. */
export type EvidenceItem = {
  id: string;
  category: string;
  summary: string;
  /** Relative weight 0–1 when applicable. */
  weight?: number;
};

/** Structured evidence bundle returned by intelligence agents. */
export type EvidenceCollection = {
  items: EvidenceItem[];
  summary?: string;
};

/** Runtime metadata captured by the orchestrator for each agent invocation. */
export type ExecutionMetadata = {
  agentId: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  status: AgentStatus;
};

/** Standard input contract for V2.1 intelligence agents. */
export type AgentInput = {
  context: AnalysisRunContext;
  priorOutputs?: Partial<EngineOutputs>;
};

/** Standard output contract — domain payload plus confidence, evidence, execution state. */
export type AgentOutput<TData> = {
  data: TData;
  confidence: ConfidenceScore;
  evidence: EvidenceCollection;
  execution: ExecutionMetadata;
};

/** Intelligence agent port — all V2.1 agents implement this interface. */
export interface IntelligenceAgent<TData, TAgentId extends string = string> {
  readonly agentId: TAgentId;
  execute(input: AgentInput): Promise<EngineResult<AgentOutput<TData>>>;
}

type AgentExecutionBody<TData> = () => Promise<
  EngineResult<{
    data: TData;
    confidence: ConfidenceScore;
    evidence: EvidenceCollection;
  }>
>;

/** Wrap agent business logic with standard execution metadata and error handling. */
export async function runIntelligenceAgent<TData>(
  agentId: string,
  body: AgentExecutionBody<TData>,
): Promise<EngineResult<AgentOutput<TData>>> {
  const startedAt = new Date().toISOString();
  const started = Date.now();

  const result = await body();
  const completedAt = new Date().toISOString();
  const durationMs = Date.now() - started;

  if (!result.ok) {
    return engineFailure(result.error.code, result.error.message, agentId);
  }

  return engineSuccess({
    data: result.data.data,
    confidence: result.data.confidence,
    evidence: result.data.evidence,
    execution: {
      agentId,
      startedAt,
      completedAt,
      durationMs,
      status: "complete",
    },
  });
}
