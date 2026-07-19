# V2.2 Engineering Plan — Milestones M4–M8

**Status:** Planning Complete — Program 6  
**Date:** 2026-07-19  
**Program:** [V2_2_PROGRAM_AUTHORIZATION.md](./V2_2_PROGRAM_AUTHORIZATION.md)  
**Branch:** `v2/v2.2-adi` (created at implementation gate open)  
**Baseline:** `main` @ `v2.1.0` (`dd52641`)

---

## 1. Overview

V2.2 implementation is divided into five executable milestones (M4–M8) after planning Programs 2–7 complete. Each milestone is independently buildable, testable, and certifiable.

**Implementation model:** Composer 2.5  
**Review model:** GPT-5.5 per milestone gate

```text
M4 Platform Infrastructure
  ↓
M5 Evidence Providers (7)
  ↓
M6 Evidence Fusion Engine
  ↓
M7 Engine Integration
  ↓
M8 Validation & Certification → v2.2.0
```

---

## 2. Dependencies

| Milestone | Depends on | Blocks |
|-----------|------------|--------|
| M4 | Programs 2–7 approved; gate open | M5, M6 |
| M5 | M4 platform packages | M6 (full fusion input) |
| M6 | M4 cache/event bus; M5 at least 1 provider | M7 |
| M7 | M6 NormalizedEvidenceBundle | M8 |
| M8 | M4–M7 complete | Release |

M5 and M6 may overlap in development after M4 certifies, but M6 certification requires ≥ 3 providers producing valid packages.

---

## 3. Milestone M4 — Platform Infrastructure

**Theme:** ADI platform skeleton — no live providers, no fusion logic.

### Deliverables

| Item | Package / location |
|------|-------------------|
| `@alpha-dfs/adi-platform` package scaffold | `packages/adi-platform/` |
| ConnectorManager | register, fetchAll stub |
| SourceRegistry | provider descriptors, weights, flags |
| EvidenceCache | run-scoped TTL cache |
| EventBus | in-process typed pub/sub |
| AgentOrchestrator skeleton | event wiring only |
| AdiPlatform facade | prepare/shutdown no-op path |
| Pipeline hook | `PipelineExecutionManager` — gated by `ADI_PLATFORM_ENABLED` |
| Feature flag plumbing | env parsing |

### ADR compliance

- ADR-019: platform components, lifecycle, feature flag
- ADR-022: orchestrator skeleton, event subscriptions (no-op handlers)

### Acceptance criteria

- [ ] `ADI_PLATFORM_ENABLED=false` → V2.1 pipeline byte-identical (regression snapshot)
- [ ] `ADI_PLATFORM_ENABLED=true` → platform bootstraps, emits `adi.platform.ready`, no fetch
- [ ] Workspace tests ≥ 247 pass
- [ ] Production build pass
- [ ] Unit tests: ConnectorManager, SourceRegistry, EvidenceCache, EventBus (≥ 15 tests)
- [ ] Integration INT-1 stub (bootstrap only)
- [ ] No new UI routes or panels

### Required tests

- Unit: platform components
- Integration: pipeline hook with ADI disabled/enabled
- Regression: full V2.1 suite

### Documentation

- Package README, env vars, feature flags
- M4 Milestone Certification Report

### Certification gate

GPT-5.5 architecture compliance check before M5 start.

---

## 4. Milestone M5 — Evidence Providers

**Theme:** Seven provider adapters outputting `EvidencePackage` via seed fixtures.

### Deliverables

| Provider ID | Adapter | Fixture |
|-------------|---------|---------|
| `news` | NewsEvidenceProvider | `news-seed.json` |
| `social` | SocialEvidenceProvider | `social-seed.json` |
| `sportsbook` | SportsbookEvidenceProvider | `sportsbook-seed.json` |
| `consensus` | ConsensusEvidenceProvider | `consensus-seed.json` |
| `dfs_content` | DfsContentEvidenceProvider | `dfs-content-seed.json` |
| `betting` | BettingEvidenceProvider | `betting-seed.json` |
| `historical_learning` | HistoricalLearningProvider | `historical-seed.json` |

Package: `@alpha-dfs/adi-providers`

### ADR compliance

- ADR-021: EvidenceProvider interface, retry, normalization, versioning
- [V2_2_EVIDENCE_PROVIDER_SPECIFICATIONS.md](./V2_2_EVIDENCE_PROVIDER_SPECIFICATIONS.md)

### Acceptance criteria

- [ ] Each provider implements `EvidenceProvider` with ≥ 5 unit tests
- [ ] ConnectorManager fetches all enabled providers in parallel (seed mode)
- [ ] Per-provider feature flags work (`ADI_PROVIDER_<ID>_ENABLED`)
- [ ] Provider failure degrades without aborting pipeline (INT-2, INT-3)
- [ ] Raw provider payloads never leave adapter boundary
- [ ] Workspace tests ≥ 260 (15+ new provider tests)
- [ ] Build pass

### Required tests

- Unit: 7 × provider adapter
- Integration: parallel fetch, single fail, all fail
- Architecture: import graph — no provider types in engines

### Documentation

- Per-provider fixture README
- M5 Milestone Certification Report

---

## 5. Milestone M6 — Evidence Fusion Engine

**Theme:** Deterministic fusion producing `NormalizedEvidenceBundle`.

### Deliverables

| Item | Package |
|------|---------|
| `@alpha-dfs/evidence-fusion` | `packages/evidence-fusion/` |
| `fuseEvidence()` | dedupe, TTL, weight, conflict, aggregate |
| Fusion agent | ADR-022 `adi_fusion_agent` |
| Golden bundle fixtures | per seed slate |
| Benchmark script | `scripts/bench/adi-pipeline-bench.ts` |

