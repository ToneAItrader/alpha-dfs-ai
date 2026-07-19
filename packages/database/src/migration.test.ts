import { describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = path.dirname(fileURLToPath(import.meta.url));

describe("prisma migrations", () => {
  it("includes V2.1 simulation field metadata migration", () => {
    const migrationPath = path.join(
      packageDir,
      "../prisma/migrations/20260719120000_v2_1_simulation_field_metadata/migration.sql",
    );
    const sql = execSync(`cat "${migrationPath}"`, { encoding: "utf8" });
    expect(sql).toContain("SimulationRun");
    expect(sql).toContain("fieldPercentile");
  });
});
