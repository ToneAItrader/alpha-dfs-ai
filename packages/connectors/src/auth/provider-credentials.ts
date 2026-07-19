import { readFile } from "fs/promises";

export type DraftKingsCredentialMode = "file" | "api" | "none";
export type ProjectionCredentialMode = "file" | "api" | "none";

export type DraftKingsCredentials =
  | { mode: "file"; exportPath: string }
  | { mode: "api"; apiUrl: string; apiKey: string }
  | { mode: "none" };

export type ProjectionCredentials =
  | { mode: "file"; exportPath: string }
  | { mode: "api"; apiUrl: string; apiKey: string }
  | { mode: "none" };

export type InjuryCredentials =
  | { mode: "file"; exportPath: string }
  | { mode: "api"; apiUrl: string; apiKey: string }
  | { mode: "none" };

export type ProviderCredentialStatus = {
  draftkings: { mode: DraftKingsCredentialMode; configured: boolean };
  projection: { mode: ProjectionCredentialMode; configured: boolean };
  injury: { mode: InjuryCredentialMode; configured: boolean };
  vegasOdds: { mode: VegasOddsCredentialMode; configured: boolean };
  weather: { mode: WeatherCredentialMode; configured: boolean };
};

export type InjuryCredentialMode = InjuryCredentials["mode"];

export type VegasOddsCredentials =
  | { mode: "file"; exportPath: string }
  | { mode: "api"; apiUrl: string; apiKey: string }
  | { mode: "none" };

export type VegasOddsCredentialMode = VegasOddsCredentials["mode"];

export type WeatherCredentials =
  | { mode: "file"; exportPath: string }
  | { mode: "api"; apiUrl: string; apiKey: string }
  | { mode: "none" };

export type WeatherCredentialMode = WeatherCredentials["mode"];

function trim(value: string | undefined): string | undefined {
  const next = value?.trim();
  return next ? next : undefined;
}

export function loadDraftKingsCredentials(): DraftKingsCredentials {
  const exportPath = trim(process.env.DRAFTKINGS_EXPORT_PATH);
  if (exportPath) {
    return { mode: "file", exportPath };
  }

  const apiUrl = trim(process.env.DRAFTKINGS_API_URL);
  const apiKey = trim(process.env.DRAFTKINGS_API_KEY);
  if (apiUrl && apiKey) {
    return { mode: "api", apiUrl, apiKey };
  }

  return { mode: "none" };
}

export function loadProjectionCredentials(): ProjectionCredentials {
  const exportPath = trim(process.env.PROJECTION_EXPORT_PATH);
  if (exportPath) {
    return { mode: "file", exportPath };
  }

  const apiUrl = trim(process.env.PROJECTION_API_URL);
  const apiKey = trim(process.env.PROJECTION_API_KEY);
  if (apiUrl && apiKey) {
    return { mode: "api", apiUrl, apiKey };
  }

  return { mode: "none" };
}

export function loadInjuryCredentials(): InjuryCredentials {
  const exportPath = trim(process.env.INJURY_EXPORT_PATH);
  if (exportPath) {
    return { mode: "file", exportPath };
  }

  const apiUrl = trim(process.env.INJURY_API_URL);
  const apiKey = trim(process.env.INJURY_API_KEY);
  if (apiUrl && apiKey) {
    return { mode: "api", apiUrl, apiKey };
  }

  return { mode: "none" };
}

export function loadVegasOddsCredentials(): VegasOddsCredentials {
  const exportPath = trim(process.env.VEGAS_ODDS_EXPORT_PATH);
  if (exportPath) {
    return { mode: "file", exportPath };
  }

  const apiUrl = trim(process.env.VEGAS_ODDS_API_URL);
  const apiKey = trim(process.env.VEGAS_ODDS_API_KEY);
  if (apiUrl && apiKey) {
    return { mode: "api", apiUrl, apiKey };
  }

  return { mode: "none" };
}

export function loadWeatherCredentials(): WeatherCredentials {
  const exportPath = trim(process.env.WEATHER_EXPORT_PATH);
  if (exportPath) {
    return { mode: "file", exportPath };
  }

  const apiUrl = trim(process.env.WEATHER_API_URL);
  const apiKey = trim(process.env.WEATHER_API_KEY);
  if (apiUrl && apiKey) {
    return { mode: "api", apiUrl, apiKey };
  }

  return { mode: "none" };
}

export function getProviderCredentialStatus(): ProviderCredentialStatus {
  const draftkings = loadDraftKingsCredentials();
  const projection = loadProjectionCredentials();
  const injury = loadInjuryCredentials();
  const vegasOdds = loadVegasOddsCredentials();
  const weather = loadWeatherCredentials();

  return {
    draftkings: {
      mode: draftkings.mode,
      configured: draftkings.mode !== "none",
    },
    projection: {
      mode: projection.mode,
      configured: projection.mode !== "none",
    },
    injury: {
      mode: injury.mode,
      configured: injury.mode !== "none",
    },
    vegasOdds: {
      mode: vegasOdds.mode,
      configured: vegasOdds.mode !== "none",
    },
    weather: {
      mode: weather.mode,
      configured: weather.mode !== "none",
    },
  };
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}
