# Alpha DFS AI — Agent Architecture

**Status:** Task 6 — Updated for Phase 1 build  
**Version:** 2.0  
**Date:** 2026-07-18  
**Parent:** [ARCHITECTURE.md](./ARCHITECTURE.md) · [PROJECT_CHARTER.md](../PROJECT_CHARTER.md)

> Specialized agent and engine specifications. Manual "Analyze Slate" trigger only.  
> Implementation begins Task 11 (Backend).

---

## Agent taxonomy

| Category | Components | Type |
|----------|------------|------|
| **Core** | Data Collection · Statistical Intelligence · Projection · Evidence Engine · Scoring Engine · **PCE** · **Simulation** | Engines + agents |
| **Slate** | **Slate Intelligence** | Pre-evaluation context |
| **Football** | College · Rookie · Veteran · Injury · **Matchup** | Intelligence agents |
| **External (EIL)** | Expert · Community · **Market** · Source Performance | EIL agents |
| **Decision** | Ownership · Correlation · Contest Strategy · **Portfolio Construction (PIE)** | Policy + PIE |
| **Learning** | Learning · **Optimizer Performance** | Post-analysis (optional v1) |

---

## Orchestration model

```text
Slate Supervisor  (IDLE → ANALYZING → COMPLETE)
│
├── INGEST       → Data Collection + Statistical Intelligence
├── SLATE        → Agent 21: Slate Intelligence
├── EIL          → Expert (14) · Community (15) · Market (20) [parallel]
├── EVALUATE     → College (2) · Rookie (3) · Veteran (4) · Injury (5) · Matchup (18) [parallel]
├── PROJECT      → Projection (6)
├── FIELD        → Ownership (7) · Correlation (9) [parallel]
├── EVIDENCE     → Evidence Engine
├── SCORE        → Scoring Engine
├── CONFIDENCE   → Prediction Confidence Engine (PCE)
├── STRATEGIZE   → Contest Strategy (11) + Dynamic Portfolio Strategy
├── PIE          → Agent 17 — Primary + Hail Mary (uses PCE for ranking)
├── SIMULATE     → Portfolio Simulation Engine
├── REPORT       → Reports + Portfolio Health
└── LEARN        → Learning (13) · Source Performance (16) · Optimizer Performance (19) [optional]
```

Evidence Engine runs **after** all intelligence agents, **before** Scoring Engine.

---

## Agent summary

| # | Agent | Type | Primary output |
|---|-------|------|----------------|
| 1 | Data Collection | Deterministic | Normalized DB records |
| 2 | College Intelligence | AI + Deterministic | College Score |
| 3 | Rookie Intelligence | AI + Deterministic | Rookie Score |
| 4 | Veteran Intelligence | AI + Deterministic | Veteran Score |
| 5 | Injury Intelligence | AI + Deterministic | Injury Risk Score |
| 6 | Projection | AI | Projected Fantasy Points |
| 7 | Ownership Prediction | AI + Statistical | Projected Ownership, Leverage |
| 8 | Value | Deterministic | Value Score |
| 9 | Correlation | AI + Statistical | Stack recommendations |
| 11 | Contest Strategy | Rules + AI context | Strategy profile |
| 12 | Bankroll | Deterministic | Allocation policy (optional v1) |
| 13 | Learning | AI + Deterministic | Refinement proposals (optional v1) |
| 14 | Expert Intelligence (EIL) | AI + Deterministic | Expert Consensus Score |
| 15 | Community Intelligence (EIL) | AI | Community Sentiment Score |
| 16 | Source Performance (EIL) | Deterministic + AI | Source Reliability Score |
| **17** | **Portfolio Construction (PIE)** | Deterministic | Primary + Hail Mary portfolios |
| 18 | Matchup Intelligence | AI + Deterministic | Matchup context |
| 19 | Optimizer Performance | Deterministic + AI | PIE long-term evaluation (Task 9.7) |
| 20 | Market Intelligence | Deterministic + AI | Market evidence |
| 21 | Slate Intelligence | AI + Deterministic | Slate Grade, strategy recommendation |
| — | Portfolio Intelligence Engine | Deterministic | PIE — Agent 17 + optimizers |
| — | Evidence Engine | Deterministic | Player Evidence Package |
| — | Scoring Engine | Deterministic | Overall DFS Rating |
| — | Prediction Confidence Engine | Deterministic | Confidence, stability (Task 9.1) |
| — | Portfolio Simulation Engine | Deterministic | Monte Carlo metrics (Task 9.5) |

