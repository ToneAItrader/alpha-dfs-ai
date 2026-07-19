import {
  createConnectorRegistryForMode,
  type ConnectorRegistry,
} from "@alpha-dfs/connectors";
import { getPrismaClient, seedDatabase } from "@alpha-dfs/database";
import { incrementCounter, structuredLog } from "@alpha-dfs/observability";
import { operationalLog } from "@/lib/backend/operations/operational-logger";
import {
  createRefreshService,
  type RefreshResult,
  type RefreshService,
  type SourceResultRecord,
} from "@/lib/backend/operations/refresh-service";

export type { RefreshResult, RefreshService, SourceResultRecord };

export type RefreshAndEnsureReadyResult = {
  slateId: string;
  slateLabel: string;
  degraded: boolean;
  sourceResults: SourceResultRecord[];
};

export type DataOperationsService = {
  connectorRegistry: ConnectorRegistry;
  refreshService: RefreshService;
  refreshAndEnsureReady(runId?: string): Promise<RefreshAndEnsureReadyResult>;
};

function allowSeedFallback(): boolean {
  return (
    process.env.CONNECTOR_MODE === "seed" ||
    process.env.ALPHA_DFS_ALLOW_SEED_FALLBACK === "true" ||
    process.env.ALPHA_DFS_TEST_DB === "true"
  );
}

let cachedOperations: DataOperationsService | null = null;

export function getDataOperationsService(
  connectorRegistry?: ConnectorRegistry,
): DataOperationsService {
  if (!cachedOperations) {
    const client = getPrismaClient();
    const registry = connectorRegistry ?? createConnectorRegistryForMode();
    const refreshService = createRefreshService(client, registry);

    cachedOperations = {
      connectorRegistry: registry,
      refreshService,
      async refreshAndEnsureReady(runId?: string) {
        operationalLog("info", "refresh.start", "Starting slate data refresh", { runId });

        const refreshResult: RefreshResult = await refreshService.refresh({ runId });
        if (!refreshResult.ok) {
          if (allowSeedFallback()) {
            incrementCounter("refresh.run.fallback_seed");
            structuredLog(
              "warn",
              "refresh",
              "refresh.fallback_seed",
              "Connector refresh failed; applying seed fallback",
              { errors: refreshResult.errors },
            );
            operationalLog("warn", "refresh.failed", "Connector refresh failed; attempting seed fallback", {
              errors: refreshResult.errors,
            });

            await seedDatabase(client);
            const validation = await refreshService.ingestionService.validateActiveSlate();
            if (!validation.valid) {
              operationalLog("error", "refresh.fallback_failed", validation.errors.join("; "));
              throw new Error(refreshResult.errors.join("; "));
            }
          } else {
            structuredLog(
              "error",
              "refresh",
              "refresh.failed",
              "Connector refresh failed; seed fallback disabled",
              { errors: refreshResult.errors },
            );
            throw new Error(refreshResult.errors.join("; "));
          }
        } else if (refreshResult.degraded) {
          operationalLog("warn", "refresh.degraded", "Refresh completed with degraded P1 sources");
        } else {
          operationalLog("info", "refresh.complete", "Slate data refresh complete", {
            slateId: refreshResult.slateId,
          });
        }

        const validation = await refreshService.ingestionService.validateActiveSlate();
        if (!validation.valid) {
          throw new Error(validation.errors.join("; "));
        }

        const slate = await refreshService.slateRepository.getActiveSlate();
        if (!slate) {
          throw new Error("Active slate unavailable after refresh");
        }

        return {
          slateId: slate.id,
          slateLabel: slate.name,
          degraded: refreshResult.ok ? refreshResult.degraded : false,
          sourceResults: refreshResult.sourceResults,
        };
      },
    };
  }

  return cachedOperations;
}

export function resetDataOperationsService(): void {
  cachedOperations = null;
}
