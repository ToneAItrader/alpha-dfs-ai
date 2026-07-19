import type { ConfidenceIndicatorsViewModel } from "@/types/confidence-indicators-view-model";

/** Placeholder view model — conforms to ConfidenceIndicatorsViewModel. Task 10.10 replaces provider only. */
export const confidenceIndicatorsPlaceholder: ConfidenceIndicatorsViewModel = {
  overview: {
    overallConfidence: null,
    confidenceGrade: null,
    currentStatus: "idle",
    lastAnalysisAt: null,
  },
  stability: {
    stabilityScore: null,
    projectionConsistency: null,
    variance: null,
    reliability: null,
  },
  quality: {
    dataCompleteness: null,
    injuryCoverage: null,
    weatherCoverage: null,
    marketCoverage: null,
    expertConsensus: null,
  },
  agreement: {
    internalAgreement: null,
    externalAgreement: null,
    historicalAgreement: null,
    overallAgreement: null,
  },
  insights: [
    "High confidence recommendation (placeholder)",
    "Stable projection (placeholder)",
    "Strong evidence support (placeholder)",
    "Moderate variance (placeholder)",
    "Monitor injury updates (placeholder)",
  ],
  calibration: {
    enabled: false,
    calibratedProjection: null,
    calibrationFactor: null,
    notes: [],
  },
  metadata: {
    confidenceVersion: null,
    timestamp: null,
    dataFreshness: null,
    analysisVersion: null,
  },
};
