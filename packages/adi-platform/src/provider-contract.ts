import type { EvidenceDomain, EvidencePackage, ProviderHealth } from "./types";

export type EvidenceFetchContext = {
  slateId: string;
  runId: string;
  players: ReadonlyArray<{ slatePlayerId: string; name: string; team: string }>;
  games: ReadonlyArray<{ gameKey: string; homeTeam: string; awayTeam: string }>;
  correlationId?: string;
};

export type ProviderError = {
  code: string;
  message: string;
  providerId: string;
};

export type EvidenceFetchResult =
  | { ok: true; packages: EvidencePackage[]; degraded?: boolean }
  | { ok: false; error: ProviderError; retryable: boolean };

export interface EvidenceProvider {
  readonly providerId: string;
  readonly providerVersion: string;
  readonly domains: EvidenceDomain[];

  fetch(context: EvidenceFetchContext): Promise<EvidenceFetchResult>;
  health(): Promise<ProviderHealth>;
}

export type ProviderDescriptor = {
  providerId: string;
  displayName: string;
  version: string;
  domains: EvidenceDomain[];
  defaultWeight: number;
  priority: "P0" | "P1" | "P2";
};

export type { EvidenceDomain, EvidencePackage, ProviderHealth } from "./types";
