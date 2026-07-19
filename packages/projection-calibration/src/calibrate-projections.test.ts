import { describe, expect, it } from "vitest";
import { calibrateProjections } from "./calibrate-projections";

const basePlayers = [
  {
    slatePlayerId: "p1",
    position: "QB",
    team: "BUF",
    opponent: "KC",
    projection: 20,
    floor: 14,
    ceiling: 26,
    injuryStatus: "healthy" as const,
  },
  {
    slatePlayerId: "p2",
    position: "WR",
    team: "MIA",
    opponent: "NYJ",
    projection: 18,
    floor: 10,
    ceiling: 28,
    injuryStatus: "questionable" as const,
  },
];

describe("calibrateProjections", () => {
  it("returns identity values when calibration is disabled", () => {
    const result = calibrateProjections({
      enabled: false,
      players: basePlayers,
      games: [{ home: "BUF", away: "KC", total: 50 }],
    });

    expect(result.enabled).toBe(false);
    expect(result.averageCalibrationFactor).toBe(1);
    expect(result.players[0]?.calibratedProjection).toBe(20);
    expect(result.players[1]?.calibratedProjection).toBe(18);
    expect(result.version).toBe("cal-1.0-disabled");
  });

  it("applies injury and high-total Vegas adjustments when enabled", () => {
    const result = calibrateProjections({
      enabled: true,
      players: basePlayers,
      games: [
        { home: "BUF", away: "KC", total: 50 },
        { home: "NYJ", away: "MIA", total: 49 },
      ],
    });

    expect(result.enabled).toBe(true);
    expect(result.players[0]?.calibratedProjection).toBeGreaterThan(
      result.players[0]?.rawProjection ?? 0,
    );
    expect(result.players[1]?.calibratedProjection).toBeLessThan(18);
    expect(result.players[1]?.calibrationNotes.some((note) => note.includes("Injury"))).toBe(
      true,
    );
  });

  it("does not accept or require PCE inputs", () => {
    const input = {
      enabled: true,
      players: basePlayers,
    };

    expect("confidence" in input).toBe(false);
    expect("variance" in input).toBe(false);
    expect(() => calibrateProjections(input)).not.toThrow();
  });
});
