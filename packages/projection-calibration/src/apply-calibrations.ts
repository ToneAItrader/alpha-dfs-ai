import type { PlayerCalibrationRecord } from "./types";

type CalibratedPlayerShape = {
  slatePlayerId: string;
  projection: number;
  floor: number;
  ceiling: number;
};

/** Apply calibrated projection values to slate player inputs before scoring. */
export function applyCalibrationsToPlayers<T extends CalibratedPlayerShape>(
  players: T[],
  calibrations: PlayerCalibrationRecord[],
  enabled: boolean,
): T[] {
  if (!enabled) {
    return players;
  }

  const byId = new Map(
    calibrations.map((record) => [record.slatePlayerId, record]),
  );

  return players.map((player) => {
    const record = byId.get(player.slatePlayerId);
    if (!record) {
      return player;
    }

    return {
      ...player,
      projection: record.calibratedProjection,
      floor: record.calibratedFloor,
      ceiling: record.calibratedCeiling,
    };
  });
}
