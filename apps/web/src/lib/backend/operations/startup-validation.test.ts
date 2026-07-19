import { beforeEach, describe, expect, it } from "vitest";
import { validateStartup } from "@/lib/backend/operations/startup-validation";
import {
  configureProviderFixtures,
  ensureTestDatabase,
  resetTestServiceCaches,
} from "@/test/helpers/database-setup";
import { resetOperationalStateForTest } from "@/test/helpers/operational-reset";

describe("startup validation", () => {
  beforeEach(async () => {
    resetTestServiceCaches();
    resetOperationalStateForTest();
    configureProviderFixtures();
    await ensureTestDatabase();
  });

  it("returns ready when config and dependencies are valid", async () => {
    const result = await validateStartup();
    expect(result.ok).toBe(true);
    expect(result.ready).toBe(true);
    expect(result.dependencies.database.status).toBe("up");
    expect(result.dependencies.engines.status).toBe("available");
  });

  it("includes observability configuration check", async () => {
    const result = await validateStartup();
    expect(
      result.checks.some(
        (check) => check.id === "dependency.observability" && check.status === "pass",
      ),
    ).toBe(true);
  });
});
