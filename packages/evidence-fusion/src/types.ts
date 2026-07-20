import type {
  AdiEvidenceItem,
  AdiEvidencePackage,
  AdiNormalizedEvidence,
  AdiNormalizedEvidenceBundle,
} from "@alpha-dfs/shared";

export type FusionContext = {
  runId: string;
  slateId: string;
  fusedAt?: string;
  topNPerType?: number;
};

/** Minimal registry surface to avoid circular dependency with adi-platform. */
export type FusionSourceRegistry = {
  getWeight(sourceId: string): number;
};

export type FusionMetrics = {
  itemsIn: number;
  itemsOut: number;
  conflictCount: number;
};

export type ValidatedPackage = {
  package: AdiEvidencePackage;
  valid: true;
} | {
  package: AdiEvidencePackage;
  valid: false;
  reason: string;
};

export type ProvenanceRecord = {
  sourceId: string;
  packageId: string;
  itemId: string;
};

export type WeightedEvidenceItem = AdiEvidenceItem & {
  sourceId: string;
  packageId: string;
  providerConfidence: number;
  sourceWeight: number;
  freshnessScore: number;
  effectiveConfidence: number;
  provenance: ProvenanceRecord;
};

export type SubjectAggregation = AdiNormalizedEvidence & {
  qualityScore: number;
};

export type FuseEvidenceInput = {
  packages: AdiEvidencePackage[];
  registry: FusionSourceRegistry;
  context: FusionContext;
};

export type FuseEvidenceResult = {
  bundle: AdiNormalizedEvidenceBundle;
  metrics: FusionMetrics;
};

export type { AdiNormalizedEvidence, AdiNormalizedEvidenceBundle };
