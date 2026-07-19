import type { SlateRepository } from "../repositories/slate-repository";
import type { PlayerRepository } from "../repositories/player-repository";

const REQUIRED_POSITIONS = ["QB", "RB", "WR", "TE", "DST"] as const;
const MIN_POSITION_COUNTS: Record<string, number> = {
  QB: 1,
  RB: 2,
  WR: 3,
  TE: 1,
  DST: 1,
};

export type IngestionValidationResult =
  | { valid: true; slateId: string; playerCount: number }
  | { valid: false; errors: string[] };

export function createIngestionService(
  slateRepository: SlateRepository,
  playerRepository: PlayerRepository,
) {
  return {
    async validateActiveSlate(options?: {
      allowMissingProjections?: boolean;
    }): Promise<IngestionValidationResult> {
      const slate = await slateRepository.getActiveSlate();
      if (!slate) {
        return { valid: false, errors: ["No active slate found"] };
      }

      const errors: string[] = [];
      const playerCount = await playerRepository.countBySlate(slate.id);
      if (playerCount === 0) {
        errors.push("Slate has no active players");
      }

      const positionCounts = await playerRepository.countByPosition(slate.id);
      for (const position of REQUIRED_POSITIONS) {
        const count = positionCounts[position] ?? 0;
        const minimum = MIN_POSITION_COUNTS[position] ?? 1;
        if (count < minimum) {
          errors.push(`Insufficient ${position} players: ${count} (need ${minimum})`);
        }
      }

      const players = await slateRepository.getSlatePlayers(slate.id);
      const missingProjections = players.filter((player) => player.projection <= 0);
      if (!options?.allowMissingProjections && missingProjections.length > 0) {
        errors.push(`${missingProjections.length} players missing projections`);
      }

      if (errors.length > 0) {
        return { valid: false, errors };
      }

      return { valid: true, slateId: slate.id, playerCount };
    },
  };
}

export type IngestionService = ReturnType<typeof createIngestionService>;
