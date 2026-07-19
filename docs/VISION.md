# Alpha DFS AI — Product Vision

**Status:** Task 1 — Complete (v2)  
**Version:** 2.0  
**Date:** 2026-07-18  
**Parent:** [PROJECT_CHARTER.md](../PROJECT_CHARTER.md)

> Vision, scope, success metrics, constraints, and functional/non-functional requirements.

---

## Mission statement

> An institutional-quality AI platform that analyzes DraftKings NFL Classic slates and generates optimized DFS portfolios — on demand, with full evidence trails.

Alpha DFS AI applies institutional engineering discipline to daily fantasy sports. The platform treats lineup construction as a governed decision pipeline — not a black-box prediction — where every player selection and every lineup carries a traceable evidence trail.

**This is not a live autonomous platform.** The user manually starts each analysis; the system stops when complete.

---

## Scope

### In scope (v1)

| Area | Detail |
|------|--------|
| Platform | DraftKings NFL Classic slates only |
| Operation | Manual "Analyze Slate" trigger; stops on completion |
| Output | Evidence packages, scores, Primary Portfolio (3–5), Hail Mary Portfolio (2–3), reports |
| Intelligence | Statistical, football, EIL, market, matchup agents |
| UI | Dashboard, Player Explorer, Evidence Viewer, Portfolio Viewer, Lineup Comparison, Reports, Settings |

### Out of scope (v1)

See [BACKLOG.md](./BACKLOG.md) for the full deferred list. Includes: other DFS platforms, other sports, NFL Showdown, autonomous operation, automated submission, live bankroll tracking, background polling.

| Area | Reason |
|------|--------|
| Scope expansion | [Amendment 001](./architecture/AMENDMENT_001_SCOPE_LOCK.md) locks v1; promote from backlog only |
| Autonomous / scheduled operation | Explicitly excluded |
| Automated lineup submission | Operator exports manually |
| Live bankroll tracking | Backlog |
| Background data polling | Data fetched per analysis run |

---

## Goals

1. **Evidence-first analysis** — every player decision traceable to structured evidence  
2. **Portfolio generation** — Primary + Hail Mary portfolios, not single-lineup output  
3. **Accuracy over time** — EIL source reliability improves with measured performance  
4. **Explainability** — users see why each player and lineup was selected  
5. **Institutional discipline** — architecture-first, deterministic gates, governed learning  

---

## Post-v1 scope

All expansion items (platforms, sports, contest types, mobile, advanced features) are tracked in [BACKLOG.md](./BACKLOG.md). Version 2 requires charter amendment and v1 validation (Task 15).

---

## Problem statement

Building competitive DraftKings Classic portfolios requires:

- Player evaluation across college, draft, and NFL contexts
- Multi-source data normalization at analysis time
- Projection accuracy under uncertainty
- Ownership and leverage modeling
- Correlation-aware lineup construction under salary constraints
- Explainable recommendations the user can trust and audit

Manual research and spreadsheet workflows do not scale. Single-model tools lack explainability and governed optimization. Alpha DFS AI addresses this with a multi-agent, evidence-based architecture modeled on Alpha FX engineering patterns — in an independent repository.

---

## Operational flow

```text
Open Application → Click Analyze Slate → Download Data → Slate Intelligence →
Intelligence Agents → Evidence Engine → Scoring Engine → PCE → PIE → Simulation → Reports → Stop
```

**Runtime states:** `IDLE` → `ANALYZING` → `COMPLETE` → `IDLE`

---

## Core principles

1. **Architecture First** — design before code
2. **Deterministic before AI** — rules and constraints are deterministic; AI interprets uncertainty
3. **Modular Agents** — independent agents with explicit I/O contracts
4. **Evidence-Based Decisions** — every score and lineup cites sources
5. **Explainable AI** — human-readable reasoning on all recommendations
6. **Comprehensive Testing** — unit, integration, E2E, regression
7. **Incremental Development** — one task at a time with gates

---

## Functional requirements

