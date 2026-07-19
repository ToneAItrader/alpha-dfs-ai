# ADR-011 — V2.1-2 Header Pipeline Status Wiring

**Status:** Accepted (Implemented — V2.1-2)  
**Date:** 2026-07-19 · **Revised:** 2026-07-19 (Phase 2A — HP-1) · **Implemented:** 2026-07-19  
**Capability ID:** V2.1-2  
**Phase:** V2.1 — Intelligence depth  
**Related:** [FRONTEND_RELEASE_READINESS.md](../FRONTEND_RELEASE_READINESS.md) · Task 10 deferral

---

## Context

V1 ships `GET /api/pipeline/status` and dashboard `analysis-status` display, but the **global header** and some dashboard elements still use static placeholder text for pipeline phase indicators. Task 10 deferred full header wiring.

Operators cannot see unified pipeline state (idle / analyzing / complete / failed) across navigation without returning to the dashboard.

---

## Decision

Wire the **app header** and **dashboard status bar** to live pipeline status from the existing API — no new backend endpoints.

### Scope

| Surface | Change |
|---------|--------|
| App header / banner | Display current pipeline phase from `GET /api/pipeline/status` |
| Dashboard status bar | Confirm live binding (already partially wired via `analysis-status`) |
| Analysis provider | Extend or reuse `getPipelineStatus()` client hook |

### Technical approach

1. Fetch `/api/pipeline/status` on **page load only** — per [FRONTEND_RELEASE_READINESS.md](../FRONTEND_RELEASE_READINESS.md) refresh model: page-load + user-triggered (`router.refresh()` after Analyze Slate). **No background polling loops.**
2. Map `PipelineStatusResponseDto` → header ViewModel
3. Refresh status after Analyze Slate action completes (event from existing analyze flow)

### Constraints

- **No DTO changes**
- **No new API routes**
- **No polling loops** — page-load + post-analyze refresh only
- Presentation: label/text updates only — no new nav pages

---

## Consequences

### Positive

- Low-risk UX improvement; uses existing API
- No schema or migration impact

### Negative

- Status may be stale until page refresh if user navigates mid-analysis without triggering refresh

---

## Implementation gate requirements

- [x] V2.1 implementation gate open
- [x] Component tests for status mapping (`pipeline-status-mapper.test.ts`, `Header.test.tsx`)
- [x] E2E dashboard spec validates status transitions (existing `00-dashboard.spec.ts`, `02-analyze-slate.spec.ts`)

---

### Implementation (V2.1-2)

| Component | Location |
|-----------|----------|
| Status mapper | `src/lib/mappers/pipeline-status-mapper.ts` |
| Client provider | `src/providers/pipeline-status-provider.tsx` |
| Status fetch | `src/lib/client/fetch-pipeline-status.ts` |
| Header wiring | `AppShell` → `Header` via `usePipelineStatus()` |
| Post-analyze refresh | `AnalyzeSlateButton` calls `refreshPipelineStatus()` |

Fetch model: mount-only `GET /api/pipeline/status` + refresh after Analyze Slate — no polling interval.

---

## V1 impact

**None until V2.1 merge.** V1 header retains current behavior on maintenance line.
