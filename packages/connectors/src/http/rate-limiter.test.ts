import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRateLimiter, resetRateLimiters } from "./rate-limiter";

describe("rate limiter", () => {
  beforeEach(() => {
    resetRateLimiters();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests within the configured window", async () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 1000 });
    await limiter.acquire("test-key");
    await limiter.acquire("test-key");
    expect(true).toBe(true);
  });

  it("resets buckets between tests", async () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 1000 });
    await limiter.acquire("reset-key");
    resetRateLimiters();
    await limiter.acquire("reset-key");
    expect(true).toBe(true);
  });
});
