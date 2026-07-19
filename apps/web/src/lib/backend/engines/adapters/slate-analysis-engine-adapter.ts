import {
  engineFailure,
  engineSuccess,
  type SlateAnalysisEngine,
} from "@alpha-dfs/shared";
import { getSlateDataService } from "@/lib/backend/data/slate-data-service";

function statusFromCoverage(ratio: number): "available" | "partial" | "unavailable" | "pending" {
  if (ratio >= 0.9) return "available";
  if (ratio >= 0.5) return "partial";
  if (ratio > 0) return "unavailable";
  return "pending";
}

/** Real Slate Analysis Engine — analyzes ingested slate data coverage. */
export function createSlateAnalysisEngineAdapter(): SlateAnalysisEngine {
  return {
    engineId: "slate_analysis",
    async analyze(context) {
      try {
        const { slateRepository } = getSlateDataService();
        const slateId = context.slateId;
        if (!slateId) {
          return engineFailure(
            "MISSING_SLATE",
            "Slate ID required for slate analysis",
            "slate_analysis",
          );
        }

        const slate = await slateRepository.getSlateById(slateId);
        if (!slate) {
          return engineFailure("SLATE_NOT_FOUND", "Slate not found", "slate_analysis");
        }

        const coverage = await slateRepository.getSlateCoverage(slateId);
        const total = coverage.totalPlayers;

        return engineSuccess({
          slateLabel: slate.name,
          dataCompleteness: coverage.dataCompleteness,
          injuryDataStatus: statusFromCoverage(coverage.withInjury / Math.max(total, 1)),
          weatherDataStatus: statusFromCoverage(coverage.withWeather / Math.max(total, 1)),
          marketDataStatus: statusFromCoverage(coverage.withMarket / Math.max(total, 1)),
          expertConsensusStatus: statusFromCoverage(coverage.withExpert / Math.max(total, 1)),
          checklistComplete: coverage.dataCompleteness >= 70 && total >= 10,
        });
      } catch (error) {
        return engineFailure(
          "SLATE_ANALYSIS_FAILED",
          error instanceof Error ? error.message : "Slate analysis failed",
          "slate_analysis",
        );
      }
    },
  };
}
