# Version 2 Planning Governance — Alpha DFS AI

**Status:** Active — V2.1 Release Candidate complete  
**Effective:** 2026-07-19  
**Workstream:** B — Version 2 Program  
**Parent:** [V2_PROGRAM.md](./V2_PROGRAM.md) · [ADR-003-V2_PLANNING_KICKOFF.md](./ADR-003-V2_PLANNING_KICKOFF.md)

---

## Scope

Version 2 is the **innovation track** for advanced DFS capabilities. Workstream B defines architecture, ADRs, capability sequencing, and migration strategy.

**V2.1 is complete** — Release Candidate on `main` per [V2_1_RELEASE_NOTES.md](../operations/releases/V2_1_RELEASE_NOTES.md). **V2.2+ remains blocked** until respective phase gates open.

Implementation requires:

1. Version 1 RC baseline remains stable on `main`
2. Target capability is assigned to a V2 phase with ADR
3. Independent architecture review (Opus) complete ✅
4. Implementation gate decision recorded ✅
5. Charter amendment approved where scope expands beyond Amendment 001

---

## Objectives

- Define Version 2 architecture without modifying V1 production code.
- Produce ADRs for authorized capabilities only.
- Sequence implementation after V1 maintenance line is protected.
- Preserve V1 compatibility: `DTO → Mapper → ViewModel → Presentation`.

---

## Future capability domains (planning examples)

These are **not authorized** — listed for roadmap alignment only:

| Domain | Examples |
|--------|----------|
| Projection Intelligence | Advanced models, injury/weather integration, confidence calibration |
| Portfolio Optimization | Multi-lineup generation, exposure management, cross-slate portfolios |
| Contest Intelligence | Field size, payout structure, GPP vs cash strategy |
| Ownership & Leverage | Ownership prediction, contrarian targeting |
| Late Swap | In-slate roster changes, lock-time management |
| Bankroll Management | Stake sizing, contest selection, ROI tracking |
| Simulation | Full GPP field simulation, Monte Carlo improvements |
| Platform expansion | FanDuel, Yahoo, multi-platform abstraction |
| Sport expansion | NBA, MLB, NHL, sport plugin architecture |
| AI Coaching | Lineup explanations, decision rationale, voice interface |

Canonical breakdown: [V2_CAPABILITY_BREAKDOWN.md](./V2_CAPABILITY_BREAKDOWN.md)  
Backlog: [BACKLOG.md](../BACKLOG.md)

---

## Planning documents (canonical)

| # | Document | Purpose |
|---|----------|---------|
| — | [TASK_3_PLANNING_PACKAGE.md](./TASK_3_PLANNING_PACKAGE.md) | **Task 3 completion index** |
| — | [V2_1_PLANNING_PACKAGE.md](./V2_1_PLANNING_PACKAGE.md) | **V2.1 planning package — complete** |
| — | [V2_1_IMPLEMENTATION_GATE.md](./V2_1_IMPLEMENTATION_GATE.md) | **V2.1 gate — OPEN (V2-CC-002)** |
| — | [V2_IMPLEMENTATION_GATE.md](./V2_IMPLEMENTATION_GATE.md) | V2.0 gate — Foundation complete |
| — | [V2_DEPENDENCY_MAP.md](./V2_DEPENDENCY_MAP.md) | Phase and capability dependencies |
| 1 | [V2_ROADMAP.md](./V2_ROADMAP.md) | Phased roadmap (V2.0 → V2.4) |
| 2 | [V2_ARCHITECTURE_OVERVIEW.md](./V2_ARCHITECTURE_OVERVIEW.md) | Architecture overview |
| 3 | [V2_CAPABILITY_BREAKDOWN.md](./V2_CAPABILITY_BREAKDOWN.md) | Capability inventory by phase |
| 4 | [V2_MIGRATION_STRATEGY.md](./V2_MIGRATION_STRATEGY.md) | V1 → V2 migration |
| 5 | [V2_RISK_ASSESSMENT.md](./V2_RISK_ASSESSMENT.md) | Risk register |
| 6 | [ADR-003-V2_PLANNING_KICKOFF.md](./ADR-003-V2_PLANNING_KICKOFF.md) | Planning kickoff ADR |

### V2.1 ADR package

| ADR | Capability |
|-----|------------|
| [ADR-010](./ADR-010-V2_1_1_SLATE_INTELLIGENCE.md) | V2.1-1 Slate Intelligence live |
| [ADR-011](./ADR-011-V2_1_2_HEADER_PIPELINE_STATUS.md) | V2.1-2 Header pipeline status |
| [ADR-012](./ADR-012-V2_1_3_GPP_FIELD_SIMULATION.md) | V2.1-3 GPP field simulation |
| [ADR-013](./ADR-013-V2_1_4_INJURY_CONNECTOR.md) | V2.1-4 Injury connector |
| [ADR-014](./ADR-014-V2_1_5_VEGAS_ODDS_CONNECTOR.md) | V2.1-5 Vegas odds connector |
| [ADR-015](./ADR-015-V2_1_6_WEATHER_CONNECTOR.md) | V2.1-6 Weather connector |
| [ADR-016](./ADR-016-V2_1_7_PROJECTION_CALIBRATION.md) | V2.1-7 Projection calibration |
| [ADR-017](./ADR-017-V2_1_8_MULTI_LINEUP_EXPOSURE.md) | V2.1-8 Multi-lineup exposure |
| [ADR-018](./ADR-018-V2_1_9_OWNERSHIP_PREDICTION.md) | V2.1-9 Ownership prediction |

