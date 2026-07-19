import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";
import { normalizeDraftKingsExport } from "../normalizers/draftkings-normalizer";
import {
  normalizeProjectionExport,
  normalizeProjectionFeed,
} from "../normalizers/projection-normalizer";
import type { DraftKingsExportRecord } from "../providers/provider-types";

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../fixtures");

describe("provider normalizers", () => {
  it("normalizes DraftKings export fixture", () => {
    const raw = readFileSync(path.join(fixturesDir, "draftkings-classic-export.json"), "utf8");
    const record = JSON.parse(raw) as DraftKingsExportRecord;
    const payload = normalizeDraftKingsExport(record);

    expect(payload.players).toHaveLength(15);
    expect(payload.slate.platform).toBe("draftkings");
    expect(payload.players[0]?.salary).toBeGreaterThan(0);
    expect(payload.players[0]?.projection).toBe(0);
  });

  it("normalizes projection export fixture", () => {
    const raw = readFileSync(path.join(fixturesDir, "projection-export.json"), "utf8");
    const records = normalizeProjectionExport(JSON.parse(raw));
    const players = normalizeProjectionFeed(records);

    expect(players).toHaveLength(15);
    expect(players[0]?.projection).toBeGreaterThan(0);
    expect(players[0]?.floor).toBeGreaterThan(0);
  });
});
