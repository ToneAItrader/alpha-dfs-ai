# Version 2 ADR Package Review — Independent Assessment

**Date:** 2026-07-19  
**Phase:** 2 — Independent Architecture Review  
**Reviewer:** Independent architecture review (Opus-equivalent)  
**Workstream:** B — Version 2 Planning  
**Package reviewed:** ADR-004 through ADR-009 + supporting V2 planning documents  
**Implementation gate at review:** **CLOSED**

---

## Executive summary

**Recommendation:** ✅ **APPROVE ADR PACKAGE FOR V2.0 IMPLEMENTATION** — **RECOMMEND OPENING IMPLEMENTATION GATE** after Phase 2A documentation revisions

The Version 2.0 ADR package (ADR-004 through ADR-009) is architecturally sound, internally consistent with Task 2 planning review conclusions, and correctly scoped as ops/QA foundation work with no V1 contract changes. Capability sequencing, V1 compatibility posture, and governance alignment are all adequate for implementation to begin on branch `v2/v2.0-foundation`.

**No blocking architectural defects** were identified. Four **required documentation clarifications** (not redesigns) should be applied in Phase 2A before the first implementation commit. Gate 4 change-control recording remains a Phase 3 governance action, not an ADR architecture blocker.

---

## Documents reviewed

| Document | Verdict |
|----------|---------|
| [ADR-004-V2_0_1_TELEMETRY_EXPORT.md](../architecture/ADR-004-V2_0_1_TELEMETRY_EXPORT.md) | ✅ Approve with clarification |
| [ADR-005-V2_0_2_READONLY_SMOKE.md](../architecture/ADR-005-V2_0_2_READONLY_SMOKE.md) | ⚠️ Approve with required revision |
| [ADR-006-V2_0_3_BACKUP_RETENTION.md](../architecture/ADR-006-V2_0_3_BACKUP_RETENTION.md) | ⚠️ Approve with required revision |
| [ADR-007-V2_0_4_DEPLOYMENT_SUPERVISOR.md](../architecture/ADR-007-V2_0_4_DEPLOYMENT_SUPERVISOR.md) | ✅ Approve |
| [ADR-008-V2_0_5_BROWSER_E2E.md](../architecture/ADR-008-V2_0_5_BROWSER_E2E.md) | ✅ Approve |
| [ADR-009-PRISMA_MIGRATION_POLICY.md](../architecture/ADR-009-PRISMA_MIGRATION_POLICY.md) | ✅ Approve |
| [V2_IMPLEMENTATION_GATE.md](../architecture/V2_IMPLEMENTATION_GATE.md) | ✅ Gate criteria correctly structured |
| [V2_ROADMAP.md](../architecture/V2_ROADMAP.md) | ✅ Consistent with ADR package |
| [V2_DEPENDENCY_MAP.md](../architecture/V2_DEPENDENCY_MAP.md) | ✅ Sequencing validated |
| [V2_MIGRATION_STRATEGY.md](../architecture/V2_MIGRATION_STRATEGY.md) | ⚠️ Minor status drift |
| [V2_RISK_ASSESSMENT.md](../architecture/V2_RISK_ASSESSMENT.md) | ✅ Adequate for V2.0 |
| [TASK_3_PLANNING_PACKAGE.md](../architecture/TASK_3_PLANNING_PACKAGE.md) | ✅ Complete index |
| [V2_ARCHITECTURE_REVIEW.md](./V2_ARCHITECTURE_REVIEW.md) | ✅ Prior review gaps addressed |

**Codebase validation:** Smoke script, refresh service, observability package, and backup script reviewed against ADR proposals.

---

## Evaluation criteria

### 1. Architectural consistency — ✅ Pass

