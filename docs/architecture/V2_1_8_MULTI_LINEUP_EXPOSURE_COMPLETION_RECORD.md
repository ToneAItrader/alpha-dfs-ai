# V2.1-8 Multi-lineup Exposure Management — Capability Completion Record

**Capability ID:** V2.1-8  
**Change Control:** V2-CC-002  
**ADR:** [ADR-017-V2_1_8_MULTI_LINEUP_EXPOSURE.md](./ADR-017-V2_1_8_MULTI_LINEUP_EXPOSURE.md)  
**Date:** 2026-07-19  
**Branch:** `v2/v2.1-intelligence`  
**Status:** Implemented — Verification Complete (2026-07-19)

---

## Implementation Summary

V2.1-8 extends the Portfolio Intelligence Engine (PIE) with multi-lineup exposure metrics across Primary + Hail Mary lineups (N=2 MVP). This is a **PIE extension** per ADR-017 — no new pipeline phase or IntelligenceAgent.

| Deliverable | Location |
|-------------|----------|
| Exposure computation | `packages/portfolio-intelligence/src/multi-lineup-exposure.ts` |
| PIE integration | `packages/portfolio-intelligence/src/portfolio-builder.ts` (`pie-2.0-exposure`) |
| Domain type extension | `packages/shared/src/engines.ts` (`exposureSummary`) |
| Portfolio Health DTO | `apps/web/src/types/dto/analysis-responses.dto.ts` |
| Portfolio Health mapper + UI | `portfolio-health-mapper.ts` → `MultiLineupExposureSection` |
| Portfolio Readiness snapshot | `exposureBalance` + `exposureWarnings` via `dto-assembler.ts` |

---

## Architecture Summary

```text
Portfolio engine (existing phase):
  buildPortfolioOutput()
    → build Primary + Hail Mary lineups
    → computeMultiLineupExposure([primary[0], hailMary[0]])
    → exposureSummary on PortfolioEngineOutput

DTO → mapPortfolioHealth() → Portfolio Health panel
  → Multi-Lineup Exposure section (when summary present)

Portfolio Readiness:
  exposureBalance derived from exposureSummary warnings
  exposureWarnings passed through snapshot
```

---

## Regression Results

| Suite | Result |
|-------|--------|
| `@alpha-dfs/portfolio-intelligence` | 2 passed |
| `@alpha-dfs/web` | 178 passed |
| Other workspaces | 62 passed |
| **Total** | **242 passed** |

---

## Constraints Met

- N=2 MVP scope (Primary + Hail Mary)
- Mapper-only UI changes on existing portfolio panels
- V1 position exposure labels unchanged
- No lineup submission/export automation
- Amendment 001 unchanged

---

## Exactly One Next Recommended Capability

**V2.1-9 — Ownership Prediction (baseline)** per [ADR-018-V2_1_9_OWNERSHIP_PREDICTION.md](./ADR-018-V2_1_9_OWNERSHIP_PREDICTION.md)
