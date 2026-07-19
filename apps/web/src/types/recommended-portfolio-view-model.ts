/**
 * Frontend contract for Recommended Portfolio page.
 * PIE will populate this in Task 10.10 — UI consumes only this shape.
 */

export type PortfolioStatus = "idle" | "generating" | "complete" | "failed";

export type PrimaryLineupViewModel = {
  lineupId: string;
  portfolioType: "primary";
  rank: number;
  projectedPoints: number | null;
  confidence: number | null;
  risk: string | null;
  salaryUsed: number | null;
  ownership: number | null;
  correlation: string | null;
  leverage: number | null;
  explainabilitySummary: string;
};

export type HailMaryLineupViewModel = {
  lineupId: string;
  portfolioType: "hail_mary";
  rank: number;
  ceiling: number | null;
  leverage: number | null;
  ownership: number | null;
  risk: string | null;
  contrarianRating: string | null;
  explainabilitySummary: string;
};

export type RecommendedPortfolioViewModel = {
  portfolioOverview: {
    totalPortfolios: number;
    primaryCount: number;
    hailMaryCount: number;
    generationTimestamp: string | null;
    portfolioStatus: PortfolioStatus;
  };
  primaryPortfolios: PrimaryLineupViewModel[];
  hailMaryPortfolios: HailMaryLineupViewModel[];
  portfolioSummary: {
    portfolioGrade: string | null;
    overallConfidence: number | null;
    averageProjection: number | null;
    averageOwnership: number | null;
    averageSalary: number | null;
    averageRisk: string | null;
  };
  explainabilitySummary: string[];
  generationMetadata: {
    analysisVersion: string | null;
    generationTime: string | null;
    simulationStatus: string | null;
    dataFreshness: string | null;
  };
  recommendations: string[];
};
