import type {
  CalibrationGameContext,
  CalibrationPlayerInput,
  PlayerCalibrationRecord,
  ProjectionCalibrationInput,
  ProjectionCalibrationResult,
} from "./types";

const INJURY_FACTORS = {
  healthy: 1,
  questionable: 0.92,
  doubtful: 0.85,
  out: 0.5,
  unknown: 0.97,
} as const;

const POSITION_SPREAD: Record<string, { floorScale: number; ceilingScale: number }> = {
  QB: { floorScale: 0.98, ceilingScale: 1.04 },
  RB: { floorScale: 0.96, ceilingScale: 1.03 },
  WR: { floorScale: 0.95, ceilingScale: 1.05 },
  TE: { floorScale: 0.96, ceilingScale: 1.04 },
  DST: { floorScale: 0.98, ceilingScale: 1.02 },
};

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

function findGameTotal(
  games: CalibrationGameContext[] | undefined,
  team: string,
  opponent: string,
): number | undefined {
  if (!games) return undefined;
  const match = games.find(
    (game) =>
      (game.home === team && game.away === opponent) ||
      (game.home === opponent && game.away === team),
  );
  return match?.total;
}

function vegasEnvironmentScale(total: number | undefined): {
  projection: number;
  floor: number;
  ceiling: number;
  note?: string;
} {
  if (total === undefined) {
    return { projection: 1, floor: 1, ceiling: 1 };
  }
  if (total >= 48) {
    return {
      projection: 1.03,
      floor: 1.02,
      ceiling: 1.05,
      note: `High-total game (${total}) — expanded scoring range`,
    };
  }
  if (total < 44) {
    return {
      projection: 0.98,
      floor: 0.98,
      ceiling: 0.97,
      note: `Low-total game (${total}) — compressed scoring range`,
    };
  }
  return { projection: 1, floor: 1, ceiling: 1 };
}

function positionSpread(position: string): { floorScale: number; ceilingScale: number } {
  return POSITION_SPREAD[position] ?? { floorScale: 0.97, ceilingScale: 1.03 };
}

function calibratePlayer(
  player: CalibrationPlayerInput,
  games: CalibrationGameContext[] | undefined,
): PlayerCalibrationRecord {
  const notes: string[] = [];
  const injuryFactor = INJURY_FACTORS[player.injuryStatus];
  if (player.injuryStatus !== "healthy") {
    notes.push(`Injury overlay (${player.injuryStatus}) applied`);
  }

  const gameTotal = findGameTotal(games, player.team, player.opponent);
  const vegasScale = vegasEnvironmentScale(gameTotal);
  if (vegasScale.note) {
    notes.push(vegasScale.note);
  }

  const spread = positionSpread(player.position);
  notes.push(`Position variance bucket (${player.position}) applied`);

  const rawProjection = player.projection;
  const calibratedProjection = round(
    rawProjection * injuryFactor * vegasScale.projection,
  );
  const calibratedFloor = round(
    player.floor * injuryFactor * vegasScale.floor * spread.floorScale,
  );
  const calibratedCeiling = round(
    player.ceiling * injuryFactor * vegasScale.ceiling * spread.ceilingScale,
  );
  const calibrationFactor =
    rawProjection > 0 ? round(calibratedProjection / rawProjection) : 1;

  return {
    slatePlayerId: player.slatePlayerId,
    rawProjection,
    calibratedProjection,
    calibrationFactor,
    calibratedFloor,
    calibratedCeiling,
    calibrationNotes: notes,
  };
}

function passthroughRecord(player: CalibrationPlayerInput): PlayerCalibrationRecord {
  return {
    slatePlayerId: player.slatePlayerId,
    rawProjection: player.projection,
    calibratedProjection: player.projection,
    calibrationFactor: 1,
    calibratedFloor: player.floor,
    calibratedCeiling: player.ceiling,
    calibrationNotes: [],
  };
}

/** Deterministic pre-score projection calibration — no same-run PCE inputs. */
export function calibrateProjections(
  input: ProjectionCalibrationInput,
): ProjectionCalibrationResult {
  const { enabled, players, games } = input;

  if (!enabled) {
    const passthrough = players.map(passthroughRecord);
    const averageRaw =
      players.length === 0
        ? 0
        : round(
            players.reduce((sum, player) => sum + player.projection, 0) / players.length,
          );

    return {
      enabled: false,
      playersCalibrated: 0,
      averageCalibrationFactor: 1,
      averageCalibratedProjection: averageRaw,
      calibrationNotes: ["Projection calibration disabled — raw feed values preserved"],
      players: passthrough,
      version: "cal-1.0-disabled",
    };
  }

  const calibrated = players.map((player) => calibratePlayer(player, games));
  const adjustedCount = calibrated.filter(
    (record) => record.calibrationFactor !== 1 || record.calibrationNotes.length > 0,
  ).length;
  const averageCalibrationFactor =
    calibrated.length === 0
      ? 1
      : round(
          calibrated.reduce((sum, record) => sum + record.calibrationFactor, 0) /
            calibrated.length,
        );
  const averageCalibratedProjection =
    calibrated.length === 0
      ? 0
      : round(
          calibrated.reduce((sum, record) => sum + record.calibratedProjection, 0) /
            calibrated.length,
        );

  return {
    enabled: true,
    playersCalibrated: adjustedCount,
    averageCalibrationFactor,
    averageCalibratedProjection,
    calibrationNotes: [
      `Calibrated ${adjustedCount} of ${players.length} slate players`,
      "Pre-score rule-based calibration — injury, Vegas environment, position variance",
    ],
    players: calibrated,
    version: "cal-1.0",
  };
}

export function isProjectionCalibrationEnabled(): boolean {
  const value = process.env.PROJECTION_CALIBRATION_ENABLED?.toLowerCase();
  return value === "1" || value === "true";
}
