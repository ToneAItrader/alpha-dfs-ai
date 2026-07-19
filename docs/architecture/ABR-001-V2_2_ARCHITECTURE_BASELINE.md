# ABR-001 — Architecture Baseline (V2.2 Revision)

**Document ID:** ABR-001  
**Revision:** 2.2  
**Date:** 2026-07-19  
**Status:** ✅ Planning Complete — Approved for Implementation ([V2_2_ARCHITECTURE_READINESS_REVIEW.md](./V2_2_ARCHITECTURE_READINESS_REVIEW.md))  
**Baseline:** V2.1 Release Candidate (`v2.1.0`)  
**Program:** [V2_2_PROGRAM_AUTHORIZATION.md](./V2_2_PROGRAM_AUTHORIZATION.md)

---

## 1. Executive Architecture Overview

Alpha DFS AI V2.2 adds an **Alternative Data Intelligence (ADI) platform** beneath the existing V2.1 intelligence pipeline. ADI ingests external signals through a unified connector layer, normalizes them into a canonical evidence model, fuses them through a single Evidence Fusion Engine, and supplies **Normalized Evidence** to existing V2.1 engines.

**Users never interact with ADI directly.** Lineup quality improves automatically.

### Design tenets

1. **One platform, many providers** — not many independent intelligence systems
2. **Fusion before consumption** — engines never see raw provider payloads
3. **Additive evolution** — V2.1 pipeline phases, DTOs, and UI contracts preserved
4. **Fail degradable** — missing providers reduce confidence, not crash analysis
5. **Observable by default** — every evidence item traceable to source and fusion decision

---

## 2. System Context

```text
┌─────────────────────────────────────────────────────────────────┐
│                     Alpha DFS AI (V2.2)                          │
│  ┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐ │
│  │  Operators  │───▶│  Next.js UI      │    │  Ops / Deploy   │ │
│  │  (Analyze)  │    │  (V2.1 panels)   │    │  Scripts        │ │
│  └─────────────┘    └────────┬─────────┘    └────────┬────────┘ │
│                              │                        │          │
│                    ┌─────────▼────────────────────────▼──────┐  │
│                    │     Analysis Pipeline (V2.1 + ADI)     │  │
│                    └─────────┬──────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────▼───────────────────────────────┐  │
│  │              ADI Platform (V2.2 — NEW)                       │  │
│  │  Connector Manager → Evidence Cache → Evidence Fusion      │  │
│  └───────────────────────────┬───────────────────────────────┘  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
   News / Social         Sportsbooks /           DFS Content /
   Injury feeds          Consensus feeds         Historical data
```

**External actors:** Provider APIs, file exports, seed fixtures (dev/E2E).

**Internal actors:** V2.1 intelligence agents/engines, PIE, simulation, DTO assembler, Mission Control panels.

---

## 3. Component Architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│ LAYER 4 — Presentation (UNCHANGED V2.1)                           │
│   Pages → ViewModels ← Mappers ← AnalysisBundle DTO              │
└───────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│ LAYER 3 — Analysis Orchestration (V2.1 + ADI hook)                 │
│   PipelineExecutionManager → EngineRegistry                        │
│   NEW: adiPlatform.bootstrap() before pipeline phases              │
└───────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│ LAYER 2 — Intelligence (V2.1 engines — extended inputs)            │
│   Slate / Injury / Vegas / Weather / Ownership / PCE / PIE / Sim  │
│   Consumes: NormalizedEvidenceBundle (not provider payloads)       │
└───────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│ LAYER 1 — ADI Platform (V2.2 NEW)                                  │
│   ┌─────────────┐ ┌──────────────┐ ┌─────────────────────────┐  │
│   │ Connector   │ │ Evidence     │ │ Evidence Fusion Engine  │  │
│   │ Manager     │→│ Cache        │→│ (dedupe, weight, TTL)   │  │
│   └──────┬──────┘ └──────────────┘ └─────────────────────────┘  │
│          │              ▲                    │                     │
│   ┌──────▼──────┐ ┌─────┴──────┐    ┌───────▼────────┐           │
│   │ Source      │ │ Event Bus  │    │ Agent           │           │
│   │ Registry    │ │ (internal) │    │ Orchestrator    │           │
│   └─────────────┘ └────────────┘    └────────────────┘           │
└───────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│ LAYER 0 — Data & Providers                                         │
│   SQLite/Prisma (V2.1) + Evidence store (V2.2 additive)            │
│   External provider APIs / file exports / seed fixtures            │
└──────────────────────────────────────────────────────────────────┘
```

### Component catalog

| Component | Responsibility | Package (planned) |
|-----------|----------------|-------------------|
| Connector Manager | Lifecycle, scheduling, health of evidence providers | `@alpha-dfs/adi-platform` |
| Source Registry | Provider metadata, ownership, feature flags | `@alpha-dfs/adi-platform` |
| Evidence Cache | Short-lived evidence packages per slate/run | `@alpha-dfs/adi-platform` |
| Evidence Fusion Engine | Normalize, dedupe, weight, conflict-resolve | `@alpha-dfs/evidence-fusion` |
| Agent Orchestrator | Route events, coordinate provider fetch + fusion | `@alpha-dfs/adi-platform` |
| Event Bus | In-process pub/sub (V2.2 MVP); externalizable later | `@alpha-dfs/adi-platform` |
| Historical Learning | Source reliability weights (provider 7) | `@alpha-dfs/adi-historical` |

---

## 4. Event Architecture

V2.2 uses an **in-process event bus** for MVP (no external message broker).

### Event flow (analyze run)

```text
pipeline.run.started
  → adi.fetch.requested (per enabled provider)
  → adi.evidence.received (per provider)
  → adi.fusion.requested
  → adi.fusion.completed → NormalizedEvidenceBundle
  → [existing V2.1 phases consume bundle]
  → pipeline.run.completed
