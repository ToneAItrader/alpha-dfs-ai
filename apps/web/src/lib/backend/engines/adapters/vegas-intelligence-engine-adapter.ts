import {
  engineFailure,
  engineSuccess,
  runIntelligenceAgent,
  type AgentInput,
  type IntelligenceAgent,
  type VegasIntelligenceEngine,
  type VegasIntelligenceOutput,
} from "@alpha-dfs/shared";
import { getSlateMarketCache } from "@/lib/backend/slate-market-cache";
import { getSlateDataService } from "@/lib/backend/data/slate-data-service";
import { computeVegasIntelligence } from "../vegas-intelligence/compute-vegas-intelligence";

/** Vegas Intelligence Agent — implements common intelligence agent interface. */
export function createVegasIntelligenceAgent(): IntelligenceAgent<
  VegasIntelligenceOutput,
  "vegas_intelligence"
> {
  return {
    agentId: "vegas_intelligence",
    async execute(input: AgentInput) {
      return runIntelligenceAgent("vegas_intelligence", async () => {
        const slateId = input.context.slateId;
        if (!slateId) {
          return engineFailure(
            "MISSING_SLATE",
            "Slate ID required for Vegas intelligence",
            "vegas_intelligence",
          );
        }

        try {
          const games = getSlateMarketCache(slateId) ?? [];
          const players = await getSlateDataService().slateRepository.getSlatePlayers(slateId);
          const totalGames = new Set(
            players.map((player) => `${player.team}-${player.opponent}`),
          ).size;

          const data = computeVegasIntelligence(games, totalGames || games.length);
          const confidenceValue = Math.min(1, data.marketCoverage / 100);

          return engineSuccess({
            data,
            confidence: {
              value: confidenceValue,
              grade:
                confidenceValue >= 0.85
                  ? "A"
                  : confidenceValue >= 0.7
                    ? "B"
                    : confidenceValue >= 0.55
                      ? "C"
                      : "D",
              rationale: `Vegas intelligence confidence from ${data.marketCoverage}% game coverage`,
            },
            evidence: {
              summary: data.assessment,
              items: data.factors.map((factor, index) => ({
                id: `vegas-factor-${index + 1}`,
                category: "vegas_intelligence",
                summary: factor,
              })),
            },
          });
        } catch (error) {
          return engineFailure(
            "VEGAS_INTELLIGENCE_FAILED",
            error instanceof Error ? error.message : "Vegas intelligence failed",
            "vegas_intelligence",
          );
        }
      });
    },
  };
}

/** Pipeline engine adapter — bridges agent output to engine registry contract. */
export function createVegasIntelligenceEngineAdapter(): VegasIntelligenceEngine {
  const agent = createVegasIntelligenceAgent();

  return {
    engineId: "vegas_intelligence",
    async analyze(context) {
      const result = await agent.execute({
        context,
        priorOutputs: context.priorOutputs,
      });

      if (!result.ok) {
        return result;
      }

      return engineSuccess(result.data.data);
    },
  };
}
