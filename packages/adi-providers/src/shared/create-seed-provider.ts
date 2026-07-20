import type {
  EvidenceDomain,
  EvidenceFetchContext,
  EvidenceFetchResult,
  EvidenceProvider,
  ProviderHealth,
} from "@alpha-dfs/adi-platform";
import type { AdiEvidencePackage } from "@alpha-dfs/shared";
import { loadProviderFixture } from "./fixture-loader";
import { withProviderRetry, type ProviderPriority } from "./provider-retry";

export type SeedProviderConfig<TFixture> = {
  providerId: string;
  providerVersion: string;
  domains: EvidenceDomain[];
  priority: ProviderPriority;
  fixtureFile: string;
  normalize: (fixture: TFixture, context: EvidenceFetchContext) => AdiEvidencePackage[];
  simulateFailure?: boolean;
  fixtureOverride?: TFixture;
};

export function createSeedEvidenceProvider<TFixture>(
  config: SeedProviderConfig<TFixture>,
): EvidenceProvider {
  const loadFixture = (): TFixture => {
    if (config.fixtureOverride) {
      return config.fixtureOverride;
    }
    return loadProviderFixture<TFixture>(config.fixtureFile);
  };

  return {
    providerId: config.providerId,
    providerVersion: config.providerVersion,
    domains: config.domains,

    async fetch(context): Promise<EvidenceFetchResult> {
      if (config.simulateFailure) {
        return {
          ok: false,
          error: {
            code: "PROVIDER_UNAVAILABLE",
            message: `${config.providerId} simulated failure`,
            providerId: config.providerId,
          },
          retryable: true,
        };
      }

      try {
        const packages = await withProviderRetry(config.providerId, config.priority, async () => {
          const fixture = loadFixture();
          return config.normalize(fixture, context).map((pkg) => ({
            ...pkg,
            metadata: { ...pkg.metadata, providerId: config.providerId },
          }));
        });

        if (packages.length === 0) {
          return { ok: true, packages: [], degraded: true };
        }

        return { ok: true, packages };
      } catch (error) {
        return {
          ok: false,
          error: {
            code: "FETCH_FAILED",
            message: error instanceof Error ? error.message : "Provider fetch failed",
            providerId: config.providerId,
          },
          retryable: true,
        };
      }
    },

    async health(): Promise<ProviderHealth> {
      if (config.simulateFailure) {
        return {
          providerId: config.providerId,
          status: "unavailable",
          lastCheckedAt: new Date().toISOString(),
          message: "Simulated failure",
        };
      }

      try {
        loadFixture();
        return {
          providerId: config.providerId,
          status: "healthy",
          lastCheckedAt: new Date().toISOString(),
        };
      } catch (error) {
        return {
          providerId: config.providerId,
          status: "degraded",
          lastCheckedAt: new Date().toISOString(),
          message: error instanceof Error ? error.message : "Fixture unavailable",
        };
      }
    },
  };
}
