import path from "node:path";

export const monorepoRoot = path.resolve(process.cwd(), "../..");
export const e2eDatabasePath = path.join(monorepoRoot, "packages/database/prisma/e2e-test.db");
export const e2ePort = 3001;

export function getE2eEnv(): Record<string, string> {
  return {
    ALPHA_DFS_TEST_DB: "true",
    DATABASE_URL: `file:${e2eDatabasePath}`,
    CONNECTOR_MODE: "seed",
    DRAFTKINGS_EXPORT_PATH: path.join(
      monorepoRoot,
      "packages/connectors/fixtures/draftkings-classic-export.json",
    ),
    PROJECTION_EXPORT_PATH: path.join(
      monorepoRoot,
      "packages/connectors/fixtures/projection-export.json",
    ),
    INJURY_EXPORT_PATH: path.join(
      monorepoRoot,
      "packages/connectors/fixtures/injury-export.json",
    ),
    VEGAS_ODDS_EXPORT_PATH: path.join(
      monorepoRoot,
      "packages/connectors/fixtures/vegas-odds-export.json",
    ),
    WEATHER_EXPORT_PATH: path.join(
      monorepoRoot,
      "packages/connectors/fixtures/weather-export.json",
    ),
    NODE_ENV: "development",
  };
}

/** Eight analysis panels per ADR-008 (excludes Settings). */
export const analysisPanelRoutes = [
  { href: "/dashboard", label: "Dashboard", heading: "Dashboard" },
  { href: "/slate-intelligence", label: "Slate Intelligence", heading: "Slate Intelligence" },
  { href: "/portfolio-readiness", label: "Portfolio Readiness", heading: "Portfolio Readiness" },
  { href: "/recommended-portfolio", label: "Recommended Portfolio", heading: "Recommended Portfolio" },
  { href: "/player-evidence", label: "Player Evidence", heading: "Player Evidence" },
  { href: "/portfolio-health", label: "Portfolio Health", heading: "Portfolio Health" },
  { href: "/simulation", label: "Simulation Results", heading: "Simulation Results" },
  { href: "/confidence", label: "Confidence", heading: "Confidence Indicators" },
] as const;
