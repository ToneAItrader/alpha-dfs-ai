import {
  engineFailure,
  engineSuccess,
  runIntelligenceAgent,
  type AgentInput,
  type IntelligenceAgent,
  type InjuryIntelligenceEngine,
  type InjuryIntelligenceOutput,
} from "@alpha-dfs/shared";
import { applyInjuryAdiOverlay } from "@alpha-dfs/evidence-fusion";
import { getSlateDataService } from "@/lib/backend/data/slate-data-service";
import { computeInjuryIntelligence } from "../injury-intelligence/compute-injury-intelligence";

/** Injury Intelligence Agent — implements common intelligence agent interface. */
export function createInjuryIntelligenceAgent(): IntelligenceAgent<
  InjuryIntelligenceOutput,
  "injury_intelligence"
> {
  return {
    agentId: "injury_intelligence",
    async execute(input: AgentInput) {
      return runIntelligenceAgent("injury_intelligence", async () => {
        const slateId = input.context.slateId;
        if (!slateId) {
          return engineFailure(
            "MISSING_SLATE",
            "Slate ID required for injury intelligence",
            "injury_intelligence",
          );
        }

        try {
          const players = await getSlateDataService().slateRepository.getSlatePlayers(slateId);
          if (players.length === 0) {
            return engineFailure(
              "NO_PLAYERS",
              "No slate players available for injury intelligence",
              "injury_intelligence",
            );
          }

          const { players: overlayPlayers, meta: adiMeta } = applyInjuryAdiOverlay(
            players,
            input.priorOutputs?.adiEvidence,
          );
          const data = computeInjuryIntelligence(overlayPlayers);
          if (adiMeta.adiNotes.length > 0) {
            data.factors.push(...adiMeta.adiNotes);
          }
          const confidenceValue = Math.min(1, (data.injuryCoverage / 100) * adiMeta.confidenceMultiplier);

          return engineSuccess({
            data,
            confidence: {
              value: confidenceValue,
              grade:
                confidenceValue >= 0.85
                  ? "A"
                  : confidenceValue >= 0.7
                    ? "B"
                    : confidenceValue >= 0.55
                      ? "C"
                      : "D",
              rationale: `Injury intelligence confidence from ${data.injuryCoverage}% player coverage`,
            },
            evidence: {
              summary: data.assessment,
              items: data.factors.map((factor, index) => ({
                id: `injury-factor-${index + 1}`,
                category: "injury_intelligence",
                summary: factor,
              })),
            },
          });
        } catch (error) {
          return engineFailure(
            "INJURY_INTELLIGENCE_FAILED",
            error instanceof Error ? error.message : "Injury intelligence failed",
            "injury_intelligence",
          );
        }
      });
    },
  };
}

/** Pipeline engine adapter — bridges agent output to engine registry contract. */
export function createInjuryIntelligenceEngineAdapter(): InjuryIntelligenceEngine {
  const agent = createInjuryIntelligenceAgent();

  return {
    engineId: "injury_intelligence",
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
