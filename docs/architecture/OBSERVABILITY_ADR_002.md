# ADR-002 — Observability & Production Hardening

**Status:** Accepted  
**Date:** 2026-07-18  
**Task:** 11.6 — Production Hardening & Observability

---

## Context

Tasks 11.1–11.5 established the real engine pipeline, live connectors, refresh orchestration, and basic operational logging. Task 11.6 adds production-grade observability without changing application behavior or DTO contracts.

---

## Decision

### Metric naming standard

| Domain | Metric | Type |
|--------|--------|------|
| Pipeline | `pipeline.run.total` | counter |
| Pipeline | `pipeline.run.success` / `pipeline.run.failure` | counter |
| Pipeline | `pipeline.phase.duration_ms` | histogram |
| Refresh | `refresh.run.total` / `refresh.run.success` / `refresh.run.degraded` / `refresh.run.failure` | counter |
| Connector | `connector.fetch.total` / `connector.fetch.success` / `connector.fetch.failure` | counter |
| Connector | `connector.fetch.duration_ms` | histogram |
| Engine | `engine.execution.duration_ms` | histogram |
| Database | `database.operation.duration_ms` | histogram |

Labels: `phase`, `engine_id`, `source_id`, `status`.

### Correlation ID propagation

- Generated per analysis request (`run-*` or `X-Correlation-ID` header).
- Propagated via `AsyncLocalStorage` through refresh → pipeline → engines.
- Included in all structured logs and trace spans.

### Structured log format

```json
{
  "timestamp": "ISO-8601",
  "level": "info|warn|error",
  "component": "pipeline|connector|refresh|engine|health",
  "event": "phase.complete",
  "message": "human readable",
  "correlationId": "corr-...",
  "runId": "run-...",
  "context": {}
}
```

### Health / readiness indicators

Existing `/api/health` and `/api/health/ready` unchanged in contract. New `/api/health/metrics` and `/api/health/diagnostics` expose observability data (Class B — not consumed by Presentation).

### Timeout & retry defaults

| Setting | Default | Env var |
|---------|---------|---------|
| Pipeline timeout | 120s | `PIPELINE_TIMEOUT_MS` |
| Connector fetch timeout | 15s | `CONNECTOR_TIMEOUT_MS` |
| HTTP provider timeout | 15s | `PROVIDER_HTTP_TIMEOUT_MS` |
| Max retries | 3 | `CONNECTOR_MAX_RETRIES` |
| Retry base delay | 250ms | `CONNECTOR_RETRY_BASE_MS` |
| Circuit breaker threshold | 5 failures | `CIRCUIT_BREAKER_THRESHOLD` |
| Circuit breaker reset | 60s | `CIRCUIT_BREAKER_RESET_MS` |

### Alert thresholds (operational guidance)

| Signal | Warning | Critical |
|--------|---------|----------|
| Pipeline failure rate | > 10% / 1h | > 25% / 1h |
| Connector failure rate | > 20% / 1h | > 50% / 1h |
| P95 pipeline duration | > 30s | > 60s |
| Circuit breaker open | any source | > 1 P0 source |

### Metric retention

In-process ring buffer: last **500** metric events, **100** trace spans, **100** log entries. External APM export deferred.

---

## Consequences

- Observability isolated in `@alpha-dfs/observability`.
- Presentation layer unchanged; diagnostics via API only.
- Connectors and pipeline emit metrics/traces without DTO changes.
