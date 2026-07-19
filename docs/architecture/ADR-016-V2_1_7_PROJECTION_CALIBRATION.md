# ADR-016 — V2.1-7 Projection Intelligence Calibration

**Status:** Accepted (Planning — Phase 2A revised) · **Implemented:** 2026-07-19  
**Date:** 2026-07-19 · **Revised:** 2026-07-19 (Phase 2A — HP-2, MP-3)  
**Capability ID:** V2.1-7  
**Phase:** V2.1 — Intelligence depth  
**Related:** [PREDICTION_CONFIDENCE_ENGINE.md](../PREDICTION_CONFIDENCE_ENGINE.md) · [SCORING_ENGINE.md](../SCORING_ENGINE.md)

---

## Context

V1 uses projection feed values directly in scoring and PCE without **calibration** — adjusting projections for slate context and provider-specific signals. Backlog item: advanced projection intelligence within DK NFL Classic.

---

## Decision

Add a **pre-score Projection Calibration** step between connector merge and Scoring Engine — deterministic, no AI.

### Pipeline position (HP-2 — same-run prohibition)

```text
Connector merge → Projection Calibration → Scoring Engine → PCE → ...
```

**Explicit prohibition:** Calibration **must not** consume same-run PCE output. PCE executes **after** scoring; calibration inputs are limited to:

| Input | Source | Same-run? |
|-------|--------|-----------|
| Raw projection, floor, ceiling | Projection feed (connector merge) | ✅ |
| Injury overlay | Player merge fields (V2.1-4) | ✅ |
| Vegas implied environment | Game metadata (V2.1-5) | ✅ |
| Position/salary variance bucket | **Static rules** or configured lookup table | ✅ |
| PCE variance rating | PCE engine | ❌ **Forbidden same-run** |

V2.1 MVP uses **pre-score rules only**. Future cross-run calibration (using prior analysis PCE) requires a separate ADR amendment.

### Calibration model (V2.1 MVP)

| Input | Adjustment |
|-------|------------|
| Raw projection | Base value from projection feed |
| Injury overlay | Downweight if injury status uncertain (requires V2.1-4) |
| Vegas implied environment | Scale ceiling/floor for high-total games (requires V2.1-5) |
| Position variance bucket | Static floor/ceiling spread by position (QB/RB/WR/TE/DST) |

### Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `PROJECTION_CALIBRATION_ENABLED` | `false` | Feature flag — V1 path when unset/false |

When disabled, scoring receives unmodified projection feed values (V1 behavior).

### DTO impact

Extend confidence/projection DTO with optional calibrated fields:

```text
calibratedProjection?: number
calibrationFactor?: number
calibrationNotes?: string[]
```

Presentation unchanged — Confidence panel via mapper.

### Schema

Optional metadata columns per [ADR-009](./ADR-009-PRISMA_MIGRATION_POLICY.md) if calibration audit trail persisted.

### Constraints

- Deterministic — same inputs produce same outputs
- Degrades gracefully when provider data missing
- No ML model training in V2.1 MVP (rule-based calibration only)

---

## Consequences

### Positive

- Improves decision quality without new UI surfaces
- Builds on V2.1-4/5 provider data when available
- HP-2 resolved — no circular PCE dependency

### Negative

- Calibration rules require tuning with operational data

---

## Implementation gate requirements

- [x] V2.1 implementation gate open
- [x] Unit tests with fixture projections
- [x] Regression: path identical to V1 when `PROJECTION_CALIBRATION_ENABLED=false`
- [x] Test asserting calibration does not read same-run PCE output

---

## V1 impact

**None until merge.** Default `PROJECTION_CALIBRATION_ENABLED=false` preserves V1 projection path.
