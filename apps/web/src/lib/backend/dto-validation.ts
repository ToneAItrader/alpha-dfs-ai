import type { AnalysisBundleResponseDto } from "@/types/dto/analysis-responses.dto";

const REQUIRED_BUNDLE_KEYS: (keyof AnalysisBundleResponseDto)[] = [
  "pipeline",
  "confidence",
  "playerEvidence",
  "portfolioHealth",
  "simulation",
  "recommendedPortfolio",
  "portfolioReadiness",
];

/** Lightweight DTO contract validation — ensures mapper inputs remain stable. */
export function validateAnalysisBundleDto(
  bundle: AnalysisBundleResponseDto,
): { valid: true } | { valid: false; errors: string[] } {
  const errors: string[] = [];

  for (const key of REQUIRED_BUNDLE_KEYS) {
    if (!(key in bundle) || bundle[key] === undefined) {
      errors.push(`Missing required bundle key: ${key}`);
    }
  }

  if (!["idle", "analyzing", "complete", "failed"].includes(bundle.pipeline.status)) {
    errors.push(`Invalid pipeline status: ${bundle.pipeline.status}`);
  }

  if (bundle.playerEvidence.players.length === 0) {
    errors.push("playerEvidence.players must not be empty");
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

export const DTO_CONTRACT_VERSION = "analysis-bundle-v1";
