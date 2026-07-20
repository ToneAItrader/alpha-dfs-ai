import { beforeEach, describe, expect, it } from "vitest";
import {
  createAgentOrchestrator,
  createConnectorManager,
  createEventBus,
  createEvidenceCache,
  createSourceRegistry,
} from "@alpha-dfs/adi-platform";
import { createNewsProvider, createSocialProvider } from "./registry";
import { sampleFetchContext } from "./providers/provider-test-helpers";

describe("ADI provider integration", () => {
  beforeEach(() => {
    delete process.env.ADI_PROVIDER_NEWS_ENABLED;
    delete process.env.ADI_PROVIDER_SOCIAL_ENABLED;
    delete process.env.ADI_PROVIDER_SPORTSBOOK_ENABLED;
    delete process.env.ADI_PROVIDER_CONSENSUS_ENABLED;
    delete process.env.ADI_PROVIDER_DFS_CONTENT_ENABLED;
    delete process.env.ADI_PROVIDER_BETTING_ENABLED;
    delete process.env.ADI_PROVIDER_HISTORICAL_LEARNING_ENABLED;
  });

  it("parallel fetch returns packages from all enabled providers", async () => {
    process.env.ADI_PROVIDER_NEWS_ENABLED = "true";
    process.env.ADI_PROVIDER_SOCIAL_ENABLED = "true";

    const registry = createSourceRegistry();
    const manager = createConnectorManager(registry);
    manager.register(createNewsProvider());
    manager.register(createSocialProvider());

    const packages = await manager.fetchAll(sampleFetchContext);
    expect(packages.length).toBeGreaterThan(0);

    const providerIds = new Set(packages.map((pkg) => pkg.metadata?.providerId));
    expect(providerIds.has("news")).toBe(true);
    expect(providerIds.has("social")).toBe(true);
  });

  it("INT-2: single provider failure degrades without aborting fetchAll", async () => {
    process.env.ADI_PROVIDER_NEWS_ENABLED = "true";
    process.env.ADI_PROVIDER_SOCIAL_ENABLED = "true";

    const registry = createSourceRegistry();
    const manager = createConnectorManager(registry);
    manager.register(createNewsProvider({ simulateFailure: true }));
    manager.register(createSocialProvider());

    const packages = await manager.fetchAll(sampleFetchContext);
    expect(packages.length).toBeGreaterThan(0);
    expect(packages.every((pkg) => pkg.metadata?.providerId === "social")).toBe(true);
  });

  it("INT-3: all providers fail returns empty packages without throwing", async () => {
    process.env.ADI_PROVIDER_NEWS_ENABLED = "true";
    process.env.ADI_PROVIDER_SOCIAL_ENABLED = "true";

    const registry = createSourceRegistry();
    const manager = createConnectorManager(registry);
    manager.register(createNewsProvider({ simulateFailure: true }));
    manager.register(createSocialProvider({ simulateFailure: true }));

    const packages = await manager.fetchAll(sampleFetchContext);
    expect(packages).toEqual([]);
  });

  it("orchestrator caches packages after fetch", async () => {
    process.env.ADI_PROVIDER_NEWS_ENABLED = "true";

    const eventBus = createEventBus();
    const registry = createSourceRegistry();
    const cache = createEvidenceCache();
    const manager = createConnectorManager(registry);
    manager.register(createNewsProvider());

    const orchestrator = createAgentOrchestrator({
      eventBus,
      registry,
      connectorManager: manager,
      evidenceCache: cache,
      fetchEnabled: true,
    });

    await orchestrator.onPipelineStarted(
      {
        runId: "run-int",
        platform: "draftkings",
        sport: "nfl",
        contest: "classic_salary_cap",
        slateLabel: "Test",
        slateId: "slate-int",
        startedAt: new Date().toISOString(),
      },
      "corr-int",
    );

    expect(cache.get("run-int")?.length).toBeGreaterThan(0);
  });
});