| ADR | Consistency assessment |
|-----|------------------------|
| ADR-004 | Aligns with [OBSERVABILITY_ADR_002.md](../architecture/OBSERVABILITY_ADR_002.md). Optional export layer preserves in-process ring buffers as authoritative for Mission Control endpoints. Fail-open and async batch match V1 operational posture. |
| ADR-005 | Extends existing `deploy:smoke` script pattern. Default `SMOKE_MODE=full` preserves V1 behavior. Addresses RC risk M1 (smoke writes to `DATABASE_URL`). |
| ADR-006 | Builds on existing `backup-database.ts` / `VACUUM INTO` model. Opt-in prune matches V1 non-invasive extension pattern. |
| ADR-007 | Correctly scoped as documentation-only. No application code or dependency changes. |
| ADR-008 | Dev/CI tooling only. Explicitly excluded from V1 `certify` gate. Class B `data-testid` additions acceptable under observability classification. |
| ADR-009 | Correctly deferred to V2.1+ schema changes. V2.0 explicitly no-schema aligns with dependency map. Additive-only and backup-before-migrate principles match [V2_MIGRATION_STRATEGY.md](../architecture/V2_MIGRATION_STRATEGY.md). |

**Frozen architecture preserved:** No ADR proposes changes to `DTO → Mapper → ViewModel → Presentation`. V2.0 capabilities are ops, docs, and QA only.

### 2. Capability sequencing — ✅ Pass

Recommended implementation order (V2.0-2 → V2.0-3 → V2.0-4 → V2.0-1 → V2.0-5) is correct:

| Order | Rationale |
|-------|-----------|
| V2.0-2 first | Lowest product risk; closes highest RC production risk (smoke DB writes) |
| V2.0-3 second | Standalone script; no runtime coupling |
| V2.0-4 third | Documentation-only; zero code risk |
| V2.0-4 before V2.0-1 | Supervisor guide references telemetry export — docs should exist before ops teams configure APM |
| V2.0-1 fourth | New package; moderate integration surface |
| V2.0-5 last | Highest tooling overhead; benefits from stable ops foundation |

Cross-ADR dependency: ADR-007 §6 references ADR-004 for log rotation guidance — satisfied by implementing V2.0-4 before or concurrently with V2.0-1 documentation cross-links, not by code dependency.

### 3. Dependency analysis — ✅ Pass (one implementation note)

| Capability | Upstream dependency | Assessment |
|------------|---------------------|------------|
| V2.0-1 | `@alpha-dfs/observability` snapshot APIs (`getMetricsSnapshot`, `getRecentLogs`, `getRecentTraces`) | ✅ APIs exist |
| V2.0-2 | Connector registry + fetch path | ⚠️ See Critical Finding #1 — must not reuse full `refresh()` |
| V2.0-3 | `database-backup.ts` output format | ✅ Compatible |
| V2.0-4 | Current `deploy.sh` sequence | ✅ Document-only |
| V2.0-5 | V1 frontend + fixture/seed mode | ✅ Feasible |
| ADR-009 | V2.1 first schema change | ✅ Correctly gated |

External dependencies (OTLP endpoint, Playwright browsers) have documented fallbacks.

### 4. Migration strategy — ✅ Pass

- V2.0: No schema changes — confirmed across ADR-009, dependency map, and capability breakdown.
- V2.1+: ADR-009 provides adequate migration workflow, naming convention, and destructive-change gate.
- In-place upgrade model (Model A) appropriate for V2.0–V2.1.
- Side-by-side model (Model B) correctly deferred to V2.2+.

**Minor drift:** [V2_MIGRATION_STRATEGY.md](../architecture/V2_MIGRATION_STRATEGY.md) header still reads `Status: Planning draft` / `2026-07-18` while Task 3 docs read `2026-07-19 complete`. Content is aligned; metadata should be synchronized in Phase 2A.

### 5. Governance compliance — ✅ Pass

| Requirement | Status |
|-------------|--------|
| ADR before code | ✅ All V2.0 capabilities have ADRs |
| No V1 mixing | ✅ Separate branch model documented |
| Amendment 001 unchanged for V2.0 | ✅ Confirmed |
| Independent Opus review | ✅ This document |
| Implementation gate criteria | ✅ Gate 1–2 satisfied; Gate 3 satisfied upon this review |
| Gate 4 change control record | ❌ Not yet issued — Phase 3 action |

Gate 4 "Change control record" is a governance authorization step, not an ADR defect. It should be recorded when the gate is formally opened in Phase 3.

### 6. Version 1 compatibility — ✅ Pass

