# Alpha DFS AI — Roadmap

**Status:** Task 5 — Data Sources  
**Version:** 1.1  
**Date:** 2026-07-18  
**Charter:** [PROJECT_CHARTER.md](../PROJECT_CHARTER.md)

> Delivery plan aligned to the fifteen-task project charter.  
> No task begins until prior task gate passes.

---

## Task overview (charter)

| Tasks | Phase | Model | Status |
|-------|-------|-------|--------|
| 1–4 | Vision, architecture, stack, database | GPT-5.5 | Complete |
| 5 | Data sources | GPT-5.5 | **Current** |
| 6–8 | Agents, scoring, optimizer | GPT-5.5 | Complete |
| 9 | UI/UX | Composer 2.5 | Blocked |
| 10 | Backend | Composer 2.5 | Blocked |
| 11 | AI integration | Composer 2.5 | Blocked |
| 12 | Testing | Composer 2.5 | Blocked |
| 13 | Code review | Claude Opus 4.1 | Blocked |
| 14 | Documentation | GPT-5.5 | Blocked |
| 15 | Final validation | GPT-5.5 | Blocked |

Full specifications: [PROJECT_CHARTER.md](../PROJECT_CHARTER.md)

**Workflow:**

```text
Task N Design → Review → Approval → Task N Implementation (if applicable) → Task N+1
```

**Hard rule:** Tasks 9–15 blocked until Tasks 1–8 approved.

---

## Phase 1 — Architecture (No Code)

**Status:** In progress  
**Model:** GPT-5.5  
**Objective:** Design the entire platform before writing implementation code.

### Deliverables

| Document | Status |
|----------|--------|
| VISION.md | Complete |
| ARCHITECTURE.md | Complete |
| SYSTEM_DESIGN.md | Complete |
| DATA_MODEL.md | Complete |
| AGENTS.md | Complete |
| SCORING_ENGINE.md | Complete |
| LINEUP_OPTIMIZER.md | Complete |
| LEARNING_ENGINE.md | Complete |
| ROADMAP.md | Complete |

### Gate criteria

- [ ] All nine documents complete and internally consistent
- [ ] Deterministic vs AI boundaries explicit for every component
- [ ] Cross-references validated (no orphan references)
- [ ] Human review and approval recorded
- [ ] README and repo structure initialized

**Exit:** Architecture approved → Phase 2 authorized.

---

## Phase 2 — Data Sources

**Model:** GPT-5.5  
**Objective:** Design every data source, ingestion contract, refresh cadence, and normalization mapping.

### Deliverables

| Document | Purpose |
|----------|---------|
| `docs/data-sources/DATA_SOURCE_CATALOG.md` | All sources with metadata |
| `docs/data-sources/INGESTION_CONTRACTS.md` | API schemas, file formats |
| `docs/data-sources/REFRESH_SCHEDULE.md` | Cadence per source per slate phase |
| `docs/data-sources/SOURCE_GOVERNANCE.md` | ToS, licensing, reliability tiers |

### Sources to design

| Source | Priority |
|--------|----------|
| College stats | P0 |
| NFL stats / game logs | P0 |
| Draft history | P0 |
| Combine / RAS | P1 |
| Depth charts | P0 |
| Vegas odds | P0 |
| Weather | P1 |
| Injury reports | P0 |
| DFS salaries | P0 |
| Ownership (historical) | P1 |
| Historical slates | P1 |

### Gate criteria

- [ ] Every DATA_MODEL entity has at least one source mapping
- [ ] Refresh cadence defined for slate cycle integration
- [ ] Fail-closed rules for missing/stale data documented
- [ ] Source governance (ToS, cost, reliability) documented

---

## Phase 3 — Database Design

**Model:** GPT-5.5  
**Objective:** Finalize Prisma schema, indexes, migrations strategy, and seed data plan.

### Deliverables

| Document | Purpose |
|----------|---------|
| `docs/database/PRISMA_SCHEMA.md` | Full schema specification |
| `docs/database/MIGRATION_STRATEGY.md` | Versioning, rollback |
| `docs/database/SEED_DATA.md` | Reference data, test fixtures |
| `docs/database/INDEX_PLAN.md` | Query patterns and indexes |

### Gate criteria

- [ ] Schema implements all DATA_MODEL entities
- [ ] Evidence bundle storage designed
- [ ] Slate-scoped query patterns optimized
- [ ] Migration strategy documented

---

## Phase 4 — AI Agent Design (Detailed)

**Model:** GPT-5.5  
**Objective:** Detailed specifications for each agent — prompts, contracts, error handling, test scenarios.

### Deliverables

| Document | Purpose |
|----------|---------|
| `docs/agents/AGENT_SPECIFICATIONS.md` | Per-agent detailed spec |
| `docs/agents/PROMPT_TEMPLATES.md` | AI agent prompt designs |
| `docs/agents/PIPELINE_ORCHESTRATION.md` | Slate Supervisor state machine |
| `docs/agents/AGENT_TEST_SCENARIOS.md` | Expected inputs/outputs per agent |

