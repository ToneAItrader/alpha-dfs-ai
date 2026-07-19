import type { PortfolioEngineOutput, PortfolioLineupRecord } from "@alpha-dfs/shared";
import { computeMultiLineupExposure } from "./multi-lineup-exposure";

export type PortfolioCandidate = {
  slatePlayerId: string;
  name: string;
  position: string;
  team: string;
  opponent?: string;
  salary: number;
  projection: number;
  floor: number;
  ceiling: number;
  ownershipEstimate: number;
  confidenceScore: number;
  confidenceTier: "high" | "moderate" | "low";
};

const SALARY_CAP = 50000;
const CLASSIC_SLOTS = ["QB", "RB", "RB", "WR", "WR", "WR", "TE", "FLEX", "DST"] as const;

function valueScore(player: PortfolioCandidate): number {
  const confidenceMultiplier =
    player.confidenceTier === "high" ? 1.05 : player.confidenceTier === "low" ? 0.9 : 1;
  return (player.projection / (player.salary / 1000)) * confidenceMultiplier;
}

function canFillSlot(position: string, slot: string): boolean {
  if (slot === "FLEX") return ["RB", "WR", "TE"].includes(position);
  return position === slot;
}

function minSalaryForRemainingSlots(
  slots: readonly string[],
  startIndex: number,
  available: PortfolioCandidate[],
  excludedIds: Set<string>,
): number {
  const remaining = available.filter((player) => !excludedIds.has(player.slatePlayerId));
  let total = 0;
  for (let i = startIndex; i < slots.length; i += 1) {
    const slot = slots[i];
    const slotSalaries = remaining
      .filter((player) => canFillSlot(player.position, slot))
      .map((player) => player.salary);
    total += slotSalaries.length > 0 ? Math.min(...slotSalaries) : 2800;
  }
  return total;
}

function compareCandidates(
  a: PortfolioCandidate,
  b: PortfolioCandidate,
  mode: "primary" | "hail_mary",
  variantIndex: number,
): number {
  const variantBias =
    ((a.slatePlayerId.charCodeAt(0) + variantIndex) % 7) * 0.001 -
    ((b.slatePlayerId.charCodeAt(0) + variantIndex) % 7) * 0.001;

  if (mode === "hail_mary") {
    return b.ceiling / b.salary - a.ceiling / a.salary + variantBias;
  }
  return valueScore(b) - valueScore(a) + variantBias;
}

/** Backtracking lineup builder — finds a valid classic lineup within salary cap. */
export function buildGreedyLineup(
  players: PortfolioCandidate[],
  _usedIds: Set<string>,
  mode: "primary" | "hail_mary",
  variantIndex = 0,
): PortfolioCandidate[] | null {
  const pool = players.filter((player) => !_usedIds.has(player.slatePlayerId));

  function search(
    slotIndex: number,
    selected: PortfolioCandidate[],
    salaryUsed: number,
  ): PortfolioCandidate[] | null {
    if (slotIndex >= CLASSIC_SLOTS.length) {
      return selected;
    }

    const slot = CLASSIC_SLOTS[slotIndex];
    const selectedIds = new Set(selected.map((player) => player.slatePlayerId));
    const remainingBudget = SALARY_CAP - salaryUsed;
    const minReserve = minSalaryForRemainingSlots(
      CLASSIC_SLOTS,
      slotIndex + 1,
      pool,
      selectedIds,
    );
    const maxSalary = remainingBudget - minReserve;

    if (maxSalary < 0) {
      return null;
    }

    const candidates = pool
      .filter(
        (player) =>
          !selectedIds.has(player.slatePlayerId) &&
          canFillSlot(player.position, slot) &&
          player.salary <= maxSalary,
      )
      .sort((a, b) => compareCandidates(a, b, mode, variantIndex));

    for (const candidate of candidates) {
      const result = search(slotIndex + 1, [...selected, candidate], salaryUsed + candidate.salary);
      if (result) {
        return result;
      }
    }

    return null;
  }

  return search(0, [], 0);
}

function lineupToRecord(
  lineup: PortfolioCandidate[],
  portfolioType: "primary" | "hail_mary",
  rank: number,
): PortfolioLineupRecord {
  const projected = lineup.reduce((sum, player) => sum + player.projection, 0);
  const salaryUsed = lineup.reduce((sum, player) => sum + player.salary, 0);
  const avgConfidence =
    lineup.reduce((sum, player) => sum + player.confidenceScore, 0) / lineup.length;
  const avgOwnership =
    lineup.reduce((sum, player) => sum + player.ownershipEstimate, 0) / lineup.length;
  const stackTeam = lineup.find((player) => player.position === "QB")?.team;
  const stackCount = lineup.filter((player) => player.team === stackTeam).length;

  return {
    lineupId: `${portfolioType}-${rank}`,
    portfolioType,
    rank,
    projectedFantasyPoints: Math.round(projected * 10) / 10,
    confidenceScore: Math.round(avgConfidence),
    confidenceTier: avgConfidence >= 80 ? "high" : avgConfidence >= 60 ? "moderate" : "low",
    riskScore: portfolioType === "hail_mary" ? "High" : "Moderate",
    ownershipEstimate: Math.round(avgOwnership * 10) / 10,
    correlationScore: stackCount >= 3 ? "0.42" : "0.30",
    salaryUsed,
    leverageScore: portfolioType === "hail_mary" ? 2.2 : 1.2,
    ceilingRating:
      portfolioType === "hail_mary"
        ? Math.round(lineup.reduce((sum, player) => sum + player.ceiling, 0) * 10) / 10
        : null,
    contrarianRating: portfolioType === "hail_mary" ? "Strong" : null,
    optimizerRationale: `${portfolioType === "primary" ? "Primary" : "Hail Mary"} lineup #${rank} — ${stackCount}-man ${stackTeam ?? "team"} stack, ${lineup.length} players from heuristic PIE.`,
  };
}

