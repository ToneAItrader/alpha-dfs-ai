# ADR-019 Independent Architecture Review

**Date:** 2026-07-19  
**Phase:** Program 4 — Independent Architecture Review (V2.2)  
**Reviewer:** Independent architecture review (Opus-equivalent)  
**Document reviewed:** [ADR-019-V2_2_ADI_PLATFORM.md](../architecture/ADR-019-V2_2_ADI_PLATFORM.md)  
**Supporting context:** [ABR-001-V2_2_ARCHITECTURE_BASELINE.md](../architecture/ABR-001-V2_2_ARCHITECTURE_BASELINE.md) · ADR-020–022 · V2.2 specifications  
**Baseline:** V2.1 Release Candidate (`v2.1.0` @ `dd52641`)  
**Implementation gate at review:** **BLOCKED** (planning phase)

---

## Executive summary

**Recommendation:** ⚠️ **APPROVE WITH REVISIONS** — architecture is sound for V2.2 MVP; three high-priority clarifications should be applied before M4 coding begins. No blocking redesign required.

ADR-019 correctly positions ADI as an in-process platform layer beneath the V2.1 pipeline, with feature-flag isolation, a single pipeline hook, and clear separation from presentation. The decision to defer microservices, external event brokers, and ADI UI is appropriate for the stated scope and Amendment 001 constraints.

---

## Documents reviewed

| Document | Verdict |
|----------|---------|
| [ADR-019-V2_2_ADI_PLATFORM.md](../architecture/ADR-019-V2_2_ADI_PLATFORM.md) | ⚠️ Approve with required clarifications |
| [ABR-001-V2_2_ARCHITECTURE_BASELINE.md](../architecture/ABR-001-V2_2_ARCHITECTURE_BASELINE.md) | ✅ Consistent |
| [ADR-020-V2_2_EVIDENCE_FUSION_ENGINE.md](../architecture/ADR-020-V2_2_EVIDENCE_FUSION_ENGINE.md) | ✅ Consistent |
| [ADR-021-V2_2_CONNECTOR_FRAMEWORK.md](../architecture/ADR-021-V2_2_CONNECTOR_FRAMEWORK.md) | ✅ Consistent |
| [ADR-022-V2_2_AGENT_ORCHESTRATION.md](../architecture/ADR-022-V2_2_AGENT_ORCHESTRATION.md) | ✅ Consistent |
| [V2_2_PROGRAM_AUTHORIZATION.md](../architecture/V2_2_PROGRAM_AUTHORIZATION.md) | ✅ Aligned |
| V2.1 pipeline / connector patterns | ✅ Extends without breaking |

---

## Evaluation criteria

### 1. Architecture quality — ✅ Pass

| Area | Assessment |
|------|------------|
| Separation of concerns | Platform, fusion, providers, orchestration cleanly layered |
| Single integration point | One pipeline hook before `slate_intelligence` — minimal blast radius |
| Feature flag isolation | `ADI_PLATFORM_ENABLED=false` preserves V2.1 — correct default |
| Engine boundary | Engines consume `NormalizedEvidenceBundle` only — enforced by ADR-020/021 |
| Decision hierarchy | Pipeline > fusion > packages — clear and auditable |

**Strength:** The "fusion before consumption" tenet eliminates the V2.1 pattern of ad-hoc field merges scaling poorly to seven providers.

### 2. Scalability — ✅ Pass (MVP scope)

| Dimension | Assessment |
|-----------|------------|
| Provider count | Registry + interface supports N providers without platform rewrite |
| Parallel fetch | ConnectorManager parallel fetch with timeout envelope — adequate for MVP |
| Fusion | In-process deterministic — acceptable for single-node NFL slates |
| Future horizontal | ABR-001 documents Redis/NATS path — not premature |

**Note:** 45s global fetch timeout + 30s fusion budget may tight for live mode with 7 providers. Acceptable for seed/MVP; monitor at M6 benchmark.

### 3. Extensibility — ✅ Pass

- New provider = adapter + registry entry (ADR-021)
- New evidence type = taxonomy extension + fusion rules (ADR-020)
- External event bus = adapter swap (ABR-001 §16)
- Multi-sport deferred to Amendment 003 — platform design does not block it

### 4. Complexity — ⚠️ Pass with caution

