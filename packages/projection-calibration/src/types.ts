export type CalibrationInjuryStatus =
  | "healthy"
  | "questionable"
  | "doubtful"
  | "out"
  | "unknown";

export type CalibrationPlayerInput = {
  slatePlayerId: string;
  position: string;
  team: string;
  opponent: string;
  projection: number;
  floor: number;
  ceiling: number;
  injuryStatus: CalibrationInjuryStatus;
};

export type CalibrationGameContext = {
  home: string;
  away: string;
  total?: number;
};

export type ProjectionCalibrationInput = {
  enabled: boolean;
  players: CalibrationPlayerInput[];
  games?: CalibrationGameContext[];
};

export type PlayerCalibrationRecord = {
  slatePlayerId: string;
  rawProjection: number;
  calibratedProjection: number;
  calibrationFactor: number;
  calibratedFloor: number;
  calibratedCeiling: number;
  calibrationNotes: string[];
};

export type ProjectionCalibrationResult = {
  enabled: boolean;
  playersCalibrated: number;
  averageCalibrationFactor: number;
  averageCalibratedProjection: number;
  calibrationNotes: string[];
  players: PlayerCalibrationRecord[];
  version: string;
};
