import type { AdiEvidencePackage } from "@alpha-dfs/shared";

export type EvidenceDomain =
  | "news"
  | "social"
  | "sportsbook"
  | "consensus"
  | "dfs_content"
  | "betting"
  | "historical_learning";

export type ProviderHealth = {
  providerId: string;
  status: "healthy" | "degraded" | "unavailable";
  lastCheckedAt: string;
  message?: string;
};

export type { AdiEvidencePackage as EvidencePackage };

export type AdiEventName =
  | "pipeline.run.started"
  | "pipeline.run.completed"
  | "adi.platform.ready"
  | "adi.fetch.requested"
  | "adi.evidence.received"
  | "adi.fusion.requested"
  | "adi.fusion.completed"
  | "adi.provider.degraded"
  | "adi.provider.failed";

export type AdiEventPayloadMap = {
  "pipeline.run.started": {
    schemaVersion: "1.0";
    runId: string;
    slateId: string;
    correlationId: string;
    adiEnabled: boolean;
  };
  "pipeline.run.completed": {
    schemaVersion: "1.0";
    runId: string;
    success: boolean;
    durationMs: number;
  };
  "adi.platform.ready": {
    schemaVersion: "1.0";
    runId: string;
    slateId: string;
    providerCount: number;
  };
  "adi.fetch.requested": {
    schemaVersion: "1.0";
    runId: string;
    slateId: string;
    providerIds: string[];
  };
  "adi.evidence.received": {
    schemaVersion: "1.0";
    runId: string;
    providerId: string;
    packageCount: number;
    itemCount: number;
    degraded: boolean;
  };
  "adi.fusion.requested": {
    schemaVersion: "1.0";
    runId: string;
    slateId: string;
    packageCount: number;
  };
  "adi.fusion.completed": {
    schemaVersion: "1.0";
    runId: string;
    subjectCount: number;
    conflictCount: number;
    platformConfidence: number;
  };
  "adi.provider.degraded": {
    schemaVersion: "1.0";
    providerId: string;
    reason: string;
    retryable: boolean;
  };
  "adi.provider.failed": {
    schemaVersion: "1.0";
    providerId: string;
    reason: string;
    retryable: boolean;
  };
};

export type AdiEventHandler<T extends AdiEventName> = (
  payload: AdiEventPayloadMap[T],
) => void | Promise<void>;
