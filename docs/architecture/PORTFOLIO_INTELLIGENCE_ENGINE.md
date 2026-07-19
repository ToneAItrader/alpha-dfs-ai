# Portfolio Intelligence Engine (PIE)

**Status:** Task 5.4 — Architecture complete  
**Version:** 1.0  
**Date:** 2026-07-18  
**Parent:** [PROJECT_CHARTER.md](../../PROJECT_CHARTER.md) · [ARCHITECTURE.md](../ARCHITECTURE.md)

> Central decision-support engine for portfolio generation and explainability.  
> The optimizer is **one module** inside PIE — alongside exposure management, diversity control, ranking, and lineup explainability.

**Replaces the standalone "Lineup Optimizer" naming** — better reflects the platform's responsibility: construct, rank, and explain a portfolio of recommended lineups.

---

## Objective

Design a portfolio generation engine that produces optimized DraftKings NFL Classic lineups when the user manually starts an analysis.

- **Not** continuous lineup building  
- **Only** runs on **Analyze Slate**  
- Returns to **IDLE** when complete  

---

## Engine architecture

```text
PORTFOLIO INTELLIGENCE ENGINE (PIE)
│
├── Portfolio Construction Agent (17)   ← orchestrates portfolio build
│
├── Strategy A — Primary Optimizer      ← maximize expected value
│   └── Output: 3–5 Primary Lineups
│
├── Strategy B — Hail Mary Optimizer    ← maximize tournament upside
│   └── Output: 2–3 Hail Mary Lineups
│
├── Diversity & Exposure Manager          ← FR-19 constraints
├── Portfolio Ranker                      ← rank within each portfolio type
├── Explainability Engine                 ← FR-18 lineup breakdowns
└── Portfolio Summary Generator           ← metrics + report input
```

**Authority:** PIE is the **sole authority** for roster construction. UI displays only.

**Models:** GPT-5.5 (design) · Composer 2.5 (implementation)

---

## Functional requirements

### FR-16 — Primary Portfolio

Generate **3–5 Primary Lineups** maximizing expected value per the scoring model.

Each lineup balances:

| Factor | Source |
|--------|--------|
| Projected fantasy points | Statistical Projection Score |
| Salary efficiency | Value / salary |
| Correlation | Correlation Engine |
| Ownership | Ownership Engine |
| Risk | Risk Score |
| Confidence | Confidence Score |
| Historical learning | Learning Agent (when validated) |
| Expert consensus | Expert Intelligence (EIL) |
| Community intelligence | Community Intelligence (EIL) |
| Market intelligence | Market Intelligence |

**Model:** GPT-5.5 — optimization strategy and portfolio architecture

---

### FR-17 — Hail Mary Portfolio

Generate **2–3 high-upside lineups** for large-field tournaments.

Intentionally seeks:

- Lower projected ownership  
- High-ceiling players  
- Contrarian stacks  
- Breakout rookies  
- Leverage opportunities  
- Higher variance  

**Objective:** Maximize tournament-winning upside — not median projection.

**Model:** GPT-5.5

---

### FR-18 — Explainability

Every lineup includes:

| Field | Description |
|-------|-------------|
| Projected fantasy points | Sum of player projections |
| Confidence score | Portfolio-level composite |
| Risk score | Aggregate player risk |
| Ownership estimate | Sum/product ownership metric |
| Correlation score | Stack quality rating |
| Salary used | Total salary / cap |
| Key supporting evidence | Top evidence contributors |
| Expert Consensus Score | Portfolio average |
| Community Sentiment Score | Portfolio average |
| Market Confidence Score | Portfolio average |
| Rookie Opportunity Score | Where applicable |

**Model:** GPT-5.5 (schema design) · Composer 2.5 (UI — Task 10)

---

### FR-19 — Portfolio Diversity

Lineups must be **meaningfully different**. PIE manages:

| Constraint | Description |
|------------|-------------|
| Maximum player overlap | Max shared players between any two lineups |
| Stack diversity | Vary primary stacks across portfolio |
| Team exposure | Max % of lineups with players from team T |
| Position exposure | Cap RB/WR concentration across portfolio |
| Salary diversity | Vary salary allocation patterns (stud/punt mix) |
| Leverage diversity | Mix chalk and contrarian across lineups |

