import { describe, expect, it } from "vitest";
import { mapWeatherIntelligenceSummary } from "./weather-intelligence-mapper";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

describe("weather-intelligence-mapper", () => {
  it("falls back to placeholders when DTO is absent", () => {
    const viewModel = mapWeatherIntelligenceSummary(undefined);

    expect(viewModel.isLive).toBe(false);
    expect(viewModel.weather).toEqual(slateIntelligencePlaceholderData.weather);
  });

  it("maps live weather summary from DTO", () => {
    const viewModel = mapWeatherIntelligenceSummary({
      windGames: 2,
      rainGames: 1,
      snowGames: 0,
      maxWindMph: 22,
      averageTemperature: 52.5,
    });

    expect(viewModel.isLive).toBe(true);
    expect(viewModel.weather.wind).toBe("2 games · max 22 mph");
    expect(viewModel.weather.temperature).toBe("Avg 52.5°F outdoor");
  });
});
