import { withTimeout } from "@alpha-dfs/observability";

export type ProviderPriority = "P0" | "P1" | "P2";

const RETRY_POLICY: Record<
  ProviderPriority,
  { maxAttempts: number; timeoutMs: number; linearBackoff: boolean }
> = {
  P0: { maxAttempts: 3, timeoutMs: 10_000, linearBackoff: false },
  P1: { maxAttempts: 2, timeoutMs: 8_000, linearBackoff: true },
  P2: { maxAttempts: 1, timeoutMs: 5_000, linearBackoff: false },
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withProviderRetry<T>(
  providerId: string,
  priority: ProviderPriority,
  operation: () => Promise<T>,
): Promise<T> {
  const policy = RETRY_POLICY[priority];
  let lastError: unknown;

  for (let attempt = 1; attempt <= policy.maxAttempts; attempt += 1) {
    try {
      return await withTimeout(`adi.provider.${providerId}`, policy.timeoutMs, operation);
    } catch (error) {
      lastError = error;
      if (attempt < policy.maxAttempts) {
        const delayMs = policy.linearBackoff ? 250 * attempt : 250 * 2 ** (attempt - 1);
        await sleep(delayMs);
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

export function getRetryPolicy(priority: ProviderPriority) {
  return RETRY_POLICY[priority];
}
