import { describe, expect, it } from "vitest";
import type { AdiEvidencePackage } from "@alpha-dfs/shared";
import { createEvidenceCache } from "./evidence-cache";

const samplePackage = (runId: string): AdiEvidencePackage => ({
  packageId: "pkg-1",
  sourceId: "news-cbs",
  sourceVersion: "1.0.0",
  fetchedAt: new Date().toISOString(),
  ttlSeconds: 60,
  slateId: "slate-1",
  runId,
  items: [],
  providerConfidence: 0.8,
});

describe("evidence cache", () => {
  it("stores and retrieves packages for a run", () => {
    const cache = createEvidenceCache();
    const packages = [samplePackage("run-1")];
    cache.set("run-1", packages, 60);
    expect(cache.get("run-1")).toEqual(packages);
  });

  it("expires entries after ttl", () => {
    const cache = createEvidenceCache();
    cache.set("run-1", [samplePackage("run-1")], 0);
    expect(cache.get("run-1")).toBeUndefined();
  });

  it("clears a single run", () => {
    const cache = createEvidenceCache();
    cache.set("run-1", [samplePackage("run-1")], 60);
    cache.clear("run-1");
    expect(cache.get("run-1")).toBeUndefined();
  });
});
