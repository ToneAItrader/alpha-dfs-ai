import type {
  AnalysisMetadataDto,
  AnalysisRunStatus,
  ConfidenceStatus,
  ReliabilityGrade,
  VarianceRating,
} from "@/types/shared/confidence";

/** Backend DTO — Prediction Confidence Engine aggregate response. */
export type PredictionConfidenceResponseDto = {
  status: ConfidenceStatus;
  overallConfidence: number | null;
  confidenceGrade: ReliabilityGrade | null;
  stabilityScore: number | null;
  projectionConsistency: string | null;
  variance: VarianceRating | null;
  reliability: ReliabilityGrade | null;
  dataCompleteness: number | null;
  injuryCoverage: string | null;
  weatherCoverage: string | null;
  marketCoverage: string | null;
  expertConsensus: string | null;
  internalAgreement: string | null;
  externalAgreement: string | null;
  historicalAgreement: string | null;
  overallAgreement: string | null;
  insights: string[];
  calibratedProjection?: number | null;
  calibrationFactor?: number | null;
  calibrationNotes?: string[];
  metadata: AnalysisMetadataDto & {
    confidenceVersion: string | null;
  };
  lastAnalysisAt: string | null;
};

/** Backend DTO — single player evidence report from Evidence Engine. */
export type PlayerEvidenceReportDto = {
  slatePlayerId: string;
  name: string;
  position: string;
  team: string;
  opponent: string;
  salary: number | null;
  projection: number | null;
  confidenceScore: number | null;
  confidenceTier: "high" | "moderate" | "low" | null;
  risk: string | null;
  injuryStatus: "healthy" | "questionable" | "doubtful" | "out" | "unknown" | null;
  practiceStatus?: string | null;
  gameStatus?: string | null;
  matchupSummary: string | null;
  ownershipEstimate: number | null;
  predictedOwnership?: number | null;
  ownershipSource?: "feed" | "predicted" | "blended" | null;
  supportingRationale: string;
  evidenceSources: string[];
};

/** Backend DTO — Evidence Engine page response. */
export type PlayerEvidenceResponseDto = {
  overview: {
    totalPlayers: number;
    highConfidencePlayers: number;
    moderateConfidencePlayers: number;
    lowConfidencePlayers: number;
    lastAnalysisAt: string | null;
  };
  filters: {
    positions: string[];
    teams: string[];
    confidenceTiers: ("high" | "moderate" | "low")[];
  };
  players: PlayerEvidenceReportDto[];
  evidenceSourceCategories: {
    id: string;
    label: string;
    status: "available" | "partial" | "pending";
  }[];
  confidence: {
    overallConfidence: number | null;
    projectionStability: number | null;
    variance: VarianceRating | null;
    reliabilityGrade: ReliabilityGrade | null;
  };
  explainabilitySummary: string[];
  metadata: AnalysisMetadataDto & {
    evidenceVersion: string | null;
  };
};

/** Backend DTO — PIE portfolio health response. */
export type PortfolioHealthResponseDto = {
  overview: {
    overallHealthScore: number | null;
    portfolioGrade: ReliabilityGrade | null;
    overallStatus: "idle" | "healthy" | "review" | "warning";
    lastAnalysisAt: string | null;
  };
  exposure: {
    qbExposure: string | null;
    rbExposure: string | null;
    wrExposure: string | null;
    teExposure: string | null;
    dstExposure: string | null;
  };
  diversity: {
    numberOfStacks: number | null;
    teamDiversity: string | null;
    opponentDiversity: string | null;
    correlationScore: string | null;
  };
  ownership: {
    averageOwnership: number | null;
    chalkExposure: string | null;
    contrarianExposure: string | null;
    leverageBalance: string | null;
  };
  salary: {
    averageSalaryUsed: number | null;
    remainingSalary: number | null;
    salaryEfficiency: string | null;
    salaryBalance: string | null;
  };
  risk: {
    overallRisk: string | null;
    floor: number | null;
    ceiling: number | null;
    variance: string | null;
  };
  exposureSummary?: {
    playerExposures: Array<{ playerId: string; name: string; exposurePct: number }>;
    teamExposures: Array<{ team: string; exposurePct: number }>;
    stackExposures: Array<{ gameId: string; exposurePct: number }>;
    salaryFlexibilityPct: number | null;
    warnings: string[];
  };
  recommendations: string[];
  metadata: AnalysisMetadataDto & {
    portfolioVersion: string | null;
  };
};

