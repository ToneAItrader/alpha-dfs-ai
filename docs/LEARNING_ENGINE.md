# Alpha DFS AI — Learning Engine

**Status:** Phase 1 — Architecture contract only  
**Version:** 1.0  
**Date:** 2026-07-18  
**Parent:** [ARCHITECTURE.md](./ARCHITECTURE.md)

> Post-slate learning loop design. Compares predictions to outcomes and proposes governed refinements.  
> No implementation until Phase 6 authorization.

---

## Purpose

The Learning Engine closes the slate cycle. After every slate completes, it measures prediction accuracy, identifies systematic errors, studies winning lineup patterns, and proposes model refinements — without silent drift.

Learning is **proposal-based**. Changes require operator review and approval before weights or formulas update.

---

## Learning cycle

```text
SLATE COMPLETE
      │
      ▼
┌─────────────────┐
│  Collect Results │  Actual points, ownership, winning scores
└────────┬────────┘
         ▼
┌─────────────────┐
│  Measure Error   │  Projection MAE, ownership error, value miss
└────────┬────────┘
         ▼
┌─────────────────┐
│  Analyze Patterns│  Position, salary tier, stack type, chalk
└────────┬────────┘
         ▼
┌─────────────────┐
│  Compare Optimal │  Hindsight optimal vs our lineups
└────────┬────────┘
         ▼
┌─────────────────┐
│  Generate Report │  LearningMemory + dashboard
└────────┬────────┘
         ▼
┌─────────────────┐
│  Propose Changes │  Weight/formula adjustments
└────────┬────────┘
         ▼
┌─────────────────┐
│  Await Approval  │  Operator review in Mission Control
└────────┬────────┘
         ▼
   [Approved] → Version bump → Apply → Next slate
   [Rejected] → Log → No change
```

---

## Analysis dimensions

### 1. Projection error

Compare locked projections to actual fantasy points.

| Metric | Formula |
|--------|---------|
| MAE | Mean absolute error across slate |
| RMSE | Root mean squared error |
| Bias | Mean (actual − projected) — systematic over/under |
| Calibration | Bucket by confidence; check actual hit rate |

Segmented analysis:

| Segment | Purpose |
|---------|---------|
| By position | QB vs RB vs WR bias detection |
| By salary tier | Punt vs mid vs stud accuracy |
| By rookie/veteran | Lifecycle model accuracy |
| By game total | High-scoring game environment miss |
| By injury status | Questionable tag accuracy |
| By weather | Weather-adjusted miss rate |

### 2. Ownership error

Compare projected ownership to actual (when available).

| Metric | Description |
|--------|-------------|
| Ownership MAE | Mean absolute ownership error |
| Chalk identification rate | % of >20% owned correctly flagged |
| Leverage hit rate | High-leverage plays that exceeded projection |
| Contrarian success | Low-owned plays that smashed |

### 3. Value identification

| Metric | Description |
|--------|-------------|
| Value play hit rate | Top-decile value scores that exceeded projection |
| Fade accuracy | Low value scores that underperformed |
| Salary efficiency | Points per dollar vs slate average |

### 4. Stack performance

| Metric | Description |
|--------|-------------|
| Primary stack hit rate | QB + pass catcher combined vs projection |
| Bring-back success | Game stack correlation accuracy |
| Optimal stack identification | Winning lineups' stacks vs our recommendations |

### 5. Lineup quality

| Metric | Description |
|--------|-------------|
| Optimal gap | Hindsight optimal points − our best lineup |
| Projection sum accuracy | Sum of our projections vs actual lineup total |
| Contest finish percentile | Rank vs field (when entered) |
| ROI | Profit/loss vs entry fees |

---

## Hindsight optimal lineup

After slate completes, compute the optimal lineup using **actual points** (not projections):

```text
Maximize: Σ (actualPoints[i] * x[i])
Subject to: DK roster constraints
```

Compare to our generated lineups:

| Comparison | Insight |
|------------|---------|
| Players in optimal not in ours | Missed value |
| Players in ours not in optimal | Overweighting error |
| Optimal stack vs our stacks | Correlation model gap |
| Salary left on table | Optimizer constraint issue |

---

## LearningMemory artifacts

Each analysis produces append-only `LearningMemory` records:

```typescript
interface LearningMemory {
  id: string;
  slateId: string;
  analysisType:
    | "projection_error"
    | "ownership_error"
    | "stack_performance"
    | "value_miss"
    | "lineup_quality"
    | "position_bias"
    | "weather_impact";
  findings: {
    summary: string;
    metrics: Record<string, number>;
    segments: SegmentAnalysis[];
    topMisses: PlayerMiss[];
    topHits: PlayerHit[];
  };
  proposedAdjustments: ProposedAdjustment[];
  approvalStatus: "pending" | "approved" | "rejected";
  modelVersionBefore: SemVer;
  modelVersionAfter?: SemVer;
  createdAt: string;
}
```