**Recommended model:** GPT-5.5 for design; Composer 2.5 for Portfolio Construction implementation.

Spec references: [PHASE_1_5_ENHANCEMENT_CHARTER.md](./PHASE_1_5_ENHANCEMENT_CHARTER.md) · [PORTFOLIO_INTELLIGENCE_ENGINE.md](./architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md) · [PREDICTION_CONFIDENCE_ENGINE.md](./PREDICTION_CONFIDENCE_ENGINE.md)

---

## Agent 1 — Data Collection

### Responsibilities

- Collect player data from all configured sources
- Normalize to canonical schema ([DATA_MODEL.md](./DATA_MODEL.md))
- Validate freshness and completeness
- Upsert database records
- Flag stale or missing critical data

### Inputs

| Input | Source |
|-------|--------|
| Source configurations | Mission Control / env |
| Slate schedule | DraftKings / manual |
| External API responses | College, NFL, Vegas, weather, injuries, salaries |

### Outputs

| Output | Destination |
|--------|-------------|
| Normalized entities | PostgreSQL |
| Ingestion report | Slate Supervisor |
| Freshness alerts | Mission Control |

### Authority

- **May:** Write raw and normalized data; mark records stale
- **May not:** Score players, project points, or generate lineups

### Failure modes

- Missing salary data → block SCORE phase
- Stale injury data → warn + reduce confidence on affected players
- Source API failure → retry with backoff; fail-closed after threshold

---

## Agent 2 — College Intelligence

### Responsibilities

- Analyze college careers for relevant players (rookies, 2nd-year)
- Evaluate strength of schedule and conference quality
- Compute advanced metrics (EPA, dominator rating, etc.)
- Identify development trends (year-over-year improvement)
- Synthesize qualitative context where available

### Inputs

| Input | Source |
|-------|--------|
| `CollegeStats` | Database |
| Player position, draft capital | `Player`, `DraftClass` |
| Conference metadata | Reference data |

### Outputs

| Output | Field |
|--------|-------|
| College Score | 0–100 |
| Sub-factors | SOS, conference, production, trend |
| Evidence bundle | Reasoning + source refs |

### Scoring factors (deterministic base)

| Factor | Weight (default) |
|--------|------------------|
| Production vs peers | 30% |
| Strength of schedule | 20% |
| Conference quality | 15% |
| Advanced metrics | 20% |
| Development trend | 15% |

AI layer interprets qualitative gaps (transfer portal, scheme change) and adjusts confidence — not raw formula output without governance.

---

## Agent 3 — Rookie Intelligence

### Responsibilities

- Evaluate draft capital and landing spot
- Analyze athletic profile (combine, RAS)
- Incorporate camp reports and coach quotes (AI synthesis)
- Assess preseason usage and opportunity
- Project role trajectory

### Inputs

| Input | Source |
|-------|--------|
| `DraftClass` | Database |
| `DepthChart` | Database |
| Preseason stats | NFLStats / GameLogs |
| Qualitative reports | News APIs, manual input |

### Outputs

| Output | Field |
|--------|-------|
| Rookie Score | 0–100 |
| Sub-factors | Draft capital, landing spot, athletic, opportunity |
| Evidence bundle | Reasoning + source refs |

### Scoring factors (default weights)

| Factor | Weight |
|--------|--------|
| Draft capital | 25% |
| Landing spot / team context | 25% |
| Athletic profile (RAS, combine) | 20% |
| Camp / preseason opportunity | 20% |
| Coach/system fit (AI) | 10% |

---

## Agent 4 — Veteran Intelligence

### Responsibilities

- Analyze usage trends (targets, carries, snap %)
- Apply age curve adjustments by position
- Evaluate target share and red zone role
- Assess efficiency metrics (yards per route, YPC, etc.)
- Review injury history and durability

### Inputs

| Input | Source |
|-------|--------|
| `NFLStats`, `GameLogs` | Database |
| `DepthChart` | Database |
| `InjuryReport` | Database |
| Player age | `Player` |

