import {
  engineSuccess,
  type OwnershipIntelligenceEngine,
  type OwnershipIntelligenceOutput,
} from "@alpha-dfs/shared";

export function createStubOwnershipIntelligenceEngine(): OwnershipIntelligenceEngine {
  return {
    engineId: "ownership_intelligence",
    async analyze() {
      const data: OwnershipIntelligenceOutput = {
        players: [],
        averagePredictedOwnership: 0,
        chalkPlayerCount: 0,
        contrarianPlayerCount: 0,
        leverageOpportunities: 0,
        ownershipConcentration: 0,
        assessment: "Ownership intelligence unavailable in stub mode",
        factors: [],
        version: "own-1.0-stub",
      };
      return engineSuccess(data);
    },
  };
}
