import type { EvidenceFetchContext } from "@alpha-dfs/adi-platform";
import type { AdiEvidencePackage, AdiEvidenceItem } from "@alpha-dfs/shared";
import { createSeedEvidenceProvider, type SeedProviderConfig } from "../shared/create-seed-provider";
import { buildEvidenceItem, buildEvidencePackage } from "../shared/package-builder";
import { resolvePlayerSubjectId } from "../shared/player-resolver";

type ConsensusFixture = {
  projections: Array<{
    sourceId: string;
    playerName: string;
    team: string;
    projection: number;
    sources: number;
    variance: number;
    confidence: number;
  }>;
};

const MIN_SOURCES = 2;

function normalizeConsensus(
  fixture: ConsensusFixture,
  context: EvidenceFetchContext,
): AdiEvidencePackage[] {
  const packages: AdiEvidencePackage[] = [];

  for (const [index, row] of fixture.projections.entries()) {
    if (row.sources < MIN_SOURCES) {
      continue;
    }

    const subjectId = resolvePlayerSubjectId(
      context,
      row.playerName,
      row.team,
      `${row.team}-${row.playerName}`.toLowerCase().replace(/\s+/g, "-"),
    );

    const items: AdiEvidenceItem[] = [
      buildEvidenceItem({
        itemId: `${row.sourceId}-consensus-${index}`,
        evidenceType: "consensus_projection",
        subjectType: "player",
        subjectId,
        claim: `Consensus projection ${row.projection}`,
        magnitude: row.projection,
        confidence: row.confidence,
      }),
      buildEvidenceItem({
        itemId: `${row.sourceId}-variance-${index}`,
        evidenceType: "projection_variance",
        subjectType: "player",
        subjectId,
        claim: `Projection variance ${row.variance}`,
        magnitude: row.variance,
        confidence: row.confidence,
      }),
    ];

    packages.push(
      buildEvidencePackage({
        packageId: `consensus-pkg-${context.runId}-${index}`,
        sourceId: row.sourceId,
        sourceVersion: "1.0.0",
        slateId: context.slateId,
        runId: context.runId,
        items,
        providerConfidence: row.confidence,
        metadata: { sourceCount: String(row.sources) },
      }),
    );
  }

  return packages;
}

export function createConsensusProvider(
  overrides?: Partial<SeedProviderConfig<ConsensusFixture>>,
) {
  return createSeedEvidenceProvider<ConsensusFixture>({
    providerId: "consensus",
    providerVersion: "1.0.0",
    domains: ["consensus"],
    priority: "P0",
    fixtureFile: "consensus-seed.json",
    normalize: normalizeConsensus,
    ...overrides,
  });
}
