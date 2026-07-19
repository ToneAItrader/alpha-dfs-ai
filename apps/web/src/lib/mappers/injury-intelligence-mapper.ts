import type { InjuryIntelligenceResponseDto } from "@/types/dto/analysis-responses.dto";
import type { SlateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";
import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

export type InjuryOverviewViewModel = SlateIntelligencePlaceholderData["injuries"] & {
  isLive: boolean;
};

/** Maps Injury Intelligence DTO → Slate Intelligence injury section ViewModel. */
export function mapInjuryIntelligenceOverview(
  dto: InjuryIntelligenceResponseDto | undefined,
): InjuryOverviewViewModel {
  if (!dto || dto.majorInjuries === undefined) {
    return {
      ...slateIntelligencePlaceholderData.injuries,
      isLive: false,
    };
  }

  return {
    majorInjuries: String(dto.majorInjuries),
    questionablePlayers: String(dto.questionablePlayers ?? 0),
    backupOpportunities: String(dto.backupOpportunities ?? 0),
    rookieOpportunities: String(dto.rookieOpportunities ?? 0),
    isLive: true,
  };
}
