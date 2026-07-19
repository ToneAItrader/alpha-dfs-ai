# Version 2 Capability Breakdown

**Status:** V2.0 complete — V2.1 planning complete  
**Roadmap:** [V2_ROADMAP.md](./V2_ROADMAP.md)  
**Dependencies:** [V2_DEPENDENCY_MAP.md](./V2_DEPENDENCY_MAP.md)

---

## Phase V2.0 — Foundation

| ID | Capability | ADR | Type | DTO | UI | Priority |
|----|------------|-----|------|-----|-----|----------|
| V2.0-1 | External telemetry export (OTLP/file) | [ADR-004](./ADR-004-V2_0_1_TELEMETRY_EXPORT.md) | Ops | None | None | High | ✅ Implemented |
| V2.0-2 | Read-only smoke mode | [ADR-005](./ADR-005-V2_0_2_READONLY_SMOKE.md) | Ops | None | None | High | ✅ Implemented |
| V2.0-3 | Backup retention / prune script | [ADR-006](./ADR-006-V2_0_3_BACKUP_RETENTION.md) | Ops | None | None | Medium | ✅ Implemented |
| V2.0-4 | Deployment supervisor guide | [ADR-007](./ADR-007-V2_0_4_DEPLOYMENT_SUPERVISOR.md) | Docs | None | None | Medium | ✅ Implemented |
| V2.0-5 | Browser E2E certification (Playwright) | [ADR-008](./ADR-008-V2_0_5_BROWSER_E2E.md) | QA | None | Observability only | Medium | ✅ Implemented |

**Gate:** [V2_IMPLEMENTATION_GATE.md](./V2_IMPLEMENTATION_GATE.md) · No Amendment 001 change

---

## Phase V2.1 — Intelligence depth

| ID | Capability | ADR | Type | DTO impact | UI impact | Priority |
|----|------------|-----|------|------------|-----------|----------|
| V2.1-1 | Slate Intelligence live integration | [ADR-010](./ADR-010-V2_1_1_SLATE_INTELLIGENCE.md) | Feature | Extend slate DTO | Mapper only | High |
| V2.1-2 | Header pipeline status wiring | [ADR-011](./ADR-011-V2_1_2_HEADER_PIPELINE_STATUS.md) | UX | None | Header/status | Medium |
| V2.1-3 | Full GPP field simulation | [ADR-012](./ADR-012-V2_1_3_GPP_FIELD_SIMULATION.md) | Engine | Extend simulation DTO | Mapper only | High |
| V2.1-4 | NFL injury API connector | [ADR-013](./ADR-013-V2_1_4_INJURY_CONNECTOR.md) | Data | Player fields | Mapper only | Medium |
| V2.1-5 | Vegas odds connector | [ADR-014](./ADR-014-V2_1_5_VEGAS_ODDS_CONNECTOR.md) | Data | Game fields | Mapper only | Medium |
| V2.1-6 | Weather API connector | [ADR-015](./ADR-015-V2_1_6_WEATHER_CONNECTOR.md) | Data | Game fields | Mapper only | Low |
| V2.1-7 | Projection intelligence calibration | [ADR-016](./ADR-016-V2_1_7_PROJECTION_CALIBRATION.md) | Engine | Confidence DTO | Mapper only | Medium |
| V2.1-8 | Multi-lineup exposure management | [ADR-017](./ADR-017-V2_1_8_MULTI_LINEUP_EXPOSURE.md) | Engine | Portfolio DTO | Mapper only | High |
| V2.1-9 | Ownership prediction (baseline) | [ADR-018](./ADR-018-V2_1_9_OWNERSHIP_PREDICTION.md) | Engine | Simulation DTO | Mapper only | Medium |

**Gate:** [V2_1_IMPLEMENTATION_GATE.md](./V2_1_IMPLEMENTATION_GATE.md) · Planning: [V2_1_PLANNING_PACKAGE.md](./V2_1_PLANNING_PACKAGE.md)

---

## Phase V2.2 — Platform expansion

Requires **Amendment 002**.

