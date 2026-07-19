import { evaluateSlateConfidence } from "@alpha-dfs/prediction-confidence";
import {
  engineFailure,
  engineSuccess,
  type ConfidenceEngine,
} from "@alpha-dfs/shared";

/** Adapter — PCE package implementing ConfidenceEngine port. */
export function createPredictionConfidenceEngineAdapter(): ConfidenceEngine {
  return {
    engineId: "confidence",
    async evaluate(context) {
      const playerAnalysis = context.priorOutputs?.playerAnalysis;
      const slate = context.priorOutputs?.slate;

      if (!playerAnalysis) {
        return engineFailure(
          "MISSING_UPSTREAM",
          "Player analysis output required for confidence evaluation",
          "confidence",
        );
      }

      const dataCompleteness = slate?.dataCompleteness ?? 85;

      return engineSuccess(
        evaluateSlateConfidence({ playerAnalysis, dataCompleteness }),
      );
    },
  };
}
