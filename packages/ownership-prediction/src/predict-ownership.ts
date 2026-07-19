import type {
  OwnershipGameContext,
  OwnershipPlayerInput,
  OwnershipPredictionInput,
  OwnershipPredictionResult,
  OwnershipSlateContext,
  OwnershipSource,
  PlayerOwnershipPrediction,
} from "./types";

const POSITION_WEIGHT: Record<string, number> = {
  RB: 1.15,
  TE: 1.1,
  WR: 1,
  QB: 0.95,
  DST: 0.8,
};

const TARGET_OWNERSHIP_MASS = 420;

function createSeededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function findGameTotal(
  games: OwnershipGameContext[] | undefined,
  team: string,
  opponent?: string,
): number | undefined {
  if (!games || !opponent) return undefined;
  const match = games.find(
    (game) =>
      (game.home === team && game.away === opponent) ||
      (game.home === opponent && game.away === team),
  );
  return match?.total;
}

function slateScale(slate?: OwnershipSlateContext): number {
  if (!slate) return 1;
  let scale = 1;
  if (slate.volatilityScore !== undefined) {
    scale *= slate.volatilityScore >= 60 ? 0.92 : slate.volatilityScore <= 35 ? 1.05 : 1;
  }
  if (slate.recommendedStrategy === "contrarian") {
    scale *= 0.94;
  }
  if (slate.recommendedStrategy === "gpp_heavy") {
    scale *= 1.04;
  }
  return scale;
}

function salaryRankScore(
  player: OwnershipPlayerInput,
  players: OwnershipPlayerInput[],
): number {
  const peers = players
    .filter((candidate) => candidate.position === player.position)
    .sort((left, right) => right.salary - left.salary);
  const index = peers.findIndex((candidate) => candidate.slatePlayerId === player.slatePlayerId);
  if (index < 0 || peers.length <= 1) return 1;
  return 1 - index / (peers.length - 1);
}

function rawPredictedScore(
  player: OwnershipPlayerInput,
  players: OwnershipPlayerInput[],
  games: OwnershipGameContext[] | undefined,
  slate?: OwnershipSlateContext,
): number {
  const salaryScore = salaryRankScore(player, players);
  const positionWeight = POSITION_WEIGHT[player.position] ?? 1;
  const gameTotal = findGameTotal(games, player.team, player.opponent);
  const gameBoost =
    gameTotal === undefined ? 1 : gameTotal >= 48 ? 1.12 : gameTotal < 44 ? 0.94 : 1;
  const projectionBoost = 1 + Math.min(player.projection, 30) / 100;

  return (
    (4 + salaryScore * 18) *
    positionWeight *
    gameBoost *
    projectionBoost *
    slateScale(slate)
  );
}

function roundOwnership(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Deterministic baseline ownership prediction for V2.1 MVP. */
export function predictOwnershipBaseline(
  input: OwnershipPredictionInput,
): OwnershipPredictionResult {
  const { players, games, slate, seed = 42 } = input;
  const random = createSeededRandom(seed);

  if (players.length === 0) {
    return {
      players: [],
      averagePredictedOwnership: 0,
      chalkPlayerCount: 0,
      contrarianPlayerCount: 0,
      leverageOpportunities: 0,
      ownershipConcentration: 0,
      assessment: "No slate players available for ownership prediction",
      factors: [],
      version: "own-1.0",
    };
  }

  const predictedOnly = players.filter((player) => (player.feedOwnership ?? 0) <= 0);
  const rawScores = predictedOnly.map((player) =>
    rawPredictedScore(player, players, games, slate),
  );
  const rawTotal = rawScores.reduce((sum, score) => sum + score, 0) || 1;

  const predictions: PlayerOwnershipPrediction[] = players.map((player) => {
    const feedOwnership = player.feedOwnership ?? 0;
    if (feedOwnership > 0) {
      return {
        slatePlayerId: player.slatePlayerId,
        name: player.name,
        predictedOwnership: roundOwnership(feedOwnership),
        ownershipSource: "feed",
      };
    }

    const raw = rawPredictedScore(player, players, games, slate);
    const normalized = (raw / rawTotal) * TARGET_OWNERSHIP_MASS;
    const jitter = (random() - 0.5) * 0.4;
    return {
      slatePlayerId: player.slatePlayerId,
      name: player.name,
      predictedOwnership: roundOwnership(Math.max(1, normalized + jitter)),
      ownershipSource: "predicted",
    };
  });

  const averagePredictedOwnership = roundOwnership(
    predictions.reduce((sum, player) => sum + player.predictedOwnership, 0) /
      predictions.length,
  );
  const chalkPlayerCount = predictions.filter((player) => player.predictedOwnership >= 18).length;
  const contrarianPlayerCount = predictions.filter((player) => player.predictedOwnership <= 8).length;
  const sorted = [...predictions].sort(
    (left, right) => right.predictedOwnership - left.predictedOwnership,
  );
  const ownershipConcentration = roundOwnership(
    sorted.slice(0, 5).reduce((sum, player) => sum + player.predictedOwnership, 0),
  );

  const projectionRank = new Map(
    [...players]
      .sort((left, right) => right.projection - left.projection)
      .map((player, index) => [player.slatePlayerId, index + 1]),
  );
  const leverageOpportunities = predictions.filter((player) => {
    const rank = projectionRank.get(player.slatePlayerId) ?? players.length;
    return rank <= Math.ceil(players.length * 0.25) && player.predictedOwnership <= 10;
  }).length;

  const feedCount = predictions.filter((player) => player.ownershipSource === "feed").length;
  const predictedCount = predictions.filter((player) => player.ownershipSource === "predicted").length;

  return {
    players: predictions,
    averagePredictedOwnership,
    chalkPlayerCount,
    contrarianPlayerCount,
    leverageOpportunities,
    ownershipConcentration,
    assessment:
      leverageOpportunities > 0
        ? "Baseline ownership model identifies leverage targets for GPP field simulation."
        : "Baseline ownership model provides slate-wide chalk and contrarian context.",
    factors: [
      `${feedCount} players using projection feed ownership`,
      `${predictedCount} players using rule-based ownership prediction`,
      `${chalkPlayerCount} chalk plays (18%+ predicted ownership)`,
      `${contrarianPlayerCount} contrarian plays (8% or lower)`,
      `Top-five ownership concentration ${ownershipConcentration}%`,
      slate?.recommendedStrategy
        ? `Slate strategy ${slate.recommendedStrategy} applied to ownership scaling`
        : "Slate strategy scaling skipped — slate intelligence unavailable",
    ],
    version: "own-1.0",
  };
}

export function ownershipByPlayerId(
  result: OwnershipPredictionResult,
): Map<string, PlayerOwnershipPrediction> {
  return new Map(result.players.map((player) => [player.slatePlayerId, player]));
}
