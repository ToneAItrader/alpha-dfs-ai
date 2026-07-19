import type { SlateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";

/** View model for Slate Intelligence panel — presentation-ready strings. */
export type SlateIntelligenceViewModel = SlateIntelligencePlaceholderData & {
  liveSections: {
    summary: boolean;
    grade: boolean;
    recommendedStrategy: boolean;
    injuries: boolean;
    weather: boolean;
    ownership: boolean;
    featuredGames: boolean;
    intelligenceSummary: boolean;
  };
};
