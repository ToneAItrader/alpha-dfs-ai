# Alpha DFS AI — System Design

**Status:** Phase 1 — Architecture contract only  
**Version:** 1.0  
**Date:** 2026-07-18  
**Parent:** [ARCHITECTURE.md](./ARCHITECTURE.md)

> Application structure, package boundaries, data flow, API surface, and deployment design.  
> No code until Phase 6 authorization.

---

## Monorepo layout

```text
alpha-dfs-ai/
├── apps/
│   ├── web/                    # Next.js Mission Control UI
│   └── api/                    # Optional dedicated API (if split from web)
├── packages/
│   ├── agents/                 # Agent implementations + Slate Supervisor
│   ├── optimizer/              # Lineup optimization engine (deterministic)
│   ├── scoring/                # Scoring Engine + Value Agent logic
│   ├── projections/            # Projection pipeline + ownership models
│   ├── learning/               # Post-slate learning engine
│   ├── database/               # Prisma schema, migrations, repositories
│   └── shared/                 # Types, contracts, utilities, constants
├── docs/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docker/
│   ├── docker-compose.yml
│   └── Dockerfile
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Application layer

### apps/web — Mission Control

Next.js application for operators.

| Area | Purpose |
|------|---------|
| Dashboard | Slate status, pipeline health, next actions |
| Slates | Active/upcoming slates, lock times, data freshness |
| Players | Player profiles, sub-scores, evidence drill-down |
| Projections | Projection table with confidence and sources |
| Lineups | Generated lineups with stack/correlation/exposure summary |
| Contests | Contest strategy configuration per slate |
| Bankroll | ROI, allocation, exposure vs policy |
| Learning | Post-slate analysis, refinement proposals |
| Audit | Evidence bundles, version history, change log |
| Configuration | Data sources, scoring weights, bankroll policy |

**UI constraints (frozen at design):**

- Observe, configure, audit — no manual lineup editing
- Page-load refresh; no expensive polling
- Evidence drill-down on every score and lineup

### apps/api — Backend services

If separated from Next.js API routes:

| Surface | Responsibility |
|---------|----------------|
| `/slates` | Slate CRUD, status, lock schedule |
| `/players` | Player data, scores, projections |
| `/lineups` | Optimizer runs, lineup retrieval |
| `/contests` | Contest strategy configuration |
| `/bankroll` | Policy, ROI, exposure |
| `/learning` | Post-slate reports, proposals |
| `/evidence` | Evidence bundle retrieval |
| `/pipeline` | Trigger slate cycle phases (admin) |

Internal service calls use package imports directly; HTTP API serves Mission Control and external automation.

---

## Package layer

### packages/database

- Prisma schema (single source of truth)
- Migration scripts
- Repository pattern for typed data access
- Evidence store tables

Exports: `@alpha-dfs/database`

### packages/shared

- TypeScript interfaces for all domain contracts
- DraftKings roster rules constants
- Score type enums
- Evidence bundle schema
- Error types

Exports: `@alpha-dfs/shared`

### packages/external-intelligence (EIL)

First-class External Intelligence Layer — connector and intelligence separation.

```text
packages/external-intelligence/
├── connectors/     # ToS-compliant fetch per provider (Composer 2.5)
│   ├── expert/     # CBS, ESPN, FantasyPros, Rotowire, ...
│   └── community/  # Reddit, X, YouTube summaries, forums
├── intelligence/   # Normalize, summarize, score (GPT-5.5 design)
│   ├── expert.ts
│   ├── community.ts
│   └── source-performance.ts
└── index.ts
```

Exports: `@alpha-dfs/external-intelligence`

**Design doc:** [EXTERNAL_INTELLIGENCE_LAYER.md](./architecture/EXTERNAL_INTELLIGENCE_LAYER.md)

### packages/evidence

Evidence Engine — assembles Player Evidence Packages before scoring (Task 7).

Exports: `@alpha-dfs/evidence` · **Design doc:** [EVIDENCE_ENGINE.md](./EVIDENCE_ENGINE.md)

### packages/prediction-confidence

Prediction Confidence Engine (Task 9.1). Exports: `@alpha-dfs/prediction-confidence`

### packages/portfolio-simulation

Portfolio Simulation Engine (Task 9.5). Exports: `@alpha-dfs/portfolio-simulation`

### packages/scoring

Deterministic scoring engine:

- Sub-score calculators (where formula-based)
- Score aggregation into Player DFS Profile
- Value Agent (`projection / salary`)
- Versioned formula registry

Exports: `@alpha-dfs/scoring`

### packages/projections

- Projection Agent orchestration
- Ownership prediction models
- Correlation analysis
- Confidence calibration

Exports: `@alpha-dfs/projections`

### packages/portfolio-intelligence (PIE)

Portfolio Intelligence Engine — Agent 17, Primary + Hail Mary optimizers, explainability, diversity.

Exports: `@alpha-dfs/portfolio-intelligence`

**Design doc:** [PORTFOLIO_INTELLIGENCE_ENGINE.md](./architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md)

### packages/optimizer

Deterministic lineup optimization:

- DraftKings NFL Classic constraint definitions
- MILP / heuristic solvers
- Multi-lineup generation with exposure diversity
- Stack enforcement rules

Exports: `@alpha-dfs/optimizer`

**Authority:** Optimizer is the sole component that produces final rosters.

### packages/agents

Twelve agent implementations + Slate Supervisor:

| Agent | Package module |
|-------|----------------|
| Data Collection | `agents/data-collection` |
| College Intelligence | `agents/college` |
| Rookie Intelligence | `agents/rookie` |
| Veteran Intelligence | `agents/veteran` |
| Projection | `agents/projection` |
| Ownership | `agents/ownership` |
| Value | `agents/value` (delegates to scoring) |
| Correlation | `agents/correlation` |
| Lineup Optimizer | `agents/optimizer` (delegates to optimizer pkg) |
| Contest Strategy | `agents/contest-strategy` |
| Bankroll | `agents/bankroll` |
| Learning | `agents/learning` (delegates to learning pkg) |

Slate Supervisor: `agents/supervisor`

Exports: `@alpha-dfs/agents`

### packages/learning

- Post-slate comparison engine
- Projection error analysis
- Ownership prediction accuracy
- Winning lineup pattern extraction
- Refinement proposal generation

Exports: `@alpha-dfs/learning`

---

## Data flow — slate cycle

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  External    │     │    Data      │     │  PostgreSQL  │
│  APIs/Files  │────►│  Collection  │────►│   (Prisma)   │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                     ┌────────────────────────────┘
                     ▼
              ┌──────────────┐
              │  Intelligence │  College · Rookie · Veteran
              │    Agents     │  (parallel read → write scores)
              └──────┬───────┘
                     ▼
              ┌──────────────┐
              │   Scoring    │  Deterministic aggregation
              │   Engine     │
              └──────┬───────┘
                     ▼
              ┌──────────────┐
              │  Projection  │  + Ownership + Correlation + Value
              │   Pipeline   │
              └──────┬───────┘
                     ▼
              ┌──────────────┐     ┌──────────────┐
              │   Contest    │◄────│   Bankroll   │
              │   Strategy   │     │    Agent     │
              └──────┬───────┘     └──────────────┘
                     ▼
              ┌──────────────┐
              │   Optimizer  │  Deterministic MILP/heuristic
              └──────┬───────┘
                     ▼
              ┌──────────────┐
              │   Evidence   │  Bundle per lineup
              │    Store     │
              └──────┬───────┘
                     ▼
              ┌──────────────┐
              │  Mission     │  Display + export
              │  Control     │
              └──────────────┘

         [ Slate completes ]
                     │
                     ▼
              ┌──────────────┐
              │   Learning   │  Compare → Propose → Govern
              │   Engine     │
              └──────────────┘
```

