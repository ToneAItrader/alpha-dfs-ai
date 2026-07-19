import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export function loadProviderFixture<T>(filename: string): T {
  const fixturePath = path.join(packageRoot, "fixtures", filename);
  const raw = readFileSync(fixturePath, "utf8");
  return JSON.parse(raw) as T;
}

export function fixturesRoot(): string {
  return path.join(packageRoot, "fixtures");
}
