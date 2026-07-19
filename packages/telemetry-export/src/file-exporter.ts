import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { TelemetryExportBatch } from "./config";

export async function exportBatchToFile(
  batch: TelemetryExportBatch,
  filePath: string,
): Promise<void> {
  const resolved = path.resolve(filePath);
  await mkdir(path.dirname(resolved), { recursive: true });
  await appendFile(resolved, `${JSON.stringify(batch)}\n`, "utf8");
}
