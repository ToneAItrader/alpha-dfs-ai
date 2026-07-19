import type { PortfolioReadinessViewModel } from "@/types/portfolio-readiness-view-model";

/** Placeholder view model — conforms to PortfolioReadinessViewModel. Task 10.10 replaces provider only. */
export const portfolioReadinessPlaceholder: PortfolioReadinessViewModel = {
  readinessScore: {
    overallReadinessScore: null,
    readinessGrade: null,
    status: "idle",
    lastAnalysisAt: null,
  },
  predictionConfidence: {
    confidenceScore: null,
    predictionStability: null,
    reliabilityGrade: null,
    projectionVariance: null,
  },
  dataQuality: {
    dataCompleteness: null,
    injuryDataStatus: "pending",
    weatherDataStatus: "pending",
    marketDataStatus: "pending",
    expertConsensusStatus: "pending",
  },
  portfolioHealthSnapshot: {
    portfolioGrade: null,
    risk: null,
    exposureBalance: null,
    stackDiversity: null,
    salaryDistribution: null,
    leverage: null,
    exposureWarnings: [],
  },
  checklist: [
    { id: "statistical-data", label: "Statistical data loaded", state: "pending" },
    { id: "slate-analyzed", label: "Slate analyzed", state: "pending" },
    { id: "injuries-reviewed", label: "Injuries reviewed", state: "pending" },
    { id: "weather-available", label: "Weather available", state: "pending" },
    { id: "simulations-completed", label: "Simulations completed", state: "pending" },
    { id: "portfolio-generated", label: "Portfolio generated", state: "pending" },
  ],
  summary: {
    insights: [
      "Portfolio ready for review (placeholder)",
      "Confidence is high (placeholder)",
      "Simulation completed successfully (placeholder)",
      "Review injury updates before lock (placeholder)",
    ],
  },
};
