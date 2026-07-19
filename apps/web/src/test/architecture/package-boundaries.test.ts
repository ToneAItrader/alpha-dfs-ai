import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const monorepoRoot = join(process.cwd(), "../..");

type BoundaryRule = {
  name: string;
  root: string;
  forbidden: RegExp[];
};

function collectSourceFiles(dir: string): string[] {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) {
    return [];
  }

  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      return collectSourceFiles(fullPath);
    }
    if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      if (fullPath.endsWith(".test.ts") || fullPath.endsWith(".test.tsx")) {
        return [];
      }
      return [fullPath];
    }
    return [];
  });
}

function findViolations(rule: BoundaryRule): string[] {
  const offenders: string[] = [];

  for (const file of collectSourceFiles(rule.root)) {
    const contents = readFileSync(file, "utf8");
    for (const pattern of rule.forbidden) {
      if (pattern.test(contents)) {
        offenders.push(`${file} → ${pattern}`);
      }
    }
  }

  return offenders;
}

const rules: BoundaryRule[] = [
  {
    name: "observability has no @alpha-dfs runtime deps",
    root: join(monorepoRoot, "packages/observability/src"),
    forbidden: [/from "@alpha-dfs\//],
  },
  {
    name: "connectors do not import database",
    root: join(monorepoRoot, "packages/connectors/src"),
    forbidden: [/from "@alpha-dfs\/database"/],
  },
  {
    name: "database does not import connectors or observability",
    root: join(monorepoRoot, "packages/database/src"),
    forbidden: [/from "@alpha-dfs\/(connectors|observability)"/],
  },
  {
    name: "presentation components do not import runtime packages",
    root: join(process.cwd(), "src/components"),
    forbidden: [/from "@alpha-dfs\//, /@\/types\/dto\//, /from "@\/lib\/backend\//],
  },
];

describe("package boundaries", () => {
  for (const rule of rules) {
    it(rule.name, () => {
      expect(findViolations(rule)).toEqual([]);
    });
  }
});
