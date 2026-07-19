import { existsSync, readdirSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";
import { resolveBackupDirectory } from "@/lib/backend/operations/database-backup";

export type BackupFileEntry = {
  path: string;
  name: string;
  mtimeMs: number;
};

export type DeletionReason = "count_exceeded" | "age_exceeded" | "both";

export type BackupRetentionConfig = {
  retentionCount: number;
  retentionDays: number;
  backupDir: string;
  now?: Date;
};

export type BackupRetentionCandidate = BackupFileEntry & {
  reasons: DeletionReason[];
};

export type BackupRetentionPlan = {
  backupDir: string;
  retentionCount: number;
  retentionDays: number;
  totalFiles: number;
  retained: BackupFileEntry[];
  toDelete: BackupRetentionCandidate[];
  newestProtected: BackupFileEntry | null;
};

export type BackupPruneResult = {
  status: "ok" | "failed";
  mode: "dry-run" | "execute";
  plan: BackupRetentionPlan;
  deleted: string[];
  errors: string[];
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function parseRetentionCount(value: string | undefined, fallback = 10): number {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new Error("BACKUP_RETENTION_COUNT must be a positive number");
  }
  return Math.floor(parsed);
}

export function parseRetentionDays(value: string | undefined, fallback = 30): number {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new Error("BACKUP_RETENTION_DAYS must be a positive number");
  }
  return Math.floor(parsed);
}

export function resolveRetentionConfig(options?: Partial<BackupRetentionConfig>): BackupRetentionConfig {
  return {
    retentionCount: parseRetentionCount(
      options?.retentionCount !== undefined
        ? String(options.retentionCount)
        : process.env.BACKUP_RETENTION_COUNT,
    ),
    retentionDays: parseRetentionDays(
      options?.retentionDays !== undefined
        ? String(options.retentionDays)
        : process.env.BACKUP_RETENTION_DAYS,
    ),
    backupDir: resolveBackupDirectory(options?.backupDir ?? process.env.BACKUP_DIR),
    now: options?.now,
  };
}

/** List `.db` backup files sorted newest-first by mtime. */
export function listBackupFiles(backupDir: string): BackupFileEntry[] {
  if (!existsSync(backupDir)) {
    return [];
  }

  return readdirSync(backupDir)
    .filter((name) => name.endsWith(".db"))
    .map((name) => {
      const filePath = path.join(backupDir, name);
      const stats = statSync(filePath);
      if (!stats.isFile()) {
        return null;
      }
      return {
        path: filePath,
        name,
        mtimeMs: stats.mtimeMs,
      };
    })
    .filter((entry): entry is BackupFileEntry => entry !== null)
    .sort((a, b) => b.mtimeMs - a.mtimeMs);
}

function resolveDeletionReason(countOk: boolean, ageOk: boolean): DeletionReason {
  if (!countOk && !ageOk) return "both";
  if (!countOk) return "count_exceeded";
  return "age_exceeded";
}

/** Plan backup retention per ADR-006 — retain only if in top N and within age window; newest never deleted. */
export function planBackupRetention(
  config: BackupRetentionConfig,
  files?: BackupFileEntry[],
): BackupRetentionPlan {
  const now = config.now ?? new Date();
  const nowMs = now.getTime();
  const maxAgeMs = config.retentionDays * MS_PER_DAY;
  const sorted = files ?? listBackupFiles(config.backupDir);
  const newestProtected = sorted[0] ?? null;

  const retained: BackupFileEntry[] = [];
  const toDelete: BackupRetentionCandidate[] = [];

  sorted.forEach((file, index) => {
    if (index === 0) {
      retained.push(file);
      return;
    }

    const withinCount = index < config.retentionCount;
    const withinAge = nowMs - file.mtimeMs <= maxAgeMs;

    if (withinCount && withinAge) {
      retained.push(file);
      return;
    }

    toDelete.push({
      ...file,
      reasons: [resolveDeletionReason(withinCount, withinAge)],
    });
  });

  return {
    backupDir: config.backupDir,
    retentionCount: config.retentionCount,
    retentionDays: config.retentionDays,
    totalFiles: sorted.length,
    retained,
    toDelete,
    newestProtected,
  };
}

export function executeBackupPrune(plan: BackupRetentionPlan, execute: boolean): BackupPruneResult {
  const deleted: string[] = [];
  const errors: string[] = [];

  if (execute) {
    for (const candidate of plan.toDelete) {
      try {
        unlinkSync(candidate.path);
        deleted.push(candidate.path);
      } catch (error) {
        errors.push(
          `${candidate.path}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }

  return {
    status: errors.length > 0 ? "failed" : "ok",
    mode: execute ? "execute" : "dry-run",
    plan,
    deleted,
    errors,
  };
}
