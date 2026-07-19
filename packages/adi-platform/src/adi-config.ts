const KNOWN_PROVIDERS = [
  "news",
  "social",
  "sportsbook",
  "consensus",
  "dfs_content",
  "betting",
  "historical_learning",
] as const;

export type KnownProviderId = (typeof KNOWN_PROVIDERS)[number];

function readBooleanEnv(name: string, defaultValue: boolean): boolean {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return value === "1" || value.toLowerCase() === "true";
}

let cachedAdiEnabled: boolean | null = null;

/** ADI platform master switch — default false (V2.1 behavior preserved). */
export function isAdiPlatformEnabled(): boolean {
  if (cachedAdiEnabled === null) {
    cachedAdiEnabled = readBooleanEnv("ADI_PLATFORM_ENABLED", false);
  }
  return cachedAdiEnabled;
}

export function resetAdiConfigCache(): void {
  cachedAdiEnabled = null;
}

export function isProviderEnabled(providerId: string): boolean {
  const normalized = providerId.toUpperCase().replace(/[^A-Z0-9]/g, "_");
  return readBooleanEnv(`ADI_PROVIDER_${normalized}_ENABLED`, false);
}

export function getKnownProviderIds(): readonly KnownProviderId[] {
  return KNOWN_PROVIDERS;
}

export function providerEnvFlagName(providerId: string): string {
  const normalized = providerId.toUpperCase().replace(/[^A-Z0-9]/g, "_");
  return `ADI_PROVIDER_${normalized}_ENABLED`;
}
