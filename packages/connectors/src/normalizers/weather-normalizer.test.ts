import { describe, expect, it } from "vitest";
import {
  normalizeWeatherExport,
  normalizeWeatherFeed,
} from "./weather-normalizer";

describe("weather-normalizer", () => {
  it("normalizes feed records into game merge payloads", () => {
    const games = normalizeWeatherFeed([
      {
        home: "buf",
        away: "kc",
        temperature: 38,
        windMph: 18,
        precipitationProbability: 20,
        isDome: false,
      },
    ]);

    expect(games).toEqual([
      {
        home: "BUF",
        away: "KC",
        temperature: 38,
        windMph: 18,
        precipitationProbability: 20,
        isDome: false,
      },
    ]);
  });

  it("extracts export records", () => {
    const records = normalizeWeatherExport({
      games: [{ home: "MIA", away: "NYJ", temperature: 82, isDome: false }],
    });

    expect(records).toHaveLength(1);
    expect(records[0]?.temperature).toBe(82);
  });
});
