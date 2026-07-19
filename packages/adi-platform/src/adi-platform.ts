import type { AnalysisRunContext, AdiNormalizedEvidenceBundle } from "@alpha-dfs/shared";
import { structuredLog } from "@alpha-dfs/observability";
import { createAgentOrchestrator } from "./agent-orchestrator";
import { isAdiPlatformEnabled } from "./adi-config";
import { createConnectorManager } from "./connector-manager";
import type { EvidenceProvider } from "./provider-contract";
import type { EvidenceFetchContext } from "./provider-contract";
import { createEventBus } from "./event-bus";
import { createEvidenceCache } from "./evidence-cache";
import { recordPlatformReady } from "./metrics";
import { createSourceRegistry } from "./source-registry";
import { scheduleLearningUpdate } from "./learning-agent";

export type AdiPlatform = {
  prepare(
    context: AnalysisRunContext,
    correlationId?: string,
    options?: { fetchContext?: EvidenceFetchContext },
  ): Promise<void>;
  complete(runId: string, success: boolean, durationMs: number): Promise<void>;
  getNormalizedEvidence(): AdiNormalizedEvidenceBundle | undefined;
  getCachedPackages(): import("@alpha-dfs/shared").AdiEvidencePackage[];
  shutdown(): Promise<void>;
};

export type AdiPlatformDeps = {
  enabled?: boolean;
  providers?: EvidenceProvider[];
  fusionEnabled?: boolean;
  fetchContext?: EvidenceFetchContext;
};

let defaultProviders: EvidenceProvider[] = [];

export function registerAdiEvidenceProviders(providers: EvidenceProvider[]): void {
  defaultProviders = providers;
  resetAdiPlatform();
}

export function createAdiPlatform(deps: AdiPlatformDeps = {}): AdiPlatform {
  const enabled = deps.enabled ?? isAdiPlatformEnabled();
  const providers = deps.providers ?? defaultProviders;
  const eventBus = createEventBus();
  const registry = createSourceRegistry();
  const cache = createEvidenceCache();
  const connectorManager = createConnectorManager(registry);

  for (const provider of providers) {
    connectorManager.register(provider);
  }

  const fetchEnabled = providers.length > 0;
  const orchestrator = createAgentOrchestrator({
    eventBus,
    registry,
    connectorManager,
    evidenceCache: cache,
    fetchEnabled,
    fusionEnabled: deps.fusionEnabled,
    fetchContext: deps.fetchContext,
  });

  let prepared = false;
  let activeRunId: string | undefined;
  let activeFetchContext: EvidenceFetchContext | undefined = deps.fetchContext;

  return {
    async prepare(context, correlationId = context.runId, options) {
      if (!enabled) {
        return;
      }

      prepared = true;
      activeRunId = context.runId;
      activeFetchContext = options?.fetchContext ?? deps.fetchContext;

      structuredLog("info", "adi", "adi.prepare", "ADI platform preparing", {
        runId: context.runId,
        slateId: context.slateId,
        providerCount: providers.length,
      });

      cache.clear(context.runId);
      await orchestrator.onPipelineStarted(context, correlationId, activeFetchContext);
      recordPlatformReady();
    },

    getNormalizedEvidence() {
      if (!enabled || !prepared || !activeRunId) {
        return undefined;
      }
      return cache.getBundle(activeRunId);
    },

    getCachedPackages() {
      if (!enabled || !activeRunId) {
        return [];
      }
      return cache.get(activeRunId) ?? [];
    },

    async complete(runId, success, durationMs) {
      if (!enabled || !prepared) {
        return;
      }
      await orchestrator.onPipelineCompleted(runId, success, durationMs);
      scheduleLearningUpdate({
        runId,
        success,
        bundle: cache.getBundle(runId),
      });
    },

    async shutdown() {
      if (!enabled) {
        return;
      }

      if (activeRunId) {
        cache.clear(activeRunId);
      }

      await orchestrator.shutdown();
      prepared = false;
      activeRunId = undefined;

      structuredLog("info", "adi", "adi.shutdown", "ADI platform shutdown complete");
    },
  };
}

let cachedPlatform: AdiPlatform | null = null;

export function getAdiPlatform(): AdiPlatform {
  if (!cachedPlatform) {
    cachedPlatform = createAdiPlatform();
  }
  return cachedPlatform;
}

export function resetAdiPlatform(): void {
  cachedPlatform = null;
}
