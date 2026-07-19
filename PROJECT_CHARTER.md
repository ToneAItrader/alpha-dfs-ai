# Alpha DFS AI — Phase 1 Platform Build Instructions

**Status:** Task 10 complete — Frontend release ready  
**Version:** 2.5  
**Date:** 2026-07-18  
**Repository:** `alpha-dfs-ai` (independent from Alpha FX ATO)

> **Canonical Cursor project document.** Objective, workflow, tasks, model assignments, gates.  
> **Implementation SOP:** [docs/CURSOR_IMPLEMENTATION_PROTOCOL.md](./docs/CURSOR_IMPLEMENTATION_PROTOCOL.md) — one task at a time  
> **Task 10:** [docs/TASK_10_FRONTEND_DIRECTIVE.md](./docs/TASK_10_FRONTEND_DIRECTIVE.md)  
> **Phase 1.5:** [docs/PHASE_1_5_ENHANCEMENT_CHARTER.md](./docs/PHASE_1_5_ENHANCEMENT_CHARTER.md)  
> Cursor rule: `.cursor/rules/project-charter.mdc`

---

## Project objective

Build **Alpha DFS AI**, an institutional-quality AI platform that analyzes DraftKings NFL Classic slates and generates **optimized DFS portfolios**.

### Manual-run only

- **No** background workers  
- **No** continuous monitoring  
- **No** autonomous operation  

The application runs when the user clicks **Analyze Slate** and **stops** when complete.

### Workflow

```text
Open Application
        ↓
Click Analyze Slate
        ↓
Download Latest Data
        ↓
Slate Intelligence Agent
        ↓
Run Intelligence Agents
        ↓
Evidence Engine
        ↓
Scoring Engine
        ↓
Prediction Confidence Engine
        ↓
Portfolio Intelligence Engine
        ↓
Portfolio Simulation Engine
        ↓
Generate Reports
        ↓
Application Stops
```

**Runtime states:** `IDLE` → `ANALYZING` → `COMPLETE` → `IDLE`

---

## Engineering principles

Architecture First · Deterministic before AI · Modular Agents · Evidence-Based Decisions · Explainable AI · Comprehensive Testing · Incremental Development · **One Task at a Time** ([Implementation Protocol](./docs/CURSOR_IMPLEMENTATION_PROTOCOL.md))

---

## Task index

| Task | Name | Model | Status | Deliverable |
|------|------|-------|--------|-------------|
| 1 | Product Vision | GPT-5.5 | Complete | [docs/VISION.md](./docs/VISION.md) |
| 2 | System Architecture | GPT-5.5 | Complete | [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md), [docs/SYSTEM_DESIGN.md](./docs/SYSTEM_DESIGN.md) |
| 3 | Technology Stack | GPT-5.5 | Complete | [docs/SYSTEM_DESIGN.md](./docs/SYSTEM_DESIGN.md) |
| 4 | Database Design | GPT-5.5 | Complete | [docs/DATA_MODEL.md](./docs/DATA_MODEL.md) |
| 5 | Statistical Data Sources | GPT-5.5 | Complete | [docs/data-sources/DATA_SOURCE_CATALOG.md](./docs/data-sources/DATA_SOURCE_CATALOG.md) |
| 5.3 | External Intelligence Layer (EIL v2) | GPT-5.5 | Complete | [docs/architecture/EXTERNAL_INTELLIGENCE_LAYER.md](./docs/architecture/EXTERNAL_INTELLIGENCE_LAYER.md) |
| 5.4 | Portfolio Intelligence & Lineup Generation | GPT-5.5 | Complete | [docs/architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md](./docs/architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md) |
| 6 | AI Agent Architecture | GPT-5.5 | Updated | [docs/AGENTS.md](./docs/AGENTS.md) |
| 7 | Evidence Engine | GPT-5.5 | Complete | [docs/EVIDENCE_ENGINE.md](./docs/EVIDENCE_ENGINE.md) |
| 8 | Scoring Engine | GPT-5.5 | Complete | [docs/SCORING_ENGINE.md](./docs/SCORING_ENGINE.md) |
| 9 | Portfolio Intelligence Engine | GPT-5.5 / Composer 2.5 | Complete | [PORTFOLIO_INTELLIGENCE_ENGINE.md](./docs/architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md) · [LINEUP_OPTIMIZER.md](./docs/LINEUP_OPTIMIZER.md) |
| 10 | Frontend | Composer 2.5 | **Complete** | [FRONTEND_RELEASE_READINESS.md](./docs/FRONTEND_RELEASE_READINESS.md) |
| 11 | Backend | Composer 2.5 | **Authorized** | After Task 10 — replace stub backend |
| 12 | Testing | Composer 2.5 | Blocked | After Task 11 |
| 13 | Code Review | Claude Opus 4.1 | Blocked | After Task 12 |
| 14 | Documentation | GPT-5.5 | Blocked | After Task 13 |
| 15 | Final Validation | GPT-5.5 | Blocked | After Task 14 |

