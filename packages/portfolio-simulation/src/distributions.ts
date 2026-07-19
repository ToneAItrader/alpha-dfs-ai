/** Seeded pseudo-random for reproducible Monte Carlo in tests. */
export function createSeededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/** Box-Muller transform for normal samples. */
export function sampleNormal(random: () => number, mean: number, stdDev: number): number {
  const u1 = random();
  const u2 = random();
  const z = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2);
  return mean + z * stdDev;
}

/** Truncated normal sample bounded by floor and ceiling. */
export function sampleTruncatedNormal(
  random: () => number,
  mean: number,
  stdDev: number,
  floor: number,
  ceiling: number,
): number {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const value = sampleNormal(random, mean, stdDev);
    if (value >= floor && value <= ceiling) return value;
  }
  return Math.min(ceiling, Math.max(floor, mean));
}

export function stdDevFromVarianceRating(
  mean: number,
  variance: "low" | "medium" | "high",
): number {
  const spreadFactor = variance === "low" ? 0.08 : variance === "medium" ? 0.14 : 0.22;
  return mean * spreadFactor;
}

export function percentile(sorted: number[], p: number): number {
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}
