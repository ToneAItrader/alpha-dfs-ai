export { FUSION_VERSION, DEDUPE_WINDOW_MS, DEFAULT_TOP_N_PER_TYPE } from "./constants";
export { fuseEvidence, getFusedSubject } from "./fuse-evidence";
export type {
  FuseEvidenceInput,
  FuseEvidenceResult,
  FusionContext,
  FusionMetrics,
  FusionSourceRegistry,
} from "./types";
