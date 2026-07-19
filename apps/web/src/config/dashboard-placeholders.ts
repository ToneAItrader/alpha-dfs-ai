export type DashboardPlaceholderData = {
  currentSlate: string;
  analysisStatus: "idle" | "analyzing" | "complete";
  portfolioReadiness: string;
  lastAnalysisAt: string;
  summaryCards: {
    id: string;
    label: string;
    value: string;
    hint: string;
  }[];
  recentActivity: {
    id: string;
    label: string;
    timestamp: string;
  }[];
};

/** Static display placeholders — no calculations. Backend replaces in Task 10.10. */
export const dashboardPlaceholderData: DashboardPlaceholderData = {
  currentSlate: "NFL Week — Main Slate (placeholder)",
  analysisStatus: "idle",
  portfolioReadiness: "—",
  lastAnalysisAt: "Not yet run",
  summaryCards: [
    { id: "readiness-grade", label: "Readiness Grade", value: "—", hint: "Portfolio Readiness" },
    { id: "confidence", label: "Confidence", value: "—", hint: "PCE" },
    { id: "portfolio-grade", label: "Portfolio Grade", value: "—", hint: "Portfolio Health" },
    { id: "simulation", label: "Simulation Status", value: "—", hint: "Simulation Engine" },
  ],
  recentActivity: [],
};
