import type { AdiEvidenceItem, AdiEvidencePackage } from "@alpha-dfs/shared";
import { DEDUPE_WINDOW_MS } from "./constants";

type ActiveItem = { item: AdiEvidenceItem; pkg: AdiEvidencePackage };

function dedupeKey(item: AdiEvidenceItem): string {
  return `${item.subjectId}|${item.evidenceType}|${item.direction ?? "neutral"}`;
}

function withinWindow(a: string, b: string, windowMs: number): boolean {
  const aMs = Date.parse(a);
  const bMs = Date.parse(b);
  if (!Number.isFinite(aMs) || !Number.isFinite(bMs)) {
    return true;
  }
  return Math.abs(aMs - bMs) <= windowMs;
}

export function deduplicateItems(
  active: ActiveItem[],
  windowMs: number = DEDUPE_WINDOW_MS,
): ActiveItem[] {
  const groups = new Map<string, ActiveItem[]>();

  for (const entry of active) {
    const key = dedupeKey(entry.item);
    const bucket = groups.get(key) ?? [];
    bucket.push(entry);
    groups.set(key, bucket);
  }

  const deduped: ActiveItem[] = [];

  for (const bucket of groups.values()) {
    const sorted = [...bucket].sort((a, b) => b.item.confidence - a.item.confidence);
    const kept: ActiveItem[] = [];

    for (const candidate of sorted) {
      const duplicate = kept.some((existing) =>
        withinWindow(existing.item.observedAt, candidate.item.observedAt, windowMs),
      );
      if (!duplicate) {
        kept.push(candidate);
      }
    }

    deduped.push(...kept);
  }

  return deduped;
}

export function dedupeNoteCount(before: number, after: number): string | undefined {
  const removed = before - after;
  if (removed <= 0) return undefined;
  return `Deduplicated ${removed} evidence item(s) within ${DEDUPE_WINDOW_MS / 1000}s window`;
}
