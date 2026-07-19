import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import {
  getActiveTelemetryExporter,
  startTelemetryExport,
  stopTelemetryExport,
} from "@/lib/backend/operations/telemetry-export-lifecycle";

const tempRoot = path.join(process.cwd(), ".tmp-telemetry-lifecycle-test");

describe("telemetry export lifecycle", () => {
  const originalEnv = { ...process.env };

  beforeEach(async () => {
    await stopTelemetryExport();
    rmSync(tempRoot, { recursive: true, force: true });
    mkdirSync(tempRoot, { recursive: true });
    process.env = { ...originalEnv };
    delete process.env.TELEMETRY_EXPORT_MODE;
    delete process.env.TELEMETRY_EXPORT_PATH;
    delete process.env.TELEMETRY_EXPORT_OTLP_ENDPOINT;
  });

  afterEach(async () => {
    await stopTelemetryExport();
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("does not start exporter when mode is none", () => {
    const exporter = startTelemetryExport();
    expect(exporter).toBeNull();
    expect(getActiveTelemetryExporter()).toBeNull();
  });

  it("starts exporter in file mode with valid configuration", () => {
    process.env.TELEMETRY_EXPORT_MODE = "file";
    process.env.TELEMETRY_EXPORT_PATH = path.join(tempRoot, "telemetry.jsonl");
    process.env.TELEMETRY_EXPORT_INTERVAL_MS = "60000";

    const exporter = startTelemetryExport();
    expect(exporter).not.toBeNull();
    expect(exporter?.isRunning).toBe(true);
    expect(getActiveTelemetryExporter()).toBe(exporter);
  });

  it("fails open when configuration is invalid", () => {
    process.env.TELEMETRY_EXPORT_MODE = "file";
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const exporter = startTelemetryExport();
    expect(exporter).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
  });
});