/** Backend DTO — Portfolio Simulation Engine response. */
export type SimulationResultsResponseDto = {
  overview: {
    simulationStatus: "idle" | "running" | "complete" | "failed";
    simulationCount: number | null;
    lastRunAt: string | null;
    analysisStatus: ConfidenceStatus;
  };
  projections: {
    medianProjection: number | null;
    floorProjection: number | null;
    ceilingProjection: number | null;
    averageProjection: number | null;
  };
  probabilities: {
    winProbability: string | null;
    cashProbability: string | null;
    top1PercentFinish: string | null;
    top10PercentFinish: string | null;
  };
  fieldMetrics?: {
    fieldSize: number | null;
    fieldPercentile: number | null;
    topOnePercentRate: number | null;
    cashRate: number | null;
  };
  distribution: {
    lowOutcome: number | null;
    expectedOutcome: number | null;
    highOutcome: number | null;
    volatilityRating: string | null;
  };
  insights: string[];
  metadata: AnalysisMetadataDto & {
    simulationVersion: string | null;
    portfolioVersion: string | null;
  };
};

/** Backend DTO — PIE lineup explainability record. */
export type LineupExplainabilityDto = {
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

/** Backend DTO — PIE recommended portfolio response. */
export type RecommendedPortfolioResponseDto = {
  portfolioOverview: {
    totalPortfolios: number;
    primaryCount: number;
    hailMaryCount: number;
    generationTimestamp: string | null;
    portfolioStatus: "idle" | "generating" | "complete" | "failed";
  };
  primaryLineups: LineupExplainabilityDto[];
  hailMaryLineups: LineupExplainabilityDto[];
  portfolioSummary: {
    portfolioGrade: ReliabilityGrade | null;
    overallConfidence: number | null;
    averageProjection: number | null;
    averageOwnership: number | null;
    averageSalary: number | null;
    averageRisk: string | null;
  };
  explainabilitySummary: string[];
  generationMetadata: AnalysisMetadataDto & {
    generationTime: string | null;
    simulationStatus: string | null;
  };
  recommendations: string[];
};

/** Backend DTO — composite portfolio readiness response. */
export type PortfolioReadinessResponseDto = {
  readinessScore: {
    overallReadinessScore: number | null;
    readinessGrade: ReliabilityGrade | null;
    status: ConfidenceStatus;
    lastAnalysisAt: string | null;
  };
  predictionConfidence: {
    confidenceScore: number | null;
    predictionStability: number | null;
    reliabilityGrade: ReliabilityGrade | null;
    projectionVariance: VarianceRating | null;
  };
  dataQuality: {
    dataCompleteness: number | null;
    injuryDataStatus: "available" | "partial" | "unavailable" | "pending";
    weatherDataStatus: "available" | "partial" | "unavailable" | "pending";
    marketDataStatus: "available" | "partial" | "unavailable" | "pending";
    expertConsensusStatus: "available" | "partial" | "unavailable" | "pending";
  };
  portfolioHealthSnapshot: {
    portfolioGrade: ReliabilityGrade | null;
    risk: string | null;
    exposureBalance: string | null;
    stackDiversity: string | null;
    salaryDistribution: string | null;
    leverage: string | null;
    exposureWarnings?: string[];
  };
  checklist: {
    id: string;
    label: string;
    state: "complete" | "pending" | "unavailable";
  }[];
  summary: {
    insights: string[];
  };
};

/** Backend DTO — Vegas Intelligence Agent response (V2.1-5). */
export type VegasIntelligenceResponseDto = {
  featuredGames?: Array<{
    id: string;
    matchup: string;
    spread: number | null;
    total: number | null;
    impliedHomeTotal: number | null;
    impliedAwayTotal: number | null;
    lineMovement: number | null;
    expectedPace: "fast" | "moderate" | "slow";
    spreadLabel?: string;
    paceLabel?: string;
  }>;
  averageTotal?: number | null;
  highTotalGames?: number;
  lineMovementGames?: number;
  marketCoverage?: number;
  scoringEnvironment?: "high" | "moderate" | "low";
  assessment?: string;
  factors?: string[];
  confidenceRating?: number;
};

/** Backend DTO — Weather Intelligence Agent response (V2.1-6). */
export type WeatherIntelligenceResponseDto = {
  windGames?: number;
  rainGames?: number;
  snowGames?: number;
  outdoorGames?: number;
  domeGames?: number;
  maxWindMph?: number | null;
  averageTemperature?: number | null;
  highImpactGames?: number;
  weatherCoverage?: number;
  severity?: "low" | "moderate" | "high";
  assessment?: string;
  factors?: string[];
  gameImpacts?: Array<{
    id: string;
    matchup: string;
    impact: "low" | "moderate" | "high";
    summary: string;
  }>;
  confidenceRating?: number;
};

  confidenceRating?: number;
};

