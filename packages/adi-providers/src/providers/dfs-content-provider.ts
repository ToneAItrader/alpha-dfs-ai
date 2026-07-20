import type { EvidenceFetchContext } from "@alpha-dfs/adi-platform";
import type { AdiEvidencePackage, AdiEvidenceItem } from "@alpha-dfs/shared";
import { createSeedEvidenceProvider, type SeedProviderConfig } from "../shared/create-seed-provider";
import { buildEvidenceItem, buildEvidencePackage } from "../shared/package-builder";
import { resolvePlayerSubjectId } from "../shared/player-resolver";

type DfsContentFixture = {
  articles: Array<{
    sourceId: string;
    playerName: string;
    team: string;
    chalkProbability?: number;
    leverageSignal?: number;
    stackRecommendation?: string;
    siteTier: number;
    confidence: number;
  }>;
};

function normalizeDfsContent(
  fixture: DfsContentFixture,
  context: EvidenceFetchContext,
): AdiEvidencePackage[] {
  return fixture.articles.map((article, index) => {
    const subjectId = resolvePlayerSubjectId(
      context,
      article.playerName,
      article.team,
      `${article.team}-${article.playerName}`.toLowerCase().replace(/\s+/g, "-"),
    );

    const confidence = article.confidence * (article.siteTier ?? 1);
    const items: AdiEvidenceItem[] = [];

    if (article.chalkProbability !== undefined) {
      items.push(
        buildEvidenceItem({
          itemId: `${article.sourceId}-chalk-${index}`,
          evidenceType: "chalk_probability",
          subjectType: "player",
          subjectId,
          claim: `Chalk probability ${article.chalkProbability}`,
          magnitude: article.chalkProbability,
          confidence,
        }),
      );
    }

    if (article.leverageSignal !== undefined) {
      items.push(
        buildEvidenceItem({
          itemId: `${article.sourceId}-leverage-${index}`,
          evidenceType: "leverage_signal",
          subjectType: "player",
          subjectId,
          claim: `Leverage signal ${article.leverageSignal}`,
          magnitude: article.leverageSignal,
          confidence,
        }),
      );
    }

    if (article.stackRecommendation) {
      items.push(
        buildEvidenceItem({
          itemId: `${article.sourceId}-stack-${index}`,
          evidenceType: "stack_recommendation",
          subjectType: "team",
          subjectId: article.team,
          claim: article.stackRecommendation,
          direction: "positive",
          confidence,
        }),
      );
    }

    return buildEvidencePackage({
      packageId: `dfs-content-pkg-${context.runId}-${index}`,
      sourceId: article.sourceId,
      sourceVersion: "1.0.0",
      slateId: context.slateId,
      runId: context.runId,
      items,
      providerConfidence: confidence,
    });
  });
}

export function createDfsContentProvider(
  overrides?: Partial<SeedProviderConfig<DfsContentFixture>>,
) {
  return createSeedEvidenceProvider<DfsContentFixture>({
    providerId: "dfs_content",
    providerVersion: "1.0.0",
    domains: ["dfs_content"],
    priority: "P1",
    fixtureFile: "dfs-content-seed.json",
    normalize: normalizeDfsContent,
    ...overrides,
  });
}
