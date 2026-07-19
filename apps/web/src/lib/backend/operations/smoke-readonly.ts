import {
  createConnectorRegistryForMode,
  fetchConnectorsOnly,
  type ConnectorFetchResult,
} from "@alpha-dfs/connectors";
import { getBackendDependencies } from "@/lib/backend/dependency-container";

export type ReadonlySmokeStepResult = {
  ok: boolean;
  engineIds: string[];
  sourceResults: ConnectorFetchResult[];
  degraded?: boolean;
  playerCount?: number;
  errors?: string[];
};

/** Read-only smoke validation — connectors + engines only; zero DB writes (ADR-005). */
export async function runReadonlySmokeSteps(runId = "smoke-readonly"): Promise<ReadonlySmokeStepResult> {
  const { engines } = getBackendDependencies();
  const engineIds = [
    engines.slateAnalysis.engineId,
    engines.slateIntelligence.engineId,
    engines.injuryIntelligence.engineId,
    engines.vegasIntelligence.engineId,
    engines.weatherIntelligence.engineId,
    engines.ownershipIntelligence.engineId,
    engines.projectionCalibration.engineId,
    engines.playerAnalysis.engineId,
    engines.confidence.engineId,
    engines.portfolio.engineId,
    engines.simulation.engineId,
  ];

  const registry = createConnectorRegistryForMode();
  const fetchResult = await fetchConnectorsOnly(registry, {
    runId,
    requestedAt: new Date().toISOString(),
  });

  if (!fetchResult.ok) {
    return {
      ok: false,
      engineIds,
      sourceResults: fetchResult.sourceResults,
      errors: fetchResult.errors,
    };
  }

  return {
    ok: true,
    engineIds,
    sourceResults: fetchResult.sourceResults,
    degraded: fetchResult.degraded,
    playerCount: fetchResult.mergedPayload.players.length,
  };
}
