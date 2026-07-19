# Alpha DFS AI — Statistical Data Source Catalog

**Status:** Task 5 — Complete  
**Version:** 1.0  
**Date:** 2026-07-18  
**Parent:** [PROJECT_CHARTER.md](../../PROJECT_CHARTER.md)

> Complete catalog of quantitative data sources for DraftKings NFL Classic analysis.  
> EIL (expert/community) sources documented separately in [EXTERNAL_INTELLIGENCE_LAYER.md](../architecture/EXTERNAL_INTELLIGENCE_LAYER.md).

---

## Design principles

1. **Fetched per analysis run** — no background polling; ingested when user clicks Analyze Slate  
2. **Fail-closed on P0** — missing salaries or player pool blocks pipeline  
3. **Freshness tracked** — every record includes `capturedAt` and source ref  
4. **ToS documented** — licensing and usage constraints recorded per source  
5. **Normalized to DATA_MODEL** — all sources map to canonical entities  

---

## Priority tiers

| Tier | Meaning |
|------|---------|
| P0 | Required — pipeline fails without it |
| P1 | Expected — warn and degrade confidence if missing |
| P2 | Optional — enhances scoring when available |

---

## NFL statistics

### Player statistics (P0)

| Attribute | Detail |
|-----------|--------|
| Purpose | Core production metrics for projection and veteran evaluation |
| Data | Passing, rushing, receiving, TDs, targets, carries, red zone |
| Frequency | Per analysis run; season-to-date + recent windows (3/5/8 game) |
| Integration | API or licensed feed → `NFLStats`, `GameLogs` |
| Quality | Cross-validate player IDs against DK slate pool |
| Licensing | Provider ToS — document in source config |

### Team statistics (P1)

| Attribute | Detail |
|-----------|--------|
| Purpose | Offensive/defensive context for matchup intelligence |
| Data | Points per game, yards, pace, pass/run ratio |
| Frequency | Per analysis run |
| Integration | API → derived matchup inputs |
| Quality | Align with slate week |

### Snap counts (P0)

| Attribute | Detail |
|-----------|--------|
| Purpose | Opportunity score, usage trends |
| Data | Offensive/defensive snaps, snap % |
| Frequency | Per analysis run; most recent week + trend |
| Integration | API → `GameLogs.snapPct`, `NFLStats` |
| Quality | Flag players with snap count anomalies |

### Usage metrics (P0)

| Attribute | Detail |
|-----------|--------|
| Purpose | Target share, air yards, carry share, route participation |
| Data | Position-specific advanced usage |
| Frequency | Per analysis run |
| Integration | API → `NFLStats.advancedMetrics` |
| Quality | Minimum sample size thresholds by position |

### Advanced metrics (P1)

| Attribute | Detail |
|-----------|--------|
| Purpose | Efficiency evaluation beyond box score |
| Data | EPA, success rate, YPRR, ADOT, red zone targets |
| Frequency | Per analysis run |
| Integration | API → JSONB advanced metrics |
| Quality | Document metric definitions for reproducibility |

---

## DraftKings

### Salaries (P0)

| Attribute | Detail |
|-----------|--------|
| Purpose | Value calculation, optimizer constraints |
| Data | Player salary, roster position eligibility |
| Frequency | Per slate, per analysis run |
| Integration | Export/API/manual → `SlatePlayer` |
| Quality | 100% slate pool coverage required |
| Licensing | DraftKings ToS — user-provided export acceptable for personal use |

### Position eligibility (P0)

| Attribute | Detail |
|-----------|--------|
| Purpose | Optimizer slot assignment |
| Data | QB, RB, WR, TE, FLEX, DST eligibility per player |
| Frequency | With salary ingest |
| Integration | `SlatePlayer.rosterPosition` |

### Contest structure (P1)

| Attribute | Detail |
|-----------|--------|
| Purpose | Portfolio strategy configuration |
| Data | Classic roster rules, salary cap ($50,000) |
| Frequency | Per slate type |
| Integration | `Slate` config constants |

---

## Betting markets

### Point spreads (P1)

| Attribute | Detail |
|-----------|--------|
| Purpose | Game script context, Market Intelligence |
| Data | Spread per game |
| Frequency | Per analysis run (latest before lock) |
| Integration | API → `Game.vegasSpread` |

### Totals (P1)

| Attribute | Detail |
|-----------|--------|
| Purpose | Game environment, stack prioritization |
| Data | Over/under per game |
| Frequency | Per analysis run |
| Integration | API → `Game.vegasTotal` |

### Implied team totals (P1)

| Attribute | Detail |
|-----------|--------|
| Purpose | Market Confidence Score, correlation agent |
| Data | Derived from spread + total |
| Frequency | Computed at ingest |
| Integration | `Game.impliedHomeTotal`, `impliedAwayTotal` |

### Line movement (P2)

