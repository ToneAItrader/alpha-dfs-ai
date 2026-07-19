import type { AdiEvidencePackage } from "@alpha-dfs/shared";
import { recordProviderFailure, recordProviderFetchDuration } from "./metrics";
import type {
  EvidenceFetchContext,
  EvidenceProvider,
  ProviderHealth,
} from "./provider-contract";
import type { SourceRegistry } from "./source-registry";

export type ConnectorManager = {
  register(provider: EvidenceProvider): void;
  fetchAll(context: EvidenceFetchContext): Promise<AdiEvidencePackage[]>;
  getHealth(): Promise<ProviderHealth[]>;
  listRegisteredProviderIds(): string[];
};

export function createConnectorManager(registry: SourceRegistry): ConnectorManager {
  const providers = new Map<string, EvidenceProvider>();

  return {
    register(provider) {
      providers.set(provider.providerId, provider);
    },

    async fetchAll(context) {
      const enabledIds = registry.listEnabledProviderIds().filter((id) => providers.has(id));
      const packages: AdiEvidencePackage[] = [];

      await Promise.allSettled(
        enabledIds.map(async (providerId) => {
          const provider = providers.get(providerId);
          if (!provider) return;
          const started = Date.now();
          try {
            const result = await provider.fetch(context);
            recordProviderFetchDuration(providerId, Date.now() - started);
            if (result.ok) {
              packages.push(...result.packages);
              return;
            }
            recordProviderFailure(providerId, result.error.code);
          } catch (error) {
            recordProviderFetchDuration(providerId, Date.now() - started);
            recordProviderFailure(providerId, error instanceof Error ? error.name : "unknown");
          }
        }),
      );

      return packages;
    },

    async getHealth() {
      const checks = await Promise.all(
        [...providers.values()].map(async (provider) => {
          try {
            return await provider.health();
          } catch (error) {
            return {
              providerId: provider.providerId,
              status: "unavailable" as const,
              lastCheckedAt: new Date().toISOString(),
              message: error instanceof Error ? error.message : "Health check failed",
            };
          }
        }),
      );
      return checks;
    },

    listRegisteredProviderIds() {
      return [...providers.keys()];
    },
  };
}

/** M4 stub — returns empty packages without invoking providers. */
export function createConnectorManagerStub(): ConnectorManager {
  return {
    register() {},
    async fetchAll() {
      return [];
    },
    async getHealth() {
      return [];
    },
    listRegisteredProviderIds() {
      return [];
    },
  };
}
