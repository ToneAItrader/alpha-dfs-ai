import { describe, expect, it } from "vitest";
import { assemblePlayerEvidence } from "@alpha-dfs/evidence";
import { evaluateSlateConfidence } from "@alpha-dfs/prediction-confidence";

describe("Prediction Confidence Engine", () => {
  it("evaluates slate confidence from player evidence", () => {
    const playerAnalysis = assemblePlayerEvidence();
    const result = evaluateSlateConfidence({
      playerAnalysis,
      dataCompleteness: 92,
    });

    expect(result.overallConfidence).toBeGreaterThan(0);
    expect(result.overallConfidence).toBeLessThanOrEqual(100);
    expect(["A", "B", "C", "D", "F"]).toContain(result.confidenceGrade);
    expect(result.version).toBe("pce-1.0");
  });
});