| Attribute | Detail |
|-----------|--------|
| Purpose | Sharp money signals, market confidence |
| Data | Open vs current spread/total |
| Frequency | Per analysis run if provider supports |
| Integration | JSONB on `Game` |

### Player props (P2)

| Attribute | Detail |
|-----------|--------|
| Purpose | Supplementary market evidence |
| Data | Passing/rushing/receiving yards, TDs, receptions |
| Frequency | Per analysis run if provider supports |
| Integration | Market Intelligence Agent input |
| Licensing | Provider-dependent |

---

## Player availability

### Injury reports (P0)

| Attribute | Detail |
|-----------|--------|
| Purpose | Injury Intelligence Agent, risk score |
| Data | Out/doubtful/questionable/probable, body part |
| Frequency | Latest before analysis run |
| Integration | API → `InjuryReport` |
| Quality | Same-day freshness preferred |

### Practice reports (P1)

| Attribute | Detail |
|-----------|--------|
| Purpose | Injury risk, opportunity inference |
| Data | DNP, limited, full participation |
| Frequency | Wed–Fri/Sat per NFL week |
| Integration | `InjuryReport.practiceParticipation` |

### Depth charts (P1)

| Attribute | Detail |
|-----------|--------|
| Purpose | Opportunity score, rookie/veteran context |
| Data | Starter, backup, depth order, role |
| Frequency | Per analysis run |
| Integration | API → `DepthChart` |

---

## Environment

### Weather (P1)

| Attribute | Detail |
|-----------|--------|
| Purpose | Passing/kicking adjustments, weather evidence |
| Data | Temp, wind, precipitation, conditions |
| Frequency | Day-of, per analysis run |
| Integration | API → `Weather` |
| Quality | Dome games → minimal impact flag |

### Stadium (P2)

| Attribute | Detail |
|-----------|--------|
| Purpose | Dome/outdoor, altitude context |
| Data | Stadium name, roof type, surface |
| Integration | Reference data on `Game` |

### Surface (P2)

| Attribute | Detail |
|-----------|--------|
| Purpose | RB/WR subtle context |
| Data | Grass, turf |
| Integration | Stadium reference table |

---

## Historical DFS

### Historical slates (P2)

| Attribute | Detail |
|-----------|--------|
| Purpose | Backtesting, ownership modeling, learning |
| Data | Past salaries, actual points, ownership |
| Frequency | Archive import; not per-run |
| Integration | Bulk import → historical tables |
| Quality | Match DK scoring rules per season |

### Winning lineups (P2)

| Attribute | Detail |
|-----------|--------|
| Purpose | Learning Agent, Optimizer Performance Agent |
| Data | Top-finishing rosters per contest |
| Frequency | Post-slate import |
| Integration | `SlateResult`, learning analysis |

### Ownership (P1)

| Attribute | Detail |
|-----------|--------|
| Purpose | Ownership Agent, leverage score |
| Data | Historical ownership by salary tier; projected ownership |
| Frequency | Per slate where available |
| Integration | `Ownership`, `SlatePlayer.ownershipActual` (post-slate) |

### Salary value (P2)

| Attribute | Detail |
|-----------|--------|
| Purpose | Value benchmarks, regression tests |
| Data | Points per $1K by position/week |
| Frequency | Derived from historical slates |
| Integration | Analytics / learning inputs |

---

## College & draft (statistical)

### College statistics (P1 — rookies)

| Attribute | Detail |
|-----------|--------|
| Purpose | College Intelligence Agent |
| Data | Production, SOS, conference, advanced metrics |
| Frequency | Pre-season + rookie-relevant players per run |
| Integration | API → `CollegeStats` |

### Draft information (P1 — rookies)

| Attribute | Detail |
|-----------|--------|
| Purpose | Rookie Intelligence Agent |
| Data | Round, pick, team, draft capital |
| Integration | API → `DraftClass` |

### Combine / pro day (P2)

| Attribute | Detail |
|-----------|--------|
| Purpose | Athletic profile, RAS |
| Data | 40, vertical, bench, RAS score |
| Integration | `DraftClass.combineMetrics` |

---

## Ingest order (per analysis run)

```text
1. DraftKings salaries + eligibility     (P0 — fail-closed)
2. NFL stats, snaps, usage               (P0)
3. Injury + practice reports             (P0/P1)
4. Betting markets                       (P1)
5. Depth charts                          (P1)
6. Weather + environment                 (P1)
7. College/draft (rookie subset)         (P1)
8. Historical ownership (if configured)  (P1)
9. Line movement, props, surface         (P2)
```

---

## Related documents

- [DATA_MODEL.md](../DATA_MODEL.md) — entity schemas
- [EXTERNAL_INTELLIGENCE_LAYER.md](../architecture/EXTERNAL_INTELLIGENCE_LAYER.md) — EIL sources (Task 5.3)
- [EVIDENCE_ENGINE.md](../EVIDENCE_ENGINE.md) — evidence assembly
