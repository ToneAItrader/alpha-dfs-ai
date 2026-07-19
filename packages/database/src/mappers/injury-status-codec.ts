/** Encode injury fields into a single persisted status string (no schema migration). */
export function encodeInjuryStatus(fields: {
  injuryStatus: string;
  practiceStatus?: string;
  gameStatus?: string;
}): string {
  return [fields.injuryStatus, fields.practiceStatus, fields.gameStatus]
    .filter((value) => value && value.length > 0)
    .join("|");
}

/** Decode persisted injury status into structured fields. */
export function decodeInjuryStatus(status: string): {
  injuryStatus: string;
  practiceStatus?: string;
  gameStatus?: string;
} {
  const [injuryStatus, practiceStatus, gameStatus] = status.split("|");
  return {
    injuryStatus: injuryStatus ?? "unknown",
    practiceStatus: practiceStatus || undefined,
    gameStatus: gameStatus || undefined,
  };
}
