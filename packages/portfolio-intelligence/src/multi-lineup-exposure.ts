import type { PortfolioCandidate } from "./portfolio-builder";

export type ExposureSummary = {
  playerExposures: Array<{ playerId: string; name: string; exposurePct: number }>;
  teamExposures: Array<{ team: string; exposurePct: number }>;
  stackExposures: Array<{ gameId: string; exposurePct: number }>;
  salaryFlexibilityPct: number;
  warnings: string[];
};

const SALARY_CAP = 50000;

function gameIdForPlayer(player: PortfolioCandidate): string {
  if (player.opponent) {
    const teams = [player.team, player.opponent].sort();
    return `${teams[0]}@${teams[1]}`;
  }
  return `${player.team}-stack`;
}

function stackMembers(lineup: PortfolioCandidate[]): PortfolioCandidate[] {
  const quarterback = lineup.find((player) => player.position === "QB");
  if (!quarterback) {
    return [];
  }

  return lineup.filter(
    (player) =>
      player.team === quarterback.team &&
      ["QB", "RB", "WR", "TE"].includes(player.position),
  );
}

/** Compute multi-lineup exposure across Primary + Hail Mary (V2.1 MVP N=2). */
export function computeMultiLineupExposure(
  lineups: PortfolioCandidate[][],
): ExposureSummary {
  const activeLineups = lineups.filter((lineup) => lineup.length > 0);
  const lineupCount = activeLineups.length;
  const totalSlots = lineupCount * 9;

  if (lineupCount === 0 || totalSlots === 0) {
    return {
      playerExposures: [],
      teamExposures: [],
      stackExposures: [],
      salaryFlexibilityPct: 100,
      warnings: ["No recommended lineups available for exposure analysis"],
    };
  }

  const playerLineupCounts = new Map<string, { name: string; count: number }>();
  const teamCounts = new Map<string, number>();
  const stackCounts = new Map<string, number>();
  const remainingSalaries: number[] = [];

  for (const lineup of activeLineups) {
    const salaryUsed = lineup.reduce((sum, player) => sum + player.salary, 0);
    remainingSalaries.push(SALARY_CAP - salaryUsed);

    const seenInLineup = new Set<string>();
    for (const player of lineup) {
      if (!seenInLineup.has(player.slatePlayerId)) {
        seenInLineup.add(player.slatePlayerId);
        const current = playerLineupCounts.get(player.slatePlayerId);
        playerLineupCounts.set(player.slatePlayerId, {
          name: player.name,
          count: (current?.count ?? 0) + 1,
        });
      }

      teamCounts.set(player.team, (teamCounts.get(player.team) ?? 0) + 1);
    }

    const stack = stackMembers(lineup);
    const stackGameId = stack[0] ? gameIdForPlayer(stack[0]) : "unknown-stack";
    stackCounts.set(stackGameId, (stackCounts.get(stackGameId) ?? 0) + stack.length);
  }

  const playerExposures = [...playerLineupCounts.entries()]
    .map(([playerId, value]) => ({
      playerId,
      name: value.name,
      exposurePct: Math.round((value.count / lineupCount) * 1000) / 10,
    }))
    .sort((left, right) => right.exposurePct - left.exposurePct);

  const teamExposures = [...teamCounts.entries()]
    .map(([team, count]) => ({
      team,
      exposurePct: Math.round((count / totalSlots) * 1000) / 10,
    }))
    .sort((left, right) => right.exposurePct - left.exposurePct);

  const stackExposures = [...stackCounts.entries()]
    .map(([gameId, count]) => ({
      gameId,
      exposurePct: Math.round((count / totalSlots) * 1000) / 10,
    }))
    .sort((left, right) => right.exposurePct - left.exposurePct);

  const salaryFlexibilityPct =
    remainingSalaries.length === 0
      ? 100
      : Math.round((Math.min(...remainingSalaries) / SALARY_CAP) * 1000) / 10;

  const warnings: string[] = [];
  const duplicatedPlayers = playerExposures.filter((player) => player.exposurePct >= 100);
  if (duplicatedPlayers.length > 0) {
    warnings.push(
      `${duplicatedPlayers.length} player(s) appear in all ${lineupCount} recommended lineups`,
    );
  }

  const concentratedTeam = teamExposures.find((team) => team.exposurePct >= 35);
  if (concentratedTeam) {
    warnings.push(`Elevated ${concentratedTeam.team} team exposure (${concentratedTeam.exposurePct}%)`);
  }

  const concentratedStack = stackExposures.find((stack) => stack.exposurePct >= 35);
  if (concentratedStack) {
    warnings.push(
      `High correlated stack exposure in ${concentratedStack.gameId} (${concentratedStack.exposurePct}%)`,
    );
  }

  if (salaryFlexibilityPct < 2) {
    warnings.push("Limited remaining salary flexibility across recommended lineups");
  }

  if (warnings.length === 0) {
    warnings.push(`Multi-lineup exposure balanced across ${lineupCount} recommended lineups`);
  }

  return {
    playerExposures,
    teamExposures,
    stackExposures,
    salaryFlexibilityPct,
    warnings,
  };
}

export function exposureBalanceLabel(summary: ExposureSummary): string {
  if (summary.warnings.some((warning) => warning.includes("Elevated"))) {
    return "Review";
  }
  if (summary.warnings.some((warning) => warning.includes("Limited remaining salary"))) {
    return "Tight";
  }
  return "Balanced";
}
