import type { EvidenceFetchContext } from "@alpha-dfs/adi-platform";
import type { AdiEvidencePackage, AdiEvidenceItem } from "@alpha-dfs/shared";
import { createSeedEvidenceProvider, type SeedProviderConfig } from "../shared/create-seed-provider";
import { buildEvidenceItem, buildEvidencePackage } from "../shared/package-builder";
import { resolveGameSubjectId } from "../shared/player-resolver";

type SportsbookFixture = {
  lines: Array<{
    sourceId: string;
    gameKey: string;
    homeTeam: string;
    awayTeam: string;
    total: number;
    spread: number;
    openSpread: number;
    confidence: number;
  }>;
};

function normalizeSportsbook(
  fixture: SportsbookFixture,
  context: EvidenceFetchContext,
): AdiEvidencePackage[] {
  return fixture.lines.map((line, index) => {
    const subjectId = resolveGameSubjectId(context, line.gameKey, line.gameKey);
    const lineMovement = line.spread - line.openSpread;
    const items: AdiEvidenceItem[] = [
      buildEvidenceItem({
        itemId: `${line.sourceId}-movement-${index}`,
        evidenceType: "line_movement",
        subjectType: "game",
        subjectId,
        claim: `Spread moved ${lineMovement.toFixed(1)} points`,
        direction: lineMovement > 0 ? "positive" : lineMovement < 0 ? "negative" : "neutral",
        magnitude: lineMovement,
        confidence: line.confidence,
      }),
      buildEvidenceItem({
        itemId: `${line.sourceId}-total-${index}`,
        evidenceType: "implied_total",
        subjectType: "game",
        subjectId,
        claim: `Implied total ${line.total}`,
        magnitude: line.total,
        confidence: line.confidence,
      }),
    ];

    return buildEvidencePackage({
      packageId: `sportsbook-pkg-${context.runId}-${index}`,
      sourceId: line.sourceId,
      sourceVersion: "1.0.0",
      slateId: context.slateId,
      runId: context.runId,
      items,
      providerConfidence: line.confidence,
    });
  });
}

export function createSportsbookProvider(
  overrides?: Partial<SeedProviderConfig<SportsbookFixture>>,
) {
  return createSeedEvidenceProvider<SportsbookFixture>({
    providerId: "sportsbook",
    providerVersion: "1.0.0",
    domains: ["sportsbook"],
    priority: "P0",
    fixtureFile: "sportsbook-seed.json",
    normalize: normalizeSportsbook,
    ...overrides,
  });
}
