import type { PredictionConfidenceResponseDto } from "@/types/dto/analysis-responses.dto";
import type { ConfidenceIndicatorsViewModel } from "@/types/confidence-indicators-view-model";

/** Maps PCE backend DTO → ConfidenceIndicatorsViewModel. Display formatting only. */
export function mapConfidenceIndicators(
  dto: PredictionConfidenceResponseDto,
): ConfidenceIndicatorsViewModel {
  return {
    overview: {
      overallConfidence: dto.overallConfidence,
      confidenceGrade: dto.confidenceGrade,
      currentStatus: dto.status,
      lastAnalysisAt: dto.lastAnalysisAt,
    },
    stability: {
      stabilityScore: dto.stabilityScore,
      projectionConsistency: dto.projectionConsistency,
      variance: dto.variance,
      reliability: dto.reliability,
    },
    quality: {
      dataCompleteness: dto.dataCompleteness,
      injuryCoverage: dto.injuryCoverage,
      weatherCoverage: dto.weatherCoverage,
      marketCoverage: dto.marketCoverage,
      expertConsensus: dto.expertConsensus,
    },
    agreement: {
      internalAgreement: dto.internalAgreement,
      externalAgreement: dto.externalAgreement,
      historicalAgreement: dto.historicalAgreement,
      overallAgreement: dto.overallAgreement,
    },
    insights: dto.insights,
    calibration: {
      enabled:
        dto.calibratedProjection !== null &&
        dto.calibratedProjection !== undefined &&
        dto.calibrationFactor !== null &&
        dto.calibrationFactor !== undefined,
      calibratedProjection: dto.calibratedProjection ?? null,
      calibrationFactor: dto.calibrationFactor ?? null,
      notes: dto.calibrationNotes ?? [],
    },
    metadata: {
      confidenceVersion: dto.metadata.confidenceVersion,
      timestamp: dto.metadata.timestamp,
      dataFreshness: dto.metadata.dataFreshness,
      analysisVersion: dto.metadata.analysisVersion,
    },
  };
}
