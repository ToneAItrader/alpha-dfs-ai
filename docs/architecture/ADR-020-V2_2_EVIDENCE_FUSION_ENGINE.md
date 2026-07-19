# ADR-020 — V2.2 Evidence Fusion Engine

**Status:** Accepted (Planning)  
**Date:** 2026-07-19  
**Related:** [ADR-019](./ADR-019-V2_2_ADI_PLATFORM.md) · [V2_2_DATA_MODEL.md](./V2_2_DATA_MODEL.md)

---

## Context

Seven evidence providers produce heterogeneous signals. Engines must consume a **single normalized view** with confidence, freshness, and conflict resolution applied consistently.

---

## Decision

Implement **Evidence Fusion Engine** as deterministic, rule-based fusion (no LLM in V2.2 MVP).

### Canonical evidence model

#### EvidencePackage (provider output)

```typescript
type EvidencePackage = {
  packageId: string;
  sourceId: string;           // e.g. "news-cbs", "social-reddit"
  sourceVersion: string;
  fetchedAt: string;          // ISO-8601
  ttlSeconds: number;
  slateId: string;
  runId: string;
  items: EvidenceItem[];
  providerConfidence: number; // 0–1
  metadata?: Record<string, string>;
};
```

#### EvidenceItem

```typescript
type EvidenceItem = {
  itemId: string;
  evidenceType: EvidenceType;  // taxonomy enum
  subjectType: "player" | "team" | "game" | "slate";
  subjectId: string;             // slatePlayerId | team abbr | game key
  claim: string;                 // normalized statement (internal)
  direction?: "positive" | "negative" | "neutral";
  magnitude?: number;            // type-specific scale
  confidence: number;            // 0–1
  observedAt: string;
  expiresAt?: string;
  supportingRefs?: string[];     // internal trace IDs only
};
```

#### EvidenceType taxonomy

| Category | Types |
|----------|-------|
| Injury | `injury_status`, `practice_report`, `game_status` |
| Projection | `projection_delta`, `consensus_projection`, `projection_variance` |
| Market | `line_movement`, `implied_total`, `sharp_indicator` |
| Sentiment | `social_sentiment`, `narrative_confidence`, `rumor_confidence` |
| Ownership | `chalk_probability`, `leverage_signal`, `ownership_estimate` |
| Content | `stack_recommendation`, `contrarian_signal` |
| Meta | `source_reliability`, `provider_health` |

#### NormalizedEvidence (fusion output per subject)

```typescript
type NormalizedEvidence = {
  subjectType: EvidenceItem["subjectType"];
  subjectId: string;
  fusedConfidence: number;
  items: EvidenceItem[];         // deduped, weighted
  conflicts: ConflictRecord[];
  freshnessScore: number;
  sourceCoverage: string[];      // sourceIds contributing
};
```

#### NormalizedEvidenceBundle

```typescript
type NormalizedEvidenceBundle = {
  bundleId: string;
  runId: string;
  slateId: string;
  fusedAt: string;
  version: "fusion-1.0";
  subjects: NormalizedEvidence[];
  platformConfidence: number;
  degradationNotes: string[];
};
```

### Fusion algorithm (MVP)

1. **Validate** — schema + required fields; reject invalid packages
2. **Expire** — drop items past `expiresAt` or package TTL
3. **Deduplicate** — same `subjectId + evidenceType + direction` within 5-min window → keep highest confidence
4. **Weight** — `effectiveConfidence = item.confidence × sourceWeight × freshnessScore`
5. **Conflict resolve** — opposing directions on same subject+type → flag conflict; prefer higher effectiveConfidence; if within 10%, reduce fusedConfidence 20%
6. **Aggregate** — group by subject; compute `fusedConfidence` as weighted mean of top-N items per type

### Confidence propagation

| Stage | Rule |
|-------|------|
| Provider | Provider sets `providerConfidence` on package |
| Item | Per-item confidence required |
| Fusion | Reduces confidence on conflicts, staleness, single-source |
| Engine | Engines may further reduce PCE/ownership confidence — never increase without multi-source agreement |

### Engine consumption

Engines receive `context.priorOutputs.adiEvidence?: NormalizedEvidenceBundle`. Lookup by `subjectId` only — no provider imports.

---

## Acceptance criteria

- [ ] Deterministic output for fixed seed + fixture packages
- [ ] Unit tests: dedupe, TTL, conflict, weighting
- [ ] Integration test: two providers → single bundle → ownership engine reads fused chalk signal
- [ ] No provider names in engine package imports (architecture test)

---

## Consequences

Fusion is the **highest-complexity V2.2 component**. Opus review of ADR-019 covers platform including fusion placement.
