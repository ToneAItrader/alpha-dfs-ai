#!/usr/bin/env npx tsx
/**
 * Backup retention prune — dry-run by default (V2.0-3 / ADR-006).
 *
 * Usage:
 *   npm run deploy:backup:prune
 *   npm run deploy:backup:prune -- --execute
 */
import {
  executeBackupPrune,
  planBackupRetention,
  resolveRetentionConfig,
} from "../../apps/web/src/lib/backend/operations/backup-retention.ts";

async function main() {
  const execute = process.argv.includes("--execute");
  const config = resolveRetentionConfig();
  const plan = planBackupRetention(config);
  const result = executeBackupPrune(plan, execute);

  console.log(
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        status: result.status,
        mode: result.mode,
        backupDir: plan.backupDir,
        retentionCount: plan.retentionCount,
        retentionDays: plan.retentionDays,
        totalFiles: plan.totalFiles,
        retainedCount: plan.retained.length,
        deleteCandidateCount: plan.toDelete.length,
        newestProtected: plan.newestProtected?.name ?? null,
        retained: plan.retained.map((entry) => entry.name),
        deleteCandidates: plan.toDelete.map((entry) => ({
          name: entry.name,
          reasons: entry.reasons,
        })),
        deleted: result.deleted,
        errors: result.errors,
      },
      null,
      2,
    ),
  );

  if (result.status !== "ok") {
    process.exit(1);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