### Task 10 — Frontend subtasks

**Directive:** [docs/TASK_10_FRONTEND_DIRECTIVE.md](./docs/TASK_10_FRONTEND_DIRECTIVE.md)

| Task | Name | Status |
|------|------|--------|
| 10.1 | Application Shell | **Complete** — [review](./docs/reviews/TASK_10_1_INDEPENDENT_REVIEW.md) |
| 10.2 | Dashboard | **Complete** |
| 10.3 | Slate Intelligence Panel | **Complete** (placeholder — deferred integration) |
| 10.4 | Portfolio Readiness | **Complete** |
| 10.5 | Recommended Portfolio | **Complete** |
| 10.6 | Player Evidence Viewer | **Complete** |
| 10.7 | Portfolio Health Dashboard | **Complete** |
| 10.8 | Simulation Results | **Complete** |
| 10.9 | Confidence Indicators | **Complete** |
| 10.10 | UI Integration | **Complete** |
| 10.11 | Frontend Testing & Validation | **Certified** |
| 10.12 | UX & Architecture Review | **Complete** — [review](./docs/reviews/TASK_10_12_UX_ARCHITECTURE_REVIEW.md) |
| 10.13 | Documentation & Release Readiness | **Complete** — [release readiness](./docs/FRONTEND_RELEASE_READINESS.md) |

---

### Phase 1.5 — Architecture Enhancements (pre-implementation)

**Charter:** [docs/PHASE_1_5_ENHANCEMENT_CHARTER.md](./docs/PHASE_1_5_ENHANCEMENT_CHARTER.md)

| Task | Name | Status |
|------|------|--------|
| 9.1 | Prediction Confidence Engine | Complete |
| 9.2 | Slate Intelligence Agent | Complete |
| 9.3 | Dynamic Portfolio Strategy | Complete |
| 9.4 | Player Evidence Report | Complete |
| 9.5 | Portfolio Simulation Engine | Complete |
| 9.6 | Portfolio Health Dashboard | Complete (design) |
| 9.7 | Optimizer Performance Agent | Complete |

### Architecture Freeze v1.0

**Status:** APPROVED (2026-07-18)  
Architecture is **frozen** for Version 1.0. New features → [docs/BACKLOG.md](./docs/BACKLOG.md). Implementation authorized.

### Amendment 001 — Product Scope Lock

**Status:** APPROVED · **Doc:** [docs/architecture/AMENDMENT_001_SCOPE_LOCK.md](./docs/architecture/AMENDMENT_001_SCOPE_LOCK.md)

Version 1.0 is locked to:

```text
Platform = DraftKings
Sport = NFL
Contest = Classic Salary Cap
```

No multi-sport or multi-platform abstraction in v1. Deferred scope → [docs/BACKLOG.md](./docs/BACKLOG.md).

---

## Overall model assignment

