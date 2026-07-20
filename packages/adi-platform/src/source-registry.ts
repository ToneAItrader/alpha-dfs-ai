import type { ProviderDescriptor } from "./provider-contract";
import { isProviderEnabled } from "./adi-config";

const DEFAULT_DESCRIPTORS: ProviderDescriptor[] = [
  {
    providerId: "news",
    displayName: "News Intelligence",
    version: "1.0.0",
    domains: ["news"],
    defaultWeight: 0.85,
    priority: "P0",
  },
  {
    providerId: "social",
    displayName: "Social Intelligence",
    version: "1.0.0",
    domains: ["social"],
    defaultWeight: 0.65,
    priority: "P1",
  },
  {
    providerId: "sportsbook",
    displayName: "Sportsbook Intelligence",
    version: "1.0.0",
    domains: ["sportsbook"],
    defaultWeight: 0.9,
    priority: "P0",
  },
  {
    providerId: "consensus",
    displayName: "Consensus Intelligence",
    version: "1.0.0",
    domains: ["consensus"],
    defaultWeight: 0.8,
    priority: "P0",
  },
  {
    providerId: "dfs_content",
    displayName: "DFS Content Intelligence",
    version: "1.0.0",
    domains: ["dfs_content"],
    defaultWeight: 0.7,
    priority: "P1",
  },
  {
    providerId: "betting",
    displayName: "Betting Intelligence",
    version: "1.0.0",
    domains: ["betting"],
    defaultWeight: 0.75,
    priority: "P1",
  },
  {
    providerId: "historical_learning",
    displayName: "Historical Learning",
    version: "1.0.0",
    domains: ["historical_learning"],
    defaultWeight: 1.0,
    priority: "P2",
  },
];

export type SourceRegistry = {
  register(descriptor: ProviderDescriptor): void;
  getProvider(id: string): ProviderDescriptor | undefined;
  getWeight(sourceId: string): number;
  isEnabled(providerId: string): boolean;
  listProviders(): ProviderDescriptor[];
  listEnabledProviderIds(): string[];
};

export function createSourceRegistry(
  descriptors: ProviderDescriptor[] = DEFAULT_DESCRIPTORS,
): SourceRegistry {
  const byId = new Map<string, ProviderDescriptor>();
  for (const descriptor of descriptors) {
    byId.set(descriptor.providerId, descriptor);
  }

  return {
    register(descriptor) {
      byId.set(descriptor.providerId, descriptor);
    },

    getProvider(id) {
      return byId.get(id);
    },

    getWeight(sourceId) {
      const providerId = sourceId.split("-")[0] ?? sourceId;
      return byId.get(providerId)?.defaultWeight ?? 0.5;
    },

    isEnabled(providerId) {
      return isProviderEnabled(providerId);
    },

    listProviders() {
      return [...byId.values()];
    },

    listEnabledProviderIds() {
      return [...byId.keys()].filter((id) => isProviderEnabled(id));
    },
  };
}
