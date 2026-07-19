# V2.2 Validation Strategy

**Status:** Planning Complete — Program 5  
**Date:** 2026-07-19  
**Program:** [V2_2_PROGRAM_AUTHORIZATION.md](./V2_2_PROGRAM_AUTHORIZATION.md)  
**Related:** [V2_2_ENGINEERING_PLAN.md](./V2_2_ENGINEERING_PLAN.md) · [RELEASE_CERTIFICATION_SPEC.md](../operations/RELEASE_CERTIFICATION_SPEC.md)

---

## 1. Purpose

Define the complete testing and certification strategy for Version 2.2 (ADI Platform) before any production code is written. Validation gates apply at every milestone M4–M8 and at program close.

**Non-negotiable:** V2.1 regression baseline (247 workspace tests, 11 E2E) must pass at every milestone with `ADI_PLATFORM_ENABLED=false` producing byte-identical behavior to `v2.1.0`.

---

## 2. Validation layers

| Layer | Scope | When | Owner |
|-------|-------|------|-------|
| L1 Unit | Functions, adapters, fusion rules | Every PR / milestone | Composer 2.5 |
| L2 Integration | Provider → cache → fusion → engine hook | M4–M7 | Composer 2.5 |
| L3 End-to-end | Full analyze run with ADI enabled | M6+ | Composer 2.5 |
| L4 Performance | Fetch + fusion latency budget | M6 | GPT-5.5 review |
| L5 Resilience | Provider failure, timeout, degrade | M5–M6 | Composer 2.5 |
| L6 Operational | Startup, deploy, smoke, observability | M8 | Operator + scripts |
| L7 Architecture | ADR compliance, no ADI UI, boundary lint | M4–M8 | GPT-5.5 |

---

## 3. Unit testing

### 3.1 Packages under test

| Package | Focus |
|---------|-------|
| `@alpha-dfs/adi-platform` | ConnectorManager, SourceRegistry, EvidenceCache, EventBus |
| `@alpha-dfs/evidence-fusion` | Dedupe, weight, TTL, conflict resolution |
| `@alpha-dfs/adi-providers` | Per-provider normalization, fixture parity |
| `@alpha-dfs/web` (hook only) | `AdiPlatform.prepare()` integration with pipeline |

### 3.2 Unit test requirements

- Each `EvidenceProvider` adapter: ≥ 5 tests (happy path, empty, degrade, validation reject, timeout mock)
- Fusion engine: ≥ 20 tests covering all `EvidenceType` categories and conflict paths
- Event bus: publish/subscribe contract tests for all events in [V2_2_EVENT_CONTRACTS.md](./V2_2_EVENT_CONTRACTS.md)
- Feature flag: `ADI_PLATFORM_ENABLED=false` → platform no-op (zero side effects)

### 3.3 Fixtures

- Seed fixtures per provider (ADR-021) — required before live credentials
- Golden files for `NormalizedEvidenceBundle` per fixture slate (regression lock)
- No network calls in unit tests — mock or fixture only

---

## 4. Integration testing

### 4.1 Integration scenarios

| ID | Scenario | Milestone |
|----|----------|-----------|
| INT-1 | Platform bootstrap → fetch (seed) → cache → fusion → bundle | M4 |
| INT-2 | Single provider fail; others succeed; bundle partial | M5 |
| INT-3 | All providers fail; empty bundle; V2.1 engines unchanged | M5 |
| INT-4 | Fusion conflict: two injury statuses; conflict record present | M6 |
| INT-5 | Engine consumes bundle: PCE receives projection_delta | M7 |
| INT-6 | Learning agent updates weights post-run (async) | M7 |
| INT-7 | Full pipeline ADI on vs off — V2.1 outputs identical when off | M6 |

### 4.2 Boundary tests

- **No provider types in engine imports** — architecture lint test (AST or import graph)
- **No ADI fields in presentation DTOs** — DTO snapshot test
- **Events carry no credentials** — payload schema validation

---

## 5. End-to-end testing

Extend existing Playwright suite (11 tests baseline):

| ID | Test | ADI state |
|----|------|-----------|
| E2E-ADI-1 | Analyze slate completes with ADI disabled | `ADI_PLATFORM_ENABLED=false` |
| E2E-ADI-2 | Analyze slate completes with ADI enabled (seed) | `ADI_PLATFORM_ENABLED=true`, seed providers |
| E2E-ADI-3 | Pipeline status header shows ADI phase when enabled | enabled |
| E2E-ADI-4 | No new ADI UI panels rendered | enabled — negative assertion |
| E2E-ADI-5 | Degraded provider — analysis still completes | mock degrade flag |

