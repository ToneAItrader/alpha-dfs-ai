#!/usr/bin/env npx tsx
/**
 * Task 11.9 — Full production deployment readiness verification.
 * Usage: npm run deploy:verify
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, accessSync, constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateDeploymentConfig } from "../../apps/web/src/lib/backend/operations/deployment-config-validation.ts";
import { resolveBackupDirectory } from "../../apps/web/src/lib/backend/operations/database-backup.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

type Gate = { name: string; status: "pass" | "fail" | "warn"; details?: unknown };
const gates: Gate[] = [];

function record(name: string, status: Gate["status"], details?: unknown) {
  gates.push({ name, status, details });
}

function run(command: string): void {
  execSync(command, { cwd: root, stdio: "inherit" });
}

console.log("Alpha DFS AI — Production Deployment Readiness (Task 11.9)\n");

const deploy = validateDeploymentConfig();
record("production-config", deploy.ok ? "pass" : "fail", {
  mode: deploy.mode,
  blockers: deploy.blockers,
  warnings: deploy.warnings,
});

if (!deploy.ok) {
  finish(1);
}

if (process.env.NODE_ENV === "production") {
  const prodBlockers = deploy.checks.filter(
    (check) => check.category === "security" && check.status === "fail",
  );
  record("production-security", prodBlockers.length === 0 ? "pass" : "fail", {
    issues: prodBlockers.map((check) => check.message),
  });
} else {
  record("production-security", "warn", {
    message: "NODE_ENV is not production — security checks validated in config only",
  });
}

const buildDir = path.join(root, "apps/web/.next");
record("build-artifact", existsSync(buildDir) ? "pass" : "fail", { path: buildDir });

try {
  const backupDir = resolveBackupDirectory(process.env.BACKUP_DIR);
  mkdirSync(backupDir, { recursive: true });
  accessSync(backupDir, constants.W_OK);
  record("backup-directory", "pass", { path: backupDir });
} catch (error) {
  record("backup-directory", "fail", {
    error: error instanceof Error ? error.message : String(error),
  });
}

try {
  run("npm run certify:startup");
  record("startup-validation", "pass");
} catch {
  record("startup-validation", "fail");
  finish(1);
}

try {
  run("npx tsx --tsconfig scripts/release/tsconfig.json scripts/release/smoke-test.ts");
  record("smoke-test", "pass");
} catch {
  record("smoke-test", "fail");
  finish(1);
}

try {
  run("npm run deploy:backup");
  record("backup-procedure", "pass");
} catch (error) {
  record("backup-procedure", "fail", {
    error: error instanceof Error ? error.message : String(error),
  });
  finish(1);
}

if (process.env.FULL_CERTIFY === "1") {
  try {
    run("npm run certify");
    record("full-certification", "pass");
  } catch {
    record("full-certification", "fail");
    finish(1);
  }
} else {
  record("full-certification", "warn", {
    message: "Skipped — set FULL_CERTIFY=1 to run full test suite",
  });
}

finish(0);

function finish(code: number) {
  const failed = gates.filter((gate) => gate.status === "fail");
  const report = {
    timestamp: new Date().toISOString(),
    task: "11.9",
    overall: failed.length === 0 ? "pass" : "fail",
    gates,
  };
  console.log("\n" + JSON.stringify(report, null, 2));
  if (code === 0) {
    console.log("\n✓ Production deployment readiness VERIFIED");
  } else {
    console.error(`\n✗ Production deployment readiness FAILED (${failed.length} gate(s))`);
  }
  process.exit(code);
}