| ADR | V1 impact claim | Validated |
|-----|-----------------|-----------|
| ADR-004 | Default `none` mode — no change | ✅ |
| ADR-005 | Default `full` mode — no change | ✅ (after readonly path implemented correctly) |
| ADR-006 | Opt-in prune only | ✅ |
| ADR-007 | Documentation only | ✅ |
| ADR-008 | Not in V1 certify until promoted | ✅ |
| ADR-009 | No impact until V2.1 schema change | ✅ |

V1 maintenance governance and production readiness validation remain satisfied per [V2_IMPLEMENTATION_GATE.md](../architecture/V2_IMPLEMENTATION_GATE.md) Gate 1.

### 7. Risk assessment — ✅ Pass

[V2_RISK_ASSESSMENT.md](../architecture/V2_RISK_ASSESSMENT.md) adequately covers V2.0 risks. Task 2 additional risks (mapper regression for V2.1, E2E CI burden) remain appropriately deferred to later phase gates.

### 8. Readiness for implementation — ✅ Pass with conditions

| Criterion | Status |
|-----------|--------|
| V2.0 ADRs complete | ✅ |
| Sequencing defined | ✅ |
| V1 protected | ✅ |
| Codebase feasibility validated | ✅ (with ADR-005 revision) |
| Blocking defects | ❌ None |
| Required doc revisions | ⚠️ 4 items (Phase 2A) |

---

## Critical findings

### CF-1 — ADR-005: Read-only smoke must bypass all DB writes in refresh path

**Severity:** High (implementation correctness — not architectural rejection)

Current `refreshService.refresh()` in `apps/web/src/lib/backend/operations/refresh-service.ts` writes to the database **before** slate payload persistence:

- `refreshRepository.createRun()` — creates refresh run record
- `refreshRepository.upsertSourceStatus()` — writes per-connector status
- `refreshRepository.completeRun()` — finalizes refresh run

ADR-005 states readonly smoke should "fetch only, no persist" but proposes `fetchConnectorsOnly()` without explicitly forbidding reuse of `refreshService.refresh()`. If implementation calls the existing refresh method, **readonly smoke would still mutate production database tables**.

**Required ADR revision:**

- Specify that readonly smoke uses a **dedicated fetch-only path** that invokes `fetchWithRetry` via connector registry directly.
- Explicitly **must not** call `refreshService.refresh()`, `refreshAndEnsureReady()`, or any `refreshRepository` methods.
- Readonly smoke success criteria: P0 connectors return valid payloads; no Prisma writes; no refresh run records created.
- Optional: validate merged payload in memory only (no `upsertSlatePayload`).

### CF-2 — ADR-006: Retention policy wording is contradictory

**Severity:** Medium (documentation clarity)

ADR-006 states:

> Policy applies **whichever limit is stricter** — a backup is kept if it is within both count and age limits.

"Whichever is stricter" implies choosing between policies; "within both" implies AND logic. The intended behavior (keep if in top N **and** younger than retention days, except never delete most recent) is sound but the phrasing is ambiguous.

**Required ADR revision:**

Replace with explicit rule:

> A backup is **retained** if it is among the `BACKUP_RETENTION_COUNT` most recent files **and** its age is ≤ `BACKUP_RETENTION_DAYS`. The most recent backup is **never deleted** regardless of age. Dry-run output must show which criterion triggered each deletion candidate.

---

## High-priority recommendations

### HP-1 — ADR-004: Specify exporter initialization hook

`@alpha-dfs/observability` exports snapshot readers but has **no exporter registration hook** today. ADR-004 should specify:

| Decision point | Recommended specification |
|----------------|---------------------------|
| Package boundary | `@alpha-dfs/telemetry-export` depends on observability; observability does **not** depend on telemetry-export |
| Initialization site | `apps/web` startup (e.g., alongside backend dependency container init) — not inside observability core |
| Data source | Exporter reads via `getMetricsSnapshot()`, `getRecentLogs()`, `getRecentTraces()` |
| Lifecycle | `start()` on process boot when mode ≠ `none`; `stop()` on graceful shutdown |
| V1 default | No initialization when `TELEMETRY_EXPORT_MODE` unset or `none` |

