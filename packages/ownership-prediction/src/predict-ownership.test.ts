import { describe, expect, it } from "vitest";
import { predictOwnershipBaseline } from "./predict-ownership";

describe("predictOwnershipBaseline", () => {
  it("uses feed ownership when projection feed values are present", () => {
    const result = predictOwnershipBaseline({
      players: [
        {
          slatePlayerId: "p1",
          name: "Feed Player",
          position: "RB",
          team: "BUF",
          opponent: "KC",
          salary: 8000,
          projection: 20,
          feedOwnership: 22,
        },
      ],
      seed: 42,
    });

    expect(result.players[0]?.ownershipSource).toBe("feed");
    expect(result.players[0]?.predictedOwnership).toBe(22);
  });

  it("predicts ownership deterministically when feed data is missing", () => {
    const first = predictOwnershipBaseline({
      players: [
        {
          slatePlayerId: "p1",
          name: "Predicted RB",
          position: "RB",
          team: "BUF",
          opponent: "KC",
          salary: 8200,
          projection: 19,
          feedOwnership: 0,
        },
        {
          slatePlayerId: "p2",
          name: "Predicted WR",
          position: "WR",
          team: "MIA",
          opponent: "NYJ",
          salary: 7000,
          projection: 16,
          feedOwnership: 0,
        },
      ],
      games: [{ home: "BUF", away: "KC", total: 50 }],
      slate: { volatilityScore: 40, recommendedStrategy: "balanced" },
      seed: 7,
    });
    const second = predictOwnershipBaseline({
      players: [
        {
          slatePlayerId: "p1",
          name: "Predicted RB",
          position: "RB",
          team: "BUF",
          opponent: "KC",
          salary: 8200,
          projection: 19,
          feedOwnership: 0,
        },
        {
          slatePlayerId: "p2",
          name: "Predicted WR",
          position: "WR",
          team: "MIA",
          opponent: "NYJ",
          salary: 7000,
          projection: 16,
          feedOwnership: 0,
        },
      ],
      games: [{ home: "BUF", away: "KC", total: 50 }],
      slate: { volatilityScore: 40, recommendedStrategy: "balanced" },
      seed: 7,
    });

    expect(first.players[0]?.ownershipSource).toBe("predicted");
    expect(first.players[0]?.predictedOwnership).toBeGreaterThan(
      first.players[1]?.predictedOwnership ?? 0,
    );
    expect(second.players).toEqual(first.players);
  });
});
