import type { AnalysisRunContext } from "@alpha-dfs/shared";
import type { EvidenceFetchContext } from "./provider-contract";
import { isAdiFusionEnabled } from "./adi-config";
import type { ConnectorManager } from "./connector-manager";
import type { EventBus } from "./event-bus";
import type { EvidenceCache } from "./evidence-cache";
import { runFusionAgent } from "./fusion-agent";
import type { SourceRegistry } from "./source-registry";

const DEFAULT_CACHE_TTL_SECONDS = 3600;

export type AgentOrchestrator = {
  onPipelineStarted(
    context: AnalysisRunContext,
    correlationId: string,
    overrideFetchContext?: EvidenceFetchContext,
  ): Promise<void>;
  onPipelineCompleted(runId: string, success: boolean, durationMs: number): Promise<void>;
  shutdown(): Promise<void>;
};

export type AgentOrchestratorDeps = {
  eventBus: EventBus;
  registry: SourceRegistry;
  connectorManager: ConnectorManager;
  evidenceCache?: EvidenceCache;
  fetchEnabled?: boolean;
  fusionEnabled?: boolean;
  fetchContext?: EvidenceFetchContext;
};

export function createAgentOrchestrator(deps: AgentOrchestratorDeps): AgentOrchestrator {
  const {
    eventBus,
    registry,
    connectorManager,
    evidenceCache,
    fetchEnabled = false,
    fusionEnabled = isAdiFusionEnabled(),
    fetchContext,
  } = deps;

  return {
    async onPipelineStarted(context, correlationId, overrideFetchContext) {
      const slateId = context.slateId ?? "unknown";
      const resolvedFetchContext = overrideFetchContext ?? fetchContext;
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
        players: resolvedFetchContext?.players ?? [],
        games: resolvedFetchContext?.games ?? [],
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

      if (fusionEnabled && packages.length > 0) {
        await eventBus.publish("adi.fusion.requested", {
          schemaVersion: "1.0",
          runId: context.runId,
          slateId,
          packageCount: packages.length,
        });

        try {
          const { bundle, conflictCount } = runFusionAgent({
            runId: context.runId,
            slateId,
            packages,
            registry,
          });
          evidenceCache?.setBundle(context.runId, bundle, DEFAULT_CACHE_TTL_SECONDS);

          await eventBus.publish("adi.fusion.completed", {
            schemaVersion: "1.0",
            runId: context.runId,
            subjectCount: bundle.subjects.length,
            conflictCount,
            platformConfidence: bundle.platformConfidence,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Fusion failed";
          evidenceCache?.setBundle(
            context.runId,
            {
              bundleId: `bundle-${context.runId}`,
              runId: context.runId,
              slateId,
              fusedAt: new Date().toISOString(),
              version: "fusion-1.0",
              subjects: [],
              platformConfidence: 0,
              degradationNotes: [`Fusion agent error: ${message}`],
            },
            DEFAULT_CACHE_TTL_SECONDS,
          );
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
