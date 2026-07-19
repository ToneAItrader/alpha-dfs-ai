import { describe, expect, it } from "vitest";
import { createProjectionCalibrationAgent } from "@/lib/backend/engines/adapters/projection-calibration-engine-adapter";

describe("projection-calibration agent", () => {
  it("does not consume same-run PCE output from priorOutputs", async () => {
    const agent = createProjectionCalibrationAgent();
    const executeSpy = agent.execute;

    expect(executeSpy).toBeDefined();

    const priorOutputs = {
      confidence: {
        overallConfidence: 88,
        confidenceGrade: "A" as const,
        stabilityScore: 80,
        projectionConsistency: "Stable",
        variance: "low" as const,
        reliability: "A" as const,
        dataCompleteness: 90,
        injuryCoverage: "Available",
        weatherCoverage: "Available",
        marketCoverage: "Available",
        expertConsensus: "Available",
        internalAgreement: "High",
        externalAgreement: "Moderate",
        historicalAgreement: "High",
        overallAgreement: "Strong",
        insights: [],
        version: "pce-1.0",
      },
    };

    const result = await agent.execute({
      context: {
        runId: "calibration-guard-test",
        platform: "draftkings",
        sport: "nfl",
        contest: "classic_salary_cap",
        slateLabel: "Test Slate",
        startedAt: new Date().toISOString(),
      },
      priorOutputs,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("MISSING_SLATE");
    }
  });
});
