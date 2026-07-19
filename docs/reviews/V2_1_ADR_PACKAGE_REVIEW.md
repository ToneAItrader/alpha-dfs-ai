# Version 2.1 ADR Package Review — Independent Assessment

**Date:** 2026-07-19  
**Phase:** 7 — Independent Architecture Review (V2.1)  
**Reviewer:** Independent architecture review (Opus-equivalent)  
**Workstream:** B — Version 2 Program  
**Package reviewed:** ADR-010 through ADR-018 + supporting V2.1 planning documents  
**Baseline:** [V2_FOUNDATION_COMPLETION_RECORD.md](../architecture/V2_FOUNDATION_COMPLETION_RECORD.md)  
**Implementation gate at review:** **CLOSED**

---

## Executive summary

**Recommendation:** ⚠️ **APPROVE WITH REVISIONS** — **do not open V2.1 implementation gate until Phase 2A documentation clarifications are applied**

The V2.1 ADR package (ADR-010 through ADR-018) is architecturally aligned with the V2.0 Foundation baseline, Amendment 001 scope, and the established `DTO → Mapper → ViewModel → Presentation` discipline. Capability sequencing, connector patterns, and ADR-009 migration posture are sound.

**One critical documentation defect (CF-1)** must be resolved before V2.1-1 implementation: ADR-010 assumes Slate Intelligence engine outputs that do not match the current pipeline. Four **high-priority clarifications (HP-1–HP-4)** should be applied before gate open. No blocking architectural redesign is required — revisions are documentation and scope clarifications, not package rejection.

---

## Documents reviewed

| Document | Verdict |
|----------|---------|
| [ADR-010-V2_1_1_SLATE_INTELLIGENCE.md](../architecture/ADR-010-V2_1_1_SLATE_INTELLIGENCE.md) | ⚠️ Approve with required revision |
| [ADR-011-V2_1_2_HEADER_PIPELINE_STATUS.md](../architecture/ADR-011-V2_1_2_HEADER_PIPELINE_STATUS.md) | ⚠️ Approve with required revision |
| [ADR-012-V2_1_3_GPP_FIELD_SIMULATION.md](../architecture/ADR-012-V2_1_3_GPP_FIELD_SIMULATION.md) | ✅ Approve with clarification |
| [ADR-013-V2_1_4_INJURY_CONNECTOR.md](../architecture/ADR-013-V2_1_4_INJURY_CONNECTOR.md) | ✅ Approve |
| [ADR-014-V2_1_5_VEGAS_ODDS_CONNECTOR.md](../architecture/ADR-014-V2_1_5_VEGAS_ODDS_CONNECTOR.md) | ✅ Approve |
| [ADR-015-V2_1_6_WEATHER_CONNECTOR.md](../architecture/ADR-015-V2_1_6_WEATHER_CONNECTOR.md) | ✅ Approve with clarification |
| [ADR-016-V2_1_7_PROJECTION_CALIBRATION.md](../architecture/ADR-016-V2_1_7_PROJECTION_CALIBRATION.md) | ⚠️ Approve with required revision |
| [ADR-017-V2_1_8_MULTI_LINEUP_EXPOSURE.md](../architecture/ADR-017-V2_1_8_MULTI_LINEUP_EXPOSURE.md) | ✅ Approve with clarification |
| [ADR-018-V2_1_9_OWNERSHIP_PREDICTION.md](../architecture/ADR-018-V2_1_9_OWNERSHIP_PREDICTION.md) | ✅ Approve with clarification |
| [V2_1_PLANNING_PACKAGE.md](../architecture/V2_1_PLANNING_PACKAGE.md) | ✅ Consistent |
| [V2_1_IMPLEMENTATION_GATE.md](../architecture/V2_1_IMPLEMENTATION_GATE.md) | ✅ Gate criteria correctly structured |
| [V2_DEPENDENCY_MAP.md](../architecture/V2_DEPENDENCY_MAP.md) | ✅ Sequencing validated |
| [ADR-009-PRISMA_MIGRATION_POLICY.md](../architecture/ADR-009-PRISMA_MIGRATION_POLICY.md) | ✅ Ready for V2.1-3 |
| [V2_FOUNDATION_COMPLETION_RECORD.md](../architecture/V2_FOUNDATION_COMPLETION_RECORD.md) | ✅ Baseline established |

**Codebase validation:** `slate-analysis-engine-adapter.ts`, `dto-assembler.ts`, `SlateIntelligencePanel.tsx`, connector registry, `packages/shared/src/engines.ts`, and V2.0 Foundation artifacts reviewed against ADR proposals.

