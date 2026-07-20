import type { AdiEvidencePackage, AdiNormalizedEvidenceBundle } from "@alpha-dfs/shared";
import { fuseEvidence } from "@alpha-dfs/evidence-fusion";
import type { SourceRegistry } from "./source-registry";
import {
  recordEvidenceFreshness,
  recordFusionConflict,
  recordFusionItems,
} from "./metrics";

export type FusionAgentInput = {
  runId: string;
  slateId: string;
  packages: AdiEvidencePackage[];
  registry: SourceRegistry;
  fusedAt?: string;
};

export type FusionAgentResult = {
  bundle: AdiNormalizedEvidenceBundle;
  conflictCount: number;
};

export function runFusionAgent(input: FusionAgentInput): FusionAgentResult {
  const { bundle, metrics } = fuseEvidence({
    packages: input.packages,
    registry: input.registry,
    context: {
      runId: input.runId,
      slateId: input.slateId,
      fusedAt: input.fusedAt,
    },
  });

  recordFusionItems(metrics.itemsIn, metrics.itemsOut);
  for (let index = 0; index < metrics.conflictCount; index += 1) {
    recordFusionConflict();
  }

  const ageMs = Date.parse(bundle.fusedAt) - Date.now();
  recordEvidenceFreshness(Math.abs(ageMs));

  return {
    bundle,
    conflictCount: metrics.conflictCount,
  };
}
