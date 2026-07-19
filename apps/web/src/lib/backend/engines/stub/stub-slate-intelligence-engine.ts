import {
  engineSuccess,
  type SlateIntelligenceEngine,
  type SlateIntelligenceOutput,
} from "@alpha-dfs/shared";
import { computeSlateIntelligence } from "../slate-intelligence/compute-slate-intelligence";

export function createStubSlateIntelligenceEngine(): SlateIntelligenceEngine {
  return {
    engineId: "slate_intelligence",
    async analyze(context) {
      const readiness = context.priorOutputs?.slate;
      const data: SlateIntelligenceOutput = computeSlateIntelligence({
        slateLabel: context.slateLabel,
        slateName: context.slateLabel,
        week: 1,
        readiness: readiness ?? {
          slateLabel: context.slateLabel,
          dataCompleteness: 88,
          injuryDataStatus: "available",
          weatherDataStatus: "available",
          marketDataStatus: "partial",
          expertConsensusStatus: "available",
          checklistComplete: true,
        },
        gameCount: 12,
        teamCount: 24,
        totalPlayers: 180,
      });

      return engineSuccess(data);
    },
  };
}