**Default thresholds:**

| Metric | Primary | Hail Mary | Cross-portfolio |
|--------|---------|-----------|-----------------|
| Max player overlap | 4 players | 3 players | 5 vs Primary |
| Max team exposure | 70% | 60% | — |
| Min unique players (vs prior lineup) | 3 | 4 | 6 vs Primary best |

**Model:** GPT-5.5

---

## Agent 17 — Portfolio Construction Agent

**Model:** GPT-5.5 (design) · Composer 2.5 (implementation)

### Responsibilities

- Orchestrate PIE modules  
- Build optimized lineup portfolios  
- Generate Primary Portfolio (Strategy A)  
- Generate Hail Mary Portfolio (Strategy B)  
- Balance player exposure across all lineups  
- Ensure lineup diversity (FR-19)  
- Rank lineups within each portfolio  
- Explain lineup selection (FR-18)  

### Inputs

| Input | Source |
|-------|--------|
| Scored players | Scoring Engine |
| Projections | Projection Engine (Agent 6) |
| Ownership / leverage | Ownership Engine (Agent 7) |
| Correlation / stacks | Correlation Engine (Agent 9) |
| Expert consensus | Expert Intelligence (Agent 14) |
| Community sentiment | Community Intelligence (Agent 15) |
| Market context | Market Intelligence (Agent 20) |
| Rookie opportunity | Rookie Intelligence (Agent 3) |
| Salaries | SlatePlayer |
| Strategy profile | Contest Strategy (Agent 11) |

### Outputs

| Output | Description |
|--------|-------------|
| Ranked Primary Portfolio | 3–5 lineups with ranks 1–N |
| Ranked Hail Mary Portfolio | 2–3 lineups with ranks 1–N |
| Portfolio Summary | Aggregate metrics |
| Portfolio Metrics | Diversity, exposure, similarity scores |
| Lineup Explainability records | FR-18 breakdown per lineup |

---

## Strategy A — Primary Optimizer

**Objective:** Maximize expected value.

**Prioritize:** Projection · Confidence · Correlation · Value · Historical performance (when validated)

**Objective function (weighted):**

```text
Maximize:
  α * Σ projectedPoints
+ β * Σ overallDfsRating
+ γ * correlation_bonus
+ δ * value_score
+ ε * marketConfidence
+ ζ * expertConsensus (weighted by reliability)
− η * risk_penalty
```

**Output:** 3–5 Primary Lineups

**Models:** GPT-5.5 (algorithm) · Composer 2.5 (implementation)

Algorithm detail: [LINEUP_OPTIMIZER.md](../LINEUP_OPTIMIZER.md) — Primary section

---

## Strategy B — Hail Mary Optimizer

**Objective:** Maximize tournament-winning upside.

**Prioritize:** Ceiling · Leverage · Ownership discount · Contrarian stacks · Rookie upside

**Objective function (weighted):**

```text
Maximize:
  α * Σ ceiling_projection
+ β * Σ leverage_score
+ γ * contrarian_bonus
+ δ * low_ownership_bonus
+ ε * rookie_opportunity
+ ζ * correlation_bonus (aggressive stacks)
− η * chalk_penalty
```

**Output:** 2–3 Hail Mary Lineups

**Constraints vs Primary:** Stricter diversity from Primary Portfolio; higher min unique players; lower max overlap.

**Models:** GPT-5.5 (algorithm) · Composer 2.5 (implementation)

---

## Explainability Engine

Produces `LineupExplainability` record per lineup:

```typescript
interface LineupExplainability {
  lineupId: string;
  portfolioType: "primary" | "hail_mary";
  rank: number;
  projectedFantasyPoints: number;
  confidenceScore: number;
  riskScore: number;
  ownershipEstimate: number;
  correlationScore: number;
  salaryUsed: number;
  salaryRemaining: number;
  expertConsensusAvg: number;
  communitySentimentAvg: number;
  marketConfidenceAvg: number;
  rookieOpportunityAvg: number | null;
  keyEvidence: EvidenceContributor[];
  contrarianFactors: string[];  // Hail Mary emphasis
  ceilingRating: number | null; // Hail Mary only
  leverageScore: number | null; // Hail Mary only
  optimizerRationale: string;
}
```

