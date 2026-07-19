import type { PlayerAnalysisOutput } from "@alpha-dfs/shared";
import { createSeededRandom, percentile, sampleTruncatedNormal, stdDevFromVarianceRating } from "./distributions";

export type FieldPlayer = {
  id: string;
  position: string;
  projection: number;
  floor: number;
  ceiling: number;
  ownership: number;
};

export type GppFieldInput = {
  playerAnalysis: PlayerAnalysisOutput;
  lineupMean: number;
  variance: "low" | "medium" | "high";
  floor: number;
  ceiling: number;
  simulationCount?: number;
  fieldSize?: number;
  cashThreshold?: number;
  seed?: number;
};

export type GppFieldResult = {
  fieldSize: number;
  fieldPercentile: number;
  topOnePercentRate: number;
  cashRate: number;
};

function ownershipWeight(player: FieldPlayer): number {
  return player.ownership > 0 ? player.ownership : 1;
}

function weightedPick(candidates: FieldPlayer[], random: () => number): FieldPlayer | null {
  if (candidates.length === 0) return null;
  const total = candidates.reduce((sum, player) => sum + ownershipWeight(player), 0);
  let roll = random() * total;
  for (const player of candidates) {
    roll -= ownershipWeight(player);
    if (roll <= 0) return player;
  }
  return candidates[candidates.length - 1] ?? null;
}

function weightedPickDistinct(
  candidates: FieldPlayer[],
  count: number,
  random: () => number,
): FieldPlayer[] {
  const pool = [...candidates];
  const selected: FieldPlayer[] = [];
  while (selected.length < count && pool.length > 0) {
    const pick = weightedPick(pool, random);
    if (!pick) break;
    selected.push(pick);
    pool.splice(pool.indexOf(pick), 1);
  }
  return selected;
}

function toFieldPlayers(playerAnalysis: PlayerAnalysisOutput): FieldPlayer[] {
  return playerAnalysis.players.map((player) => ({
    id: player.slatePlayerId,
    position: player.position,
    projection: player.projection,
    floor: Math.max(0, player.projection * 0.6),
    ceiling: player.projection * 1.4,
    ownership: player.ownershipEstimate > 0 ? player.ownershipEstimate : 1,
  }));
}

/** Build one ownership-weighted DK Classic lineup from the slate pool. */
export function buildFieldLineup(players: FieldPlayer[], random: () => number): FieldPlayer[] {
  const byPosition = new Map<string, FieldPlayer[]>();
  for (const player of players) {
    const list = byPosition.get(player.position) ?? [];
    list.push(player);
    byPosition.set(player.position, list);
  }

  const lineup: FieldPlayer[] = [];
  const qb = weightedPick(byPosition.get("QB") ?? [], random);
  if (qb) lineup.push(qb);

  lineup.push(...weightedPickDistinct(byPosition.get("RB") ?? [], 2, random));
  lineup.push(...weightedPickDistinct(byPosition.get("WR") ?? [], 3, random));

  const te = weightedPick(
    (byPosition.get("TE") ?? []).filter((player) => !lineup.includes(player)),
    random,
  );
  if (te) lineup.push(te);

  const flexPool = [...(byPosition.get("RB") ?? []), ...(byPosition.get("WR") ?? []), ...(byPosition.get("TE") ?? [])]
    .filter((player) => !lineup.includes(player));
  const flex = weightedPick(flexPool, random);
  if (flex) lineup.push(flex);

  const dst = weightedPick(byPosition.get("DST") ?? [], random);
  if (dst) lineup.push(dst);

  return lineup;
}

function scoreLineup(lineup: FieldPlayer[], sampledPoints: Map<string, number>): number {
  return lineup.reduce((sum, player) => sum + (sampledPoints.get(player.id) ?? player.projection), 0);
}

/** Simulate recommended lineup percentile against a synthetic ownership-weighted GPP field. */
export function runGppFieldSimulation(input: GppFieldInput): GppFieldResult {
  const {
    playerAnalysis,
    lineupMean,
    variance,
    floor,
    ceiling,
    simulationCount = 10000,
    fieldSize = 10000,
    cashThreshold = 150,
    seed = 42,
  } = input;

  const random = createSeededRandom(seed);
  const players = toFieldPlayers(playerAnalysis);
  const lineupStdDev = stdDevFromVarianceRating(lineupMean, variance);

  const fieldTemplates: FieldPlayer[][] = [];
  for (let index = 0; index < fieldSize; index += 1) {
    fieldTemplates.push(buildFieldLineup(players, random));
  }

  let percentileTotal = 0;
  let topOneCount = 0;
  let cashCount = 0;

  for (let iteration = 0; iteration < simulationCount; iteration += 1) {
    const sampledPoints = new Map<string, number>();
    for (const player of players) {
      const playerStdDev = stdDevFromVarianceRating(player.projection, variance);
      sampledPoints.set(
        player.id,
        sampleTruncatedNormal(random, player.projection, playerStdDev, player.floor, player.ceiling),
      );
    }

    const ourScore = sampleTruncatedNormal(random, lineupMean, lineupStdDev, floor, ceiling);
    const fieldScores = fieldTemplates.map((template) => scoreLineup(template, sampledPoints));
    fieldScores.sort((left, right) => left - right);

    const rank = fieldScores.filter((score) => score < ourScore).length;
    const percentileVsField = fieldSize <= 1 ? 100 : (rank / fieldSize) * 100;
    percentileTotal += percentileVsField;

    if (percentileVsField >= 99) topOneCount += 1;
    if (ourScore >= cashThreshold) cashCount += 1;
  }

  return {
    fieldSize,
    fieldPercentile: Math.round((percentileTotal / simulationCount) * 10) / 10,
    topOnePercentRate: Math.round((topOneCount / simulationCount) * 1000) / 10,
    cashRate: Math.round((cashCount / simulationCount) * 1000) / 10,
  };
}
