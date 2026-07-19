import type { TelemetryExportBatch, TelemetryExportConfig } from "./config";

export async function exportBatchToOtlp(
  batch: TelemetryExportBatch,
  config: Pick<TelemetryExportConfig, "otlpEndpoint" | "otlpHeaders">,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const endpoint = config.otlpEndpoint?.trim();
  if (!endpoint) {
    throw new Error("OTLP endpoint is not configured");
  }

  const response = await fetchImpl(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...config.otlpHeaders,
    },
    body: JSON.stringify(batch),
  });

  if (!response.ok) {
    throw new Error(`OTLP export failed with status ${response.status}`);
  }
}
