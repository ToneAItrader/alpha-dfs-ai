import { describe, expect, it } from "vitest";
import { normalizeInjuryExport, normalizeInjuryFeed } from "./injury-normalizer";

describe("injury-normalizer", () => {
  it("normalizes injury export records", () => {
    const records = normalizeInjuryExport({
      injuries: [
        {
          playerId: "p3",
          injuryStatus: "questionable",
          practiceStatus: "limited",
          gameStatus: "probable",
        },
      ],
    });

    const players = normalizeInjuryFeed(records);
    expect(players[0]?.injuryStatus).toBe("questionable");
    expect(players[0]?.practiceStatus).toBe("limited");
    expect(players[0]?.domains.injury).toBe(true);
  });
});
