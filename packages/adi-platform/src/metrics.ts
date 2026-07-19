import { incrementCounter, recordHistogram } from "@alpha-dfs/observability";

export function recordProviderFetchDuration(providerId: string, durationMs: number): void {
  recordHistogram("adi.provider.fetch.duration_ms", durationMs, { provider_id: providerId });
}

export function recordProviderFailure(providerId: string, reason?: string): void {
  incrementCounter("adi.provider.failure.total", {
    provider_id: providerId,
    ...(reason ? { reason } : {}),
  });
}

export function recordPlatformReady(): void {
  incrementCounter("adi.platform.ready.total");
}

export function recordFusionItems(inCount: number, outCount: number): void {
  incrementCounter("adi.fusion.items.in", {}, inCount);
  incrementCounter("adi.fusion.items.out", {}, outCount);
}

export function recordFusionConflict(): void {
  incrementCounter("adi.fusion.conflicts.total");
}

export function recordEvidenceFreshness(ageMs: number): void {
  recordHistogram("adi.evidence.freshness.age_ms", ageMs);
}
