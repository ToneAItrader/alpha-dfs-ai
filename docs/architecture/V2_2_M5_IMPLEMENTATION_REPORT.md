# V2.2 Milestone M5 — Implementation Report

**Milestone:** M5 — Evidence Providers  
**Branch:** `v2/v2.2-adi`  
**Date:** 2026-07-19  
**Status:** ✅ Complete — Pending Certification  
**Model:** Composer 2.5  
**Related:** [V2_2_ENGINEERING_PLAN.md](./V2_2_ENGINEERING_PLAN.md) · [ADR-021-V2_2_CONNECTOR_FRAMEWORK.md](./ADR-021-V2_2_CONNECTOR_FRAMEWORK.md) · [V2_2_M4_CERTIFICATION_REVIEW.md](./V2_2_M4_CERTIFICATION_REVIEW.md)

---

## 1. Summary

Milestone M5 delivers the `@alpha-dfs/adi-providers` package with seven seed-based evidence provider adapters. Each adapter implements the ADR-021 `EvidenceProvider` contract and emits **`AdiEvidencePackage` only** (HP-2). The ADI platform now performs real parallel fetch when providers are registered; the web app bootstraps providers on first pipeline run. With all feature flags off (default), V2.1 behavior is unchanged.

Implementation was interrupted by an environment outage and recovered without scope expansion. Four recovery fixes were applied (fixture path, test helper, integration import shadow, dfs-content NaN guard).

---

## 2. Components Implemented

| Component | Location | Description |
|-----------|----------|-------------|
| `@alpha-dfs/adi-providers` | `packages/adi-providers/` | New workspace package — seven provider adapters |
| Provider registry | `src/registry.ts` | `createAllEvidenceProviders()`, `registerEvidenceProviders()` |
| Seed provider factory | `src/shared/create-seed-provider.ts` | Shared `EvidenceProvider` implementation with retry, health, failure simulation |
| Fixture loader | `src/shared/fixture-loader.ts` | Loads JSON seed fixtures from `fixtures/` |
| Package builder | `src/shared/package-builder.ts` | Constructs typed `AdiEvidencePackage` / `AdiEvidenceItem` |
| Player resolver | `src/shared/player-resolver.ts` | Maps fixture names to slate player/game IDs |
| Retry policy | `src/shared/provider-retry.ts` | P0/P1/P2 timeout and backoff per ADR-021 |
| Seven seed fixtures | `fixtures/*-seed.json` | Deterministic provider input data |
| Platform wiring | `packages/adi-platform/src/adi-platform.ts` | Real `ConnectorManager`, `registerAdiEvidenceProviders()`, `fetchEnabled` when providers registered |
| Orchestrator fetch | `packages/adi-platform/src/agent-orchestrator.ts` | Parallel fetch, cache write, `adi.provider.degraded` events |
| Web bootstrap | `apps/web/src/lib/backend/adi-bootstrap.ts` | One-time provider registration per process |
| Pipeline hook | `pipeline-execution-manager.ts` | Calls `ensureAdiProvidersRegistered()` before ADI prepare |

---

## 3. Seven Provider Inventory

| Provider ID | Adapter | Fixture | Priority | Domain | Env Flag |
|-------------|---------|---------|----------|--------|----------|
| `news` | `createNewsProvider` | `news-seed.json` | P0 | news | `ADI_PROVIDER_NEWS_ENABLED` |
| `social` | `createSocialProvider` | `social-seed.json` | P1 | social | `ADI_PROVIDER_SOCIAL_ENABLED` |
| `sportsbook` | `createSportsbookProvider` | `sportsbook-seed.json` | P0 | sportsbook | `ADI_PROVIDER_SPORTSBOOK_ENABLED` |
| `consensus` | `createConsensusProvider` | `consensus-seed.json` | P0 | consensus | `ADI_PROVIDER_CONSENSUS_ENABLED` |
| `dfs_content` | `createDfsContentProvider` | `dfs-content-seed.json` | P1 | dfs_content | `ADI_PROVIDER_DFS_CONTENT_ENABLED` |
| `betting` | `createBettingProvider` | `betting-seed.json` | P1 | betting | `ADI_PROVIDER_BETTING_ENABLED` |
| `historical_learning` | `createHistoricalLearningProvider` | `historical-seed.json` | P2 | historical_learning | `ADI_PROVIDER_HISTORICAL_LEARNING_ENABLED` |

