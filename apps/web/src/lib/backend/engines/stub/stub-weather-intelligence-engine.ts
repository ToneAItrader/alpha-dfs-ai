import {
  engineSuccess,
  type WeatherIntelligenceEngine,
  type WeatherIntelligenceOutput,
} from "@alpha-dfs/shared";
import { computeWeatherIntelligence } from "../weather-intelligence/compute-weather-intelligence";

export function createStubWeatherIntelligenceEngine(): WeatherIntelligenceEngine {
  return {
    engineId: "weather_intelligence",
    async analyze() {
      const data: WeatherIntelligenceOutput = computeWeatherIntelligence(
        [
          {
            home: "BUF",
            away: "KC",
            temperature: 38,
            windMph: 18,
            precipitationProbability: 20,
            isDome: false,
          },
          {
            home: "MIA",
            away: "NYJ",
            temperature: 82,
            windMph: 12,
            precipitationProbability: 65,
            isDome: false,
          },
        ],
        5,
      );

      return engineSuccess(data);
    },
  };
}