### Outputs

| Output | Field |
|--------|-------|
| Veteran Score | 0–100 |
| Sub-factors | Usage, efficiency, age curve, injury risk |
| Evidence bundle | Reasoning + source refs |

### Scoring factors (default weights)

| Factor | Weight |
|--------|--------|
| Usage trend (3/5/8 game windows) | 30% |
| Efficiency metrics | 25% |
| Role stability | 20% |
| Age curve adjustment | 15% |
| Injury history | 10% |

---

## Agent 5 — Injury Intelligence

### Responsibilities

- Monitor practice participation and game status reports
- Assess injury risk and expected workload impact
- Synthesize beat reporter and official injury designations
- Flag players for projection downgrade or exclusion
- Produce injury risk score feeding Risk Rating

### Inputs

| Input | Source |
|-------|--------|
| `InjuryReport` | Database (ingested at analysis start) |
| Practice reports | Data Collection |
| Historical durability | `GameLogs`, `NFLStats` |
| Depth chart impact | `DepthChart` |

### Outputs

| Output | Field |
|--------|-------|
| Injury Risk Score | 0–100 (high = elevated risk) |
| Status classification | `healthy` · `monitor` · `fade` · `exclude` |
| Evidence bundle | Reasoning + source refs |

### Authority

- **May:** Recommend projection adjustments and optimizer exclusion
- **May not:** Override optimizer constraints directly — passes flags to Projection and Optimizer inputs

---

## Agent 6 — Projection

### Responsibilities

- Synthesize all intelligence into projected fantasy points
- Produce ceiling, floor, and mean projections
- Calibrate confidence based on data quality
- Explain projection drivers

### Inputs

| Input | Source |
|-------|--------|
| College, Rookie, Veteran scores | Agents 2–4 |
| Player scores (full profile) | Scoring Engine |
| Vegas odds, weather | Database |
| Historical game logs | Database |
| Opponent defense rankings | Derived |

### Outputs

| Output | Field |
|--------|-------|
| `projectedPoints` | Float |
| `ceiling`, `floor` | Float |
| `confidence` | 0–1 |
| Evidence bundle | Top drivers, reasoning |

### Authority

- **May:** Recommend point projections
- **May not:** Override optimizer or set final lineup

### Model approach

- Base projection: deterministic regression on historical comparable players
- AI adjustment layer: contextual modifiers (game script, narrative, injury uncertainty)
- All adjustments logged in evidence bundle

---

## Agent 7 — Ownership Prediction

### Responsibilities

- Predict projected ownership by contest type
- Classify chalk tiers (core, popular, contrarian, punt)
- Compute leverage (projection percentile vs ownership)
- Model contest popularity effects

### Inputs

| Input | Source |
|-------|--------|
| Projections | Agent 6 |
| Salaries | SlatePlayer |
| Historical ownership | Past slates |
| Vegas odds (chalk indicators) | Game |
| Name value / narrative | AI assessment |

### Outputs

| Output | Field |
|--------|-------|
| `projectedOwnership` | 0–1 overall |
| Field-size variants | SE, 3-max, 150-max |
| `leverage` | Float |
| `chalkTier` | Enum |
| Evidence bundle | Reasoning |

---

## Agent 8 — Value

### Responsibilities

- Calculate value score: projected fantasy points per dollar of salary
- Rank players by position and slate-wide
- Identify mispriced players (value plays, fades)

### Inputs

| Input | Source |
|-------|--------|
| Projections | Agent 6 |
| Salaries | SlatePlayer |

### Outputs

| Output | Formula |
|--------|---------|
| Value Score | `(projectedPoints / salary) * 1000` |
| Value rank | Position and overall |
| Value tier | `elite` · `good` · `fair` · `poor` |

### Authority

Fully deterministic. No AI interpretation.

---

## Agent 9 — Correlation

### Responsibilities

- Identify optimal stacks (QB + WR, QB + TE)
- Evaluate bring-back correlations (game stacks)
- Assess game environment correlations (high total games)
- Recommend mini-stack and onslaught configurations

### Inputs