---

## Refinement proposals

### Proposal types

| Type | Example |
|------|---------|
| Scoring weight adjustment | Increase leverage weight for 150-max by 5% |
| Projection bias correction | Reduce QB projections by 1.2 points (systematic over) |
| Ownership model update | Adjust chalk threshold for primetime slates |
| Stack rule change | Require bring-back in games with total > 50 |
| Risk penalty adjustment | Increase injury risk weight for questionable tags |
| Rookie decay rate | Accelerate rookie score decay after week 4 |

### Proposal structure

```typescript
interface ProposedAdjustment {
  target: "scoring_engine" | "projection_model" | "ownership_model" | "optimizer" | "stack_rules";
  parameter: string;
  currentValue: number | string | boolean;
  proposedValue: number | string | boolean;
  rationale: string;
  expectedImpact: string;
  confidence: number;
  evidenceRefs: string[];
}
```

### Approval workflow

1. Learning Agent generates proposals after slate
2. Mission Control displays proposals with evidence
3. Operator reviews: approve, reject, or defer
4. Approved changes → version bump → apply to next slate
5. Rejected changes → logged with reason; no application

**No auto-apply.** Governance prevents silent model drift.

---

## Cumulative learning metrics

Tracked across seasons for maturity assessment:

| Metric | Target (L3+) |
|--------|----------------|
| Projection MAE trend | Decreasing over 8+ slates |
| Ownership MAE trend | Decreasing |
| Optimal gap trend | Decreasing |
| ROI (tracked bankroll) | Positive over 20+ slates |
| Approved refinements | Measurable MAE improvement post-apply |

Dashboard in Mission Control shows rolling 4/8/16 slate windows.

---

## Winning lineup analysis

When winning lineup data is available (import or manual):

| Analysis | Purpose |
|----------|---------|
| Ownership profile of winners | Field construction patterns |
| Stack frequency in top 1% | Correlation model validation |
| Salary allocation pattern | Studs vs scrubs vs balanced |
| Contrarian player frequency | Leverage model validation |
| Position spending distribution | Optimizer budget allocation |

Winning lineup data is optional input — learning proceeds with or without it using hindsight optimal as baseline.

---

## Agent 12 integration

The Learning Agent orchestrates the Learning Engine:

| Phase | Action |
|-------|--------|
| Trigger | Slate status → `complete` |
| Collect | Pull actuals, projections at lock, lineups |
| Analyze | Run all analysis dimensions |
| Compare | Hindsight optimal vs generated |
| Propose | Generate refinement proposals |
| Persist | Write LearningMemory records |
| Notify | Mission Control learning dashboard |

Agent 12 does not modify production models. It writes proposals only.

---

## Data requirements

| Data | Required | Source |
|------|----------|--------|
| Actual fantasy points | Yes | SlatePlayer post-slate update |
| Projections at lock | Yes | Projection records (immutable snapshot) |
| Generated lineups | Yes | Lineup records |
| Actual ownership | Optional | Import or estimated |
| Winning lineups | Optional | External import |
| Entry results | Optional | Manual or API |

Minimum viable learning: actual points + locked projections + our lineups.

---

## Backtesting (pre-live validation)

Before first live slate cycle, run historical backtests:

1. Load historical slate (salaries, actual points, ownership)
2. Run pipeline as if pre-lock (using only pre-lock available data)
3. Generate lineups
4. Score against actuals
5. Measure MAE, optimal gap, simulated ROI
6. Repeat across 8+ historical slates
7. Gate: MAE within acceptable threshold for certification

Backtest mode uses `@alpha-dfs/learning` with `mode: "backtest"`.

---

## Package structure (planned)

```text
packages/learning/
├── src/
│   ├── collect/           # Result aggregation
│   ├── analyze/
│   │   ├── projection-error.ts
│   │   ├── ownership-error.ts
│   │   ├── stack-performance.ts
│   │   ├── value-miss.ts
│   │   └── lineup-quality.ts
│   ├── optimal/           # Hindsight optimal solver
│   ├── propose/           # Refinement proposal generator
│   ├── backtest/          # Historical slate replay
│   ├── metrics/           # Cumulative metric tracking
│   └── index.ts
└── tests/
```

---

## Related documents

- [AGENTS.md](./AGENTS.md) — Agent 12 specification
- [SCORING_ENGINE.md](./SCORING_ENGINE.md) — Weight refinement targets
- [LINEUP_OPTIMIZER.md](./LINEUP_OPTIMIZER.md) — Hindsight optimal
- [DATA_MODEL.md](./DATA_MODEL.md) — LearningMemory entity
- [ROADMAP.md](./ROADMAP.md) — Learning phase gates
