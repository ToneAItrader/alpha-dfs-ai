# V2.1 Planning Package — Intelligence Depth

**Status:** ✅ Complete — gate open (V2-CC-002)  
**Review:** [V2_1_ADR_PACKAGE_REVIEW.md](../reviews/V2_1_ADR_PACKAGE_REVIEW.md) · Phase 2A applied  
**Date:** 2026-07-19  
**Phase:** V2.1 — Intelligence depth  
**Baseline:** [V2_FOUNDATION_COMPLETION_RECORD.md](./V2_FOUNDATION_COMPLETION_RECORD.md)  
**Gate:** [V2_1_IMPLEMENTATION_GATE.md](./V2_1_IMPLEMENTATION_GATE.md)

---

## Objective

Define the governance package for V2.1 — Intelligence depth — extending Alpha DFS AI within Amendment 001 scope (DraftKings · NFL · Classic Salary Cap) without destabilizing the V2.0 Foundation baseline or V1 maintenance line.

**Planning only.** No production code authorized.

---

## Capability list

| ID | Capability | ADR | Type | DTO | UI | Priority |
|----|------------|-----|------|-----|-----|----------|
| V2.1-1 | Slate Intelligence live integration | [ADR-010](./ADR-010-V2_1_1_SLATE_INTELLIGENCE.md) | Feature | Extend slate DTO | Mapper only | High |
| V2.1-2 | Header pipeline status wiring | [ADR-011](./ADR-011-V2_1_2_HEADER_PIPELINE_STATUS.md) | UX | None | Header/status | Medium |
| V2.1-3 | Full GPP field simulation | [ADR-012](./ADR-012-V2_1_3_GPP_FIELD_SIMULATION.md) | Engine | Extend simulation DTO | Mapper only | High |
| V2.1-4 | NFL injury API connector | [ADR-013](./ADR-013-V2_1_4_INJURY_CONNECTOR.md) | Data | Player fields | Mapper only | Medium |
| V2.1-5 | Vegas odds connector | [ADR-014](./ADR-014-V2_1_5_VEGAS_ODDS_CONNECTOR.md) | Data | Game fields | Mapper only | Medium |
| V2.1-6 | Weather API connector | [ADR-015](./ADR-015-V2_1_6_WEATHER_CONNECTOR.md) | Data | Game fields | Mapper only | Low |
| V2.1-7 | Projection intelligence calibration | [ADR-016](./ADR-016-V2_1_7_PROJECTION_CALIBRATION.md) | Engine | Confidence DTO | Mapper only | Medium |
| V2.1-8 | Multi-lineup exposure management | [ADR-017](./ADR-017-V2_1_8_MULTI_LINEUP_EXPOSURE.md) | Engine | Portfolio DTO | Mapper only | High |
| V2.1-9 | Ownership prediction (baseline) | [ADR-018](./ADR-018-V2_1_9_OWNERSHIP_PREDICTION.md) | Engine | Simulation DTO | Mapper only | Medium |

---

## ADR package index

| ADR | Capability | Schema change |
|-----|------------|---------------|
| [ADR-010](./ADR-010-V2_1_1_SLATE_INTELLIGENCE.md) | V2.1-1 | No (optional DTO fields) |
| [ADR-011](./ADR-011-V2_1_2_HEADER_PIPELINE_STATUS.md) | V2.1-2 | No |
| [ADR-012](./ADR-012-V2_1_3_GPP_FIELD_SIMULATION.md) | V2.1-3 | **Yes** — first ADR-009 migration |
| [ADR-013](./ADR-013-V2_1_4_INJURY_CONNECTOR.md) | V2.1-4 | No |
| [ADR-014](./ADR-014-V2_1_5_VEGAS_ODDS_CONNECTOR.md) | V2.1-5 | No |
| [ADR-015](./ADR-015-V2_1_6_WEATHER_CONNECTOR.md) | V2.1-6 | No |
| [ADR-016](./ADR-016-V2_1_7_PROJECTION_CALIBRATION.md) | V2.1-7 | Optional |
| [ADR-017](./ADR-017-V2_1_8_MULTI_LINEUP_EXPOSURE.md) | V2.1-8 | No |
| [ADR-018](./ADR-018-V2_1_9_OWNERSHIP_PREDICTION.md) | V2.1-9 | No |

