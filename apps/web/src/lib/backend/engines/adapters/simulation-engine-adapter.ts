import { runPortfolioSimulation } from "@alpha-dfs/portfolio-simulation";
import {
  engineFailure,
  engineSuccess,
  type SimulationEngine,
} from "@alpha-dfs/shared";

/** Adapter — Portfolio Simulation package implementing SimulationEngine port. */
export function createSimulationEngineAdapter(): SimulationEngine {
  return {
    engineId: "simulation",
    async simulate(context) {
      const playerAnalysis = context.priorOutputs?.playerAnalysis;
      const portfolio = context.priorOutputs?.portfolio;
      const confidence = context.priorOutputs?.confidence;

      if (!playerAnalysis || !portfolio || !confidence) {
        return engineFailure(
          "MISSING_UPSTREAM",
          "Player analysis, portfolio, and confidence outputs required for simulation",
          "simulation",
        );
      }

      return engineSuccess(
        runPortfolioSimulation({
          playerAnalysis,
          portfolio,
          confidence,
          simulationCount: Number(process.env.SIMULATION_COUNT ?? 10000),
          fieldSize: Number(process.env.SIMULATION_FIELD_SIZE ?? 10000),
        }),
      );
    },
  };
}
