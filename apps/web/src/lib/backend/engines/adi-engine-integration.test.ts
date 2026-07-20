import { describe, expect, it } from "vitest";
import { calibrateProjections } from "@alpha-dfs/projection-calibration";
import type { AdiNormalizedEvidenceBundle } from "@alpha-dfs/shared";
import { buildProjectionAdiAdjustments } from "@alpha-dfs/evidence-fusion";

describe("INT-5 projection calibration ADI integration", () => {
  it("applies projection_delta from fused bundle when ADI enabled", () => {
    const bundle: AdiNormalizedEvidenceBundle = {
      bundleId: "bundle-int5",
      runId: "run-int5",
      slateId: "slate-int5",
      fusedAt: "2026-07-19T12:00:00.000Z",
      version: "fusion-1.0",
      platformConfidence: 0.8,
      degradationNotes: [],
      subjects: [
        {
          subjectType: "player",
          subjectId: "sp-p1",
          fusedConfidence: 0.8,
          freshnessScore: 0.9,
          sourceCoverage: ["consensus-a", "consensus-b"],
          conflicts: [],
          items: [
            {
              itemId: "delta-1",
              evidenceType: "projection_delta",
              subjectType: "player",
              subjectId: "sp-p1",
              claim: "Positive projection delta",
              direction: "positive",
              confidence: 0.75,
              observedAt: "2026-07-19T12:00:00.000Z",
              supportingRefs: ["delta-1"],
            },
          ],
        },
      ],
    };

    const { adjustments } = buildProjectionAdiAdjustments(bundle, ["sp-p1"]);
    const disabled = calibrateProjections({
      enabled: true,
      players: [
        {
          slatePlayerId: "sp-p1",
          position: "QB",
          team: "KC",
          opponent: "BUF",
          projection: 20,
          floor: 15,
          ceiling: 25,
          injuryStatus: "healthy",
        },
      ],
    });
    const enabled = calibrateProjections({
      enabled: true,
      players: [
        {
          slatePlayerId: "sp-p1",
          position: "QB",
          team: "KC",
          opponent: "BUF",
          projection: 20,
          floor: 15,
          ceiling: 25,
          injuryStatus: "healthy",
        },
      ],
      adiAdjustments: adjustments.map((entry) => ({
        slatePlayerId: entry.slatePlayerId,
        factor: entry.factor,
      })),
    });

    expect(enabled.players[0]?.calibratedProjection).toBeGreaterThan(
      disabled.players[0]?.calibratedProjection ?? 0,
    );
    expect(adjustments[0]?.provenanceRefs).toContain("delta-1");
  });
});
