import type { InjuryIntelligenceOutput } from "@alpha-dfs/shared";

export type InjuryPlayerSnapshot = {
  name: string;
  position: string;
  team: string;
  salary: number;
  injuryStatus: "healthy" | "questionable" | "doubtful" | "out" | "unknown";
  practiceStatus?: string;
  gameStatus?: string;
  domains: { injury: boolean };
};

function isMajorInjury(status: InjuryPlayerSnapshot["injuryStatus"]): boolean {
  return status === "out" || status === "doubtful";
}

function isBackupOpportunity(player: InjuryPlayerSnapshot, teammates: InjuryPlayerSnapshot[]): boolean {
  if (player.injuryStatus === "healthy") return false;
  return teammates.some(
    (teammate) =>
      teammate.team === player.team &&
      teammate.position === player.position &&
      teammate.injuryStatus === "healthy" &&
      teammate.salary < player.salary,
  );
}

/** Pure injury intelligence computation — unit-testable without I/O. */
export function computeInjuryIntelligence(
  players: InjuryPlayerSnapshot[],
): InjuryIntelligenceOutput {
  const injuryPlayers = players.filter((player) => player.domains.injury || player.injuryStatus !== "unknown");
  const questionablePlayers = players.filter((player) => player.injuryStatus === "questionable").length;
  const doubtfulPlayers = players.filter((player) => player.injuryStatus === "doubtful").length;
  const outPlayers = players.filter((player) => player.injuryStatus === "out").length;
  const majorInjuries = players.filter((player) => isMajorInjury(player.injuryStatus)).length;
  const backupOpportunities = players.filter((player) =>
    isBackupOpportunity(player, players),
  ).length;
  const rookieOpportunities = players.filter(
    (player) => player.injuryStatus !== "healthy" && player.salary <= 5500,
  ).length;

  const injuryCoverage =
    players.length === 0
      ? 0
      : Math.round((injuryPlayers.length / players.length) * 100);

  const factors = [
    `${majorInjuries} major injuries (out/doubtful) on slate`,
    `${questionablePlayers} questionable players require monitoring`,
    `${backupOpportunities} potential backup leverage spots identified`,
    `Injury data coverage at ${injuryCoverage}%`,
  ];

  if (outPlayers > 0) {
    factors.push(`${outPlayers} players ruled out — review roster pivots`);
  }

  const assessment =
    majorInjuries >= 3
      ? "Elevated injury volatility — prioritize confirmed starters and monitor inactives."
      : questionablePlayers >= 4
        ? "Moderate injury uncertainty — track practice reports before lock."
        : "Injury landscape manageable — standard readiness checks sufficient.";

  const lineupImpactSummary =
    majorInjuries > 0
      ? `${majorInjuries} high-impact injuries may alter core lineup construction.`
      : "No major slate-wide lineup disruptions expected from current injury reports.";

  return {
    majorInjuries,
    questionablePlayers,
    doubtfulPlayers,
    outPlayers,
    backupOpportunities,
    rookieOpportunities,
    lineupImpactSummary,
    assessment,
    factors,
    injuryCoverage,
  };
}
