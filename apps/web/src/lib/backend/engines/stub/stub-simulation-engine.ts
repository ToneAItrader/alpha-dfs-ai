import {
  engineSuccess,
  type SimulationEngine,
  type SimulationEngineOutput,
} from "@alpha-dfs/shared";

export function createStubSimulationEngine(): SimulationEngine {
  return {
    engineId: "simulation",
    async simulate() {
      const data: SimulationEngineOutput = {
        simulationCount: 10000,
        medianProjection: 142.8,
        floorProjection: 118.5,
        ceilingProjection: 162.3,
        averageProjection: 141.2,
        winProbability: "0.8%",
        cashProbability: "62%",
        top1PercentFinish: "4.2%",
        top10PercentFinish: "18%",
        volatilityRating: "Moderate",
        fieldSize: 10000,
        fieldPercentile: 72.5,
        topOnePercentRate: 4.2,
        cashRate: 62,
        insights: [
          "High ceiling portfolio",
          "Stable median projection",
          "Tournament upside available",
          "Moderate volatility",
          "Strong leverage opportunities",
        ],
        version: "sim-1.0-stub",
      };
      return engineSuccess(data);
    },
  };
}
