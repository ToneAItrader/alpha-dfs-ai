import type { EngineResult } from "./errors";
import type { AnalysisRunContext } from "./pipeline";

/** Recommended slate-wide strategy from Slate Intelligence Agent. */
export type RecommendedStrategy =
  | "balanced"
  | "primary_heavy"
  | "gpp_heavy"
  | "contrarian"
  | "stack_aggressive";

/** Domain output — Slate Intelligence Agent (strategy intelligence). */
export type SlateIntelligenceOutput = {
  slateGrade: number;
  volatilityScore: number;
  recommendedStrategy: RecommendedStrategy;
  confidenceRating: number;
  slateRisk: "low" | "moderate" | "high";
  contestRecommendation: string;
  factors: string[];
  slateSummary: string;
  slateName: string;
  week: number;
  gameCount: number;
  teamCount: number;
  totalPlayers: number;
};

/** Domain output — Injury Intelligence Agent. */
export type InjuryIntelligenceOutput = {
  majorInjuries: number;
  questionablePlayers: number;
  doubtfulPlayers: number;
  outPlayers: number;
  backupOpportunities: number;
  rookieOpportunities: number;
  lineupImpactSummary: string;
  assessment: string;
  factors: string[];
  injuryCoverage: number;
};

/** Domain output — Vegas Intelligence Agent. */
export type VegasIntelligenceOutput = {
  featuredGames: Array<{
    id: string;
    matchup: string;
    spread: number | null;
    total: number | null;
    impliedHomeTotal: number | null;
    impliedAwayTotal: number | null;
    lineMovement: number | null;
    expectedPace: "fast" | "moderate" | "slow";
    spreadLabel: string;
    paceLabel: string;
  }>;
  averageTotal: number | null;
  highTotalGames: number;
  lineMovementGames: number;
  marketCoverage: number;
  scoringEnvironment: "high" | "moderate" | "low";
  assessment: string;
  factors: string[];
};

/** Domain output — Weather Intelligence Agent. */
export type WeatherIntelligenceOutput = {
  windGames: number;
  rainGames: number;
  snowGames: number;
  outdoorGames: number;
  domeGames: number;
  maxWindMph: number | null;
  averageTemperature: number | null;
  highImpactGames: number;
  weatherCoverage: number;
  severity: "low" | "moderate" | "high";
  assessment: string;
  factors: string[];
  gameImpacts: Array<{
    id: string;
    matchup: string;
    impact: "low" | "moderate" | "high";
    summary: string;
  }>;
};

/** Domain output — Ownership Intelligence Agent. */
export type OwnershipIntelligenceOutput = {
  players: Array<{
    slatePlayerId: string;
    name: string;
    predictedOwnership: number;
    ownershipSource: "feed" | "predicted" | "blended";
  }>;
  averagePredictedOwnership: number;
  chalkPlayerCount: number;
  contrarianPlayerCount: number;
  leverageOpportunities: number;
  ownershipConcentration: number;
  assessment: string;
  factors: string[];
  version: string;
};

/** Domain output — Projection Calibration Agent (pre-score). */
export type ProjectionCalibrationOutput = {
  enabled: boolean;
  playersCalibrated: number;
  averageCalibrationFactor: number;
  averageCalibratedProjection: number;
  calibrationNotes: string[];
  players: Array<{
    slatePlayerId: string;
    rawProjection: number;
    calibratedProjection: number;
    calibrationFactor: number;
    calibratedFloor: number;
    calibratedCeiling: number;
    calibrationNotes: string[];
  }>;
  version: string;
};

/** Domain output — Slate Analysis Engine (readiness inputs). */
export type SlateAnalysisOutput = {
  slateLabel: string;
  dataCompleteness: number;
  injuryDataStatus: "available" | "partial" | "unavailable" | "pending";
  weatherDataStatus: "available" | "partial" | "unavailable" | "pending";
  marketDataStatus: "available" | "partial" | "unavailable" | "pending";
  expertConsensusStatus: "available" | "partial" | "unavailable" | "pending";
  checklistComplete: boolean;
};

