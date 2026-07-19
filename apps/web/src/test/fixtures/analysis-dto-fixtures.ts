import type {
  AnalysisBundleResponseDto,
  PredictionConfidenceResponseDto,
  PlayerEvidenceResponseDto,
  PortfolioHealthResponseDto,
  PortfolioReadinessResponseDto,
  RecommendedPortfolioResponseDto,
  SimulationResultsResponseDto,
} from "@/types/dto/analysis-responses.dto";

const baseMetadata = {
  analysisVersion: null as string | null,
  timestamp: null as string | null,
  dataFreshness: null as string | null,
};

export const idleConfidenceDto: PredictionConfidenceResponseDto = {
  status: "idle",
  overallConfidence: null,
  confidenceGrade: null,
  stabilityScore: null,
  projectionConsistency: null,
  variance: null,
  reliability: null,
  dataCompleteness: null,
  injuryCoverage: null,
  weatherCoverage: null,
  marketCoverage: null,
  expertConsensus: null,
  internalAgreement: null,
  externalAgreement: null,
  historicalAgreement: null,
  overallAgreement: null,
  insights: [],
  metadata: { ...baseMetadata, confidenceVersion: null },
  lastAnalysisAt: null,
};

export const idlePlayerEvidenceDto: PlayerEvidenceResponseDto = {
  overview: {
    totalPlayers: 0,
    highConfidencePlayers: 0,
    moderateConfidencePlayers: 0,
    lowConfidencePlayers: 0,
    lastAnalysisAt: null,
  },
  filters: { positions: [], teams: [], confidenceTiers: [] },
  players: [],
  evidenceSourceCategories: [],
  confidence: {
    overallConfidence: null,
    projectionStability: null,
    variance: null,
    reliabilityGrade: null,
  },
  explainabilitySummary: [],
  metadata: { ...baseMetadata, evidenceVersion: null },
};

export const idlePortfolioHealthDto: PortfolioHealthResponseDto = {
  overview: {
    overallHealthScore: null,
    portfolioGrade: null,
    overallStatus: "idle",
    lastAnalysisAt: null,
  },
  exposure: {
    qbExposure: null,
    rbExposure: null,
    wrExposure: null,
    teExposure: null,
    dstExposure: null,
  },
  diversity: {
    numberOfStacks: null,
    teamDiversity: null,
    opponentDiversity: null,
    correlationScore: null,
  },
  ownership: {
    averageOwnership: null,
    chalkExposure: null,
    contrarianExposure: null,
    leverageBalance: null,
  },
  salary: {
    averageSalaryUsed: null,
    remainingSalary: null,
    salaryEfficiency: null,
    salaryBalance: null,
  },
  risk: {
    overallRisk: null,
    floor: null,
    ceiling: null,
    variance: null,
  },
  recommendations: [],
  metadata: { ...baseMetadata, portfolioVersion: null },
};

export const idleSimulationDto: SimulationResultsResponseDto = {
  overview: {
    simulationStatus: "idle",
    simulationCount: null,
    lastRunAt: null,
    analysisStatus: "idle",
  },
  projections: {
    medianProjection: null,
    floorProjection: null,
    ceilingProjection: null,
    averageProjection: null,
  },
  probabilities: {
    winProbability: null,
    cashProbability: null,
    top1PercentFinish: null,
    top10PercentFinish: null,
  },
  distribution: {
    lowOutcome: null,
    expectedOutcome: null,
    highOutcome: null,
    volatilityRating: null,
  },
  insights: [],
  metadata: {
    ...baseMetadata,
    simulationVersion: null,
    portfolioVersion: null,
  },
};

export const idleRecommendedPortfolioDto: RecommendedPortfolioResponseDto = {
  portfolioOverview: {
    totalPortfolios: 0,
    primaryCount: 0,
    hailMaryCount: 0,
    generationTimestamp: null,
    portfolioStatus: "idle",
  },
  primaryLineups: [],
  hailMaryLineups: [],
  portfolioSummary: {
    portfolioGrade: null,
    overallConfidence: null,
    averageProjection: null,
    averageOwnership: null,
    averageSalary: null,
    averageRisk: null,
  },
  explainabilitySummary: [],
  generationMetadata: {
    ...baseMetadata,
    generationTime: null,
    simulationStatus: null,
  },
  recommendations: [],
};

export const idlePortfolioReadinessDto: PortfolioReadinessResponseDto = {
  readinessScore: {
    overallReadinessScore: null,
    readinessGrade: null,
    status: "idle",
    lastAnalysisAt: null,
  },
  predictionConfidence: {
    confidenceScore: null,
    predictionStability: null,
    reliabilityGrade: null,
    projectionVariance: null,
  },
  dataQuality: {
    dataCompleteness: null,
    injuryDataStatus: "pending",
    weatherDataStatus: "pending",
    marketDataStatus: "pending",
    expertConsensusStatus: "pending",
  },
  portfolioHealthSnapshot: {
    portfolioGrade: null,
    risk: null,
    exposureBalance: null,
    stackDiversity: null,
    salaryDistribution: null,
    leverage: null,
    exposureWarnings: [],
  },
  checklist: [],
  summary: { insights: [] },
};

export function createIdleAnalysisBundle(): AnalysisBundleResponseDto {
  return {
    pipeline: {
      runId: null,
      status: "idle",
      currentSlate: "No slate loaded",
      portfolioReadiness: "Not assessed",
      lastAnalysisAt: "Not yet run",
    },
    confidence: idleConfidenceDto,
    playerEvidence: idlePlayerEvidenceDto,
    portfolioHealth: idlePortfolioHealthDto,
    simulation: idleSimulationDto,
    recommendedPortfolio: idleRecommendedPortfolioDto,
    portfolioReadiness: idlePortfolioReadinessDto,
  };
}

export function createPartialPlayerEvidenceDto(): PlayerEvidenceResponseDto {
  return {
    ...idlePlayerEvidenceDto,
    overview: {
      totalPlayers: 1,
      highConfidencePlayers: 0,
      moderateConfidencePlayers: 0,
      lowConfidencePlayers: 0,
      lastAnalysisAt: null,
    },
    players: [
      {
        slatePlayerId: "partial-1",
        name: "Partial Player",
        position: "WR",
        team: "NYG",
        opponent: "DAL",
        salary: null,
        projection: null,
        confidenceScore: null,
        confidenceTier: null,
        risk: null,
        injuryStatus: null,
        matchupSummary: null,
        ownershipEstimate: null,
        supportingRationale: "Partial evidence only.",
        evidenceSources: ["unknown_source", "historical_performance"],
      },
    ],
  };
}
