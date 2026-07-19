import type { EvidenceFetchContext } from "@alpha-dfs/adi-platform";
import type { AdiEvidencePackage, AdiEvidenceItem } from "@alpha-dfs/shared";
import { createSeedEvidenceProvider, type SeedProviderConfig } from "../shared/create-seed-provider";
import { buildEvidenceItem, buildEvidencePackage } from "../shared/package-builder";
import { resolveGameSubjectId, resolvePlayerSubjectId } from "../shared/player-resolver";

type BettingFixture = {
  picks: Array<{
    sourceId: string;
    gameKey?: string;
    homeTeam?: string;
    awayTeam?: string;
    playerName?: string;
    team?: string;
    expertCount: number;
    direction: AdiEvidenceItem["direction"];
    pickSide?: string;
    confidence: number;
  }>;
};

const MIN_EXPERT_COUNT = 3;

function normalizeBetting(fixture: BettingFixture, context: EvidenceFetchContext): AdiEvidencePackage[] {
  const packages: AdiEvidencePackage[] = [];

  for (const [index, pick] of fixture.picks.entries()) {
    if (pick.expertCount < MIN_EXPERT_COUNT) {
      continue;
    }

    const subjectType = pick.gameKey ? "game" : "player";
    const subjectId = pick.gameKey
      ? resolveGameSubjectId(context, pick.gameKey, pick.gameKey)
      : resolvePlayerSubjectId(
          context,
          pick.playerName ?? "unknown",
          pick.team ?? "UNK",
          `${pick.team}-${pick.playerName}`.toLowerCase().replace(/\s+/g, "-"),
        );

    packages.push(
      buildEvidencePackage({
        packageId: `betting-pkg-${context.runId}-${index}`,
        sourceId: pick.sourceId,
        sourceVersion: "1.0.0",
        slateId: context.slateId,
        runId: context.runId,
        items: [
          buildEvidenceItem({
            itemId: `${pick.sourceId}-narrative-${index}`,
            evidenceType: "narrative_confidence",
            subjectType,
            subjectId,
            claim: `Expert pick consensus (${pick.expertCount})`,
            direction: pick.direction,
            confidence: pick.confidence,
          }),
        ],
        providerConfidence: pick.confidence,
        metadata: { expertCount: String(pick.expertCount) },
      }),
    );
  }

  return packages;
}

export function createBettingProvider(
  overrides?: Partial<SeedProviderConfig<BettingFixture>>,
) {
  return createSeedEvidenceProvider<BettingFixture>({
    providerId: "betting",
    providerVersion: "1.0.0",
    domains: ["betting"],
    priority: "P1",
    fixtureFile: "betting-seed.json",
    normalize: normalizeBetting,
    ...overrides,
  });
}
