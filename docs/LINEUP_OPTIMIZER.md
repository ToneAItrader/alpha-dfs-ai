# Alpha DFS AI — Optimizer Modules (Strategy A & B)

**Status:** Task 9 — Module spec under PIE  
**Version:** 2.1  
**Date:** 2026-07-18  
**Parent:** [PORTFOLIO_INTELLIGENCE_ENGINE.md](./architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md)

> Primary and Hail Mary optimizer algorithms — **modules inside the Portfolio Intelligence Engine**.  
> Algorithm design: GPT-5.5 · Implementation: Composer 2.5

**Central orchestration:** [Portfolio Intelligence Engine](./architecture/PORTFOLIO_INTELLIGENCE_ENGINE.md) (not standalone "Lineup Optimizer")

*(Filename `LINEUP_OPTIMIZER.md` retained for repo continuity.)*

---

## Objective

Generate **optimized DFS portfolios** — not single lineups — from scored evidence and optimization rules.

### Portfolio outputs

| Portfolio | Count | Objective |
|-----------|-------|-----------|
| **Primary Portfolio** | 3–5 lineups | Expected value and projected performance |
| **Hail Mary Portfolio** | 2–3 lineups | Upside and leverage for large-field GPP |

Total: **5–8 lineups** per analysis run (configurable in Settings).

### Primary Portfolio

- Maximize weighted projection + value + market confidence  
- Moderate ownership leverage  
- Enforced stacks and correlation bonuses  
- Exposure limits across lineups  
- Low lineup similarity  

### Hail Mary Portfolio

- Maximize ceiling + leverage + contrarian plays  
- Higher community sentiment on low-owned upside  
- Aggressive stack configurations  
- Higher variance player pool  
- Strict diversity from Primary Portfolio (min unique players)  

---

## Authority

The Portfolio Optimizer (Portfolio Construction Agent) is the **sole authority** for roster construction. No other agent or UI component may produce, modify, or override lineup slots.

AI agents and Evidence Engine provide inputs. The optimizer enforces hard constraints deterministically.

---

## Features

| Feature | Description |
|---------|-------------|
| Exposure control | Max % of lineups containing each player |
| Correlation | QB stacks, bring-backs, game environment |
| Stacking | Primary stack required (configurable) |
| Ownership | Leverage weighting differs by portfolio type |
| Diversity | Min unique players between lineups |
| Similarity analysis | Hamming distance / overlap metrics between lineups |

---

## DraftKings constraints

### Classic slate roster

| Slot | Positions eligible | Count |
|------|-------------------|-------|
| QB | QB | 1 |
| RB | RB | 2 |
| WR | WR | 3 |
| TE | TE | 1 |
| FLEX | RB, WR, TE | 1 |
| DST | DST | 1 |
| **Total** | | **9 players** |

**Salary cap:** $50,000 (configurable per slate)  
**Max players per team:** 8 (effectively unlimited for 9-player roster)  
**Min games:** Typically 2+ teams represented (platform rule — verify per slate)

---

## Optimization problem formulation

### Decision variables

```text
x[i] ∈ {0, 1}  for each SlatePlayer i
x[i] = 1 if player i is in lineup
```

### Hard constraints

```text
(1) Salary:     Σ (salary[i] * x[i]) ≤ SALARY_CAP
(2) Positions:  Σ x[i] ≥ required_count[pos]  ∀ positions
(3) Eligibility: x[i] = 0 if player i not eligible for slate
(4) Uniqueness:  One entry per player per lineup
```

### Soft constraints (via objective or penalty)

```text
(6) Stack rules:      QB + pass catcher from same team
(7) Exposure limits:  Max % of lineups containing player p
(8) Diversity:        Min unique players across lineup set
(9) Correlation:      Bonus for recommended stacks
(10) Ownership:       Target ownership distribution by contest type
```

---

## Objective function

Multi-objective optimization converted to weighted scalar:

```text
Maximize:
  α * Σ (projection[i] * x[i])
+ β * Σ (value[i] * x[i])
+ γ * Σ (leverage[i] * x[i])
+ δ * correlation_bonus(x)
− ε * Σ (risk[i] * x[i])
− ζ * ownership_penalty(x, contest_type)
```

Coefficients (α, β, γ, δ, ε, ζ) come from **Contest Strategy Agent** `StrategyProfile`.

### Contest-type objective emphasis

| Coefficient | Cash | SE | 3-Max | 150-Max |
|-------------|------|-----|-------|---------|
| α (projection) | High | High | Medium | Medium |
| β (value) | Medium | Medium | Medium | Low |
| γ (leverage) | Low | Medium | High | Very High |
| δ (correlation) | Low | Medium | High | High |
| ε (risk penalty) | High | Medium | Low | Low |
| ζ (ownership) | Low | Medium | High | Very High |

---

## Stack enforcement

### Stack types and rules

