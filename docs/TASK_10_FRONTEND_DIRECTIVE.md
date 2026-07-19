# Task 10 — Frontend Implementation Directive (v1.0)

**Status:** AUTHORIZED  
**Version:** 1.0  
**Date:** 2026-07-18  
**Parent:** [PROJECT_CHARTER.md](../PROJECT_CHARTER.md) · [CURSOR_IMPLEMENTATION_PROTOCOL.md](./CURSOR_IMPLEMENTATION_PROTOCOL.md) · [AMENDMENT_001_SCOPE_LOCK.md](./architecture/AMENDMENT_001_SCOPE_LOCK.md)

> **Implementation principle:** Implement the frontend exactly as defined in the approved architecture. Treat the architecture as frozen. Do not introduce new features, abstractions, or business logic into the frontend. The frontend's responsibility is to present data produced by the backend services, maintain a responsive and accessible user experience, and remain aligned with the Version 1 scope: DraftKings NFL Classic only.

**Execution:** Each subtask (10.1–10.13) follows [CURSOR_IMPLEMENTATION_PROTOCOL.md](./CURSOR_IMPLEMENTATION_PROTOCOL.md) — one subtask at a time; stop and wait for approval between subtasks unless explicitly batched.

---

## Authorization

Architecture Freeze v1.0 has been approved.

Amendment 001 has been approved.

Version 1 scope is locked. Implementation shall remain within:

```text
Platform = DraftKings
Sport = NFL
Contest = Classic Salary Cap
```

**No additional features may be introduced during Task 10.**

---

## Task index

| Task | Name | Model | Status | Deliverable |
|------|------|-------|--------|-------------|
| 10.1 | Application Shell | Composer 2.5 | **Complete** | [Review](./reviews/TASK_10_1_INDEPENDENT_REVIEW.md) · 11 tests · build pass |
| 10.2 | Dashboard | Composer 2.5 | **Complete** | Display-only dashboard |
| 10.3 | Slate Intelligence Panel | Composer 2.5 | **Complete** | 8 sections · placeholder data |
| 10.4 | Portfolio Readiness | Composer 2.5 | **Complete** | `PortfolioReadinessViewModel` |
| 10.5 | Recommended Portfolio | Composer 2.5 | **Complete** | `RecommendedPortfolioViewModel` |
| 10.6 | Player Evidence Viewer | Composer 2.5 | **Complete** | `PlayerEvidenceViewModel` |
| 10.7 | Portfolio Health Dashboard | Composer 2.5 | **Complete** | `PortfolioHealthViewModel` |
| 10.8 | Simulation Results | Composer 2.5 | **Complete** | `SimulationResultsViewModel` |
| 10.9 | Confidence Indicators | Composer 2.5 | **Complete** | Shared PCE components + `ConfidenceIndicatorsViewModel` |
| 10.10 | UI Integration | Composer 2.5 | **Complete** | Mapper layer + backend providers |
| 10.11 | Frontend Testing & Validation | Composer 2.5 | **Certified** | 97 tests |
| 10.12 | UX & Architecture Review | Claude Opus 4.1 | **Complete** | [Review](./reviews/TASK_10_12_UX_ARCHITECTURE_REVIEW.md) |
| 10.13 | Documentation & Release Readiness | GPT-5.5 | **Complete** | [Release Readiness](./FRONTEND_RELEASE_READINESS.md) |

**Task 10 status:** **COMPLETE** — Frontend release ready for Task 11.

**Sequence:** 10.1 → 10.2 → … → 10.11 → 10.12 → 10.13. Do not skip ahead.

---

## Implementation order

### Task 10.1 — Application Shell

**Model:** Composer 2.5 — React, Next.js, routing, and UI scaffolding

**Objective:** Create the application foundation.

**Include:**

- Global layout
- Navigation
- Sidebar
- Header
- Routing
- Theme
- Responsive grid
- Loading states
- Error states

**Deliverable:** Application shell that all remaining pages inherit.

**Status:** **Complete** (2026-07-18)  
**Review:** [TASK_10_1_INDEPENDENT_REVIEW.md](./reviews/TASK_10_1_INDEPENDENT_REVIEW.md)  
**Tests:** 11 passing · **Build:** pass

---

### Task 10.2 — Dashboard

**Model:** Composer 2.5 · **Status:** Complete

---

### Task 10.3 — Slate Intelligence Panel