All providers output version `1.0.0`. Raw fixture fields (`headlines`, `postCount`, etc.) are normalized at the adapter boundary and never appear in package output.

---

## 4. Provider Compatibility Matrix

| Provider | Registration | Config Key | Fixture | Retry / Backoff | Timeout | Health Check | Output Schema | Failure Mode |
|----------|--------------|------------|---------|-----------------|---------|--------------|---------------|--------------|
| news | `ConnectorManager.register` via bootstrap | `ADI_PROVIDER_NEWS_ENABLED` | `news-seed.json` | 3 attempts, exponential (250ms × 2^n) | 10s | Loads fixture; `healthy` / `degraded` / `unavailable` | `AdiEvidencePackage[]` — injury/status claims per player | `ok:false`, `PROVIDER_UNAVAILABLE` or `FETCH_FAILED`; pipeline continues (INT-2) |
| social | Same | `ADI_PROVIDER_SOCIAL_ENABLED` | `social-seed.json` | 2 attempts, linear (250ms × n) | 8s | Same | Sentiment/rumor claims; filters `postCount < 5` | Same degrade pattern |
| sportsbook | Same | `ADI_PROVIDER_SPORTSBOOK_ENABLED` | `sportsbook-seed.json` | 3 attempts, exponential | 10s | Same | `line_movement`, `implied_total` per game | Same; **no V2.1 Vegas field merge** (HP-2) |
| consensus | Same | `ADI_PROVIDER_CONSENSUS_ENABLED` | `consensus-seed.json` | 3 attempts, exponential | 10s | Same | Projection consensus; requires ≥2 sources | Same |
| dfs_content | Same | `ADI_PROVIDER_DFS_CONTENT_ENABLED` | `dfs-content-seed.json` | 2 attempts, linear | 8s | Same | `chalk_probability`, leverage, stack signals | Same; `siteTier` defaults to 1 |
| betting | Same | `ADI_PROVIDER_BETTING_ENABLED` | `betting-seed.json` | 2 attempts, linear | 8s | Same | Expert pick direction; requires ≥3 experts | Same |
| historical_learning | Same | `ADI_PROVIDER_HISTORICAL_LEARNING_ENABLED` | `historical-seed.json` | 1 attempt (no retry) | 5s | Same | `source_reliability` meta-evidence only; requires ≥30 samples | Same |

**Shared contract:** All providers implement `EvidenceProvider.fetch()` → `EvidenceFetchResult` and `health()` → `ProviderHealth`. Packages include `metadata.providerId` for orchestrator filtering.

---

## 5. Validation Results

| Command | Result |
|---------|--------|
| `npm install` | ✅ Pass |
| `npm run test --workspace=@alpha-dfs/adi-providers` | ✅ **49/49** pass |
| `npm run test --workspace=@alpha-dfs/adi-platform` | ✅ **23/23** pass |
| `npm test --workspaces --if-present` | ✅ **322** pass |
| `npm test --workspace=@alpha-dfs/web` | ✅ **184/184** pass |
| `npm run build` | ✅ Pass |

### M5 acceptance criteria (Engineering Plan §4)

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Each provider ≥ 5 unit tests | ✅ | 7 × 5 common tests + 9 provider-specific = 44 unit + 5 integration |
| ConnectorManager parallel fetch (seed mode) | ✅ | `integration.test.ts` parallel fetch |
| Per-provider feature flags | ✅ | `adi-config.ts` + integration tests |
| Provider failure degrades without abort (INT-2, INT-3) | ✅ | `integration.test.ts` |
| Raw payloads never leave adapter | ✅ | Common test asserts no `headlines`/`postCount` in output |
| Workspace tests ≥ 260 | ✅ | **322** (+49 vs M4 baseline 273) |
| Build pass | ✅ | `npm run build` |

---

## 6. Test Summary

### `@alpha-dfs/adi-providers` — 49 tests

| Suite | Tests | Coverage |
|-------|-------|----------|
| Common contract (×7 providers) | 35 | fetch, health, failure, boundary, non-empty |
| Provider-specific validation | 7 | news mapping, social filter, consensus min sources, betting min experts, historical meta-only, sportsbook types, dfs content types |
| Failure behavior | 2 | simulateFailure fetch + health |
| Integration | 4 | parallel fetch, INT-2, INT-3, orchestrator cache |

### Regression delta vs M4

