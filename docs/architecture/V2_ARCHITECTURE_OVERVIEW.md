# Version 2 Architecture Overview

**Status:** Planning draft — no implementation  
**Date:** 2026-07-18  
**V1 baseline:** Tasks 11.1–11.9 + RC validation

---

## Current state (V1)

```text
External Providers (DK + Projection)
        ↓
Connectors (@alpha-dfs/connectors)
        ↓
Refresh & Validation (web operations)
        ↓
Database (SQLite + Prisma)
        ↓
Engine Pipeline (6 phases)
        ↓
DTO Assembler
        ↓
Analysis Provider
        ↓
Mappers
        ↓
ViewModels
        ↓
Presentation (Next.js)
```

**Frozen contracts:** DTO shapes, ViewModels, Presentation components, AnalysisProvider API surface.

---

## V2 architectural evolution (conceptual)

Version 2 extends the platform in **layers**, not replacements:

```text
                    ┌─────────────────────────────┐
                    │   V2: Observability Export   │
                    │   (APM, structured log ship) │
                    └─────────────────────────────┘
                                    ↓
┌──────────────────────────────────────────────────────────┐
│  V2: Platform / Sport Adapters (when charter amended)     │
│  Extends connector registry — does not replace V1 DK path │
└──────────────────────────────────────────────────────────┘
                                    ↓
              [ V1 stack unchanged below this line ]
                                    ↓
                    Connectors → Refresh → DB → Engines
                                    ↓
                         DTO → Mapper → VM → UI
```

---

## Layer responsibilities (V2 additions)

| Layer | V1 | V2 extension |
|-------|----|--------------|
| Connectors | DK + Projection file/API | Additional P0/P1 providers; platform adapter interface |
| Observability | In-process ring buffers | Optional export adapters (OTLP, file ship) |
| Engines | NFL Classic deterministic | Sport-specific config injection (later phase) |
| DTO | Analysis bundle | Extended fields via versioned DTO additions |
| Mappers | Pure translation | New mappers for new DTO fields |
| Presentation | 8 analysis panels | Slate Intelligence live; optional new panels via ADR |

---

## Compatibility strategy

| Component | V2 approach |
|-----------|-------------|
| DTO | Additive fields only; mappers absorb changes |
| ViewModels | Stable; extend only when UI needs new display |
| Connectors | New adapters; V1 DK path unchanged |
| Database | Schema migrations via Prisma; backward-compatible reads |
| Deploy tooling | Extend certify/smoke; don't replace V1 scripts |

---

## New packages (proposed — not created)

| Package | Phase | Purpose |
|---------|-------|---------|
| `@alpha-dfs/telemetry-export` | V2.0 | Optional APM/log exporters |
| `@alpha-dfs/platform-core` | V2.2 | Platform abstraction (post-amendment) |
| `@alpha-dfs/sport-core` | V2.3 | Sport abstraction (post-amendment) |

Package creation requires ADR per capability.

---

## Architecture invariants (carry forward)

1. Engine pipeline phases remain sequential and auditable
2. RCS-equivalent governance for any autonomous behavior (V2+)
3. Manual-run default unless charter explicitly amends
4. Presentation never imports backend DTOs directly
5. Execution path: refresh → engines → DTO → provider → mappers → UI

---

## Review gate

This overview must pass independent architecture review before any V2 implementation branch is opened.

See [V2_MIGRATION_STRATEGY.md](./V2_MIGRATION_STRATEGY.md) for upgrade path from V1 deployments.
