import type {
  AdiEvidenceItem,
  AdiEvidenceType,
  AdiNormalizedEvidence,
  AdiNormalizedEvidenceBundle,
} from "@alpha-dfs/shared";

export type AdiEngineOverlayMeta = {
  adiApplied: boolean;
  adiNotes: string[];
  /** Multiplier in (0, 1] — engines reduce confidence only per ADR-020. */
  confidenceMultiplier: number;
  provenanceRefs: string[];
};

export function emptyAdiMeta(): AdiEngineOverlayMeta {
  return {
    adiApplied: false,
    adiNotes: [],
    confidenceMultiplier: 1,
    provenanceRefs: [],
  };
}

export function mergeAdiMeta(base: AdiEngineOverlayMeta, extra: AdiEngineOverlayMeta): AdiEngineOverlayMeta {
  return {
    adiApplied: base.adiApplied || extra.adiApplied,
    adiNotes: [...base.adiNotes, ...extra.adiNotes],
    confidenceMultiplier: Math.min(base.confidenceMultiplier, extra.confidenceMultiplier),
    provenanceRefs: [...new Set([...base.provenanceRefs, ...extra.provenanceRefs])],
  };
}

export function getBundleDegradationNotes(bundle: AdiNormalizedEvidenceBundle | undefined): string[] {
  return bundle?.degradationNotes ?? [];
}

export function getSubjectItems(
  subject: AdiNormalizedEvidence | undefined,
  types: AdiEvidenceType[],
): AdiEvidenceItem[] {
  if (!subject) return [];
  const allowed = new Set(types);
  return subject.items.filter((item) => allowed.has(item.evidenceType));
}

export function collectProvenance(items: AdiEvidenceItem[]): string[] {
  return [...new Set(items.flatMap((item) => item.supportingRefs ?? [item.itemId]))];
}

export function confidenceFromBundle(bundle: AdiNormalizedEvidenceBundle | undefined): number {
  if (!bundle || bundle.subjects.length === 0) return 1;
  return Math.max(0.5, Math.min(1, bundle.platformConfidence));
}

export function multiSourceConfidenceMultiplier(sourceCoverage: string[]): number {
  if (sourceCoverage.length >= 2) return 1;
  if (sourceCoverage.length === 1) return 0.95;
  return 0.9;
}

export function adiDirectionToInjuryStatus(
  direction: AdiEvidenceItem["direction"],
): "healthy" | "questionable" | "doubtful" | "out" | "unknown" | undefined {
  if (direction === "positive") return "healthy";
  if (direction === "negative") return "questionable";
  return undefined;
}

export type ProjectionAdiAdjustment = {
  slatePlayerId: string;
  factor: number;
  note: string;
  provenanceRefs: string[];
};

export function buildProjectionAdiAdjustments(
  bundle: AdiNormalizedEvidenceBundle | undefined,
  playerIds: string[],
): { adjustments: ProjectionAdiAdjustment[]; meta: AdiEngineOverlayMeta } {
  if (!bundle) return { adjustments: [], meta: emptyAdiMeta() };

  const adjustments: ProjectionAdiAdjustment[] = [];
  const meta = emptyAdiMeta();
  const types: AdiEvidenceType[] = ["projection_delta", "consensus_projection"];

  for (const playerId of playerIds) {
    const subject = bundle.subjects.find((entry) => entry.subjectId === playerId);
    if (!subject) continue;

    const items = getSubjectItems(subject, types);
    if (items.length === 0) continue;

    const sourceMultiplier = multiSourceConfidenceMultiplier(subject.sourceCoverage);
    const avgConfidence =
      items.reduce((sum, item) => sum + item.confidence, 0) / Math.max(items.length, 1);
    const directionBias =
      items.some((item) => item.direction === "negative") && !items.some((item) => item.direction === "positive")
        ? -0.02
        : items.some((item) => item.direction === "positive")
          ? 0.01
          : 0;

    const factor = 1 + directionBias * avgConfidence * sourceMultiplier;
    const clampedFactor = Math.max(0.95, Math.min(1.03, factor));

    adjustments.push({
      slatePlayerId: playerId,
      factor: clampedFactor,
      note: `ADI projection overlay (${items.map((item) => item.evidenceType).join(", ")})`,
      provenanceRefs: collectProvenance(items),
    });
  }

  if (adjustments.length > 0) {
    meta.adiApplied = true;
    meta.adiNotes.push(`ADI projection adjustments for ${adjustments.length} player(s)`);
    meta.confidenceMultiplier = confidenceFromBundle(bundle);
    meta.provenanceRefs = collectProvenance(
      adjustments.flatMap((entry) =>
        entry.provenanceRefs.map((ref) => ({ itemId: ref } as AdiEvidenceItem)),
      ),
    );
  }

  if (bundle.degradationNotes.length > 0) {
    meta.confidenceMultiplier = Math.min(meta.confidenceMultiplier, 0.95);
    meta.adiNotes.push(...bundle.degradationNotes.slice(0, 2));
  }

  return { adjustments, meta };
}

