import type { AdiEvidencePackage, AdiNormalizedEvidenceBundle } from "@alpha-dfs/shared";

type CacheEntry = {
  packages: AdiEvidencePackage[];
  bundle?: AdiNormalizedEvidenceBundle;
  expiresAt: number;
};

export type EvidenceCache = {
  set(runId: string, packages: AdiEvidencePackage[], ttlSeconds: number): void;
  get(runId: string): AdiEvidencePackage[] | undefined;
  setBundle(runId: string, bundle: AdiNormalizedEvidenceBundle, ttlSeconds: number): void;
  getBundle(runId: string): AdiNormalizedEvidenceBundle | undefined;
  clear(runId?: string): void;
};

export function createEvidenceCache(): EvidenceCache {
  const store = new Map<string, CacheEntry>();

  return {
    set(runId, packages, ttlSeconds) {
      const existing = store.get(runId);
      store.set(runId, {
        packages,
        bundle: existing?.bundle,
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

    setBundle(runId, bundle, ttlSeconds) {
      const existing = store.get(runId);
      store.set(runId, {
        packages: existing?.packages ?? [],
        bundle,
        expiresAt: ttlSeconds <= 0 ? Date.now() - 1 : Date.now() + ttlSeconds * 1000,
      });
    },

    getBundle(runId) {
      const entry = store.get(runId);
      if (!entry) return undefined;
      if (Date.now() > entry.expiresAt) {
        store.delete(runId);
        return undefined;
      }
      return entry.bundle;
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
