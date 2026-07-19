import type { EngineRegistry } from "@alpha-dfs/shared";
import { createStubConfidenceEngine } from "./stub-confidence-engine";
import { createStubPlayerAnalysisEngine } from "./stub-player-analysis-engine";
import { createStubPortfolioEngine } from "./stub-portfolio-engine";
import { createStubSimulationEngine } from "./stub-simulation-engine";
import { createStubInjuryIntelligenceEngine } from "./stub-injury-intelligence-engine";
import { createStubVegasIntelligenceEngine } from "./stub-vegas-intelligence-engine";
import { createStubWeatherIntelligenceEngine } from "./stub-weather-intelligence-engine";
import { createStubSlateIntelligenceEngine } from "./stub-slate-intelligence-engine";
import { createStubOwnershipIntelligenceEngine } from "./stub-ownership-intelligence-engine";
import { createStubProjectionCalibrationEngine } from "./stub-projection-calibration-engine";
import { createStubSlateAnalysisEngine } from "./stub-slate-analysis-engine";

/** Default stub engine registry — Task 11.2+ replaces with real packages. */
export function createStubEngineRegistry(): EngineRegistry {
  return {
    slateAnalysis: createStubSlateAnalysisEngine(),
    slateIntelligence: createStubSlateIntelligenceEngine(),
    injuryIntelligence: createStubInjuryIntelligenceEngine(),
    vegasIntelligence: createStubVegasIntelligenceEngine(),
    weatherIntelligence: createStubWeatherIntelligenceEngine(),
    ownershipIntelligence: createStubOwnershipIntelligenceEngine(),
    projectionCalibration: createStubProjectionCalibrationEngine(),
    playerAnalysis: createStubPlayerAnalysisEngine(),
    confidence: createStubConfidenceEngine(),
    portfolio: createStubPortfolioEngine(),
    simulation: createStubSimulationEngine(),
  };
}
