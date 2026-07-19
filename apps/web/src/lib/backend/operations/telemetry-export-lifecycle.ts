import {
  createTelemetryExporter,
  resolveTelemetryExportConfig,
  validateTelemetryExportConfig,
  type TelemetryExporter,
} from "@alpha-dfs/telemetry-export";

let activeExporter: TelemetryExporter | null = null;
let shutdownRegistered = false;

function registerShutdownHook(exporter: TelemetryExporter): void {
  if (shutdownRegistered || typeof process === "undefined") {
    return;
  }

  const shutdown = () => {
    void exporter.stop();
  };

  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
  shutdownRegistered = true;
}

/** Start optional telemetry export during web process boot (ADR-004). */
export function startTelemetryExport(): TelemetryExporter | null {
  if (activeExporter?.isRunning) {
    return activeExporter;
  }

  const config = resolveTelemetryExportConfig();
  if (config.mode === "none") {
    return null;
  }

  const validationErrors = validateTelemetryExportConfig(config);
  if (validationErrors.length > 0) {
    console.warn(
      JSON.stringify({
        component: "telemetry-export",
        event: "telemetry.export.disabled",
        message: "Telemetry export disabled due to invalid configuration",
        errors: validationErrors,
      }),
    );
    return null;
  }

  activeExporter = createTelemetryExporter();
  activeExporter.start(config);
  registerShutdownHook(activeExporter);

  console.log(
    JSON.stringify({
      component: "telemetry-export",
      event: "telemetry.export.started",
      message: "Telemetry export started",
      mode: config.mode,
      intervalMs: config.intervalMs,
    }),
  );

  return activeExporter;
}

/** Stop telemetry export — test helper and graceful shutdown support. */
export async function stopTelemetryExport(): Promise<void> {
  if (!activeExporter) {
    return;
  }
  await activeExporter.stop();
  activeExporter = null;
}

export function getActiveTelemetryExporter(): TelemetryExporter | null {
  return activeExporter;
}
