# ADR-001 — Data Connector Architecture

**Status:** Accepted (Phase 2A revised — P2 tier)  
**Date:** 2026-07-18 · **Revised:** 2026-07-19 (V2.1 Phase 2A — HP-4)  
**Task:** 11.4 — Live Data Integration & Operational Readiness

---

## Context

Tasks 11.1–11.3 established real engine interfaces, database ingestion, and end-to-end pipeline execution using seed data. Task 11.4 transitions to operationally ready data ingestion while preserving the frozen frontend contract.

---

## Decision

### Supported data sources (v1)

| Source ID | Priority | Role | Implementation |
|-----------|----------|------|----------------|
| `draftkings-slate` | P0 | Slate pool, salaries, eligibility | Live file/API adapter (Task 11.5) |
| `projection-feed` | P1 | Projections, floor/ceiling | Live file/API adapter (Task 11.5) |

Live provider adapters implement `DataConnector`. File export and REST API modes are configured via environment credentials. See [PROVIDER_COMPATIBILITY_MATRIX.md](./PROVIDER_COMPATIBILITY_MATRIX.md). Set `CONNECTOR_MODE=seed` for seed-backed fallback without credentials.

### Connector lifecycle

```text
invoke refresh
  → run P0 connectors (retry)
  → run P1 connectors (retry, degrade on failure)
  → run P2 connectors (single attempt, optional — V2.1+)
  → merge payloads
  → validate pre-persist
  → upsert database
  → post-persist validation
  → record refresh run + source status
```

### Refresh cadence

- **Primary:** On every **Analyze Slate** request (charter: manual-run only).
- **Secondary:** `POST /api/pipeline/refresh` for pre-flight refresh without full analysis.
- **No background workers or cron** — scheduling is external if needed later.

### Retry / backoff

- Max **3 attempts** per connector.
- Exponential backoff: `250ms × 2^attempt` (250, 500, 1000 ms).
- P0 failure → refresh fails (fail-closed).
- P1 failure → refresh continues with `degraded: true`.

### Priority tiers

| Tier | Behavior on failure | Degrade flag | Retry |
|------|---------------------|--------------|-------|
| **P0** | Refresh fails (fail-closed) | N/A — blocks | 3 attempts |
| **P1** | Refresh continues | `degraded: true` | 3 attempts |
| **P2** | Refresh continues | None by default | 1 attempt |

**P2 (V2.1+ — optional enrichment):** Introduced for connectors such as weather ([ADR-015](./ADR-015-V2_1_6_WEATHER_CONNECTOR.md)). P2 sources supply supplementary context only. Absence of P2 data must not block refresh, analyze, or degrade confidence unless operator sets `CONNECTOR_P2_VISIBILITY=1` for observability visibility.

### Validation rules

| Check | When | Action |
|-------|------|--------|
| P0 connector success | Pre-persist | Block refresh |
| Position minimums | Post-persist | Block refresh |
| Projection coverage | Post-persist | Block refresh |
| P1 connector failure | Pre-persist | Warn + degrade confidence inputs |

### Failover

1. If P0 connectors fail after retries → refresh error; analyze route returns 500.
2. If no slate exists and refresh fails → dev/test may fall back to `seedDatabase()` when `CONNECTOR_MODE=seed`, `ALPHA_DFS_ALLOW_SEED_FALLBACK=true`, or `ALPHA_DFS_TEST_DB=true`.
3. P1 sources missing → engines run with degraded domain coverage (existing engine behavior).

---

## Consequences

- Connectors are isolated in `@alpha-dfs/connectors` (fetch, normalize, retry only).
- Refresh orchestration lives in the web operations layer (`apps/web/src/lib/backend/operations/refresh-service.ts`).
- Health endpoints expose DB, connector, and data freshness without changing analysis DTOs.
- Future live API keys plug into connector adapters without frontend changes.