export type OwnershipAdiHint = {
  slatePlayerId: string;
  chalkProbability?: number;
  leverageSignal?: number;
  socialSentiment?: number;
  provenanceRefs: string[];
};

export function buildOwnershipAdiHints(
  bundle: AdiNormalizedEvidenceBundle | undefined,
  playerIds: string[],
): { hints: OwnershipAdiHint[]; meta: AdiEngineOverlayMeta } {
  if (!bundle) return { hints: [], meta: emptyAdiMeta() };

  const hints: OwnershipAdiHint[] = [];
  const types: AdiEvidenceType[] = ["chalk_probability", "leverage_signal", "social_sentiment"];

  for (const playerId of playerIds) {
    const subject = bundle.subjects.find((entry) => entry.subjectId === playerId);
    if (!subject) continue;
    const items = getSubjectItems(subject, types);
    if (items.length === 0) continue;

    hints.push({
      slatePlayerId: playerId,
      chalkProbability: items.find((item) => item.evidenceType === "chalk_probability")?.magnitude,
      leverageSignal: items.find((item) => item.evidenceType === "leverage_signal")?.magnitude,
      socialSentiment: items.find((item) => item.evidenceType === "social_sentiment")?.magnitude,
      provenanceRefs: collectProvenance(items),
    });
  }

  const meta = emptyAdiMeta();
  if (hints.length > 0) {
    meta.adiApplied = true;
    meta.adiNotes.push(`ADI ownership hints for ${hints.length} player(s)`);
    meta.confidenceMultiplier = confidenceFromBundle(bundle);
    meta.provenanceRefs = [...new Set(hints.flatMap((hint) => hint.provenanceRefs))];
  }

  return { hints, meta };
}

export type SimulationAdiContext = {
  elevatedTotalGames: number;
  sharpSignals: number;
  notes: string[];
  provenanceRefs: string[];
};

export function buildSimulationAdiContext(
  bundle: AdiNormalizedEvidenceBundle | undefined,
): SimulationAdiContext & { meta: AdiEngineOverlayMeta } {
  if (!bundle) {
    return {
      elevatedTotalGames: 0,
      sharpSignals: 0,
      notes: [],
      provenanceRefs: [],
      meta: emptyAdiMeta(),
    };
  }

  let elevatedTotalGames = 0;
  let sharpSignals = 0;
  const notes: string[] = [];
  const provenanceRefs: string[] = [];

  for (const subject of bundle.subjects) {
    const totals = getSubjectItems(subject, ["implied_total"]);
    const sharps = getSubjectItems(subject, ["sharp_indicator"]);
    if (totals.some((item) => (item.magnitude ?? 0) >= 48)) {
      elevatedTotalGames += 1;
    }
    sharpSignals += sharps.length;
    provenanceRefs.push(...collectProvenance([...totals, ...sharps]));
  }

  if (elevatedTotalGames > 0) {
    notes.push(`${elevatedTotalGames} ADI game subject(s) with elevated implied totals`);
  }
  if (sharpSignals > 0) {
    notes.push(`${sharpSignals} ADI sharp indicator signal(s) observed`);
  }

  const meta = emptyAdiMeta();
  if (notes.length > 0) {
    meta.adiApplied = true;
    meta.adiNotes = notes;
    meta.confidenceMultiplier = confidenceFromBundle(bundle);
    meta.provenanceRefs = [...new Set(provenanceRefs)];
  }

  return { elevatedTotalGames, sharpSignals, notes, provenanceRefs: [...new Set(provenanceRefs)], meta };
}

export type PortfolioAdiBoost = {
  slatePlayerId: string;
  boost: number;
  reason: string;
  provenanceRefs: string[];
};

export function buildPortfolioAdiBoosts(
  bundle: AdiNormalizedEvidenceBundle | undefined,
  playerIds: string[],
): { boosts: PortfolioAdiBoost[]; meta: AdiEngineOverlayMeta } {
  if (!bundle) return { boosts: [], meta: emptyAdiMeta() };

  const boosts: PortfolioAdiBoost[] = [];
  for (const playerId of playerIds) {
    const subject = bundle.subjects.find((entry) => entry.subjectId === playerId);
    if (!subject) continue;

    const stacks = getSubjectItems(subject, ["stack_recommendation"]);
    const contrarian = getSubjectItems(subject, ["contrarian_signal"]);
    if (stacks.length === 0 && contrarian.length === 0) continue;

    const boost = stacks.length > 0 ? 0.03 : contrarian.length > 0 ? 0.02 : 0;
    boosts.push({
      slatePlayerId: playerId,
      boost,
      reason: stacks.length > 0 ? "stack_recommendation" : "contrarian_signal",
      provenanceRefs: collectProvenance([...stacks, ...contrarian]),
    });
  }

  const meta = emptyAdiMeta();
  if (boosts.length > 0) {
    meta.adiApplied = true;
    meta.adiNotes.push(`ADI portfolio boosts for ${boosts.length} player(s)`);
    meta.confidenceMultiplier = confidenceFromBundle(bundle);
    meta.provenanceRefs = [...new Set(boosts.flatMap((entry) => entry.provenanceRefs))];
  }

  return { boosts, meta };
}