### Gate criteria

- [ ] All 12 agents have detailed I/O contracts
- [ ] Slate Supervisor state machine defined
- [ ] AI vs deterministic split confirmed per agent
- [ ] Test scenarios for each agent documented

---

## Phase 5 — Scoring Engine (Detailed Formulas)

**Model:** GPT-5.5  
**Objective:** Lock all scoring formulas, weight profiles, and version registry.

### Deliverables

| Document | Purpose |
|----------|---------|
| `docs/scoring/FORMULA_REGISTRY.md` | Every formula with version |
| `docs/scoring/WEIGHT_PROFILES.md` | Contest-type weight tables |
| `docs/scoring/POSITION_FORMULAS.md` | DST, K, position-specific |
| `docs/scoring/CALIBRATION_PLAN.md` | How to validate score accuracy |

### Gate criteria

- [ ] All 11 profile dimensions have locked formulas
- [ ] Contest weight profiles complete
- [ ] Version registry schema defined
- [ ] Calibration methodology documented

---

## Phase 6 — Implementation

**Model:** Composer 2.5  
**Objective:** Build the platform per approved architecture.

### Implementation sequence

```text
M1  Repo scaffold (monorepo, Prisma, Docker)
M2  packages/database + packages/shared
M3  Data Collection Agent + source integrations
M4  Player Intelligence Agents (College, Rookie, Veteran)
M5  Scoring Engine + Value Agent
M6  Projection + Ownership + Correlation Agents
M7  Lineup Optimizer
M8  Contest Strategy + Bankroll Agents
M9  Slate Supervisor + pipeline orchestration
M10 Mission Control UI (observe / configure / audit)
M11 Learning Engine + Agent 12
M12 End-to-end slate cycle integration
```

### Gate criteria (M12)

- [ ] Full slate cycle runs locally: ingest → optimize → export
- [ ] Evidence bundles generated for all outputs
- [ ] Mission Control displays slate status, players, lineups, learning
- [ ] Bankroll gates enforce exposure limits
- [ ] No manual lineup editing in UI

---

## Phase 7 — Code Review

**Model:** Claude Opus  
**Objective:** Architecture adherence, readability, maintainability, code smells.

### Scope

- Package boundary integrity
- Deterministic vs AI separation in code
- Optimizer correctness
- Evidence trail completeness
- Error handling and fail-closed behavior
- Type safety and contract adherence

### Gate criteria

- [ ] Review findings addressed or accepted with rationale
- [ ] No critical architecture violations
- [ ] Code review sign-off recorded

---

## Phase 8 — Testing & Validation

**Models:** Composer 2.5 (implementation) + GPT-5.5 (strategy)

### Test layers

| Layer | Scope |
|-------|-------|
| Unit | Scoring formulas, optimizer constraints, value calc |
| Integration | Agent pipeline phases, DB round-trips |
| Regression | Historical slate backtests |
| E2E | Mission Control flows |
| Optimization | Known-optimal lineup verification |

### Validation milestones

| Milestone | Description |
|-----------|-------------|
| V1 | Historical backtest — 8 slates, projection MAE measured |
| V2 | Optimizer validation — fixture slates match known optimal |
| V3 | Full pipeline dry run — upcoming slate, no export |
| V4 | First live slate cycle — ingest through learning |
| V5 | Learning loop validated — refinement proposal generated and reviewed |

### Gate criteria (platform readiness)

- [ ] Projection MAE within acceptable threshold (TBD in Phase 5 calibration)
- [ ] Optimizer produces valid lineups for all contest types
- [ ] Learning loop completes with proposals
- [ ] Evidence trail auditable end-to-end
- [ ] Mission Control operational for observe/configure/audit

---

## Maturity progression

| Phase complete | Target maturity |
|----------------|-----------------|
| Phase 6 (M12) | L1 — Guided |
| Phase 8 (V3) | L2 — Governed |
| Phase 8 (V5) | L2+ — Governed with learning |
| Post-validation (20+ slates) | L3 — Autonomous Decision |

---

## Model assignment summary

| Work | Model |
|------|-------|
| Architecture, data design, agent design, formulas | GPT-5.5 |
| TypeScript, React, Next.js, Prisma, tests, UI | Composer 2.5 |
| Code review | Claude Opus |
| Test strategy, edge cases, coverage gaps | GPT-5.5 |

---

## Future capabilities (post-v1)

All deferred scope is tracked in [BACKLOG.md](./BACKLOG.md). Promote to Version 2 only after Task 15 validation and charter amendment.

Includes: other sports, other platforms, NFL Showdown, automated submission, mobile, public API, and multi-sport coordination.

---

## Related documents

- [VISION.md](./VISION.md) — Mission and maturity model
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Platform architecture
- [AGENTS.md](./AGENTS.md) — Agent specifications
- [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) — Implementation structure
