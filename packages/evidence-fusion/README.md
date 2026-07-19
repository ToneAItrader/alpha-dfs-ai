# @alpha-dfs/evidence-fusion

Deterministic Evidence Fusion Engine (M6) per ADR-020.

## Exports

- `fuseEvidence()` — validate, expire, dedupe, weight, conflict-resolve, aggregate
- `getFusedSubject()` — lookup fused subject evidence from bundle

## Algorithm (fusion-1.0)

1. Validate packages (reject invalid)
2. Expire stale items (item `expiresAt` + package TTL)
3. Deduplicate within 5-minute window (keep highest confidence)
4. Weight: `effectiveConfidence = item.confidence × sourceWeight × freshness × providerConfidence`
5. Conflict resolve opposing directions (prefer higher confidence; 10% band → unresolved + 20% penalty)
6. Aggregate by subject with top-N per evidence type

## Usage

```typescript
import { fuseEvidence } from "@alpha-dfs/evidence-fusion";

const { bundle, metrics } = fuseEvidence({
  packages,
  registry: sourceRegistry,
  context: { runId, slateId },
});
```

Consumes `AdiEvidencePackage[]` only. Produces `AdiNormalizedEvidenceBundle`.