| Input | Source |
|-------|--------|
| Projections | Agent 6 |
| Vegas totals, spreads | Game |
| Historical co-occurrence | Past slates |
| Team pass/run tendency | NFLStats |

### Outputs

| Output | Description |
|--------|-------------|
| Stack recommendations | `{ players, correlation, gameEnv }` |
| Correlation matrix | Player-pair coefficients |
| Evidence bundle | Stack rationale |

### Stack types

| Type | Example |
|------|---------|
| Primary | QB + WR1 |
| Secondary | QB + WR + TE |
| Bring-back | Team A QB + Team B WR (same game) |
| Game stack | Multiple players from high-total game |
| RB + DST anti-correlation | Flag negative correlations |

---

## Agent 17 — Portfolio Construction Agent (PIE)

**Parent:** [PORTFOLIO_INTELLIGENCE_ENGINE.md](./architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md)  
**Model:** GPT-5.5 (design) · Composer 2.5 (implementation)

Orchestrates the **Portfolio Intelligence Engine**. Sole authority for roster construction.

### Responsibilities

- Build optimized lineup portfolios on user Analyze Slate trigger  
- Generate Primary Portfolio (Strategy A — 3–5 lineups)  
- Generate Hail Mary Portfolio (Strategy B — 2–3 lineups)  
- Balance player exposure across portfolio  
- Ensure lineup diversity (FR-19)  
- Rank lineups within each portfolio type  
- Explain lineup selection (FR-18)  

### Inputs

Projection Engine · Ownership Engine · Correlation Engine · Expert Intelligence · Community Intelligence · Market Intelligence · Rookie Intelligence · Salary Data · Scoring Engine output · Contest Strategy

### Outputs

Ranked Primary Portfolio · Ranked Hail Mary Portfolio · Portfolio Summary · Portfolio Metrics · LineupExplainability records

**See:** [PORTFOLIO_INTELLIGENCE_ENGINE.md](./architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md) for FR-16–19, Strategy A/B, and explainability schema.

---

## Agent 10 — Lineup Optimizer (legacy reference)

Superseded by **Agent 17** and **Portfolio Intelligence Engine**. Algorithm detail retained in [LINEUP_OPTIMIZER.md](./LINEUP_OPTIMIZER.md).

### Responsibilities

- Build optimal lineups under DraftKings constraints
- Incorporate salary, ownership, correlation, exposure, projection, risk
- Generate single or multi-lineup sets per contest strategy
- Enforce stack rules and diversity requirements

### Inputs

| Input | Source |
|-------|--------|
| Projections, ownership, value | Agents 5–7 |
| Correlation recommendations | Agent 9 |
| Strategy profile | Agent 11 |
| Bankroll exposure limits | Agent 12 |
| Slate roster rules | Slate config |

### Outputs

| Output | Description |
|--------|-------------|
| Lineups | Roster with slots |
| Optimizer metadata | Objective value, binding constraints |
| Evidence bundle | Why each player selected |

### Authority

**Sole authority for roster construction.** Deterministic optimization — see [LINEUP_OPTIMIZER.md](./LINEUP_OPTIMIZER.md).

**Implementation model:** GPT-5.5 for algorithm design; Composer 2.5 for implementation.

---

## Agent 11 — Contest Strategy

### Responsibilities

- Apply contest-type-specific logic
- Configure optimizer objective weights
- Define stack rules and exposure limits per contest
- Adapt lineup count and diversity requirements

### Contest types

| Type | Strategy emphasis |
|------|-------------------|
| Cash (50/50, double-up) | Floor, consistency, low ownership variance |
| Single Entry GPP | Balanced ceiling + leverage |
| 3-Max | Moderate diversity, targeted stacks |
| 150-Max | Maximum diversity, contrarian plays, correlation leverage |

NFL Showdown and other contest formats → [BACKLOG.md](./BACKLOG.md).

### Inputs

| Input | Source |
|-------|--------|
| Contest configuration | Mission Control |
| Bankroll policy | Agent 12 |
| Slate context | Slate Supervisor |

### Outputs

| Output | Destination |
|--------|-------------|
| `StrategyProfile` | Optimizer |
| Lineup count | Optimizer |
| Evidence bundle | Strategy rationale |

---

## Agent 12 — Bankroll

### Responsibilities

