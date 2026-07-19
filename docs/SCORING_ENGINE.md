# Alpha DFS AI — Scoring Engine

**Status:** Task 7 — EIL v2 framework  
**Version:** 2.0  
**Date:** 2026-07-18  
**Parent:** [ARCHITECTURE.md](./ARCHITECTURE.md) · [EXTERNAL_INTELLIGENCE_LAYER.md](./architecture/EXTERNAL_INTELLIGENCE_LAYER.md)

> Player evaluation framework. Statistical models are the foundation; EIL contributes weighted evidence.  
> Platform becomes more accurate over time via Source Performance Intelligence — not by consuming predictions blindly.

---

## Design philosophy

```text
STATISTICAL FOUNDATION (primary)          EIL (weighted evidence)
──────────────────────────────           ─────────────────────────
College · Rookie · Veteran · Injury  →   Expert Consensus
Statistical Projection Score         →   Community Sentiment
Vegas · Weather · Opportunity        →   Market Confidence
                                                    │
                                                    ▼
                                         SCORING ENGINE
                                                    │
                                                    ▼
                              Overall DFS Rating + Evidence Explanation
                                                    │
                                                    ▼
                                              OPTIMIZER
```

**Deterministic:** Aggregation, Market Confidence, Overall DFS Rating, value calculation.  
**AI-assisted:** Expert consensus synthesis, community theme summarization.  
**Learning loop:** Source Reliability weights from Agent 16 adjust expert evidence over time.

Every recommendation explains **which evidence contributed most** to the score.

---

## Player evaluation framework (v2)

| Dimension | Range | Source | Role |
|-----------|-------|--------|------|
| **Statistical Projection Score** | 0–100 | Agents 2–6 | **Foundation** — normalized statistical projection |
| **Expert Consensus Score** | 0–100 | Agent 14 (EIL) | Weighted expert agreement |
| **Community Sentiment Score** | 0–100 | Agent 15 (EIL) | Sentiment and theme strength |
| **Market Confidence Score** | 0–100 | Derived | Statistical + expert + community + Vegas alignment |
| **Rookie Opportunity Score** | 0–100 | Agents 3 + Opportunity | Rookie context + role opportunity |
| **Ownership Score** | 0–100 | Agent 7 | Field ownership context |
| **Leverage Score** | 0–100 | Agent 7 | Projection vs ownership advantage |
| **Risk Score** | 0–100 | Agent 5 + volatility | Injury, floor gap, uncertainty |
| **Confidence Score** | 0–1 | Composite | Model and data certainty |
| **Overall DFS Rating** | 0–100 | Weighted composite | Primary optimizer input |

Lifecycle scores (College, Rookie, Veteran) feed **Statistical Projection Score** — they are inputs, not separate optimizer-facing dimensions for veterans.

---

## Statistical Projection Score

**Primary driver.** Derived from statistical intelligence agents — not from external predictions.

| Input | Weight (default) |
|-------|------------------|
| Agent 6 mean projection vs slate peers | 40% |
| College / Rookie / Veteran lifecycle scores | 25% |
| Opportunity Score | 20% |
| Injury risk adjustment | 10% |
| Vegas / weather context | 5% |

External expert projections do **not** feed this score directly. They feed Expert Consensus Score separately.

---

## Expert Consensus Score

Compare sources — never rely on a single expert.

| Input | Weight (default) |
|-------|------------------|
| Normalized expert rankings | 30% |
| Expert point projections vs slate peers | 30% |
| Start/sit alignment | 15% |
| Source agreement level | 15% |
| Disagreement penalty | 10% (inverse) |

**Weighted by Source Reliability Score** (Agent 16) per provider. Sources with better historical accuracy receive higher weight on subsequent runs.

---

## Community Sentiment Score

Recurring patterns — not individual posts as facts.

| Input | Weight (default) |
|-------|------------------|
| Sentiment direction | 30% |
| Theme recurrence across sources | 25% |
| Discussion volume vs slate average | 25% |
| High-conviction / contrarian signals | 20% |

