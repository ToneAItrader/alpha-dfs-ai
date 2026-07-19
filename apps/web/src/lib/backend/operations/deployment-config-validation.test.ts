import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { validateDeploymentConfig } from "@/lib/backend/operations/deployment-config-validation";

const ORIGINAL_ENV = { ...process.env };

describe("deployment config validation", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("fails when DATABASE_URL is missing", () => {
    delete process.env.DATABASE_URL;
    const result = validateDeploymentConfig();
    expect(result.ok).toBe(false);
    expect(result.blockers.some((message) => message.includes("DATABASE_URL"))).toBe(true);
  });

  it("passes with database and live provider API credentials", () => {
    process.env.DATABASE_URL = "file:./test.db";
    process.env.DRAFTKINGS_API_URL = "https://example.com/slate";
    process.env.DRAFTKINGS_API_KEY = "test-key";
    process.env.PROJECTION_API_URL = "https://example.com/projections";
    process.env.PROJECTION_API_KEY = "test-key";
    delete process.env.DRAFTKINGS_EXPORT_PATH;
    delete process.env.PROJECTION_EXPORT_PATH;
    process.env.CONNECTOR_MODE = "live";

    const result = validateDeploymentConfig();
    expect(result.ok).toBe(true);
    expect(result.mode.connector).toBe("live");
  });

  it("warns on seed mode in non-production", () => {
    process.env.DATABASE_URL = "file:./test.db";
    process.env.CONNECTOR_MODE = "seed";
    process.env.NODE_ENV = "development";

    const result = validateDeploymentConfig();
    expect(result.checks.some((check) => check.id === "config.connector_mode" && check.status === "warn")).toBe(
      true,
    );
  });

  it("fails when API URL is set without API key", () => {
    process.env.DATABASE_URL = "file:./test.db";
    process.env.DRAFTKINGS_API_URL = "https://example.com";
    delete process.env.DRAFTKINGS_API_KEY;

    const result = validateDeploymentConfig();
    expect(result.ok).toBe(false);
    expect(result.blockers.some((message) => message.includes("DRAFTKINGS_API_KEY"))).toBe(true);
  });

  it("fails seed mode in production", () => {
    process.env.DATABASE_URL = "file:./test.db";
    process.env.CONNECTOR_MODE = "seed";
    process.env.NODE_ENV = "production";

    const result = validateDeploymentConfig();
    expect(result.ok).toBe(false);
  });
});
