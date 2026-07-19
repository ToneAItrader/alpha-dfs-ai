# Alpha DFS AI — Architecture

**Status:** Architecture Freeze v1.0 **APPROVED** (Amendment 001) — implementation authorized  
**Version:** 1.2  
**Date:** 2026-07-18  
**Parent:** [VISION.md](./VISION.md) · [PROJECT_CHARTER.md](../PROJECT_CHARTER.md) · [AMENDMENT_001_SCOPE_LOCK.md](./architecture/AMENDMENT_001_SCOPE_LOCK.md)

> Defines the Alpha DFS AI architecture: on-demand analysis pipeline, boundaries, agent orchestration, and interfaces.  
> **v1 scope:** DraftKings · NFL · Classic Salary Cap only — no multi-sport/platform abstraction.

---

## Version 1 scope lock (Amendment 001)

Every v1 component assumes:

```text
League = NFL
Platform = DraftKings
Contest = Classic
```

Deferred scope → [BACKLOG.md](./BACKLOG.md).

## Architectural stance

Alpha DFS AI is an **on-demand DFS analysis application** organized as a governed multi-agent pipeline. The user manually triggers each analysis; the system runs to completion and stops. Deterministic engines enforce rules and constraints. AI agents interpret uncertainty and produce explainable intelligence. The Lineup Optimizer is the sole authority for roster construction under DraftKings Classic constraints.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                     APPLICATION UI (user-triggered)                      │
│  Analyze Slate · Dashboard · Explorer · Reports · Settings               │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ "Analyze Slate" → poll status → results
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  ANALYSIS ORCHESTRATOR (runs once per trigger)           │
│  Slate Supervisor · phases IDLE → ANALYZING → COMPLETE                   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              EXTERNAL INTELLIGENCE LAYER (EIL) — first-class             │
│  Connectors · Expert Intelligence · Community Intelligence · Source Perf  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ supplements statistical intelligence
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    AI REASONING LAYER (recommendations)                  │
│  College · Rookie · Veteran · Injury · Projection · Ownership · Corr.  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│               PLAYER INTELLIGENCE LAYER (structured analysis)            │
│  Data Collection · Normalization · Scoring Engine · Value Engine         │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      DATA & PERSISTENCE LAYER                            │
│  PostgreSQL · Prisma · Evidence Store · Historical Slates                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Pipeline

Canonical data and decision flow for each slate:

```text
External Sources → Download Data → Slate Intelligence
      ↓
Intelligence Agents → Evidence Engine → Scoring Engine
      ↓
Prediction Confidence Engine (PCE)
      ↓
Ownership · Correlation · Dynamic Strategy
      ↓
Portfolio Intelligence Engine (PIE) — Primary + Hail Mary
      ↓
Portfolio Simulation Engine
      ↓
Reports + Portfolio Health → IDLE
```

---

## Core responsibilities

| Component | Responsibility | Authority |
|-----------|----------------|-----------|
| Data Collection | Ingest, normalize, persist statistical source data | Write to DB; no scoring |
| **EIL Connectors** | ToS-compliant fetch from expert/community providers | Raw artifacts only |
| **Expert Intelligence (EIL)** | Normalize expert rankings, consensus, trends | Expert Consensus Score |
| **Community Intelligence (EIL)** | Summarize sentiment and themes (not facts) | Community Sentiment Score |
| **Source Performance (EIL)** | Track source accuracy over time | Source Reliability Score |
| Player Intelligence Agents | Evaluate players by lifecycle stage | Produce sub-scores + evidence |
| Evidence Engine | Assemble Player Evidence Package before scoring | Deterministic assembly |
| Scoring Engine | Multi-dimensional player ratings | Deterministic formulas |
| Prediction Confidence Engine | Player/lineup confidence, stability | Feeds PIE ranking |
| Portfolio Simulation Engine | Monte Carlo outcome evaluation | Risk/upside metrics |
| Portfolio Intelligence Engine | Portfolios + explainability | **Sole roster authority** |
| Slate Intelligence | Slate-wide strategy context | Pre-player evaluation |
| Contest Strategy | Adapt objectives by contest type | Policy output |
| Bankroll Agent | ROI tracking, allocation, exposure limits | Policy output |
| Learning Agent | Post-slate analysis and refinement proposals | Proposals only — governed change |
| Mission Control | Observe, configure, audit | Read + policy config; no manual picks |

---

## Decision boundaries

### In scope

- NFL DraftKings Classic slates
- Player evaluation and evidence-based scoring
- **Portfolio generation** — Primary (3–5) + Hail Mary (2–3) lineups
- Correlation-aware optimization with exposure and similarity control
- EIL v2 — expert and community intelligence with source reliability
- Post-analysis learning (optional v1)
- Full evidence trail for every player and lineup

