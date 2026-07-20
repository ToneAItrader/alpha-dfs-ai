import type { AdiConflictRecord, AdiEvidenceType } from "@alpha-dfs/shared";
import { CONFLICT_CONFIDENCE_BAND, CONFLICT_CONFIDENCE_PENALTY } from "./constants";
import type { WeightedEvidenceItem } from "./types";

function directionKey(direction: WeightedEvidenceItem["direction"]): string {
  return direction ?? "neutral";
}

function areOpposing(a: WeightedEvidenceItem["direction"], b: WeightedEvidenceItem["direction"]): boolean {
  if (!a || !b || a === "neutral" || b === "neutral") {
    return false;
  }
  return a !== b;
}

export type ConflictResolution = {
  items: WeightedEvidenceItem[];
  conflicts: AdiConflictRecord[];
  confidencePenalty: number;
};

export function resolveConflicts(items: WeightedEvidenceItem[]): ConflictResolution {
  const groups = new Map<string, WeightedEvidenceItem[]>();
  const conflicts: AdiConflictRecord[] = [];
  let confidencePenalty = 0;

  for (const item of items) {
    const key = `${item.subjectId}|${item.evidenceType}`;
    const bucket = groups.get(key) ?? [];
    bucket.push(item);
    groups.set(key, bucket);
  }

  const resolved: WeightedEvidenceItem[] = [];

  for (const [key, bucket] of groups.entries()) {
    const [subjectId, evidenceType] = key.split("|") as [string, AdiEvidenceType];
    const directions = new Set(bucket.map((item) => directionKey(item.direction)));
    const hasOpposition = [...directions].some((dirA) =>
      bucket.some((itemA) =>
        bucket.some(
          (itemB) =>
            itemA !== itemB &&
            areOpposing(itemA.direction, itemB.direction) &&
            directionKey(itemA.direction) === dirA,
        ),
      ),
    );

    if (!hasOpposition) {
      resolved.push(...bucket);
      continue;
    }

    const positive = bucket.filter((item) => item.direction === "positive");
    const negative = bucket.filter((item) => item.direction === "negative");
    const neutral = bucket.filter((item) => item.direction === "neutral" || !item.direction);

    const positiveScore = positive.reduce((sum, item) => sum + item.effectiveConfidence, 0);
    const negativeScore = negative.reduce((sum, item) => sum + item.effectiveConfidence, 0);
    const totalScore = positiveScore + negativeScore;

    const positiveShare = totalScore > 0 ? positiveScore / totalScore : 0.5;
    const withinBand = Math.abs(positiveShare - 0.5) <= CONFLICT_CONFIDENCE_BAND / 2;

    conflicts.push({
      subjectId,
      evidenceType,
      directions: [...directions] as AdiConflictRecord["directions"],
      resolution: withinBand ? "unresolved" : "higher_confidence",
    });

    if (withinBand) {
      confidencePenalty += CONFLICT_CONFIDENCE_PENALTY;
      resolved.push(...bucket);
      continue;
    }

    if (positiveScore >= negativeScore) {
      resolved.push(...positive, ...neutral);
    } else {
      resolved.push(...negative, ...neutral);
    }
  }

  return { items: resolved, conflicts, confidencePenalty };
}

export function countConflicts(conflicts: AdiConflictRecord[]): number {
  return conflicts.length;
}
