/** Shared confidence presentation types — used across view models and UI components. */

export type ConfidenceTier = "high" | "moderate" | "low";

export type ConfidenceStatus = "idle" | "analyzing" | "ready" | "incomplete";

export type ReliabilityGrade = "A" | "B" | "C" | "D" | "F";

export type VarianceRating = "low" | "medium" | "high";

export type AnalysisRunStatus = "idle" | "analyzing" | "complete" | "failed";

export type AnalysisMetadataDto = {
  analysisVersion: string | null;
  timestamp: string | null;
  dataFreshness: string | null;
};