Feeds **Recommended Portfolio** dashboard (Task 10).

---

## Dashboard — Recommended Portfolio (Task 10)

**Model:** Composer 2.5

### Primary Lineups display

Per lineup: Rank · Overall DFS Rating · Projected Points · Confidence · Risk · Ownership · Salary · Key Evidence

### Hail Mary Lineups display

Per lineup: Rank · Ceiling Rating · Leverage Score · Ownership · Correlation · Risk · Key Contrarian Factors

---

## Pipeline position

```text
Evidence Engine → Scoring Engine → [PIE] → Reports → IDLE
                                      ↑
                         Portfolio Construction Agent (17)
                         Primary Optimizer · Hail Mary Optimizer
                         Diversity · Rank · Explain
```

---

## Learning integration

Historical learning influences recommendations **only after validation** of impact:

- Learning Agent proposes weight adjustments  
- Operator approves via governed workflow  
- Source Performance + Optimizer Performance validate before application  
- Version bump on all weight changes  

No silent application of learning weights to PIE objectives.

---

## Dynamic Portfolio Strategy (Task 9.3)

PIE adapts optimization parameters based on **Slate Intelligence** outputs. Lineup **counts** remain fixed (3–5 Primary, 2–3 Hail Mary).

| Slate Strategy | Primary optimizer shift | Hail Mary shift |
|----------------|-------------------------|-----------------|
| `balanced` | Default weights | Default weights |
| `primary_heavy` | +confidence, +value, tighter exposure | Standard |
| `gpp_heavy` | Standard | +leverage, +ceiling, +contrarian |
| `contrarian` | Moderate ownership fade | Aggressive low-owned |
| `stack_aggressive` | Required stacks, game env bonus | Double stacks, bring-backs |

**Determined by:** Agent 21 Slate Intelligence → Dynamic Strategy module in PIE

---

## Portfolio Health Dashboard (Task 9.6)

Portfolio-level summary — complements lineup-level explainability (FR-18).

| Metric | Source |
|--------|--------|
| Portfolio Grade | Weighted simulation + confidence |
| Overall Risk | PCE + simulation downside |
| Overall Confidence | Average lineup confidence |
| Exposure Balance | Player/team exposure distribution |
| Stack Diversity | Unique stacks across portfolio |
| Salary Distribution | Stud/punt/mid mix |
| Leverage Distribution | Chalk vs contrarian mix |

**UI:** Task 10 Portfolio Health Dashboard · **Model:** Composer 2.5

---

## PCE and simulation integration

```text
Scoring → PCE (confidence ranks) → PIE (build portfolios) → Simulation (evaluate) → Health Dashboard
```

PIE ranks lineups using **confidence-adjusted expected value** from PCE.

---

```text
packages/portfolio-intelligence/
├── src/
│   ├── agent/              # Portfolio Construction Agent (17)
│   ├── optimizers/
│   │   ├── primary.ts      # Strategy A
│   │   └── hail-mary.ts    # Strategy B
│   ├── diversity/          # FR-19
│   ├── exposure/
│   ├── ranking/
│   ├── explainability/     # FR-18
│   └── index.ts
└── tests/
```

Legacy optimizer detail: [LINEUP_OPTIMIZER.md](../LINEUP_OPTIMIZER.md)

---

## Related documents

- [AGENTS.md](../AGENTS.md) — Agent 17 specification
- [SCORING_ENGINE.md](../SCORING_ENGINE.md) — scoring inputs
- [EVIDENCE_ENGINE.md](../EVIDENCE_ENGINE.md) — evidence inputs
- [PREDICTION_CONFIDENCE_ENGINE.md](../PREDICTION_CONFIDENCE_ENGINE.md)
- [PORTFOLIO_SIMULATION_ENGINE.md](../PORTFOLIO_SIMULATION_ENGINE.md)
- [SLATE_INTELLIGENCE.md](./SLATE_INTELLIGENCE.md)
- [PHASE_1_5_ENHANCEMENT_CHARTER.md](../PHASE_1_5_ENHANCEMENT_CHARTER.md)