/** Backend DTO — Ownership Intelligence Agent response (V2.1-9). */
export type OwnershipIntelligenceResponseDto = {
  averagePredictedOwnership?: number;
  chalkPlayerCount?: number;
  contrarianPlayerCount?: number;
  leverageOpportunities?: number;
  ownershipConcentration?: number;
  assessment?: string;
  factors?: string[];
  confidenceRating?: number;
};

/** Backend DTO — Injury Intelligence Agent response (V2.1-4). */
export type InjuryIntelligenceResponseDto = {
  majorInjuries?: number;
  questionablePlayers?: number;
  doubtfulPlayers?: number;
  outPlayers?: number;
  backupOpportunities?: number;
  rookieOpportunities?: number;
  lineupImpactSummary?: string;
  assessment?: string;
  factors?: string[];
  injuryCoverage?: number;
  confidenceRating?: number;
};

/** Backend DTO — Slate Intelligence Agent response (V2.1-1). */
export type SlateIntelligenceResponseDto = {
  slateGrade?: number;
  volatilityScore?: number;
  recommendedStrategy?:
    | "balanced"
    | "primary_heavy"
    | "gpp_heavy"
    | "contrarian"
    | "stack_aggressive";
  confidenceRating?: number;
  factors?: string[];
  slateSummary?: string;
  slateName?: string;
  week?: number;
  gameCount?: number;
  teamCount?: number;
  totalPlayers?: number;
  slateRisk?: "low" | "moderate" | "high";
  contestRecommendation?: string;
};

/** Backend DTO — pipeline status for dashboard and analyze flow. */
export type PipelineStatusResponseDto = {
  runId: string | null;
  status: AnalysisRunStatus;
  currentSlate: string;
  portfolioReadiness: string;
  lastAnalysisAt: string;
};

export type AnalysisBundleResponseDto = {
  pipeline: PipelineStatusResponseDto;
  confidence: PredictionConfidenceResponseDto;
  playerEvidence: PlayerEvidenceResponseDto;
  portfolioHealth: PortfolioHealthResponseDto;
  simulation: SimulationResultsResponseDto;
  recommendedPortfolio: RecommendedPortfolioResponseDto;
  portfolioReadiness: PortfolioReadinessResponseDto;
  slateIntelligence?: SlateIntelligenceResponseDto;
  injuryIntelligence?: InjuryIntelligenceResponseDto;
  vegasIntelligence?: VegasIntelligenceResponseDto;
  weatherIntelligence?: WeatherIntelligenceResponseDto;
  ownershipIntelligence?: OwnershipIntelligenceResponseDto;
};
