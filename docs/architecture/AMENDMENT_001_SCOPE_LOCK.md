# Architecture Freeze Amendment 001 — Product Scope Lock

**Status:** APPROVED  
**Effective:** 2026-07-18  
**Applies to:** Version 1.0  
**Parent:** [PROJECT_CHARTER.md](../../PROJECT_CHARTER.md)

> Locks Version 1.0 to a single platform, sport, and contest type.  
> No multi-sport or multi-platform abstraction in v1 implementation.

---

## Product scope lock

Effective immediately, **Version 1.0** is restricted to:

| Dimension | Value |
|-----------|-------|
| **Platform** | DraftKings |
| **Sport** | NFL |
| **Contest type** | Classic Salary Cap |

No additional sports or DFS platforms will be implemented during Version 1.

---

## Architectural constraint

Every v1 component assumes:

```text
League = NFL
Platform = DraftKings
Contest = Classic
```

**No abstraction layer** for multiple sports or platforms in v1. Expansion requires Version 2 charter amendment and items promoted from [BACKLOG.md](../BACKLOG.md).

---

## Included in v1

### Scope

- Platform: DraftKings  
- Sport: NFL  
- Contest: Classic Salary Cap ($50,000, 9-player roster)

### Features

- Manual "Analyze Slate"  
- Statistical Intelligence  
- College · Rookie · Veteran · Matchup · Injury · Market Intelligence  
- Expert Intelligence · Community Intelligence  
- Evidence Engine · Scoring Engine · Prediction Confidence Engine  
- Portfolio Intelligence Engine · Portfolio Simulation Engine  
- Portfolio Health Dashboard · Player Evidence Reports  
- 3–5 Primary Lineups · 2–3 Hail Mary Lineups  
- Explainability · Historical Learning · Source Performance Tracking  

Full pipeline: [PHASE_1_5_ENHANCEMENT_CHARTER.md](../PHASE_1_5_ENHANCEMENT_CHARTER.md)

---

## Explicitly out of scope (v1)

See [BACKLOG.md](../BACKLOG.md) for full backlog.

- Other DFS platforms (FanDuel, Yahoo, Underdog, Sleeper, …)  
- Other sports (NBA, MLB, NHL, PGA, …)  
- Other contest types (Showdown, Best Ball, Pick'em, …)  
- Multi-sport / multi-platform abstraction layers  

---

## Benefits

- Optimize for DraftKings salary rules and roster constraints  
- Tailor scoring and evidence to NFL player performance  
- Fine-tune stacking, ownership, and correlation for NFL Classic  
- Simplify testing — one roster format, one constraint set  
- Reach production-ready product sooner  

---

## Implementation guidance

| Do (v1) | Do not (v1) |
|---------|-------------|
| Hardcode DK Classic roster rules | Generic `sport` / `platform` plugin system |
| NFL-specific data sources and scoring | Platform adapter interfaces |
| DK salary cap $50,000 | Showdown CPT/FLEX logic |
| Single enum values in schema where needed | Future-proof abstraction layers |

Schema may use literal constants (`nfl`, `draftkings`, `classic`) — not extensibility frameworks.

---

## Model assignments (this amendment)

| Task | Model |
|------|-------|
| Charter, vision, architecture, README updates | GPT-5.5 |
| Remove future abstractions from implementation plan | GPT-5.5 |
| NFL/DK-specific UI | Composer 2.5 |
| DK roster rules and optimizer | Composer 2.5 |
| NFL backend services | Composer 2.5 |
| Testing and validation | Composer 2.5 |
| Final architecture review | Claude Opus 4.1 |

---

## Related documents

- [BACKLOG.md](../BACKLOG.md)  
- [PROJECT_CHARTER.md](../../PROJECT_CHARTER.md)  
- [VISION.md](../VISION.md)  
