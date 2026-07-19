# V2.2 API Contracts (Internal)

**Status:** Planning Complete — Program 5  
**Date:** 2026-07-19

---

## Package boundaries

| Package | Exports | Consumes |
|---------|---------|----------|
| `@alpha-dfs/adi-platform` | `AdiPlatform`, `ConnectorManager`, `SourceRegistry`, `EvidenceCache`, `EventBus` | adi-providers, evidence-fusion |
| `@alpha-dfs/evidence-fusion` | `fuseEvidence()`, types | adi-platform types only |
| `@alpha-dfs/adi-providers` | Provider registry factory | connectors, adi-platform |
| `@alpha-dfs/web` (integration) | Pipeline hook only | adi-platform, existing engines |

---

## AdiPlatform

```typescript
interface AdiPlatform {
  prepare(context: AnalysisRunContext): Promise<void>;
  getNormalizedEvidence(): NormalizedEvidenceBundle | undefined;
  shutdown(): Promise<void>;
}
```

**Called from:** `PipelineExecutionManager` when `ADI_PLATFORM_ENABLED=true`.

---

## ConnectorManager

```typescript
interface ConnectorManager {
  register(provider: EvidenceProvider): void;
  fetchAll(context: EvidenceFetchContext): Promise<EvidencePackage[]>;
  getHealth(): ProviderHealth[];
}
```

---

## SourceRegistry

```typescript
interface SourceRegistry {
  getProvider(id: string): ProviderDescriptor | undefined;
  getWeight(sourceId: string): number;
  isEnabled(providerId: string): boolean;
}
```

---

## Evidence Fusion

```typescript
function fuseEvidence(input: {
  packages: EvidencePackage[];
  registry: SourceRegistry;
  context: FusionContext;
}): NormalizedEvidenceBundle;
```

---

## Engine integration (additive)

```typescript
// packages/shared — EngineOutputs extension
interface EngineOutputs {
  // existing V2.1 fields…
  adiEvidence?: NormalizedEvidenceBundle;
}
```

Engines opt-in to fused evidence via helper:

```typescript
function getFusedSubject(
  bundle: NormalizedEvidenceBundle | undefined,
  subjectId: string,
): NormalizedEvidence | undefined;
```

---

## Prohibited crossings

| From | To | Rule |
|------|-----|------|
| `adi-providers/*` | `apps/web/src/components` | ❌ Forbidden |
| Provider-specific types | Engine packages | ❌ Forbidden |
| Raw provider JSON | DTO assembler | ❌ Forbidden |

Architecture test enforces in M4.

---

## Public HTTP API

**No new public routes for ADI.** Existing `/api/pipeline/*` unchanged. ADI is internal to analyze run.
