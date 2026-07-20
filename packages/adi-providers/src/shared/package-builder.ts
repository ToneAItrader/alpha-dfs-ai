import type { AdiEvidenceItem, AdiEvidencePackage } from "@alpha-dfs/shared";
import { isoNow } from "./player-resolver";

export function buildEvidencePackage(input: {
  packageId: string;
  sourceId: string;
  sourceVersion: string;
  slateId: string;
  runId: string;
  items: AdiEvidenceItem[];
  providerConfidence: number;
  ttlSeconds?: number;
  metadata?: Record<string, string>;
}): AdiEvidencePackage {
  return {
    packageId: input.packageId,
    sourceId: input.sourceId,
    sourceVersion: input.sourceVersion,
    fetchedAt: isoNow(),
    ttlSeconds: input.ttlSeconds ?? 3600,
    slateId: input.slateId,
    runId: input.runId,
    items: input.items,
    providerConfidence: input.providerConfidence,
    metadata: input.metadata,
  };
}

export function buildEvidenceItem(input: {
  itemId: string;
  evidenceType: AdiEvidenceItem["evidenceType"];
  subjectType: AdiEvidenceItem["subjectType"];
  subjectId: string;
  claim: string;
  confidence: number;
  direction?: AdiEvidenceItem["direction"];
  magnitude?: number;
  expiresAt?: string;
}): AdiEvidenceItem {
  return {
    itemId: input.itemId,
    evidenceType: input.evidenceType,
    subjectType: input.subjectType,
    subjectId: input.subjectId,
    claim: input.claim,
    direction: input.direction,
    magnitude: input.magnitude,
    confidence: input.confidence,
    observedAt: isoNow(),
    expiresAt: input.expiresAt,
  };
}
