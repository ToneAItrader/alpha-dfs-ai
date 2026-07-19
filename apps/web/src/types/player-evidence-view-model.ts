/**
 * Frontend contract for Player Evidence Viewer page.
 * Evidence Engine + PCE will populate this in Task 10.10 — UI consumes only this shape.
 */

import type { ConfidenceTier } from "@/types/shared/confidence";

export type { ConfidenceTier };

export type InjuryStatus =
  | "healthy"
  | "questionable"
  | "doubtful"
  | "out"
  | "unknown";

export type EvidenceSourceCategory =
  | "historical_performance"
  | "matchup_analysis"
  | "injury_reports"
  | "weather"
  | "market_signals"
  | "expert_consensus";

export type EvidenceSourceStatus = "available" | "partial" | "pending";

export type PlayerEvidenceItemViewModel = {
  playerId: string;
  name: string;
  position: string;
  team: string;
  opponent: string;
  salary: number | null;
  projectedPoints: number | null;
  confidence: number | null;
  confidenceTier: ConfidenceTier | null;
  risk: string | null;
  injuryStatus: InjuryStatus | null;
  matchupSummary: string | null;
  ownershipOutlook: string | null;
  evidenceSources: EvidenceSourceCategory[];
  explainabilitySummary: string;
};

export type PlayerEvidenceViewModel = {
  overview: {
    totalPlayers: number;
    highConfidencePlayers: number;
    moderateConfidencePlayers: number;
    lowConfidencePlayers: number;
    lastAnalysisAt: string | null;
  };
  filters: {
    positions: string[];
    teams: string[];
    confidenceTiers: ConfidenceTier[];
  };
  players: PlayerEvidenceItemViewModel[];
  evidenceSourceCategories: {
    id: EvidenceSourceCategory;
    label: string;
    status: EvidenceSourceStatus;
  }[];
  confidenceSummary: {
    overallConfidence: number | null;
    projectionStability: number | null;
    variance: string | null;
    reliabilityGrade: string | null;
  };
  explainabilitySummary: string[];
  metadata: {
    analysisVersion: string | null;
    timestamp: string | null;
    dataFreshness: string | null;
    evidenceVersion: string | null;
  };
};
