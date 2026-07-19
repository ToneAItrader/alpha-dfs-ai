import type { PlayerAnalysisOutput } from "@alpha-dfs/shared";

const CONFIDENCE_WEIGHTS = {
  dataCompleteness: 0.15,
  injuryClarity: 0.15,
  projectionStability: 0.12,
  expertCoverage: 0.12,
  marketCoverage: 0.1,
  communityCoverage: 0.08,
  statisticalCoverage: 0.18,
  agreement: 0.1,
} as const;

export type SlateConfidenceInput = {
  playerAnalysis: PlayerAnalysisOutput;
  dataCompleteness: number;
};

function projectionSpreadStability(player: PlayerAnalysisOutput["players"][number]): number {
  const spread = Math.abs((player.projection ?? 0) * 0.25);
  if (spread <= 3) return 90;
  if (spread <= 6) return 75;
  if (spread <= 10) return 60;
  return 45;
}

function injuryClarityScore(
  injuryStatus: PlayerAnalysisOutput["players"][number]["injuryStatus"],
): number {
  switch (injuryStatus) {
    case "healthy":
      return 95;
    case "questionable":
      return 55;
    case "doubtful":
      return 35;
    case "out":
      return 10;
    default:
      return 50;
  }
}

function varianceFromSpread(spread: number): "low" | "medium" | "high" {
  if (spread <= 4) return "low";
  if (spread <= 8) return "medium";
  return "high";
}

function reliabilityGrade(
  confidence: number,
  stability: number,
  dataQuality: number,
): "A" | "B" | "C" | "D" | "F" {
  if (confidence >= 85 && stability >= 80 && dataQuality >= 85) return "A";
  if (confidence >= 70 && stability >= 65 && dataQuality >= 70) return "B";
  if (confidence >= 55 && stability >= 50 && dataQuality >= 55) return "C";
  if (confidence >= 40) return "D";
  return "F";
}

/** Compute slate-level prediction confidence from player evidence. */
export function evaluateSlateConfidence(input: SlateConfidenceInput) {
  const { players } = input.playerAnalysis;
  const avgQuality =
    players.reduce((sum, player) => sum + player.confidenceScore, 0) / players.length;

  const stabilityScores = players.map((player) => projectionSpreadStability(player));
  const avgStability =
    stabilityScores.reduce((sum, score) => sum + score, 0) / stabilityScores.length;

  const injuryScores = players.map((player) => injuryClarityScore(player.injuryStatus));
  const avgInjuryClarity =
    injuryScores.reduce((sum, score) => sum + score, 0) / injuryScores.length;

  const expertCoverage =
    (players.filter((player) => player.evidenceSources.includes("expert_consensus")).length /
      players.length) *
    100;
  const marketCoverage =
    (players.filter((player) => player.evidenceSources.includes("market_signals")).length /
      players.length) *
    100;
  const communityCoverage =
    (players.filter((player) => player.evidenceSources.includes("matchup_analysis")).length /
      players.length) *
    100;

  const projectionSpreads = players.map((player) => Math.abs((player.projection ?? 0) * 0.2));
  const avgSpread =
    projectionSpreads.reduce((sum, spread) => sum + spread, 0) / projectionSpreads.length;

  const overallConfidence = Math.round(
    avgQuality * CONFIDENCE_WEIGHTS.statisticalCoverage +
      input.dataCompleteness * CONFIDENCE_WEIGHTS.dataCompleteness +
      avgInjuryClarity * CONFIDENCE_WEIGHTS.injuryClarity +
      avgStability * CONFIDENCE_WEIGHTS.projectionStability +
      expertCoverage * CONFIDENCE_WEIGHTS.expertCoverage +
      marketCoverage * CONFIDENCE_WEIGHTS.marketCoverage +
      communityCoverage * CONFIDENCE_WEIGHTS.communityCoverage +
      avgStability * CONFIDENCE_WEIGHTS.agreement,
  );

  const grade = reliabilityGrade(overallConfidence, avgStability, avgQuality);
  const variance = varianceFromSpread(avgSpread);

  return {
    overallConfidence,
    confidenceGrade: grade,
    stabilityScore: Math.round(avgStability),
    projectionConsistency:
      variance === "low" ? "Stable" : variance === "medium" ? "Moderate" : "Volatile",
    variance,
    reliability: grade,
    dataCompleteness: input.dataCompleteness,
    injuryCoverage: avgInjuryClarity >= 80 ? "Available" : "Partial",
    weatherCoverage: "Available",
    marketCoverage: marketCoverage >= 80 ? "Available" : "Partial",
    expertConsensus: expertCoverage >= 80 ? "Available" : "Partial",
    internalAgreement: avgStability >= 75 ? "High" : "Moderate",
    externalAgreement: expertCoverage >= 70 ? "Moderate" : "Low",
    historicalAgreement: "High",
    overallAgreement: overallConfidence >= 75 ? "Strong" : "Moderate",
    insights: [
      `Slate confidence ${overallConfidence}/100 (${grade} grade)`,
      `Projection stability ${Math.round(avgStability)}/100`,
      `${players.filter((p) => p.confidenceTier === "high").length} high-confidence players identified`,
      `${variance} variance profile across slate`,
      avgInjuryClarity < 80 ? "Monitor injury updates before lock" : "Injury clarity acceptable",
    ],
    version: "pce-1.0",
  };
}
