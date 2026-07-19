import type { PlayerAnalysisOutput } from "@alpha-dfs/shared";
import { FIXTURE_SLATE_PLAYERS, type FixturePlayerInput } from "./fixture-slate-players";
import {
  aggregateEvidenceSourceStatuses,
  computeEvidenceQualityScore,
  confidenceTierFromScore,
  evidenceSourcesFromDomains,
} from "./quality-score";

/** Assemble player evidence from slate player inputs — deterministic Evidence Engine. */
export function assemblePlayerEvidence(
  players: FixturePlayerInput[] = FIXTURE_SLATE_PLAYERS,
): PlayerAnalysisOutput {
  const assembled = players.map((player) => {
    const qualityScore = computeEvidenceQualityScore(player);
    const spread = player.ceiling - player.floor;
    const risk = spread > 18 ? "High" : spread > 12 ? "Moderate" : "Low";

    return {
      slatePlayerId: player.slatePlayerId,
      name: player.name,
      position: player.position,
      team: player.team,
      opponent: player.opponent,
      salary: player.salary,
      projection: player.projection,
      confidenceScore: qualityScore,
      confidenceTier: confidenceTierFromScore(qualityScore),
      risk,
      injuryStatus: player.injuryStatus,
      practiceStatus: player.practiceStatus,
      gameStatus: player.gameStatus,
      matchupSummary: `${player.team} vs ${player.opponent} — ${risk.toLowerCase()} variance matchup`,
      ownershipEstimate: Math.round(8 + qualityScore / 10),
      supportingRationale: `${player.name} — evidence quality ${qualityScore}/100 from ${evidenceSourcesFromDomains(player.domains).length} sources.`,
      evidenceSources: evidenceSourcesFromDomains(player.domains),
    };
  });

  const tierCounts = assembled.reduce(
    (acc, player) => {
      acc[player.confidenceTier] += 1;
      return acc;
    },
    { high: 0, moderate: 0, low: 0 },
  );

  return {
    totalPlayers: assembled.length,
    highConfidencePlayers: tierCounts.high,
    moderateConfidencePlayers: tierCounts.moderate,
    lowConfidencePlayers: tierCounts.low,
    players: assembled,
    evidenceSourceStatuses: aggregateEvidenceSourceStatuses(players),
  };
}

export { FIXTURE_SLATE_PLAYERS } from "./fixture-slate-players";
