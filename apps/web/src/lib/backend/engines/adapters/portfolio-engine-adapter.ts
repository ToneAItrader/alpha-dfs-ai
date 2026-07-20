import { buildPortfolioOutput, type PortfolioCandidate } from "@alpha-dfs/portfolio-intelligence";
import {
  engineFailure,
  engineSuccess,
  type PortfolioEngine,
} from "@alpha-dfs/shared";
import { buildPortfolioAdiBoosts } from "@alpha-dfs/evidence-fusion";
import { getSlateDataService } from "@/lib/backend/data/slate-data-service";

/** Real Portfolio Engine — heuristic PIE without MILP optimizer. */
export function createPortfolioEngineAdapter(): PortfolioEngine {
  return {
    engineId: "portfolio",
    async build(context) {
      try {
        const slateId = context.slateId;
        const playerAnalysis = context.priorOutputs?.playerAnalysis;
        const confidence = context.priorOutputs?.confidence;

        if (!slateId) {
          return engineFailure(
            "MISSING_SLATE",
            "Slate ID required for portfolio construction",
            "portfolio",
          );
        }

        if (!playerAnalysis || !confidence) {
          return engineFailure(
            "MISSING_UPSTREAM",
            "Player analysis and confidence outputs required for portfolio construction",
            "portfolio",
          );
        }

        const ownershipMap = new Map(
          context.priorOutputs?.ownershipIntelligence?.players.map((player) => [
            player.slatePlayerId,
            player.predictedOwnership,
          ]) ?? [],
        );

        const slatePlayers = await getSlateDataService().slateRepository.getSlatePlayers(slateId);
        const playerIds = slatePlayers.map((player) => player.slatePlayerId);
        const { boosts, meta: adiMeta } = buildPortfolioAdiBoosts(
          context.priorOutputs?.adiEvidence,
          playerIds,
        );

        const candidates: PortfolioCandidate[] = slatePlayers.map((player) => {
          const evidence = playerAnalysis.players.find(
            (record) => record.slatePlayerId === player.slatePlayerId,
          );
          return {
            slatePlayerId: player.slatePlayerId,
            name: player.name,
            position: player.position,
            team: player.team,
            opponent: player.opponent,
            salary: player.salary,
            projection: player.projection,
            floor: player.floor,
            ceiling: player.ceiling,
            ownershipEstimate:
              ownershipMap.get(player.slatePlayerId) ??
              evidence?.ownershipEstimate ??
              player.ownershipProjected,
            confidenceScore: evidence?.confidenceScore ?? 60,
            confidenceTier: evidence?.confidenceTier ?? "moderate",
          };
        });

        return engineSuccess(
          buildPortfolioOutput({
            candidates,
            confidenceScore: confidence.overallConfidence,
            adiBoosts: boosts.map((entry) => ({
              slatePlayerId: entry.slatePlayerId,
              boost: entry.boost,
            })),
          }),
        );
      } catch (error) {
        return engineFailure(
          "PORTFOLIO_FAILED",
          error instanceof Error ? error.message : "Portfolio construction failed",
          "portfolio",
        );
      }
    },
  };
}
