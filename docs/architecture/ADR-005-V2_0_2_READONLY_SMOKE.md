# ADR-005 — V2.0-2 Read-Only Smoke Test Mode

**Status:** Accepted (Implemented — V2.0-2)  
**Date:** 2026-07-19 · **Revised:** 2026-07-19 (Phase 2A)  
**Capability ID:** V2.0-2  
**Phase:** V2.0 — Foundation  
**Related:** [RC_VALIDATION_REPORT.md](../operations/RC_VALIDATION_REPORT.md) · [V2_ROADMAP.md](./V2_ROADMAP.md)

---

## Context

V1 `deploy:smoke` executes a full refresh + analyze cycle that **writes to `DATABASE_URL`**. RC validation flagged this as a production risk when smoke runs against a live database.

Operators need a certification path that validates:

- Deployment config
- Startup validation (DB schema probe, engines loaded)
- Connector fetch (read-only)
- Engine registry availability

…without mutating production slate data.

---

## Decision

Add **`SMOKE_MODE=readonly`** to the smoke test script (`scripts/release/smoke-test.ts`).

### Read-only smoke behavior

| Step | V1 smoke | Read-only smoke |
|------|----------|-----------------|
| deployment-config | ✓ | ✓ |
| startup-validation | ✓ | ✓ |
| connector fetch (DK + projection) | ✓ (via `refresh()`) | ✓ (via `fetchConnectorsOnly()` — no DB) |
| refresh pipeline | ✓ writes DB | **Skipped — must not call `refresh()`** |
| analyze pipeline | ✓ writes DB | **Skipped — must not call pipeline execution** |
| HTTP health checks | optional | optional |

### Configuration

```bash
SMOKE_MODE=readonly npm run deploy:smoke
```

Default remains `SMOKE_MODE=full` (current V1 behavior) for backward compatibility.

### Implementation approach

#### Connector-only fetch path

Add **`fetchConnectorsOnly()`** in `@alpha-dfs/connectors` (recommended) — a thin helper that:

1. Iterates the connector registry
2. Invokes existing `fetchWithRetry()` per connector
3. Returns fetch results and optional in-memory merged payload validation
4. Performs **zero Prisma/database operations**

Placement at the connector boundary preserves package boundaries per [CONNECTOR_ADR_001.md](./CONNECTOR_ADR_001.md).

#### Explicit prohibitions (read-only mode)

Read-only smoke **must not** invoke any of the following:

| Forbidden call | Reason |
|----------------|--------|
| `refreshService.refresh()` | Creates refresh run records and upserts source status |
| `getDataOperationsService().refreshAndEnsureReady()` | Wraps full refresh + DB validation |
| `refreshRepository.createRun()` / `upsertSourceStatus()` / `completeRun()` | Writes refresh audit tables |
| `upsertSlatePayload()` | Persists slate data |
| `getPipelineExecutionManager().execute()` | Runs analyze pipeline |

#### Success criteria (read-only mode)

- P0 connectors return valid payloads
- Optional in-memory payload merge succeeds
- **Zero Prisma writes** during the smoke run (verified by regression test)
- Deployment config and startup validation pass

#### Smoke script changes

- `scripts/release/smoke-test.ts` branches on `SMOKE_MODE`
- No new API routes required
- No DTO changes

---

## Consequences

### Positive

- Safe production verification without DB writes
- Addresses RC outstanding risk M1
- Backward compatible — full smoke unchanged

### Negative

- Does not validate end-to-end analyze on production DB
- Operators must still run full smoke in staging

---

## Implementation gate requirements

- [x] V2 implementation gate open for Phase V2.0
- [x] Regression test: readonly smoke passes without DB mutation
- [x] Update DEPLOYMENT_GUIDE.md and RELEASE_CHECKLIST.md

---

## V1 impact

**Additive only.** Existing `deploy:smoke` behavior preserved as default.
