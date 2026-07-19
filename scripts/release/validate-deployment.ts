#!/usr/bin/env npx tsx
/**
 * Deployment configuration validation — run before deploy.
 * Usage: npm run certify:deploy
 */
import { validateDeploymentConfig } from "../../apps/web/src/lib/backend/operations/deployment-config-validation.ts";

const result = validateDeploymentConfig();

console.log(JSON.stringify(result, null, 2));

if (!result.ok) {
  console.error(`\nDeployment validation FAILED (${result.blockers.length} blocker(s))`);
  process.exit(1);
}

if (result.warnings.length > 0) {
  console.warn(`\nDeployment validation passed with ${result.warnings.length} warning(s)`);
} else {
  console.log("\nDeployment validation PASSED");
}

process.exit(0);