This preserves ADR-002 ring-buffer authority and avoids circular package dependencies.

### HP-2 — ADR-005: Place fetch-only logic at connector boundary

Recommend implementing `fetchConnectorsOnly()` in `@alpha-dfs/connectors` (or as a thin helper using existing `fetchWithRetry` + registry iteration) rather than deep inside refresh-service persistence logic. Smoke script imports this helper directly — keeps connector package boundaries clean per [CONNECTOR_ADR_001.md](../architecture/CONNECTOR_ADR_001.md).

### HP-3 — ADR-008: Clarify E2E database strategy

ADR-008 should specify one primary approach:

- **Recommended:** Dedicated test DB via `ALPHA_DFS_TEST_DB=true` + fixture paths (matches existing test helpers pattern).
- Analyze Slate E2E may use seed/fixture connector mode; assert status transition without requiring live DK credentials.
- Document that E2E does not run against production `DATABASE_URL`.

### HP-4 — Synchronize planning document metadata

Update `V2_MIGRATION_STRATEGY.md` status to `Planning complete — Task 3` and date to `2026-07-19` for index consistency.

---

## Required ADR revisions (summary)

| ADR | Revision | Blocking gate open? |
|-----|----------|---------------------|
| ADR-005 | Add explicit no-DB-write fetch path; forbid `refresh()` reuse | **Yes — before implementation** |
| ADR-006 | Clarify retention AND logic + never-delete-most-recent | **Yes — before implementation** |
| ADR-004 | Specify init site and package dependency direction | Recommended in Phase 2A |
| ADR-008 | Specify E2E test DB / fixture strategy | Recommended in Phase 2A |

Revisions are **documentation-only**. No architectural redesign required.

---

## Risk assessment

### Residual V2.0 risks (post-review)

| Risk | Likelihood | Impact | Mitigation | Accept? |
|------|------------|--------|------------|---------|
| Readonly smoke gives false confidence if DB writes leak | Medium → Low after CF-1 fix | High | ADR-005 revision + regression test asserting zero Prisma writes | ✅ |
| Backup prune deletes operator-needed backup | Low | Medium | Dry-run default; never delete most recent | ✅ |
| Telemetry export adds startup failure | Low | Low | Fail-open; mode=none default | ✅ |
| Playwright CI flakiness | Medium | Low | Optional V2.0 cert gate; retry policy; fixture mode | ✅ |
| V2 branch merge conflicts with V1 maintenance | Medium | Medium | Separate branch; V1 certify on main unchanged | ✅ |
| OTLP credential exposure | Low | Medium | Env vars only; deployment guide | ✅ |

### Risks adequately deferred

| Risk | Deferred to |
|------|-------------|
| DTO breaking changes | V2.1 ADRs + mapper regression gate |
| Schema migration failure | ADR-009 workflow at V2.1 |
| Platform/sport abstraction complexity | V2.2/V2.3 ADRs |
| Background workers / late swap | Amendment 004 + V2.4 |

---

## Per-ADR assessment

### ADR-004 — External Telemetry Export

**Verdict:** ✅ Approve with HP-1 clarification

**Strengths:** Optional adapter layer; fail-open; no DTO/UI changes; aligns with deferred APM gap from ADR-002.

**Gaps:** Hook registration unspecified; OTLP MVP scope appropriately minimal.

### ADR-005 — Read-Only Smoke Test Mode

**Verdict:** ⚠️ Approve with CF-1 required revision

**Strengths:** Directly addresses RC outstanding risk; backward-compatible default; no new API routes.

**Gaps:** Must explicitly bypass refresh repository writes (validated against current codebase).

### ADR-006 — Backup Retention & Prune Policy

**Verdict:** ⚠️ Approve with CF-2 required revision

**Strengths:** Dry-run default; opt-in integration; preserves backup/restore model.

**Gaps:** Wording ambiguity only.

### ADR-007 — Deployment Supervisor Guide

**Verdict:** ✅ Approve

**Strengths:** Zero code risk; required sections comprehensive; correctly references existing health endpoints and rollback guide.

**Gaps:** None material.