**Model:** Composer 2.5 · **Status:** Complete (pending review)  
**Source:** [SLATE_INTELLIGENCE.md](./architecture/SLATE_INTELLIGENCE.md) · Task 9.2

**Objective:** Display results from the Slate Intelligence Agent (placeholder data only).

**Sections:** Slate Summary · Slate Grade · Recommended Strategy · Injury Overview · Weather Summary · Ownership Outlook · Featured Games · Intelligence Summary

---

### Task 10.4 — Portfolio Readiness

**Model:** Composer 2.5 · **Status:** Complete (pending review)  
**Source:** [PREDICTION_CONFIDENCE_ENGINE.md](./PREDICTION_CONFIDENCE_ENGINE.md) · Task 9.1

**Objective:** Display readiness metrics via `PortfolioReadinessViewModel` (placeholder data).

**Sections:** Readiness Score · Prediction Confidence · Data Quality · Portfolio Health Snapshot · Checklist · Summary

---

### Task 10.5 — Recommended Portfolio

**Model:** Composer 2.5 · **Status:** Complete (pending review)  
**Source:** [PORTFOLIO_INTELLIGENCE_ENGINE.md](./architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md) · FR-16–19

**Objective:** Display PIE portfolios via `RecommendedPortfolioViewModel` (placeholder data).

**Sections:** Overview · Primary (3–5) · Hail Mary (2–3) · Summary · Explainability · Metadata

**Constraint:** UI displays PIE output only — no manual lineup construction.

---

### Task 10.6 — Player Evidence Viewer

**Model:** Composer 2.5 · **Status:** Complete (pending review)  
**Source:** [EVIDENCE_ENGINE.md](./EVIDENCE_ENGINE.md) · Task 9.4

**Objective:** Display player evidence via `PlayerEvidenceViewModel` (placeholder data).

**Sections:** Overview · Player Cards · Evidence Sources · Confidence Summary · Explainability · Metadata

---

### Task 10.7 — Portfolio Health Dashboard

**Model:** Composer 2.5 · **Status:** Complete (pending review)  
**Source:** [PORTFOLIO_INTELLIGENCE_ENGINE.md](./architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md) · Task 9.6

**Objective:** Display portfolio quality via `PortfolioHealthViewModel` (placeholder data).

**Sections:** Overview · Exposure Balance · Stack Diversity · Ownership Distribution · Salary Distribution · Risk Profile · Health Recommendations · Analysis Metadata

**Constraint:** UI displays PIE output only — no health scoring, exposure, ownership, or risk calculations.

---

### Task 10.8 — Simulation Results

**Model:** Composer 2.5 · **Status:** Complete (pending review)  
**Source:** [PORTFOLIO_SIMULATION_ENGINE.md](./PORTFOLIO_SIMULATION_ENGINE.md) · Task 9.5

**Objective:** Display simulation output via `SimulationResultsViewModel` (placeholder data).

**Sections:** Overview · Projection Summary · Probability Summary · Outcome Distribution · Simulation Insights · Analysis Metadata

**Constraint:** UI displays Portfolio Simulation Engine output only — no simulations, probability calculations, or statistical analysis.

---

### Task 10.9 — Confidence Indicators

**Model:** Composer 2.5 · **Status:** Complete (pending review)  
**Source:** [PREDICTION_CONFIDENCE_ENGINE.md](./PREDICTION_CONFIDENCE_ENGINE.md) · Task 9.1

**Objective:** Shared PCE presentation layer via `ConfidenceIndicatorsViewModel` and reusable components.

**Sections:** Overview · Prediction Stability · Data Quality · Model Agreement · Confidence Insights · Analysis Metadata

**Shared components:** `ConfidenceBadge` · `ConfidenceCard` · `ConfidenceMetric` · `ConfidenceSummary`

**Demo page:** `/confidence` — showcase and validation surface for shared components.

**Constraint:** UI displays PCE output only — no confidence calculations, evidence aggregation, or scoring.

---

### Task 10.10 — UI Integration

**Model:** Composer 2.5 · **Status:** Complete (pending review)

**Objective:** Replace placeholder providers with backend-backed providers via mapper layer.

**Architecture:** Backend DTO → Mapper → ViewModel → Presentation Components

**Mappers:** Confidence · Player Evidence · Portfolio Health · Simulation Results · Recommended Portfolio · Portfolio Readiness · Dashboard

**Provider:** `getAnalysisProvider()` — fetches stub backend DTOs until Task 11 packages ship

**API routes:** `POST /api/pipeline/analyze` · `GET /api/pipeline/status`

