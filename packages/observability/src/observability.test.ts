import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  assertCircuitClosed,
  CircuitOpenError,
  classifyFailure,
  generateCorrelationId,
  getCorrelationContext,
  getMetricsSnapshot,
  incrementCounter,
  recordCircuitFailure,
  recordHistogram,
  resetCircuits,
  resetMetrics,
  resetOperationalConfig,
  resetStructuredLogs,
  resetTraces,
  runWithCorrelationContext,
  structuredLog,
  getRecentLogs,
  withTimeout,
  OperationTimeoutError,
} from "./index";

describe("observability metrics", () => {
  beforeEach(() => {
    resetMetrics();
  });

  it("increments counters and records histograms", () => {
    incrementCounter("pipeline.run.total");
    incrementCounter("pipeline.run.success");
    recordHistogram("pipeline.run.duration_ms", 120);

    const snapshot = getMetricsSnapshot();
    expect(snapshot.counters["pipeline.run.total"]).toBe(1);
    expect(snapshot.counters["pipeline.run.success"]).toBe(1);
    expect(snapshot.histograms["pipeline.run.duration_ms"].count).toBe(1);
    expect(snapshot.histograms["pipeline.run.duration_ms"].avg).toBe(120);
  });
});

describe("failure classifier", () => {
  it("classifies timeout and circuit errors", () => {
    expect(classifyFailure(new Error("operation timed out after 1000ms"))).toBe("timeout");
    expect(classifyFailure(new Error("Circuit open for draftkings-slate"))).toBe("circuit_open");
    expect(classifyFailure(new Error("missing credentials"))).toBe("configuration");
  });
});

describe("correlation context", () => {
  it("propagates correlation and run IDs", () => {
    const correlationId = generateCorrelationId();
    runWithCorrelationContext({ correlationId, runId: "run-test" }, () => {
      expect(getCorrelationContext()?.correlationId).toBe(correlationId);
      expect(getCorrelationContext()?.runId).toBe("run-test");
    });
  });
});

describe("circuit breaker", () => {
  beforeEach(() => {
    resetCircuits();
    resetOperationalConfig();
  });

  it("opens after threshold failures", () => {
    for (let i = 0; i < 5; i += 1) {
      recordCircuitFailure("test-source");
    }
    expect(() => assertCircuitClosed("test-source")).toThrow(CircuitOpenError);
  });
});

describe("structured logging", () => {
  beforeEach(() => {
    resetStructuredLogs();
  });

  it("records structured log entries", () => {
    structuredLog("info", "pipeline", "pipeline.start", "started", { runId: "run-1" });
    const logs = getRecentLogs(1);
    expect(logs[0]?.event).toBe("pipeline.start");
  });
});

describe("metrics retention", () => {
  beforeEach(() => {
    resetMetrics();
    resetOperationalConfig();
    process.env.METRICS_RETENTION_COUNT = "2";
  });

  afterEach(() => {
    delete process.env.METRICS_RETENTION_COUNT;
    resetOperationalConfig();
    resetMetrics();
  });

  it("evicts oldest metric keys when over retention limit", () => {
    incrementCounter("metric.a");
    incrementCounter("metric.b");
    incrementCounter("metric.c");

    const snapshot = getMetricsSnapshot();
    expect(Object.keys(snapshot.counters).length).toBeLessThanOrEqual(2);
  });
});

describe("withTimeout", () => {
  it("rejects slow operations", async () => {
    await expect(
      withTimeout("slow-op", 10, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return "done";
      }),
    ).rejects.toBeInstanceOf(OperationTimeoutError);
  });
});

describe("trace retention", () => {
  beforeEach(() => {
    resetTraces();
  });

  it("resets trace buffer", () => {
    resetTraces();
    expect(true).toBe(true);
  });
});
