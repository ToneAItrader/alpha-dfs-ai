# Phase 1.5 — Architecture Enhancements (Pre-Implementation)

**Status:** Complete — Architecture Freeze v1.0 **APPROVED** (Amendment 001)  
**Version:** 1.1  
**Date:** 2026-07-18  
**Parent:** [PROJECT_CHARTER.md](../PROJECT_CHARTER.md) · [AMENDMENT_001_SCOPE_LOCK.md](./architecture/AMENDMENT_001_SCOPE_LOCK.md)

> Advanced decision intelligence enhancements required **before frontend implementation**.  
> Task 10 authorized under Amendment 001 scope lock.

---

## Objective

Expand Alpha DFS AI architecture with prediction confidence, slate-level intelligence, dynamic portfolio strategy, player evidence reports, portfolio simulation, and portfolio health — improving recommendation quality, explainability, and portfolio evaluation.

---

## Enhanced execution flow

```text
Analyze Slate
      ↓
Download Data
      ↓
Slate Intelligence Agent          ← Task 9.2 (slate-wide context first)
      ↓
Intelligence Agents
      ↓
Evidence Engine
      ↓
Scoring Engine
      ↓
Prediction Confidence Engine    ← Task 9.1
      ↓
Portfolio Intelligence Engine   ← Task 9.3 dynamic strategy
      ↓
Portfolio Simulation Engine     ← Task 9.5
      ↓
Reports (+ Portfolio Health)    ← Task 9.6
      ↓
Stop
```

**Unchanged:** Manual trigger only · No background workers · Returns to IDLE

---

## Task index (Phase 1.5)

| Task | Name | Model | Deliverable | Status |
|------|------|-------|-------------|--------|
| 9.1 | Prediction Confidence Engine | GPT-5.5 | [PREDICTION_CONFIDENCE_ENGINE.md](./PREDICTION_CONFIDENCE_ENGINE.md) | Complete |
| 9.2 | Slate Intelligence Agent | GPT-5.5 | [AGENTS.md](./AGENTS.md) · [SLATE_INTELLIGENCE.md](./architecture/SLATE_INTELLIGENCE.md) | Complete |
| 9.3 | Dynamic Portfolio Strategy | GPT-5.5 | [PORTFOLIO_INTELLIGENCE_ENGINE.md](./architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md) | Complete |
| 9.4 | Player Evidence Report | GPT-5.5 | [EVIDENCE_ENGINE.md](./EVIDENCE_ENGINE.md) | Complete |
| 9.5 | Portfolio Simulation Engine | GPT-5.5 | [PORTFOLIO_SIMULATION_ENGINE.md](./PORTFOLIO_SIMULATION_ENGINE.md) | Complete |
| 9.6 | Portfolio Health Dashboard | GPT-5.5 design | [PORTFOLIO_INTELLIGENCE_ENGINE.md](./architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md) | Complete |
| 9.7 | Optimizer Performance Agent | GPT-5.5 | [AGENTS.md](./AGENTS.md) | Complete |

**Documentation sweep:** ARCHITECTURE · PROJECT_CHARTER · AGENTS · SCORING_ENGINE · PIE · DATA_MODEL · EVIDENCE_ENGINE · VISION — updated

---

## Task 9.1 — Prediction Confidence Engine (PCE)

**Model:** GPT-5.5

Evaluate confidence and stability of every player projection and recommended lineup.

**Evaluates:** Data completeness · Injury uncertainty · Projection variance · Statistical/expert agreement · Community consistency · Market alignment · Historical accuracy · Weather certainty

**Outputs (player + lineup):** Confidence Score (0–100) · Prediction Stability · Data Quality Score · Variance Rating · Reliability Grade

**Used by:** PIE for lineup ranking · Simulation Engine · Portfolio Health

**Doc:** [PREDICTION_CONFIDENCE_ENGINE.md](./PREDICTION_CONFIDENCE_ENGINE.md)

---

## Task 9.2 — Slate Intelligence Agent

**Model:** GPT-5.5

Analyze entire slate **before** player evaluation to determine optimization strategy.

**Evaluates:** Slate volatility · Injury landscape · Weather · Ownership concentration · Value distribution · Viable stacks · Scoring environment

**Outputs:** Slate Grade · Volatility Score · Recommended Strategy · Confidence Rating

**Influences:** Dynamic Portfolio Strategy (9.3) · PIE parameters

**Doc:** [SLATE_INTELLIGENCE.md](./architecture/SLATE_INTELLIGENCE.md)

---

## Task 9.3 — Dynamic Portfolio Strategy

**Model:** GPT-5.5

PIE adapts optimization based on slate characteristics.

**Determines:** Primary vs Hail Mary emphasis · Exposure limits · Stack aggressiveness · Ownership tolerance · Risk profile

**Fixed outputs:** Still 3–5 Primary + 2–3 Hail Mary lineups — optimization **approach** adapts, not count.

**Doc:** [PORTFOLIO_INTELLIGENCE_ENGINE.md](./architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md) — Dynamic Strategy section

---

## Task 9.4 — Player Evidence Report

