import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ENGINE_PACKAGES = [
  "packages/projection-calibration/src",
  "packages/ownership-prediction/src",
  "packages/portfolio-intelligence/src",
  "packages/portfolio-simulation/src",
  "packages/prediction-confidence/src",
  "packages/evidence/src",
];

const FORBIDDEN_IMPORTS = ["adi-providers", "news-provider", "social-provider"];

function collectTsFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTsFiles(fullPath));
      continue;
    }
    if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
      files.push(fullPath);
    }
  }
  return files;
}

describe("ADI architecture boundaries (M4)", () => {
  it("engine packages do not import provider-specific ADI modules", () => {
    const repoRoot = path.resolve(__dirname, "../../../../..");
    const violations: string[] = [];

    for (const pkg of ENGINE_PACKAGES) {
      const pkgDir = path.join(repoRoot, pkg);
      for (const file of collectTsFiles(pkgDir)) {
        const content = readFileSync(file, "utf8");
        for (const forbidden of FORBIDDEN_IMPORTS) {
          if (content.includes(forbidden)) {
            violations.push(`${file} imports ${forbidden}`);
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
