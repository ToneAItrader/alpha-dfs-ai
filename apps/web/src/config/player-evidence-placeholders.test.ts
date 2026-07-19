import { describe, expect, it } from "vitest";
import { playerEvidencePlaceholder } from "@/config/player-evidence-placeholders";
import type { PlayerEvidenceViewModel } from "@/types/player-evidence-view-model";

describe("playerEvidencePlaceholder", () => {
  it("conforms to PlayerEvidenceViewModel", () => {
    const vm: PlayerEvidenceViewModel = playerEvidencePlaceholder;

    expect(vm.players.length).toBeGreaterThan(0);
    expect(vm.evidenceSourceCategories).toHaveLength(6);
    expect(vm.filters.positions.length).toBeGreaterThan(0);
    expect(vm.explainabilitySummary.length).toBeGreaterThan(0);
  });
});