- Track ROI and cumulative performance
- Enforce risk and exposure limits
- Allocate bankroll across contest types
- Monitor per-player and per-team exposure
- Block lineup export on policy violation

### Inputs

| Input | Source |
|-------|--------|
| Bankroll policy | Mission Control config |
| Historical results | SlateResult, BankrollRecord |
| Proposed lineups | Agent 17 (PIE) |

### Outputs

| Output | Description |
|--------|-------------|
| Allocation policy | Max entries, fees, contest mix |
| Exposure limits | Per-player caps across lineups |
| Policy gate | Pass/fail for export |
| ROI report | Period performance |

### Authority

Hard gates — optimizer and export respect bankroll limits without override.

---

## Agent 13 — Learning

### Responsibilities

- After every slate: compare projections to actual results
- Analyze ownership prediction accuracy
- Study winning lineups and optimal hindsight lineups
- Identify systematic projection biases
- Propose model and weight refinements

### Inputs

| Input | Source |
|-------|--------|
| Projections at lock | Projection records |
| Actual results | SlatePlayer.fantasyPointsActual |
| Ownership actuals | SlatePlayer.ownershipActual |
| Winning lineups | External import or manual |
| Historical learning memory | LearningMemory |

### Outputs

| Output | Destination |
|--------|-------------|
| `LearningMemory` records | Database |
| Refinement proposals | Mission Control for approval |
| Accuracy metrics | Dashboard |

### Authority

- **May:** Analyze, propose adjustments, update metrics
- **May not:** Auto-apply model changes — governed approval required

Details: [LEARNING_ENGINE.md](./LEARNING_ENGINE.md)

---

## Agent 14 — Expert Intelligence (EIL v2)

**Parent:** [EXTERNAL_INTELLIGENCE_LAYER.md](./architecture/EXTERNAL_INTELLIGENCE_LAYER.md)  
**Model:** GPT-5.5

### Responsibilities

- Ingest expert rankings and projections from approved sources
- Normalize different scoring systems to common 0–100 scale
- Build Expert Consensus Score by **comparing sources** — never rely on one
- Detect disagreements between experts (source divergence)
- Detect projection changes over time (trend)
- Apply Source Reliability weights from Agent 16 when available

### Inputs

| Input | Source |
|-------|--------|
| Raw expert artifacts | EIL Connector Layer |
| Player identity map | `Player`, `SlatePlayer` |
| Prior run signals | `ExpertSignal` (historical) |
| Source reliability weights | Agent 16 (when available) |

### Outputs

| Output | Field |
|--------|-------|
| Expert Consensus Score | 0–100 |
| Confidence Score | 0–1 |
| Projection Trend | `up` · `stable` · `down` |
| Source Agreement Level | 0–1 |
| Expert Disagreement Flag | Boolean — high divergence between sources |
| Evidence bundle | Per-source breakdown with reliability weights |

### Failure modes

- Single expert source down → continue with remaining sources; reduce agreement confidence
- All expert sources down → warn; pipeline continues without Expert Consensus

---

## Agent 15 — Community Intelligence (EIL v2)

**Parent:** [EXTERNAL_INTELLIGENCE_LAYER.md](./architecture/EXTERNAL_INTELLIGENCE_LAYER.md)  
**Model:** GPT-5.5

### Responsibilities

- Analyze Reddit and other community discussions
- Detect trending players (breakout candidates, rookie buzz)
- Measure sentiment across recurring themes
- Identify high-conviction discussions
- Surface contrarian opportunities
- Summarize consensus themes — **never treat individual posts as facts**

### Inputs

| Input | Source |
|-------|--------|
| Raw community artifacts | EIL Connector Layer |
| Player identity map | `Player`, `SlatePlayer` |
| Prior sentiment | `CommunitySignal` (historical) |

### Outputs

| Output | Field |
|--------|-------|
| Community Sentiment Score | 0–100 |
| Trending | `up` · `down` · `neutral` |
| Confidence Level | 0–1 |
| Discussion Volume | Relative index vs slate average |
| Theme summary | Human-readable (evidence bundle) |

### Authority

- **May:** Influence Community Sentiment Score and projection confidence
- **May not:** Override statistical scores or optimizer constraints
- **Must:** Label all outputs as sentiment/themes, not verified facts

