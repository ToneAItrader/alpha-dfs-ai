import type { AdiEvidencePackage } from "@alpha-dfs/shared";

type CacheEntry = {
  packages: AdiEvidencePackage[];
  expiresAt: number;
};

export type EvidenceCache = {
  set(runId: string, packages: AdiEvidencePackage[], ttlSeconds: number): void;
  get(runId: string): AdiEvidencePackage[] | undefined;
  clear(runId?: string): void;
};

export function createEvidenceCache(): EvidenceCache {
  const store = new Map<string, CacheEntry>();

  return {
    set(runId, packages, ttlSeconds) {
      store.set(runId, {
        packages,
        expiresAt: ttlSeconds <= 0 ? Date.now() - 1 : Date.now() + ttlSeconds * 1000,
      });
    },

    get(runId) {
      const entry = store.get(runId);
      if (!entry) return undefined;
      if (Date.now() > entry.expiresAt) {
        store.delete(runId);
        return undefined;
      }
      return entry.packages;
    },

    clear(runId) {
      if (runId) {
        store.delete(runId);
        return;
      }
      store.clear();
    },
  };
}