| Workspace | M4 | M5 | Delta |
|-----------|----|----|-------|
| Total workspace tests | 273 | 322 | **+49** |
| adi-platform | 23 | 23 | 0 |
| web | 184 | 184 | 0 |

Zero V2.1 behavioral regression observed.

---

## 7. Architecture Compliance

| Requirement | Source | Status |
|-------------|--------|--------|
| `EvidenceProvider` interface | ADR-021 | ✅ All seven adapters |
| Retry / timeout by priority | ADR-021 | ✅ `provider-retry.ts` |
| Normalization at adapter boundary | ADR-021, HP-2 | ✅ `create-seed-provider.ts` |
| Provider versioning | ADR-021 | ✅ `providerVersion: "1.0.0"` |
| Parallel fetch via ConnectorManager | ADR-019 | ✅ Real fetch replaces M4 stub |
| Feature flags default off | ADR-019 | ✅ All `ADI_PROVIDER_*_ENABLED=false` |
| No fusion logic | ADR-020 | ✅ No `fuseEvidence()` |
| No engine ADI consumption | M7 gate | ✅ `getNormalizedEvidence()` returns `undefined` |
| No ADI UI | ABR-001 | ✅ No new routes/panels |
| Package boundary | V2_2_API_CONTRACTS | ✅ Engines do not import `@alpha-dfs/adi-providers` |

---

## 8. HP-2 Verification

HP-2 requires V2.1 connector coexistence — ADI providers must not duplicate or merge V2.1 injury/Vegas/weather field logic.

| Check | Result | Evidence |
|-------|--------|----------|
| Providers emit `AdiEvidencePackage` only | ✅ | All adapters use `buildEvidencePackage()` from shared types |
| No V2.1 `EvidenceItem` imports in providers | ✅ | Grep — providers import only `@alpha-dfs/shared` ADI types |
| Sportsbook outputs ADI evidence types | ✅ | `line_movement`, `implied_total` — not V2.1 Vegas DTO fields |
| Raw fixture never serialized to engines | ✅ | Unit test + adapter normalization |
| V2.1 pipeline unchanged when ADI off | ✅ | `adi-pipeline-integration.test.ts` |

---

## 9. Recovery Fixes Applied

| Issue | Fix | File |
|-------|-----|------|
| News-only `simulateFailure` test skipped other providers | Scoped failure test to `createNewsProvider({ simulateFailure: true })` | `provider-test-helpers.ts` |
| Fixture path resolved incorrectly | Fixed relative path (`../..` from `src/shared/`) | `fixture-loader.ts` |
| Integration test shadowed registry import | Import `createSocialProvider` from `./registry` | `integration.test.ts` |
| NaN confidence when `siteTier` missing | Default `siteTier ?? 1` + fixture fix | `dfs-content-provider.ts`, `dfs-content-seed.json` |

---

## 10. Remaining Risks

| ID | Risk | Severity | Mitigation |
|----|------|----------|------------|
| R1 | Seed fixtures only — no live API validation | Medium | M8 E2E; live connectors deferred post-V2.2 |
| R2 | Orchestrator fetch uses empty `players`/`games` context | Low | M7 passes full slate context when engine integration wires fetch |
| R3 | `getNormalizedEvidence()` still returns undefined | Low | By design — M6 fusion produces bundle; M7 populates engines |
| R4 | Feature flag cache requires process restart | Low | Documented in M4; same for M5 provider flags |
| R5 | HP-2 discipline depends on future live adapters | Medium | M5 certification gate; ADR-021 contract enforced in code review |
| R6 | No automated DTO snapshot for ADI packages | Low | Defer to M6 when fusion output is consumed |

---

## 11. Work Deferred to M6

| Item | Milestone |
|------|-----------|
| Evidence Fusion Engine (`fuseEvidence()`) | M6 |
| `NormalizedEvidenceBundle` production | M6 |
| `getNormalizedEvidence()` population | M6 |
| Fusion metrics activation (`adi.fusion.*`) | M6 |
| DTO snapshot regression for ADI output | M6 |

**Also deferred:** Engine integration (M7), ADI UI (forbidden), release certification (M8).

---

## 12. M5 Acceptance Criteria Checklist