### ADR-008 — Browser E2E Certification

**Verdict:** ✅ Approve with HP-3 recommendation

**Strengths:** Scoped MVP; Chromium-only; excluded from V1 certify; addresses SSR 500 class of regressions.

**Gaps:** Test DB strategy should be explicit.

### ADR-009 — Prisma Migration Policy

**Verdict:** ✅ Approve

**Strengths:** Addresses Task 2 gap; clear V1/V2.0/V2.1+ tooling transition; additive-only; backup gate; smoke-after-migrate workflow references ADR-005 readonly mode.

**Gaps:** `db:migrate` scripts correctly deferred to V2.1 implementation — not a V2.0 blocker.

---

## Readiness determination

| Gate | Criterion | Satisfied |
|------|-----------|-----------|
| Gate 1 — V1 stability | RC validated, maintenance governance, production readiness | ✅ |
| Gate 2 — Planning package | ADRs, dependency map, risks, migration strategy | ✅ |
| Gate 3 — Independent review | This ADR package review | ✅ |
| Gate 3 — Review recommendation | Approve V2.0 implementation | ✅ |
| Gate 4 — Scope authorization | Change control record | ❌ Phase 3 |

**Architecture readiness:** ✅ **READY**

**Implementation authorization:** Pending Phase 2A doc revisions + Phase 3 gate open record.

---

## Recommendation

### Implementation gate

| Option | Recommendation |
|--------|----------------|
| Keep gate **CLOSED** | Only if Phase 2A revisions are rejected or deferred indefinitely |
| **Open gate for V2.0** | ✅ **Recommended** after Phase 2A applies CF-1, CF-2, and HP-1–HP-4 |

### Authorized next steps

```text
Phase 2A (GPT-5.5) — Documentation revisions
  → ADR-005 CF-1: no-DB-write fetch path
  → ADR-006 CF-2: retention wording
  → ADR-004 HP-1: init hook specification
  → ADR-008 HP-3: E2E DB strategy
  → V2_MIGRATION_STRATEGY metadata sync

Phase 3 (GPT-5.5) — Governance decision
  → Record gate open in V2_IMPLEMENTATION_GATE.md
  → Issue change control record (Gate 4)
  → Update GOVERNANCE_MILESTONE.md, MODEL_ASSIGNMENT.md

Phase 4 (Composer 2.5) — V2.0 implementation [blocked until Phase 3]
  → Branch: v2/v2.0-foundation
  → Order: V2.0-2 → V2.0-3 → V2.0-4 → V2.0-1 → V2.0-5
```

### Final verdict

| Question | Answer |
|----------|--------|
| Is the ADR package architecturally coherent? | **Yes** |
| Are capability boundaries and sequencing correct? | **Yes** |
| Is V1 compatibility preserved? | **Yes** |
| Are there blocking architectural defects? | **No** |
| Are documentation revisions required? | **Yes — 2 required, 2 recommended** |
| Ready for V2.0 implementation? | **Yes — after Phase 2A revisions and Phase 3 gate open** |
| Recommend opening implementation gate? | **Yes — conditional on Phase 2A completion** |

---

## Related documents

| Doc | Purpose |
|-----|---------|
| [V2_IMPLEMENTATION_GATE.md](../architecture/V2_IMPLEMENTATION_GATE.md) | Gate status and open procedure |
| [V2_ARCHITECTURE_REVIEW.md](./V2_ARCHITECTURE_REVIEW.md) | Task 2 planning review |
| [TASK_3_PLANNING_PACKAGE.md](../architecture/TASK_3_PLANNING_PACKAGE.md) | Task 3 completion index |
| [GOVERNANCE_MILESTONE.md](../operations/GOVERNANCE_MILESTONE.md) | Milestone tracker |

---

**Review status:** ✅ **COMPLETE**  
**Phase 2A status:** ✅ **COMPLETE** — CF-1, CF-2, HP-1–HP-4 applied 2026-07-19  
**Implementation gate:** ✅ **OPEN** — [V2_IMPLEMENTATION_GATE.md](../architecture/V2_IMPLEMENTATION_GATE.md) (V2-CC-001)
