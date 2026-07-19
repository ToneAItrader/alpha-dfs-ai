# Alpha DFS AI — Backlog

**Status:** Out of scope for Version 1.0  
**Scope lock:** [AMENDMENT_001_SCOPE_LOCK.md](./architecture/AMENDMENT_001_SCOPE_LOCK.md)

> Items here are **not** implemented in v1. Promote to Version 2 only after v1 is complete and validated.

**v1 contract:** Build one excellent product — **DraftKings · NFL · Classic Salary Cap**.

---

## Version 2 promotion criteria

An item may be promoted from backlog when:

1. Version 1 RC is validated and stable on `main` ([RC_VALIDATION_REPORT.md](./operations/RC_VALIDATION_REPORT.md))
2. Item is assigned to a V2 phase in [V2_CAPABILITY_BREAKDOWN.md](./architecture/V2_CAPABILITY_BREAKDOWN.md)
3. Explicit charter amendment approved (if scope expands beyond Amendment 001)
4. ADR written and independent architecture review complete
5. Impact on frozen V1 architecture assessed in [V2_MIGRATION_STRATEGY.md](./architecture/V2_MIGRATION_STRATEGY.md)  

---

## DFS platforms

| Item | Notes |
|------|-------|
| FanDuel | Different roster rules, scoring, salaries |
| Yahoo Fantasy | Platform-specific APIs and constraints |
| Underdog Fantasy | Best ball / pick'em formats |
| Sleeper | Platform and format differences |
| Other DFS providers | Case-by-case |

---

## Sports

| Item | Notes |
|------|-------|
| NBA | Daily roster, pace, minutes constraints |
| MLB | Lineup timing, pitching matchups |
| NHL | Goalie confirmation, line stacks |
| PGA | Cut-line, ownership volatility |
| NASCAR | Field size, place differential scoring |
| Soccer | Multi-game slates, clean sheet logic |
| NCAA Football | College-specific data pipeline |
| NCAA Basketball | Tournament slates, seeding |
| Tennis | Retirement risk, set scoring |
| MMA | Fight cancellation handling |
| Esports | Title-specific meta |

---

## Contest types

| Item | Notes |
|------|-------|
| NFL Showdown | CPT 1.5x multiplier, single-game roster |
| Best Ball | Season-long, no weekly lineup optimization |
| Pick'em | Different product category |
| Survivor | Elimination format |
| Dynasty | Multi-season roster management |
| Season-long fantasy | Not DFS daily slate |
| Sportsbook betting | Out of product domain |

---

## Platform features

| Item | Notes |
|------|-------|
| Mobile applications | Native iOS/Android clients |
| Advanced simulations | Beyond initial Monte Carlo (e.g. field modeling) |
| AI coaching assistant | Conversational strategy advisor |
| Voice interface | Hands-free analysis trigger |
| Automated lineup submission | Requires certification and ToS review |
| Live bankroll tracking | Real-time account integration |
| Background data polling | Conflicts with manual-run model |
| Multi-tenant SaaS | Local-first v1 only |

---

## Architecture (deferred)

| Item | Notes |
|------|-------|
| Multi-sport abstraction layer | Introduced only when V2 sport added |
| Multi-platform adapter layer | Introduced only when V2 platform added |
| Sport plugin system | Not in v1 — see Amendment 001 |
| Generic contest type engine | v1 hardcodes Classic |

---

## Intelligence enhancements (post-v1)

| Item | Notes |
|------|-------|
| Field simulation (full GPP field) | Compute finish percentile vs simulated field |
| Live injury push notifications | Requires background workers |
| Real-time line movement alerts | Requires continuous monitoring |
| Cross-slate portfolio optimization | Multi-slate bankroll allocation |
| Social / copy lineup features | Product scope expansion |

---

## How to propose a backlog item for V2

1. Open charter amendment with scope impact  
2. Reference validation evidence from v1  
3. Estimate implementation against frozen architecture  
4. Approve before any V2 work begins  

---

## Related documents

- [AMENDMENT_001_SCOPE_LOCK.md](./architecture/AMENDMENT_001_SCOPE_LOCK.md)  
- [PROJECT_CHARTER.md](../PROJECT_CHARTER.md)  
