import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecommendedPortfolioPanel } from "@/components/recommended-portfolio/RecommendedPortfolioPanel";
import type { RecommendedPortfolioViewModel } from "@/types/recommended-portfolio-view-model";

describe("RecommendedPortfolioPanel", () => {
  it("renders all six required sections with placeholder data", () => {
    render(<RecommendedPortfolioPanel />);

    expect(screen.getByLabelText("Portfolio overview")).toBeInTheDocument();
    expect(screen.getByLabelText("Primary portfolio")).toBeInTheDocument();
    expect(screen.getByLabelText("Hail Mary portfolio")).toBeInTheDocument();
    expect(screen.getByLabelText("Portfolio summary")).toBeInTheDocument();
    expect(screen.getByLabelText("Explainability summary")).toBeInTheDocument();
    expect(screen.getByLabelText("Generation metadata")).toBeInTheDocument();
  });

  it("renders primary and hail mary lineup counts from view model", () => {
    const vm: RecommendedPortfolioViewModel = {
      portfolioOverview: {
        totalPortfolios: 3,
        primaryCount: 2,
        hailMaryCount: 1,
        generationTimestamp: "2026-07-18T12:00:00Z",
        portfolioStatus: "complete",
      },
      primaryPortfolios: [
        {
          lineupId: "p1",
          portfolioType: "primary",
          rank: 1,
          projectedPoints: 140,
          confidence: 80,
          risk: null,
          salaryUsed: 50000,
          ownership: null,
          correlation: null,
          leverage: null,
          explainabilitySummary: "Test primary",
        },
      ],
      hailMaryPortfolios: [
        {
          lineupId: "h1",
          portfolioType: "hail_mary",
          rank: 1,
          ceiling: 180,
          leverage: 2.5,
          ownership: null,
          risk: null,
          contrarianRating: "High",
          explainabilitySummary: "Test hail mary",
        },
      ],
      portfolioSummary: {
        portfolioGrade: "B",
        overallConfidence: 78,
        averageProjection: 140,
        averageOwnership: 15,
        averageSalary: 49500,
        averageRisk: "Moderate",
      },
      explainabilitySummary: ["Insight one"],
      generationMetadata: {
        analysisVersion: "1.0.0",
        generationTime: "2026-07-18T12:00:00Z",
        simulationStatus: "Complete",
        dataFreshness: "Current",
      },
      recommendations: ["Review lineups"],
    };

    render(<RecommendedPortfolioPanel viewModel={vm} />);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Test primary")).toBeInTheDocument();
    expect(screen.getByText("Test hail mary")).toBeInTheDocument();
    expect(screen.getByText("Insight one")).toBeInTheDocument();
  });
});
