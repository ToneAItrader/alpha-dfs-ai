import {
  resetCircuits,
  resetMetrics,
  resetOperationalConfig,
  resetStructuredLogs,
  resetTraces,
} from "@alpha-dfs/observability";
import { resetRateLimiters } from "@alpha-dfs/connectors";
import { clearSlateMarketCache } from "@/lib/backend/slate-market-cache";
import { resetSlateDataService } from "@/lib/backend/data/slate-data-service";
import { resetBackendDependencies } from "@/lib/backend/dependency-container";
import {
  stopTelemetryExport,
} from "@/lib/backend/operations/telemetry-export-lifecycle";
import { resetDataOperationsService } from "@/lib/backend/operations/data-operations-service";
import { resetOperationalLogs } from "@/lib/backend/operations/operational-logger";

/** Reset in-process operational state between tests. */
export function resetOperationalStateForTest(): void {
  resetMetrics();
  resetTraces();
  resetStructuredLogs();
  resetOperationalLogs();
  resetCircuits();
  resetOperationalConfig();
  resetRateLimiters();
}

/** Reset cached backend services between tests. */
export function resetTestServiceCaches(): void {
  void stopTelemetryExport();
  clearSlateMarketCache();
  resetSlateDataService();
  resetDataOperationsService();
  resetBackendDependencies();
}

/** @deprecated Use resetTestServiceCaches() */
export function resetTestDatabaseFlag(): void {
  resetTestServiceCaches();
}
