import path from "path";
import { fileURLToPath } from "url";
import { afterEach, describe, expect, it } from "vitest";
import { createWeatherLiveConnector } from "../adapters/weather-live-connector";
import {
  createDraftKingsSlateConnector,
  createFailingConnector,
  createProjectionFeedConnector,
} from "../adapters/seed-connectors";
import { createConnectorRegistry, createConnectorRegistryForMode } from "../create-connector-registry";
import { fetchConnectorsOnly } from "../fetch-connectors-only";

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../fixtures");

describe("weather-feed connector", () => {
  const previous = { ...process.env };

  afterEach(() => {
    process.env = { ...previous };
  });

  it("loads weather export via file credentials", async () => {
    process.env.WEATHER_EXPORT_PATH = path.join(fixturesDir, "weather-export.json");

    const result = await createWeatherLiveConnector().fetch({
      requestedAt: new Date().toISOString(),
    });

    expect(result.ok).toBe(true);
    expect(result.priority).toBe("P2");
    expect(result.recordCount).toBe(5);
    expect(result.payload?.games?.[0]?.windMph).toBe(18);
  });

  it("merges weather fields into slate games without overwriting market data", async () => {
    process.env.WEATHER_EXPORT_PATH = path.join(fixturesDir, "weather-export.json");

    const registry = createConnectorRegistryForMode("seed");
    const result = await fetchConnectorsOnly(registry);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const game = result.mergedPayload.games.find((entry) => entry.home === "BUF");
    expect(game?.temperature).toBe(38);
    expect(game?.windMph).toBe(18);
    expect(game?.total).toBe(48.5);

    const weatherPlayer = result.mergedPayload.players.find((entry) => entry.team === "BUF");
    expect(weatherPlayer?.domains.weather).toBe(true);
  });

  it("does not set degraded when P2 weather connector fails", async () => {
    const registry = createConnectorRegistry([
      createDraftKingsSlateConnector(),
      createProjectionFeedConnector(),
      createFailingConnector("weather-feed", "P2"),
    ]);
    const result = await fetchConnectorsOnly(registry);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.degraded).toBe(false);
    }
  });
});
