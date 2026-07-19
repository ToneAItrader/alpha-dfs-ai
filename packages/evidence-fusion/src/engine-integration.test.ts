import { describe, expect, it } from "vitest";
import type { AdiNormalizedEvidenceBundle } from "@alpha-dfs/shared";
import {
  applyInjuryAdiOverlay,
  applyVegasAdiOverlay,
  buildProjectionAdiAdjustments,
} from "./engine-integration";

const bundle: AdiNormalizedEvidenceBundle = {
  bundleId: "bundle-test",
  runId: "run-test",
  slateId: "slate-test",
  fusedAt: "2026-07-19T12:00:00.000Z",
  version: "fusion-1.0",
  platformConfidence: 0.82,
  degradationNotes: [],
  subjects: [
    {
      subjectType: "player",
      subjectId: "sp-1",
      fusedConfidence: 0.8,
      freshnessScore: 0.9,
      sourceCoverage: ["news-ap", "news-espn"],
      conflicts: [],
      items: [
        {
          itemId: "inj-1",
          evidenceType: "injury_status",
          subjectType: "player",
          subjectId: "sp-1",
          claim: "Expected to play",
          direction: "positive",
          confidence: 0.85,
          observedAt: "2026-07-19T12:00:00.000Z",
          supportingRefs: ["inj-1"],
        },
      ],
    },
    {
      subjectType: "game",
      subjectId: "KC-BUF",
      fusedConfidence: 0.77,
      freshnessScore: 0.88,
      sourceCoverage: ["sportsbook-dk"],
      conflicts: [],
      items: [
        {
          itemId: "total-1",
          evidenceType: "implied_total",
          subjectType: "game",
          subjectId: "KC-BUF",
          claim: "Total 49.5",
          confidence: 0.8,
          magnitude: 49.5,
          observedAt: "2026-07-19T12:00:00.000Z",
          supportingRefs: ["total-1"],
        },
      ],
    },
  ],
};

describe("engine integration overlays", () => {
  it("applyInjuryAdiOverlay updates player status when bundle present", () => {
    const { players, meta } = applyInjuryAdiOverlay(
      [{ slatePlayerId: "sp-1", injuryStatus: "questionable" }],
      bundle,
    );
    expect(players[0]?.injuryStatus).toBe("healthy");
    expect(meta.adiApplied).toBe(true);
    expect(meta.provenanceRefs.length).toBeGreaterThan(0);
  });

  it("applyInjuryAdiOverlay is no-op without bundle", () => {
    const input = [{ slatePlayerId: "sp-1", injuryStatus: "questionable" as const }];
    const { players, meta } = applyInjuryAdiOverlay(input, undefined);
    expect(players).toEqual(input);
    expect(meta.adiApplied).toBe(false);
  });

  it("applyVegasAdiOverlay updates game totals", () => {
    const { games, meta } = applyVegasAdiOverlay(
      [{ home: "KC", away: "BUF", gameKey: "KC-BUF", total: 44 }],
      bundle,
    );
    expect(games[0]?.total).toBe(49.5);
    expect(meta.adiApplied).toBe(true);
  });

  it("buildProjectionAdiAdjustments returns factors for player subjects", () => {
    const bundleWithProjection: AdiNormalizedEvidenceBundle = {
      ...bundle,
      subjects: [
        {
          subjectType: "player",
          subjectId: "sp-2",
          fusedConfidence: 0.75,
          freshnessScore: 0.8,
          sourceCoverage: ["consensus-src", "news-src"],
          conflicts: [],
          items: [
            {
              itemId: "proj-1",
              evidenceType: "consensus_projection",
              subjectType: "player",
              subjectId: "sp-2",
              claim: "Projection delta +1.2",
              direction: "positive",
              confidence: 0.7,
              observedAt: "2026-07-19T12:00:00.000Z",
            },
          ],
        },
      ],
    };

    const { adjustments, meta } = buildProjectionAdiAdjustments(bundleWithProjection, ["sp-2"]);
    expect(adjustments).toHaveLength(1);
    expect(adjustments[0]?.factor).toBeGreaterThan(1);
    expect(meta.adiApplied).toBe(true);
  });
});