| ID | Capability | Type | DTO impact | UI impact | Priority |
|----|------------|------|------------|-----------|----------|
| V2.2-1 | Platform abstraction layer | Architecture | Platform enum in DTO | Settings (future) | Gate |
| V2.2-2 | FanDuel Classic connector | Data | Platform-specific slate | Mappers absorb | TBD |
| V2.2-3 | Multi-platform compatibility matrix | Docs | — | — | Gate |
| V2.2-4 | Yahoo Fantasy connector | Data | Platform-specific | Mappers absorb | Deferred |

---

## Phase V2.3 — Sport expansion

Requires **Amendment 003**.

| ID | Capability | Type | DTO impact | UI impact | Priority |
|----|------------|------|------------|-----------|----------|
| V2.3-1 | Sport plugin architecture | Architecture | Sport in run context | Navigation | Gate |
| V2.3-2 | NBA slate support | Feature | Sport-specific engines | All panels | TBD |
| V2.3-3 | Sport-specific roster rules | Engine | Portfolio constraints | Portfolio panels | TBD |
| V2.3-4 | MLB slate support | Feature | Sport-specific engines | All panels | Deferred |
| V2.3-5 | NHL slate support | Feature | Sport-specific engines | All panels | Deferred |

---

## Phase V2.4 — Advanced intelligence & product

Requires **Amendment 004** (charter amendment for workers, real-time, AI surfaces).

| ID | Capability | Type | DTO impact | Depends on | Priority |
|----|------------|------|------------|------------|----------|
| V2.4-1 | Contest intelligence (GPP vs cash) | Feature | Contest metadata DTO | V2.1-3 | High |
| V2.4-2 | Bankroll management | Feature | Bankroll DTO | V2.4-1 | Medium |
| V2.4-3 | Late swap intelligence | Feature | Roster lock DTO | Amendment 004 | Medium |
| V2.4-4 | Advanced ownership / leverage | Engine | Simulation DTO | V2.1-9 | Medium |
| V2.4-5 | Cross-slate portfolio optimization | Engine | Multi-slate DTO | V2.4-2 | Low |
| V2.4-6 | AI coaching & lineup explanations | Feature | Explainability DTO | All V2.1 panels | Medium |
| V2.4-7 | Live injury / line movement alerts | Ops | Notification DTO | Background workers | Low |

---

## Phase V2.5+ — Explicitly unscheduled

| Item | Reason |
|------|--------|
| Mobile native apps | Separate product surface |
| Automated lineup submission | ToS + certification |
| Multi-tenant SaaS | Infrastructure scope |
| Voice interface | Product scope expansion |
| Sportsbook integration | Out of product domain |
| Background polling (general) | Conflicts with manual-run unless amended |

---

## Deferred capability mapping (backlog → phase)

| Backlog item | Assigned phase | Notes |
|--------------|----------------|-------|
| Advanced projection intelligence | V2.1-7 | Within DK NFL Classic |
| Multi-lineup portfolio optimization | V2.1-8 | Extends PIE |
| Ownership prediction | V2.1-9, V2.4-4 | Baseline → advanced |
| Contest intelligence | V2.4-1 | Requires contest model |
| Late swap intelligence | V2.4-3 | Requires Amendment 004 |
| Bankroll management | V2.4-2 | After contest intelligence |
| Simulation engine improvements | V2.1-3 | Full GPP field |
| Multi-sport (NBA, MLB, NHL) | V2.3 | Charter amendment |
| FanDuel / Yahoo | V2.2 | Charter amendment |
| AI coaching | V2.4-6 | Explanations only |
| Cross-slate portfolio | V2.4-5 | Multi-slate scope |
| NFL Showdown / other contest types | V2.5+ | Not scheduled |

---

## Capability approval checklist

Before any capability moves from planning to implementation:

- [ ] Assigned to V2 phase in this document
- [ ] ADR written and accepted
- [ ] DTO/ViewModel impact assessed
- [ ] Migration notes in [V2_MIGRATION_STRATEGY.md](./V2_MIGRATION_STRATEGY.md)
- [ ] Dependency satisfied per [V2_DEPENDENCY_MAP.md](./V2_DEPENDENCY_MAP.md)
- [ ] Independent Opus architecture review for phase
- [ ] [V2_IMPLEMENTATION_GATE.md](./V2_IMPLEMENTATION_GATE.md) open for target phase
- [ ] V1 maintenance line unaffected (separate branch)
