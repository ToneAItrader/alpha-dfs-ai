# External Intelligence Layer (EIL) v2

**Status:** Task 5.3 — Architecture  
**Version:** 2.0  
**Date:** 2026-07-18  
**Parent:** [PROJECT_CHARTER.md](../../PROJECT_CHARTER.md) · [ARCHITECTURE.md](../ARCHITECTURE.md)

> First-class intelligence capability that makes the platform **more accurate over time** — not simply a consumer of external predictions.  
> EIL ingests expert analysis, community sentiment, and market information, converts them into structured evidence, and feeds governed scoring. It **does not** override statistical projections or the optimizer.

---

## Mission

The External Intelligence Layer augments statistical models by ingesting expert analysis, community sentiment, and market information, converting them into structured evidence that contributes to lineup recommendations.

**Core objective:** Improve predictive accuracy over time by measuring which sources actually perform — then weighting evidence accordingly.

**Hard limits:**

- Does **not** override statistical projections
- Does **not** override the optimizer
- Does **not** treat community posts as facts

---

## Accuracy-over-time loop

EIL is designed as a learning system, not a prediction aggregator:

```text
Analysis Run
     │
     ▼
Ingest expert + community signals (at lock)
     │
     ▼
Apply Source Reliability weights (from historical performance)
     │
     ▼
Produce evidence-based scores → Optimizer
     │
     ▼
Slate completes → Actual results recorded
     │
     ▼
Source Performance Intelligence evaluates each source
     │
     ▼
Update Source Reliability Scores (governed, versioned)
     │
     ▼
Next analysis run uses improved weights
```

The platform becomes more accurate by **measuring predictive performance**, not by assuming any expert or community source is always correct.

---

## Architectural stance

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTELLIGENCE LAYER (EIL) v2                  │
│                                                                          │
│  ┌──────────────────────┐         ┌──────────────────────────────────┐  │
│  │   CONNECTOR LAYER    │         │      INTELLIGENCE LAYER          │  │
│  │  Composer 2.5        │───────►│  GPT-5.5 design · evidence scores │  │
│  │  APIs · feeds · parse│         │  Expert · Community · Market     │  │
│  └──────────────────────┘         └──────────────────────────────────┘  │
│              │                                    │                      │
│              ▼                                    ▼                      │
│     Raw source artifacts              Expert Consensus Score             │
│     (audit trail)                     Community Sentiment Score          │
│                                       Market Confidence Score            │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ weighted evidence (supplements only)
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│         STATISTICAL FOUNDATION (primary driver of projections)           │
│  College · Rookie · Veteran · Injury → Statistical Projection Score      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              SCORING ENGINE → OPTIMIZER → EXPLAINABLE OUTPUT             │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│    SOURCE PERFORMANCE INTELLIGENCE — continuous reliability evaluation   │
│    Feeds back into Expert Consensus weighting on subsequent runs         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Connector Layer vs Intelligence Layer

### Connector Layer

**Model:** Composer 2.5

| Responsibility | Detail |
|----------------|--------|
| Retrieve data | From approved providers only |
| Handle APIs, feeds, parsing | Raw → structured intermediate |
| Normalize transport formats | Player name matching, timestamps |
| Store snapshots | Audit trail for evidence |
| ToS compliance | Documented per provider; fail-closed on violation |
| Replaceable | Swap providers without redesigning Intelligence Layer |

### Intelligence Layer

**Model:** GPT-5.5 (design) · Composer 2.5 (implementation)

| Responsibility | Detail |
|----------------|--------|
| Combine signals | Quantitative + qualitative into evidence scores |
| Compare sources | Expert disagreement detection — never rely on one source |
| Calculate scores | Expert Consensus, Community Sentiment, Market Confidence |
| Produce evidence | Explainable, versioned, drill-down ready |
| Feed optimizer | As weighted inputs — not as override |

**Separation benefit:** Change data providers later without redesigning the platform.

---

## Intelligence sources

### Expert Intelligence

Approved providers (permission required):

| Provider | Signals |
|----------|---------|
| CBS Sports | Rankings, projections, start/sit |
| ESPN | Rankings, projections, matchup analysis |
| NFL.com | News, depth context |
| FantasyPros | ECR, expert consensus, projections |
| Rotowire | Projections, news, analysis |
| Yahoo Fantasy | Rankings, projections |
| Other approved | Charter amendment required |

**Extract and normalize:**

- Weekly player rankings
- Projected fantasy points
- Start/Sit recommendations
- Sleeper picks
- Bust candidates
- Matchup analysis
- Confidence level
- Projection changes over time

**Design principle:** Compare sources — build consensus and detect disagreement. Never treat a single expert as authoritative.

### Community Intelligence

| Source | Signals |
|--------|---------|
| Reddit | Breakouts, sleepers, injury chatter, ownership sentiment |
| X (Twitter) | Trending players, hype, news velocity |
| Community forums | Consensus themes, contrarian ideas |
| Podcasts / videos | Transcripts or summaries where available |

