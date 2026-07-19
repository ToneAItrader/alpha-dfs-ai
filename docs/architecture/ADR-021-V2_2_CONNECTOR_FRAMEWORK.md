# ADR-021 — V2.2 Connector Framework (Evidence Providers)

**Status:** Accepted (Planning)  
**Date:** 2026-07-19  
**Related:** [ADR-019](./ADR-019-V2_2_ADI_PLATFORM.md) · [CONNECTOR_ADR_001.md](./CONNECTOR_ADR_001.md)

---

## Context

V2.1 connectors merge into slate/player fields. V2.2 evidence providers must output **EvidencePackage** only, with all provider-specific parsing isolated in adapters.

---

## Decision

Define **`EvidenceProvider`** interface extending V2.1 connector patterns.

### Interface contract

```typescript
interface EvidenceProvider {
  readonly providerId: string;
  readonly providerVersion: string;
  readonly domains: EvidenceDomain[];

  fetch(context: EvidenceFetchContext): Promise<EvidenceFetchResult>;
  health(): Promise<ProviderHealth>;
}

type EvidenceFetchContext = {
  slateId: string;
  runId: string;
  players: ReadonlyArray<SlatePlayerRef>;
  games: ReadonlyArray<SlateGameRef>;
  correlationId?: string;
};

type EvidenceFetchResult =
  | { ok: true; packages: EvidencePackage[]; degraded?: boolean }
  | { ok: false; error: ProviderError; retryable: boolean };
```

### Provider lifecycle

```text
registered → enabled (flag) → fetch scheduled → success | degrade | fail
                                    ↓
                              health check (startup + per-fetch)
```

### Retry policy

| Priority | Max retries | Backoff | Timeout |
|----------|-------------|---------|---------|
| P0 (consensus, injury news) | 3 | exponential | 10s |
| P1 (social, DFS content) | 2 | linear | 8s |
| P2 (historical learning) | 1 | none | 5s |

Reuse `@alpha-dfs/connectors` `fetchWithRetry` and rate limiter.

### Normalization rules

- All provider adapters **must** map to `EvidenceItem` taxonomy (ADR-020)
- Provider may not emit fields outside schema
- Raw HTML/JSON never leaves adapter — only normalized items

### Versioning

- `providerVersion` semver in each package
- Breaking schema changes → major bump + fusion compatibility check
- Source Registry stores min supported version

### Feature flags

Per provider: `ADI_PROVIDER_<ID>_ENABLED` (default false)

### Ownership matrix

| Domain | Owner provider | Merge rule |
|--------|----------------|------------|
| Injury news | News provider | Fusion with V2.1 injury connector — fusion wins on conflict |
| Vegas/market | Sportsbook provider | Fusion with V2.1 vegas — complementary |
| Projections | Consensus provider | Fusion only — does not overwrite feed projection directly |
| Ownership/chalk | DFS content + social | Fusion → ownership engine |
| Reliability | Historical learning | Adjusts source weights only |

---

## Acceptance criteria

- [ ] Stub provider implements interface for integration tests
- [ ] Provider failure does not throw — returns `ok: false`
- [ ] Seed fixtures for all seven providers in `packages/adi-providers/fixtures/`
- [ ] `.env.example` documents all provider flags

---

## Consequences

Reuses V2.1 connector investment. Clear boundary prevents engine contamination.
