import {
  classifyFailure,
  getOperationalConfig,
  incrementCounter,
  recordHistogram,
  structuredLog,
} from "@alpha-dfs/observability";
import { draftKingsRateLimiter, projectionRateLimiter, createRateLimiter } from "./rate-limiter";

export type ProviderHttpOptions = {
  providerId: string;
  url: string;
  apiKey?: string;
  timeoutMs?: number;
};

const limiterForProvider = {
  "draftkings-slate": draftKingsRateLimiter,
  "projection-feed": projectionRateLimiter,
} as const;

const defaultRateLimiter = createRateLimiter({
  maxRequests: 60,
  windowMs: 60_000,
});

export async function providerHttpGet<T>(options: ProviderHttpOptions): Promise<T> {
  const knownLimiter =
    limiterForProvider[options.providerId as keyof typeof limiterForProvider];
  if (!knownLimiter) {
    structuredLog(
      "warn",
      "connector",
      "provider.http.unknown_provider",
      `Unknown providerId "${options.providerId}" — using default rate limiter`,
      { providerId: options.providerId },
    );
  }
  const limiter = knownLimiter ?? defaultRateLimiter;

  await limiter.acquire(options.providerId);

  const timeoutMs = options.timeoutMs ?? getOperationalConfig().providerHttpTimeoutMs;
  incrementCounter("provider.http.total", { provider_id: options.providerId });
  const started = Date.now();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (options.apiKey) {
      headers.Authorization = `Bearer ${options.apiKey}`;
    }

    const response = await fetch(options.url, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`${options.providerId} HTTP ${response.status}: ${response.statusText}`);
    }

    const durationMs = Date.now() - started;
    recordHistogram("provider.http.duration_ms", durationMs, {
      provider_id: options.providerId,
      status: "ok",
    });
    incrementCounter("provider.http.success", { provider_id: options.providerId });

    return (await response.json()) as T;
  } catch (error) {
    const durationMs = Date.now() - started;
    recordHistogram("provider.http.duration_ms", durationMs, {
      provider_id: options.providerId,
      status: "error",
    });
    incrementCounter("provider.http.failure", { provider_id: options.providerId });
    structuredLog("warn", "connector", "provider.http.error", `${options.providerId} HTTP failed`, {
      providerId: options.providerId,
      failureClass: classifyFailure(error),
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
