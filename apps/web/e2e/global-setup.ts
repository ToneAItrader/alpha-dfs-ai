import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { e2eDatabasePath, getE2eEnv, monorepoRoot } from "./fixtures/test-env";

export default async function globalSetup(): Promise<void> {
  if (existsSync(e2eDatabasePath)) {
    rmSync(e2eDatabasePath, { force: true });
  }

  const env = {
    ...process.env,
    ...getE2eEnv(),
  };

  execSync("npm run db:generate && npm run db:push && npm run db:seed", {
    cwd: monorepoRoot,
    env,
    stdio: "inherit",
  });
}

// Ensure Playwright resolves setup relative to apps/web.
void path.resolve(process.cwd());
