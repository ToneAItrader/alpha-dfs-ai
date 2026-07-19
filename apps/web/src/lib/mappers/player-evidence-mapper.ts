import type { PlayerEvidenceResponseDto } from "@/types/dto/analysis-responses.dto";
import type {
  EvidenceSourceCategory,
  PlayerEvidenceViewModel,
} from "@/types/player-evidence-view-model";

const evidenceSourceIds: EvidenceSourceCategory[] = [
  "historical_performance",
  "matchup_analysis",
  "injury_reports",
  "weather",
  "market_signals",
  "expert_consensus",
];

function mapEvidenceSources(sources: string[]): EvidenceSourceCategory[] {
  return sources.filter((source): source is EvidenceSourceCategory =>
    evidenceSourceIds.includes(source as EvidenceSourceCategory),
  );
}

/** Maps Evidence Engine backend DTO → PlayerEvidenceViewModel. */
export function mapPlayerEvidence(dto: PlayerEvidenceResponseDto): PlayerEvidenceViewModel {
  return {
    overview: { ...dto.overview },
    filters: { ...dto.filters },
    players: dto.players.map((player) => ({
      playerId: player.slatePlayerId,
      name: player.name,
      position: player.position,
      team: player.team,
      opponent: player.opponent,
      salary: player.salary,
      projectedPoints: player.projection,
      confidence: player.confidenceScore,
      confidenceTier: player.confidenceTier,
      risk: player.risk,
      injuryStatus: player.injuryStatus,
      matchupSummary: player.matchupSummary,
      ownershipOutlook:
        player.ownershipEstimate === null ? null : `${player.ownershipEstimate}%`,
      evidenceSources: mapEvidenceSources(player.evidenceSources),
      explainabilitySummary: player.supportingRationale,
    })),
    evidenceSourceCategories: dto.evidenceSourceCategories.map((category) => ({
      id: category.id as EvidenceSourceCategory,
      label: category.label,
      status: category.status,
    })),
    confidenceSummary: {
      overallConfidence: dto.confidence.overallConfidence,
      projectionStability: dto.confidence.projectionStability,
      variance: dto.confidence.variance,
      reliabilityGrade: dto.confidence.reliabilityGrade,
    },
    explainabilitySummary: dto.explainabilitySummary,
    metadata: {
      analysisVersion: dto.metadata.analysisVersion,
      timestamp: dto.metadata.timestamp,
      dataFreshness: dto.metadata.dataFreshness,
      evidenceVersion: dto.metadata.evidenceVersion,
    },
  };
}
