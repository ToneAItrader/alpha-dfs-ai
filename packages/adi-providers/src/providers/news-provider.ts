import type { EvidenceFetchContext } from "@alpha-dfs/adi-platform";
import type { AdiEvidencePackage, AdiEvidenceItem } from "@alpha-dfs/shared";
import { createSeedEvidenceProvider, type SeedProviderConfig } from "../shared/create-seed-provider";
import { buildEvidenceItem, buildEvidencePackage } from "../shared/package-builder";
import { dropUnresolvedItems, resolvePlayerSubjectId } from "../shared/player-resolver";

type NewsFixture = {
  headlines: Array<{
    sourceId: string;
    playerName: string;
    team: string;
    evidenceType: AdiEvidenceItem["evidenceType"];
    claim: string;
    direction?: AdiEvidenceItem["direction"];
    confidence: number;
  }>;
};

function normalizeNews(fixture: NewsFixture, context: EvidenceFetchContext): AdiEvidencePackage[] {
  const bySource = new Map<string, AdiEvidenceItem[]>();

  for (const [index, headline] of fixture.headlines.entries()) {
    const subjectId = resolvePlayerSubjectId(
      context,
      headline.playerName,
      headline.team,
      `${headline.team}-${headline.playerName}`.toLowerCase().replace(/\s+/g, "-"),
    );
    if (!subjectId) continue;

    const item = buildEvidenceItem({
      itemId: `${headline.sourceId}-${index}`,
      evidenceType: headline.evidenceType,
      subjectType: "player",
      subjectId,
      claim: headline.claim,
      direction: headline.direction,
      confidence: headline.confidence,
    });

    const items = bySource.get(headline.sourceId) ?? [];
    items.push(item);
    bySource.set(headline.sourceId, items);
  }

  return [...bySource.entries()].map(([sourceId, items], index) =>
    buildEvidencePackage({
      packageId: `news-pkg-${context.runId}-${index}`,
      sourceId,
      sourceVersion: "1.0.0",
      slateId: context.slateId,
      runId: context.runId,
      items: dropUnresolvedItems(items),
      providerConfidence: Math.max(...items.map((item) => item.confidence), 0),
    }),
  );
}

export function createNewsProvider(
  overrides?: Partial<SeedProviderConfig<NewsFixture>>,
) {
  return createSeedEvidenceProvider<NewsFixture>({
    providerId: "news",
    providerVersion: "1.0.0",
    domains: ["news"],
    priority: "P0",
    fixtureFile: "news-seed.json",
    normalize: normalizeNews,
    ...overrides,
  });
}
