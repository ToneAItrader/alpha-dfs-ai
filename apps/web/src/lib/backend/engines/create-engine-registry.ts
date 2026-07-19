import type { EngineRegistry } from "@alpha-dfs/shared";
import { createPredictionConfidenceEngineAdapter } from "./adapters/confidence-engine-adapter";
import { createEvidencePlayerAnalysisEngine } from "./adapters/evidence-engine-adapter";
import { createPortfolioEngineAdapter } from "./adapters/portfolio-engine-adapter";
import { createSimulationEngineAdapter } from "./adapters/simulation-engine-adapter";
import { createInjuryIntelligenceEngineAdapter } from "./adapters/injury-intelligence-engine-adapter";
import { createVegasIntelligenceEngineAdapter } from "./adapters/vegas-intelligence-engine-adapter";
import { createWeatherIntelligenceEngineAdapter } from "./adapters/weather-intelligence-engine-adapter";
import { createSlateIntelligenceEngineAdapter } from "./adapters/slate-intelligence-engine-adapter";
import { createOwnershipIntelligenceEngineAdapter } from "./adapters/ownership-intelligence-engine-adapter";
import { createProjectionCalibrationEngineAdapter } from "./adapters/projection-calibration-engine-adapter";
import { createSlateAnalysisEngineAdapter } from "./adapters/slate-analysis-engine-adapter";
import { createStubEngineRegistry } from "./stub/create-stub-engine-registry";

export type EngineRegistryMode = "real" | "stub";

/**
 * Production engine registry — all engines real except when stub mode enabled.
 * Slate + Portfolio use database-backed implementations (Task 11.3).
 */
export function createEngineRegistry(mode: EngineRegistryMode = "real"): EngineRegistry {
  if (mode === "stub") {
    return createStubEngineRegistry();
  }

  return {
    slateAnalysis: createSlateAnalysisEngineAdapter(),
    slateIntelligence: createSlateIntelligenceEngineAdapter(),
    injuryIntelligence: createInjuryIntelligenceEngineAdapter(),
    vegasIntelligence: createVegasIntelligenceEngineAdapter(),
    weatherIntelligence: createWeatherIntelligenceEngineAdapter(),
    ownershipIntelligence: createOwnershipIntelligenceEngineAdapter(),
    projectionCalibration: createProjectionCalibrationEngineAdapter(),
    playerAnalysis: createEvidencePlayerAnalysisEngine(),
    confidence: createPredictionConfidenceEngineAdapter(),
    portfolio: createPortfolioEngineAdapter(),
    simulation: createSimulationEngineAdapter(),
  };
}
