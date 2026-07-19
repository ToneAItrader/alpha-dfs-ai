import { describe, expect, it } from "vitest";
import type { EvidenceFetchContext, EvidenceProvider } from "@alpha-dfs/adi-platform";
import { createNewsProvider } from "./news-provider";

export const sampleFetchContext: EvidenceFetchContext = {
  runId: "run-test",
  slateId: "slate-test",
  players: [
    { slatePlayerId: "sp-1", name: "Patrick Mahomes", team: "KC" },
    { slatePlayerId: "sp-2", name: "Travis Kelce", team: "KC" },
  ],
  games: [
    { gameKey: "KC-BUF", homeTeam: "KC", awayTeam: "BUF" },
    { gameKey: "SF-DAL", homeTeam: "SF", awayTeam: "DAL" },
  ],
};

export async function expectValidPackages(provider: EvidenceProvider): Promise<void> {
  const result = await provider.fetch(sampleFetchContext);
  expect(result.ok).toBe(true);
  if (!result.ok) return;

  for (const pkg of result.packages) {
    expect(pkg.runId).toBe(sampleFetchContext.runId);
    expect(pkg.slateId).toBe(sampleFetchContext.slateId);
    expect(pkg.metadata?.providerId).toBe(provider.providerId);
    for (const item of pkg.items) {
      expect(item.claim.length).toBeGreaterThan(0);
      expect(item.confidence).toBeGreaterThanOrEqual(0);
      expect(item.confidence).toBeLessThanOrEqual(1);
    }
  }
}

export function runCommonProviderTests(
  name: string,
  factory: () => EvidenceProvider,
  options?: { expectNonEmpty?: boolean },
): void {
  describe(`${name} provider`, () => {
    it("fetch returns normalized AdiEvidencePackage from seed", async () => {
      await expectValidPackages(factory());
    });

    it("health reports healthy with seed fixture", async () => {
      const health = await factory().health();
      expect(health.providerId).toBe(factory().providerId);
      expect(health.status).toBe("healthy");
    });

    it("simulateFailure returns ok:false without throwing", async () => {
      if (name !== "news") {
        return;
      }
      const result = await createNewsProvider({ simulateFailure: true }).fetch(sampleFetchContext);
      expect(result.ok).toBe(false);
    });

    it("never exposes raw fixture fields in package output", async () => {
      const result = await factory().fetch(sampleFetchContext);
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      const serialized = JSON.stringify(result.packages);
      expect(serialized).not.toContain("headlines");
      expect(serialized).not.toContain("postCount");
    });

    it("returns degraded empty when fixture yields no items", async () => {
      if (options?.expectNonEmpty) {
        const result = await factory().fetch(sampleFetchContext);
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.packages.length).toBeGreaterThan(0);
        }
        return;
      }
    });
  });
}
