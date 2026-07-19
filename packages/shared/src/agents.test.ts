import { describe, expect, it } from "vitest";
import { runIntelligenceAgent } from "./agents";
import { engineSuccess } from "./errors";

describe("runIntelligenceAgent", () => {
  it("wraps successful agent execution with metadata", async () => {
    const result = await runIntelligenceAgent("test_agent", async () =>
      engineSuccess({
        data: { value: 42 },
        confidence: { value: 0.9, grade: "A" },
        evidence: { items: [{ id: "e1", category: "test", summary: "Evidence" }] },
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.data).toEqual({ value: 42 });
    expect(result.data.confidence.value).toBe(0.9);
    expect(result.data.evidence.items).toHaveLength(1);
    expect(result.data.execution.agentId).toBe("test_agent");
    expect(result.data.execution.status).toBe("complete");
    expect(result.data.execution.durationMs).toBeGreaterThanOrEqual(0);
  });
});
