import {
  engineFailure,
  engineSuccess,
  runIntelligenceAgent,
  type AgentInput,
  type IntelligenceAgent,
  type SlateIntelligenceEngine,
  type SlateIntelligenceOutput,
} from "@alpha-dfs/shared";
import { getSlateDataService } from "@/lib/backend/data/slate-data-service";
import { computeSlateIntelligence } from "../slate-intelligence/compute-slate-intelligence";

function countUniqueMatchups(players: { team: string; opponent: string }[]): number {
  const matchups = new Set<string>();
  for (const player of players) {
    const teams = [player.team, player.opponent].sort();
    matchups.add(teams.join("@"));
  }
  return matchups.size;
}

function countUniqueTeams(players: { team: string }[]): number {
  return new Set(players.map((player) => player.team)).size;
}

/** Slate Intelligence Agent — implements common intelligence agent interface. */
export function createSlateIntelligenceAgent(): IntelligenceAgent<
  SlateIntelligenceOutput,
  "slate_intelligence"
> {
  return {
    agentId: "slate_intelligence",
    async execute(input: AgentInput) {
      return runIntelligenceAgent("slate_intelligence", async () => {
        const readiness = input.priorOutputs?.slate;
        if (!readiness) {
          return engineFailure(
            "MISSING_READINESS",
            "Slate analysis output required before slate intelligence",
            "slate_intelligence",
          );
        }

        const slateId = input.context.slateId;
        if (!slateId) {
          return engineFailure(
            "MISSING_SLATE",
            "Slate ID required for slate intelligence",
            "slate_intelligence",
          );
        }

        try {
          const { slateRepository } = getSlateDataService();
          const slate = await slateRepository.getSlateById(slateId);
          if (!slate) {
            return engineFailure("SLATE_NOT_FOUND", "Slate not found", "slate_intelligence");
          }

          const players = await slateRepository.getSlatePlayers(slateId);
          const gameCount = countUniqueMatchups(players);
          const teamCount = countUniqueTeams(players);
          const data = computeSlateIntelligence({
            slateLabel: input.context.slateLabel,
            slateName: slate.name,
            week: slate.week,
            readiness,
            gameCount,
            teamCount,
            totalPlayers: players.length,
          });

          return engineSuccess({
            data,
            confidence: {
              value: data.confidenceRating,
              grade:
                data.confidenceRating >= 0.85
                  ? "A"
                  : data.confidenceRating >= 0.7
                    ? "B"
                    : data.confidenceRating >= 0.55
                      ? "C"
                      : "D",
              rationale: `Slate intelligence confidence derived from ${readiness.dataCompleteness}% data completeness`,
            },
            evidence: {
              summary: data.slateSummary,
              items: data.factors.map((factor, index) => ({
                id: `slate-factor-${index + 1}`,
                category: "slate_intelligence",
                summary: factor,
              })),
            },
          });
        } catch (error) {
          return engineFailure(
            "SLATE_INTELLIGENCE_FAILED",
            error instanceof Error ? error.message : "Slate intelligence failed",
            "slate_intelligence",
          );
        }
      });
    },
  };
}

/** Pipeline engine adapter — bridges agent output to engine registry contract. */
export function createSlateIntelligenceEngineAdapter(): SlateIntelligenceEngine {
  const agent = createSlateIntelligenceAgent();

  return {
    engineId: "slate_intelligence",
    async analyze(context) {
      const result = await agent.execute({
        context,
        priorOutputs: context.priorOutputs,
      });

      if (!result.ok) {
        return result;
      }

      return engineSuccess(result.data.data);
    },
  };
}
