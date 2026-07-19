import path from "path";
import { fileURLToPath } from "url";
import { afterEach, describe, expect, it } from "vitest";
import { createVegasOddsLiveConnector } from "../adapters/vegas-odds-live-connector";
import { createConnectorRegistryForMode } from "../create-connector-registry";
import { fetchConnectorsOnly } from "../fetch-connectors-only";

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../fixtures");

describe("vegas-odds-feed connector", () => {
  const previous = { ...process.env };

  afterEach(() => {
    process.env = { ...previous };
  });

  it("loads Vegas odds export via file credentials", async () => {
    process.env.VEGAS_ODDS_EXPORT_PATH = path.join(fixturesDir, "vegas-odds-export.json");

    const result = await createVegasOddsLiveConnector().fetch({
      requestedAt: new Date().toISOString(),
    });

    expect(result.ok).toBe(true);
    expect(result.recordCount).toBe(5);
    expect(result.payload?.games?.[0]?.total).toBe(48.5);
  });

  it("merges Vegas fields into slate games without overwriting unrelated data", async () => {
    process.env.VEGAS_ODDS_EXPORT_PATH = path.join(fixturesDir, "vegas-odds-export.json");

    const registry = createConnectorRegistryForMode("seed");
    const result = await fetchConnectorsOnly(registry);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const game = result.mergedPayload.games.find((entry) => entry.home === "BUF");
    expect(game?.total).toBe(48.5);
    expect(game?.spread).toBe(-2.5);
    expect(game?.lineMovement).toBe(1.0);

    const marketPlayer = result.mergedPayload.players.find((entry) => entry.team === "BUF");
    expect(marketPlayer?.domains.market).toBe(true);
  });
});