| ID | Requirement |
|----|-------------|
| FR-1 | User can select or confirm target DK NFL Classic slate |
| FR-2 | User triggers analysis via "Analyze Slate" button |
| FR-3 | System downloads and normalizes all configured data sources for the slate |
| FR-4 | System runs pipeline: agents → evidence engine → scoring → Portfolio Intelligence Engine |
| FR-5 | System produces multi-dimensional player scores with evidence |
| FR-6 | System generates valid DK Classic portfolios: Primary (3–5) + Hail Mary (2–3) |
| FR-7 | System generates analysis report with lineup rationale and evidence |
| FR-8 | System returns to IDLE when analysis completes |
| FR-9 | User can explore players, rookies, slate context, and lineups in UI |
| FR-10 | User can configure data sources and contest preferences in Settings |
| FR-11 | User can export lineups and reports |
| FR-12 | System supports multi-lineup generation with exposure limits |
| FR-13 | System ingests expert intelligence from approved sources (EIL) |
| FR-14 | System summarizes community sentiment as themes, not facts (EIL) |
| FR-15 | System displays Expert Consensus, Community Sentiment, and Market Confidence scores |
| FR-16 | Primary Portfolio — 3–5 lineups maximizing expected value |
| FR-17 | Hail Mary Portfolio — 2–3 high-upside GPP lineups |
| FR-18 | Every lineup includes full explainability breakdown |
| FR-19 | Portfolio diversity — overlap, exposure, and stack diversity enforced |
| FR-20 | Recommended Portfolio dashboard displays Primary and Hail Mary lineups with evidence |
| FR-21 | Prediction Confidence Engine scores every player and lineup (Task 9.1) |
| FR-22 | Slate Intelligence analyzes slate before player evaluation (Task 9.2) |
| FR-23 | Portfolio Simulation evaluates lineups via Monte Carlo (Task 9.5) |
| FR-24 | Portfolio Health Dashboard summarizes portfolio-grade metrics (Task 9.6) |

---

## Non-functional requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | Analysis completion time | < 10 minutes per slate |
| NFR-2 | Lineup validity | 100% pass DK Classic constraints |
| NFR-3 | Explainability | Every recommended player has evidence drill-down |
| NFR-4 | Reliability | Fail-closed on missing critical data (salaries) |
| NFR-5 | Test coverage | > 90% on scoring and optimizer (Task 12) |
| NFR-6 | Local deployment | Runs via Docker on developer machine |
| NFR-7 | Auditability | Pipeline run logged with inputs, versions, outputs |
| NFR-8 | Security | API keys in environment only; never in repo |

---

## Success metrics (v1)

| Metric | Target |
|--------|--------|
| Analysis completion | Full pipeline on manual trigger without error |
| Data freshness | All P0 sources ingested before scoring |
| Lineup validity | 100% of lineups pass DK Classic rules |
| Explainability | Evidence on every score and lineup slot |
| Performance | Single slate analysis < 10 minutes |
| User value | Actionable lineup recommendations with clear rationale |

---

## Constraints

| Constraint | Detail |
|------------|--------|
| Manual trigger only | No cron, workers, or background slate cycles |
| Stops on completion | No persistent running state between analyses |
| DK Classic only | [Amendment 001](./architecture/AMENDMENT_001_SCOPE_LOCK.md) — no multi-sport/platform abstraction |
| Optimizer authority | UI displays lineups; does not manually construct rosters |
| Evidence required | No recommendation without evidence bundle |
| Independent repo | No coupling to Alpha FX ATO |
| Task gates | Task 10 authorized; Tasks 11–15 gated on prior completion |

---

## Maturity model (adjusted for on-demand)

| Level | Name | v1 target |
|-------|------|-----------|
| L0 | Assisted | Manual data; AI explains |
| L1 | Guided | **v1 target** — user triggers; system recommends |
| L2 | Governed | Full pipeline with deterministic gates and evidence |
| L3+ | Autonomous | Out of v1 scope — requires charter amendment |

---

## What Alpha DFS AI is not

- Not a live autonomous platform
- Not a continuously running service
- Not a manual lineup editor with AI suggestions
- Not a sportsbook or wagering platform
- Not coupled to Alpha FX trading infrastructure

---

## Related documents

- [PROJECT_CHARTER.md](../PROJECT_CHARTER.md) — Tasks and model assignments
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Platform architecture
- [AGENTS.md](./AGENTS.md) — Agent specifications
- [BACKLOG.md](./BACKLOG.md) — deferred v2 scope
- [architecture/AMENDMENT_001_SCOPE_LOCK.md](./architecture/AMENDMENT_001_SCOPE_LOCK.md) — v1 scope lock
