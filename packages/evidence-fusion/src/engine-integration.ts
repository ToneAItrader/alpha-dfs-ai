import type {
  AdiEvidenceType,
  AdiNormalizedEvidenceBundle,
} from "@alpha-dfs/shared";
import { getFusedSubject } from "./fuse-evidence";
import {
  adiDirectionToInjuryStatus,
  collectProvenance,
  emptyAdiMeta,
  getSubjectItems,
  mergeAdiMeta,
  multiSourceConfidenceMultiplier,
  type AdiEngineOverlayMeta,
} from "./engine-overlays";

export { getFusedSubject } from "./fuse-evidence";
export * from "./engine-overlays";

const INJURY_TYPES: AdiEvidenceType[] = ["injury_status", "practice_report", "game_status"];
const VEGAS_TYPES: AdiEvidenceType[] = ["line_movement", "implied_total", "sharp_indicator"];

export type InjuryPlayerAdiInput = {
  slatePlayerId: string;
  injuryStatus: "healthy" | "questionable" | "doubtful" | "out" | "unknown";
  practiceStatus?: string;
  gameStatus?: string;
};

export function applyInjuryAdiOverlay<T extends InjuryPlayerAdiInput>(
  players: T[],
  bundle: AdiNormalizedEvidenceBundle | undefined,
): { players: T[]; meta: AdiEngineOverlayMeta } {
  if (!bundle) {
    return { players, meta: emptyAdiMeta() };
  }

  let meta = emptyAdiMeta();
  let appliedCount = 0;

  const overlayPlayers = players.map((player) => {
    const subject = getFusedSubject(bundle, player.slatePlayerId);
    const items = getSubjectItems(subject, INJURY_TYPES);
    if (items.length === 0) return player;

    const topItem = [...items].sort((a, b) => b.confidence - a.confidence)[0];
    if (!topItem || topItem.confidence < 0.55) return player;

    const mappedStatus = adiDirectionToInjuryStatus(topItem.direction);
    if (!mappedStatus) return player;

    appliedCount += 1;
    meta = mergeAdiMeta(meta, {
      adiApplied: true,
      adiNotes: [],
      confidenceMultiplier: multiSourceConfidenceMultiplier(subject?.sourceCoverage ?? []),
      provenanceRefs: collectProvenance(items),
    });

    return {
      ...player,
      injuryStatus: mappedStatus,
      practiceStatus: topItem.evidenceType === "practice_report" ? topItem.claim : player.practiceStatus,
      gameStatus: topItem.evidenceType === "game_status" ? topItem.claim : player.gameStatus,
    };
  });

  if (appliedCount > 0) {
    meta.adiNotes.push(`ADI injury overlay applied to ${appliedCount} player(s)`);
    meta.adiApplied = true;
  }

  if (bundle.degradationNotes.length > 0) {
    meta.confidenceMultiplier = Math.min(meta.confidenceMultiplier, 0.95);
    meta.adiNotes.push(...bundle.degradationNotes.slice(0, 1));
  }

  return { players: overlayPlayers, meta };
}

export type VegasGameAdiInput = {
  home: string;
  away: string;
  total?: number;
  lineMovement?: number;
  gameKey?: string;
};

export function applyVegasAdiOverlay<T extends VegasGameAdiInput>(
  games: T[],
  bundle: AdiNormalizedEvidenceBundle | undefined,
): { games: T[]; meta: AdiEngineOverlayMeta } {
  if (!bundle) {
    return { games, meta: emptyAdiMeta() };
  }

  let meta = emptyAdiMeta();
  let appliedCount = 0;

  const overlayGames = games.map((game) => {
    const gameKey = game.gameKey ?? `${game.home}-${game.away}`;
    const subject = getFusedSubject(bundle, gameKey);
    const items = getSubjectItems(subject, VEGAS_TYPES);
    if (items.length === 0) return game;

    let total = game.total;
    let lineMovement = game.lineMovement;

    for (const item of items) {
      if (item.evidenceType === "implied_total" && item.magnitude !== undefined) {
        total = item.magnitude;
      }
      if (item.evidenceType === "line_movement" && item.magnitude !== undefined) {
        lineMovement = item.magnitude;
      }
    }

    appliedCount += 1;
    meta = mergeAdiMeta(meta, {
      adiApplied: true,
      adiNotes: [],
      confidenceMultiplier: multiSourceConfidenceMultiplier(subject?.sourceCoverage ?? []),
      provenanceRefs: collectProvenance(items),
    });

    return { ...game, total, lineMovement };
  });

  if (appliedCount > 0) {
    meta.adiNotes.push(`ADI Vegas overlay applied to ${appliedCount} game(s)`);
    meta.adiApplied = true;
  }

  return { games: overlayGames, meta };
}
