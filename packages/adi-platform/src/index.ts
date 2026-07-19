export { isAdiPlatformEnabled, isProviderEnabled, resetAdiConfigCache, getKnownProviderIds, providerEnvFlagName } from "./adi-config";
export {
  createAdiPlatform,
  getAdiPlatform,
  registerAdiEvidenceProviders,
  resetAdiPlatform,
  type AdiPlatform,
  type AdiPlatformDeps,
} from "./adi-platform";
export { createAgentOrchestrator, type AgentOrchestrator, type AgentOrchestratorDeps } from "./agent-orchestrator";
export {
  createConnectorManager,
  createConnectorManagerStub,
  type ConnectorManager,
} from "./connector-manager";
export { createEventBus, type EventBus } from "./event-bus";
export { createEvidenceCache, type EvidenceCache } from "./evidence-cache";
export {
  recordEvidenceFreshness,
  recordFusionConflict,
  recordFusionItems,
  recordPlatformReady,
  recordProviderFailure,
  recordProviderFetchDuration,
} from "./metrics";
export {
  type EvidenceFetchContext,
  type EvidenceFetchResult,
  type EvidenceProvider,
  type ProviderDescriptor,
  type ProviderError,
} from "./provider-contract";
export { createSourceRegistry, type SourceRegistry } from "./source-registry";
export type {
  AdiEventHandler,
  AdiEventName,
  AdiEventPayloadMap,
  EvidenceDomain,
  ProviderHealth,
} from "./types";

export type {
  AdiConflictRecord,
  AdiEvidenceItem,
  AdiEvidencePackage,
  AdiEvidenceSubjectType,
  AdiEvidenceType,
  AdiNormalizedEvidence,
  AdiNormalizedEvidenceBundle,
} from "@alpha-dfs/shared";