### Out of scope (v1)

See [BACKLOG.md](./BACKLOG.md). Includes other sports, other DFS platforms, NFL Showdown, automated submission, sports betting.

### Hard boundaries

| Rule | Enforcement |
|------|-------------|
| Optimizer constraints are immutable per slate | Deterministic — salary, positions, max per team |
| AI cannot override optimizer feasibility | Optimizer rejects infeasible inputs |
| Bankroll limits are hard gates | No lineup export if exposure exceeds policy |
| Learning changes require approval | No silent model weight updates |
| Mission Control does not edit lineups | UI displays optimizer output; Lineup Builder is review-only |
| No background operation | Pipeline runs only on user "Analyze Slate" trigger |

---

## Deterministic vs AI classification

| Component | Type | Rationale |
|-----------|------|-----------|
| Data Collection (normalize, persist) | Deterministic | Schema validation, ETL rules |
| College / Rookie / Veteran Intelligence | AI + Deterministic hybrid | Structured stats deterministic; qualitative synthesis AI |
| Scoring Engine | Deterministic | Versioned formulas, auditable |
| Projection Agent | AI | Uncertainty synthesis |
| Ownership Agent | AI + Statistical | Model-based prediction |
| Value Agent | Deterministic | `projection / salary` |
| Correlation Agent | AI + Statistical | Stack identification |
| Lineup Optimizer | Deterministic | MILP / heuristic optimization |
| Contest Strategy | Deterministic rules + AI context | Policy tables with AI narrative |
| Bankroll Agent | Deterministic | ROI math, exposure caps |
| Learning Agent | AI analysis + Deterministic metrics | Error measurement deterministic; refinement proposals AI-assisted |

---

## Agent orchestration

A **Slate Supervisor** coordinates the twelve agents per slate cycle:

```text
Slate Supervisor
│
├── Phase: INGEST      → Data Collection Agent
├── Phase: EVALUATE    → College, Rookie, Veteran (parallel)
├── Phase: SCORE       → Scoring Engine, Value Agent
├── Phase: PROJECT     → Projection Agent
├── Phase: FIELD       → Ownership Agent, Correlation Agent
├── Phase: STRATEGIZE  → Contest Strategy, Bankroll Agent
├── Phase: OPTIMIZE    → Lineup Optimizer
├── Phase: EXPORT      → Export Coordinator
└── Phase: LEARN       → Learning Agent (post-slate)
```

Agent specifications: [AGENTS.md](./AGENTS.md)

---

## Evidence model

Every artifact produced by the pipeline includes:

| Field | Purpose |
|-------|---------|
| `evidenceId` | Stable identifier |
| `sourceRefs` | Data sources with timestamps |
| `contributingScores` | Sub-scores that fed the output |
| `confidence` | 0–1 composite confidence |
| `reasoningSummary` | Human-readable explanation |
| `version` | Formula/model version |
| `slateId` | Slate context |

Evidence bundles persist for audit, learning, and Mission Control display.

---

## Mission Control philosophy

Mission Control is the operator console — analogous to Alpha FX Mission Control:

- **Observe:** slate status, projections, lineups, bankroll, learning deltas
- **Configure:** bankroll policy, exposure limits, contest preferences, data source toggles
- **Audit:** evidence trails, historical slate performance, learning proposals
- **Certify:** validation evidence for readiness gates

Mission Control does **not** provide manual player selection, lineup editing, or override of optimizer output. Operators configure policy; the platform produces lineups.

---

## Technology stack (planned)

| Layer | Choice |
|-------|--------|
| Language | TypeScript |
| Web | Next.js (React) |
| API | Next.js API routes or dedicated API app |
| Database | PostgreSQL + Prisma |
| Monorepo | Turborepo or pnpm workspaces |
| Testing | Vitest + Playwright |
| Deployment | Local-first Docker; cloud optional |

Details: [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md)

---

## Related documents

| Document | Purpose |
|----------|---------|
| [BACKLOG.md](./BACKLOG.md) | Deferred v2 scope |
| [architecture/AMENDMENT_001_SCOPE_LOCK.md](./architecture/AMENDMENT_001_SCOPE_LOCK.md) | v1 scope lock |
| [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) | Apps, packages, deployment |
| [DATA_MODEL.md](./DATA_MODEL.md) | Entity schemas |
| [AGENTS.md](./AGENTS.md) | Agent specifications |
| [SCORING_ENGINE.md](./SCORING_ENGINE.md) | Scoring formulas |
| [LINEUP_OPTIMIZER.md](./LINEUP_OPTIMIZER.md) | Optimization design |
| [LEARNING_ENGINE.md](./LEARNING_ENGINE.md) | Learning loop |
| [ROADMAP.md](./ROADMAP.md) | Delivery phases |
