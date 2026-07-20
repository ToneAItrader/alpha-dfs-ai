import { DEFAULT_TOP_N_PER_TYPE } from "./constants";
import { averageFreshness } from "./expire-items";
import { attachProvenance, collectProvenanceRefs, collectSourceCoverage } from "./provenance";
import type { SubjectAggregation, WeightedEvidenceItem } from "./types";

function selectTopNPerType(items: WeightedEvidenceItem[], topN: number): WeightedEvidenceItem[] {
  const byType = new Map<string, WeightedEvidenceItem[]>();

  for (const item of items) {
    const bucket = byType.get(item.evidenceType) ?? [];
    bucket.push(item);
    byType.set(item.evidenceType, bucket);
  }

  const selected: WeightedEvidenceItem[] = [];
  for (const bucket of byType.values()) {
    const sorted = [...bucket].sort((a, b) => b.effectiveConfidence - a.effectiveConfidence);
    selected.push(...sorted.slice(0, topN));
  }

  return selected;
}

function weightedMeanConfidence(items: WeightedEvidenceItem[]): number {
  if (items.length === 0) return 0;
  const totalWeight = items.reduce((sum, item) => sum + item.effectiveConfidence, 0);
  if (totalWeight <= 0) {
    const mean = items.reduce((sum, item) => sum + item.confidence, 0) / items.length;
    return Math.max(0, Math.min(1, mean));
  }
  const weighted = items.reduce((sum, item) => sum + item.confidence * item.effectiveConfidence, 0);
  return Math.max(0, Math.min(1, weighted / totalWeight));
}

export function computeQualityScore(items: WeightedEvidenceItem[], sourceCoverage: string[]): number {
  if (items.length === 0) return 0;

  const sourceFactor = Math.min(1, sourceCoverage.length / 3);
  const confidenceFactor = weightedMeanConfidence(items);
  const freshnessFactor = averageFreshness(items.map((item) => ({ item })));

  return Math.max(0, Math.min(1, sourceFactor * 0.35 + confidenceFactor * 0.45 + freshnessFactor * 0.2));
}

export function aggregateSubjects(
  items: WeightedEvidenceItem[],
  conflicts: import("@alpha-dfs/shared").AdiConflictRecord[],
  topNPerType: number = DEFAULT_TOP_N_PER_TYPE,
  confidencePenalty: number = 0,
): SubjectAggregation[] {
  const bySubject = new Map<string, WeightedEvidenceItem[]>();

  for (const item of items) {
    const bucket = bySubject.get(item.subjectId) ?? [];
    bucket.push(item);
    bySubject.set(item.subjectId, bucket);
  }

  const subjects: SubjectAggregation[] = [];

  for (const [subjectId, subjectItems] of bySubject.entries()) {
    const selected = selectTopNPerType(subjectItems, topNPerType);
    const sourceCoverage = collectSourceCoverage(selected);
    const refs = collectProvenanceRefs(selected);
    let fusedConfidence = weightedMeanConfidence(selected);
    fusedConfidence = Math.max(0, fusedConfidence * (1 - confidencePenalty));

    const subjectConflicts = conflicts.filter((conflict) => conflict.subjectId === subjectId);
    if (subjectConflicts.some((conflict) => conflict.resolution === "unresolved")) {
      fusedConfidence = Math.max(0, fusedConfidence * (1 - 0.2));
    }

    if (sourceCoverage.length === 1) {
      fusedConfidence = Math.max(0, fusedConfidence * 0.9);
    }

    subjects.push({
      subjectType: subjectItems[0]?.subjectType ?? "player",
      subjectId,
      fusedConfidence,
      items: selected.map((item) =>
        attachProvenance(
          {
            itemId: item.itemId,
            evidenceType: item.evidenceType,
            subjectType: item.subjectType,
            subjectId: item.subjectId,
            claim: item.claim,
            direction: item.direction,
            magnitude: item.magnitude,
            confidence: item.confidence,
            observedAt: item.observedAt,
            expiresAt: item.expiresAt,
          },
          refs,
        ),
      ),
      conflicts: subjectConflicts,
      freshnessScore: averageFreshness(selected.map((item) => ({ item }))),
      sourceCoverage,
      qualityScore: computeQualityScore(selected, sourceCoverage),
    } as SubjectAggregation);
  }

  return subjects.sort((a, b) => a.subjectId.localeCompare(b.subjectId));
}

export function computePlatformConfidence(subjects: SubjectAggregation[]): number {
  if (subjects.length === 0) return 0;
  const total = subjects.reduce((sum, subject) => sum + subject.fusedConfidence * subject.qualityScore, 0);
  const weight = subjects.reduce((sum, subject) => sum + subject.qualityScore, 0);
  if (weight <= 0) return 0;
  return Math.max(0, Math.min(1, total / weight));
}
