# Prediction Confidence Engine (PCE)

**Status:** Task 9.1 — Architecture complete  
**Version:** 1.0  
**Date:** 2026-07-18  
**Parent:** [PHASE_1_5_ENHANCEMENT_CHARTER.md](./PHASE_1_5_ENHANCEMENT_CHARTER.md)

> Evaluates confidence and stability of every player projection and recommended lineup.  
> Runs after Scoring Engine, before Portfolio Intelligence Engine.

**Model:** GPT-5.5 (design) · Composer 2.5 (implementation)

---

## Pipeline position

```text
Scoring Engine → PREDICTION CONFIDENCE ENGINE → Portfolio Intelligence Engine → Simulation
```

PIE uses PCE outputs when **ranking lineups**. Simulation Engine uses PCE for scenario weighting.

---

## Evaluation factors

| Factor | Source | Weight (default) |
|--------|--------|------------------|
| Data completeness | Evidence Quality Score | 15% |
| Injury uncertainty | Injury Intelligence | 15% |
| Projection variance | Projection floor/ceiling spread | 12% |
| Statistical model agreement | Internal model consistency | 10% |
| Expert source agreement | Expert Intelligence | 12% |
| Community sentiment consistency | Community Intelligence | 8% |
| Market alignment | Market Intelligence | 10% |
| Historical model accuracy | Learning / Source Performance | 10% |
| Weather certainty | Weather evidence | 8% |

---

## Player-level outputs

| Output | Range | Description |
|--------|-------|-------------|
| Confidence Score | 0–100 | Composite prediction confidence |
| Prediction Stability | 0–100 | Low variance + high agreement = stable |
| Data Quality Score | 0–100 | From Evidence Engine quality |
| Variance Rating | Enum | `low` · `medium` · `high` |
| Reliability Grade | Enum | `A` · `B` · `C` · `D` · `F` |

---

## Lineup-level outputs

Aggregated from roster players + lineup structure:

| Output | Description |
|--------|-------------|
| Lineup Confidence Score | Weighted average with fragile-player penalty |
| Lineup Stability | Min/max spread of player stability |
| Lineup Data Quality | Average evidence quality |
| Lineup Variance Rating | Highest variance player drives floor |
| Lineup Reliability Grade | Composite grade |

**Fragile-player penalty:** Questionable injury + high variance → reduce lineup confidence even if mean projection is strong.

---

## Reliability grade mapping

| Grade | Confidence | Stability | Data Quality |
|-------|------------|-----------|--------------|
| A | ≥ 85 | ≥ 80 | ≥ 85 |
| B | ≥ 70 | ≥ 65 | ≥ 70 |
| C | ≥ 55 | ≥ 50 | ≥ 55 |
| D | ≥ 40 | — | — |
| F | < 40 | — | — |

---

## Integration

| Consumer | Use |
|----------|-----|
| PIE (Agent 17) | Rank Primary lineups by confidence-adjusted EV |
| Hail Mary Optimizer | Accept higher variance; weight ceiling over stability |
| Portfolio Simulation | Scenario probability weights |
| Portfolio Health Dashboard | Overall Confidence metric |
| UI Confidence Indicators | Badges on player/lineup cards |

---

## Package structure (planned)

```text
packages/prediction-confidence/
├── src/
│   ├── player-confidence.ts
│   ├── lineup-confidence.ts
│   ├── stability.ts
│   └── index.ts
└── tests/
```

Exports: `@alpha-dfs/prediction-confidence`

---

## Related documents

- [EVIDENCE_ENGINE.md](./EVIDENCE_ENGINE.md)
- [SCORING_ENGINE.md](./SCORING_ENGINE.md)
- [PORTFOLIO_INTELLIGENCE_ENGINE.md](./architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md)
