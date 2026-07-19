import { describe, expect, it } from "vitest";
import {
  normalizeVegasOddsExport,
  normalizeVegasOddsFeed,
} from "./vegas-normalizer";

describe("vegas-normalizer", () => {
  it("normalizes feed records into game merge payloads", () => {
    const games = normalizeVegasOddsFeed([
      {
        home: "buf",
        away: "kc",
        spread: -2.5,
        total: 48.5,
        impliedHomeTotal: 25.5,
        impliedAwayTotal: 23.0,
        lineMovement: 1.0,
      },
    ]);

    expect(games).toEqual([
      {
        home: "BUF",
        away: "KC",
        spread: -2.5,
        total: 48.5,
        impliedHomeTotal: 25.5,
        impliedAwayTotal: 23.0,
        lineMovement: 1.0,
      },
    ]);
  });

  it("extracts export records", () => {
    const records = normalizeVegasOddsExport({
      games: [{ home: "DAL", away: "PHI", total: 51.0 }],
    });

    expect(records).toHaveLength(1);
    expect(records[0]?.total).toBe(51.0);
  });

  it("throws when export is empty", () => {
    expect(() => normalizeVegasOddsExport({ games: [] })).toThrow(
      "Vegas odds export contains no records",
    );
  });
});
