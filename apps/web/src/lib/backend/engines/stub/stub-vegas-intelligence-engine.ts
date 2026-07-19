import {
  engineSuccess,
  type VegasIntelligenceEngine,
  type VegasIntelligenceOutput,
} from "@alpha-dfs/shared";
import { computeVegasIntelligence } from "../vegas-intelligence/compute-vegas-intelligence";

export function createStubVegasIntelligenceEngine(): VegasIntelligenceEngine {
  return {
    engineId: "vegas_intelligence",
    async analyze() {
      const data: VegasIntelligenceOutput = computeVegasIntelligence(
        [
          {
            home: "BUF",
            away: "KC",
            spread: -2.5,
            total: 48.5,
            impliedHomeTotal: 25.5,
            impliedAwayTotal: 23.0,
            lineMovement: 1.0,
          },
          {
            home: "DAL",
            away: "PHI",
            spread: 3.0,
            total: 51.0,
            impliedHomeTotal: 24.0,
            impliedAwayTotal: 27.0,
            lineMovement: -0.5,
          },
        ],
        5,
      );

      return engineSuccess(data);
    },
  };
}
