# V2.2 Evidence Provider Specifications

**Status:** Planning Complete — Program 5  
**Date:** 2026-07-19  
**Related:** [ADR-021](./ADR-021-V2_2_CONNECTOR_FRAMEWORK.md) · [V2_2_DATA_MODEL.md](./V2_2_DATA_MODEL.md)

---

## Provider summary

| # | Provider ID | Sources | Primary evidence types | Downstream consumers |
|---|-------------|---------|------------------------|----------------------|
| 1 | `news` | CBS, ESPN, NFL.com, Yahoo, AP | injury_status, practice_report, game_status | Injury intel, PCE |
| 2 | `social` | Reddit, X, Bluesky, beat writers | social_sentiment, rumor_confidence, narrative_confidence | Ownership, PCE |
| 3 | `sportsbook` | DK, FD, BetMGM, Caesars, Pinnacle | line_movement, implied_total, sharp_indicator | Vegas intel, simulation |
| 4 | `consensus` | FantasyPros, CBS, ESPN, Rotowire, Rotogrinders | consensus_projection, projection_variance | PCE, ownership |
| 5 | `dfs_content` | Rotogrinders, Stokastic, FLabs, ETR, NumberFire | chalk_probability, leverage_signal, stack_recommendation | Ownership, PIE |
| 6 | `betting` | Covers, Action Network, VSIN, TeamRankings, OddsTrader | narrative_confidence (pick consensus) | Vegas intel, simulation |
| 7 | `historical_learning` | Internal run history | source_reliability | Fusion weighting only |

---

## Per-provider contract (template)

Each provider implements `EvidenceProvider` (ADR-021) and ships:

- `src/<provider>-provider.ts`
- `fixtures/<provider>-seed.json`
- `src/<provider>-provider.test.ts`

### Provider 1 — News Intelligence

**Normalization:** Headlines → injury/practice claims mapped to `subjectId` via player name + team resolver.

**Validation:** Reject items without resolvable player/team.

**Confidence:** Feed tier (AP/NFL.com = 0.85, aggregator = 0.65).

**Failure:** Return empty packages; degrade note "news unavailable".

### Provider 2 — Social Intelligence

**Normalization:** Post volume + keyword rules → sentiment score (-1..1) → `social_sentiment`.

**Validation:** Min post threshold before emitting item.

**Confidence:** Inversely proportional to rumor keywords.

**Failure:** Empty package; never surface raw posts.

### Provider 3 — Sportsbook Intelligence

**Normalization:** Odds snapshots → delta vs open → `line_movement`; totals → `implied_total`.

**Validation:** Game key must match slate games cache.

**Confidence:** Higher when multi-book agreement.

**Failure:** Fall back to V2.1 vegas connector only.

### Provider 4 — Consensus Intelligence

**Normalization:** Multi-source projections → mean/median → `consensus_projection`; stddev → `projection_variance`.

**Validation:** Min 2 sources for consensus item.

**Confidence:** Source count / max sources.

**Failure:** Empty; PCE uses feed projection.

### Provider 5 — DFS Content Intelligence

**Normalization:** Article tags → `chalk_probability`, `leverage_signal`, `stack_recommendation`.

**Validation:** Content classification rules (keyword + site tier).

**Confidence:** Site tier weight × recency.

**Failure:** Empty; ownership uses V2.1 baseline model.

### Provider 6 — Betting Intelligence

**Normalization:** Expert pick aggregation → directional confidence on game/player.

**Validation:** Min expert count.

**Confidence:** Expert track record weight (static MVP; learning in P7).

**Failure:** Empty package.

### Provider 7 — Historical Learning

**Normalization:** Reads past run accuracy → updates `SourceReliabilityRecord`.

**Validation:** Min sample size before weight adjustment.

**Confidence:** N/A — outputs meta evidence only.

**Failure:** Static default weights from Source Registry.

---

## Cross-provider rules

- No provider emits UI-facing strings
- All items include `observedAt` and TTL
- Player resolution uses slate player index — unresolved items dropped with metric