function exposureLabel(count: number, total: number): string {
  const pct = (count / total) * 100;
  if (pct >= 40) return "High";
  if (pct >= 25) return "Moderate";
  return "Low";
}

function gradeFromScore(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

export type BuildPortfolioInput = {
  candidates: PortfolioCandidate[];
  confidenceScore: number;
};

/** Heuristic Portfolio Intelligence — backtracking construction without MILP optimizer. */
export function buildPortfolioOutput(input: BuildPortfolioInput): PortfolioEngineOutput {
  const { candidates, confidenceScore } = input;
  const primaryLineups: PortfolioLineupRecord[] = [];
  const hailMaryLineups: PortfolioLineupRecord[] = [];
  const primaryLineupPlayers: PortfolioCandidate[][] = [];
  const hailMaryLineupPlayers: PortfolioCandidate[][] = [];
  const emptyUsed = new Set<string>();

  for (let rank = 1; rank <= 4; rank += 1) {
    const lineup = buildGreedyLineup(candidates, emptyUsed, "primary", rank - 1);
    if (!lineup) break;
    primaryLineupPlayers.push(lineup);
    primaryLineups.push(lineupToRecord(lineup, "primary", rank));
  }

  for (let rank = 1; rank <= 2; rank += 1) {
    const lineup = buildGreedyLineup(candidates, emptyUsed, "hail_mary", rank + 10);
    if (!lineup) break;
    hailMaryLineupPlayers.push(lineup);
    hailMaryLineups.push(lineupToRecord(lineup, "hail_mary", rank));
  }

  const exposureLineups: PortfolioCandidate[][] = [];
  if (primaryLineupPlayers[0]) exposureLineups.push(primaryLineupPlayers[0]);
  if (hailMaryLineupPlayers[0]) exposureLineups.push(hailMaryLineupPlayers[0]);
  const exposureSummary = computeMultiLineupExposure(exposureLineups);

  const allLineups = [...primaryLineups, ...hailMaryLineups];
  const avgSalary =
    allLineups.reduce((sum, lineup) => sum + (lineup.salaryUsed ?? 0), 0) /
    Math.max(allLineups.length, 1);
  const avgOwnership =
    allLineups.reduce((sum, lineup) => sum + (lineup.ownershipEstimate ?? 0), 0) /
    Math.max(allLineups.length, 1);

  const positionCounts = candidates.reduce(
    (acc, player) => {
      acc[player.position] = (acc[player.position] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const healthScore = Math.min(
    100,
    Math.round(confidenceScore * 0.6 + (primaryLineups.length / 4) * 40),
  );

  const floor = allLineups.reduce(
    (sum, lineup) => sum + (lineup.projectedFantasyPoints ?? 0) * 0.75,
    0,
  );
  const ceiling = allLineups.reduce(
    (sum, lineup) => sum + (lineup.projectedFantasyPoints ?? 0) * 1.15,
    0,
  );

  return {
    healthScore,
    portfolioGrade: gradeFromScore(healthScore),
    exposure: {
      qbExposure: exposureLabel(positionCounts.QB ?? 0, candidates.length),
      rbExposure: exposureLabel(positionCounts.RB ?? 0, candidates.length),
      wrExposure: exposureLabel(positionCounts.WR ?? 0, candidates.length),
      teExposure: exposureLabel(positionCounts.TE ?? 0, candidates.length),
      dstExposure: exposureLabel(positionCounts.DST ?? 0, candidates.length),
    },
    diversity: {
      numberOfStacks: primaryLineups.length,
      teamDiversity: "High",
      opponentDiversity: "Moderate",
      correlationScore: "0.38",
    },
    ownership: {
      averageOwnership: Math.round(avgOwnership * 10) / 10,
      chalkExposure: avgOwnership > 12 ? "Moderate" : "Low",
      contrarianExposure: hailMaryLineups.length > 0 ? "Balanced" : "Low",
      leverageBalance: hailMaryLineups.length > 0 ? "Strong" : "Moderate",
    },
    salary: {
      averageSalaryUsed: Math.round(avgSalary),
      remainingSalary: Math.round(SALARY_CAP - avgSalary),
      salaryEfficiency: avgSalary >= 49000 ? "Optimal" : "Balanced",
      salaryBalance: "Balanced",
    },
    risk: {
      overallRisk: healthScore >= 75 ? "Moderate" : "Elevated",
      floor: Math.round(floor * 10) / 10,
      ceiling: Math.round(ceiling * 10) / 10,
      variance: hailMaryLineups.length > 0 ? "Medium" : "Low",
    },
    recommendations: [
      primaryLineups.length >= 3
        ? "Primary portfolio coverage sufficient"
        : "Expand primary portfolio candidate pool",
      hailMaryLineups.length > 0
        ? "Hail Mary entries available for GPP leverage"
        : "Add contrarian lineups for tournament upside",
      healthScore >= 70
        ? "Portfolio health within acceptable range"
        : "Review portfolio health metrics before submission",
      ...exposureSummary.warnings.slice(0, 2),
    ],
    exposureSummary,
    primaryLineups,
    hailMaryLineups,
    version: "pie-2.0-exposure",
  };
}