**Identify:**

- Emerging breakout candidates
- Rookie buzz
- Injury observations (cross-check Injury Agent)
- Sleeper discussions
- Ownership sentiment
- Contrarian ideas
- Consensus themes

**Critical rule:** Summarize **recurring patterns** — individual posts are not facts.

---

## EIL agents

| Agent | Phase | Role |
|-------|-------|------|
| Expert Intelligence (14) | EIL | Ingest, normalize, consensus, disagreement, trend |
| Community Intelligence (15) | EIL | Sentiment, trending, volume, contrarian signals |
| Source Performance Intelligence (16) | LEARN | Continuous source reliability evaluation |

Full specifications: [AGENTS.md](../AGENTS.md)

### Expert Intelligence Agent

**Responsibilities:**

- Ingest expert rankings and projections
- Normalize different scoring systems to common scale
- Build Expert Consensus Score
- Detect disagreements between experts
- Apply Source Reliability weights from Agent 16

**Outputs:** Expert Consensus Score · Confidence Score · Projection Trend · Source Agreement Level

**Model:** GPT-5.5

### Community Intelligence Agent

**Responsibilities:**

- Analyze Reddit and other community discussions
- Detect trending players
- Measure sentiment
- Identify high-conviction discussions
- Surface contrarian opportunities

**Outputs:** Community Sentiment Score · Trending Up/Down · Discussion Volume · Confidence Level

**Model:** GPT-5.5

### Source Performance Intelligence Agent

Rather than assuming a source is always reliable, continuously evaluate performance.

**Questions it answers:**

- Which source most accurately projected WR performance?
- Which source identified breakout rookies most effectively?
- Which source consistently overestimated player value?
- Which community signals preceded strong DFS performances?

**Outputs:** Source Reliability Score · Weekly Accuracy Report · Historical Performance Dashboard

**Model:** GPT-5.5

---

## Scoring integration

EIL contributes evidence dimensions. Statistical models remain the **foundation**.

See [SCORING_ENGINE.md](../SCORING_ENGINE.md) for the v2 player evaluation framework:

| Dimension | Driver |
|-----------|--------|
| Statistical Projection Score | Statistical agents (primary) |
| Expert Consensus Score | EIL Agent 14 |
| Community Sentiment Score | EIL Agent 15 |
| Market Confidence Score | Derived (statistical + expert + community + Vegas) |
| Rookie Opportunity Score | Rookie + Opportunity agents |
| Ownership Score | Ownership Agent |
| Leverage Score | Ownership Agent |
| Risk Score | Injury + volatility |
| Confidence Score | Composite certainty |
| **Overall DFS Rating** | Weighted composite |

Every recommendation includes **which evidence contributed most** to the score.

---

## UI explainability (required)

The platform must expose **why** a player is recommended. Example player card:

| Evidence | Display |
|----------|---------|
| Projection | 18.7 fantasy points |
| Expert consensus | Strong — 8/10 major sources rank top 10 |
| Community sentiment | Positive — high discussion volume, favorable themes |
| Market confidence | High — favorable implied team total and matchup |
| Optimizer rationale | High value vs salary; positive correlation to selected stack |

Explainability makes recommendations evaluable and trustworthy while keeping **statistical evidence as the primary driver**.

Task 9 UI must implement this pattern on Player Explorer and Lineup Builder screens.

---

## Governance

To keep recommendations trustworthy:

1. **Statistical models remain the foundation** of player projections
2. **Expert analysis contributes weighted evidence** — compared across sources, not taken from one
3. **Community discussions contribute sentiment and trend signals** — not factual assertions
4. **Source Performance Intelligence continuously adjusts reliability** based on historical predictive performance
5. **All weighting changes are versioned, reviewable, and explainable** — no silent drift

| Rule | Enforcement |
|------|-------------|
| Approved sources only | Settings whitelist |
| ToS compliance | Per-connector documentation |
| Community ≠ fact | Disclaimer on all community outputs |
| Evidence required | Every score cites contributing sources |
| Supplement only | EIL cannot override optimizer or statistical foundation |
| Reliability updates | Governed approval before weight application |

---

## Model assignments

| Task | Model |
|------|-------|
| EIL architecture | GPT-5.5 |
| Expert Intelligence Agent | GPT-5.5 |
| Community Intelligence Agent | GPT-5.5 |
| Source Performance Intelligence Agent | GPT-5.5 |
| Connectors and data ingestion | Composer 2.5 |
| Data normalization and storage | Composer 2.5 |
| Testing | Composer 2.5 |
| Architecture review | Claude Opus 4.1 |

---

## Related documents

- [PROJECT_CHARTER.md](../../PROJECT_CHARTER.md) — Task 5.3
- [AGENTS.md](../AGENTS.md) — Agents 14–16
- [SCORING_ENGINE.md](../SCORING_ENGINE.md) — v2 scoring framework
- [DATA_MODEL.md](../DATA_MODEL.md) — EIL entities
