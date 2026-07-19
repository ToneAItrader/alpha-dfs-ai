# ADR-017 — V2.1-8 Multi-Lineup Exposure Management

**Status:** Accepted (Planning — Phase 2A revised)  
**Date:** 2026-07-19 · **Revised:** 2026-07-19 (Phase 2A — MP-2)  
**Capability ID:** V2.1-8  
**Phase:** V2.1 — Intelligence depth  
**Related:** [PORTFOLIO_INTELLIGENCE_ENGINE.md](./PORTFOLIO_INTELLIGENCE_ENGINE.md) · [LINEUP_OPTIMIZER.md](../LINEUP_OPTIMIZER.md)

---

## Context

V1 Portfolio Intelligence Engine recommends Primary and Hail Mary lineups with basic exposure indicators. Operators running **multiple lineups** need exposure management across player, team, and stack dimensions — a backlog item mapped to V2.1.

---

## Decision

Extend PIE to compute **multi-lineup exposure metrics** when multiple recommended lineups are present in the analysis bundle.

### Exposure dimensions

| Dimension | Metric |
|-----------|--------|
| Player | Max exposure % across lineups |
| Team | Aggregate team stack exposure |
| Game stack | Correlated player group exposure |
| Salary | Remaining salary flexibility indicator |

### Scope (V2.1 MVP)

- **N = 2 lineups:** Primary + Hail Mary (existing V1 PIE output) — exposure computed across both
- Portfolio Readiness and Portfolio Health panels consume extended ViewModel
- No automated multi-lineup **generation** beyond existing PIE pair (N>2 out of scope for V2.1)

### DTO extension

```text
exposureSummary: {
  playerExposures: { playerId, exposurePct }[]
  teamExposures: { team, exposurePct }[]
  stackExposures: { gameId, exposurePct }[]
  warnings: string[]
}
```

### Constraints

- Mapper-only UI changes — existing portfolio panels
- No lineup submission or export automation
- Amendment 001 unchanged

---

## Consequences

### Positive

- Addresses multi-lineup portfolio optimization backlog
- High operator value within Classic Salary Cap

### Negative

- PIE complexity increase — requires thorough regression testing

---

## Implementation gate requirements

- [x] V2.1 implementation gate open
- [x] PIE unit tests for exposure calculations
- [x] Mapper regression tests for portfolio panels

---

## V1 impact

**None until merge.** V1 single-lineup exposure display unchanged.
