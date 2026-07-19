# ADR-010 — V2.1-1 Slate Intelligence Live Integration

**Status:** Accepted (Planning — Phase 2A revised) · **Implemented:** 2026-07-19  
**Date:** 2026-07-19 · **Revised:** 2026-07-19 (Phase 2A — CF-1, HP-3)  
**Capability ID:** V2.1-1  
**Phase:** V2.1 — Intelligence depth  
**Related:** [SLATE_INTELLIGENCE.md](./SLATE_INTELLIGENCE.md) · [V2_1_ADR_PACKAGE_REVIEW.md](../reviews/V2_1_ADR_PACKAGE_REVIEW.md)

---

## Context

V1 Task 10 shipped the Slate Intelligence **panel** with placeholder ViewModel data (`src/config/slate-intelligence-placeholders.ts`). Child sections import placeholders directly — no mapper exists.

**V1 pipeline reality (CF-1 clarification):**

| Artifact | Role | Outputs |
|----------|------|---------|
| `slate_analysis` engine (`SlateAnalysisEngine`) | Data **readiness / coverage** | `dataCompleteness`, `injuryDataStatus`, `weatherDataStatus`, etc. |
| `dto-assembler.ts` | Maps readiness → `portfolioReadiness.dataQuality` | Not Slate Intelligence panel |
| Slate Intelligence **panel** | Presentation | Placeholder config only |
| Slate Intelligence **Agent** ([SLATE_INTELLIGENCE.md](./SLATE_INTELLIGENCE.md)) | Slate-wide strategy intelligence | **Not implemented** — architecture doc only |

V2.1-1 closes the Task 10 deferral by **implementing the Slate Intelligence Engine** and wiring the panel via mapper — not by mislabeling `slate_analysis` outputs.

---

## Decision

**Approach A (approved):** Implement the Slate Intelligence Engine per [SLATE_INTELLIGENCE.md](./SLATE_INTELLIGENCE.md), then wire the existing panel through a new mapper. No Presentation redesign.

### Pipeline position

```text
Download/refresh → slate_analysis (readiness) → … → slate_intelligence (NEW) → … → dto-assembler
```

The new **`slate_intelligence`** engine runs after ingest/readiness inputs are available and before downstream player analysis consumes strategy context.

### Data flow

```text
Slate Intelligence Engine → EngineOutputs.slateIntelligence
  → dto-assembler (slateIntelligence DTO section)
  → slate-intelligence-mapper.ts (NEW)
  → SlateIntelligenceViewModel
  → page passes props → SlateIntelligencePanel sections
```

### Implementation sub-deliverables (single capability V2.1-1)

| Step | Deliverable |
|------|-------------|
| 1 | `SlateIntelligenceEngine` in pipeline registry (`packages/shared` types + adapter) |
| 2 | Extend `EngineOutputs` and `AnalysisBundleResponseDto` with optional `slateIntelligence` section |
| 3 | Create `apps/web/src/lib/mappers/slate-intelligence-mapper.ts` |
| 4 | Update `slate-intelligence/page.tsx` to load bundle and pass ViewModel props to panel sections |
| 5 | Placeholder config retained as fallback when `slateIntelligence` absent |
| 6 | Unit + mapper regression tests; E2E navigation spec passes |

### DTO extension (additive)

| Field | Type | Source |
|-------|------|--------|
| `slateGrade` | number 0–100 | Slate Intelligence engine |
| `volatilityScore` | number 0–100 | Slate Intelligence engine |
| `recommendedStrategy` | enum (`balanced` \| `primary_heavy` \| `gpp_heavy` \| `contrarian` \| `stack_aggressive`) | Engine output |
| `confidenceRating` | number 0–1 | Engine output |
| `factors` | string[] | Engine factor summaries |
| `slateSummary` | string | Engine narrative summary |

All fields **optional** — mappers default to placeholder when absent.

### Phased panel wiring (HP-3)

Eight panel sections — wiring schedule:

| # | Panel section | V2.1-1 live source | Fallback | Enhanced by |
|---|---------------|-------------------|----------|-------------|
| 1 | Slate Summary | `slateSummary` from engine | Placeholder | — |
| 2 | Slate Grade | `slateGrade`, `volatilityScore` | Placeholder | V2.1-4/5/6 inputs to engine |
| 3 | Recommended Strategy | `recommendedStrategy`, `confidenceRating` | Placeholder | Engine refinement |
| 4 | Injury Overview | Aggregated from player merge fields if present | Placeholder | **V2.1-4** injury connector |
| 5 | Weather Summary | Aggregated from game weather fields if present | Placeholder | **V2.1-6** weather connector |
| 6 | Ownership Outlook | Projection feed ownership from analyze bundle | Placeholder | **V2.1-9** ownership prediction |
| 7 | Featured Games | Derived from slate games + optional Vegas totals | Placeholder | **V2.1-5** Vegas connector |
| 8 | Intelligence Summary | `factors[]` from engine | Placeholder | V2.1-4/5/6 enrich factors |

Sections 4–7 may show placeholder until their capability ships; sections 1–3 and 8 must be live at V2.1-1 completion.

### Scope boundaries

| In scope | Out of scope |
|----------|--------------|
| New `slate_intelligence` pipeline engine | Renaming/removing `slate_analysis` |
| New mapper + page-level ViewModel wiring | Presentation component redesign |
| Prop threading to existing section components | External provider connectors (V2.1-4–6) |
| Schema-free DTO extension | New panel routes |

### Constraints

- **DTO → Mapper → ViewModel → Presentation** preserved — sections receive props; default params keep placeholder behavior in tests
- No new API routes — consumed via existing analyze bundle
- Amendment 001 unchanged (DK · NFL · Classic)
- No schema migration for V2.1-1

---

## Consequences

### Positive

- Resolves CF-1 — ADR matches implementable architecture
- Closes Task 10 deferral with correct engine separation
- Phased table clarifies partial live state until V2.1-4/5/6/9

### Negative

- New engine adds pipeline stage complexity
- Panel sections 4–7 remain placeholder until later V2.1 capabilities

---

## Implementation gate requirements

- [x] V2.1 implementation gate open
- [x] `SlateIntelligenceEngine` registered and invoked in pipeline
- [x] `slate-intelligence-mapper.ts` created with regression tests
- [x] Sections 1–3 and 8 wired to live ViewModel; 4–7 documented fallback
- [x] E2E navigation spec passes (`/slate-intelligence`)
- [x] `apps/web/README.md` panel section updated

---

## V1 impact

**None on `main` until V2.1 branch merge.** V1 panel continues placeholder behavior on maintenance line.