---

## Evaluation criteria

### 1. Architectural consistency with V2.0 baseline — ✅ Pass (one CF)

| Area | Assessment |
|------|------------|
| V2.0 preservation | No ADR modifies V2.0 ops tooling (telemetry, smoke, prune, E2E) |
| Branch isolation | Proposed `v2/v2.1-intelligence` from V2.0 baseline — correct |
| Presentation contract | All nine ADRs specify mapper-only UI changes — consistent |
| Observability | No changes to ADR-002 authoritative health endpoints |
| Certification | E2E gate from V2.0-5 correctly referenced in exit criteria |

### 2. Dependency correctness and sequencing — ✅ Pass (clarifications)

Recommended order (V2.1-2 → 1 → 4 → 5 → 6 → 3 → 7 → 8 → 9) is **correct**:

| Order | Rationale |
|-------|-----------|
| V2.1-2 first | Zero schema/DTO; existing API |
| V2.1-1 second | Closes Task 10 deferral (after CF-1 resolved) |
| V2.1-4/5/6 | Independent connectors; file fallback |
| V2.1-3 | First schema change; enables simulation depth |
| V2.1-7 | Benefits from provider data |
| V2.1-8 | PIE extension; no hard dep on simulation |
| V2.1-9 last | Depends on V2.1-3; enhances field generation |

**Note:** V2.1-3 before V2.1-9 is correct. V2.1-3 must use projection-feed ownership initially; V2.1-9 upgrades the model (see MP-1).

### 3. Amendment 001 compatibility — ✅ Pass

All capabilities remain within DraftKings · NFL · Classic Salary Cap. No platform, sport, or contest-type expansion proposed.

### 4. Version 1 compatibility — ✅ Pass

| Mechanism | Present in ADRs |
|-----------|-----------------|
| Additive optional DTO fields | All engine/DTO ADRs |
| Feature flags where needed | ADR-016 (calibration disable) |
| Separate branch until merge | All ADRs |
| V1 `main` unchanged | Explicit in each ADR V1 impact section |
| File-export connector fallback | ADR-013/014/015 |

### 5. Schema change readiness (ADR-009) — ✅ Pass with pre-work

ADR-012 correctly identifies V2.1-3 as first migration. ADR-009 gate requirements (`db:migrate` scripts, migration test) remain **unchecked** — must be completed as part of V2.1-3 implementation, not planning blockers.

### 6. DTO → Mapper → ViewModel discipline — ✅ Pass

All ADRs preserve frozen Presentation layer. Connector ADRs correctly limit UI impact to mapper extensions.

### 7. Connector architecture — ✅ Pass (one clarification)

ADR-013/014/015 follow CONNECTOR_ADR_001 patterns: `DataConnector`, registry registration, seed fixtures, P1/P2 degrade. PROVIDER_COMPATIBILITY_MATRIX update required at implementation — correctly listed in gate requirements.

### 8. Implementation ordering and risk — ✅ Pass

V2.1-3 compute cost and V2.1-6 optional deferral appropriately acknowledged. V2_RISK_ASSESSMENT V2.1 section aligns with ADR package.

### 9. Governance completeness — ✅ Pass

V2_1_IMPLEMENTATION_GATE entry/exit criteria, change control V2-CC-002 placeholder, and one-capability-at-a-time rule are adequate.

---

## Findings by severity

### Critical (must resolve before V2.1-1 implementation)

#### CF-1 — ADR-010 conflates Slate Analysis Engine with Slate Intelligence Agent

**ADR:** ADR-010  
**Issue:** ADR-010 states the Slate Intelligence engine produces `slateGrade`, `volatilityScore`, `recommendedStrategy`, and `confidenceRating`. The implemented pipeline engine (`slate_analysis` / `SlateAnalysisEngine`) produces **readiness/coverage outputs** only:

```text
SlateAnalysisOutput: slateLabel, dataCompleteness, injuryDataStatus,
  weatherDataStatus, marketDataStatus, expertConsensusStatus, checklistComplete
```

These map to `portfolioReadiness.dataQuality` in `dto-assembler.ts`, **not** to the Slate Intelligence panel. The panel (`SlateIntelligencePanel.tsx`) imports placeholder config directly in child sections — no mapper exists (`slate-intelligence-mapper.ts` is referenced but not present).

The Slate Intelligence Agent described in [SLATE_INTELLIGENCE.md](../architecture/SLATE_INTELLIGENCE.md) (grade, volatility, strategy enum) is **architecture documentation**, not a implemented pipeline engine.

**Required revision:** ADR-010 must choose one of:

