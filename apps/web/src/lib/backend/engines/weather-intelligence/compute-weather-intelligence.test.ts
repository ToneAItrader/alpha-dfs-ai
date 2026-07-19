import { describe, expect, it } from "vitest";
import { computeWeatherIntelligence } from "./compute-weather-intelligence";

describe("computeWeatherIntelligence", () => {
  it("aggregates outdoor weather impact and coverage", () => {
    const output = computeWeatherIntelligence(
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
        {
          home: "DAL",
          away: "PHI",
          temperature: 72,
          windMph: 5,
          precipitationProbability: 5,
          isDome: true,
        },
      ],
      5,
    );

    expect(output.windGames).toBe(1);
    expect(output.rainGames).toBe(1);
    expect(output.domeGames).toBe(1);
    expect(output.weatherCoverage).toBe(60);
    expect(output.gameImpacts.length).toBe(3);
    expect(output.factors.length).toBeGreaterThan(0);
  });
});
