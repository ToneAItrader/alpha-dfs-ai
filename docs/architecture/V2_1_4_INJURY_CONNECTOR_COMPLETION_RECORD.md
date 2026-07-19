# V2.1-4 NFL Injury Intelligence — Capability Completion Record

**Capability ID:** V2.1-4  
**Change Control:** V2-CC-002  
**ADR:** [ADR-013-V2_1_4_INJURY_CONNECTOR.md](./ADR-013-V2_1_4_INJURY_CONNECTOR.md)  
**Date:** 2026-07-19  
**Branch:** `v2/v2.1-intelligence`  
**Status:** Implemented — Verification Complete (2026-07-19)

---

## Implementation Summary

V2.1-4 adds the `nfl-injury-feed` P1 connector and Injury Intelligence Agent using the V2.1-1 `IntelligenceAgent<TData>` pattern. Slate Intelligence panel section 4 (Injury Overview) is live when injury intelligence is present in the analyze bundle.

| Deliverable | Location |
|-------------|----------|
| NFL Injury connector (live + seed) | `packages/connectors/src/adapters/injury-live-connector.ts`, `seed-connectors.ts` |
| Injury normalizer + fixture | `packages/connectors/src/normalizers/injury-normalizer.ts`, `fixtures/injury-export.json` |
| Injury status codec (no schema migration) | `packages/database/src/mappers/injury-status-codec.ts` |
| Injury Intelligence Agent | `apps/web/src/lib/backend/engines/adapters/injury-intelligence-engine-adapter.ts` |
| Pure computation | `apps/web/src/lib/backend/engines/injury-intelligence/compute-injury-intelligence.ts` |
| Injury mapper | `apps/web/src/lib/mappers/injury-intelligence-mapper.ts` |
| Panel section 4 wiring | `slate-intelligence-mapper.ts` → `InjuryOverviewSection` |

---

## Architecture Summary

```text
Refresh: draftkings-slate (P0) + projection-feed (P1) + nfl-injury-feed (P1)
  → merge injuryStatus / practiceStatus / gameStatus (preserve projections)
  → ingest (encoded injury status — no schema migration)

Analyze pipeline:
  slate_analysis → slate_intelligence → injury_intelligence → player_analysis → …
  → dto-assembler (optional injuryIntelligence + player practice/game fields)
  → injury-intelligence-mapper + slate-intelligence-mapper
  → Slate Intelligence panel section 4 live
```

---

## Regression Results

| Suite | Result |
|-------|--------|
| `@alpha-dfs/shared` | 1 passed |
| `@alpha-dfs/connectors` | 17 passed |
| `@alpha-dfs/database` | 3 passed |
| `@alpha-dfs/web` | **163 passed** (60 files) |

**Fix applied during verification:** Injury merge no longer overwrites projection fields when injury payload carries zero values (partial merge guard).

---

## Constraints Met

- No Prisma schema migration
- P1 degrade behavior preserved
- Additive optional DTO fields only
- Section 4 only — sections 5–7 remain placeholder
- V1 compatibility via optional bundle sections + placeholder fallback

---

## Exactly One Next Recommended Capability

**V2.1-5 — Vegas Odds Connector** per [ADR-014-V2_1_5_VEGAS_ODDS_CONNECTOR.md](./ADR-014-V2_1_5_VEGAS_ODDS_CONNECTOR.md)