```

### Event categories

| Category | Examples | Publishers | Consumers |
|----------|----------|------------|-----------|
| Lifecycle | `pipeline.run.*`, `adi.platform.ready` | Pipeline manager | Observability |
| Provider | `adi.fetch.*`, `adi.evidence.received` | Connector Manager | Fusion, cache |
| Fusion | `adi.fusion.*`, `adi.conflict.detected` | Fusion Engine | Observability, engines |
| Degrade | `adi.provider.degraded`, `adi.provider.failed` | Connector Manager | Confidence, ops |

Detail: [V2_2_EVENT_CONTRACTS.md](./V2_2_EVENT_CONTRACTS.md)

---

## 5. Evidence Fusion Architecture

```text
EvidencePackage[] (from providers)
        │
        ▼
┌───────────────────┐
│ 1. Validate schema │  ADR-020 canonical model
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ 2. Deduplicate     │  Same subject + type + source cluster
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ 3. Apply TTL       │  Drop expired evidence
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ 4. Weight sources  │  Historical learning + registry weights
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ 5. Resolve conflicts│ Higher confidence / fresher wins
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ 6. Aggregate       │  Per-subject NormalizedEvidence
└─────────┬─────────┘
          ▼
NormalizedEvidenceBundle → engine adapters
```

**Engines receive only `NormalizedEvidenceBundle`.** No Reddit, CBS, or sportsbook types cross the boundary.

Detail: [ADR-020-V2_2_EVIDENCE_FUSION_ENGINE.md](./ADR-020-V2_2_EVIDENCE_FUSION_ENGINE.md)

---

## 6. Connector Architecture

Extends V2.1 `@alpha-dfs/connectors` pattern with ADI-specific contract:

```text
EvidenceProvider (interface)
  fetch(context) → EvidencePackage[]
  health() → ProviderHealth
  metadata() → ProviderDescriptor
