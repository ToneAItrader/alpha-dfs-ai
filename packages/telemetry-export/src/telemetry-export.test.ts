import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import {
  incrementCounter,
  resetMetrics,
  resetStructuredLogs,
  resetTraces,
  structuredLog,
} from "@alpha-dfs/observability";
import {
  resolveTelemetryExportConfig,
  validateTelemetryExportConfig,
} from "./config";
import { exportBatchToFile } from "./file-exporter";
import { exportBatchToOtlp } from "./otlp-exporter";
import { collectTelemetryExportBatch } from "./snapshot";
import { createTelemetryExporter } from "./telemetry-exporter";

const tempRoot = path.join(process.cwd(), ".tmp-telemetry-export-test");

describe("telemetry export config", () => {
  it("defaults to none mode", () => {
    const config = resolveTelemetryExportConfig({});
    expect(config.mode).toBe("none");
    expect(config.intervalMs).toBe(30_000);
  });

  it("validates file mode requires export path", () => {
    const errors = validateTelemetryExportConfig({
      mode: "file",
      intervalMs: 30_000,
    });
    expect(errors).toContain("TELEMETRY_EXPORT_PATH is required when TELEMETRY_EXPORT_MODE=file");
  });

  it("validates otlp mode requires endpoint", () => {
    const errors = validateTelemetryExportConfig({
      mode: "otlp",
      intervalMs: 30_000,
    });
    expect(errors).toContain(
      "TELEMETRY_EXPORT_OTLP_ENDPOINT is required when TELEMETRY_EXPORT_MODE=otlp",
    );
  });
});

describe("telemetry export batch", () => {
  beforeEach(() => {
    resetMetrics();
    resetStructuredLogs();
    resetTraces();
  });

  it("collects metrics, logs, and traces from observability buffers", () => {
    incrementCounter("pipeline.run.total");
    structuredLog("info", "pipeline", "pipeline.start", "started");
    const batch = collectTelemetryExportBatch(new Date("2026-07-19T00:00:00.000Z"));
    expect(batch.exportedAt).toBe("2026-07-19T00:00:00.000Z");
    expect(batch.metrics.counters["pipeline.run.total"]).toBe(1);
    expect(batch.logs.length).toBeGreaterThan(0);
  });
});

describe("file exporter", () => {
  beforeEach(() => {
    rmSync(tempRoot, { recursive: true, force: true });
    mkdirSync(tempRoot, { recursive: true });
    resetMetrics();
  });

  afterEach(() => {
    rmSync(tempRoot, { recursive: true, force: true });
  });

  it("appends JSON lines to the configured path", async () => {
    const target = path.join(tempRoot, "nested", "telemetry.jsonl");
    const batch = collectTelemetryExportBatch();
    await exportBatchToFile(batch, target);
    const contents = readFileSync(target, "utf8");
    expect(contents.trim().startsWith("{")).toBe(true);
    expect(JSON.parse(contents.trim()).exportedAt).toBe(batch.exportedAt);
  });
});

describe("otlp exporter", () => {
  it("posts JSON batch to configured endpoint", async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 200 }));
    const batch = collectTelemetryExportBatch();
    await exportBatchToOtlp(
      batch,
      {
        otlpEndpoint: "https://otel.example/v1/logs",
        otlpHeaders: { authorization: "Bearer test" },
      },
      fetchImpl,
    );

    expect(fetchImpl).toHaveBeenCalledOnce();
    const [, init] = fetchImpl.mock.calls[0] ?? [];
    expect(init?.method).toBe("POST");
    expect((init?.headers as Record<string, string>)["content-type"]).toBe("application/json");
  });
});

describe("TelemetryExporter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetMetrics();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not start when mode is none", () => {
    const exporter = createTelemetryExporter();
    exporter.start({ mode: "none", intervalMs: 1000 });
    expect(exporter.isRunning).toBe(false);
  });

  it("exports on interval in file mode", async () => {
    const exportFile = vi.fn(async () => undefined);
    const exporter = createTelemetryExporter({ exportFile });
    exporter.start({
      mode: "file",
      intervalMs: 1000,
      filePath: path.join(tempRoot, "telemetry.jsonl"),
    });

    expect(exporter.isRunning).toBe(true);
    await vi.advanceTimersByTimeAsync(1000);
    expect(exportFile).toHaveBeenCalled();
    await exporter.stop();
  });

  it("remains fail-open when export throws", async () => {
    const exportFile = vi.fn(async () => {
      throw new Error("disk full");
    });
    const exporter = createTelemetryExporter({ exportFile });
    exporter.start({
      mode: "file",
      intervalMs: 1000,
      filePath: path.join(tempRoot, "telemetry.jsonl"),
    });

    await vi.advanceTimersByTimeAsync(1000);
    expect(exportFile).toHaveBeenCalled();
    await exporter.stop();
  });
});
