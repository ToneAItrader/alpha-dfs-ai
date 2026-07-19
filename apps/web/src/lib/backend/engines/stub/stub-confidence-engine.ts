import {
  engineSuccess,
  type ConfidenceEngine,
  type ConfidenceEngineOutput,
} from "@alpha-dfs/shared";

export function createStubConfidenceEngine(): ConfidenceEngine {
  return {
    engineId: "confidence",
    async evaluate() {
      const data: ConfidenceEngineOutput = {
        overallConfidence: 78,
        confidenceGrade: "B",
        stabilityScore: 72,
        projectionConsistency: "Stable",
        variance: "medium",
        reliability: "B",
        dataCompleteness: 92,
        injuryCoverage: "Available",
        weatherCoverage: "Available",
        marketCoverage: "Partial",
        expertConsensus: "Available",
        internalAgreement: "High",
        externalAgreement: "Moderate",
        historicalAgreement: "High",
        overallAgreement: "Strong",
        insights: [
          "High confidence recommendation",
          "Stable projection",
          "Strong evidence support",
          "Moderate variance",
          "Monitor injury updates",
        ],
        version: "pce-1.0-stub",
      };
      return engineSuccess(data);
    },
  };
}
