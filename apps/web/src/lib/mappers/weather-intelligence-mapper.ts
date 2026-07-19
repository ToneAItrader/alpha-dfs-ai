import type { WeatherIntelligenceResponseDto } from "@/types/dto/analysis-responses.dto";
import type { SlateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

/** Maps Weather Intelligence DTO → Slate Intelligence weather section. */
export function mapWeatherIntelligenceSummary(
  dto: WeatherIntelligenceResponseDto | undefined,
): {
  weather: SlateIntelligencePlaceholderData["weather"];
  isLive: boolean;
} {
  if (dto?.windGames === undefined) {
    return {
      weather: slateIntelligencePlaceholderData.weather,
      isLive: false,
    };
  }

  const wind =
    dto.maxWindMph !== null && dto.maxWindMph !== undefined
      ? `${dto.windGames ?? 0} games · max ${dto.maxWindMph} mph`
      : `${dto.windGames ?? 0} games`;
  const rain = `${dto.rainGames ?? 0} games · 40%+ precip risk`;
  const snow = `${dto.snowGames ?? 0} games · snow risk`;
  const temperature =
    dto.averageTemperature !== null && dto.averageTemperature !== undefined
      ? `Avg ${dto.averageTemperature}°F outdoor`
      : "Outdoor average unavailable";

  return {
    isLive: true,
    weather: {
      wind,
      rain,
      snow,
      temperature,
    },
  };
}
