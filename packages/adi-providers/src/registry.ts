import type { ConnectorManager, EvidenceProvider } from "@alpha-dfs/adi-platform";
import { createBettingProvider } from "./providers/betting-provider";
import { createConsensusProvider } from "./providers/consensus-provider";
import { createDfsContentProvider } from "./providers/dfs-content-provider";
import { createHistoricalLearningProvider } from "./providers/historical-learning-provider";
import { createNewsProvider } from "./providers/news-provider";
import { createSocialProvider } from "./providers/social-provider";
import { createSportsbookProvider } from "./providers/sportsbook-provider";

export const ADI_PROVIDER_IDS = [
  "news",
  "social",
  "sportsbook",
  "consensus",
  "dfs_content",
  "betting",
  "historical_learning",
] as const;

export type AdiProviderId = (typeof ADI_PROVIDER_IDS)[number];

export function createAllEvidenceProviders(): EvidenceProvider[] {
  return [
    createNewsProvider(),
    createSocialProvider(),
    createSportsbookProvider(),
    createConsensusProvider(),
    createDfsContentProvider(),
    createBettingProvider(),
    createHistoricalLearningProvider(),
  ];
}

export function registerEvidenceProviders(connectorManager: ConnectorManager): void {
  for (const provider of createAllEvidenceProviders()) {
    connectorManager.register(provider);
  }
}

export {
  createNewsProvider,
  createSocialProvider,
  createSportsbookProvider,
  createConsensusProvider,
  createDfsContentProvider,
  createBettingProvider,
  createHistoricalLearningProvider,
};