---

## External data sources (Phase 2 design)

| Source | Data | Refresh cadence |
|--------|------|-----------------|
| College stats | NCAA production, SOS, conference | Weekly + pre-draft |
| NFL stats | Game logs, advanced metrics | Post-game + weekly |
| Draft history | Capital, team, year | Annual + in-season updates |
| Combine / RAS | Athletic testing, relative scores | Pre-season |
| Depth charts | Snap opportunity, role | Daily during season |
| Vegas odds | Totals, spreads, implied team totals | Daily pre-slate |
| Weather | Wind, precipitation, dome | Day-of |
| Injury reports | Practice participation, game status | Daily |
| DFS salaries | DraftKings player salaries | Per slate |
| Ownership | Historical and projected field ownership | Per slate |
| Historical slates | Past salaries, ownership, results | Archive import |

Each source maps to a normalized entity in [DATA_MODEL.md](./DATA_MODEL.md). Data Collection Agent owns ingestion contracts.

---

## API design principles

1. **REST-first** — resource-oriented endpoints; GraphQL optional later
2. **Evidence included** — player and lineup responses embed or link evidence bundles
3. **Versioned outputs** — scoring formula and model versions in response metadata
4. **Idempotent pipeline triggers** — re-running a slate phase produces consistent results given same inputs
5. **Fail-closed** — missing critical data blocks downstream phases with explicit errors

