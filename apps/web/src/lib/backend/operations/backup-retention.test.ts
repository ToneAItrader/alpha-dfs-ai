import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdirSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  executeBackupPrune,
  listBackupFiles,
  planBackupRetention,
  type BackupFileEntry,
} from "@/lib/backend/operations/backup-retention";

const tempRoot = path.join(process.cwd(), ".tmp-backup-retention-test");

function touchBackup(name: string, mtime: Date): BackupFileEntry {
  const filePath = path.join(tempRoot, name);
  writeFileSync(filePath, "backup");
  utimesSync(filePath, mtime, mtime);
  return {
    path: filePath,
    name,
    mtimeMs: mtime.getTime(),
  };
}

describe("backup retention", () => {
  beforeEach(() => {
    rmSync(tempRoot, { recursive: true, force: true });
    mkdirSync(tempRoot, { recursive: true });
  });

  afterEach(() => {
    rmSync(tempRoot, { recursive: true, force: true });
  });

  it("returns an empty plan for a missing backup directory", () => {
    const plan = planBackupRetention(
      {
        retentionCount: 10,
        retentionDays: 30,
        backupDir: path.join(tempRoot, "missing"),
        now: new Date("2026-07-19T00:00:00.000Z"),
      },
      [],
    );

    expect(plan.totalFiles).toBe(0);
    expect(plan.retained).toHaveLength(0);
    expect(plan.toDelete).toHaveLength(0);
  });

  it("lists only .db files sorted newest-first", () => {
    const older = touchBackup("alpha-dfs-old.db", new Date("2026-07-01T00:00:00.000Z"));
    touchBackup("notes.txt", new Date("2026-07-18T00:00:00.000Z"));
    const newer = touchBackup("alpha-dfs-new.db", new Date("2026-07-18T00:00:00.000Z"));

    const files = listBackupFiles(tempRoot);
    expect(files).toHaveLength(2);
    expect(files[0]?.name).toBe(newer.name);
    expect(files[1]?.name).toBe(older.name);
  });

  it("deletes candidates outside the count window", () => {
    const now = new Date("2026-07-19T00:00:00.000Z");
    const files = Array.from({ length: 12 }, (_, index) =>
      touchBackup(
        `alpha-dfs-${index}.db`,
        new Date(now.getTime() - index * 60_000),
      ),
    );

    const plan = planBackupRetention(
      {
        retentionCount: 10,
        retentionDays: 30,
        backupDir: tempRoot,
        now,
      },
      files,
    );

    expect(plan.retained).toHaveLength(10);
    expect(plan.toDelete).toHaveLength(2);
    expect(plan.toDelete.every((entry) => entry.reasons.includes("count_exceeded"))).toBe(true);
    expect(plan.newestProtected?.name).toBe(files[0]?.name);
  });

  it("deletes candidates older than the retention age", () => {
    const now = new Date("2026-07-19T00:00:00.000Z");
    const newest = touchBackup("alpha-dfs-newest.db", now);
    const stale = touchBackup("alpha-dfs-stale.db", new Date("2026-06-01T00:00:00.000Z"));

    const plan = planBackupRetention(
      {
        retentionCount: 10,
        retentionDays: 30,
        backupDir: tempRoot,
        now,
      },
      [newest, stale],
    );

    expect(plan.retained.map((entry) => entry.name)).toEqual([newest.name]);
    expect(plan.toDelete).toHaveLength(1);
    expect(plan.toDelete[0]?.name).toBe(stale.name);
    expect(plan.toDelete[0]?.reasons).toEqual(["age_exceeded"]);
  });

  it("never deletes the newest backup even when it exceeds count and age limits", () => {
    const now = new Date("2026-07-19T00:00:00.000Z");
    const onlyBackup = touchBackup(
      "alpha-dfs-ancient.db",
      new Date("2025-01-01T00:00:00.000Z"),
    );

    const plan = planBackupRetention(
      {
        retentionCount: 1,
        retentionDays: 7,
        backupDir: tempRoot,
        now,
      },
      [onlyBackup],
    );

    expect(plan.retained).toHaveLength(1);
    expect(plan.toDelete).toHaveLength(0);
    expect(plan.newestProtected?.name).toBe(onlyBackup.name);
  });

  it("marks candidates failing both count and age rules as both", () => {
    const now = new Date("2026-07-19T00:00:00.000Z");
    const files = [
      touchBackup("alpha-dfs-newest.db", now),
      ...Array.from({ length: 11 }, (_, index) =>
        touchBackup(
          `alpha-dfs-old-${index}.db`,
          new Date("2025-01-01T00:00:00.000Z"),
        ),
      ),
    ];

    const plan = planBackupRetention(
      {
        retentionCount: 3,
        retentionDays: 30,
        backupDir: tempRoot,
        now,
      },
      files,
    );

    expect(plan.toDelete.length).toBeGreaterThan(0);
    expect(plan.toDelete.some((entry) => entry.reasons.includes("both"))).toBe(true);
    expect(
      plan.toDelete.filter((entry) => entry.reasons.includes("age_exceeded")).length,
    ).toBeGreaterThan(0);
  });

  it("executes deletion only in execute mode", () => {
    const now = new Date("2026-07-19T00:00:00.000Z");
    const files = Array.from({ length: 4 }, (_, index) =>
      touchBackup(
        `alpha-dfs-${index}.db`,
        new Date(now.getTime() - index * 60_000),
      ),
    );

    const plan = planBackupRetention(
      {
        retentionCount: 2,
        retentionDays: 30,
        backupDir: tempRoot,
        now,
      },
      files,
    );

    const dryRun = executeBackupPrune(plan, false);
    expect(dryRun.mode).toBe("dry-run");
    expect(dryRun.deleted).toHaveLength(0);
    expect(listBackupFiles(tempRoot)).toHaveLength(4);

    const executed = executeBackupPrune(plan, true);
    expect(executed.mode).toBe("execute");
    expect(executed.deleted).toHaveLength(2);
    expect(listBackupFiles(tempRoot)).toHaveLength(2);
    expect(listBackupFiles(tempRoot)[0]?.name).toBe(files[0]?.name);
  });
});
