import type { FixturePlayerInput } from "./fixture-slate-players";

/** Deterministic evidence quality score (0–100) per Evidence Engine spec. */
export function computeEvidenceQualityScore(player: FixturePlayerInput): number {
  const { domains } = player;
  let score = 0;

  if (domains.statistical) score += 30;
  if (domains.injury) score += 15;
  if (domains.expert) score += 15;
  if (domains.market) score += 5;
  if (domains.weather) score += 5;
  if (domains.community) score += 5;

  // Freshness proxy — fixture data treated as current
  score += 20;

  // No critical gaps when statistical + injury present
  if (domains.statistical && domains.injury) score += 5;

  return Math.min(100, score);
}

export function confidenceTierFromScore(score: number): "high" | "moderate" | "low" {
  if (score >= 80) return "high";
  if (score >= 60) return "moderate";
  return "low";
}

export function evidenceSourcesFromDomains(domains: FixturePlayerInput["domains"]): string[] {
  const sources: string[] = [];
  if (domains.statistical) sources.push("historical_performance");
  if (domains.injury) sources.push("injury_reports");
  if (domains.expert) sources.push("expert_consensus");
  if (domains.market) sources.push("market_signals");
  if (domains.weather) sources.push("weather");
  if (domains.community) sources.push("matchup_analysis");
  return sources;
}

export const EVIDENCE_SOURCE_CATEGORIES = [
  { id: "historical_performance", label: "Historical Performance" },
  { id: "matchup_analysis", label: "Matchup Analysis" },
  { id: "injury_reports", label: "Injury Reports" },
  { id: "weather", label: "Weather" },
  { id: "market_signals", label: "Market Signals" },
  { id: "expert_consensus", label: "Expert Consensus" },
] as const;

export function aggregateEvidenceSourceStatuses(
  players: FixturePlayerInput[],
): Record<string, "available" | "partial" | "pending"> {
  const counts: Record<string, number> = {};
  for (const category of EVIDENCE_SOURCE_CATEGORIES) {
    counts[category.id] = 0;
  }

  for (const player of players) {
    for (const source of evidenceSourcesFromDomains(player.domains)) {
      counts[source] = (counts[source] ?? 0) + 1;
    }
  }

  const statuses: Record<string, "available" | "partial" | "pending"> = {};
  for (const category of EVIDENCE_SOURCE_CATEGORIES) {
    const count = counts[category.id] ?? 0;
    statuses[category.id] =
      count === players.length ? "available" : count > 0 ? "partial" : "pending";
  }
  return statuses;
}