| Stack type | Rule | Optimizer treatment |
|------------|------|---------------------|
| Primary | QB + ≥1 pass catcher (WR/TE) | Hard or soft constraint (configurable) |
| Double stack | QB + 2 pass catchers | Soft bonus |
| Bring-back | QB stack + opposing WR | Soft bonus |
| Game stack | ≥3 players from same game | Soft bonus (high-total games) |
| RB vs DST | Same-team RB + opposing DST | Anti-correlation penalty |

Stack rules configured in `StrategyProfile.stackRules`:

```json
{
  "requirePrimaryStack": true,
  "minPassCatchersWithQb": 1,
  "bringBackEnabled": true,
  "gameStackMinPlayers": 3,
  "gameStackMinTotal": 47.5
}
```

---

## Multi-lineup generation

For GPP contests requiring multiple entries:

### Approach

1. **Single solve** with integrality → first optimal lineup
2. **Iterative exclusion** — add constraint excluding previous lineups (or partial overlap)
3. **Exposure tracking** — across N lineups, enforce max exposure per player
4. **Diversity constraint** — min unique players between any two lineups

### Exposure limits

```text
For player p:  Σ (x[p] across all lineups) / total_lineups ≤ maxExposure[p]
```

Default max exposure: 60% for 150-max, 100% for single entry.

### Diversity

```text
For lineups L1, L2:  |players(L1) ∩ players(L2)| ≤ maxOverlap
```

Default max overlap: 4 players for 150-max, 7 for 3-max.

---

## Solver strategy

### Primary: Mixed Integer Linear Programming (MILP)

- Library candidates: `glpk.js`, `javascript-lp-solver`, or OR-Tools via WASM
- Formulate as binary integer program
- Suitable for single lineup and small multi-lineup sets

### Fallback: Greedy heuristic

For large 150-max sets where MILP is too slow:

1. Sort players by contest-weighted score
2. Greedy fill respecting constraints
3. Local search swaps to improve objective
4. Repeat with perturbation for diversity

### Performance targets

| Scenario | Target solve time |
|----------|-------------------|
| Single lineup | < 2 seconds |
| 20 lineups (3-max) | < 30 seconds |
| 150 lineups (150-max) | < 5 minutes |

---

## Input contract

```typescript
interface OptimizerInput {
  slateId: string;
  salaryCap: number; // 50000 — DK NFL Classic
  players: OptimizerPlayer[];
  strategyProfile: StrategyProfile;
  lineupCount: number;
  exposureLimits?: Record<string, number>;
  stackRules: StackRules;
  correlationMatrix?: CorrelationPair[];
}

interface OptimizerPlayer {
  slatePlayerId: string;
  playerId: string;
  name: string;
  position: string;
  salary: number;
  projectedPoints: number;
  valueScore: number;
  leverageScore: number;
  riskScore: number;
  ownershipProjected: number;
  teamId: string;
  gameId: string;
  eligibleSlots: string[];
}
```

---

## Output contract

```typescript
interface OptimizerOutput {
  optimizerRunId: string;
  slateId: string;
  lineups: GeneratedLineup[];
  metadata: {
    solverType: "milp" | "heuristic";
    solveTimeMs: number;
    objectiveValue: number;
    strategyProfileVersion: SemVer;
  };
  evidenceBundleId: string;
}

interface GeneratedLineup {
  slots: LineupSlotAssignment[];
  totalSalary: number;
  projectedPoints: number;
  stacks: IdentifiedStack[];
  ownershipSum: number;
  overallRating: number;
}
```

---

## Failure modes

| Condition | Behavior |
|-----------|----------|
| Infeasible (salary + positions) | Fail with diagnostic — no partial lineup |
| Missing projections for eligible players | Fail-closed if >10% of pool missing |
| Exposure over-constrained | Relax exposure iteratively; warn if relaxed |
| Solver timeout | Fall back to heuristic; flag in evidence |
| Bankroll violation | Block export — return lineups with `exportBlocked: true` |

---

## Validation (Phase 8)

| Test | Method |
|------|--------|
| Constraint satisfaction | Every lineup passes DK rules validator |
| Known-optimal fixtures | Small slates with hand-verified optimal |
| Salary cap edge cases | $500 remaining, min salary players |
| Stack enforcement | Verify primary stack present when required |
| Multi-lineup diversity | Overlap and exposure within limits |
| Regression | Historical slates — compare to published optimal |

---

## Package structure (planned)

```text
packages/optimizer/
├── src/
│   ├── constraints/       # DK roster rules
│   ├── objective/         # Weighted objective builder
│   ├── solvers/
│   │   ├── milp.ts
│   │   └── heuristic.ts
│   ├── stacks/            # Stack detection and bonuses
│   ├── multi/             # Multi-lineup generation
│   ├── validate/          # Post-solve validation
│   └── index.ts           # Public API
└── tests/
    ├── fixtures/          # Known slates
    └── *.test.ts
```

---

## Related documents

- [AGENTS.md](./AGENTS.md) — Agent 9 specification
- [SCORING_ENGINE.md](./SCORING_ENGINE.md) — Objective inputs
- [DATA_MODEL.md](./DATA_MODEL.md) — Lineup, LineupSlot entities
- [LEARNING_ENGINE.md](./LEARNING_ENGINE.md) — Optimal lineup comparison