| Option | Description |
|--------|-------------|
| **A (recommended)** | Split V2.1-1 into two sub-deliverables: (1) implement Slate Intelligence Engine per SLATE_INTELLIGENCE.md as new pipeline stage; (2) wire panel via new mapper. Update DTO fields to match engine contract. |
| **B** | Revise scope to wire **available** pipeline data (coverage statuses, confidence, portfolio signals) to panel sections as interim MVP; defer grade/volatility/strategy to V2.1-1b or engine ADR amendment. |

**Gate impact:** V2.1-1 cannot start until ADR-010 is revised and re-confirmed.

---

### High priority (apply before gate open)

#### HP-1 — ADR-011 incorrect cross-reference

**ADR:** ADR-011 §Technical approach  
**Issue:** References "ADR-014 runtime constraint preserved from V1." ADR-014 is the **Vegas Odds Connector**, not a runtime polling policy.

**Required revision:** Replace with reference to [FRONTEND_RELEASE_READINESS.md](../FRONTEND_RELEASE_READINESS.md) §Refresh model: page-load + user-triggered only; no background polling.

---

#### HP-2 — ADR-016 pipeline ordering contradiction

**ADR:** ADR-016  
**Issue:** Calibration is positioned **before** Scoring Engine but includes "PCE-informed floor/ceiling spread adjustment." PCE runs **after** scoring in the pipeline — same-pass calibration cannot consume PCE output.

**Required revision:** Clarify calibration inputs:

- Use projection feed floor/ceiling, injury/vegas overlays, and **static or historical variance buckets** — not same-run PCE output.
- Alternatively, document two-phase calibration (pre-score rules only in V2.1 MVP).

---

#### HP-3 — ADR-010 panel section scope undefined

**ADR:** ADR-010  
**Issue:** Slate Intelligence panel has eight sections (summary, grade, strategy, injuries, weather, ownership, featured games, intelligence summary). ADR-010 DTO fields cover grade/strategy/factors only. Injury/weather/ownership sections depend on V2.1-4/5/6 or remain placeholder.

**Required revision:** Add explicit phased wiring table:

| Panel section | V2.1-1 MVP source | Depends on |
|---------------|-------------------|------------|
| Grade / strategy / factors | Slate Intelligence Engine (after CF-1) | CF-1 resolution |
| Injuries | Placeholder or merged player fields | V2.1-4 |
| Weather | Placeholder or game fields | V2.1-6 |
| Ownership outlook | Projection feed or placeholder | V2.1-9 partial |
| Featured games | Vegas implied totals or placeholder | V2.1-5 |

---

#### HP-4 — P2 connector priority tier undefined

**ADR:** ADR-015  
**Issue:** Weather connector specifies Priority **P2**. CONNECTOR_ADR_001 defines P0 (fail-closed) and P1 (degrade) only.

**Required revision:** Extend CONNECTOR_ADR_001 or ADR-015 with P2 semantics: optional enrichment; refresh and analyze proceed with zero weather data; no degrade flag unless operator configures visibility.

---

### Medium priority (apply before or during implementation)

#### MP-1 — ADR-012 / ADR-018 ownership sequencing

**Issue:** ADR-012 field generation is "ownership-weighted" while ADR-018 implements ownership prediction after V2.1-3.

**Clarification:** ADR-012 must state V2.1-3 MVP uses **projection feed ownership** (or uniform prior when missing). ADR-018 upgrades field weighting when implemented.

---

#### MP-2 — ADR-017 multi-lineup scope

**Issue:** "1–N recommended lineups" is ambiguous. V1 PIE produces Primary + Hail Mary (N=2).

**Clarification:** V2.1-8 MVP scope is **exposure across Primary and Hail Mary**. Automated generation of N>2 lineups is out of scope.

---

#### MP-3 — ADR-016 calibration feature flag

**Issue:** "Calibration off by default via feature flag" — no env var named.

**Clarification:** Propose `PROJECTION_CALIBRATION_ENABLED=false` default at implementation.

---

#### MP-4 — ADR-009 pre-implementation checklist

**Issue:** ADR-009 gate items (`db:migrate` scripts, migration test) unchecked.

**Clarification:** Assign to V2.1-3 as first implementation task before schema migration — document in ADR-012 gate requirements cross-reference.

---

#### MP-5 — Missing mapper artifact

**Issue:** ADR-010 references `slate-intelligence-mapper.ts` which does not exist.

**Clarification:** Add to ADR-010 implementation deliverables — create mapper as part of V2.1-1.

---

### Low priority (informational)

