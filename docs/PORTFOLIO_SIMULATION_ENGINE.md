# Portfolio Simulation Engine

**Status:** Task 9.5 — Architecture complete  
**Version:** 1.0  
**Date:** 2026-07-18  
**Parent:** [PHASE_1_5_ENHANCEMENT_CHARTER.md](./PHASE_1_5_ENHANCEMENT_CHARTER.md)

> Evaluate each recommended lineup through repeated simulated outcomes under plausible scenarios.  
> Runs after PIE, before Reports.

**Model:** GPT-5.5 (methodology) · Composer 2.5 (implementation)

---

## Pipeline position

```text
Portfolio Intelligence Engine → PORTFOLIO SIMULATION ENGINE → Reports
```

---

## Objective

Quantify expected performance under uncertainty — not just point projections. Answers: "How often does this lineup cash?" and "What's the tournament upside?"

---

## Simulation methodology

### Input per lineup

- Player projections (mean, floor, ceiling)
- PCE variance ratings and confidence
- Ownership estimates
- Correlation structure (stacks)
- Slate Intelligence volatility score

### Scenario generation

Monte Carlo simulation — default **10,000 iterations** per lineup (configurable):

```text
For each iteration:
  Sample player outcome from distribution (truncated normal or empirical)
  Apply correlation adjustments within stacks
  Sum lineup fantasy points
  Record outcome
```

Distribution parameters derived from projection floor/ceiling and PCE variance rating.

### Slate context

Slate Intelligence **Volatility Score** widens or narrows outcome distributions:

| Volatility | Distribution spread |
|------------|---------------------|
| Low | Tighter — floor/ceiling closer to mean |
| High | Wider — fat tails for GPP relevance |

---

## Outputs per lineup

| Metric | Description |
|--------|-------------|
| Median fantasy points | 50th percentile outcome |
| High-percentile (90th) | Upside scenario |
| Ceiling | 95th percentile |
| Floor | 5th percentile |
| Cash rate | % iterations exceeding cash threshold (configurable, e.g. 150 pts) |
| Tournament upside | % iterations in top-decile GPP range |
| Relative portfolio strength | Rank vs other lineups in same portfolio |

### Aggregate outputs

| Output | Description |
|--------|-------------|
| Simulation Summary | JSON report per portfolio type |
| Risk Metrics | Floor spread, downside deviation |
| Upside Metrics | Ceiling, 90th percentile, GPP hit rate |
| Stability Metrics | Outcome variance, PCE alignment |

---

## Portfolio-level analysis

Compare Primary vs Hail Mary portfolios:

| Comparison | Purpose |
|------------|---------|
| Median vs ceiling spread | Primary should have tighter distribution |
| Tournament upside rate | Hail Mary should dominate |
| Cash rate | Primary should dominate |
| Risk-adjusted rank | Confidence-weighted simulation rank |

Feeds **Portfolio Health Dashboard** (Task 9.6).

---

## Integration

| Consumer | Use |
|----------|-----|
| Portfolio Health Dashboard | Portfolio Grade, Overall Risk |
| Reports | Simulation Summary export |
| Optimizer Performance Agent | Compare simulated vs actual (post-slate) |
| UI Simulation Results Viewer | Task 10 |

---

## Performance targets

| Scenario | Target |
|----------|--------|
| Single lineup simulation | < 500ms |
| Full portfolio (8 lineups) | < 5 seconds |
| Memory | Bounded — no unbounded iteration storage |

Store summary statistics only — not all 10,000 raw iterations (optional debug mode).

---

## Package structure (planned)

```text
packages/portfolio-simulation/
├── src/
│   ├── monte-carlo.ts
│   ├── distributions.ts
│   ├── correlation-adjust.ts
│   ├── metrics.ts
│   └── index.ts
└── tests/
```

Exports: `@alpha-dfs/portfolio-simulation`

---

## Related documents

- [PREDICTION_CONFIDENCE_ENGINE.md](./PREDICTION_CONFIDENCE_ENGINE.md)
- [PORTFOLIO_INTELLIGENCE_ENGINE.md](./architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md)
- [architecture/SLATE_INTELLIGENCE.md](./architecture/SLATE_INTELLIGENCE.md)
