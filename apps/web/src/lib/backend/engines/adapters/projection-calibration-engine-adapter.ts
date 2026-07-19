import {
  calibrateProjections,
  isProjectionCalibrationEnabled,
} from "@alpha-dfs/projection-calibration";
import {
  engineFailure,
  engineSuccess,
  runIntelligenceAgent,
  type AgentInput,
  type IntelligenceAgent,
  type ProjectionCalibrationEngine,
  type ProjectionCalibrationOutput,
} from "@alpha-dfs/shared";
import { buildProjectionAdiAdjustments } from "@alpha-dfs/evidence-fusion";
import { getSlateDataService } from "@/lib/backend/data/slate-data-service";
import { getSlateMarketCache } from "@/lib/backend/slate-market-cache";

/** Projection Calibration Agent — pre-score deterministic calibration. */
export function createProjectionCalibrationAgent(): IntelligenceAgent<
  ProjectionCalibrationOutput,
  "projection_calibration"
> {
  return {
    agentId: "projection_calibration",
    async execute(input: AgentInput) {
      return runIntelligenceAgent("projection_calibration", async () => {
        const slateId = input.context.slateId;
        if (!slateId) {
          return engineFailure(
            "MISSING_SLATE",
            "Slate ID required for projection calibration",
            "projection_calibration",
          );
        }

        try {
          const players = await getSlateDataService().slateRepository.getSlatePlayers(slateId);
          if (players.length === 0) {
            return engineFailure(
              "NO_PLAYERS",
              "No slate players available for projection calibration",
              "projection_calibration",
            );
          }

          const enabled = isProjectionCalibrationEnabled();
          const games = getSlateMarketCache(slateId)?.map((game) => ({
            home: game.home,
            away: game.away,
            total: game.total,
          }));

          const playerIds = players.map((player) => player.slatePlayerId);
          const { adjustments, meta: adiMeta } = buildProjectionAdiAdjustments(
            input.priorOutputs?.adiEvidence,
            playerIds,
          );

          const result = calibrateProjections({
            enabled,
            players: players.map((player) => ({
              slatePlayerId: player.slatePlayerId,
              position: player.position,
              team: player.team,
              opponent: player.opponent,
              projection: player.projection,
              floor: player.floor,
              ceiling: player.ceiling,
              injuryStatus: player.injuryStatus,
            })),
            games,
            adiAdjustments: adjustments.map((entry) => ({
              slatePlayerId: entry.slatePlayerId,
              factor: entry.factor,
              note: entry.note,
            })),
          });

          const data: ProjectionCalibrationOutput = {
            enabled: result.enabled,
            playersCalibrated: result.playersCalibrated,
            averageCalibrationFactor: result.averageCalibrationFactor,
            averageCalibratedProjection: result.averageCalibratedProjection,
            calibrationNotes: [...result.calibrationNotes, ...adiMeta.adiNotes],
            players: result.players,
            version: result.version,
          };

          const confidenceValue = enabled
            ? Math.min(
                1,
                (result.playersCalibrated / Math.max(players.length, 1)) * adiMeta.confidenceMultiplier,
              )
            : 1;

          return engineSuccess({
            data,
            confidence: {
              value: confidenceValue,
              grade: enabled ? (confidenceValue >= 0.7 ? "B" : "C") : "A",
              rationale: enabled
                ? `Calibrated ${result.playersCalibrated} players before scoring`
                : "Calibration disabled — raw projection feed preserved",
            },
            evidence: {
              summary: result.calibrationNotes.join("; "),
              items: result.calibrationNotes.map((note, index) => ({
                id: `calibration-note-${index + 1}`,
                category: "projection_calibration",
                summary: note,
              })),
            },
          });
        } catch (error) {
          return engineFailure(
            "PROJECTION_CALIBRATION_FAILED",
            error instanceof Error ? error.message : "Projection calibration failed",
            "projection_calibration",
          );
        }
      });
    },
  };
}

/** Pipeline engine adapter — bridges agent output to engine registry contract. */
export function createProjectionCalibrationEngineAdapter(): ProjectionCalibrationEngine {
  const agent = createProjectionCalibrationAgent();

  return {
    engineId: "projection_calibration",
    async calibrate(context) {
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
