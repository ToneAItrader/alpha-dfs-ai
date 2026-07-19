/** ADR-020 fusion constants. */

export const DEDUPE_WINDOW_MS = 5 * 60 * 1000;
export const CONFLICT_CONFIDENCE_BAND = 0.1;
export const CONFLICT_CONFIDENCE_PENALTY = 0.2;
export const DEFAULT_TOP_N_PER_TYPE = 3;
export const FRESHNESS_HALF_LIFE_MS = 60 * 60 * 1000;
export const FUSION_VERSION = "fusion-1.0" as const;
