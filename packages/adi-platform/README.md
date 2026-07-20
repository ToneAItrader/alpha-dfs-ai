# @alpha-dfs/adi-platform

Alternative Data Intelligence (ADI) platform infrastructure for Alpha DFS AI V2.2.

## Scope (M4)

M4 delivers platform skeleton only:

- `AdiPlatform` facade (`prepare`, `complete`, `shutdown`)
- `ConnectorManager` (stub fetch in M4)
- `SourceRegistry` (seven provider descriptors)
- `EvidenceCache` (run-scoped TTL)
- `EventBus` (in-process typed pub/sub)
- `AgentOrchestrator` (bootstrap events; fetch disabled until M5)
- Feature flags and core observability metrics (ADR-019 HP-1)

Evidence providers (M5), fusion engine (M6), and engine integration (M7) are **not** included in M4.

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ADI_PLATFORM_ENABLED` | `false` | Master ADI switch — when false, V2.1 pipeline behavior is unchanged |
| `ADI_PROVIDER_NEWS_ENABLED` | `false` | Enable news evidence provider (M5+) |
| `ADI_PROVIDER_SOCIAL_ENABLED` | `false` | Enable social evidence provider (M5+) |
| `ADI_PROVIDER_SPORTSBOOK_ENABLED` | `false` | Enable sportsbook evidence provider (M5+) |
| `ADI_PROVIDER_CONSENSUS_ENABLED` | `false` | Enable consensus evidence provider (M5+) |
| `ADI_PROVIDER_DFS_CONTENT_ENABLED` | `false` | Enable DFS content evidence provider (M5+) |
| `ADI_PROVIDER_BETTING_ENABLED` | `false` | Enable betting evidence provider (M5+) |
| `ADI_PROVIDER_HISTORICAL_LEARNING_ENABLED` | `false` | Enable historical learning provider (M5+) |

## Metrics (M4)

| Metric | Type |
|--------|------|
| `adi.platform.ready.total` | Counter |
| `adi.provider.fetch.duration_ms` | Histogram |
| `adi.provider.failure.total` | Counter |

Additional fusion metrics are registered for M6 (`adi.fusion.*`, `adi.evidence.freshness.age_ms`).

## Pipeline integration

When `ADI_PLATFORM_ENABLED=true`, `PipelineExecutionManager` calls:

1. `adiPlatform.prepare(context)` before pipeline phases
2. `adiPlatform.complete(runId, success, durationMs)` on success/failure
3. `adiPlatform.shutdown()` in `finally`

Canonical evidence types live in `@alpha-dfs/shared` (`adi-evidence.ts`). Fused bundles attach to `EngineOutputs.adiEvidence` in M6+.

## Related docs

- [ADR-019](../../docs/architecture/ADR-019-V2_2_ADI_PLATFORM.md)
- [V2_2_ENGINEERING_PLAN.md](../../docs/architecture/V2_2_ENGINEERING_PLAN.md)
