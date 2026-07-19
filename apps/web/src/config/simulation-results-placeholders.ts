import type { SimulationResultsViewModel } from "@/types/simulation-results-view-model";

/** Placeholder view model — conforms to SimulationResultsViewModel. Task 10.10 replaces provider only. */
export const simulationResultsPlaceholder: SimulationResultsViewModel = {
  overview: {
    simulationStatus: "idle",
    simulationCount: null,
    lastRunAt: null,
    analysisStatus: "idle",
  },
  projections: {
    medianProjection: null,
    floorProjection: null,
    ceilingProjection: null,
    averageProjection: null,
  },
  probabilities: {
    winProbability: null,
    cashProbability: null,
    top1PercentFinish: null,
    top10PercentFinish: null,
  },
  fieldMetrics: {
    fieldSize: null,
    fieldPercentile: null,
    topOnePercentRate: null,
    cashRate: null,
  },
  distribution: {
    lowOutcome: null,
    expectedOutcome: null,
    highOutcome: null,
    volatilityRating: null,
  },
  insights: [
    "High ceiling portfolio (placeholder)",
    "Stable median projection (placeholder)",
    "Tournament upside available (placeholder)",
    "Moderate volatility (placeholder)",
    "Strong leverage opportunities (placeholder)",
  ],
  metadata: {
    simulationVersion: null,
    timestamp: null,
    dataFreshness: null,
    portfolioVersion: null,
  },
};