- [x] Seven `EvidenceProvider` adapters with seed fixtures
- [x] Each provider ≥ 5 unit tests
- [x] ConnectorManager parallel fetch in seed mode
- [x] Per-provider feature flags (`ADI_PROVIDER_<ID>_ENABLED`)
- [x] INT-2 single provider failure degrades without abort
- [x] INT-3 all providers fail returns empty without throw
- [x] Raw provider payloads never leave adapter boundary
- [x] Workspace tests ≥ 260
- [x] Production build pass
- [x] Package README + env vars documented
- [x] No M6/M7/M8 scope implemented

---

## Appendix A — Change Inventory (M5)

Baseline: M4 certified @ `dfd1211`. All paths relative to repository root.

### Modified (9 files)

| File | Change |
|------|--------|
| `.env.example` | Added `ADI_PROVIDER_*_ENABLED` env vars (commented, default off) |
| `apps/web/next.config.ts` | Added `@alpha-dfs/adi-providers` to `transpilePackages` |
| `apps/web/package.json` | Added `@alpha-dfs/adi-providers` dependency |
| `apps/web/src/lib/backend/adi-pipeline-integration.test.ts` | Bootstrap reset in test setup |
| `apps/web/src/lib/backend/pipeline-execution-manager.ts` | `ensureAdiProvidersRegistered()` + bootstrap reset on manager reset |
| `package-lock.json` | Workspace lockfile for adi-providers |
| `packages/adi-platform/src/adi-platform.ts` | Real ConnectorManager, provider registration, fetchEnabled, cache accessor |
| `packages/adi-platform/src/agent-orchestrator.ts` | Fetch path, cache write, degraded events |
| `packages/adi-platform/src/index.ts` | Export `registerAdiEvidenceProviders` |

### Added (28 source files)

| File | Purpose |
|------|---------|
| `apps/web/src/lib/backend/adi-bootstrap.ts` | One-time provider registration |
| `packages/adi-providers/package.json` | Package manifest |
| `packages/adi-providers/tsconfig.json` | TypeScript config |
| `packages/adi-providers/vitest.config.ts` | Test config |
| `packages/adi-providers/README.md` | Provider inventory + usage |
| `packages/adi-providers/fixtures/news-seed.json` | News fixture |
| `packages/adi-providers/fixtures/social-seed.json` | Social fixture |
| `packages/adi-providers/fixtures/sportsbook-seed.json` | Sportsbook fixture |
| `packages/adi-providers/fixtures/consensus-seed.json` | Consensus fixture |
| `packages/adi-providers/fixtures/dfs-content-seed.json` | DFS content fixture |
| `packages/adi-providers/fixtures/betting-seed.json` | Betting fixture |
| `packages/adi-providers/fixtures/historical-seed.json` | Historical learning fixture |
| `packages/adi-providers/src/index.ts` | Public exports |
| `packages/adi-providers/src/registry.ts` | Provider factory + registration |
| `packages/adi-providers/src/integration.test.ts` | INT-2, INT-3, parallel fetch, cache |
| `packages/adi-providers/src/providers/news-provider.ts` | News adapter |
| `packages/adi-providers/src/providers/social-provider.ts` | Social adapter |
| `packages/adi-providers/src/providers/sportsbook-provider.ts` | Sportsbook adapter |
| `packages/adi-providers/src/providers/consensus-provider.ts` | Consensus adapter |
| `packages/adi-providers/src/providers/dfs-content-provider.ts` | DFS content adapter |
| `packages/adi-providers/src/providers/betting-provider.ts` | Betting adapter |
| `packages/adi-providers/src/providers/historical-learning-provider.ts` | Historical learning adapter |
| `packages/adi-providers/src/providers/provider-test-helpers.ts` | Shared test utilities |
| `packages/adi-providers/src/providers/providers.test.ts` | Provider unit tests |
| `packages/adi-providers/src/shared/create-seed-provider.ts` | Seed provider factory |
| `packages/adi-providers/src/shared/fixture-loader.ts` | Fixture loader |
| `packages/adi-providers/src/shared/package-builder.ts` | Package builder |
| `packages/adi-providers/src/shared/player-resolver.ts` | Player/game resolver |
| `packages/adi-providers/src/shared/provider-retry.ts` | Retry policy |

### Deleted

None.

---

## Exactly one next action

**M5 Certification Review (GPT-5.5):** [V2_2_M5_CERTIFICATION_REVIEW.md](./V2_2_M5_CERTIFICATION_REVIEW.md) — independent milestone approval before M6.
