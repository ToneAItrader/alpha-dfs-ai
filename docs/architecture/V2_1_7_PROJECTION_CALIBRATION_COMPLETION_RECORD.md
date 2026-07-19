# V2.1-7 Projection Intelligence Calibration — Capability Completion Record

**Capability ID:** V2.1-7  
**Change Control:** V2-CC-002  
**ADR:** [ADR-016-V2_1_7_PROJECTION_CALIBRATION.md](./ADR-016-V2_1_7_PROJECTION_CALIBRATION.md)  
**Date:** 2026-07-19  
**Branch:** `v2/v2.1-intelligence`  
**Status:** Implemented — Verification Complete (2026-07-19)

---

## Implementation Summary

V2.1-7 adds deterministic pre-score projection calibration using the shared `IntelligenceAgent<TData>` pattern. Calibration runs after weather intelligence and before player analysis (scoring), with `PROJECTION_CALIBRATION_ENABLED` defaulting to `false` to preserve the V1 projection path.

| Deliverable | Location |
|-------------|----------|
| Calibration engine (pure) | `packages/projection-calibration/src/calibrate-projections.ts` |
| Player apply helper | `packages/projection-calibration/src/apply-calibrations.ts` |
| Projection Calibration Agent | `apps/web/src/lib/backend/engines/adapters/projection-calibration-engine-adapter.ts` |
| Evidence/scoring integration | `apps/web/src/lib/backend/engines/adapters/evidence-engine-adapter.ts` |
| Pipeline phase | `projection_calibration` in `packages/shared/src/pipeline.ts` |
| Confidence DTO extension | `apps/web/src/types/dto/analysis-responses.dto.ts` |
| Confidence mapper + UI | `confidence-mapper.ts` → `ProjectionCalibrationSection` |

---

## Architecture Summary

```text
Analyze pipeline:
  … → weather_intelligence → projection_calibration → player_analysis → confidence → …

Projection Calibration Agent:
  slate players + game market cache (Vegas totals)
  → rule-based calibration (injury, Vegas environment, position variance)
  → priorOutputs.projectionCalibration

Player analysis (Evidence Engine):
  applyCalibrationsToPlayers() when enabled
  → assemblePlayerEvidence() uses calibrated projection/floor/ceiling

Confidence panel:
  optional calibratedProjection / calibrationFactor / calibrationNotes via mapper
  → Projection Calibration section visible only when enabled
```

**HP-2 enforced:** Calibration inputs exclude same-run PCE output. PCE runs after scoring on calibrated player evidence.

---

## Regression Results

| Suite | Result |
|-------|--------|
| `@alpha-dfs/projection-calibration` | 3 passed |
| `@alpha-dfs/shared` | 1 passed |
| `@alpha-dfs/connectors` | 30 passed |
| `@alpha-dfs/database` | 4 passed |
| `@alpha-dfs/web` | 176 passed |
| Other workspaces | 25 passed |
| **Total** | **239 passed** |

---

## Constraints Met

- Pre-score only — no same-run PCE feedback
- Feature flag default `false` — V1 path preserved
- Deterministic rule-based calibration (no ML)
- Graceful degrade when provider data missing
- Additive optional confidence DTO fields
- No schema migration required (ADR-009 optional metadata deferred)

---

## Exactly One Next Recommended Capability

**V2.1-8 — Multi-lineup Exposure Management** per [ADR-017-V2_1_8_MULTI_LINEUP_EXPOSURE.md](./ADR-017-V2_1_8_MULTI_LINEUP_EXPOSURE.md)
