import type { EvidenceFetchContext } from "@alpha-dfs/adi-platform";
import type { AdiEvidencePackage, AdiEvidenceItem } from "@alpha-dfs/shared";
import { createSeedEvidenceProvider, type SeedProviderConfig } from "../shared/create-seed-provider";
import { buildEvidenceItem, buildEvidencePackage } from "../shared/package-builder";

type HistoricalFixture = {
  reliability: Array<{
    sourceId: string;
    sampleCount: number;
    accuracyScore: number;
    weight: number;
  }>;
};

const MIN_SAMPLE_SIZE = 30;

function normalizeHistorical(
  fixture: HistoricalFixture,
  context: EvidenceFetchContext,
): AdiEvidencePackage[] {
  const items: AdiEvidenceItem[] = [];

  for (const [index, record] of fixture.reliability.entries()) {
    if (record.sampleCount < MIN_SAMPLE_SIZE) {
      continue;
    }

    items.push(
      buildEvidenceItem({
        itemId: `historical-${record.sourceId}-${index}`,
        evidenceType: "source_reliability",
        subjectType: "slate",
        subjectId: context.slateId,
        claim: `Source reliability for ${record.sourceId}`,
        magnitude: record.weight,
        confidence: record.accuracyScore,
      }),
    );
  }

  if (items.length === 0) {
    return [];
  }

  return [
    buildEvidencePackage({
      packageId: `historical-pkg-${context.runId}`,
      sourceId: "historical_learning-internal",
      sourceVersion: "1.0.0",
      slateId: context.slateId,
      runId: context.runId,
      items,
      providerConfidence: 1,
      metadata: { mode: "seed" },
    }),
  ];
}

export function createHistoricalLearningProvider(
  overrides?: Partial<SeedProviderConfig<HistoricalFixture>>,
) {
  return createSeedEvidenceProvider<HistoricalFixture>({
    providerId: "historical_learning",
    providerVersion: "1.0.0",
    domains: ["historical_learning"],
    priority: "P2",
    fixtureFile: "historical-seed.json",
    normalize: normalizeHistorical,
    ...overrides,
  });
}
