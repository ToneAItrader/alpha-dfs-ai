import type { PortfolioHealthViewModel } from "@/types/portfolio-health-view-model";

/** Placeholder view model — conforms to PortfolioHealthViewModel. Task 10.10 replaces provider only. */
export const portfolioHealthPlaceholder: PortfolioHealthViewModel = {
  overview: {
    overallHealthScore: null,
    portfolioGrade: null,
    overallStatus: "idle",
    lastAnalysisAt: null,
  },
  exposure: {
    qbExposure: null,
    rbExposure: null,
    wrExposure: null,
    teExposure: null,
    dstExposure: null,
  },
  diversity: {
    numberOfStacks: null,
    teamDiversity: null,
    opponentDiversity: null,
    correlationScore: null,
  },
  ownership: {
    averageOwnership: null,
    chalkExposure: null,
    contrarianExposure: null,
    leverageBalance: null,
  },
  salary: {
    averageSalaryUsed: null,
    remainingSalary: null,
    salaryEfficiency: null,
    salaryBalance: null,
  },
  risk: {
    overallRisk: null,
    floor: null,
    ceiling: null,
    variance: null,
  },
  exposureSummary: {
    playerExposures: [],
    teamExposures: [],
    stackExposures: [],
    salaryFlexibilityPct: null,
    warnings: [],
  },
  recommendations: [
    "Exposure is balanced (placeholder)",
    "Ownership profile acceptable (placeholder)",
    "Increase tournament leverage (placeholder)",
    "Salary allocation healthy (placeholder)",
    "Stack diversity sufficient (placeholder)",
  ],
  metadata: {
    analysisVersion: null,
    timestamp: null,
    dataFreshness: null,
    portfolioVersion: null,
  },
};
