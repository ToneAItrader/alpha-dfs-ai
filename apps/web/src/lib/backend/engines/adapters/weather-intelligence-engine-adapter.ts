import {
  engineFailure,
  engineSuccess,
  runIntelligenceAgent,
  type AgentInput,
  type IntelligenceAgent,
  type WeatherIntelligenceEngine,
  type WeatherIntelligenceOutput,
} from "@alpha-dfs/shared";
import { getSlateMarketCache } from "@/lib/backend/slate-market-cache";
import { getSlateDataService } from "@/lib/backend/data/slate-data-service";
import { computeWeatherIntelligence } from "../weather-intelligence/compute-weather-intelligence";

/** Weather Intelligence Agent — implements common intelligence agent interface. */
export function createWeatherIntelligenceAgent(): IntelligenceAgent<
  WeatherIntelligenceOutput,
  "weather_intelligence"
> {
  return {
    agentId: "weather_intelligence",
    async execute(input: AgentInput) {
      return runIntelligenceAgent("weather_intelligence", async () => {
        const slateId = input.context.slateId;
        if (!slateId) {
          return engineFailure(
            "MISSING_SLATE",
            "Slate ID required for weather intelligence",
            "weather_intelligence",
          );
        }

        try {
          const games = getSlateMarketCache(slateId) ?? [];
          const players = await getSlateDataService().slateRepository.getSlatePlayers(slateId);
          const totalGames = new Set(
            players.map((player) => `${player.team}-${player.opponent}`),
          ).size;

          const data = computeWeatherIntelligence(games, totalGames || games.length);
          const confidenceValue = Math.min(1, data.weatherCoverage / 100);

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
              rationale: `Weather intelligence confidence from ${data.weatherCoverage}% game coverage`,
            },
            evidence: {
              summary: data.assessment,
              items: data.factors.map((factor, index) => ({
                id: `weather-factor-${index + 1}`,
                category: "weather_intelligence",
                summary: factor,
              })),
            },
          });
        } catch (error) {
          return engineFailure(
            "WEATHER_INTELLIGENCE_FAILED",
            error instanceof Error ? error.message : "Weather intelligence failed",
            "weather_intelligence",
          );
        }
      });
    },
  };
}

/** Pipeline engine adapter — bridges agent output to engine registry contract. */
export function createWeatherIntelligenceEngineAdapter(): WeatherIntelligenceEngine {
  const agent = createWeatherIntelligenceAgent();

  return {
    engineId: "weather_intelligence",
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