Cross-cutting: [ADR-009 — Prisma Migration Policy](./ADR-009-PRISMA_MIGRATION_POLICY.md)

---

## Dependency map (V2.1)

```text
V2.0 Foundation (baseline)
        │
        ├── V2.1-2 Header status (no deps)
        ├── V2.1-1 Slate Intelligence UI ← engine exists
        ├── V2.1-4 Injury connector ──┐
        ├── V2.1-5 Vegas connector ───┼── enrich pipeline inputs
        ├── V2.1-6 Weather connector ─┘
        │
        ├── V2.1-3 GPP simulation ← ADR-009 migration
        │       │
        │       └── V2.1-9 Ownership prediction
        │
        ├── V2.1-7 Calibration ← benefits from V2.1-4/5
        └── V2.1-8 Multi-lineup exposure ← PIE extension
```

Detail: [V2_DEPENDENCY_MAP.md](./V2_DEPENDENCY_MAP.md)

---

## Recommended implementation order

```text
V2.1-2 → V2.1-1 → V2.1-4 → V2.1-5 → V2.1-6 → V2.1-3 → V2.1-7 → V2.1-8 → V2.1-9
```

Lowest risk and no-schema capabilities first; first migration at V2.1-3; ownership last (depends on simulation).

---

## Technical assumptions

| Assumption | Constraint |
|------------|------------|
| Amendment 001 scope | DK · NFL · Classic only |
| Presentation contract | DTO → Mapper → ViewModel → Presentation frozen |
| Schema changes | ADR-009 workflow mandatory |
| Provider licensing | Operator responsibility for live feeds |
| Manual-run model | No background workers |
| V1 maintenance | Separate branch until merge decision |
| Deterministic engines | No AI/ML in V2.1 MVP |

---

## Gate criteria summary

### Entry (before implementation)

- V2.0 Foundation complete ✅
- ADR-010–018 drafted ✅
- Opus ADR package review ⏸ Pending
- Change control V2-CC-002 ⏸ Pending

### Exit (V2.1 complete)

- All nine capabilities implemented and certified
- Mapper regression + E2E pass
- ADR-009 migration workflow validated
- V2.1 completion record published

Full criteria: [V2_1_IMPLEMENTATION_GATE.md](./V2_1_IMPLEMENTATION_GATE.md)

---

## V1 compatibility

| Area | V2.1 policy |
|------|-------------|
| Default behavior | V1 unchanged on `main` until merge |
| DTO extensions | Additive optional fields only |
| API routes | Additive only — no breaking changes |
| Connectors | New providers opt-in via env |
| Certification | V1 `npm run certify` unchanged |

---

## Planning deliverables checklist

- [x] V2.1 capability list
- [x] ADR package (ADR-010–018)
- [x] Dependency map update
- [x] Gate entry/exit criteria ([V2_1_IMPLEMENTATION_GATE.md](./V2_1_IMPLEMENTATION_GATE.md))
- [x] Roadmap update ([V2_ROADMAP.md](./V2_ROADMAP.md))
- [x] Governance update ([V2_PLANNING_GOVERNANCE.md](./V2_PLANNING_GOVERNANCE.md))
- [x] Architecture index update ([ARCHITECTURE_INDEX.md](./ARCHITECTURE_INDEX.md))
- [x] Opus ADR package review — [V2_1_ADR_PACKAGE_REVIEW.md](../reviews/V2_1_ADR_PACKAGE_REVIEW.md) (Approve with revisions)
- [x] Phase 2A documentation revisions (CF-1, HP-1–HP-4)
- [x] V2-CC-002 recorded — gate open

---

## Exactly one next action

**V2.1-2 — Header pipeline status (Composer 2.5):** First authorized capability per [V2_1_IMPLEMENTATION_GATE.md](./V2_1_IMPLEMENTATION_GATE.md).
