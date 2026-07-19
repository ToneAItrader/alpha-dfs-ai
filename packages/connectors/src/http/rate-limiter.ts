type RateLimitConfig = {
  maxRequests: number;
  windowMs: number;
};

type Bucket = {
  timestamps: number[];
};

const buckets = new Map<string, Bucket>();

export function createRateLimiter(config: RateLimitConfig) {
  return {
    async acquire(key: string): Promise<void> {
      const now = Date.now();
      const bucket = buckets.get(key) ?? { timestamps: [] };
      bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < config.windowMs);

      if (bucket.timestamps.length >= config.maxRequests) {
        const waitMs = config.windowMs - (now - bucket.timestamps[0]!);
        await new Promise((resolve) => setTimeout(resolve, Math.max(waitMs, 50)));
        return this.acquire(key);
      }

      bucket.timestamps.push(now);
      buckets.set(key, bucket);
    },
  };
}

export const draftKingsRateLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 60_000,
});

export const projectionRateLimiter = createRateLimiter({
  maxRequests: 30,
  windowMs: 60_000,
});

export function resetRateLimiters(): void {
  buckets.clear();
}
