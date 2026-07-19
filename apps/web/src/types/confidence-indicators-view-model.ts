/**
 * Frontend contract for Confidence Indicators (PCE outputs).
 * Prediction Confidence Engine will populate this in Task 10.10 — UI consumes only this shape.
 */

import type { ConfidenceStatus, ConfidenceTier } from "@/types/shared/confidence";

export type { ConfidenceStatus, ConfidenceTier };

export type ConfidenceIndicatorsViewModel = {
  overview: {
    overallConfidence: number | null;
    confidenceGrade: string | null;
    currentStatus: ConfidenceStatus;
    lastAnalysisAt: string | null;
  };
  stability: {
    stabilityScore: number | null;
    projectionConsistency: string | null;
    variance: string | null;
    reliability: string | null;
  };
  quality: {
    dataCompleteness: number | null;
    injuryCoverage: string | null;
    weatherCoverage: string | null;
    marketCoverage: string | null;
    expertConsensus: string | null;
  };
  agreement: {
    internalAgreement: string | null;
    externalAgreement: string | null;
    historicalAgreement: string | null;
    overallAgreement: string | null;
  };
  insights: string[];
  calibration: {
    enabled: boolean;
    calibratedProjection: number | null;
    calibrationFactor: number | null;
    notes: string[];
  };
  metadata: {
    confidenceVersion: string | null;
    timestamp: string | null;
    dataFreshness: string | null;
    analysisVersion: string | null;
  };
};
