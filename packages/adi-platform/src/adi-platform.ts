import type { AnalysisRunContext, AdiNormalizedEvidenceBundle } from "@alpha-dfs/shared";
import { structuredLog } from "@alpha-dfs/observability";
import { createAgentOrchestrator } from "./agent-orchestrator";
import { isAdiPlatformEnabled } from "./adi-config";
import { createConnectorManagerStub } from "./connector-manager";
import { createEventBus } from "./event-bus";
import { createEvidenceCache } from "./evidence-cache";
import { recordPlatformReady } from "./metrics";
import { createSourceRegistry } from "./source-registry";

export type AdiPlatform = {
  prepare(context: AnalysisRunContext, correlationId?: string): Promise<void>;
  complete(runId: string, success: boolean, durationMs: number): Promise<void>;
  getNormalizedEvidence(): AdiNormalizedEvidenceBundle | undefined;
  shutdown(): Promise<void>;
};

export type AdiPlatformDeps = {
  enabled?: boolean;
};

export function createAdiPlatform(deps: AdiPlatformDeps = {}): AdiPlatform {
  const enabled = deps.enabled ?? isAdiPlatformEnabled();
  const eventBus = createEventBus();
  const registry = createSourceRegistry();
  const cache = createEvidenceCache();
  const connectorManager = createConnectorManagerStub();
  const orchestrator = createAgentOrchestrator({
    eventBus,
    registry,
    connectorManager,
    fetchEnabled: false,
  });

  let prepared = false;
  let activeRunId: string | undefined;

  return {
    async prepare(context, correlationId = context.runId) {
      if (!enabled) {
        return;
      }

      prepared = true;
      activeRunId = context.runId;

      structuredLog("info", "adi", "adi.prepare", "ADI platform preparing", {
        runId: context.runId,
        slateId: context.slateId,
      });

      await orchestrator.onPipelineStarted(context, correlationId);
      recordPlatformReady();
      cache.clear(context.runId);
    },

    getNormalizedEvidence() {
      if (!enabled || !prepared) {
        return undefined;
      }
      return undefined;
    },

    async complete(runId, success, durationMs) {
      if (!enabled || !prepared) {
        return;
      }
      await orchestrator.onPipelineCompleted(runId, success, durationMs);
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
