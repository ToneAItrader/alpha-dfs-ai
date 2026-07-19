import { describe, expect, it, vi } from "vitest";
import type { AdiEvidencePackage } from "@alpha-dfs/shared";
import { createConnectorManager } from "./connector-manager";
import { createSourceRegistry } from "./source-registry";
import type { EvidenceProvider } from "./provider-contract";

function createMockProvider(
  providerId: string,
  packages: AdiEvidencePackage[] = [],
  ok = true,
): EvidenceProvider {
  return {
    providerId,
    providerVersion: "1.0.0",
    domains: ["news"],
    async fetch() {
      if (!ok) {
        return {
          ok: false,
          error: { code: "FETCH_FAILED", message: "failed", providerId },
          retryable: true,
        };
      }
      return { ok: true, packages };
    },
    async health() {
      return {
        providerId,
        status: "healthy",
        lastCheckedAt: new Date().toISOString(),
      };
    },
  };
}

describe("connector manager", () => {
  it("registers providers and reports health", async () => {
    const registry = createSourceRegistry([]);
    const manager = createConnectorManager(registry);
    manager.register(createMockProvider("news"));

    const health = await manager.getHealth();
    expect(health).toHaveLength(1);
    expect(health[0]?.providerId).toBe("news");
  });

  it("fetchAll returns empty when no providers enabled", async () => {
    const registry = createSourceRegistry([]);
    const manager = createConnectorManager(registry);
    manager.register(createMockProvider("news"));

    const result = await manager.fetchAll({
      runId: "run-1",
      slateId: "slate-1",
      players: [],
      games: [],
    });

    expect(result).toEqual([]);
  });

  it("fetchAll collects packages from enabled providers", async () => {
    process.env.ADI_PROVIDER_NEWS_ENABLED = "true";
    const registry = createSourceRegistry([
      {
        providerId: "news",
        displayName: "News",
        version: "1.0.0",
        domains: ["news"],
        defaultWeight: 0.8,
        priority: "P0",
      },
    ]);
    const manager = createConnectorManager(registry);
    const pkg: AdiEvidencePackage = {
      packageId: "pkg-1",
      sourceId: "news-cbs",
      sourceVersion: "1.0.0",
      fetchedAt: new Date().toISOString(),
      ttlSeconds: 60,
      slateId: "slate-1",
      runId: "run-1",
      items: [],
      providerConfidence: 0.9,
    };
    manager.register(createMockProvider("news", [pkg]));

    const result = await manager.fetchAll({
      runId: "run-1",
      slateId: "slate-1",
      players: [],
      games: [],
    });

    expect(result).toHaveLength(1);
    delete process.env.ADI_PROVIDER_NEWS_ENABLED;
  });

  it("fetchAll continues when a provider fails", async () => {
    process.env.ADI_PROVIDER_NEWS_ENABLED = "true";
    process.env.ADI_PROVIDER_SOCIAL_ENABLED = "true";
    const registry = createSourceRegistry([
      {
        providerId: "news",
        displayName: "News",
        version: "1.0.0",
        domains: ["news"],
        defaultWeight: 0.8,
        priority: "P0",
      },
      {
        providerId: "social",
        displayName: "Social",
        version: "1.0.0",
        domains: ["social"],
        defaultWeight: 0.7,
        priority: "P1",
      },
    ]);
    const manager = createConnectorManager(registry);
    manager.register(createMockProvider("news", [], false));
    manager.register(createMockProvider("social", []));

    const result = await manager.fetchAll({
      runId: "run-1",
      slateId: "slate-1",
      players: [],
      games: [],
    });

    expect(result).toEqual([]);
    delete process.env.ADI_PROVIDER_NEWS_ENABLED;
    delete process.env.ADI_PROVIDER_SOCIAL_ENABLED;
  });
});

describe("connector manager stub", () => {
  it("returns empty packages in M4 stub mode", async () => {
    const { createConnectorManagerStub } = await import("./connector-manager");
    const stub = createConnectorManagerStub();
    const result = await stub.fetchAll({
      runId: "run-1",
      slateId: "slate-1",
      players: [],
      games: [],
    });
    expect(result).toEqual([]);
  });
});
