import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ConfidenceIndicatorsPanel } from "@/components/confidence-indicators/ConfidenceIndicatorsPanel";
import { DashboardStatusBar } from "@/components/dashboard/DashboardStatusBar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { PlayerEvidencePanel } from "@/components/player-evidence/PlayerEvidencePanel";
import { PortfolioHealthPanel } from "@/components/portfolio-health/PortfolioHealthPanel";
import { PortfolioReadinessPanel } from "@/components/portfolio-readiness/PortfolioReadinessPanel";
import { RecommendedPortfolioPanel } from "@/components/recommended-portfolio/RecommendedPortfolioPanel";
import { SimulationResultsPanel } from "@/components/simulation-results/SimulationResultsPanel";
import { SlateIntelligencePanel } from "@/components/slate-intelligence/SlateIntelligencePanel";
import { fetchAnalysisBundle } from "@/lib/backend/analysis-service";
import { setBackendDependencies } from "@/lib/backend/dependency-container";
import { createEngineRegistry } from "@/lib/backend/engines/create-engine-registry";
import { ensureTestDatabase, resetTestDatabaseFlag } from "@/test/helpers/database-setup";
import {
  completeAnalysisRun,
  resetAnalysisRun,
  startAnalysisRun,
} from "@/lib/backend/analysis-state";
import {
  mapConfidenceIndicators,
  mapDashboardData,
  mapPlayerEvidence,
  mapPortfolioHealth,
  mapPortfolioReadiness,
  mapRecommendedPortfolio,
  mapSimulationResults,
  mapSlateIntelligenceFromBundle,
} from "@/lib/mappers";

describe("integrated page panels", () => {
  beforeEach(() => {
    resetAnalysisRun();
  });

  it("renders idle provider-backed portfolio readiness", async () => {
    const bundle = await fetchAnalysisBundle();
    render(<PortfolioReadinessPanel viewModel={mapPortfolioReadiness(bundle.portfolioReadiness)} />);
    expect(screen.getByLabelText("Portfolio readiness score")).toBeInTheDocument();
  });

  it("renders idle provider-backed player evidence", async () => {
    const bundle = await fetchAnalysisBundle();
    render(<PlayerEvidencePanel viewModel={mapPlayerEvidence(bundle.playerEvidence)} />);
    expect(screen.getByLabelText("Evidence overview")).toBeInTheDocument();
  });

  it("renders idle provider-backed recommended portfolio", async () => {
    const bundle = await fetchAnalysisBundle();
    render(
      <RecommendedPortfolioPanel viewModel={mapRecommendedPortfolio(bundle.recommendedPortfolio)} />,
    );
    expect(screen.getByLabelText("Portfolio overview")).toBeInTheDocument();
  });

  it("renders idle provider-backed portfolio health", async () => {
    const bundle = await fetchAnalysisBundle();
    render(<PortfolioHealthPanel viewModel={mapPortfolioHealth(bundle.portfolioHealth)} />);
    expect(screen.getByLabelText("Portfolio health overview")).toBeInTheDocument();
  });

  it("renders idle provider-backed simulation results", async () => {
    const bundle = await fetchAnalysisBundle();
    render(<SimulationResultsPanel viewModel={mapSimulationResults(bundle.simulation)} />);
    expect(screen.getByLabelText("Simulation overview")).toBeInTheDocument();
  });

  it("renders idle provider-backed confidence indicators", async () => {
    const bundle = await fetchAnalysisBundle();
    render(<ConfidenceIndicatorsPanel viewModel={mapConfidenceIndicators(bundle.confidence)} />);
    expect(screen.getByLabelText("Confidence overview")).toBeInTheDocument();
  });

  it("renders idle provider-backed slate intelligence with placeholders", async () => {
    const bundle = await fetchAnalysisBundle();
    render(
      <SlateIntelligencePanel viewModel={mapSlateIntelligenceFromBundle(bundle)} />,
    );
    expect(screen.getByLabelText("Slate summary")).toBeInTheDocument();
    expect(screen.getByLabelText("Intelligence summary")).toBeInTheDocument();
  });

  it("renders success state after analysis completes", async () => {
    resetTestDatabaseFlag();
    await ensureTestDatabase();
    setBackendDependencies({ engines: createEngineRegistry("real") });

    startAnalysisRun();
    completeAnalysisRun();

    const bundle = await fetchAnalysisBundle();
    const dashboard = mapDashboardData(bundle);

    render(<DashboardStatusBar data={dashboard} />);
    expect(screen.getByText("Complete")).toBeInTheDocument();

    render(<RecentActivity items={dashboard.recentActivity} />);
    expect(screen.getByText("Slate analysis completed")).toBeInTheDocument();

    render(<PortfolioReadinessPanel viewModel={mapPortfolioReadiness(bundle.portfolioReadiness)} />);
    expect(
      bundle.portfolioReadiness.readinessScore.overallReadinessScore,
    ).toBeGreaterThan(0);

    render(
      <SlateIntelligencePanel viewModel={mapSlateIntelligenceFromBundle(bundle)} />,
    );
    expect(bundle.slateIntelligence?.slateGrade).toBeGreaterThan(0);
    expect(screen.getByLabelText("Slate grade")).toHaveTextContent(
      `${bundle.slateIntelligence?.slateGrade}/100`,
    );
  });

  it("renders empty player evidence when no players returned", async () => {
    const bundle = await fetchAnalysisBundle();
    bundle.playerEvidence.players = [];
    bundle.playerEvidence.overview.totalPlayers = 0;

    render(<PlayerEvidencePanel viewModel={mapPlayerEvidence(bundle.playerEvidence)} />);

    expect(screen.getByLabelText("Evidence overview")).toBeInTheDocument();
    expect(screen.queryByText("Player One")).not.toBeInTheDocument();
  });
});
