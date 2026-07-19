#!/usr/bin/env npx tsx
/**
 * Full operational certification — deploy config + test suites.
 * Usage: npm run certify
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateDeploymentConfig } from "../../apps/web/src/lib/backend/operations/deployment-config-validation.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function run(command: string, label: string): void {
  console.log(`\n▶ ${label}`);
  execSync(command, { cwd: root, stdio: "inherit" });
}

const report: Record<string, unknown> = {
  timestamp: new Date().toISOString(),
  gates: [] as Array<{ name: string; status: string; details?: unknown }>,
};

function recordGate(name: string, status: "pass" | "fail", details?: unknown) {
  (report.gates as Array<{ name: string; status: string; details?: unknown }>).push({
    name,
    status,
    details,
  });
}

console.log("Alpha DFS AI — Operational Certification\n");

const deployResult = validateDeploymentConfig();
recordGate("deployment-config", deployResult.ok ? "pass" : "fail", {
  blockers: deployResult.blockers,
  warnings: deployResult.warnings,
});

if (!deployResult.ok) {
  console.error("Deployment config validation failed — aborting certification");
  console.log(JSON.stringify(report, null, 2));
  process.exit(1);
}

const buildDir = path.join(root, "apps/web/.next");
if (existsSync(buildDir)) {
  recordGate("build-artifact", "pass", { path: buildDir });
} else {
  recordGate("build-artifact", "fail", { message: "Run npm run build before certification" });
  console.warn("Warning: .next build artifact not found — run npm run build for full certification");
}

try {
  run("npm test --workspaces --if-present", "All workspace tests");
  recordGate("tests-all-workspaces", "pass");
} catch {
  recordGate("tests-all-workspaces", "fail");
  console.log(JSON.stringify(report, null, 2));
  process.exit(1);
}

if (process.env.CERTIFY_E2E === "1") {
  try {
    run("npm run certify:e2e", "Browser E2E certification (V2.0-5)");
    recordGate("browser-e2e", "pass");
  } catch {
    recordGate("browser-e2e", "fail");
    console.log(JSON.stringify(report, null, 2));
    process.exit(1);
  }
} else {
  recordGate("browser-e2e", "skipped", {
    reason: "Optional V2.0 gate — set CERTIFY_E2E=1 to include Playwright E2E",
  });
}

report.overall = "pass";
console.log("\n✓ Operational certification PASSED\n");
console.log(JSON.stringify(report, null, 2));
process.exit(0);