### ADR compliance

- ADR-020: canonical model, fusion rules, conflict resolution
- [V2_2_DATA_MODEL.md](./V2_2_DATA_MODEL.md)

### Acceptance criteria

- [ ] Fusion unit tests ≥ 20 covering all evidence types
- [ ] INT-4 conflict scenario passes
- [ ] INT-7: ADI on vs off — V2.1 outputs identical when off
- [ ] Performance: fetch + fusion p95 ≤ 30s (seed mode)
- [ ] E2E-ADI-1, E2E-ADI-2 pass
- [ ] `NormalizedEvidenceBundle` attached to `AnalysisRunContext.priorOutputs.adiEvidence`
- [ ] Workspace tests ≥ 285
- [ ] Build pass

### Required tests

- Unit: fusion engine (exhaustive)
- Integration: full fetch → fuse path
- E2E: analyze with ADI enabled (seed)
- Performance: benchmark gate

### Documentation

- Fusion rule reference (inline ADR-020 appendix or package doc)
- M6 Milestone Certification Report

---

## 6. Milestone M7 — Engine Integration

**Theme:** V2.1 engines consume `NormalizedEvidenceBundle` where ADR-approved.

### Integration map

| Engine | Evidence types consumed | Change type |
|--------|-------------------------|-------------|
| Injury intelligence | injury_status, practice_report, game_status | Extend adapter input |
| Vegas intelligence | line_movement, implied_total, sharp_indicator | Extend adapter input |
| Projection calibration (PCE) | projection_delta, consensus_projection | Extend agent input |
| Ownership prediction | chalk_probability, leverage_signal, social_sentiment | Extend agent input |
| GPP simulation | implied_total, sharp_indicator | Extend field gen input |
| PIE exposure | stack_recommendation, contrarian_signal | Extend engine input |

**Rule:** One engine at a time; full regression after each.

### Additional deliverables

- Learning agent (async, flag-gated)
- Optional Prisma: `SourceReliability`, `EvidenceAuditRun` (ADR-009 migration)
- Degradation notes in engine outputs when ADI partial

### ADR compliance

- ADR-022: learning agent, memory boundaries
- V2.1 engine ADRs — additive input only

### Acceptance criteria

- [ ] Each integrated engine has integration test with mock bundle
- [ ] INT-5, INT-6 pass
- [ ] No presentation DTO changes unless ADR-approved (default: none)
- [ ] Improved engine outputs measurable in fixture slates (document delta)
- [ ] Workspace tests ≥ 310
- [ ] Build pass; E2E 14+ pass

### Required tests

- Integration per engine
- DTO snapshot — no new ADI fields in presentation layer
- Learning agent async (non-blocking)

### Documentation

- Engine integration matrix (updated)
- M7 Milestone Certification Report

---

## 7. Milestone M8 — Validation & Certification

**Theme:** Program close, release candidate, gate close.

### Deliverables

| Item | Detail |
|------|--------|
| Full validation suite | L1–L7 per [V2_2_VALIDATION_STRATEGY.md](./V2_2_VALIDATION_STRATEGY.md) |
| E2E suite | 16 tests (11 V2.1 + 5 ADI) |
| Operational cert | startup, deploy smoke, observability |
| Architecture audit | No ADI UI; boundary compliance |
| V2.2 completion record | Program close document |
| Release notes | `docs/operations/releases/V2_2_RELEASE_NOTES.md` |
| Tag | `v2.2.0` on `main` after merge |

### Acceptance criteria

- [ ] Workspace regression ≥ 320 pass; zero V2.1 behavioral regression
- [ ] E2E 16/16 pass
- [ ] Production build pass
- [ ] Benchmark within budget
- [ ] `ADI_PLATFORM_ENABLED=false` default in production deploy docs
- [ ] V2.2 implementation gate CLOSED
- [ ] All ADR-019–022 acceptance criteria checked
- [ ] Opus review conditions (if any) resolved

### Certification sequence

```text
1. Run full certify suite (build, test, e2e, startup)
2. GPT-5.5 architecture compliance audit
3. Publish V2.2 Program Completion Record
4. Merge v2/v2.2-adi → main
5. Tag v2.2.0
6. Close V2_2_IMPLEMENTATION_GATE
```

---

## 8. Risk controls per milestone

| Risk | Control |
|------|---------|
| V2.1 regression | Full suite every milestone; ADI off snapshot |
| Scope creep (ADI UI) | Architecture lint + E2E negative assertion |
| Provider licensing | Seed-first; live optional at M8 |
| Fusion complexity | Golden fixtures; deterministic rules only |
| Performance | Benchmark gate at M6 and M8 |

---

## 9. Model assignments

| Activity | Model |
|----------|-------|
| M4–M8 implementation | Composer 2.5 |
| Milestone gate review | GPT-5.5 |
| M8 architecture audit | GPT-5.5 |
| Independent ADR review (pre-impl) | Claude Opus 4.1 — [V2_2_ADR-019_REVIEW.md](../reviews/V2_2_ADR-019_REVIEW.md) |

---

## 10. Timeline guidance (non-binding)

| Milestone | Estimated effort |
|-----------|------------------|
| M4 | 1 sprint |
| M5 | 2 sprints (parallelizable providers) |
| M6 | 1 sprint |
| M7 | 2 sprints (sequential engine integration) |
| M8 | 1 sprint |

---

## Exactly one next action

**Program 7:** Architecture Readiness Review — determine implementation gate status per [V2_2_ARCHITECTURE_READINESS_REVIEW.md](./V2_2_ARCHITECTURE_READINESS_REVIEW.md).