| Concern | Severity | Mitigation |
|---------|----------|------------|
| Dual orchestration (pipeline + ADI agents) | Medium | ADR-022 confines ADI orchestrator to fetch/fusion only |
| Seven providers × normalization rules | Medium | Per-provider specs + fixtures; phased M5 delivery |
| Event bus in-process | Low | Typed contracts; no distributed semantics |
| Learning agent async | Low | Fire-and-forget; never blocks response |

Complexity is **justified** by the alternative (seven independent merge paths). The package split (`adi-platform`, `evidence-fusion`, `adi-providers`) keeps boundaries testable.

### 5. Operational risk — ⚠️ Pass with clarifications

| Risk | Assessment |
|------|------------|
| Provider API instability | Mitigated by seed fixtures, degrade, per-provider flags |
| Pipeline latency | 30s budget documented; benchmark gate at M6 |
| Credential management | Env-only — consistent with V2.1 |
| Observability | Metrics defined in ABR-001 §14 — must be implemented in M4, not deferred |
| Rollback | Disable flag restores V2.1 — simple and correct |

**HP-1 (required):** ADR-019 should explicitly state that **observability metrics are M4 deliverables**, not M8. Platform without metrics is operationally blind.

### 6. Long-term maintainability — ✅ Pass

- ADRs 019–022 form a coherent package with cross-references
- Deterministic fusion (no LLM in MVP) ensures reproducible debugging
- Canonical evidence model versioned — supports audit trail
- V2.1 frozen baseline — regression lock prevents drift

---

## Findings

### Critical — none

No blocking architectural defects identified.

### High priority (required before M4)

| ID | Finding | Recommendation |
|----|---------|----------------|
| HP-1 | Observability timing ambiguous | Add to ADR-019 acceptance: core metrics (`adi.provider.fetch.duration_ms`, `adi.provider.failure.total`) implemented in M4, not deferred |
| HP-2 | V2.1 connector coexistence | Clarify in ADR-019: V2.1 injury/vegas/weather connectors remain authoritative until M7 engine integration explicitly switches input source; ADI sportsbook provider must not duplicate vegas merge in M5 |
| HP-3 | `priorOutputs.adiEvidence` contract | Document TypeScript type location and immutability rule in ADR-019 or ADR-020 — engines read-only; fusion agent sole writer |

### Medium priority (recommended)

| ID | Finding | Recommendation |
|----|---------|----------------|
| MP-1 | Evidence audit persistence optional | Accept for MVP; require decision gate at M7 whether to enable `EvidenceAuditRun` table |
| MP-2 | Global 45s fetch timeout | Document per-provider timeout sum vs global envelope behavior in ADR-022 |
| MP-3 | Package naming | Confirm `@alpha-dfs/*` scope matches existing monorepo package names before M4 scaffold |

### Low priority (optional)

| ID | Finding | Recommendation |
|----|---------|----------------|
| LP-1 | Learning agent in M7 vs M5 | Current plan (M7) is correct — defer learning until fusion stable |
| LP-2 | Feature flag granularity | Per-provider flags sufficient; document operator toggle order in deploy guide |

---

## Recommendations summary

1. **Apply HP-1–HP-3** to ADR-019 (documentation clarifications only — no redesign).
2. **Proceed to M4** after Program 7 Architecture Readiness Review approves gate open.
3. **Retain** in-process MVP scope — do not split to microservices in V2.2.
4. **Enforce** architecture lint (no provider imports in engines) from M4.
5. **Benchmark early** at M6 — do not defer performance validation to M8.

---

## Verdict

| Criterion | Result |
|-----------|--------|
| Architecture quality | ✅ Pass |
| Scalability | ✅ Pass (MVP) |
| Extensibility | ✅ Pass |
| Complexity | ⚠️ Acceptable with phased delivery |
| Operational risk | ⚠️ Pass with HP-1–HP-3 |
| Long-term maintainability | ✅ Pass |

**Final recommendation:** ⚠️ **APPROVE WITH REVISIONS** — ADR-019 is suitable as the foundational V2.2 platform decision after HP-1–HP-3 clarifications are applied. No implementation code should begin until Program 7 confirms gate status.

---

## Exactly one next action

**Program 7:** Architecture Readiness Review incorporating this review's HP-1–HP-3 conditions.
