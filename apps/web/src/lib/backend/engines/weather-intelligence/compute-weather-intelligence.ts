import type { WeatherIntelligenceOutput } from "@alpha-dfs/shared";

export type WeatherGameSnapshot = {
  home: string;
  away: string;
  temperature?: number;
  windMph?: number;
  precipitationProbability?: number;
  isDome?: boolean;
};

function gameHasWeatherData(game: WeatherGameSnapshot): boolean {
  return (
    game.temperature !== undefined ||
    game.windMph !== undefined ||
    game.precipitationProbability !== undefined ||
    game.isDome !== undefined
  );
}

function assessGameImpact(game: WeatherGameSnapshot): {
  impact: "low" | "moderate" | "high";
  summary: string;
} {
  if (game.isDome) {
    return { impact: "low", summary: "Indoor/dome — weather neutralized" };
  }

  const wind = game.windMph ?? 0;
  const precip = game.precipitationProbability ?? 0;
  const temp = game.temperature ?? 65;

  if (wind >= 20 || precip >= 60 || temp <= 32) {
    const factors = [
      wind >= 20 ? `${wind} mph wind` : null,
      precip >= 60 ? `${precip}% precip` : null,
      temp <= 32 ? `${temp}°F` : null,
    ].filter(Boolean);
    return {
      impact: "high",
      summary: `High-impact outdoor conditions (${factors.join(", ")})`,
    };
  }

  if (wind >= 15 || precip >= 40 || temp <= 40) {
    return {
      impact: "moderate",
      summary: "Moderate weather influence on passing and kicking",
    };
  }

  return { impact: "low", summary: "Favorable outdoor conditions" };
}

/** Pure weather intelligence computation — unit-testable without I/O. */
export function computeWeatherIntelligence(
  games: WeatherGameSnapshot[],
  totalGames: number,
): WeatherIntelligenceOutput {
  const weatherGames = games.filter(gameHasWeatherData);
  const outdoorGames = weatherGames.filter((game) => game.isDome !== true);
  const domeGames = weatherGames.filter((game) => game.isDome === true);
  const windGames = outdoorGames.filter((game) => (game.windMph ?? 0) >= 15).length;
  const rainGames = outdoorGames.filter((game) => (game.precipitationProbability ?? 0) >= 40).length;
  const snowGames = outdoorGames.filter(
    (game) => (game.temperature ?? 65) <= 32 && (game.precipitationProbability ?? 0) >= 30,
  ).length;

  const temperatures = outdoorGames
    .map((game) => game.temperature)
    .filter((value): value is number => value !== undefined);
  const averageTemperature =
    temperatures.length === 0
      ? null
      : Math.round((temperatures.reduce((sum, value) => sum + value, 0) / temperatures.length) * 10) / 10;
  const maxWindMph =
    outdoorGames.length === 0
      ? null
      : Math.max(...outdoorGames.map((game) => game.windMph ?? 0));

  const gameImpacts = weatherGames.map((game, index) => {
    const assessment = assessGameImpact(game);
    return {
      id: `weather-game-${index + 1}`,
      matchup: `${game.away} @ ${game.home}`,
      impact: assessment.impact,
      summary: assessment.summary,
    };
  });

  const highImpactGames = gameImpacts.filter((game) => game.impact === "high").length;
  const weatherCoverage =
    totalGames === 0 ? 0 : Math.round((weatherGames.length / totalGames) * 100);

  const severity: WeatherIntelligenceOutput["severity"] =
    highImpactGames >= 2
      ? "high"
      : highImpactGames >= 1 || windGames >= 2 || rainGames >= 2
        ? "moderate"
        : "low";

  const factors = [
    `${weatherGames.length} of ${totalGames} slate games with weather data`,
    `${outdoorGames.length} outdoor games tracked`,
    `${windGames} games with elevated wind (15+ mph)`,
    `${rainGames} games with meaningful precipitation risk (40%+)`,
    `${snowGames} games with potential snow conditions`,
    `Weather data coverage at ${weatherCoverage}%`,
  ];

  const assessment =
    severity === "high"
      ? "Elevated weather volatility — prioritize floor-friendly skill players and monitor late forecasts."
      : severity === "moderate"
        ? "Select outdoor games require weather monitoring before lock."
        : "Weather impact manageable — standard slate construction applies.";

  return {
    windGames,
    rainGames,
    snowGames,
    outdoorGames: outdoorGames.length,
    domeGames: domeGames.length,
    maxWindMph,
    averageTemperature,
    highImpactGames,
    weatherCoverage,
    severity,
    assessment,
    factors,
    gameImpacts,
  };
}