**Minimum E2E count at M8:** 16 (11 V2.1 + 5 ADI).

Run: `CI=1 npm run certify:e2e` with `CONNECTOR_MODE=seed`.

---

## 6. Performance validation

### 6.1 Budget (ABR-001 §12)

| Metric | Target | Measurement |
|--------|--------|-------------|
| ADI fetch (parallel, 7 providers) | ≤ 25s p95 | Benchmark script |
| Fusion | ≤ 5s p95 | Benchmark script |
| Total ADI overhead | ≤ 30s p95 added to pipeline | End-to-end timing |
| Memory (10 consecutive runs) | No leak > 50MB growth | Startup cert script |

### 6.2 Benchmark gate

- Script: `scripts/bench/adi-pipeline-bench.ts` (M6 deliverable)
- Run in CI on milestone M6 and M8
- Fail milestone if p95 exceeds budget by > 20%

---

## 7. Resilience validation

| Failure mode | Expected behavior | Test type |
|--------------|-------------------|-----------|
| Provider timeout | Degrade; metric increment; fusion continues | Integration |
| Provider 5xx | Retry per ADR-021; then degrade | Unit + integration |
| Invalid EvidencePackage schema | Drop package; log; no crash | Unit |
| Fusion engine throw | Empty bundle + degradationNotes | Integration |
| Event bus handler throw | Isolated; other handlers continue | Unit |
| Global fetch timeout (45s) | Partial results; fusion with available | Integration |
| Process restart mid-run | N/A — single-run in-process MVP | Document only |

Chaos tests (optional M8): disable random provider via env flag in seed mode.

---

## 8. Operational validation

Align with V2.0 certification scripts:

| Script | ADI extension |
|--------|---------------|
| `npm run certify:startup` | Platform bootstrap with ADI disabled and enabled |
| `npm run certify:build` | All new packages type-check |
| `npm run certify:e2e` | Extended suite |
| Deploy smoke | `ADI_PLATFORM_ENABLED=false` default on deploy |

### 8.1 Observability validation

- Metrics emitted per ABR-001 §14 — verify in integration test via mock exporter
- Structured logs include `correlationId`, `runId`, `providerId`
- Health endpoint unchanged (ADR-002) — ADI health internal only

### 8.2 Production readiness checklist (M8)

- [ ] All seven providers have seed + live path documented
- [ ] Feature flags documented in deployment guide
- [ ] Rollback: disable `ADI_PLATFORM_ENABLED` restores V2.1 behavior
- [ ] Evidence audit optional; learning tables migrated if enabled
- [ ] No ADI UI surfaces (architecture audit sign-off)

---

## 9. Certification gates per milestone

| Milestone | Required validation |
|-----------|---------------------|
| M4 | L1 platform unit; INT-1; V2.1 regression 247+; build pass |
| M5 | L1 provider units (7); INT-2, INT-3; regression; build |
| M6 | Fusion unit (20+); INT-4, INT-7; L4 benchmark; E2E-ADI-1,2 |
| M7 | INT-5, INT-6; engine integration tests; regression |
| M8 | Full L1–L7; E2E 16/16; operational cert; completion record |

Each milestone publishes a **Milestone Certification Report** before gate advance.

---

## 10. Regression policy

| Rule | Detail |
|------|--------|
| Baseline | 247 workspace tests @ `v2.1.0` |
| Growth | New tests additive only; no V2.1 test deletion without ADR |
| ADI off parity | Snapshot compare key DTO fields when `ADI_PLATFORM_ENABLED=false` |
| Connector mode | `CONNECTOR_MODE=seed` for CI; live optional for operator cert |

---

## 11. Documentation validation

Each milestone deliverable includes:

- Updated ADR acceptance criteria checkboxes
- Package README with env vars and feature flags
- Fixture documentation per provider

Program close requires [V2_2_ARCHITECTURE_READINESS_REVIEW.md](./V2_2_ARCHITECTURE_READINESS_REVIEW.md) conditions satisfied.

---

## Exactly one next action

**Program 6:** Milestone planning (M4–M8) in [V2_2_ENGINEERING_PLAN.md](./V2_2_ENGINEERING_PLAN.md).
