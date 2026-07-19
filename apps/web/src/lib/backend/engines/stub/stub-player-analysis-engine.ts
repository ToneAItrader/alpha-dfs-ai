import {
  engineSuccess,
  type PlayerAnalysisEngine,
  type PlayerAnalysisOutput,
} from "@alpha-dfs/shared";

const BASE_PLAYERS = [
  { slatePlayerId: "p1", name: "Player One", position: "QB", team: "BUF", opponent: "KC" },
  { slatePlayerId: "p2", name: "Player Two", position: "RB", team: "DAL", opponent: "PHI" },
  { slatePlayerId: "p3", name: "Player Three", position: "WR", team: "MIA", opponent: "NYJ" },
  { slatePlayerId: "p4", name: "Player Four", position: "TE", team: "SF", opponent: "SEA" },
  { slatePlayerId: "p5", name: "Player Five", position: "WR", team: "CIN", opponent: "BAL" },
] as const;

export function createStubPlayerAnalysisEngine(): PlayerAnalysisEngine {
  return {
    engineId: "player_analysis",
    async analyze() {
      const players = BASE_PLAYERS.map((player, index) => ({
        ...player,
        salary: 7200 + index * 400,
        projection: 18.5 + index,
        confidenceScore: 82 - index * 8,
        confidenceTier: (index < 2 ? "high" : index < 4 ? "moderate" : "low") as
          | "high"
          | "moderate"
          | "low",
        risk: index < 2 ? "Low" : "Moderate",
        injuryStatus: "healthy" as const,
        matchupSummary: "Favorable matchup (stub)",
        ownershipEstimate: 12 + index * 3,
        supportingRationale: `${player.name} — explainability from Evidence Engine.`,
        evidenceSources: ["historical_performance", "matchup_analysis", "expert_consensus"],
      }));

      const data: PlayerAnalysisOutput = {
        totalPlayers: 5,
        highConfidencePlayers: 2,
        moderateConfidencePlayers: 2,
        lowConfidencePlayers: 1,
        players,
        evidenceSourceStatuses: {
          historical_performance: "available",
          matchup_analysis: "available",
          injury_reports: "available",
          weather: "available",
          market_signals: "available",
          expert_consensus: "available",
        },
      };
      return engineSuccess(data);
    },
  };
}

export function createStubIdlePlayerAnalysisEngine(): PlayerAnalysisEngine {
  return {
    engineId: "player_analysis",
    async analyze() {
      const players = BASE_PLAYERS.map((player) => ({
        ...player,
        salary: 0,
        projection: 0,
        confidenceScore: 0,
        confidenceTier: "low" as const,
        risk: "Unknown",
        injuryStatus: "unknown" as const,
        matchupSummary: "Pending analysis",
        ownershipEstimate: 0,
        supportingRationale: `${player.name} — explainability from Evidence Engine.`,
        evidenceSources: [],
      }));

      return engineSuccess({
        totalPlayers: 5,
        highConfidencePlayers: 0,
        moderateConfidencePlayers: 0,
        lowConfidencePlayers: 0,
        players,
        evidenceSourceStatuses: {
          historical_performance: "pending",
          matchup_analysis: "pending",
          injury_reports: "pending",
          weather: "pending",
          market_signals: "pending",
          expert_consensus: "pending",
        },
      });
    },
  };
}
