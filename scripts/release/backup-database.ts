#!/usr/bin/env npx tsx
import { backupDatabaseFile } from "../../apps/web/src/lib/backend/operations/database-backup.ts";

async function main() {
  const result = await backupDatabaseFile();
  console.log(JSON.stringify({ status: "ok", ...result }, null, 2));
  console.log(`\nDatabase backup created: ${result.backupPath} (${result.method})`);
}

main().catch((error) => {
  console.error(JSON.stringify({
    status: "failed",
    error: error instanceof Error ? error.message : String(error),
  }, null, 2));
  process.exit(1);
});
