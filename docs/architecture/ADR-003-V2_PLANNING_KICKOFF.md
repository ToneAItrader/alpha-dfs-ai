# ADR-003 — Version 2 Planning Kickoff

**Status:** Accepted (Planning only — no implementation)  
**Date:** 2026-07-18  
**Supersedes:** Linear Task 11.x sequence for new capability work

---

## Context

Tasks 11.1–11.9 and Release Candidate validation established a stable Version 1 platform:

- Real engine pipeline with live provider integration
- Observability, deployment automation, backup/rollback
- Frozen DTO → Mapper → ViewModel → Presentation architecture
- RC approval with conditions ([RC_VALIDATION_REPORT.md](../operations/RC_VALIDATION_REPORT.md))

Continuing a linear Task 11.10+ sequence would blur maintenance and innovation. Production stability requires separation.

---

## Decision

Split development into two workstreams:

### Workstream A — Version 1 Maintenance

Feature-frozen. Bug fixes, ops tooling, docs, and regression tests only. Governed by [V1_MAINTENANCE_GOVERNANCE.md](../operations/V1_MAINTENANCE_GOVERNANCE.md).

### Workstream B — Version 2 Planning

Architecture and roadmap only until independent review approves implementation. No V2 code on the V1 production line until gate passes.

---

## Version 2 planning deliverables

| Deliverable | Document |
|-------------|----------|
| Roadmap | [V2_ROADMAP.md](./V2_ROADMAP.md) |
| Architecture overview | [V2_ARCHITECTURE_OVERVIEW.md](./V2_ARCHITECTURE_OVERVIEW.md) |
| Capability breakdown | [V2_CAPABILITY_BREAKDOWN.md](./V2_CAPABILITY_BREAKDOWN.md) |
| Migration strategy | [V2_MIGRATION_STRATEGY.md](./V2_MIGRATION_STRATEGY.md) |
| Risk assessment | [V2_RISK_ASSESSMENT.md](./V2_RISK_ASSESSMENT.md) |
| Backlog source | [BACKLOG.md](../BACKLOG.md) |

---

## Consequences

- V1 RC remains the production baseline; maintenance changes require change-request template
- V2 work begins with architecture review (Opus), not implementation
- Amendment 001 scope lock remains until V2 charter amendment explicitly lifts it
- Deferred V1 items (Slate Intelligence UI integration, E2E browser tests, external APM) evaluated for V2 vs V1 maintenance

---

## Implementation gate (V2)

V2 implementation may begin only when:

1. V2 architecture documents reviewed and approved
2. Charter amendment for scope expansion (if required)
3. Migration strategy signed off
4. V1 production deployment stable (or explicitly parallel track agreed)
