import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

export default function globalSetup() {
  const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const dbPath = path.join(root, "packages/database/prisma/test.db");
  const databaseUrl = `file:${dbPath}`;

  process.env.DRAFTKINGS_EXPORT_PATH =
    process.env.DRAFTKINGS_EXPORT_PATH ??
    path.join(root, "packages/connectors/fixtures/draftkings-classic-export.json");
  process.env.PROJECTION_EXPORT_PATH =
    process.env.PROJECTION_EXPORT_PATH ??
    path.join(root, "packages/connectors/fixtures/projection-export.json");
  process.env.CONNECTOR_MODE = process.env.CONNECTOR_MODE ?? "live";
  process.env.SIMULATION_FIELD_SIZE = process.env.SIMULATION_FIELD_SIZE ?? "50";
  process.env.SIMULATION_COUNT = process.env.SIMULATION_COUNT ?? "100";

  execSync("npx prisma db push --skip-generate", {
    cwd: path.join(root, "packages/database"),
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: "pipe",
  });
}
