# ADR-022 — V2.2 Agent Orchestration Layer

**Status:** Accepted (Planning)  
**Date:** 2026-07-19  
**Related:** [ADR-019](./ADR-019-V2_2_ADI_PLATFORM.md) · V2.1 `IntelligenceAgent<TData>` pattern

---

## Context

V2.1 uses `IntelligenceAgent<TData>` for pipeline phases (slate, injury, vegas, etc.). V2.2 ADI requires coordination of multiple providers, fusion, and learning without duplicating pipeline phases or exposing a second orchestration model to operators.

---

## Decision

Introduce **Agent Orchestrator** for ADI lifecycle only. V2.1 pipeline agents remain unchanged.

### Agent registry

| Agent | Type | Responsibility |
|-------|------|----------------|
| `adi_fetch_coordinator` | Orchestrator | Parallel provider fetch, timeout envelope |
| `adi_fusion_agent` | Processor | Invoke Evidence Fusion Engine |
| `adi_learning_agent` | Observer | Post-run source reliability update (async, non-blocking) |
| Per-provider fetch agents | Worker | One per enabled provider (thin wrapper over EvidenceProvider) |

### Event routing

Orchestrator subscribes/publishes on internal Event Bus (in-process):

```text
adi.fetch.requested → provider agents → adi.evidence.received
adi.fusion.requested → fusion agent → adi.fusion.completed
pipeline.run.completed → learning agent (optional, flag-gated)
```

### Memory model

| Memory | Scope | Content |
|--------|-------|---------|
| Run cache | Single analyze run | EvidencePackages, fusion bundle |
| Source registry | Process lifetime | Provider config, weights |
| Learning store | Persistent (DB) | Historical reliability — M7+ |

No cross-run evidence cache in MVP.

### Decision hierarchy

```text
1. V2.1 pipeline phase contracts (authoritative for outputs)
2. NormalizedEvidenceBundle (authoritative for ADI signals)
3. Individual EvidencePackages (never seen by engines)
4. Learning weights (adjust confidence only — never override fusion)
```

### Scheduling

- Fetch: parallel with `Promise.allSettled`, global timeout 45s
- Fusion: sequential after all fetches settle
- Learning: fire-and-forget after pipeline success; never blocks response

### Failure recovery

| Failure | Recovery |
|---------|----------|
| Provider agent timeout | Mark degraded; continue |
| Fusion agent error | Empty bundle + error in degradationNotes |
| Learning agent error | Log; no user impact |

### Human approval boundaries

| Action | Approval |
|--------|----------|
| Analyze Slate (operator) | Existing V2.1 — unchanged |
| ADI fetch/fusion | Automatic within analyze run |
| Lineup execution / broker | **Out of scope — never automated** |
| Weight override | Env/config only — no UI in V2.2 |

ADI agents **never** trigger trades, submissions, or external posts.

---

## Relationship to V2.1 IntelligenceAgent

| Pattern | When to use |
|---------|-------------|
| `IntelligenceAgent<TData>` | Pipeline phase with engine registry contract (V2.1) |
| ADI orchestrator agents | Provider fetch + fusion coordination (V2.2) |

Do not convert V2.1 engines to ADI agents. Engine **integration** adds fused evidence as input — not new pipeline phases unless ADR-approved.

---

## Acceptance criteria

- [ ] Orchestrator unit tests with mock providers
- [ ] Fusion timeout does not hang pipeline
- [ ] Learning agent disabled by default
- [ ] Architecture test: no ADI agent imports in presentation layer

---

## Consequences

Clear separation between pipeline intelligence (V2.1) and platform intelligence (V2.2).
