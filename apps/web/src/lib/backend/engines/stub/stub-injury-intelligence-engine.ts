import {
  engineSuccess,
  type InjuryIntelligenceEngine,
  type InjuryIntelligenceOutput,
} from "@alpha-dfs/shared";
import { computeInjuryIntelligence } from "../injury-intelligence/compute-injury-intelligence";

export function createStubInjuryIntelligenceEngine(): InjuryIntelligenceEngine {
  return {
    engineId: "injury_intelligence",
    async analyze() {
      const data: InjuryIntelligenceOutput = computeInjuryIntelligence([
        {
          name: "Player Three",
          position: "WR",
          team: "MIA",
          salary: 8000,
          injuryStatus: "questionable",
          practiceStatus: "limited",
          gameStatus: "probable",
          domains: { injury: true },
        },
        {
          name: "Player Seven",
          position: "RB",
          team: "PHI",
          salary: 6800,
          injuryStatus: "doubtful",
          practiceStatus: "dnp",
          gameStatus: "questionable",
          domains: { injury: true },
        },
      ]);

      return engineSuccess(data);
    },
  };
}
