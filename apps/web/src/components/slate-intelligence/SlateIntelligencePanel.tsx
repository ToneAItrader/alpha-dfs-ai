import { FeaturedGamesSection } from "@/components/slate-intelligence/FeaturedGamesSection";
import { InjuryOverviewSection } from "@/components/slate-intelligence/InjuryOverviewSection";
import { IntelligenceSummarySection } from "@/components/slate-intelligence/IntelligenceSummarySection";
import { OwnershipOutlookSection } from "@/components/slate-intelligence/OwnershipOutlookSection";
import { RecommendedStrategySection } from "@/components/slate-intelligence/RecommendedStrategySection";
import { SlateGradeSection } from "@/components/slate-intelligence/SlateGradeSection";
import { SlateSummarySection } from "@/components/slate-intelligence/SlateSummarySection";
import { WeatherSummarySection } from "@/components/slate-intelligence/WeatherSummarySection";
import type { SlateIntelligenceViewModel } from "@/types/slate-intelligence-view-model";

type SlateIntelligencePanelProps = {
  viewModel: SlateIntelligenceViewModel;
};

export function SlateIntelligencePanel({ viewModel }: SlateIntelligencePanelProps) {
  return (
    <div className="space-y-8">
      <SlateSummarySection data={viewModel.summary} />
      <SlateGradeSection data={viewModel.grade} />
      <RecommendedStrategySection data={viewModel.recommendedStrategy} />
      <InjuryOverviewSection data={viewModel.injuries} />
      <WeatherSummarySection data={viewModel.weather} />
      <OwnershipOutlookSection data={viewModel.ownership} />
      <FeaturedGamesSection games={viewModel.featuredGames} />
      <IntelligenceSummarySection insights={viewModel.intelligenceSummary} />
    </div>
  );
}
