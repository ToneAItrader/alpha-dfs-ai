import type { AdiNormalizedEvidence, AdiNormalizedEvidenceBundle } from "@alpha-dfs/shared";
import { FUSION_VERSION } from "./constants";
import {
  aggregateSubjects,
  computePlatformConfidence,
} from "./aggregate-subjects";
import { dedupeNoteCount, deduplicateItems } from "./deduplicate-items";
import { expireItems } from "./expire-items";
import { countConflicts, resolveConflicts } from "./resolve-conflicts";
import type { FuseEvidenceInput, FuseEvidenceResult } from "./types";
import {
  collectValidationNotes,
  filterValidPackages,
  validatePackages,
} from "./validate-packages";
import { weightItems } from "./weight-items";

function emptyBundle(context: FuseEvidenceInput["context"], notes: string[]): AdiNormalizedEvidenceBundle {
  return {
    bundleId: `bundle-${context.runId}`,
    runId: context.runId,
    slateId: context.slateId,
    fusedAt: context.fusedAt ?? new Date().toISOString(),
    version: FUSION_VERSION,
    subjects: [],
    platformConfidence: 0,
    degradationNotes: notes,
  };
}

export function fuseEvidence(input: FuseEvidenceInput): FuseEvidenceResult {
  const { packages, registry, context } = input;
  const nowMs = context.fusedAt ? Date.parse(context.fusedAt) : Date.now();
  const degradationNotes: string[] = [];

  const validated = validatePackages(packages);
  degradationNotes.push(...collectValidationNotes(validated));
  const validPackages = filterValidPackages(validated);

  if (validPackages.length === 0) {
    degradationNotes.push("No valid evidence packages to fuse");
    return {
      bundle: emptyBundle(context, degradationNotes),
      metrics: { itemsIn: 0, itemsOut: 0, conflictCount: 0 },
    };
  }

  const itemsIn = validPackages.reduce((sum, pkg) => sum + pkg.items.length, 0);
  const { active, expired } = expireItems(validPackages, nowMs);
  if (expired.length > 0) {
    degradationNotes.push(`Expired ${expired.length} evidence item(s)`);
  }

  const beforeDedupe = active.length;
  const deduped = deduplicateItems(active);
  const dedupeNote = dedupeNoteCount(beforeDedupe, deduped.length);
  if (dedupeNote) {
    degradationNotes.push(dedupeNote);
  }

  const weighted = weightItems(deduped, registry, nowMs);
  const { items: resolvedItems, conflicts, confidencePenalty } = resolveConflicts(weighted);
  if (conflicts.length > 0) {
    degradationNotes.push(`Resolved ${conflicts.length} evidence conflict(s)`);
  }

  const subjects = aggregateSubjects(
    resolvedItems,
    conflicts,
    context.topNPerType,
    confidencePenalty,
  );

  const bundleSubjects = subjects.map(({ qualityScore: _qualityScore, ...subject }) => subject);

  const bundle: AdiNormalizedEvidenceBundle = {
    bundleId: `bundle-${context.runId}`,
    runId: context.runId,
    slateId: context.slateId,
    fusedAt: context.fusedAt ?? new Date(nowMs).toISOString(),
    version: FUSION_VERSION,
    subjects: bundleSubjects,
    platformConfidence: computePlatformConfidence(subjects),
    degradationNotes,
  };

  const itemsOut = bundleSubjects.reduce((sum, subject) => sum + subject.items.length, 0);

  return {
    bundle,
    metrics: {
      itemsIn,
      itemsOut,
      conflictCount: countConflicts(conflicts),
    },
  };
}

export function getFusedSubject(
  bundle: AdiNormalizedEvidenceBundle | undefined,
  subjectId: string,
): AdiNormalizedEvidence | undefined {
  return bundle?.subjects.find((subject) => subject.subjectId === subjectId);
}
