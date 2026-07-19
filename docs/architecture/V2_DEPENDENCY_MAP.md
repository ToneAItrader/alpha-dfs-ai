# Version 2 Dependency Map

**Status:** V2.0 complete — V2.1 planning complete  
**Task:** Phase 2A — ADR package revisions  
**Related:** [V2_CAPABILITY_BREAKDOWN.md](./V2_CAPABILITY_BREAKDOWN.md) · [V2_ROADMAP.md](./V2_ROADMAP.md)

---

## Phase dependency graph

```text
V1 RC Baseline (frozen)
        │
        ▼
┌───────────────────────────────────────┐
│  V2.0 — Foundation (ops / QA)         │
│  ADR-004..008 · No schema changes     │
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│  V2.1 — Intelligence depth            │
│  Requires ADR-009 for schema changes  │
└───────────────────────────────────────┘
        │
        ├──────────────────┐
        ▼                  ▼
┌───────────────┐  ┌───────────────────┐
│ V2.2 Platform │  │ V2.4 Advanced     │
│ Amendment 002 │  │ Amendment 004     │
└───────────────┘  └───────────────────┘
        │
        ▼
┌───────────────┐
│ V2.3 Sport    │
│ Amendment 003 │
└───────────────┘
```

V2.2 and V2.4 may proceed in parallel after V2.1 — they do not depend on each other.

---

## V2.0 internal dependencies

| Capability | Depends on | Blocks |
|------------|------------|--------|
| V2.0-1 Telemetry export | ADR-002 observability snapshots; init in `apps/web` | External APM (optional) |
| V2.0-2 Read-only smoke | V1 smoke script; `@alpha-dfs/connectors` fetch-only path | Safe prod verification |
| V2.0-3 Backup prune | V1 backup (VACUUM INTO) | Long-term disk hygiene |
| V2.0-4 Supervisor guide | V1 deploy.sh; ADR-004 cross-reference | Production hosting |
| V2.0-5 Browser E2E | V1 frontend; `ALPHA_DFS_TEST_DB` + fixtures | UX regression detection |

**Recommended implementation order:** V2.0-2 → V2.0-3 → V2.0-4 → V2.0-1 → V2.0-5

(Lowest product risk first; E2E last due to tooling overhead)

**ADR-005 constraint:** Read-only smoke uses `fetchConnectorsOnly()` at connector boundary — must not call `refresh()`, `refreshAndEnsureReady()`, or any Prisma write path.

---

## V2.1 dependencies

| Capability | ADR | Depends on | External dependency |
|------------|-----|------------|---------------------|
| V2.1-2 Header pipeline status | ADR-011 | V2.0 baseline | None |
| V2.1-1 Slate Intelligence UI | ADR-010 | **New `slate_intelligence` engine** (distinct from `slate_analysis`) | None |
| V2.1-4 Injury connector | ADR-013 | CONNECTOR_ADR_001 | Licensed injury feed |
| V2.1-5 Vegas odds connector | ADR-014 | CONNECTOR_ADR_001 | Licensed odds feed |
| V2.1-6 Weather connector | ADR-015 | CONNECTOR_ADR_001 | Weather API |
| V2.1-3 GPP simulation | ADR-012 | ADR-009 migration | Simulation engine |
| V2.1-7 Projection calibration | ADR-016 | Scoring, PCE; V2.1-4/5 optional | None |
| V2.1-8 Multi-lineup exposure | ADR-017 | PIE, portfolio engine | None |
| V2.1-9 Ownership prediction | ADR-018 | **V2.1-3**; V2.1-5 optional | None |

**Recommended implementation order:** V2.1-2 → V2.1-1 → V2.1-4 → V2.1-5 → V2.1-6 → V2.1-3 → V2.1-7 → V2.1-8 → V2.1-9

V2.1-4/5/6 may ship independently with file-export fallback per PROVIDER_COMPATIBILITY_MATRIX.

---

## Cross-cutting capability dependencies

| Domain | Phase | Depends on | Notes |
|--------|-------|------------|-------|
| Projection Intelligence | V2.1 | Scoring engine, PCE | Calibration within DK NFL Classic |
| Ownership prediction | V2.1 + V2.4 | V2.1-3 simulation | Basic in V2.1; advanced in V2.4 |
| Multi-lineup optimization | V2.1 | PIE, portfolio engine | Extends existing optimizer |
| Contest Intelligence | V2.4 | Simulation, bankroll | Requires contest metadata model |
| Late Swap Intelligence | V2.4 | Amendment 004, workers | Real-time data — charter change |
| Bankroll Management | V2.4 | Contest Intelligence | Stake sizing, ROI tracking |
| AI Coaching | V2.4+ | All analysis panels | Explanations only — no execution |
| Cross-slate portfolio | V2.4 | Bankroll, multi-slate DB | Amendment 004 |

---

## Platform & sport dependencies

| Phase | Requires | Blocks |
|-------|----------|--------|
| V2.2 Platform | Amendment 002, V2.2-1 abstraction | FanDuel, Yahoo connectors |
| V2.3 Sport | Amendment 003, V2.3-1 plugin | NBA, MLB, NHL engines |

V2.2 and V2.3 require V2.0 complete and V2.1 stable — not necessarily all V2.1 capabilities.

---

## External dependencies

| Dependency | Affects | Fallback |
|------------|---------|----------|
| DraftKings export/API | V1, all phases | Fixture files |
| Projection export/API | V1, all phases | Fixture files |
| Licensed injury feed | V2.1-4 | Manual export |
| Licensed odds feed | V2.1-5 | Defer or file export |
| Weather API | V2.1-6 | Optional — low priority |
| OTLP endpoint | V2.0-1 | File export mode |
| Playwright browsers | V2.0-5 | Dev/CI only |

---

## V1 protection dependencies

Every V2 phase must maintain:

- Separate git branch until merge decision
- V1 `certify` pass on `main` unchanged
- No V2 DTO changes on V1 maintenance line
- ADR before code per capability
