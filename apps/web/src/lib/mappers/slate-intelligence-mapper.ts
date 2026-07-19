import { slateIntelligencePlaceholderData } from "@/config/slate-intelligence-placeholders";
import type { SlateIntelligenceResponseDto } from "@/types/dto/analysis-responses.dto";
import type { SlateIntelligenceViewModel } from "@/types/slate-intelligence-view-model";
import { mapInjuryIntelligenceOverview } from "@/lib/mappers/injury-intelligence-mapper";
import { mapVegasIntelligenceFeaturedGames } from "@/lib/mappers/vegas-intelligence-mapper";
import { mapWeatherIntelligenceSummary } from "@/lib/mappers/weather-intelligence-mapper";
import { mapOwnershipIntelligenceOutlook } from "@/lib/mappers/ownership-intelligence-mapper";
import type {
  InjuryIntelligenceResponseDto,
  OwnershipIntelligenceResponseDto,
  VegasIntelligenceResponseDto,
  WeatherIntelligenceResponseDto,
} from "@/types/dto/analysis-responses.dto";

const STRATEGY_LABELS: Record<
  NonNullable<SlateIntelligenceResponseDto["recommendedStrategy"]>,
  string
> = {
  balanced: "Balanced",
  primary_heavy: "Primary Heavy",
  gpp_heavy: "GPP Heavy",
  contrarian: "Contrarian",
  stack_aggressive: "Stack Aggressive",
};

const ALL_STRATEGY_OPTIONS = Object.values(STRATEGY_LABELS);

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function predictabilityLabel(volatilityScore: number): string {
  if (volatilityScore <= 35) return "High";
  if (volatilityScore <= 60) return "Moderate";
  return "Low";
}

function hasLiveIntelligence(dto?: SlateIntelligenceResponseDto): dto is SlateIntelligenceResponseDto {
  return Boolean(
    dto &&
      dto.slateGrade !== undefined &&
      dto.volatilityScore !== undefined &&
      dto.recommendedStrategy &&
      dto.confidenceRating !== undefined,
  );
}

/** Maps Slate Intelligence DTO → ViewModel with placeholder fallback for deferred sections. */
export function mapSlateIntelligence(
  dto: SlateIntelligenceResponseDto | undefined,
  pipelineSlateLabel?: string,
  injuryDto?: InjuryIntelligenceResponseDto,
  vegasDto?: VegasIntelligenceResponseDto,
  weatherDto?: WeatherIntelligenceResponseDto,
  ownershipDto?: OwnershipIntelligenceResponseDto,
): SlateIntelligenceViewModel {
  const injuryOverview = mapInjuryIntelligenceOverview(injuryDto);
  const featuredGamesSection = mapVegasIntelligenceFeaturedGames(vegasDto);
  const weatherSummary = mapWeatherIntelligenceSummary(weatherDto);
  const ownershipSummary = mapOwnershipIntelligenceOutlook(ownershipDto);

  if (!hasLiveIntelligence(dto)) {
    return {
      ...slateIntelligencePlaceholderData,
      summary: {
        ...slateIntelligencePlaceholderData.summary,
        slateName: pipelineSlateLabel ?? slateIntelligencePlaceholderData.summary.slateName,
      },
      injuries: injuryOverview,
      weather: weatherSummary.weather,
      ownership: ownershipSummary.ownership,
      featuredGames: featuredGamesSection.games,
      liveSections: {
        summary: false,
        grade: false,
        recommendedStrategy: false,
        injuries: injuryOverview.isLive,
        weather: weatherSummary.isLive,
        ownership: ownershipSummary.isLive,
        featuredGames: featuredGamesSection.isLive,
        intelligenceSummary: false,
      },
    };
  }

  const primaryStrategy = STRATEGY_LABELS[dto.recommendedStrategy!];

  return {
    summary: {
      slateName: dto.slateName ?? pipelineSlateLabel ?? slateIntelligencePlaceholderData.summary.slateName,
      week: dto.week !== undefined ? `Week ${dto.week}` : slateIntelligencePlaceholderData.summary.week,
      mainSlateDate: dto.slateSummary ?? slateIntelligencePlaceholderData.summary.mainSlateDate,
      games: dto.gameCount !== undefined ? String(dto.gameCount) : slateIntelligencePlaceholderData.summary.games,
      teams: dto.teamCount !== undefined ? String(dto.teamCount) : slateIntelligencePlaceholderData.summary.teams,
      totalPlayers:
        dto.totalPlayers !== undefined
          ? String(dto.totalPlayers)
          : slateIntelligencePlaceholderData.summary.totalPlayers,
    },
    grade: {
      overallGrade: `${dto.slateGrade}/100`,
      confidence: formatPercent(dto.confidenceRating!),
      volatility: `${dto.volatilityScore}/100`,
      predictability: predictabilityLabel(dto.volatilityScore!),
    },
    recommendedStrategy: {
      primary: primaryStrategy,
      options: ALL_STRATEGY_OPTIONS,
    },
    injuries: {
      majorInjuries: injuryOverview.majorInjuries,
      questionablePlayers: injuryOverview.questionablePlayers,
      backupOpportunities: injuryOverview.backupOpportunities,
      rookieOpportunities: injuryOverview.rookieOpportunities,
    },
    weather: weatherSummary.weather,
    ownership: ownershipSummary.ownership,
    featuredGames: featuredGamesSection.games,
    intelligenceSummary:
      dto.factors && dto.factors.length > 0
        ? dto.factors
        : slateIntelligencePlaceholderData.intelligenceSummary,
    liveSections: {
      summary: true,
      grade: true,
      recommendedStrategy: true,
      injuries: injuryOverview.isLive,
      weather: weatherSummary.isLive,
      ownership: ownershipSummary.isLive,
      featuredGames: featuredGamesSection.isLive,
      intelligenceSummary: Boolean(dto.factors && dto.factors.length > 0),
    },
  };
}

/** Maps full analysis bundle to Slate Intelligence ViewModel. */
export function mapSlateIntelligenceFromBundle(bundle: {
  slateIntelligence?: SlateIntelligenceResponseDto;
  injuryIntelligence?: InjuryIntelligenceResponseDto;
  vegasIntelligence?: VegasIntelligenceResponseDto;
  weatherIntelligence?: WeatherIntelligenceResponseDto;
  ownershipIntelligence?: OwnershipIntelligenceResponseDto;
  pipeline: { currentSlate: string };
}): SlateIntelligenceViewModel {
  return mapSlateIntelligence(
    bundle.slateIntelligence,
    bundle.pipeline.currentSlate,
    bundle.injuryIntelligence,
    bundle.vegasIntelligence,
    bundle.weatherIntelligence,
    bundle.ownershipIntelligence,
  );
}
