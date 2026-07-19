/**
 * Frontend contract for Portfolio Readiness page.
 * Backend (PCE + PIE) will populate this in Task 10.10 — UI components consume only this shape.
 */

import type {
  ConfidenceStatus,
  ReliabilityGrade,
  VarianceRating,
} from "@/types/shared/confidence";

export type ReadinessStatus = ConfidenceStatus;

export type { ReliabilityGrade, VarianceRating };

export type DataSourceStatus = "available" | "partial" | "unavailable" | "pending";

export type ChecklistItemState = "complete" | "pending" | "unavailable";

export type PortfolioReadinessViewModel = {
  readinessScore: {
    overallReadinessScore: number | null;
    readinessGrade: ReliabilityGrade | null;
    status: ReadinessStatus;
    lastAnalysisAt: string | null;
  };
  predictionConfidence: {
    confidenceScore: number | null;
    predictionStability: number | null;
    reliabilityGrade: ReliabilityGrade | null;
    projectionVariance: VarianceRating | null;
  };
  dataQuality: {
    dataCompleteness: number | null;
    injuryDataStatus: DataSourceStatus;
    weatherDataStatus: DataSourceStatus;
    marketDataStatus: DataSourceStatus;
    expertConsensusStatus: DataSourceStatus;
  };
  portfolioHealthSnapshot: {
    portfolioGrade: ReliabilityGrade | null;
    risk: string | null;
    exposureBalance: string | null;
    stackDiversity: string | null;
    salaryDistribution: string | null;
    leverage: string | null;
    exposureWarnings: string[];
  };
  checklist: {
    id: string;
    label: string;
    state: ChecklistItemState;
  }[];
  summary: {
    insights: string[];
  };
};
