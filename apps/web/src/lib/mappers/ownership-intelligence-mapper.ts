import type { OwnershipIntelligenceResponseDto } from "@/types/dto/analysis-responses.dto";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

/** Maps Ownership Intelligence DTO → Slate Intelligence ownership outlook section. */
export function mapOwnershipIntelligenceOutlook(
  dto: OwnershipIntelligenceResponseDto | undefined,
): {
  ownership: typeof slateIntelligencePlaceholderData.ownership;
  isLive: boolean;
} {
  if (
    dto?.averagePredictedOwnership === undefined ||
    dto.chalkPlayerCount === undefined ||
    dto.contrarianPlayerCount === undefined ||
    dto.leverageOpportunities === undefined ||
    dto.ownershipConcentration === undefined
  ) {
    return {
      ownership: slateIntelligencePlaceholderData.ownership,
      isLive: false,
    };
  }

  return {
    isLive: true,
    ownership: {
      chalkPlayers: `${dto.chalkPlayerCount} players (18%+)`,
      contrarianOpportunities: `${dto.contrarianPlayerCount} players (8% or less)`,
      ownershipConcentration: `${dto.ownershipConcentration}% top-five concentration`,
      leverageOpportunities: `${dto.leverageOpportunities} leverage targets`,
    },
  };
}