**Model:** GPT-5.5 (design) · Composer 2.5 (UI Task 10)

Explainable evidence profile per recommended player:

Projection · Confidence · Value · Opportunity · Matchup · Rookie (if applicable) · Expert Consensus · Community Sentiment · Market Confidence · Ownership · Supporting rationale

**Doc:** [EVIDENCE_ENGINE.md](./EVIDENCE_ENGINE.md) — Player Evidence Report section

---

## Task 9.5 — Portfolio Simulation Engine

**Model:** GPT-5.5 (methodology) · Composer 2.5 (implementation)

Simulate repeated outcomes for each lineup under plausible scenarios.

**Estimates:** Median points · High-percentile outcomes · Ceiling · Floor · Cash rate · Tournament upside · Relative portfolio strength

**Outputs:** Simulation Summary · Risk Metrics · Upside Metrics · Stability Metrics

**Doc:** [PORTFOLIO_SIMULATION_ENGINE.md](./PORTFOLIO_SIMULATION_ENGINE.md)

---

## Task 9.6 — Portfolio Health Dashboard

**Model:** GPT-5.5 (design) · Composer 2.5 (UI Task 10)

Portfolio-level summary:

Portfolio Grade · Overall Risk · Overall Confidence · Exposure Balance · Stack Diversity · Salary Distribution · Leverage Distribution

**Doc:** [PORTFOLIO_INTELLIGENCE_ENGINE.md](./architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md) — Portfolio Health section

---

## Task 9.7 — Optimizer Performance Agent

**Model:** GPT-5.5

Track long-term PIE performance. **Must not auto-change scoring weights** — governed approval only.

**Measures:** Projection accuracy · Lineup performance · Primary/Hail Mary success · Stack performance · Rookie accuracy · Expert/community/market contribution

**Doc:** [AGENTS.md](./AGENTS.md) — Agent 19

---

## Architecture Freeze v1.0

**Gate:** Once Phase 1 (Tasks 1–9) **and** Phase 1.5 (Tasks 9.1–9.7) are **approved**, architecture is **frozen**.

| Rule | Detail |
|------|--------|
| Frozen | Pipeline, agents, engines, data model, scoring dimensions, PIE structure |
| Allowed during implementation | Bug fixes · clarifications · test fixtures |
| New features | Backlog — require charter amendment |
| Critical fixes | Class A only — document in change log |

**Purpose:** Prevent scope creep during Tasks 10–15. Cursor builds against stable specification using [CURSOR_IMPLEMENTATION_PROTOCOL.md](./CURSOR_IMPLEMENTATION_PROTOCOL.md).

**Approval required:** Architecture Freeze v1.0 approved. Each subtask requires protocol completion report + approval before next subtask.

---

## Frontend impact (Task 10)

**Directive:** [TASK_10_FRONTEND_DIRECTIVE.md](./TASK_10_FRONTEND_DIRECTIVE.md)  
**Model:** Composer 2.5 (10.1–10.11)

| Component | Directive task | Source task |
|-----------|----------------|-------------|
| Portfolio Readiness | 10.4 | 9.1 PCE |
| Slate Intelligence Panel | 10.3 | 9.2 |
| Player Evidence Viewer | 10.6 | 9.4 |
| Portfolio Health Dashboard | 10.7 | 9.6 |
| Simulation Results Viewer | 10.8 | 9.5 |
| Confidence Indicators | 10.9 | 9.1 |
| Recommended Portfolio | 10.5 | PIE / FR-16–19 |

---

## Testing updates (Task 12)

**Model:** Composer 2.5

Validate: PCE calculations · Slate Intelligence outputs · Dynamic strategy selection · Simulation consistency · Player Evidence generation · Portfolio Health calculations · Explainability completeness

---

## Architecture review (Task 13)

**Model:** Claude Opus 4.1

Review: PCE · Slate Intelligence · PIE · Portfolio Simulation · Explainability pipeline

---

## Model assignment (Phase 1.5)

| Task | Model |
|------|-------|
| PCE · Slate Intelligence · Dynamic Strategy · Evidence Report design · Simulation methodology · Optimizer Performance · Documentation | **GPT-5.5** |
| UI · Backend · Testing implementation | **Composer 2.5** |
| Architecture review | **Claude Opus 4.1** |

---

## Gate sequence

```text
Phase 1 (Tasks 1–9 + 5.3 + 5.4) → Phase 1.5 (Tasks 9.1–9.7) →
Amendment 001 Scope Lock → Architecture Freeze v1.0 APPROVED → Task 10 Frontend → ...
```

**Current status:** Phase 1.5 complete. Amendment 001 approved. Task 10 authorized.

---

## Related documents

- [PROJECT_CHARTER.md](../PROJECT_CHARTER.md)
- [BACKLOG.md](./BACKLOG.md)
- [architecture/AMENDMENT_001_SCOPE_LOCK.md](./architecture/AMENDMENT_001_SCOPE_LOCK.md)
- [docs/architecture/ARCHITECTURE_INDEX.md](./architecture/ARCHITECTURE_INDEX.md)
