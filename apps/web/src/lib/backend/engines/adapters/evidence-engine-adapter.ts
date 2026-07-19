import { assemblePlayerEvidence } from "@alpha-dfs/evidence";
import { applyCalibrationsToPlayers } from "@alpha-dfs/projection-calibration";
import {
  engineFailure,
  engineSuccess,
  type PlayerAnalysisEngine,
} from "@alpha-dfs/shared";
import { getSlateDataService } from "@/lib/backend/data/slate-data-service";

/** Adapter — Evidence Engine with database-backed slate players. */
export function createEvidencePlayerAnalysisEngine(): PlayerAnalysisEngine {
  return {
    engineId: "player_analysis",
    async analyze(context) {
      try {
        const slateId = context.slateId;
        if (!slateId) {
          return engineFailure(
            "MISSING_SLATE",
            "Slate ID required for player analysis",
            "player_analysis",
          );
        }

        const players = await getSlateDataService().slateRepository.getSlatePlayers(slateId);
        if (players.length === 0) {
          return engineFailure(
            "NO_PLAYERS",
            "No slate players available for evidence assembly",
            "player_analysis",
          );
        }

        const calibration = context.priorOutputs?.projectionCalibration;
        const calibratedPlayers = applyCalibrationsToPlayers(
          players,
          calibration?.players ?? [],
          calibration?.enabled ?? false,
        );

        const evidence = assemblePlayerEvidence(calibratedPlayers);
        const ownership = context.priorOutputs?.ownershipIntelligence;
        if (!ownership) {
          return engineSuccess(evidence);
        }

        const ownershipMap = new Map(
          ownership.players.map((player) => [player.slatePlayerId, player]),
        );

        return engineSuccess({
          ...evidence,
          players: evidence.players.map((player) => {
            const prediction = ownershipMap.get(player.slatePlayerId);
            if (!prediction) {
              return player;
            }
            return {
              ...player,
              ownershipEstimate: prediction.predictedOwnership,
            };
          }),
        });
      } catch (error) {
        return engineFailure(
          "EVIDENCE_FAILED",
          error instanceof Error ? error.message : "Evidence assembly failed",
          "player_analysis",
        );
      }
    },
  };
}
