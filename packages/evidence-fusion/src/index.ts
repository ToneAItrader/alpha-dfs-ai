export { FUSION_VERSION, DEDUPE_WINDOW_MS, DEFAULT_TOP_N_PER_TYPE } from "./constants";
export { fuseEvidence, getFusedSubject } from "./fuse-evidence";
export {
  applyInjuryAdiOverlay,
  applyVegasAdiOverlay,
  type InjuryPlayerAdiInput,
  type VegasGameAdiInput,
} from "./engine-integration";
export {
  buildOwnershipAdiHints,
  buildPortfolioAdiBoosts,
  buildProjectionAdiAdjustments,
  buildSimulationAdiContext,
  emptyAdiMeta,
  mergeAdiMeta,
  type AdiEngineOverlayMeta,
  type OwnershipAdiHint,
  type PortfolioAdiBoost,
  type ProjectionAdiAdjustment,
  type SimulationAdiContext,
} from "./engine-overlays";
export type {
  FuseEvidenceInput,
  FuseEvidenceResult,
  FusionContext,
  FusionMetrics,
  FusionSourceRegistry,
} from "./types";