### V2.0 ADR package (complete)

| ADR | Capability |
|-----|------------|
| [ADR-004](./ADR-004-V2_0_1_TELEMETRY_EXPORT.md) | V2.0-1 Telemetry export |
| [ADR-005](./ADR-005-V2_0_2_READONLY_SMOKE.md) | V2.0-2 Read-only smoke |
| [ADR-006](./ADR-006-V2_0_3_BACKUP_RETENTION.md) | V2.0-3 Backup retention |
| [ADR-007](./ADR-007-V2_0_4_DEPLOYMENT_SUPERVISOR.md) | V2.0-4 Supervisor guide |
| [ADR-008](./ADR-008-V2_0_5_BROWSER_E2E.md) | V2.0-5 Browser E2E |
| [ADR-009](./ADR-009-PRISMA_MIGRATION_POLICY.md) | Prisma migration policy |

Do not create parallel architecture documents — refine these canonical sources.

---

## Planning rules

| Rule | Detail |
|------|--------|
| No V1 mixing | V2 code on separate branch; no V2 features in V1 maintenance PRs |
| No duplicate docs | Update existing V2 program docs; do not fork new design documents |
| ADR before code | Each capability requires accepted ADR before implementation |
| Scope lock | Amendment 001 (DK · NFL · Classic) remains until charter amendment |
| One capability at a time | Complete, certify, gate before next major V2 capability |
| Architecture frozen in V1 | V2 may extend DTOs via migration ADR — not silently in V1 |

---

## Model assignment

| Phase | Model | Responsibility |
|-------|-------|----------------|
| Architecture & roadmap | GPT-5.5 | Capability boundaries, ADRs, interfaces, sequence |
| Architecture review | Claude Opus 4.1 | Independent validation before coding |
| Implementation (post-gate) | Composer 2.5 | Build approved capabilities |
| Validation & testing | Composer 2.5 | Integration, regression, performance |
| ADRs & documentation | GPT-5.5 | Design docs, guides, roadmap updates |

Full map: [../operations/MODEL_ASSIGNMENT.md](../operations/MODEL_ASSIGNMENT.md)

---

## Implementation gate checklist

Before any V2 capability moves to implementation:

- [ ] Assigned to V2 phase in [V2_CAPABILITY_BREAKDOWN.md](./V2_CAPABILITY_BREAKDOWN.md)
- [ ] ADR written and accepted
- [ ] DTO / ViewModel / mapper impact assessed
- [ ] Migration notes in [V2_MIGRATION_STRATEGY.md](./V2_MIGRATION_STRATEGY.md)
- [ ] Independent Opus architecture review complete
- [ ] Charter amendment if scope expands (sport, platform, contest type)
- [ ] V1 maintenance line unaffected on `main`

---

## Relationship to Version 1

```text
Version 1 (frozen)              Version 2 (planning)
─────────────────              ────────────────────
DraftKings · NFL · Classic     Advanced capabilities
Production line          ←──   Architecture & ADRs
Maintenance only               Implementation (later)
RC baseline                    Charter amendment if scope expands
```

V1 governance: [../operations/V1_MAINTENANCE_GOVERNANCE.md](../operations/V1_MAINTENANCE_GOVERNANCE.md)

---

## Pending planning actions

| Action | Owner | Status |
|--------|-------|--------|
| Task 3 planning package | Architecture | ✅ Complete — [TASK_3_PLANNING_PACKAGE.md](./TASK_3_PLANNING_PACKAGE.md) |
| Opus review of V2 planning documents | Review | ✅ Complete — [V2_ARCHITECTURE_REVIEW.md](../reviews/V2_ARCHITECTURE_REVIEW.md) |
| V2.0 ADRs (ADR-004–008) | Architecture | ✅ Complete — Phase 2A revised |
| Prisma migration policy (ADR-009) | Architecture | ✅ Complete |
| Opus ADR package review | Review | ✅ Complete — [V2_ADR_PACKAGE_REVIEW.md](../reviews/V2_ADR_PACKAGE_REVIEW.md) |
| Phase 2A documentation revisions | Architecture | ✅ Complete |
| Implementation gate open | Governance | ✅ Open — [V2_IMPLEMENTATION_GATE.md](./V2_IMPLEMENTATION_GATE.md) |
| **V2.0 Foundation implementation** | Engineering | ✅ Complete — [V2_FOUNDATION_COMPLETION_RECORD.md](./V2_FOUNDATION_COMPLETION_RECORD.md) |
| **V2.1 planning package** | Architecture | ✅ Complete — [V2_1_PLANNING_PACKAGE.md](./V2_1_PLANNING_PACKAGE.md) |
| **Opus V2.1 ADR package review** | Review | ✅ Complete — [V2_1_ADR_PACKAGE_REVIEW.md](../reviews/V2_1_ADR_PACKAGE_REVIEW.md) (Approve with revisions) |
| **Phase 2A ADR revisions** | Architecture | ✅ Complete |
| **V2.1 implementation gate** | Governance | ✅ Open — V2-CC-002 |

---

## Exactly one next action

**V2.1-1 — Slate Intelligence (Composer 2.5):** Implement per [ADR-010](./ADR-010-V2_1_1_SLATE_INTELLIGENCE.md) on `v2/v2.1-intelligence`.
