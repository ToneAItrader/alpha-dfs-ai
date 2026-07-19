/**
 * Frontend contract for Portfolio Health Dashboard page.
 * PIE will populate this in Task 10.10 — UI consumes only this shape.
 */

export type PortfolioHealthStatus = "idle" | "healthy" | "review" | "warning";

export type PortfolioHealthViewModel = {
  overview: {
    overallHealthScore: number | null;
    portfolioGrade: string | null;
    overallStatus: PortfolioHealthStatus;
    lastAnalysisAt: string | null;
  };
  exposure: {
    qbExposure: string | null;
    rbExposure: string | null;
    wrExposure: string | null;
    teExposure: string | null;
    dstExposure: string | null;
  };
  diversity: {
    numberOfStacks: number | null;
    teamDiversity: string | null;
    opponentDiversity: string | null;
    correlationScore: string | null;
  };
  ownership: {
    averageOwnership: number | null;
    chalkExposure: string | null;
    contrarianExposure: string | null;
    leverageBalance: string | null;
  };
  salary: {
    averageSalaryUsed: number | null;
    remainingSalary: number | null;
    salaryEfficiency: string | null;
    salaryBalance: string | null;
  };
  risk: {
    overallRisk: string | null;
    floor: number | null;
    ceiling: number | null;
    variance: string | null;
  };
  exposureSummary: {
    playerExposures: Array<{ playerId: string; name: string; exposurePct: number }>;
    teamExposures: Array<{ team: string; exposurePct: number }>;
    stackExposures: Array<{ gameId: string; exposurePct: number }>;
    salaryFlexibilityPct: number | null;
    warnings: string[];
  };
  recommendations: string[];
  metadata: {
    analysisVersion: string | null;
    timestamp: string | null;
    dataFreshness: string | null;
    portfolioVersion: string | null;
  };
};
