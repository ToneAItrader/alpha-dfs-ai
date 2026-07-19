import type { AnalysisBundleResponseDto } from "@/types/dto/analysis-responses.dto";

const globalStore = globalThis as typeof globalThis & {
  __alphaDfsAnalysisCache?: AnalysisBundleResponseDto | null;
};

export function getCachedAnalysisBundle(): AnalysisBundleResponseDto | null {
  return globalStore.__alphaDfsAnalysisCache ?? null;
}

export function setCachedAnalysisBundle(bundle: AnalysisBundleResponseDto): void {
  globalStore.__alphaDfsAnalysisCache = bundle;
}

export function clearCachedAnalysisBundle(): void {
  globalStore.__alphaDfsAnalysisCache = null;
}
