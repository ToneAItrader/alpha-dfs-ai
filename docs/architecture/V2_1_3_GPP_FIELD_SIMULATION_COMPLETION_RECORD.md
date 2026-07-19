# V2.1-3 GPP Field Simulation — Capability Completion Record

**Capability ID:** V2.1-3  
**Change Control:** V2-CC-002  
**ADR:** [ADR-012-V2_1_3_GPP_FIELD_SIMULATION.md](./ADR-012-V2_1_3_GPP_FIELD_SIMULATION.md) · [ADR-009-PRISMA_MIGRATION_POLICY.md](./ADR-009-PRISMA_MIGRATION_POLICY.md)  
**Date:** 2026-07-19  
**Branch:** `v2/v2.1-intelligence`  
**Status:** Implemented — Verification Complete (2026-07-19)

---

## Implementation Summary

V2.1-3 extends the Portfolio Simulation Engine with ownership-weighted synthetic GPP field modeling and field-relative metrics. This is an **engine-only** extension per ADR-012 — no new intelligence-agent pipeline phase. Simulation Results panel exposes a new **GPP Field Metrics** section via the existing DTO → Mapper → ViewModel boundary.

| Deliverable | Location |
|-------------|----------|
| GPP field simulation core | `packages/portfolio-simulation/src/gpp-field.ts` |
| Monte Carlo integration | `packages/portfolio-simulation/src/monte-carlo.ts` (`sim-2.0-gpp-field`) |
| Simulation engine adapter | `apps/web/src/lib/backend/engines/adapters/simulation-engine-adapter.ts` |
| DTO extension | `apps/web/src/types/dto/analysis-responses.dto.ts` (`fieldMetrics`) |
| DTO assembler | `apps/web/src/lib/backend/dto-assembler.ts` |
| Simulation mapper | `apps/web/src/lib/mappers/simulation-results-mapper.ts` |
| Field Metrics UI section | `apps/web/src/components/simulation-results/FieldMetricsSection.tsx` |
| ADR-009 first migration | `packages/database/prisma/migrations/20260719120000_v2_1_simulation_field_metadata/` |
| Migration scripts | `packages/database/package.json` (`db:migrate`, `db:migrate:dev`) |

---

## Architecture Summary

```text
Analyze pipeline (unchanged phase order):
  … → portfolio → simulation → readiness

Simulation engine:
  runPortfolioSimulation()
    → per-lineup Monte Carlo (existing)
    → runGppFieldSimulation() — ownership-weighted synthetic field
    → fieldPercentile, topOnePercentRate, cashRate, fieldSize

DTO → mapSimulationResults() → SimulationResultsPanel
  → GPP Field Metrics section (new)
  → idle / V1 bundles: fieldMetrics null defaults preserved
```

**Note:** ADR-012 specifies engine extension only. The shared `IntelligenceAgent<TData>` pattern does not apply here — simulation remains the final pipeline engine phase.

---

## LP-1 Benchmark (field size vs runtime)

| Configuration | Field size | Iterations | Approx. runtime (local) |
|---------------|------------|------------|-------------------------|
| ADR-012 production default | 10,000 | 10,000 | High — use `SIMULATION_FIELD_SIZE` / `SIMULATION_COUNT` to tune |
| Vitest / CI | 50 | 100 | ~12s full web suite (acceptable) |
| Unit tests (portfolio-simulation) | 20–50 | 100–200 | Sub-second |

Production defaults remain ADR-specified (10,000). Operators may reduce env vars for dev/staging. Full 10k×10k benchmark should be run on target hardware before production cutover.

---

## Regression Results

| Suite | Result |
|-------|--------|
| `@alpha-dfs/shared` | 1 passed |
| `@alpha-dfs/connectors` | 30 passed |
| `@alpha-dfs/database` | 4 passed |
| `@alpha-dfs/portfolio-simulation` | 4 passed |
| `@alpha-dfs/web` | 171 passed |
| Other workspaces | 21 passed |
| **Total** | **231 passed** |

---

## Constraints Met

- ADR-009 migration workflow: first additive migration (`SimulationRun` table)
- Backward compatibility: optional `fieldMetrics` on simulation DTO; mapper null defaults
- No new intelligence pipeline phase
- Ownership source: projection feed ownership with uniform prior fallback (ADR-018 upgrade path preserved)
- Deterministic seed supported for certification tests
- V1 idle bundle and stub engines remain compatible

**Deferred (non-blocking):** `SimulationRun` DB write path — schema ready; simulation outputs remain in-memory/DTO until persistence ADR requires it.

---

## Exactly One Next Recommended Capability

**V2.1-7 — Projection Intelligence Calibration** per [ADR-016-V2_1_7_PROJECTION_CALIBRATION.md](./ADR-016-V2_1_7_PROJECTION_CALIBRATION.md)