| Phase | Primary Model | Why |
|-------|---------------|-----|
| Product Vision | **GPT-5.5** | Long-form planning and requirements |
| Architecture | **GPT-5.5** | System design and tradeoffs |
| Database & Data Sources | **GPT-5.5** | Schema and integration planning |
| EIL & Evidence Engine | **GPT-5.5** | Multi-agent and evidence design |
| Portfolio generation strategy | **GPT-5.5** | Decision logic, FR-16–19, diversity constraints |
| Optimizer implementation | **Composer 2.5** | Algorithm implementation |
| Data connectors | **Composer 2.5** | Integration work |
| Testing | **Composer 2.5** | Automated test generation |
| Code Review | **Claude Opus 4.1** | Independent architectural and code quality review |
| Documentation & Final Validation | **GPT-5.5** | Technical writing and end-to-end validation |

---

## Task specifications

### Task 1 — Product Vision

**Model:** GPT-5.5 · **Deliverable:** [docs/VISION.md](./docs/VISION.md)

Create: Vision · Goals · Scope · Success Metrics · Functional Requirements · Non-functional Requirements · Platform Constraints · Backlog reference ([docs/BACKLOG.md](./docs/BACKLOG.md))

---

### Task 2 — System Architecture

**Model:** GPT-5.5 · **Deliverables:** [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) · [docs/SYSTEM_DESIGN.md](./docs/SYSTEM_DESIGN.md)

Design: Overall architecture · Package layout · Services · Modules · Dependency flow · Pipeline · State management · Error handling

---

### Task 3 — Technology Stack

**Model:** GPT-5.5 · **Deliverable:** Technology section in [docs/SYSTEM_DESIGN.md](./docs/SYSTEM_DESIGN.md)

Select and document: Frontend · Backend · Database · AI layer · Logging · Testing · Deployment · Security

---

### Task 4 — Database Design

**Model:** GPT-5.5 · **Deliverable:** [docs/DATA_MODEL.md](./docs/DATA_MODEL.md)

Entities: Players · Teams · Games · College Stats · NFL Stats · Salaries · Projections · Ownership · Evidence · Lineups · Portfolios · Contest Results · Learning Records

---

### Task 5 — Statistical Data Sources

**Model:** GPT-5.5 · **Deliverable:** [docs/data-sources/DATA_SOURCE_CATALOG.md](./docs/data-sources/DATA_SOURCE_CATALOG.md)

Complete catalog of quantitative sources:

| Category | Includes |
|----------|----------|
| NFL Statistics | Player/team stats, snaps, usage, advanced metrics |
| DraftKings | Salaries, eligibility, contest structure |
| Betting Markets | Spreads, totals, implied totals, line movement, props |
| Player Availability | Injuries, practice reports, depth charts |
| Environment | Weather, stadium, surface |
| Historical DFS | Slates, winning lineups, ownership, salary value |

---

### Task 5.3 — External Intelligence Layer (EIL v2)

**Model:** GPT-5.5 · **Deliverable:** [docs/architecture/EXTERNAL_INTELLIGENCE_LAYER.md](./docs/architecture/EXTERNAL_INTELLIGENCE_LAYER.md)

First-class capability — makes platform **more accurate over time** via source performance measurement.

**Expert:** CBS · ESPN · NFL.com · FantasyPros · Rotowire · Yahoo · approved others  
**Community:** Reddit · X · forums · approved public analysis  

**Governance:**

1. Statistical models = projection foundation  
2. Expert analysis = weighted evidence  
3. Community = sentiment, not facts  
4. Continuous source reliability evaluation  
5. Versioned, reviewable weight changes  

**Layers:** Connector (Composer 2.5) · Intelligence (GPT-5.5 design)

---

### Task 5.4 — Portfolio Intelligence & Lineup Generation

**Model:** GPT-5.5 · **Deliverable:** [docs/architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md](./docs/architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md)

Central **Portfolio Intelligence Engine (PIE)** — replaces standalone "Lineup Optimizer" naming. Optimizer is one module inside PIE.

**Manual-run only:** Generates portfolios on Analyze Slate; returns to IDLE when complete.

| FR | Requirement | Model |
|----|-------------|-------|
| FR-16 | Primary Portfolio — 3–5 lineups, maximize EV | GPT-5.5 |
| FR-17 | Hail Mary Portfolio — 2–3 high-upside GPP lineups | GPT-5.5 |
| FR-18 | Explainability — full lineup evidence breakdown | GPT-5.5 |
| FR-19 | Portfolio diversity — overlap, exposure, stack diversity | GPT-5.5 |

