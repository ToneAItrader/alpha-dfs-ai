import {
  engineSuccess,
  type SlateAnalysisEngine,
  type SlateAnalysisOutput,
} from "@alpha-dfs/shared";

export function createStubSlateAnalysisEngine(): SlateAnalysisEngine {
  return {
    engineId: "slate_analysis",
    async analyze(context) {
      const data: SlateAnalysisOutput = {
        slateLabel: context.slateLabel,
        dataCompleteness: 92,
        injuryDataStatus: "available",
        weatherDataStatus: "available",
        marketDataStatus: "partial",
        expertConsensusStatus: "available",
        checklistComplete: true,
      };
      return engineSuccess(data);
    },
  };
}
