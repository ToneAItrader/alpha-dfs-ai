# ADR-018 — V2.1-9 Ownership Prediction (Baseline)

**Status:** Accepted (Planning — Phase 2A revised) · **Implemented:** 2026-07-19  
**Date:** 2026-07-19  
**Capability ID:** V2.1-9  
**Phase:** V2.1 — Intelligence depth  
**Related:** [PORTFOLIO_SIMULATION_ENGINE.md](../PORTFOLIO_SIMULATION_ENGINE.md) · [ADR-012](./ADR-012-V2_1_3_GPP_FIELD_SIMULATION.md)

---

## Context

V1 uses projection feed ownership estimates when available but lacks a **baseline ownership prediction model** for players without feed data. Ownership drives GPP field simulation (V2.1-3) and leverage analysis. Advanced ownership modeling deferred to V2.4-4.

---

## Decision

Implement a **rule-based ownership prediction baseline** in the simulation pipeline.

### Model (V2.1 MVP)

| Signal | Weight |
|--------|--------|
| Projection feed ownership (if present) | Primary — use directly |
| Salary rank on slate | Higher salary → higher ownership prior |
| Position scarcity | RB/TE premium in Classic |
| Vegas implied total | Higher game total → stack ownership boost |
| Slate intelligence chalk concentration | Scale field ownership distribution |

### Output

Per-player predicted ownership % used by:

- GPP field generator (ADR-012)
- Simulation panel leverage indicators
- Portfolio Health ownership profile

### DTO extension

```text
predictedOwnership?: number
ownershipSource?: 'feed' | 'predicted' | 'blended'
```

### Dependencies

- **Requires V2.1-3** (GPP field simulation) for full integration
- Benefits from V2.1-5 (Vegas) and V2.1-1 (slate intelligence) — degrades without them

### Constraints

- Baseline rules only — no ML training (V2.4-4 advanced ownership)
- Deterministic with fixed seed for tests

---

## Consequences

### Positive

- Unblocks realistic GPP field simulation
- Foundation for V2.4-4 advanced ownership

### Negative

- Prediction accuracy limited without historical ownership data store

---

## Implementation gate requirements

- [x] V2.1 implementation gate open
- [x] V2.1-3 implemented first
- [x] Unit tests with fixture slate
- [x] Simulation integration test validates ownership in field path

---

## V1 impact

**None until merge.** V1 uses projection feed ownership only.