**Agent 17 — Portfolio Construction Agent:** Orchestrates PIE; Primary + Hail Mary; rank; explain.

**Strategy A — Primary Optimizer:** Maximize EV — projection, confidence, correlation, value, learning (GPT-5.5 design · Composer 2.5 impl)

**Strategy B — Hail Mary Optimizer:** Maximize upside — ceiling, leverage, contrarian, rookies (GPT-5.5 design · Composer 2.5 impl)

---

### Task 6 — AI Agent Architecture

**Model:** GPT-5.5 · **Deliverable:** [docs/AGENTS.md](./docs/AGENTS.md)

| Category | Agents |
|----------|--------|
| Core | Data Collection · Statistical Intelligence · Projection · Evidence Engine · Scoring Engine |
| Football | College · Rookie · Veteran · Injury · Matchup |
| External (EIL) | Expert · Community · Market · Source Performance |
| Decision | Ownership · Correlation · Contest Strategy · **Portfolio Construction (17 / PIE)** |
| Learning | Learning · Optimizer Performance |

---

### Task 7 — Evidence Engine

**Model:** GPT-5.5 · **Deliverable:** [docs/EVIDENCE_ENGINE.md](./docs/EVIDENCE_ENGINE.md)

Assembles all intelligence into a structured **Evidence Package** per player before scoring.

Includes: Statistical · College · Rookie · Injury · Expert · Community · Market · Weather · Confidence · Evidence Quality Score

---

### Task 8 — Scoring Engine

**Model:** GPT-5.5 · **Deliverable:** [docs/SCORING_ENGINE.md](./docs/SCORING_ENGINE.md)

Dimensions: Statistical Projection · Expert Consensus · Community Sentiment · Market Confidence · Rookie Opportunity · Ownership · Leverage · Risk · Confidence · Overall DFS Rating

Every recommendation includes explainable evidence.

---

### Task 9 — Portfolio Intelligence Engine

**Model:** GPT-5.5 (design) · Composer 2.5 (implementation)

**Deliverables:**

- [docs/architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md](./docs/architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md) — PIE architecture, FR-16–19, Agent 17
- [docs/LINEUP_OPTIMIZER.md](./docs/LINEUP_OPTIMIZER.md) — Strategy A/B algorithm detail

**PIE modules:** Portfolio Construction Agent (17) · Primary Optimizer · Hail Mary Optimizer · Diversity Manager · Ranker · Explainability Engine

**Outputs:** Ranked Primary Portfolio (3–5) · Ranked Hail Mary Portfolio (2–3) · Portfolio Summary · Lineup explainability records

**Authority:** Sole roster construction authority. UI displays only.

---

### Task 10 — Frontend

**Directive:** [docs/TASK_10_FRONTEND_DIRECTIVE.md](./docs/TASK_10_FRONTEND_DIRECTIVE.md)  
**Model:** Composer 2.5 (10.1–10.11) · Claude Opus 4.1 (10.12) · GPT-5.5 (10.13)  
**Authorized:** Amendment 001 — DK NFL Classic only; no platform/sport abstractions

> Implement the frontend exactly as defined in the approved architecture. The frontend displays data only — never calculates business logic.

**Sequence:** 10.1 Application Shell → 10.2 Dashboard → 10.3–10.9 components → 10.10 Integration → 10.11 Testing → 10.12 Review → 10.13 Documentation

**Components:** Dashboard · Slate Intelligence Panel · Portfolio Readiness · Recommended Portfolio · Player Evidence Viewer · Portfolio Health · Simulation Results · Confidence Indicators

**Recommended Portfolio (10.5):**

| Section | Display per lineup |
|---------|-------------------|
| Primary | Rank · Projected Points · Confidence · Salary · Ownership · Risk · Correlation |
| Hail Mary | Ceiling · Leverage · Ownership · Correlation · Upside · Risk |

Every player and lineup displays explainable evidence (FR-18).

---

### Task 11 — Backend

**Model:** Composer 2.5