/** Domain output — Player Analysis / Evidence Engine. */
export type PlayerAnalysisOutput = {
  totalPlayers: number;
  highConfidencePlayers: number;
  moderateConfidencePlayers: number;
  lowConfidencePlayers: number;
  players: PlayerEvidenceRecord[];
  evidenceSourceStatuses: Record<string, "available" | "partial" | "pending">;
};

export type PlayerEvidenceRecord = {
  slatePlayerId: string;
  name: string;
  position: string;
  team: string;
  opponent: string;
  salary: number;
  projection: number;
  confidenceScore: number;
  confidenceTier: "high" | "moderate" | "low";
  risk: string;
  injuryStatus: "healthy" | "questionable" | "doubtful" | "out" | "unknown";
  practiceStatus?: string;
  gameStatus?: string;
  matchupSummary: string;
  ownershipEstimate: number;
  supportingRationale: string;
  evidenceSources: string[];
};

/** Domain output — Confidence Engine (PCE). */
export type ConfidenceEngineOutput = {
  overallConfidence: number;
  confidenceGrade: "A" | "B" | "C" | "D" | "F";
  stabilityScore: number;
  projectionConsistency: string;
  variance: "low" | "medium" | "high";
  reliability: "A" | "B" | "C" | "D" | "F";
  dataCompleteness: number;
  injuryCoverage: string;
  weatherCoverage: string;
  marketCoverage: string;
  expertConsensus: string;
  internalAgreement: string;
  externalAgreement: string;
  historicalAgreement: string;
  overallAgreement: string;
  insights: string[];
  version: string;
};

/** Domain output — Portfolio Engine (PIE). */
export type PortfolioEngineOutput = {
  healthScore: number;
  portfolioGrade: "A" | "B" | "C" | "D" | "F";
  exposure: Record<string, string>;
  exposureSummary?: {
    playerExposures: Array<{ playerId: string; name: string; exposurePct: number }>;
    teamExposures: Array<{ team: string; exposurePct: number }>;
    stackExposures: Array<{ gameId: string; exposurePct: number }>;
    salaryFlexibilityPct: number;
    warnings: string[];
  };
  diversity: {
    numberOfStacks: number;
    teamDiversity: string;
    opponentDiversity: string;
    correlationScore: string;
  };
  ownership: {
    averageOwnership: number;
    chalkExposure: string;
    contrarianExposure: string;
    leverageBalance: string;
  };
  salary: {
    averageSalaryUsed: number;
    remainingSalary: number;
    salaryEfficiency: string;
    salaryBalance: string;
  };
  risk: {
    overallRisk: string;
    floor: number;
    ceiling: number;
    variance: string;
  };
  recommendations: string[];
  primaryLineups: PortfolioLineupRecord[];
  hailMaryLineups: PortfolioLineupRecord[];
  version: string;
};

export type PortfolioLineupRecord = {
  lineupId: string;
  portfolioType: "primary" | "hail_mary";
  rank: number;
  projectedFantasyPoints: number | null;
  confidenceScore: number | null;
  confidenceTier: "high" | "moderate" | "low" | null;
  riskScore: string | null;
  ownershipEstimate: number | null;
  correlationScore: string | null;
  salaryUsed: number | null;
  leverageScore: number | null;
  ceilingRating: number | null;
  contrarianRating: string | null;
  optimizerRationale: string;
};

/** Domain output — Simulation Engine. */
export type SimulationEngineOutput = {
  simulationCount: number;
  medianProjection: number;
  floorProjection: number;
  ceilingProjection: number;
  averageProjection: number;
  winProbability: string;
  cashProbability: string;
  top1PercentFinish: string;
  top10PercentFinish: string;
  volatilityRating: string;
  fieldSize: number;
  fieldPercentile: number;
  topOnePercentRate: number;
  cashRate: number;
  insights: string[];
  version: string;
};

