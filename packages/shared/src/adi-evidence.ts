/** Canonical ADI evidence types — ADR-020. Distinct from V2.1 agent EvidenceItem in agents.ts. */

export type AdiEvidenceType =
  | "injury_status"
  | "practice_report"
  | "game_status"
  | "projection_delta"
  | "consensus_projection"
  | "projection_variance"
  | "line_movement"
  | "implied_total"
  | "sharp_indicator"
  | "social_sentiment"
  | "narrative_confidence"
  | "rumor_confidence"
  | "chalk_probability"
  | "leverage_signal"
  | "ownership_estimate"
  | "stack_recommendation"
  | "contrarian_signal"
  | "source_reliability"
  | "provider_health";

export type AdiEvidenceSubjectType = "player" | "team" | "game" | "slate";

export type AdiEvidenceItem = {
  itemId: string;
  evidenceType: AdiEvidenceType;
  subjectType: AdiEvidenceSubjectType;
  subjectId: string;
  claim: string;
  direction?: "positive" | "negative" | "neutral";
  magnitude?: number;
  confidence: number;
  observedAt: string;
  expiresAt?: string;
  supportingRefs?: string[];
};

export type AdiEvidencePackage = {
  packageId: string;
  sourceId: string;
  sourceVersion: string;
  fetchedAt: string;
  ttlSeconds: number;
  slateId: string;
  runId: string;
  items: AdiEvidenceItem[];
  providerConfidence: number;
  metadata?: Record<string, string>;
};

export type AdiConflictRecord = {
  subjectId: string;
  evidenceType: AdiEvidenceType;
  directions: Array<AdiEvidenceItem["direction"]>;
  resolution: "higher_confidence" | "unresolved";
};

export type AdiNormalizedEvidence = {
  subjectType: AdiEvidenceSubjectType;
  subjectId: string;
  fusedConfidence: number;
  items: AdiEvidenceItem[];
  conflicts: AdiConflictRecord[];
  freshnessScore: number;
  sourceCoverage: string[];
};

export type AdiNormalizedEvidenceBundle = {
  bundleId: string;
  runId: string;
  slateId: string;
  fusedAt: string;
  version: "fusion-1.0";
  subjects: AdiNormalizedEvidence[];
  platformConfidence: number;
  degradationNotes: string[];
};