**Shared confidence:** Embedded across Portfolio Readiness, Player Evidence, Recommended Portfolio, Portfolio Health, Simulation Results

**Rule:** The frontend displays data only — **never calculates business logic.**

---

### Task 10.11 — Frontend Testing & Validation

**Model:** Composer 2.5 · **Status:** Complete (pending review)

**Objective:** Certify DTO → Mapper → ViewModel → Presentation architecture before Task 11 backend.

**Validated:** All 7 mappers (edge cases) · integrated pages · shared confidence components · API routes · loading/error states · presentation boundary · responsive smoke · regression suite (97 tests)

**A11y fix:** `LoadingSpinner` — added `aria-label` for screen reader compatibility.

**Blocked until:** Task 10.10 approved (met).

---

### Task 10.12 — UX & Architecture Review

**Model:** Claude Opus 4.1 · **Status:** Complete  
**Report:** [TASK_10_12_UX_ARCHITECTURE_REVIEW.md](./reviews/TASK_10_12_UX_ARCHITECTURE_REVIEW.md)

**Outcome:** Architecture certified intact. Three critical operator copy fixes applied. Prioritized recommendations documented — no broad refactoring.

---

### Task 10.13 — Documentation & Release Readiness

**Model:** GPT-5.5 · **Status:** Complete  
**Deliverable:** [FRONTEND_RELEASE_READINESS.md](./FRONTEND_RELEASE_READINESS.md)

**Objective:** Consolidate frontend documentation and certify release readiness for Task 11.

**Includes:** Architecture summary · Integration summary · Validation summary · Deferred work · Task 11 assumptions

**Updated:** `README.md` · `PROJECT_CHARTER.md` · `apps/web/README.md` · `TASK_10_FRONTEND_DIRECTIVE.md` · `ARCHITECTURE_INDEX.md`

---

## Model assignment summary

| Task | Model | Why |
|------|-------|-----|
| 10.1 Application Shell | **Composer 2.5** | React/Next.js scaffolding |
| 10.2 Dashboard | **Composer 2.5** | UI implementation |
| 10.3 Slate Intelligence Panel | **Composer 2.5** | Component development |
| 10.4 Portfolio Readiness | **Composer 2.5** | Dashboard UI |
| 10.5 Recommended Portfolio | **Composer 2.5** | Core frontend feature |
| 10.6 Player Evidence Viewer | **Composer 2.5** | Explainability UI |
| 10.7 Portfolio Health | **Composer 2.5** | Metrics visualization |
| 10.8 Simulation Results | **Composer 2.5** | Data presentation |
| 10.9 Confidence Indicators | **Composer 2.5** | Shared UI components |
| 10.10 Backend Integration | **Composer 2.5** | API wiring and state management |
| 10.11 Frontend Testing | **Composer 2.5** | Test generation and fixes |
| 10.12 UX & Architecture Review | **Claude Opus 4.1** | Independent review |
| 10.13 Documentation | **GPT-5.5** | Technical writing |

---

## UI constraints (frozen)

| Rule | Detail |
|------|--------|
| Display only | No business logic, scoring, or optimization in frontend |
| PIE authority | UI never constructs or edits lineups |
| Evidence required | Every player and lineup links to evidence |
| Manual trigger | Analyze Slate initiates pipeline; no background polling |
| v1 scope | DraftKings NFL Classic only — no sport/platform abstractions |
| No scope creep | New features → [BACKLOG.md](./BACKLOG.md) |

---

## Gate sequence

```text
10.1 Shell → 10.2 Dashboard → 10.3–10.9 Components →
10.10 Integration → 10.11 Testing → 10.12 Review → 10.13 Docs → Task 11 Backend
```

---

## Related documents

- [CURSOR_IMPLEMENTATION_PROTOCOL.md](./CURSOR_IMPLEMENTATION_PROTOCOL.md)
- [PROJECT_CHARTER.md](../PROJECT_CHARTER.md)
- [PHASE_1_5_ENHANCEMENT_CHARTER.md](./PHASE_1_5_ENHANCEMENT_CHARTER.md)
- [AMENDMENT_001_SCOPE_LOCK.md](./architecture/AMENDMENT_001_SCOPE_LOCK.md)
- [BACKLOG.md](./BACKLOG.md)
- [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) — `apps/web` structure
- [architecture/ARCHITECTURE_INDEX.md](./architecture/ARCHITECTURE_INDEX.md)
