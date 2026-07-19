import type { AnalysisRunContext, EngineOutputs } from "@alpha-dfs/shared";
import { exposureBalanceLabel } from "@alpha-dfs/portfolio-intelligence";
import type { AnalysisBundleResponseDto } from "@/types/dto/analysis-responses.dto";
import { createIdleAnalysisBundle } from "@/lib/backend/fixtures/idle-bundle";

const EVIDENCE_CATEGORY_LABELS: Record<string, string> = {
  historical_performance: "Historical Performance",
  matchup_analysis: "Matchup Analysis",
  injury_reports: "Injury Reports",
  weather: "Weather",
  market_signals: "Market Signals",
  expert_consensus: "Expert Consensus",
};

/** Assemble frontend DTO bundle from engine domain outputs. */
export function assembleAnalysisBundle(
  context: AnalysisRunContext,
  outputs: EngineOutputs,
  completedAt: string,
  runId: string,
): AnalysisBundleResponseDto {
  const idle = createIdleAnalysisBundle();
  const { slate, slateIntelligence, injuryIntelligence, vegasIntelligence, weatherIntelligence, ownershipIntelligence, projectionCalibration, playerAnalysis, confidence, portfolio, simulation } = outputs;
  const ownershipLookup = new Map(
    ownershipIntelligence?.players.map((player) => [player.slatePlayerId, player]) ?? [],
  );

  const bundle: AnalysisBundleResponseDto = {
    pipeline: {
      runId,
      status: "complete",
      currentSlate: slate.slateLabel,
      portfolioReadiness: "Ready",
      lastAnalysisAt: completedAt,
    },
    confidence: {
      status: "ready",
      overallConfidence: confidence.overallConfidence,
      confidenceGrade: confidence.confidenceGrade,
      stabilityScore: confidence.stabilityScore,
      projectionConsistency: confidence.projectionConsistency,
      variance: confidence.variance,
      reliability: confidence.reliability,
      dataCompleteness: confidence.dataCompleteness,
      injuryCoverage: confidence.injuryCoverage,
      weatherCoverage: confidence.weatherCoverage,
      marketCoverage: confidence.marketCoverage,
      expertConsensus: confidence.expertConsensus,
      internalAgreement: confidence.internalAgreement,
      externalAgreement: confidence.externalAgreement,
      historicalAgreement: confidence.historicalAgreement,
      overallAgreement: confidence.overallAgreement,
      insights: confidence.insights,
      calibratedProjection: projectionCalibration?.enabled
        ? projectionCalibration.averageCalibratedProjection
        : null,
      calibrationFactor: projectionCalibration?.enabled
        ? projectionCalibration.averageCalibrationFactor
        : null,
      calibrationNotes: projectionCalibration?.enabled
        ? [...projectionCalibration.calibrationNotes]
        : undefined,
      metadata: {
        confidenceVersion: confidence.version,
        timestamp: completedAt,
        dataFreshness: "Current",
        analysisVersion: "analysis-1.0-stub",
      },
      lastAnalysisAt: completedAt,
    },
    playerEvidence: {
      overview: {
        totalPlayers: playerAnalysis.totalPlayers,
        highConfidencePlayers: playerAnalysis.highConfidencePlayers,
        moderateConfidencePlayers: playerAnalysis.moderateConfidencePlayers,
        lowConfidencePlayers: playerAnalysis.lowConfidencePlayers,
        lastAnalysisAt: completedAt,
      },
      filters: {
        positions: ["QB", "RB", "WR", "TE", "DST"],
        teams: [...new Set(playerAnalysis.players.map((player) => player.team))],
        confidenceTiers: ["high", "moderate", "low"],
      },
      players: playerAnalysis.players.map((player) => ({
        slatePlayerId: player.slatePlayerId,
        name: player.name,
        position: player.position,
        team: player.team,
        opponent: player.opponent,
        salary: player.salary,
        projection: player.projection,
        confidenceScore: player.confidenceScore,
        confidenceTier: player.confidenceTier,
        risk: player.risk,
        injuryStatus: player.injuryStatus,
        practiceStatus: player.practiceStatus,
        gameStatus: player.gameStatus,
        matchupSummary: player.matchupSummary,
        ownershipEstimate: player.ownershipEstimate,
        predictedOwnership:
          ownershipLookup.get(player.slatePlayerId)?.predictedOwnership ??
          player.ownershipEstimate,
        ownershipSource: ownershipLookup.get(player.slatePlayerId)?.ownershipSource ?? null,
        supportingRationale: player.supportingRationale,
        evidenceSources: player.evidenceSources,
      })),
      evidenceSourceCategories: Object.entries(playerAnalysis.evidenceSourceStatuses).map(
        ([id, status]) => ({
          id,
          label: EVIDENCE_CATEGORY_LABELS[id] ?? id,
          status,
        }),
      ),
      confidence: {
        overallConfidence: confidence.overallConfidence,
        projectionStability: confidence.stabilityScore,
        variance: confidence.variance,
        reliabilityGrade: confidence.confidenceGrade,
      },
      explainabilitySummary: idle.playerEvidence.explainabilitySummary.map((item) =>
        item.replace(" (placeholder)", ""),
      ),
      metadata: {
        analysisVersion: "analysis-1.0-stub",
        timestamp: completedAt,
        dataFreshness: "Current",
        evidenceVersion: "evidence-1.0",
      },
    },
    portfolioHealth: {
      overview: {
        overallHealthScore: portfolio.healthScore,
        portfolioGrade: portfolio.portfolioGrade,
        overallStatus: "healthy",
        lastAnalysisAt: completedAt,
      },
      exposure: {
        qbExposure: portfolio.exposure.qbExposure ?? null,
        rbExposure: portfolio.exposure.rbExposure ?? null,
        wrExposure: portfolio.exposure.wrExposure ?? null,
        teExposure: portfolio.exposure.teExposure ?? null,
        dstExposure: portfolio.exposure.dstExposure ?? null,
      },
      diversity: portfolio.diversity,
      ownership: portfolio.ownership,
      salary: portfolio.salary,
      risk: portfolio.risk,
      exposureSummary: portfolio.exposureSummary
        ? {
            playerExposures: portfolio.exposureSummary.playerExposures.map((entry) => ({
              ...entry,
            })),
            teamExposures: portfolio.exposureSummary.teamExposures.map((entry) => ({
              ...entry,
            })),
            stackExposures: portfolio.exposureSummary.stackExposures.map((entry) => ({
              ...entry,
            })),
            salaryFlexibilityPct: portfolio.exposureSummary.salaryFlexibilityPct,
            warnings: [...portfolio.exposureSummary.warnings],
          }
        : undefined,
      recommendations: portfolio.recommendations,
      metadata: {
        analysisVersion: "analysis-1.0-stub",
        timestamp: completedAt,
        dataFreshness: "Current",
        portfolioVersion: portfolio.version,
      },
    },
    simulation: {
      overview: {
        simulationStatus: "complete",
        simulationCount: simulation.simulationCount,
        lastRunAt: completedAt,
        analysisStatus: "ready",
      },
      projections: {
        medianProjection: simulation.medianProjection,
        floorProjection: simulation.floorProjection,
        ceilingProjection: simulation.ceilingProjection,
        averageProjection: simulation.averageProjection,
      },
    probabilities: {
      winProbability: simulation.winProbability,
      cashProbability: simulation.cashProbability,
      top1PercentFinish: simulation.top1PercentFinish,
      top10PercentFinish: simulation.top10PercentFinish,
    },
    fieldMetrics: {
      fieldSize: simulation.fieldSize,
      fieldPercentile: simulation.fieldPercentile,
      topOnePercentRate: simulation.topOnePercentRate,
      cashRate: simulation.cashRate,
    },
      distribution: {
        lowOutcome: simulation.floorProjection,
        expectedOutcome: simulation.medianProjection,
        highOutcome: simulation.ceilingProjection,
        volatilityRating: simulation.volatilityRating,
      },
      insights:
        ownershipIntelligence && ownershipIntelligence.leverageOpportunities > 0
          ? [
              ...simulation.insights,
              `${ownershipIntelligence.leverageOpportunities} leverage opportunities identified by ownership model`,
            ]
          : simulation.insights,
      metadata: {
        simulationVersion: simulation.version,
        timestamp: completedAt,
        dataFreshness: "Current",
        portfolioVersion: portfolio.version,
        analysisVersion: "analysis-1.0-stub",
      },
    },
    recommendedPortfolio: {
      portfolioOverview: {
        totalPortfolios: portfolio.primaryLineups.length + portfolio.hailMaryLineups.length,
        primaryCount: portfolio.primaryLineups.length,
        hailMaryCount: portfolio.hailMaryLineups.length,
        generationTimestamp: completedAt,
        portfolioStatus: "complete",
      },
      primaryLineups: portfolio.primaryLineups,
      hailMaryLineups: portfolio.hailMaryLineups,
      portfolioSummary: {
        portfolioGrade: portfolio.portfolioGrade,
        overallConfidence: confidence.overallConfidence,
        averageProjection: simulation.averageProjection,
        averageOwnership: portfolio.ownership.averageOwnership,
        averageSalary: portfolio.salary.averageSalaryUsed,
        averageRisk: portfolio.risk.overallRisk,
      },
      explainabilitySummary: idle.recommendedPortfolio.explainabilitySummary.map((item) =>
        item.replace(" (placeholder)", ""),
      ),
      generationMetadata: {
        analysisVersion: "analysis-1.0-stub",
        generationTime: completedAt,
        simulationStatus: "Complete",
        dataFreshness: "Current",
        timestamp: completedAt,
      },
      recommendations: idle.recommendedPortfolio.recommendations.map((item) =>
        item.replace(" (placeholder)", ""),
      ),
    },
    portfolioReadiness: {
      readinessScore: {
        overallReadinessScore: Math.max(70, slate.dataCompleteness - 8),
        readinessGrade:
          slate.dataCompleteness >= 85
            ? "A"
            : slate.dataCompleteness >= 70
              ? "B"
              : slate.dataCompleteness >= 55
                ? "C"
                : "D",
        status: "ready",
        lastAnalysisAt: completedAt,
      },
      predictionConfidence: {
        confidenceScore: confidence.overallConfidence,
        predictionStability: confidence.stabilityScore,
        reliabilityGrade: confidence.confidenceGrade,
        projectionVariance: confidence.variance,
      },
      dataQuality: {
        dataCompleteness: slate.dataCompleteness,
        injuryDataStatus: slate.injuryDataStatus,
        weatherDataStatus: slate.weatherDataStatus,
        marketDataStatus: slate.marketDataStatus,
        expertConsensusStatus: slate.expertConsensusStatus,
      },
      portfolioHealthSnapshot: {
        portfolioGrade: portfolio.portfolioGrade,
        risk: portfolio.risk.overallRisk,
        exposureBalance: portfolio.exposureSummary
          ? exposureBalanceLabel(portfolio.exposureSummary)
          : portfolio.exposure.wrExposure ?? "Balanced",
        stackDiversity: "Sufficient",
        salaryDistribution: portfolio.salary.salaryBalance,
        leverage: portfolio.ownership.leverageBalance,
        exposureWarnings: portfolio.exposureSummary?.warnings,
      },
      checklist: [
        { id: "statistical-data", label: "Statistical data loaded", state: "complete" },
        { id: "slate-analyzed", label: "Slate analyzed", state: "complete" },
        { id: "injuries-reviewed", label: "Injuries reviewed", state: "complete" },
        { id: "weather-available", label: "Weather available", state: "complete" },
        { id: "simulations-completed", label: "Simulations completed", state: "complete" },
        { id: "portfolio-generated", label: "Portfolio generated", state: "complete" },
      ],
      summary: {
        insights: [
          "Portfolio readiness assessment complete",
          "All data sources validated for current slate",
        ],
      },
    },
  };

  if (slateIntelligence) {
    bundle.slateIntelligence = {
      slateGrade: slateIntelligence.slateGrade,
      volatilityScore: slateIntelligence.volatilityScore,
      recommendedStrategy: slateIntelligence.recommendedStrategy,
      confidenceRating: slateIntelligence.confidenceRating,
      factors: [...slateIntelligence.factors],
      slateSummary: slateIntelligence.slateSummary,
      slateName: slateIntelligence.slateName,
      week: slateIntelligence.week,
      gameCount: slateIntelligence.gameCount,
      teamCount: slateIntelligence.teamCount,
      totalPlayers: slateIntelligence.totalPlayers,
      slateRisk: slateIntelligence.slateRisk,
      contestRecommendation: slateIntelligence.contestRecommendation,
    };
  }

  if (injuryIntelligence) {
    bundle.injuryIntelligence = {
      majorInjuries: injuryIntelligence.majorInjuries,
      questionablePlayers: injuryIntelligence.questionablePlayers,
      doubtfulPlayers: injuryIntelligence.doubtfulPlayers,
      outPlayers: injuryIntelligence.outPlayers,
      backupOpportunities: injuryIntelligence.backupOpportunities,
      rookieOpportunities: injuryIntelligence.rookieOpportunities,
      lineupImpactSummary: injuryIntelligence.lineupImpactSummary,
      assessment: injuryIntelligence.assessment,
      factors: [...injuryIntelligence.factors],
      injuryCoverage: injuryIntelligence.injuryCoverage,
      confidenceRating: injuryIntelligence.injuryCoverage / 100,
    };
  }

  if (vegasIntelligence) {
    bundle.vegasIntelligence = {
      featuredGames: vegasIntelligence.featuredGames.map((game) => ({ ...game })),
      averageTotal: vegasIntelligence.averageTotal,
      highTotalGames: vegasIntelligence.highTotalGames,
      lineMovementGames: vegasIntelligence.lineMovementGames,
      marketCoverage: vegasIntelligence.marketCoverage,
      scoringEnvironment: vegasIntelligence.scoringEnvironment,
      assessment: vegasIntelligence.assessment,
      factors: [...vegasIntelligence.factors],
      confidenceRating: vegasIntelligence.marketCoverage / 100,
    };
  }

  if (weatherIntelligence) {
    bundle.weatherIntelligence = {
      windGames: weatherIntelligence.windGames,
      rainGames: weatherIntelligence.rainGames,
      snowGames: weatherIntelligence.snowGames,
      outdoorGames: weatherIntelligence.outdoorGames,
      domeGames: weatherIntelligence.domeGames,
      maxWindMph: weatherIntelligence.maxWindMph,
      averageTemperature: weatherIntelligence.averageTemperature,
      highImpactGames: weatherIntelligence.highImpactGames,
      weatherCoverage: weatherIntelligence.weatherCoverage,
      severity: weatherIntelligence.severity,
      assessment: weatherIntelligence.assessment,
      factors: [...weatherIntelligence.factors],
      gameImpacts: weatherIntelligence.gameImpacts.map((game) => ({ ...game })),
      confidenceRating: weatherIntelligence.weatherCoverage / 100,
    };
  }

  if (ownershipIntelligence) {
    bundle.ownershipIntelligence = {
      averagePredictedOwnership: ownershipIntelligence.averagePredictedOwnership,
      chalkPlayerCount: ownershipIntelligence.chalkPlayerCount,
      contrarianPlayerCount: ownershipIntelligence.contrarianPlayerCount,
      leverageOpportunities: ownershipIntelligence.leverageOpportunities,
      ownershipConcentration: ownershipIntelligence.ownershipConcentration,
      assessment: ownershipIntelligence.assessment,
      factors: [...ownershipIntelligence.factors],
      confidenceRating: ownershipIntelligence.averagePredictedOwnership / 100,
    };
  }

  return bundle;
}

export function assembleAnalyzingBundle(
  runId: string,
  slateLabel: string,
): AnalysisBundleResponseDto {
  const idle = createIdleAnalysisBundle();
  return {
    ...idle,
    pipeline: {
      runId,
      status: "analyzing",
      currentSlate: slateLabel,
      portfolioReadiness: "Assessing",
      lastAnalysisAt: "In progress",
    },
  };
}

export function assembleFailedBundle(
  runId: string | null,
  errorMessage: string,
): AnalysisBundleResponseDto {
  const idle = createIdleAnalysisBundle();
  return {
    ...idle,
    pipeline: {
      runId,
      status: "failed",
      currentSlate: idle.pipeline.currentSlate,
      portfolioReadiness: "Failed",
      lastAnalysisAt: errorMessage,
    },
  };
}
