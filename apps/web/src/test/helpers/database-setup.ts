import path from "path";
import { disconnectPrisma, getPrismaClient, seedDatabase } from "@alpha-dfs/database";
import { createLiveConnectorRegistry } from "@alpha-dfs/connectors";
import { createRefreshService } from "@/lib/backend/operations/refresh-service";
import {
  resetOperationalStateForTest,
  resetTestServiceCaches,
} from "@/test/helpers/operational-reset";

function testDatabaseUrl(): string {
  const dbPath = path.join(process.cwd(), "../../packages/database/prisma/test.db");
  return `file:${dbPath}`;
}

function monorepoRoot(): string {
  return path.join(process.cwd(), "../..");
}

/** Configure live provider fixtures for integration tests. */
export function configureProviderFixtures(): void {
  const root = monorepoRoot();
  process.env.DRAFTKINGS_EXPORT_PATH = path.join(
    root,
    "packages/connectors/fixtures/draftkings-classic-export.json",
  );
  process.env.PROJECTION_EXPORT_PATH = path.join(
    root,
    "packages/connectors/fixtures/projection-export.json",
  );
  process.env.INJURY_EXPORT_PATH = path.join(
    root,
    "packages/connectors/fixtures/injury-export.json",
  );
  process.env.VEGAS_ODDS_EXPORT_PATH = path.join(
    root,
    "packages/connectors/fixtures/vegas-odds-export.json",
  );
  process.env.WEATHER_EXPORT_PATH = path.join(
    root,
    "packages/connectors/fixtures/weather-export.json",
  );
  process.env.CONNECTOR_MODE = "live";
}

/** Ensure SQLite test database is populated via live provider refresh. */
export async function ensureTestDatabase(): Promise<{ slateId: string; slateLabel: string }> {
  process.env.ALPHA_DFS_TEST_DB = "true";
  process.env.DATABASE_URL = testDatabaseUrl();
  configureProviderFixtures();
  resetTestServiceCaches();
  resetOperationalStateForTest();
  await disconnectPrisma();

  const client = getPrismaClient();
  const refreshService = createRefreshService(client, createLiveConnectorRegistry());
  const refreshResult = await refreshService.refresh({ runId: "test-setup" });

  if (refreshResult.ok) {
    const slate = await client.slate.findUnique({
      where: { id: refreshResult.slateId },
    });
    return {
      slateId: refreshResult.slateId,
      slateLabel: slate?.name ?? "Test Slate",
    };
  }

  const slateId = await seedDatabase(client);
  const slate = await client.slate.findUnique({ where: { id: slateId } });
  return { slateId, slateLabel: slate?.name ?? "Test Slate" };
}

export { resetTestServiceCaches, resetTestServiceCaches as resetTestDatabaseFlag } from "@/test/helpers/operational-reset";
