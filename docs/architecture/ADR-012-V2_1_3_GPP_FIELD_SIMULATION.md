# ADR-012 — V2.1-3 Full GPP Field Simulation

**Status:** Accepted (Planning — Phase 2A revised)  
**Date:** 2026-07-19 · **Revised:** 2026-07-19 (Phase 2A — MP-1, MP-4)  
**Capability ID:** V2.1-3  
**Phase:** V2.1 — Intelligence depth  
**Related:** [PORTFOLIO_SIMULATION_ENGINE.md](../PORTFOLIO_SIMULATION_ENGINE.md) · [ADR-009](./ADR-009-PRISMA_MIGRATION_POLICY.md)

---

## Context

V1 Portfolio Simulation Engine runs Monte Carlo iterations per **recommended lineup** but does not simulate against a **full GPP field** — percentile vs field, top-1% rate, and field-relative cash rate are incomplete or placeholder in the Simulation panel.

Backlog item: finish percentile vs field modeling within DK NFL Classic scope.

---

## Decision

Extend the Portfolio Simulation Engine to generate a **synthetic GPP field** and compute lineup percentile rankings against that field.

### Simulation model (V2.1 MVP)

| Parameter | Default | Configurable |
|-----------|---------|--------------|
| Field size | 10,000 lineups | `SIMULATION_FIELD_SIZE` env |
| Iterations per lineup | 10,000 | Existing engine default |
| Field generation | Ownership-weighted random lineups from slate pool | — |

**Ownership source (MP-1):** V2.1-3 MVP uses **projection feed ownership** from connector merge. When missing, use uniform prior across eligible players. [ADR-018](./ADR-018-V2_1_9_OWNERSHIP_PREDICTION.md) upgrades field weighting when implemented later in the V2.1 sequence.
| Output metrics | Percentile vs field, top-1% rate, cash rate (configurable threshold) | Simulation DTO |

### DTO extension

Extend simulation result DTO with optional field-relative metrics:

```text
fieldPercentile: number
topOnePercentRate: number
cashRate: number
fieldSize: number
```

Mappers default missing fields for V1 bundles.

### Schema

**First V2.1 capability requiring [ADR-009](./ADR-009-PRISMA_MIGRATION_POLICY.md):**

- Optional columns on simulation run metadata table (if persisted)
- Migration naming: `*_v2_1_simulation_field_metadata.sql`
- Backup-before-migrate mandatory

### Constraints

- Engine-only extension — Simulation **panel** consumes extended ViewModel via mapper
- No cross-contest or multi-platform field modeling (V2.4 scope)
- Deterministic seed option for certification tests

---

## Consequences

### Positive

- Closes major simulation backlog item
- Foundation for V2.1-9 ownership prediction

### Negative

- Compute cost increases with field size
- First V2.1 schema migration — requires ADR-009 workflow

---

## Implementation gate requirements

- [x] V2.1 implementation gate open
- [x] **ADR-009 pre-work complete:** `db:migrate` scripts in `packages/database/package.json` + migration test (MP-4 — before first schema migration)
- [x] ADR-009 migration workflow executed for first schema change
- [x] Simulation engine unit tests with fixed seed
- [x] Mapper regression tests for extended simulation DTO
- [x] Benchmark gate: document field-size vs runtime for default 10,000 (LP-1)

---

## V1 impact

**None until merge.** V1 simulation retains current per-lineup metrics only.
