import path from "node:path";
import { fileURLToPath } from "node:url";

const CONNECTORS_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export function connectorFixturePath(filename: string): string {
  return path.join(CONNECTORS_ROOT, "fixtures", filename);
}
