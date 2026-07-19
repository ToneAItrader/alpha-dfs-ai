import { beforeEach, describe, expect, it, vi } from "vitest";
import type { EvidenceFetchContext, EvidenceProvider } from "@alpha-dfs/adi-platform";
import { createAnalysisRunContext } from "@alpha-dfs/shared";
import {
  createAllEvidenceProviders,
  registerEvidenceProviders,
} from "@alpha-dfs/adi-providers";
import { resetAdiConfigCache } from "./adi-config";
import { createAdiPlatform, registerAdiEvidenceProviders, resetAdiPlatform } from "./adi-platform";
import { createAgentOrchestrator } from "./agent-orchestrator";
import { createConnectorManager } from "./connector-manager";
import { createEventBus } from "./event-bus";
import { createEvidenceCache } from "./evidence-cache";
import { runFusionAgent } from "./fusion-agent";
import { createSourceRegistry } from "./source-registry";

const sampleFetchContext: EvidenceFetchContext = {
  runId: "run-fusion-int",
  slateId: "slate-fusion-int",
  players: [
    { slatePlayerId: "sp-1", name: "Patrick Mahomes", team: "KC" },
    { slatePlayerId: "sp-2", name: "Travis Kelce", team: "KC" },
  ],
  games: [{ gameKey: "KC-BUF", homeTeam: "KC", awayTeam: "BUF" }],
};

describe("ADI fusion integration (M6)", () => {
  beforeEach(() => {
    resetAdiConfigCache();
    resetAdiPlatform();
    delete process.env.ADI_PLATFORM_ENABLED;
    delete process.env.ADI_FUSION_ENABLED;
    delete process.env.ADI_PROVIDER_NEWS_ENABLED;
    delete process.env.ADI_PROVIDER_SOCIAL_ENABLED;
    delete process.env.ADI_PROVIDER_SPORTSBOOK_ENABLED;
    delete process.env.ADI_PROVIDER_CONSENSUS_ENABLED;
    delete process.env.ADI_PROVIDER_DFS_CONTENT_ENABLED;
    delete process.env.ADI_PROVIDER_BETTING_ENABLED;
    delete process.env.ADI_PROVIDER_HISTORICAL_LEARNING_ENABLED;
  });

  it("fuses packages from three enabled providers (fetch + fusion agent)", async () => {
    process.env.ADI_PROVIDER_NEWS_ENABLED = "true";
    process.env.ADI_PROVIDER_SOCIAL_ENABLED = "true";
    process.env.ADI_PROVIDER_SPORTSBOOK_ENABLED = "true";

    const registry = createSourceRegistry();
    const manager = createConnectorManager(registry);
    registerEvidenceProviders(manager);

    const packages = await manager.fetchAll(sampleFetchContext);
    expect(packages.length).toBeGreaterThan(0);

    const { bundle, conflictCount } = runFusionAgent({
      runId: sampleFetchContext.runId,
      slateId: sampleFetchContext.slateId,
      packages,
      registry,
    });

    expect(bundle.version).toBe("fusion-1.0");
    expect(bundle.subjects.length).toBeGreaterThan(0);
    expect(conflictCount).toBeGreaterThanOrEqual(0);
  });

  it("orchestrator emits fusion.completed when fetch returns packages", async () => {
    process.env.ADI_PROVIDER_NEWS_ENABLED = "true";

    const eventBus = createEventBus();
    const fusionCompleted = vi.fn();
    eventBus.subscribe("adi.fusion.completed", fusionCompleted);

    const registry = createSourceRegistry();
    const cache = createEvidenceCache();
    const newsProvider = createAllEvidenceProviders().find((provider) => provider.providerId === "news");
    expect(newsProvider).toBeDefined();

    const stubManager = {
      fetchAll: async (_context: EvidenceFetchContext) => {
        const result = await newsProvider!.fetch(sampleFetchContext);
        return result.ok ? result.packages : [];
      },
      register: () => undefined,
      getHealth: () => [],
    };

    const orchestrator = createAgentOrchestrator({
      eventBus,
      registry,
      connectorManager: stubManager,
      evidenceCache: cache,
      fetchEnabled: true,
      fusionEnabled: true,
    });

    await orchestrator.onPipelineStarted(
      createAnalysisRunContext("run-fusion-orch", { slateId: "slate-fusion-orch" }),
      "corr-fusion-orch",
    );

    const bundle = cache.getBundle("run-fusion-orch");
    expect(bundle?.subjects.length).toBeGreaterThan(0);
    expect(fusionCompleted).toHaveBeenCalledOnce();
  });

  it("platform returns normalized bundle after prepare with registered providers", async () => {
    process.env.ADI_PROVIDER_NEWS_ENABLED = "true";
    process.env.ADI_PROVIDER_SOCIAL_ENABLED = "true";
    process.env.ADI_PROVIDER_SPORTSBOOK_ENABLED = "true";

    const withSampleContext = (provider: EvidenceProvider): EvidenceProvider => ({
      ...provider,
      fetch: async () => provider.fetch(sampleFetchContext),
    });

    registerAdiEvidenceProviders(createAllEvidenceProviders().map(withSampleContext));
    const platform = createAdiPlatform({ enabled: true, fusionEnabled: true });

    await platform.prepare(
      createAnalysisRunContext("run-platform-fusion", { slateId: "slate-platform-fusion" }),
    );

    const bundle = platform.getNormalizedEvidence();
    expect(bundle).toBeDefined();
    expect(bundle?.runId).toBe("run-platform-fusion");
    expect(bundle?.subjects.length).toBeGreaterThan(0);

    await platform.shutdown();
  });
});
