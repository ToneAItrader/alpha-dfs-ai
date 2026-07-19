# ADR-019 — V2.2 ADI Platform

**Status:** Accepted (Planning) — Opus review complete ([V2_2_ADR-019_REVIEW.md](../reviews/V2_2_ADR-019_REVIEW.md))  
**Date:** 2026-07-19  
**Capability:** V2.2 Platform  
**Related:** [ABR-001-V2_2_ARCHITECTURE_BASELINE.md](./ABR-001-V2_2_ARCHITECTURE_BASELINE.md) · [V2_2_PROGRAM_AUTHORIZATION.md](./V2_2_PROGRAM_AUTHORIZATION.md)

---

## Context

V2.1 delivers a certified intelligence pipeline with provider connectors for injury, vegas, and weather — merged into slate/player fields. V2.2 requires a **unified platform** for seven alternative data sources that produce canonical evidence rather than ad-hoc field merges.

ADI must not expose raw provider data to users or engines.

---

## Decision

Implement the **Alternative Data Intelligence (ADI) Platform** as an in-process layer beneath the V2.1 pipeline.

### Core components

| Component | Responsibility |
|-----------|----------------|
| **Connector Manager** | Register, schedule, and health-check evidence providers |
| **Source Registry** | Provider metadata, ownership, weights, feature flags |
| **Evidence Cache** | Run-scoped TTL cache of EvidencePackages |
| **Evidence Fusion Engine** | See ADR-020 |
| **Agent Orchestrator** | Coordinate fetch → cache → fusion lifecycle |
| **Event Bus** | In-process typed events (ADR-022) |
| **Learning Interface** | Hook for historical reliability updates (provider 7) |

### Platform lifecycle (per analyze run)

```text
1. Pipeline starts → adiPlatform.prepare(runContext)
2. Connector Manager fetches enabled providers (parallel, timeout-bound)
3. EvidencePackages cached
4. Fusion Engine produces NormalizedEvidenceBundle
5. Bundle attached to `AnalysisRunContext.priorOutputs.adiEvidence` (read-only for engines; fusion agent sole writer — type in `@alpha-dfs/evidence-fusion`)
6. V2.1 phases consume bundle where ADR-approved
```

### V2.1 connector coexistence (HP-2)

V2.1 injury, vegas, and weather connectors remain **authoritative** for their engine inputs until M7 engine integration explicitly switches to ADI-derived evidence. ADI provider adapters (e.g. sportsbook) must **not** duplicate V2.1 vegas field merges during M5 — they produce `EvidencePackage` only; consumption is M7.

### Feature flag

`ADI_PLATFORM_ENABLED` — default **false**. When false, platform is no-op; V2.1 behavior identical to RC.

### Package structure (planned)

```text
packages/adi-platform/       — manager, registry, cache, event bus
packages/evidence-fusion/    — fusion engine (ADR-020)
packages/adi-providers/      — seven provider adapters (M5)
```

### Integration point

Single hook in `PipelineExecutionManager.execute()` **before** `slate_intelligence` when ADI enabled:

```text
adi_platform → slate_analysis → … (existing V2.1 order)
```

No new presentation panels. No new API routes for provider data.

---

## Constraints

- Amendment 001 unchanged
- V2.1 regression suite must pass with ADI disabled
- No microservice split in V2.2 MVP
- Provider-specific logic only inside provider adapters (ADR-021)

---

## Acceptance criteria (implementation)

- [ ] `ADI_PLATFORM_ENABLED=false` → byte-identical V2.1 pipeline outputs (regression)
- [ ] Platform bootstrap/shutdown without memory leaks across 10 runs
- [ ] All provider failures degrade without aborting pipeline
- [ ] Core observability metrics (`adi.provider.fetch.duration_ms`, `adi.provider.failure.total`) implemented in **M4** per ABR-001 §14 (HP-1)
- [ ] `priorOutputs.adiEvidence` typed, immutable for engine readers (HP-3)
- [x] Opus review of this ADR complete — [V2_2_ADR-019_REVIEW.md](../reviews/V2_2_ADR-019_REVIEW.md)

---

## Consequences

**Positive:** Extensible platform; engines isolated from providers.  
**Negative:** Added pipeline latency; operational complexity for seven providers.
