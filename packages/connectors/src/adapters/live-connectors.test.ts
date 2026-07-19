import path from "path";
import { fileURLToPath } from "url";
import { afterEach, describe, expect, it } from "vitest";
import { createDraftKingsLiveConnector } from "../adapters/draftkings-live-connector";
import { createProjectionLiveConnector } from "../adapters/projection-live-connector";
import { loadDraftKingsCredentials } from "../auth/provider-credentials";

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../fixtures");

describe("live provider connectors", () => {
  const previous = { ...process.env };

  afterEach(() => {
    process.env = { ...previous };
  });

  it("loads DraftKings export via file credentials", async () => {
    process.env.DRAFTKINGS_EXPORT_PATH = path.join(fixturesDir, "draftkings-classic-export.json");
    delete process.env.DRAFTKINGS_API_URL;
    delete process.env.DRAFTKINGS_API_KEY;

    expect(loadDraftKingsCredentials().mode).toBe("file");

    const result = await createDraftKingsLiveConnector().fetch({
      requestedAt: new Date().toISOString(),
    });

    expect(result.ok).toBe(true);
    expect(result.recordCount).toBe(15);
    expect(result.payload?.players?.[0]?.name).toBe("Player One");
  });

  it("loads projection export via file credentials", async () => {
    process.env.PROJECTION_EXPORT_PATH = path.join(fixturesDir, "projection-export.json");
    delete process.env.PROJECTION_API_URL;
    delete process.env.PROJECTION_API_KEY;

    const result = await createProjectionLiveConnector().fetch({
      requestedAt: new Date().toISOString(),
    });

    expect(result.ok).toBe(true);
    expect(result.recordCount).toBe(15);
    expect(result.payload?.players?.[0]?.projection).toBeGreaterThan(0);
  });

  it("throws when DraftKings credentials missing", async () => {
    delete process.env.DRAFTKINGS_EXPORT_PATH;
    delete process.env.DRAFTKINGS_API_URL;
    delete process.env.DRAFTKINGS_API_KEY;

    await expect(
      createDraftKingsLiveConnector().fetch({ requestedAt: new Date().toISOString() }),
    ).rejects.toThrow(/not configured/i);
  });
});
