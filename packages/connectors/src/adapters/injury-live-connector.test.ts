import path from "path";
import { fileURLToPath } from "url";
import { afterEach, describe, expect, it } from "vitest";
import { createInjuryLiveConnector } from "../adapters/injury-live-connector";
import { createConnectorRegistryForMode } from "../create-connector-registry";
import { fetchConnectorsOnly } from "../fetch-connectors-only";

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../fixtures");

describe("nfl-injury-feed connector", () => {
  const previous = { ...process.env };

  afterEach(() => {
    process.env = { ...previous };
  });

  it("loads injury export via file credentials", async () => {
    process.env.INJURY_EXPORT_PATH = path.join(fixturesDir, "injury-export.json");

    const result = await createInjuryLiveConnector().fetch({
      requestedAt: new Date().toISOString(),
    });

    expect(result.ok).toBe(true);
    expect(result.recordCount).toBe(4);
    expect(result.payload?.players?.[0]?.injuryStatus).toBe("questionable");
  });

  it("merges injury fields into slate payload", async () => {
    process.env.INJURY_EXPORT_PATH = path.join(fixturesDir, "injury-export.json");

    const registry = createConnectorRegistryForMode("seed");
    const result = await fetchConnectorsOnly(registry);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const player = result.mergedPayload.players.find((entry) => entry.externalId === "p3");
    expect(player?.injuryStatus).toBe("questionable");
    expect(player?.practiceStatus).toBe("limited");
    expect(player?.domains.injury).toBe(true);
  });
});
