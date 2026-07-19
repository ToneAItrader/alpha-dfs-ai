#!/usr/bin/env npx tsx
/**
 * Startup validation — requires DATABASE_URL and loads Prisma.
 * Usage: npm run certify:startup
 */
import { validateStartup } from "../../apps/web/src/lib/backend/operations/startup-validation.ts";

async function main() {
  const result = await validateStartup();
  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    console.error(`\nStartup validation FAILED (${result.blockers.length} blocker(s))`);
    process.exit(1);
  }

  if (result.warnings.length > 0) {
    console.warn(`\nStartup validation passed with ${result.warnings.length} warning(s)`);
  } else {
    console.log("\nStartup validation PASSED");
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("Startup validation error:", error);
  process.exit(1);
});
