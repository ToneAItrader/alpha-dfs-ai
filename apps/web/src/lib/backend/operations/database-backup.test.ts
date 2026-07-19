import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  backupDatabaseFile,
  parseSqliteDatabasePath,
  restoreDatabaseFile,
} from "@/lib/backend/operations/database-backup";

const tempRoot = path.join(process.cwd(), ".tmp-backup-test");

describe("database backup", () => {
  beforeEach(() => {
    rmSync(tempRoot, { recursive: true, force: true });
    mkdirSync(tempRoot, { recursive: true });
  });

  afterEach(() => {
    rmSync(tempRoot, { recursive: true, force: true });
  });

  it("parses sqlite DATABASE_URL paths", () => {
    const resolved = parseSqliteDatabasePath(`file:${path.join(tempRoot, "dev.db")}`);
    expect(resolved).toBe(path.join(tempRoot, "dev.db"));
  });

  it("backs up and restores a database file", async () => {
    const sourcePath = path.join(tempRoot, "source.db");
    writeFileSync(sourcePath, "sqlite-test-data");

    process.env.DATABASE_URL = `file:${sourcePath}`;
    const backup = await backupDatabaseFile({ backupDir: path.join(tempRoot, "backups") });
    expect(existsSync(backup.backupPath)).toBe(true);

    writeFileSync(sourcePath, "corrupted");
    restoreDatabaseFile({ backupPath: backup.backupPath });
    expect(existsSync(sourcePath)).toBe(true);
  });
});
