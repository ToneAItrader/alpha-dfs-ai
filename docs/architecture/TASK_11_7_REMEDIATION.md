# Task 11.7 — Architecture Review Remediation

**Date:** 2026-07-18  
**Scope:** Tasks 11.4–11.6 independent architecture review  
**Status:** Complete

---

## Findings & Resolutions

| ID | Severity | Finding | Resolution | Status |
|----|----------|---------|------------|--------|
| F1 | High | `@alpha-dfs/connectors` depended on `@alpha-dfs/database`; refresh orchestration inverted layering | Moved `refresh-service.ts` to `apps/web/src/lib/backend/operations/`; removed database dep from connectors | **Resolved** |
| F2 | Medium | Seed connectors imported `SEED_*` from database package | Seed connectors now load `packages/connectors/fixtures/*.json` via normalizers | **Resolved** |
| F3 | High | Production seed fallback ran unconditionally on connector failure | Gated by `CONNECTOR_MODE=seed`, `ALPHA_DFS_ALLOW_SEED_FALLBACK`, or `ALPHA_DFS_TEST_DB`; added `refresh.run.fallback_seed` counter | **Resolved** |
| F4 | High | Metrics registry had no retention enforcement | LRU eviction on counter/histogram maps bounded by `METRICS_RETENTION_COUNT` | **Resolved** |
| F5 | Low | Dead `resetProviderCredentialsCache` function | Removed | **Resolved** |
| F6 | Medium | Test helpers did not reset rate limiters / observability state | Added `resetOperationalStateForTest()` consolidated helper | **Resolved** |
| F7 | Medium | No package-boundary architecture test | Added `package-boundaries.test.ts` | **Resolved** |
| F8 | Medium | Correlation ID missing from `/api/pipeline/refresh` | Added `withCorrelationFromRequest()` middleware | **Resolved** |
| F9 | Low | Retry loop did not short-circuit on open circuit | Break retry loop on `CircuitOpenError` | **Resolved** |
| F10 | Low | Unknown provider silently used DraftKings rate limiter | Warn log + permissive default limiter for unknown providers | **Resolved** |
| F11 | Medium | Untested connector HTTP/rate-limit/refresh paths | Added unit tests for rate-limiter, provider-http-client, refresh-service | **Resolved** |
| F12 | Low | Retention env vars missing from `.env.example` | Documented `METRICS/TRACE/LOG_RETENTION_COUNT` | **Resolved** |
| F13 | Low | Duplicate repository wiring in data-operations | Reuses `refreshService.ingestionService` and `slateRepository` | **Resolved** |
| F14 | Low | Refresh route dropped per-source failure detail | Returns `sourceResults` summary in response | **Resolved** |
| F15 | Low | `resetTestDatabaseFlag` misnamed | Added `resetTestServiceCaches()`; kept alias for compatibility | **Resolved** |
| F16 | Low | Operational config cache not reset in web tests | Included in `resetOperationalStateForTest()` | **Resolved** |
| F17 | Low | Provider onboarding checklist missing | Added to `PROVIDER_COMPATIBILITY_MATRIX.md` | **Resolved** |

---

## Deferred Items

| Item | Rationale |
|------|-----------|
| External APM export | Already deferred per OBSERVABILITY_ADR_002 |
| Operational runbook for alert thresholds | Docs-only; not required for stabilization gate |
| Dedicated `@alpha-dfs/orchestration` package | No second orchestrator consumer yet; web-layer placement sufficient |

---

## Dependency Graph (Post-Remediation)

```text
shared
observability (foundational)
database → shared
connectors → observability, shared
engines/packages → shared
web → connectors, database, observability, engines
```

No circular dependencies. Connectors no longer import database.
