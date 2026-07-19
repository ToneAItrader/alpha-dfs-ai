export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startTelemetryExport } = await import(
      "./src/lib/backend/operations/telemetry-export-lifecycle"
    );
    startTelemetryExport();
  }
}
