import type { EvidenceFetchContext } from "@alpha-dfs/adi-platform";
import type { AdiEvidencePackage, AdiEvidenceItem } from "@alpha-dfs/shared";
import { createSeedEvidenceProvider, type SeedProviderConfig } from "../shared/create-seed-provider";
import { buildEvidenceItem, buildEvidencePackage } from "../shared/package-builder";
import { resolvePlayerSubjectId } from "../shared/player-resolver";

type SocialFixture = {
  signals: Array<{
    sourceId: string;
    playerName: string;
    team: string;
    sentiment: number;
    postCount: number;
    rumorKeywords: number;
    confidence: number;
  }>;
};

const MIN_POST_THRESHOLD = 5;

function normalizeSocial(fixture: SocialFixture, context: EvidenceFetchContext): AdiEvidencePackage[] {
  const packages: AdiEvidencePackage[] = [];

  for (const [index, signal] of fixture.signals.entries()) {
    if (signal.postCount < MIN_POST_THRESHOLD) {
      continue;
    }

    const subjectId = resolvePlayerSubjectId(
      context,
      signal.playerName,
      signal.team,
      `${signal.team}-${signal.playerName}`.toLowerCase().replace(/\s+/g, "-"),
    );

    const rumorPenalty = signal.rumorKeywords > 0 ? 0.25 : 0;
    const confidence = Math.max(0.1, signal.confidence - rumorPenalty);
    const items: AdiEvidenceItem[] = [
      buildEvidenceItem({
        itemId: `${signal.sourceId}-sentiment-${index}`,
        evidenceType: "social_sentiment",
        subjectType: "player",
        subjectId,
        claim: `Social sentiment score ${signal.sentiment.toFixed(2)}`,
        direction: signal.sentiment >= 0 ? "positive" : "negative",
        magnitude: signal.sentiment,
        confidence,
      }),
    ];

    if (signal.rumorKeywords > 0) {
      items.push(
        buildEvidenceItem({
          itemId: `${signal.sourceId}-rumor-${index}`,
          evidenceType: "rumor_confidence",
          subjectType: "player",
          subjectId,
          claim: "Rumor keywords detected in social volume",
          direction: "negative",
          confidence: Math.max(0.1, 1 - rumorPenalty),
        }),
      );
    }

    packages.push(
      buildEvidencePackage({
        packageId: `social-pkg-${context.runId}-${index}`,
        sourceId: signal.sourceId,
        sourceVersion: "1.0.0",
        slateId: context.slateId,
        runId: context.runId,
        items,
        providerConfidence: confidence,
      }),
    );
  }

  return packages;
}

export function createSocialProvider(
  overrides?: Partial<SeedProviderConfig<SocialFixture>>,
) {
  return createSeedEvidenceProvider<SocialFixture>({
    providerId: "social",
    providerVersion: "1.0.0",
    domains: ["social"],
    priority: "P1",
    fixtureFile: "social-seed.json",
    normalize: normalizeSocial,
    ...overrides,
  });
}
