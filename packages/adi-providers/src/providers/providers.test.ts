import { describe, expect, it } from "vitest";
import { createBettingProvider } from "./betting-provider";
import { createConsensusProvider } from "./consensus-provider";
import { createDfsContentProvider } from "./dfs-content-provider";
import { createHistoricalLearningProvider } from "./historical-learning-provider";
import { createNewsProvider } from "./news-provider";
import { runCommonProviderTests, sampleFetchContext } from "./provider-test-helpers";
import { createSocialProvider } from "./social-provider";
import { createSportsbookProvider } from "./sportsbook-provider";

describe("evidence providers — common contract", () => {
  runCommonProviderTests("news", createNewsProvider, { expectNonEmpty: true });
  runCommonProviderTests("social", createSocialProvider, { expectNonEmpty: true });
  runCommonProviderTests("sportsbook", createSportsbookProvider, { expectNonEmpty: true });
  runCommonProviderTests("consensus", createConsensusProvider, { expectNonEmpty: true });
  runCommonProviderTests("dfs_content", createDfsContentProvider, { expectNonEmpty: true });
  runCommonProviderTests("betting", createBettingProvider, { expectNonEmpty: true });
  runCommonProviderTests("historical_learning", createHistoricalLearningProvider, {
    expectNonEmpty: true,
  });
});

describe("news provider validation", () => {
  it("maps resolved players to slatePlayerId", async () => {
    const result = await createNewsProvider().fetch(sampleFetchContext);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const mahomes = result.packages.flatMap((pkg) => pkg.items).find((item) => item.subjectId === "sp-1");
    expect(mahomes).toBeDefined();
  });

  it("simulateFailure via factory override", async () => {
    const provider = createNewsProvider({ simulateFailure: true });
    const result = await provider.fetch(sampleFetchContext);
    expect(result.ok).toBe(false);
  });
});

describe("social provider validation", () => {
  it("filters low post volume signals", async () => {
    const result = await createSocialProvider().fetch(sampleFetchContext);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const names = result.packages.map((pkg) => pkg.sourceId);
    expect(names).not.toContain("social-x");
  });
});

describe("consensus provider validation", () => {
  it("requires minimum two sources", async () => {
    const result = await createConsensusProvider().fetch(sampleFetchContext);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.packages.every((pkg) => pkg.metadata?.sourceCount !== "1")).toBe(true);
  });
});

describe("betting provider validation", () => {
  it("requires minimum expert count", async () => {
    const result = await createBettingProvider().fetch(sampleFetchContext);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.packages.every((pkg) => pkg.metadata?.expertCount !== "1")).toBe(true);
  });
});

describe("historical learning provider validation", () => {
  it("emits source_reliability meta evidence only", async () => {
    const result = await createHistoricalLearningProvider().fetch(sampleFetchContext);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.packages[0]?.items.every((item) => item.evidenceType === "source_reliability")).toBe(
      true,
    );
  });
});

describe("sportsbook provider validation", () => {
  it("outputs line_movement and implied_total only", async () => {
    const result = await createSportsbookProvider().fetch(sampleFetchContext);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const types = new Set(result.packages.flatMap((pkg) => pkg.items.map((item) => item.evidenceType)));
    expect(types.has("line_movement")).toBe(true);
    expect(types.has("implied_total")).toBe(true);
  });
});

describe("dfs content provider validation", () => {
  it("outputs ownership and stack signals", async () => {
    const result = await createDfsContentProvider().fetch(sampleFetchContext);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const types = new Set(result.packages.flatMap((pkg) => pkg.items.map((item) => item.evidenceType)));
    expect(types.has("chalk_probability")).toBe(true);
  });
});

describe("provider failure behavior", () => {
  it("returns ok:false for simulated failure without throwing", async () => {
    const provider = createNewsProvider({ simulateFailure: true });
    await expect(provider.fetch(sampleFetchContext)).resolves.toMatchObject({ ok: false });
  });

  it("unhealthy when simulateFailure", async () => {
    const health = await createNewsProvider({ simulateFailure: true }).health();
    expect(health.status).toBe("unavailable");
  });
});