| ID | Finding | ADR |
|----|---------|-----|
| LP-1 | Add simulation benchmark gate at V2.1-3 implementation | ADR-012 |
| LP-2 | Batch-update PROVIDER_COMPATIBILITY_MATRIX for all three connectors in one doc PR | ADR-013–015 |
| LP-3 | V2.1 phase exit may defer V2.1-6 — document in gate exit criteria | V2_1_IMPLEMENTATION_GATE |
| LP-4 | Extend E2E after V2.1-1 to assert non-placeholder slate grade when engine live | ADR-010 |

---

## Per-ADR summary

| ADR | Capability | Verdict | Blocking? |
|-----|------------|---------|-----------|
| ADR-010 | V2.1-1 Slate Intelligence | ⚠️ Revise (CF-1, HP-3) | **Yes — before V2.1-1** |
| ADR-011 | V2.1-2 Header status | ⚠️ Revise (HP-1) | No |
| ADR-012 | V2.1-3 GPP simulation | ✅ Approve (MP-1, MP-4) | No |
| ADR-013 | V2.1-4 Injury connector | ✅ Approve | No |
| ADR-014 | V2.1-5 Vegas connector | ✅ Approve | No |
| ADR-015 | V2.1-6 Weather connector | ✅ Approve (HP-4) | No |
| ADR-016 | V2.1-7 Calibration | ⚠️ Revise (HP-2, MP-3) | No |
| ADR-017 | V2.1-8 Exposure | ✅ Approve (MP-2) | No |
| ADR-018 | V2.1-9 Ownership | ✅ Approve (MP-1) | No |

---

## Required documentation revisions

Apply in **Phase 2A (GPT-5.5)** before gate open:

| Priority | ADR / Doc | Action |
|----------|-----------|--------|
| **Required** | ADR-010 | Resolve CF-1 — engine scope + panel phased wiring (HP-3) |
| **Required** | ADR-011 | Fix HP-1 cross-reference |
| **Required** | ADR-016 | Fix HP-2 pipeline ordering; add MP-3 env var |
| **Required** | ADR-015 + CONNECTOR_ADR_001 | Define P2 tier (HP-4) |
| Recommended | ADR-012 | Add MP-1 ownership source for V2.1-3 MVP |
| Recommended | ADR-017 | Clarify MP-2 N=2 scope |
| Recommended | ADR-010 | Add MP-5 mapper deliverable |
| Recommended | V2_1_IMPLEMENTATION_GATE | Add LP-3 V2.1-6 deferral note to exit criteria |

**No code changes. No new capabilities. No scope expansion.**

---

## Recommendation

| Decision | Status |
|----------|--------|
| **Approve** | — |
| **Approve with revisions** | ✅ **Recommended** |
| **Rework required** | — |

The V2.1 ADR package is **fit for implementation after Phase 2A revisions**. The package does not require rejection or re-planning. CF-1 is a **scope clarification**, not an architectural invalidation — the intended outcome (live Slate Intelligence panel) remains valid but requires explicit engine implementation or revised MVP scope.

---

## Gate decision

| Gate action | Status |
|-------------|--------|
| Open V2.1 implementation gate | ✅ **Open** — 2026-07-19 |
| Record V2-CC-002 | ✅ Recorded in [V2_1_IMPLEMENTATION_GATE.md](../architecture/V2_1_IMPLEMENTATION_GATE.md) |
| Create branch `v2/v2.1-intelligence` | Authorized at implementation start |

---

## Phase 2A revision record (2026-07-19)

| Finding | Resolution | Document |
|---------|------------|----------|
| CF-1 | Approach A — new `slate_intelligence` engine + mapper; CF-1 table added | ADR-010 |
| HP-1 | FRONTEND_RELEASE_READINESS polling reference | ADR-011 |
| HP-2 | Pre-score only; PCE same-run prohibited; `PROJECTION_CALIBRATION_ENABLED` | ADR-016 |
| HP-3 | Eight-section phased wiring table | ADR-010 |
| HP-4 | P2 tier defined | CONNECTOR_ADR_001, ADR-015 |
| MP-1 | Projection feed ownership for V2.1-3 MVP | ADR-012 |
| MP-2 | N=2 (Primary + Hail Mary) | ADR-017 |
| MP-4 | ADR-009 pre-work assigned to V2.1-3 | ADR-012 |

**Final recommendation:** ✅ **Approved for V2.1 implementation**

---

## Exactly one next action

**V2.1-2 implementation (Composer 2.5):** Per [V2_1_IMPLEMENTATION_GATE.md](../architecture/V2_1_IMPLEMENTATION_GATE.md).
