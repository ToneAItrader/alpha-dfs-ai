import { copyFileSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";

export function parseSqliteDatabasePath(databaseUrl: string): string {
  const trimmed = databaseUrl.trim();
  if (!trimmed.startsWith("file:")) {
    throw new Error("Only file: SQLite DATABASE_URL is supported in v1");
  }
  const filePath = trimmed.slice("file:".length);
  if (!filePath) {
    throw new Error("DATABASE_URL file path is empty");
  }
  return path.resolve(filePath);
}

export function resolveBackupDirectory(backupDir?: string): string {
  return path.resolve(backupDir ?? path.join(process.cwd(), "backups"));
}

export function createBackupFilename(prefix = "alpha-dfs"): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${prefix}-${timestamp}.db`;
}

export type DatabaseBackupResult = {
  sourcePath: string;
  backupPath: string;
  sizeBytes: number;
  timestamp: string;
  method: "vacuum" | "copy";
};

/** Create a consistent SQLite snapshot using VACUUM INTO (falls back to file copy). */
export async function backupDatabaseFile(options?: {
  databaseUrl?: string;
  backupDir?: string;
  prefix?: string;
}): Promise<DatabaseBackupResult> {
  const databaseUrl = options?.databaseUrl ?? process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for backup");
  }

  const sourcePath = parseSqliteDatabasePath(databaseUrl);
  if (!existsSync(sourcePath)) {
    throw new Error(`Database file not found: ${sourcePath}`);
  }

  const backupDirectory = resolveBackupDirectory(options?.backupDir);
  mkdirSync(backupDirectory, { recursive: true });

  const backupPath = path.join(backupDirectory, createBackupFilename(options?.prefix));

  try {
    const { getPrismaClient } = await import("@alpha-dfs/database");
    const client = getPrismaClient();
    const escaped = backupPath.replace(/'/g, "''");
    await client.$executeRawUnsafe(`VACUUM INTO '${escaped}'`);
    return {
      sourcePath,
      backupPath,
      sizeBytes: statSync(backupPath).size,
      timestamp: new Date().toISOString(),
      method: "vacuum",
    };
  } catch {
    copyFileSync(sourcePath, backupPath);
    return {
      sourcePath,
      backupPath,
      sizeBytes: statSync(backupPath).size,
      timestamp: new Date().toISOString(),
      method: "copy",
    };
  }
}

export type DatabaseRestoreResult = {
  backupPath: string;
  restoredPath: string;
  sizeBytes: number;
  timestamp: string;
};

export function restoreDatabaseFile(options: {
  backupPath: string;
  databaseUrl?: string;
}): DatabaseRestoreResult {
  const backupPath = path.resolve(options.backupPath);
  if (!existsSync(backupPath)) {
    throw new Error(`Backup file not found: ${backupPath}`);
  }

  const databaseUrl = options.databaseUrl ?? process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for restore");
  }

  const restoredPath = parseSqliteDatabasePath(databaseUrl);
  mkdirSync(path.dirname(restoredPath), { recursive: true });

  for (const suffix of ["", "-wal", "-shm"]) {
    const sidecar = `${restoredPath}${suffix}`;
    if (existsSync(sidecar)) {
      rmSync(sidecar, { force: true });
    }
  }

  copyFileSync(backupPath, restoredPath);

  return {
    backupPath,
    restoredPath,
    sizeBytes: statSync(restoredPath).size,
    timestamp: new Date().toISOString(),
  };
}