---

## Persistence strategy

| Store | Technology | Purpose |
|-------|------------|---------|
| Primary | PostgreSQL | All domain entities |
| ORM | Prisma | Schema, migrations, type-safe queries |
| Evidence | PostgreSQL JSONB | Evidence bundles attached to scores/lineups |
| Cache (optional) | Redis | Slate-hot data during optimization runs |
| File archive | Local/S3 | Raw source file snapshots for audit |

PostgreSQL from Day 1. No SQLite or in-memory-only persistence for production path.

---

## Deployment

### Local-first (default)

```text
docker compose up
  ├── postgres
  ├── web (Next.js)
  └── worker (slate pipeline runner)
```

Operator runs Mission Control locally. Pipeline worker executes slate cycles on schedule or manual trigger.

### Environment variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection |
| `OPENAI_API_KEY` / model provider keys | AI agent calls |
| `DATA_SOURCE_*` | External API credentials |
| `BANKROLL_POLICY` | Default exposure configuration |

---

## Security and governance

| Concern | Approach |
|---------|----------|
| API keys | Environment secrets; never in repo |
| Data source ToS | Document permitted use per source in Phase 2 |
| Lineup export | Operator-initiated; no auto-submit without explicit config |
| Learning changes | Proposal → review → approval → version bump |
| Audit | All pipeline runs logged with inputs, outputs, versions |

---

## Testing strategy (Phase 8)

| Level | Scope | Tooling |
|-------|-------|---------|
| Unit | Scoring formulas, optimizer constraints, value calc | Vitest |
| Integration | Agent pipeline phases, DB round-trips | Vitest + test DB |
| Regression | Historical slate backtests | Custom fixtures |
| E2E | Mission Control flows | Playwright |
| Optimization | Known-optimal lineup verification | Fixture slates |

Test strategy design precedes implementation (GPT-5.5); test code written in Phase 8 (Composer 2.5).

---

## Model assignment (engineering workflow)

| Phase | Primary model | Responsibility |
|-------|---------------|----------------|
| 1 — Architecture | GPT-5.5 | System design, data models, agent design |
| 2 — Data sources | GPT-5.5 | Source architecture |
| 3 — Database | GPT-5.5 | Entity design |
| 4 — Agents | GPT-5.5 | Agent specifications |
| 5 — Scoring | GPT-5.5 | Formula design |
| 6 — Implementation | Composer 2.5 | TypeScript, React, Prisma, tests |
| 7 — Code review | Claude Opus | Architecture, readability, smells |
| 8 — Testing | Composer 2.5 + GPT-5.5 | Implementation + strategy |

---

## Related documents

- [DATA_MODEL.md](./DATA_MODEL.md) — Entity schemas
- [AGENTS.md](./AGENTS.md) — Agent specifications
- [ROADMAP.md](./ROADMAP.md) — Phase gates
