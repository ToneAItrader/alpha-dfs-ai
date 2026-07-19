#!/usr/bin/env npx tsx
/**
 * Restore SQLite database from backup file.
 * Usage: npm run deploy:rollback -- backups/alpha-dfs-2026-07-18.db
 */
import { restoreDatabaseFile } from "../../apps/web/src/lib/backend/operations/database-backup.ts";

const backupPath = process.argv[2];
if (!backupPath) {
  console.error("Usage: npm run deploy:rollback -- <backup-file-path>");
  process.exit(1);
}

try {
  const result = restoreDatabaseFile({ backupPath });
  console.log(JSON.stringify({ status: "ok", ...result }, null, 2));
  console.log(`\nDatabase restored to: ${result.restoredPath}`);
  console.log("Next: npm run certify:startup && npm run deploy:smoke");
  process.exit(0);
} catch (error) {
  console.error(JSON.stringify({
    status: "failed",
    error: error instanceof Error ? error.message : String(error),
  }, null, 2));
  process.exit(1);
}
