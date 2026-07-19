import type { PlayerEvidenceViewModel } from "@/types/player-evidence-view-model";

const placeholderPlayer = (
  id: string,
  name: string,
  position: string,
  team: string,
  opponent: string,
): PlayerEvidenceViewModel["players"][number] => ({
  playerId: id,
  name,
  position,
  team,
  opponent,
  salary: null,
  projectedPoints: null,
  confidence: null,
  confidenceTier: null,
  risk: null,
  injuryStatus: null,
  matchupSummary: null,
  ownershipOutlook: null,
  evidenceSources: [],
  explainabilitySummary: `${name} — placeholder explainability from Evidence Engine.`,
});

/** Placeholder view model — conforms to PlayerEvidenceViewModel. Task 10.10 replaces provider only. */
export const playerEvidencePlaceholder: PlayerEvidenceViewModel = {
  overview: {
    totalPlayers: 5,
    highConfidencePlayers: 0,
    moderateConfidencePlayers: 0,
    lowConfidencePlayers: 0,
    lastAnalysisAt: null,
  },
  filters: {
    positions: ["QB", "RB", "WR", "TE", "DST"],
    teams: ["—"],
    confidenceTiers: ["high", "moderate", "low"],
  },
  players: [
    placeholderPlayer("p1", "Player One", "QB", "BUF", "KC"),
    placeholderPlayer("p2", "Player Two", "RB", "DAL", "PHI"),
    placeholderPlayer("p3", "Player Three", "WR", "MIA", "NYJ"),
    placeholderPlayer("p4", "Player Four", "TE", "SF", "SEA"),
    placeholderPlayer("p5", "Player Five", "WR", "CIN", "BAL"),
  ],
  evidenceSourceCategories: [
    { id: "historical_performance", label: "Historical Performance", status: "pending" },
    { id: "matchup_analysis", label: "Matchup Analysis", status: "pending" },
    { id: "injury_reports", label: "Injury Reports", status: "pending" },
    { id: "weather", label: "Weather", status: "pending" },
    { id: "market_signals", label: "Market Signals", status: "pending" },
    { id: "expert_consensus", label: "Expert Consensus", status: "pending" },
  ],
  confidenceSummary: {
    overallConfidence: null,
    projectionStability: null,
    variance: null,
    reliabilityGrade: null,
  },
  explainabilitySummary: [
    "Strong matchup (placeholder)",
    "Injury opportunity (placeholder)",
    "Positive market sentiment (placeholder)",
    "High projected volume (placeholder)",
    "Salary value (placeholder)",
  ],
  metadata: {
    analysisVersion: null,
    timestamp: null,
    dataFreshness: null,
    evidenceVersion: null,
  },
};