Integrate: Portfolio Construction Agent · Portfolio Intelligence Engine · Primary + Hail Mary optimizers · Evidence Engine · Scoring Engine · Dashboard API · Reports · Explainability Engine · Persistence · Logging

---

### Task 12 — Testing

**Model:** Composer 2.5

**Phase 1.5 validation:** PCE calculations · Slate Intelligence · Dynamic strategy · Simulation consistency · Player Evidence · Portfolio Health · Explainability completeness

**Portfolio tests:** Lineup count · Salary cap · Positions · Duplicates · Diversity · Exposure

**Optimizer tests:** Primary · Hail Mary · Ranking · Evidence · Explainability

Plus: Unit · Integration · E2E · Regression

---

### Task 13 — Code Review

**Model:** Claude Opus 4.1

Review: Architecture · Maintainability · Performance · Security · Technical debt · Explainability · Reliability · **PCE · Slate Intelligence · PIE · Simulation pipeline**

---

### Task 14 — Documentation

**Model:** GPT-5.5

README · User Guide · Developer Guide · Architecture Guide · API Documentation · Deployment Guide

---

### Task 15 — Final Validation

**Model:** GPT-5.5

Verify before approval:

- [ ] 3–5 Primary lineups generated  
- [ ] 2–3 Hail Mary lineups generated  
- [ ] All lineups comply with DK NFL Classic roster rules  
- [ ] Every lineup includes explainable evidence (FR-18)  
- [ ] Diversity thresholds met (FR-19)  
- [ ] Statistical, expert, community, market intelligence incorporated per configured weights  
- [ ] Historical learning influences recommendations only after validated impact  
- [ ] Evidence quality · Data integrity · Test coverage · Documentation complete  

---

## Hard constraints

1. Manual **Analyze Slate** trigger only — no background workers  
2. Stops on completion — `IDLE` → `ANALYZING` → `COMPLETE`  
3. **Amendment 001:** DraftKings · NFL · Classic only — no multi-sport/platform abstraction  
4. **Portfolio Intelligence Engine** sole roster authority  
5. Evidence required on every player and lineup  
6. EIL supplements — never overrides statistical foundation or optimizer  
7. Community sentiment ≠ facts  
8. Weight changes versioned and reviewable  
9. Independent from Alpha FX ATO  

---

## Gate workflow

Every implementation task follows [CURSOR_IMPLEMENTATION_PROTOCOL.md](./docs/CURSOR_IMPLEMENTATION_PROTOCOL.md):

```text
Implementation → Testing → Independent Review → Documentation → Approval → Next Task
```

Design-only tasks (architecture docs) follow: Design → Review → Approval.

**Tasks 11–15 blocked** until prior charter task complete. Task 10 subtasks (10.1 → 10.13) follow the protocol one at a time.

---

## Related documents

- [docs/BACKLOG.md](./docs/BACKLOG.md) — deferred v2 scope
- [docs/CURSOR_IMPLEMENTATION_PROTOCOL.md](./docs/CURSOR_IMPLEMENTATION_PROTOCOL.md) — implementation SOP (all tasks)
- [docs/TASK_10_FRONTEND_DIRECTIVE.md](./docs/TASK_10_FRONTEND_DIRECTIVE.md) — Task 10 implementation sequence
- [docs/architecture/AMENDMENT_001_SCOPE_LOCK.md](./docs/architecture/AMENDMENT_001_SCOPE_LOCK.md)
- [README.md](./README.md)
- [docs/architecture/ARCHITECTURE_INDEX.md](./docs/architecture/ARCHITECTURE_INDEX.md)
- [docs/architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md](./docs/architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md)
- [docs/PHASE_1_5_ENHANCEMENT_CHARTER.md](./docs/PHASE_1_5_ENHANCEMENT_CHARTER.md)
- [docs/PREDICTION_CONFIDENCE_ENGINE.md](./docs/PREDICTION_CONFIDENCE_ENGINE.md)
- [docs/PORTFOLIO_SIMULATION_ENGINE.md](./docs/PORTFOLIO_SIMULATION_ENGINE.md)
