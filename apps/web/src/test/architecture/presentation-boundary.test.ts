import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = process.cwd();
const presentationRoots = [
  join(appRoot, "src/components/portfolio-readiness"),
  join(appRoot, "src/components/player-evidence"),
  join(appRoot, "src/components/recommended-portfolio"),
  join(appRoot, "src/components/portfolio-health"),
  join(appRoot, "src/components/simulation-results"),
  join(appRoot, "src/components/confidence-indicators"),
  join(appRoot, "src/components/dashboard"),
  join(appRoot, "src/components/ui"),
];

function collectTsxFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      return collectTsxFiles(fullPath);
    }
    if (fullPath.endsWith(".tsx") && !fullPath.endsWith(".test.tsx")) {
      return [fullPath];
    }
    return [];
  });
}

describe("presentation boundary", () => {
  it("presentation components do not import backend DTO modules", () => {
    const offenders: string[] = [];

    for (const root of presentationRoots) {
      for (const file of collectTsxFiles(root)) {
        const contents = readFileSync(file, "utf8");
        if (contents.includes("@/types/dto/") || contents.includes('from "@/lib/backend/')) {
          offenders.push(file);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
