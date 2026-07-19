import type { AnalysisBundleResponseDto } from "@/types/dto/analysis-responses.dto";
import type { DashboardPlaceholderData } from "@/config/dashboard-placeholders";
import {
  formatOptionalGrade,
  formatOptionalNumber,
  formatSimulationStatus,
} from "@/lib/format-display";
import { mapPipelineStatusForDisplay } from "@/lib/mappers/pipeline-status-mapper";

/** Maps analysis bundle backend DTO → dashboard display data. */
export function mapDashboardData(bundle: AnalysisBundleResponseDto): DashboardPlaceholderData {
  const pipelineStatus = mapPipelineStatusForDisplay(bundle.pipeline.status);

  return {
    currentSlate: bundle.pipeline.currentSlate,
    analysisStatus: pipelineStatus,
    portfolioReadiness: bundle.pipeline.portfolioReadiness,
    lastAnalysisAt: bundle.pipeline.lastAnalysisAt,
    summaryCards: [
      {
        id: "slate-grade",
        label: "Readiness Grade",
        value: formatOptionalGrade(bundle.portfolioReadiness.readinessScore.readinessGrade),
        hint: "Portfolio Readiness",
      },
      {
        id: "confidence",
        label: "Confidence",
        value: formatOptionalNumber(bundle.confidence.overallConfidence),
        hint: "PCE",
      },
      {
        id: "portfolio-grade",
        label: "Portfolio Grade",
        value: formatOptionalGrade(bundle.portfolioHealth.overview.portfolioGrade),
        hint: "Portfolio Health",
      },
      {
        id: "simulation",
        label: "Simulation Status",
        value: formatSimulationStatus(bundle.simulation.overview.simulationStatus),
        hint: "Simulation Engine",
      },
    ],
    recentActivity:
      bundle.pipeline.status === "complete"
        ? [
            {
              id: "analysis-complete",
              label: "Slate analysis completed",
              timestamp: bundle.pipeline.lastAnalysisAt,
            },
          ]
        : [],
  };
}