**Cap:** Community Sentiment contributes ≤ 10% of Overall DFS Rating by default.

---

## Market Confidence Score

Deterministic alignment across intelligence types.

```text
Market Confidence = f(
  statistical_projection_percentile,
  expert_consensus_percentile,
  community_sentiment_direction,
  vegas_implied_total_percentile,
  source_agreement_level
)
```

High = signals align. Low = conflicting evidence → reduced Confidence Score.

---

## Rookie Opportunity Score

Combined rookie evaluation and opportunity for year-1 (and partial year-2) players.

| Input | Weight (default) |
|-------|------------------|
| Rookie Score (Agent 3) | 40% |
| Opportunity Score | 35% |
| Draft capital / landing spot | 15% |
| Expert rookie consensus (EIL) | 10% |

Veterans: this dimension excluded; Opportunity folds into Statistical Projection Score.

---

## Overall DFS Rating

Default weights — statistical foundation dominant:

| Component | Weight |
|-----------|--------|
| Statistical Projection Score | 30% |
| Expert Consensus Score | 12% |
| Rookie Opportunity Score | 10% (rookies only; redistributed if N/A) |
| Leverage Score | 10% |
| Market Confidence Score | 8% |
| Community Sentiment Score | 8% |
| Ownership Score (inverted for GPP) | 7% |
| Risk Score (inverted) | 8% |
| Confidence Score (scaled) | 7% |

**EIL cap:** Expert + Community combined ≤ 22% unless user configures in Settings.

**Source reliability:** Agent 16 adjusts per-provider weights within Expert Consensus — governed, versioned, never silent.

---

## Evidence explanation (required)

Every player score includes a ranked contribution breakdown for UI display:

```json
{
  "overallDfsRating": 87,
  "topContributors": [
    { "dimension": "statisticalProjection", "value": 91, "weight": 0.30, "contribution": 27.3,
      "summary": "18.7 projected pts — 88th percentile at WR" },
    { "dimension": "expertConsensus", "value": 85, "weight": 0.12, "contribution": 10.2,
      "summary": "Strong — 8/10 major sources rank top 10" },
    { "dimension": "communitySentiment", "value": 72, "weight": 0.08, "contribution": 5.8,
      "summary": "Positive — high volume, favorable themes" },
    { "dimension": "marketConfidence", "value": 88, "weight": 0.08, "contribution": 7.0,
      "summary": "High — favorable implied total and matchup" }
  ],
  "optimizerRationale": "High value vs salary; positive stack correlation"
}
```

---

## Accuracy-over-time integration

| Stage | Action |
|-------|--------|
| At lock | Store all expert/community signals with analysis run ID |
| Post-slate | Agent 16 compares signals to actual fantasy points |
| Evaluate | Compute per-source, per-position, per-signal-type accuracy |
| Update | Source Reliability Scores (governed approval) |
| Next run | Expert Consensus uses updated reliability weights |

The platform improves by **measuring what worked** — not by assuming CBS, FantasyPros, or Reddit is always right.

---

## Prediction Confidence Engine integration (Phase 1.5)

After Overall DFS Rating is computed, **PCE** (Task 9.1) evaluates confidence and stability per player. PCE outputs feed PIE lineup ranking and Portfolio Simulation.

Player-level Confidence Score in Scoring Engine is **supplemented** by PCE's multi-factor Confidence Score, Prediction Stability, and Reliability Grade.

See [PREDICTION_CONFIDENCE_ENGINE.md](./PREDICTION_CONFIDENCE_ENGINE.md).

---

## Related documents

- [EXTERNAL_INTELLIGENCE_LAYER.md](./architecture/EXTERNAL_INTELLIGENCE_LAYER.md) — EIL v2
- [AGENTS.md](./AGENTS.md) — Agents 14–16
- [DATA_MODEL.md](./DATA_MODEL.md) — EIL entities
