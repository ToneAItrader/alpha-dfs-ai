# ADR-004 — V2.0-1 External Telemetry Export

**Status:** Accepted (Implemented — V2.0-1)  
**Date:** 2026-07-19 · **Revised:** 2026-07-19 (Phase 2A)  
**Capability ID:** V2.0-1  
**Phase:** V2.0 — Foundation  
**Related:** [OBSERVABILITY_ADR_002.md](./OBSERVABILITY_ADR_002.md) · [V2_ROADMAP.md](./V2_ROADMAP.md)

---

## Context

V1 observability (ADR-002) stores metrics, traces, and logs in **in-process ring buffers**. This is sufficient for development and single-host deployment but limits production debugging when:

- The process restarts and buffers are lost
- External APM (Datadog, Grafana Cloud, Honeycomb) is required
- Long-term trend analysis is needed

V1 RC identified external telemetry as a deferred ops gap. This ADR defines V2.0-1 without changing V1 behavior.

---

## Decision

Introduce an **optional telemetry export adapter layer** in a new package `@alpha-dfs/telemetry-export` (proposed — not created until implementation gate opens).

### Export modes

| Mode | Env var | Behavior |
|------|---------|----------|
| `none` (default) | `TELEMETRY_EXPORT_MODE=none` | V1 behavior unchanged — in-process only |
| `file` | `TELEMETRY_EXPORT_MODE=file` | Append JSON lines to configured path on interval |
| `otlp` | `TELEMETRY_EXPORT_MODE=otlp` | Push to OTLP endpoint (HTTP/gRPC) |

### Design constraints

- **No DTO changes** — export reads from existing observability ring buffers
- **No UI changes** — `/api/health/metrics` and `/api/health/diagnostics` remain authoritative for Mission Control
- **Fail-open** — export failures must not block pipeline or refresh
- **Async batch** — export on configurable interval (default 30s), not per-event sync

### Interface (proposed)

```text
TelemetryExporter
  start(config): void
  flush(): Promise<void>
  stop(): Promise<void>
```

### Package dependency direction

| Package | Depends on | Must not depend on |
|---------|------------|-------------------|
| `@alpha-dfs/telemetry-export` | `@alpha-dfs/observability` | `apps/web`, `@alpha-dfs/database` |
| `@alpha-dfs/observability` | — | `@alpha-dfs/telemetry-export` |

Observability ring buffers remain authoritative. The export package is a **downstream consumer only** — no hooks or callbacks registered inside `@alpha-dfs/observability`.

### Initialization and lifecycle

| Decision | Specification |
|----------|---------------|
| **Initialization site** | `apps/web` startup — alongside backend dependency container init (not inside observability core) |
| **Data source** | Exporter reads snapshots via `getMetricsSnapshot()`, `getRecentLogs()`, `getRecentTraces()` |
| **Start** | Call `TelemetryExporter.start(config)` on process boot when `TELEMETRY_EXPORT_MODE` ≠ `none` |
| **Stop** | Call `TelemetryExporter.stop()` on graceful shutdown |
| **V1 default** | No exporter instance created when mode is unset or `none` |

V1 code paths unchanged when mode=`none`.

---

## Consequences

### Positive

- Production APM integration without rewriting observability core
- V1 deployments unaffected (default off)
- Aligns with V2 layered extension model

### Negative

- Additional package to maintain
- OTLP dependency adds build surface area

### Risks

| Risk | Mitigation |
|------|------------|
| Export adds latency | Async batch; fail-open |
| Credential exposure in OTLP config | Env vars only; document in deployment guide |

---

## Implementation gate requirements

- [x] V2 implementation gate open for Phase V2.0
- [x] Package ADR accepted (this document)
- [x] Unit tests for file export mode
- [ ] Integration test with mock OTLP receiver (optional for V2.0-1 MVP — HTTP JSON batch implemented)

---

## V1 impact

**None.** Default mode preserves ADR-002 behavior exactly.
