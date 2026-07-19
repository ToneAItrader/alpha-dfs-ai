import type { AdiEvidenceItem, AdiEvidencePackage } from "@alpha-dfs/shared";

export type ExpiredItem = {
  item: AdiEvidenceItem;
  package: AdiEvidencePackage;
  reason: "item_expired" | "package_expired";
};

export function expireItems(
  packages: AdiEvidencePackage[],
  nowMs: number = Date.now(),
): { active: Array<{ item: AdiEvidenceItem; pkg: AdiEvidencePackage }>; expired: ExpiredItem[] } {
  const active: Array<{ item: AdiEvidenceItem; pkg: AdiEvidencePackage }> = [];
  const expired: ExpiredItem[] = [];

  for (const pkg of packages) {
    const fetchedAtMs = Date.parse(pkg.fetchedAt);
    const packageExpired =
      Number.isFinite(fetchedAtMs) && pkg.ttlSeconds > 0 && nowMs > fetchedAtMs + pkg.ttlSeconds * 1000;

    for (const item of pkg.items) {
      if (packageExpired) {
        expired.push({ item, package: pkg, reason: "package_expired" });
        continue;
      }

      if (item.expiresAt) {
        const expiresAtMs = Date.parse(item.expiresAt);
        if (Number.isFinite(expiresAtMs) && nowMs > expiresAtMs) {
          expired.push({ item, package: pkg, reason: "item_expired" });
          continue;
        }
      }

      active.push({ item, pkg });
    }
  }

  return { active, expired };
}

export function computeFreshnessScore(observedAt: string, nowMs: number = Date.now()): number {
  const observedMs = Date.parse(observedAt);
  if (!Number.isFinite(observedMs)) {
    return 0.5;
  }

  const ageMs = Math.max(0, nowMs - observedMs);
  // Linear decay over 6 hours; floor at 0.2
  const maxAgeMs = 6 * 60 * 60 * 1000;
  const score = 1 - ageMs / maxAgeMs;
  return Math.max(0.2, Math.min(1, score));
}

export function averageFreshness(items: Array<{ item: AdiEvidenceItem }>, nowMs: number = Date.now()): number {
  if (items.length === 0) return 0;
  const total = items.reduce((sum, entry) => sum + computeFreshnessScore(entry.item.observedAt, nowMs), 0);
  return total / items.length;
}
