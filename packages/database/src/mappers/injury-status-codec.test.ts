import { describe, expect, it } from "vitest";
import { encodeInjuryStatus, decodeInjuryStatus } from "./injury-status-codec";

describe("injury-status-codec", () => {
  it("round-trips injury fields without schema migration", () => {
    const encoded = encodeInjuryStatus({
      injuryStatus: "questionable",
      practiceStatus: "limited",
      gameStatus: "probable",
    });

    expect(decodeInjuryStatus(encoded)).toEqual({
      injuryStatus: "questionable",
      practiceStatus: "limited",
      gameStatus: "probable",
    });
  });
});
