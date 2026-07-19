import { getOperationalConfig } from "./operational-config";

type HistogramStats = {
  count: number;
  sum: number;
  min: number;
  max: number;
  last: number;
};

const counters = new Map<string, number>();
const histograms = new Map<string, HistogramStats>();
const counterOrder: string[] = [];
const histogramOrder: string[] = [];

function enforceMapLimit(map: Map<string, unknown>, order: string[], limit: number): void {
  while (order.length > limit) {
    const oldest = order.shift();
    if (oldest) {
      map.delete(oldest);
    }
  }
}

function touchKey(order: string[], key: string): void {
  const index = order.indexOf(key);
  if (index >= 0) {
    order.splice(index, 1);
  }
  order.push(key);
}

function metricKey(name: string, labels?: Record<string, string>): string {
  if (!labels || Object.keys(labels).length === 0) return name;
  const parts = Object.entries(labels)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`);
  return `${name}{${parts.join(",")}}`;
}

export function incrementCounter(name: string, labels?: Record<string, string>, amount = 1): void {
  const key = metricKey(name, labels);
  counters.set(key, (counters.get(key) ?? 0) + amount);
  touchKey(counterOrder, key);
  enforceMapLimit(counters, counterOrder, getOperationalConfig().metricsRetentionCount);
}

export function recordHistogram(name: string, valueMs: number, labels?: Record<string, string>): void {
  const key = metricKey(name, labels);
  const current = histograms.get(key);
  if (!current) {
    histograms.set(key, { count: 1, sum: valueMs, min: valueMs, max: valueMs, last: valueMs });
  } else {
    current.count += 1;
    current.sum += valueMs;
    current.min = Math.min(current.min, valueMs);
    current.max = Math.max(current.max, valueMs);
    current.last = valueMs;
  }
  touchKey(histogramOrder, key);
  enforceMapLimit(histograms, histogramOrder, getOperationalConfig().metricsRetentionCount);
}

export type MetricsSnapshot = {
  counters: Record<string, number>;
  histograms: Record<string, HistogramStats & { avg: number }>;
  capturedAt: string;
};

export function getMetricsSnapshot(): MetricsSnapshot {
  const histogramEntries: MetricsSnapshot["histograms"] = {};
  for (const [key, stats] of histograms.entries()) {
    histogramEntries[key] = {
      ...stats,
      avg: stats.count > 0 ? Math.round((stats.sum / stats.count) * 100) / 100 : 0,
    };
  }

  return {
    counters: Object.fromEntries(counters.entries()),
    histograms: histogramEntries,
    capturedAt: new Date().toISOString(),
  };
}

export function resetMetrics(): void {
  counters.clear();
  histograms.clear();
  counterOrder.length = 0;
  histogramOrder.length = 0;
}

export async function recordTimed<T>(
  histogramName: string,
  labels: Record<string, string> | undefined,
  fn: () => Promise<T>,
): Promise<T> {
  const started = Date.now();
  try {
    const result = await fn();
    recordHistogram(histogramName, Date.now() - started, { ...labels, status: "ok" });
    return result;
  } catch (error) {
    recordHistogram(histogramName, Date.now() - started, { ...labels, status: "error" });
    throw error;
  }
}

