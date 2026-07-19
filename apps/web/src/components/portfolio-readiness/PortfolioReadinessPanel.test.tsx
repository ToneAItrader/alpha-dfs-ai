import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PortfolioReadinessPanel } from "@/components/portfolio-readiness/PortfolioReadinessPanel";
import type { PortfolioReadinessViewModel } from "@/types/portfolio-readiness-view-model";

const sampleViewModel: PortfolioReadinessViewModel = {
  readinessScore: {
    overallReadinessScore: 82,
    readinessGrade: "B",
    status: "ready",
    lastAnalysisAt: "2026-07-18T14:00:00Z",
  },
  predictionConfidence: {
    confidenceScore: 78,
    predictionStability: 71,
    reliabilityGrade: "B",
    projectionVariance: "medium",
  },
  dataQuality: {
    dataCompleteness: 95,
    injuryDataStatus: "available",
    weatherDataStatus: "available",
    marketDataStatus: "partial",
    expertConsensusStatus: "available",
  },
  portfolioHealthSnapshot: {
    portfolioGrade: "B",
    risk: "Moderate",
    exposureBalance: "Balanced",
    stackDiversity: "Good",
    salaryDistribution: "Optimal",
    leverage: "Above average",
  },
  checklist: [
    { id: "1", label: "Statistical data loaded", state: "complete" },
    { id: "2", label: "Portfolio generated", state: "pending" },
  ],
  summary: {
    insights: ["Portfolio ready for review"],
  },
};

describe("PortfolioReadinessPanel", () => {
  it("renders all six required sections", () => {
    render(<PortfolioReadinessPanel viewModel={sampleViewModel} />);

    expect(screen.getByLabelText("Portfolio readiness score")).toBeInTheDocument();
    expect(screen.getByLabelText("Prediction confidence")).toBeInTheDocument();
    expect(screen.getByLabelText("Data quality")).toBeInTheDocument();
    expect(screen.getByLabelText("Portfolio health snapshot")).toBeInTheDocument();
    expect(screen.getByLabelText("Readiness checklist")).toBeInTheDocument();
    expect(screen.getByLabelText("Summary and recommendations")).toBeInTheDocument();
  });

  it("displays view model values without calculation", () => {
    render(<PortfolioReadinessPanel viewModel={sampleViewModel} />);

    expect(screen.getByText("82")).toBeInTheDocument();
    expect(screen.getByText("Portfolio ready for review")).toBeInTheDocument();
    expect(screen.getByText("Statistical data loaded")).toBeInTheDocument();
  });
});
