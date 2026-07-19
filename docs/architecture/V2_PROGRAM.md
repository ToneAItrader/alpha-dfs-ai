# Version 2 Program

**Status:** V2.0 complete — V2.1 implementation authorized  
**Date:** 2026-07-19  
**Parent ADR:** [ADR-003-V2_PLANNING_KICKOFF.md](./ADR-003-V2_PLANNING_KICKOFF.md)

---

## Objective

Define Version 2 architecture, capabilities, sequencing, and migration path while Version 1 remains feature-frozen and production-supported.

---

## Planning documents

| # | Document | Status |
|---|----------|--------|
| — | [V2_PLANNING_GOVERNANCE.md](./V2_PLANNING_GOVERNANCE.md) | Active |
| — | [DUAL_TRACK_WORKFLOW.md](../operations/DUAL_TRACK_WORKFLOW.md) | Active |
| — | [MODEL_ASSIGNMENT.md](../operations/MODEL_ASSIGNMENT.md) | Active |
| — | [TASK_3_PLANNING_PACKAGE.md](./TASK_3_PLANNING_PACKAGE.md) | **Task 3 — planning package complete** |
| — | [V2_FOUNDATION_COMPLETION_RECORD.md](./V2_FOUNDATION_COMPLETION_RECORD.md) | **V2.0 Foundation completion record** |
| — | [V2_1_PLANNING_PACKAGE.md](./V2_1_PLANNING_PACKAGE.md) | **V2.1 planning package — complete** |
| — | [V2_1_IMPLEMENTATION_GATE.md](./V2_1_IMPLEMENTATION_GATE.md) | **V2.1 gate — OPEN (V2-CC-002)** |
| — | [V2_IMPLEMENTATION_GATE.md](./V2_IMPLEMENTATION_GATE.md) | V2.0 gate (Foundation complete) |
| 1 | [V2_ROADMAP.md](./V2_ROADMAP.md) | Complete |
| 2 | [V2_ARCHITECTURE_OVERVIEW.md](./V2_ARCHITECTURE_OVERVIEW.md) | Complete |
| 3 | [ADR-003-V2_PLANNING_KICKOFF.md](./ADR-003-V2_PLANNING_KICKOFF.md) | Accepted |
| 4 | [V2_CAPABILITY_BREAKDOWN.md](./V2_CAPABILITY_BREAKDOWN.md) | Complete |
| 5 | [V2_MIGRATION_STRATEGY.md](./V2_MIGRATION_STRATEGY.md) | Complete (Phase 2A synced) |
| 6 | [V2_RISK_ASSESSMENT.md](./V2_RISK_ASSESSMENT.md) | Complete |

Future ADRs will be added per capability during planning review — not during V1 maintenance.

---

## Relationship to Version 1

```text
Version 1 (frozen)          Version 2 (planning)
─────────────────          ────────────────────
Production line      ←───  Architecture & ADRs
Maintenance only            Implementation (later)
RC baseline                 Charter amendment if scope expands
```

---

## Out of scope (this phase)

- Writing Version 2 application code
- Modifying V1 DTOs, ViewModels, or Presentation
- Lifting Amendment 001 without explicit charter amendment

---

## Next planning steps

1. ~~Review V2 roadmap and capability breakdown~~ ✅
2. ~~Independent architecture review (Opus) of V2 documents~~ ✅
3. ~~Prioritize Phase V2.1 capabilities~~ ✅
4. ~~Author V2.1 capability ADRs (ADR-010–018)~~ ✅
6. ~~Opus ADR package review (V2.1)~~ ✅
7. ~~V2.1 implementation gate open decision~~ ✅ V2-CC-002
8. **V2.1 implementation (Composer 2.5)** — V2.1-2 first ← current