```

| Concern | V2.1 pattern | V2.2 extension |
|---------|--------------|----------------|
| Output | Slate/player merge fields | Canonical EvidencePackage |
| Retry | `fetchWithRetry` | Reuse + provider-specific policy |
| Degrade | P2 visibility flags | Source Registry degrade mode |
| Seed/live | `CONNECTOR_MODE` | Per-provider feature flags |

Detail: [ADR-021-V2_2_CONNECTOR_FRAMEWORK.md](./ADR-021-V2_2_CONNECTOR_FRAMEWORK.md)

---

## 7. AI Agent Architecture

V2.2 introduces an **Agent Orchestrator** that coordinates ADI providers and fusion — distinct from V2.1 `IntelligenceAgent<TData>` pipeline phases.

| Layer | V2.1 | V2.2 |
|-------|------|------|
| Pipeline agents | Slate, injury, vegas, weather, ownership, PCE | Unchanged |
| ADI agents | — | Provider fetch agents, fusion agent, learning agent |
| Human approval | None (analyze is operator-triggered) | No auto-execution; ADI never triggers trades |

**Decision hierarchy:** Pipeline phases > Fusion output > Provider raw evidence. Learning adjusts weights only — never bypasses fusion.

Detail: [ADR-022-V2_2_AGENT_ORCHESTRATION.md](./ADR-022-V2_2_AGENT_ORCHESTRATION.md)

---

## 8. Canonical Data Model

Single schema for all evidence. See [V2_2_DATA_MODEL.md](./V2_2_DATA_MODEL.md).

Core entities:

- `EvidencePackage` — provider output unit
- `EvidenceItem` — atomic claim (injury, projection delta, sentiment, etc.)
- `NormalizedEvidence` — post-fusion per-subject view
- `NormalizedEvidenceBundle` — run-scoped collection passed to engines
- `SourceReliabilityRecord` — historical learning weights

---

## 9. Storage Architecture

| Store | V2.1 | V2.2 change |
|-------|------|-------------|
| SQLite + Prisma | Slate, players, runs | **Additive** tables for evidence audit (optional MVP) |
| In-memory cache | Slate market cache | Evidence cache (TTL-bound) |
| File exports | Provider fixtures | Extended fixtures per ADI provider |
| Historical learning | — | `SourceReliability` table (M7+) |

**Policy:** ADR-009 additive migrations only. Evidence audit persistence optional for M4; required before production hardening gate.

---

## 10. Security Model

| Concern | Approach |
|---------|----------|
| Provider credentials | Env vars only; never in DTO/UI/logs |
| Evidence content | Internal only; no user-facing export of raw feeds |
| API keys in events | Prohibited — events carry evidence IDs only |
| Rate limiting | Reuse `@alpha-dfs/connectors` rate limiter |
| SSRF | Provider URLs from allowlist config |

---

## 11. Deployment Model

Unchanged V2.1 Model A (in-place upgrade):

```text
deploy:backup → build → db:migrate (if schema) → deploy:verify → smoke
```

ADI platform loads in-process with web worker. No separate ADI microservice in V2.2 MVP.

Feature flags (env):

- `ADI_PLATFORM_ENABLED=false` (default off until M8 certification)
- Per-provider flags: `ADI_PROVIDER_NEWS_ENABLED`, etc.

---

## 12. Scalability Strategy

| Dimension | V2.2 MVP | Future |
|-----------|----------|--------|
| Providers | 7 sequential/parallel fetch | Horizontal provider workers |
| Fusion | In-process, single node | Partitioned by slate |
| Event bus | In-process | Redis/NATS if needed |
| Cache | Memory per run | Redis shared cache |

Benchmark gate: fusion + fetch < 30s added to pipeline (document in M6).

---

## 13. Failure and Recovery Model

| Failure | Behavior |
|---------|----------|
| Single provider timeout | Degrade; fusion proceeds with remaining evidence |
| All providers fail | Fusion empty bundle; V2.1 engines use existing paths |
| Schema validation fail | Drop package; log; metric increment |
| Fusion conflict unresolvable | Lower confidence; include both with conflict flag |
| Pipeline phase fail | Existing V2.1 fail-fast (unchanged) |

Recovery: re-run Analyze Slate. No partial ADI state persisted across runs (MVP).

---

## 14. Observability Strategy

Extend V2.0 observability:

| Signal | Type |
|--------|------|
| `adi.provider.fetch.duration_ms` | Histogram |
| `adi.provider.failure.total` | Counter |
| `adi.fusion.items.in/out` | Counter |
| `adi.fusion.conflicts.total` | Counter |
| `adi.evidence.freshness.age_ms` | Histogram |

Structured logs: `adi.fetch`, `adi.fusion`, `adi.degrade` events with correlationId + runId.

---

## 15. Interface Contracts

Summary — detail in [V2_2_API_CONTRACTS.md](./V2_2_API_CONTRACTS.md).

| Boundary | Contract |
|----------|----------|
| Provider → Platform | `EvidenceProvider.fetch()` → `EvidencePackage[]` |
| Platform → Fusion | `FusionInput { packages, context }` |
| Fusion → Engines | `NormalizedEvidenceBundle` |
| Engines → DTO | Existing engine outputs (extended optionally) |
| Event Bus | Typed event payloads per V2_2_EVENT_CONTRACTS |

---

## 16. Future Extension Points

| Extension | Mechanism |
|-----------|-----------|
| Provider 8+ | Register in Source Registry + implement `EvidenceProvider` |
| New evidence types | Extend taxonomy enum; fusion rules in ADR-020 |
| External event bus | Replace in-process bus adapter |
| Multi-slate | Bundle keyed by slateId (already in context) |
| Platform/sport expansion | Amendment 002/003; new provider sets |

---

## ADR cross-reference

| ADR | Topic |
|-----|-------|
| [ADR-019](./ADR-019-V2_2_ADI_PLATFORM.md) | ADI Platform |
| [ADR-020](./ADR-020-V2_2_EVIDENCE_FUSION_ENGINE.md) | Evidence Fusion |
| [ADR-021](./ADR-021-V2_2_CONNECTOR_FRAMEWORK.md) | Connector Framework |
| [ADR-022](./ADR-022-V2_2_AGENT_ORCHESTRATION.md) | Agent Orchestration |

---

## Exactly one next action

**Program 8 — M4:** Implement platform infrastructure on `v2/v2.2-adi` per [V2_2_ENGINEERING_PLAN.md](./V2_2_ENGINEERING_PLAN.md).