---

## Agent 16 — Source Performance Intelligence (EIL v2)

**Parent:** [EXTERNAL_INTELLIGENCE_LAYER.md](./architecture/EXTERNAL_INTELLIGENCE_LAYER.md)  
**Model:** GPT-5.5

Makes the platform **more accurate over time** by measuring source predictive performance — not assuming any source is always reliable.

### Responsibilities

Continuously evaluate how well each information source performs:

- Which source most accurately projected WR performance?
- Which source identified breakout rookies most effectively?
- Which source consistently overestimated player value?
- Which community signals preceded strong DFS performances?

Produce Source Reliability Score, Weekly Accuracy Report, and Historical Performance Dashboard. Feed reliability weights back to Agent 14 on subsequent runs.

### Inputs

| Input | Source |
|-------|--------|
| Expert signals at lock | `ExpertSignal` |
| Community signals at lock | `CommunitySignal` |
| Actual results | `SlatePlayer.fantasyPointsActual` |
| Historical performance | `SourcePerformanceRecord` |

### Outputs

| Output | Destination |
|--------|-------------|
| Source Reliability Score | Weights Expert Agent (14) |
| Weekly Accuracy Report | Mission Control / Reports |
| Historical Performance Dashboard | Mission Control |

### Authority

- **May:** Update Source Reliability Scores and produce reports
- **May not:** Auto-apply weight changes without governed approval
- **Must:** Version all reliability updates for audit

### Phase

Runs in **LEARN** phase when historical results exist. Initial runs use equal expert weights until sufficient history accumulates.

---

## Agent 19 — Optimizer Performance Agent (Task 9.7)

**Model:** GPT-5.5

Tracks long-term **Portfolio Intelligence Engine** performance. **Must not auto-change scoring weights** — governed approval only.

### Measures

- Projection accuracy vs actuals  
- Lineup and portfolio performance  
- Primary portfolio success rate  
- Hail Mary portfolio success rate  
- Stack performance  
- Rookie recommendation accuracy  
- Expert source contribution to portfolio quality  
- Community signal contribution  
- Market signal contribution  
- Simulation accuracy (predicted vs actual distribution)

### Outputs

Performance reports · Accuracy dashboards · Refinement **proposals** (not auto-applied)

### Authority

- **May:** Analyze, report, propose  
- **May not:** Silently modify PCE, Scoring, or PIE weights  

---

## Agent 21 — Slate Intelligence Agent (Task 9.2)

**Model:** GPT-5.5 · **Doc:** [SLATE_INTELLIGENCE.md](./architecture/SLATE_INTELLIGENCE.md)

Runs **after ingest, before** player intelligence agents.

### Responsibilities

Evaluate slate-wide: volatility · injury landscape · weather · ownership concentration · value distribution · viable stacks · scoring environment

### Outputs

Slate Grade · Volatility Score · Recommended Strategy · Confidence Rating

### Influences

Dynamic Portfolio Strategy (9.3) · PIE parameters · Portfolio Simulation spread

---

## Inter-agent contracts

All agents communicate through typed contracts in `@alpha-dfs/shared`:

```typescript
interface AgentResult<T> {
  agentId: string;
  agentVersion: SemVer;
  slateId: string;
  phase: PipelinePhase;
  status: "success" | "partial" | "failed";
  output: T;
  evidenceBundleId: string;
  errors?: AgentError[];
  durationMs: number;
}
```

Agents do not call each other directly. Slate Supervisor dispatches phases and passes outputs via the database or in-memory context store.

---

## Error handling

| Severity | Behavior |
|----------|----------|
| Critical | Halt pipeline; alert Mission Control |
| Warning | Continue with reduced confidence flag |
| Info | Log only |

Critical failures: missing salaries, optimizer infeasibility, bankroll policy violation at export.

---

## Related documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Pipeline overview
- [SCORING_ENGINE.md](./SCORING_ENGINE.md) — Score aggregation
- [LINEUP_OPTIMIZER.md](./LINEUP_OPTIMIZER.md) — Optimizer design
- [EXTERNAL_INTELLIGENCE_LAYER.md](./architecture/EXTERNAL_INTELLIGENCE_LAYER.md) — EIL architecture
