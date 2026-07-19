import type { TelemetryExportConfig } from "./config";
import { exportBatchToFile } from "./file-exporter";
import { exportBatchToOtlp } from "./otlp-exporter";
import { collectTelemetryExportBatch } from "./snapshot";

export type TelemetryExporterDependencies = {
  exportFile?: typeof exportBatchToFile;
  exportOtlp?: typeof exportBatchToOtlp;
  setIntervalFn?: typeof setInterval;
  clearIntervalFn?: typeof clearInterval;
};

export class TelemetryExporter {
  private config: TelemetryExportConfig | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;
  private readonly deps: Required<TelemetryExporterDependencies>;

  constructor(deps: TelemetryExporterDependencies = {}) {
    this.deps = {
      exportFile: deps.exportFile ?? exportBatchToFile,
      exportOtlp: deps.exportOtlp ?? exportBatchToOtlp,
      setIntervalFn: deps.setIntervalFn ?? setInterval,
      clearIntervalFn: deps.clearIntervalFn ?? clearInterval,
    };
  }

  get isRunning(): boolean {
    return this.running;
  }

  start(config: TelemetryExportConfig): void {
    if (config.mode === "none" || this.running) {
      return;
    }

    this.config = config;
    this.running = true;
    this.timer = this.deps.setIntervalFn(() => {
      void this.flush().catch(() => {
        // Fail-open — export errors must not crash the process.
      });
    }, config.intervalMs);

    if (this.timer && typeof this.timer === "object" && "unref" in this.timer) {
      this.timer.unref();
    }
  }

  async flush(): Promise<void> {
    if (!this.config || this.config.mode === "none") {
      return;
    }

    const batch = collectTelemetryExportBatch();

    if (this.config.mode === "file") {
      if (!this.config.filePath) {
        throw new Error("TELEMETRY_EXPORT_PATH is required for file export");
      }
      await this.deps.exportFile(batch, this.config.filePath);
      return;
    }

    if (this.config.mode === "otlp") {
      await this.deps.exportOtlp(batch, this.config);
    }
  }

  async stop(): Promise<void> {
    if (this.timer) {
      this.deps.clearIntervalFn(this.timer);
      this.timer = null;
    }

    if (this.running) {
      try {
        await this.flush();
      } catch {
        // Fail-open on final flush during shutdown.
      }
    }

    this.running = false;
    this.config = null;
  }
}

export function createTelemetryExporter(deps?: TelemetryExporterDependencies): TelemetryExporter {
  return new TelemetryExporter(deps);
}
