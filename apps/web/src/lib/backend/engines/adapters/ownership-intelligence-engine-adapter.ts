import { ownershipByPlayerId, predictOwnershipBaseline } from "@alpha-dfs/ownership-prediction";
import {
  engineFailure,
  engineSuccess,
  runIntelligenceAgent,
  type AgentInput,
  type IntelligenceAgent,
  type OwnershipIntelligenceEngine,
  type OwnershipIntelligenceOutput,
} from "@alpha-dfs/shared";
import { getSlateDataService } from "@/lib/backend/data/slate-data-service";
import { getSlateMarketCache } from "@/lib/backend/slate-market-cache";

/** Ownership Intelligence Agent — baseline ownership prediction. */
export function createOwnershipIntelligenceAgent(): IntelligenceAgent<
  OwnershipIntelligenceOutput,
  "ownership_intelligence"
> {
  return {
    agentId: "ownership_intelligence",
    async execute(input: AgentInput) {
      return runIntelligenceAgent("ownership_intelligence", async () => {
        const slateId = input.context.slateId;
        if (!slateId) {
          return engineFailure(
            "MISSING_SLATE",
            "Slate ID required for ownership intelligence",
            "ownership_intelligence",
          );
        }

        try {
          const players = await getSlateDataService().slateRepository.getSlatePlayers(slateId);
          if (players.length === 0) {
            return engineFailure(
              "NO_PLAYERS",
              "No slate players available for ownership intelligence",
              "ownership_intelligence",
            );
          }

          const games = getSlateMarketCache(slateId)?.map((game) => ({
            home: game.home,
            away: game.away,
            total: game.total,
          }));
          const slateIntelligence = input.priorOutputs?.slateIntelligence;

          const result = predictOwnershipBaseline({
            players: players.map((player) => ({
              slatePlayerId: player.slatePlayerId,
              name: player.name,
              position: player.position,
              team: player.team,
              opponent: player.opponent,
              salary: player.salary,
              projection: player.projection,
              feedOwnership: player.ownershipProjected,
            })),
            games,
            slate: slateIntelligence
              ? {
                  volatilityScore: slateIntelligence.volatilityScore,
                  recommendedStrategy: slateIntelligence.recommendedStrategy,
                }
              : undefined,
            seed: 42,
          });

          const data: OwnershipIntelligenceOutput = {
            players: result.players,
            averagePredictedOwnership: result.averagePredictedOwnership,
            chalkPlayerCount: result.chalkPlayerCount,
            contrarianPlayerCount: result.contrarianPlayerCount,
            leverageOpportunities: result.leverageOpportunities,
            ownershipConcentration: result.ownershipConcentration,
            assessment: result.assessment,
            factors: result.factors,
            version: result.version,
          };

          const feedCoverage =
            result.players.filter((player) => player.ownershipSource === "feed").length /
            result.players.length;

          return engineSuccess({
            data,
            confidence: {
              value: Math.min(1, 0.55 + feedCoverage * 0.35),
              grade: feedCoverage >= 0.8 ? "A" : feedCoverage >= 0.5 ? "B" : "C",
              rationale: `Ownership intelligence from ${Math.round(feedCoverage * 100)}% feed coverage`,
            },
            evidence: {
              summary: result.assessment,
              items: result.factors.map((factor, index) => ({
                id: `ownership-factor-${index + 1}`,
                category: "ownership_intelligence",
                summary: factor,
              })),
            },
          });
        } catch (error) {
          return engineFailure(
            "OWNERSHIP_INTELLIGENCE_FAILED",
            error instanceof Error ? error.message : "Ownership intelligence failed",
            "ownership_intelligence",
          );
        }
      });
    },
  };
}

/** Pipeline engine adapter — bridges agent output to engine registry contract. */
export function createOwnershipIntelligenceEngineAdapter(): OwnershipIntelligenceEngine {
  const agent = createOwnershipIntelligenceAgent();

  return {
    engineId: "ownership_intelligence",
    async analyze(context) {
      const result = await agent.execute({
        context,
        priorOutputs: context.priorOutputs,
      });

      if (!result.ok) {
        return result;
      }

      return engineSuccess(result.data.data);
    },
  };
}

export { ownershipByPlayerId };
