/**
 * Frontend contract for Simulation Results page.
 * Portfolio Simulation Engine will populate this in Task 10.10 — UI consumes only this shape.
 */

export type SimulationStatus = "idle" | "running" | "complete" | "failed";

export type SimulationAnalysisStatus = "idle" | "analyzing" | "ready" | "incomplete";

export type SimulationResultsViewModel = {
  overview: {
    simulationStatus: SimulationStatus;
    simulationCount: number | null;
    lastRunAt: string | null;
    analysisStatus: SimulationAnalysisStatus;
  };
  projections: {
    medianProjection: number | null;
    floorProjection: number | null;
    ceilingProjection: number | null;
    averageProjection: number | null;
  };
  probabilities: {
    winProbability: string | null;
    cashProbability: string | null;
    top1PercentFinish: string | null;
    top10PercentFinish: string | null;
  };
  fieldMetrics: {
    fieldSize: number | null;
    fieldPercentile: number | null;
    topOnePercentRate: number | null;
    cashRate: number | null;
  };
  distribution: {
    lowOutcome: number | null;
    expectedOutcome: number | null;
    highOutcome: number | null;
    volatilityRating: string | null;
  };
  insights: string[];
  metadata: {
    simulationVersion: string | null;
    timestamp: string | null;
    dataFreshness: string | null;
    portfolioVersion: string | null;
  };
};
