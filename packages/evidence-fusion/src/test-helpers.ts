import type { AdiEvidenceItem, AdiEvidencePackage } from "@alpha-dfs/shared";

export function makeEvidenceItem(overrides: Partial<AdiEvidenceItem> & Pick<AdiEvidenceItem, "itemId" | "subjectId">): AdiEvidenceItem {
  return {
    evidenceType: "injury_status",
    subjectType: "player",
    claim: "Test claim",
    confidence: 0.8,
    observedAt: "2026-07-19T12:00:00.000Z",
    ...overrides,
  };
}

export function makeEvidencePackage(overrides: Partial<AdiEvidencePackage> & Pick<AdiEvidencePackage, "packageId" | "sourceId">): AdiEvidencePackage {
  return {
    sourceVersion: "1.0.0",
    fetchedAt: "2026-07-19T12:00:00.000Z",
    ttlSeconds: 3600,
    slateId: "slate-test",
    runId: "run-test",
    items: [],
    providerConfidence: 0.9,
    ...overrides,
  };
}

export const mockRegistry = {
  getWeight(sourceId: string): number {
    if (sourceId.startsWith("news")) return 0.85;
    if (sourceId.startsWith("social")) return 0.65;
    if (sourceId.startsWith("sportsbook")) return 0.9;
    return 0.75;
  },
};

export const fusionContext = {
  runId: "run-test",
  slateId: "slate-test",
  fusedAt: "2026-07-19T12:05:00.000Z",
};
