import type { AnalysisRunContext } from "@alpha-dfs/shared";
import type { ConnectorManager } from "./connector-manager";
import type { EventBus } from "./event-bus";
import type { EvidenceCache } from "./evidence-cache";
import type { SourceRegistry } from "./source-registry";

const DEFAULT_CACHE_TTL_SECONDS = 3600;

export type AgentOrchestrator = {
  onPipelineStarted(context: AnalysisRunContext, correlationId: string): Promise<void>;
  onPipelineCompleted(runId: string, success: boolean, durationMs: number): Promise<void>;
  shutdown(): Promise<void>;
};

export type AgentOrchestratorDeps = {
  eventBus: EventBus;
  registry: SourceRegistry;
  connectorManager: ConnectorManager;
  evidenceCache?: EvidenceCache;
  fetchEnabled?: boolean;
};

export function createAgentOrchestrator(deps: AgentOrchestratorDeps): AgentOrchestrator {
  const { eventBus, registry, connectorManager, evidenceCache, fetchEnabled = false } = deps;

  return {
    async onPipelineStarted(context, correlationId) {
      const slateId = context.slateId ?? "unknown";
      await eventBus.publish("pipeline.run.started", {
        schemaVersion: "1.0",
        runId: context.runId,
        slateId,
        correlationId,
        adiEnabled: true,
      });

      await eventBus.publish("adi.platform.ready", {
        schemaVersion: "1.0",
        runId: context.runId,
        slateId,
        providerCount: registry.listProviders().length,
      });

      if (!fetchEnabled) {
        return;
      }

      const providerIds = registry.listEnabledProviderIds();
      await eventBus.publish("adi.fetch.requested", {
        schemaVersion: "1.0",
        runId: context.runId,
        slateId,
        providerIds,
      });

      const packages = await connectorManager.fetchAll({
        runId: context.runId,
        slateId,
        players: [],
        games: [],
        correlationId,
      });

      evidenceCache?.set(context.runId, packages, DEFAULT_CACHE_TTL_SECONDS);

      for (const providerId of providerIds) {
        const providerPackages = packages.filter(
          (pkg) => pkg.metadata?.providerId === providerId,
        );
        const degraded = providerPackages.length === 0;
        await eventBus.publish("adi.evidence.received", {
          schemaVersion: "1.0",
          runId: context.runId,
          providerId,
          packageCount: providerPackages.length,
          itemCount: providerPackages.reduce((sum, pkg) => sum + pkg.items.length, 0),
          degraded,
        });

        if (degraded) {
          await eventBus.publish("adi.provider.degraded", {
            schemaVersion: "1.0",
            providerId,
            reason: "No evidence packages returned",
            retryable: true,
          });
        }
      }
    },

    async onPipelineCompleted(runId, success, durationMs) {
      await eventBus.publish("pipeline.run.completed", {
        schemaVersion: "1.0",
        runId,
        success,
        durationMs,
      });
    },

    async shutdown() {
      eventBus.clear();
    },
  };
}