/** Engine port interfaces — frontend-independent. */
export interface SlateAnalysisEngine {
  readonly engineId: "slate_analysis";
  analyze(context: AnalysisRunContext): Promise<EngineResult<SlateAnalysisOutput>>;
}

export interface SlateIntelligenceEngine {
  readonly engineId: "slate_intelligence";
  analyze(context: AnalysisRunContext): Promise<EngineResult<SlateIntelligenceOutput>>;
}

export interface InjuryIntelligenceEngine {
  readonly engineId: "injury_intelligence";
  analyze(context: AnalysisRunContext): Promise<EngineResult<InjuryIntelligenceOutput>>;
}

export interface VegasIntelligenceEngine {
  readonly engineId: "vegas_intelligence";
  analyze(context: AnalysisRunContext): Promise<EngineResult<VegasIntelligenceOutput>>;
}

export interface WeatherIntelligenceEngine {
  readonly engineId: "weather_intelligence";
  analyze(context: AnalysisRunContext): Promise<EngineResult<WeatherIntelligenceOutput>>;
}

export interface OwnershipIntelligenceEngine {
  readonly engineId: "ownership_intelligence";
  analyze(context: AnalysisRunContext): Promise<EngineResult<OwnershipIntelligenceOutput>>;
}

export interface ProjectionCalibrationEngine {
  readonly engineId: "projection_calibration";
  calibrate(context: AnalysisRunContext): Promise<EngineResult<ProjectionCalibrationOutput>>;
}

export interface PlayerAnalysisEngine {
  readonly engineId: "player_analysis";
  analyze(context: AnalysisRunContext): Promise<EngineResult<PlayerAnalysisOutput>>;
}

export interface ConfidenceEngine {
  readonly engineId: "confidence";
  evaluate(context: AnalysisRunContext): Promise<EngineResult<ConfidenceEngineOutput>>;
}

export interface PortfolioEngine {
  readonly engineId: "portfolio";
  build(context: AnalysisRunContext): Promise<EngineResult<PortfolioEngineOutput>>;
}

export interface SimulationEngine {
  readonly engineId: "simulation";
  simulate(context: AnalysisRunContext): Promise<EngineResult<SimulationEngineOutput>>;
}

/** Aggregated engine outputs from a successful pipeline run. */
export type EngineOutputs = {
  slate: SlateAnalysisOutput;
  slateIntelligence?: SlateIntelligenceOutput;
  injuryIntelligence?: InjuryIntelligenceOutput;
  vegasIntelligence?: VegasIntelligenceOutput;
  weatherIntelligence?: WeatherIntelligenceOutput;
  ownershipIntelligence?: OwnershipIntelligenceOutput;
  projectionCalibration?: ProjectionCalibrationOutput;
  playerAnalysis: PlayerAnalysisOutput;
  confidence: ConfidenceEngineOutput;
  portfolio: PortfolioEngineOutput;
  simulation: SimulationEngineOutput;
  /** Read-only fused evidence — written by ADI platform; populated in M6+. */
  adiEvidence?: import("./adi-evidence").AdiNormalizedEvidenceBundle;
};

export type EngineRegistry = {
  slateAnalysis: SlateAnalysisEngine;
  slateIntelligence: SlateIntelligenceEngine;
  injuryIntelligence: InjuryIntelligenceEngine;
  vegasIntelligence: VegasIntelligenceEngine;
  weatherIntelligence: WeatherIntelligenceEngine;
  ownershipIntelligence: OwnershipIntelligenceEngine;
  projectionCalibration: ProjectionCalibrationEngine;
  playerAnalysis: PlayerAnalysisEngine;
  confidence: ConfidenceEngine;
  portfolio: PortfolioEngine;
  simulation: SimulationEngine;
};
