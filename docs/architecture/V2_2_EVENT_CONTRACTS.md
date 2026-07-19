# V2.2 Event Contracts

**Status:** Planning Complete — Program 5  
**Date:** 2026-07-19  
**Related:** [ADR-022](./ADR-022-V2_2_AGENT_ORCHESTRATION.md)

---

## Versioning

Event payloads include `schemaVersion: "1.0"`. Breaking changes increment major; consumers ignore unknown fields.

---

## Lifecycle events

### `pipeline.run.started`

| Field | Type | Required |
|-------|------|----------|
| runId | string | yes |
| slateId | string | yes |
| correlationId | string | yes |
| adiEnabled | boolean | yes |

**Publisher:** PipelineExecutionManager  
**Consumers:** ADI Orchestrator, observability

### `pipeline.run.completed`

| Field | Type | Required |
|-------|------|----------|
| runId | string | yes |
| success | boolean | yes |
| durationMs | number | yes |

**Publisher:** PipelineExecutionManager  
**Consumers:** Learning agent, observability

---

## ADI platform events

### `adi.platform.ready`

Platform bootstrapped; registry loaded.

### `adi.fetch.requested`

| Field | Type |
|-------|------|
| runId, slateId | string |
| providerIds | string[] |

**Publisher:** Orchestrator  
**Consumer:** Provider agents

### `adi.evidence.received`

| Field | Type |
|-------|------|
| runId | string |
| providerId | string |
| packageCount | number |
| itemCount | number |
| degraded | boolean |

**Publisher:** Provider agent  
**Consumer:** Cache, observability

### `adi.fusion.requested` / `adi.fusion.completed`

| Field (completed) | Type |
|-------------------|------|
| runId | string |
| subjectCount | number |
| conflictCount | number |
| platformConfidence | number |

**Publisher:** Fusion agent

### `adi.provider.degraded` / `adi.provider.failed`

| Field | Type |
|-------|------|
| providerId | string |
| reason | string |
| retryable | boolean |

---

## Backward compatibility

V2.1 code ignores all `adi.*` events. Event bus is no-op when `ADI_PLATFORM_ENABLED=false`.

---

## Implementation note

MVP: synchronous dispatch via typed callback registry in `@alpha-dfs/adi-platform`. No external broker.
