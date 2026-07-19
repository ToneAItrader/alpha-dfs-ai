import type {
  RecommendedStrategy,
  SlateAnalysisOutput,
  SlateIntelligenceOutput,
} from "@alpha-dfs/shared";

export type SlateIntelligenceComputationInput = {
  slateLabel: string;
  slateName: string;
  week: number;
  readiness: SlateAnalysisOutput;
  gameCount: number;
  teamCount: number;
  totalPlayers: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function volatilityFromReadiness(readiness: SlateAnalysisOutput): number {
  const uncertaintySignals = [
    readiness.injuryDataStatus,
    readiness.weatherDataStatus,
    readiness.marketDataStatus,
  ];
  const partialCount = uncertaintySignals.filter((status) => status !== "available").length;
  const base = 35 + partialCount * 15;
  const completenessAdjustment = (100 - readiness.dataCompleteness) * 0.25;
  return clamp(Math.round(base + completenessAdjustment), 0, 100);
}

function gradeFromReadiness(readiness: SlateAnalysisOutput, totalPlayers: number): number {
  const sizeBonus = totalPlayers >= 120 ? 8 : totalPlayers >= 80 ? 4 : 0;
  return clamp(Math.round(readiness.dataCompleteness * 0.85 + sizeBonus), 0, 100);
}

function strategyFromSignals(
  volatility: number,
  readiness: SlateAnalysisOutput,
): RecommendedStrategy {
  if (readiness.marketDataStatus === "available" && volatility >= 70) {
    return "stack_aggressive";
  }
  if (volatility >= 65) {
    return "gpp_heavy";
  }
  if (readiness.expertConsensusStatus === "partial" && volatility >= 50) {
    return "contrarian";
  }
  if (volatility <= 40 && readiness.dataCompleteness >= 80) {
    return "primary_heavy";
  }
  return "balanced";
}

function slateRiskFromVolatility(volatility: number): SlateIntelligenceOutput["slateRisk"] {
  if (volatility >= 65) return "high";
  if (volatility >= 45) return "moderate";
  return "low";
}

function contestRecommendationFromStrategy(strategy: RecommendedStrategy): string {
  switch (strategy) {
    case "primary_heavy":
      return "Favor large-field cash and double-ups with tighter Primary exposure.";
    case "gpp_heavy":
      return "Prioritize large-field GPP entries with elevated Hail Mary leverage.";
    case "contrarian":
      return "Target medium-field tournaments with differentiated roster construction.";
    case "stack_aggressive":
      return "Build around high-total game stacks in large-field GPP contests.";
    default:
      return "Balanced contest mix — standard Primary and Hail Mary allocation.";
  }
}

function confidenceFromReadiness(readiness: SlateAnalysisOutput): number {
  const statusScore = (status: SlateAnalysisOutput["injuryDataStatus"]) => {
    switch (status) {
      case "available":
        return 1;
      case "partial":
        return 0.7;
      case "unavailable":
        return 0.4;
      default:
        return 0.5;
    }
  };

  const coverageAverage =
    (statusScore(readiness.injuryDataStatus) +
      statusScore(readiness.weatherDataStatus) +
      statusScore(readiness.marketDataStatus) +
      statusScore(readiness.expertConsensusStatus)) /
    4;

  return clamp(Number((readiness.dataCompleteness / 100) * 0.6 + coverageAverage * 0.4), 0, 1);
}

function buildFactors(input: SlateIntelligenceComputationInput, volatility: number): string[] {
  const factors = [
    `Data completeness at ${input.readiness.dataCompleteness}%`,
    `Slate volatility assessed at ${volatility}/100`,
    `${input.totalPlayers} active players across ${input.gameCount} games`,
  ];

  if (input.readiness.injuryDataStatus !== "available") {
    factors.push("Injury data incomplete — monitor late updates");
  }
  if (input.readiness.weatherDataStatus !== "available") {
    factors.push("Weather coverage partial — outdoor games need review");
  }
  if (input.readiness.marketDataStatus === "available") {
    factors.push("Market signals available for stack evaluation");
  }

  return factors;
}

/** Pure slate intelligence computation — unit-testable without I/O. */
export function computeSlateIntelligence(
  input: SlateIntelligenceComputationInput,
): SlateIntelligenceOutput {
  const volatilityScore = volatilityFromReadiness(input.readiness);
  const slateGrade = gradeFromReadiness(input.readiness, input.totalPlayers);
  const recommendedStrategy = strategyFromSignals(volatilityScore, input.readiness);
  const confidenceRating = confidenceFromReadiness(input.readiness);
  const factors = buildFactors(input, volatilityScore);
  const slateRisk = slateRiskFromVolatility(volatilityScore);
  const contestRecommendation = contestRecommendationFromStrategy(recommendedStrategy);

  const slateSummary = [
    `${input.slateName} (Week ${input.week})`,
    `${input.gameCount} games · ${input.teamCount} teams · ${input.totalPlayers} players`,
    `Slate grade ${slateGrade}/100 with ${volatilityScore}/100 volatility`,
    `Recommended ${recommendedStrategy.replace(/_/g, " ")} strategy`,
  ].join(" — ");

  return {
    slateGrade,
    volatilityScore,
    recommendedStrategy,
    confidenceRating,
    slateRisk,
    contestRecommendation,
    factors,
    slateSummary,
    slateName: input.slateName,
    week: input.week,
    gameCount: input.gameCount,
    teamCount: input.teamCount,
    totalPlayers: input.totalPlayers,
  };
}
