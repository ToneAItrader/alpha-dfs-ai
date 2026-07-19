import {
  engineSuccess,
  type ProjectionCalibrationEngine,
  type ProjectionCalibrationOutput,
} from "@alpha-dfs/shared";

export function createStubProjectionCalibrationEngine(): ProjectionCalibrationEngine {
  return {
    engineId: "projection_calibration",
    async calibrate() {
      const data: ProjectionCalibrationOutput = {
        enabled: false,
        playersCalibrated: 0,
        averageCalibrationFactor: 1,
        averageCalibratedProjection: 0,
        calibrationNotes: ["Projection calibration disabled — stub path"],
        players: [],
        version: "cal-1.0-stub",
      };
      return engineSuccess(data);
    },
  };
}
