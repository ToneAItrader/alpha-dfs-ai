import type { ConfidenceEngineOutput, PlayerAnalysisOutput, PortfolioEngineOutput } from "@alpha-dfs/shared";
import {
  createSeededRandom,
  percentile,
  sampleTruncatedNormal,
  stdDevFromVarianceRating,
} from "./distributions";
import { runGppFieldSimulation } from "./gpp-field";

export type SimulationInput = {
  playerAnalysis: PlayerAnalysisOutput;
  portfolio: PortfolioEngineOutput;
  confidence: ConfidenceEngineOutput;
  simulationCount?: number;
  fieldSize?: number;
  cashThreshold?: number;
  seed?: number;
};

export type SimulationResult = {
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

function primaryLineupProjection(portfolio: PortfolioEngineOutput): number {
  const primary = portfolio.primaryLineups[0];
  return primary?.projectedFantasyPoints ?? 140;
}

/** Monte Carlo simulation for primary portfolio lineup. */
export function runPortfolioSimulation(input: SimulationInput): SimulationResult {
  const {
    playerAnalysis,
    portfolio,
    confidence,
    simulationCount = 10000,
    fieldSize = Number(process.env.SIMULATION_FIELD_SIZE ?? 10000),
    cashThreshold = 150,
    seed = 42,
  } = input;

  const random = createSeededRandom(seed);
  const lineupMean = primaryLineupProjection(portfolio);
  const variance = confidence.variance;
  const stdDev = stdDevFromVarianceRating(lineupMean, variance);
  const floor = portfolio.risk.floor;
  const ceiling = portfolio.risk.ceiling;

  const outcomes: number[] = [];
  for (let i = 0; i < simulationCount; i += 1) {
    outcomes.push(
      sampleTruncatedNormal(random, lineupMean, stdDev, floor, ceiling),
    );
  }

  outcomes.sort((a, b) => a - b);

  const median = percentile(outcomes, 0.5);
  const floorOutcome = percentile(outcomes, 0.05);
  const ceilingOutcome = percentile(outcomes, 0.95);
  const average = outcomes.reduce((sum, value) => sum + value, 0) / outcomes.length;

  const cashCount = outcomes.filter((value) => value >= cashThreshold).length;
  const top10Count = outcomes.filter(
    (value) => value >= percentile(outcomes, 0.9),
  ).length;
  const top1Count = outcomes.filter(
    (value) => value >= percentile(outcomes, 0.99),
  ).length;

  const cashRate = (cashCount / simulationCount) * 100;
  const winRate = (top1Count / simulationCount) * 100;
  const top10Rate = (top10Count / simulationCount) * 100;

  const spread = ceilingOutcome - floorOutcome;
  const volatilityRating =
    spread > 45 ? "High" : spread > 30 ? "Moderate" : "Low";

  const highConfidenceCount = playerAnalysis.players.filter(
    (player) => player.confidenceTier === "high",
  ).length;

  const fieldResult = runGppFieldSimulation({
    playerAnalysis,
    lineupMean,
    variance,
    floor,
    ceiling,
    simulationCount,
    fieldSize,
    cashThreshold,
    seed: seed + 1,
  });

  return {
    simulationCount,
    medianProjection: Math.round(median * 10) / 10,
    floorProjection: Math.round(floorOutcome * 10) / 10,
    ceilingProjection: Math.round(ceilingOutcome * 10) / 10,
    averageProjection: Math.round(average * 10) / 10,
    winProbability: `${winRate.toFixed(1)}%`,
    cashProbability: `${Math.round(cashRate)}%`,
    top1PercentFinish: `${fieldResult.topOnePercentRate.toFixed(1)}%`,
    top10PercentFinish: `${top10Rate.toFixed(0)}%`,
    volatilityRating,
    fieldSize: fieldResult.fieldSize,
    fieldPercentile: fieldResult.fieldPercentile,
    topOnePercentRate: fieldResult.topOnePercentRate,
    cashRate: fieldResult.cashRate,
    insights: [
      `Median projection ${median.toFixed(1)} over ${simulationCount.toLocaleString()} simulations`,
      `${Math.round(cashRate)}% cash rate at ${cashThreshold}-point threshold`,
      `${fieldResult.fieldPercentile.toFixed(1)}th percentile vs ${fieldResult.fieldSize.toLocaleString()}-line GPP field`,
      `${fieldResult.topOnePercentRate.toFixed(1)}% top-1% finish rate against synthetic field`,
      `${volatilityRating} outcome volatility (${spread.toFixed(1)} pt spread)`,
      `${highConfidenceCount} high-confidence core players in portfolio`,
      variance === "high"
        ? "Tournament upside profile — wide outcome tails"
        : "Stable median projection suitable for cash consideration",
    ],
    version: "sim-2.0-gpp-field",
  };
}
