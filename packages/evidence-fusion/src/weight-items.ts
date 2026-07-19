import type { AdiEvidencePackage } from "@alpha-dfs/shared";
import { computeFreshnessScore } from "./expire-items";
import type { FusionSourceRegistry, ProvenanceRecord, WeightedEvidenceItem } from "./types";

type ActiveItem = { item: import("@alpha-dfs/shared").AdiEvidenceItem; pkg: AdiEvidencePackage };

export function weightItems(
  active: ActiveItem[],
  registry: FusionSourceRegistry,
  nowMs: number = Date.now(),
): WeightedEvidenceItem[] {
  return active.map(({ item, pkg }) => {
    const sourceWeight = registry.getWeight(pkg.sourceId);
    const freshnessScore = computeFreshnessScore(item.observedAt, nowMs);
    const effectiveConfidence = item.confidence * sourceWeight * freshnessScore * pkg.providerConfidence;

    const provenance: ProvenanceRecord = {
      sourceId: pkg.sourceId,
      packageId: pkg.packageId,
      itemId: item.itemId,
    };

    return {
      ...item,
      sourceId: pkg.sourceId,
      packageId: pkg.packageId,
      providerConfidence: pkg.providerConfidence,
      sourceWeight,
      freshnessScore,
      effectiveConfidence,
      provenance,
      supportingRefs: [...(item.supportingRefs ?? []), provenance.itemId],
    };
  });
}

export function sortByEffectiveConfidence(items: WeightedEvidenceItem[]): WeightedEvidenceItem[] {
  return [...items].sort((a, b) => b.effectiveConfidence - a.effectiveConfidence);
}
