import type { AdiEvidenceItem } from "@alpha-dfs/shared";
import type { WeightedEvidenceItem } from "./types";

export function collectSourceCoverage(items: WeightedEvidenceItem[]): string[] {
  return [...new Set(items.map((item) => item.sourceId))].sort();
}

export function collectProvenanceRefs(items: WeightedEvidenceItem[]): string[] {
  return [...new Set(items.flatMap((item) => item.supportingRefs ?? [item.provenance.itemId]))].sort();
}

export function attachProvenance(item: AdiEvidenceItem, refs: string[]): AdiEvidenceItem {
  return {
    ...item,
    supportingRefs: refs,
  };
}

export function provenanceNote(sourceCoverage: string[]): string | undefined {
  if (sourceCoverage.length === 0) return undefined;
  return `Sources: ${sourceCoverage.join(", ")}`;
}
