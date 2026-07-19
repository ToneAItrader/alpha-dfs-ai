# Version 2 Roadmap

**Status:** V2.0 complete — V2.1 gate open  
**Date:** 2026-07-19  
**Scope lock (V1):** DraftKings · NFL · Classic Salary Cap  
**Implementation gate:** [OPEN — V2_IMPLEMENTATION_GATE.md](./V2_IMPLEMENTATION_GATE.md)

---

## Vision

Version 2 expands Alpha DFS AI from a validated single-sport, single-platform manual-run analyzer into a broader DFS intelligence platform — without destabilizing the V1 architecture that production depends on.

---

## Guiding principles

1. **V1 stability first** — maintenance line stays independent
2. **Architecture before code** — ADRs and review before implementation
3. **Preserve presentation contract** — extend DTO/mappers; don't rewrite UI blindly
4. **Evidence-based prioritization** — promote backlog items with V1 operational data
5. **Incremental migration** — no big-bang rewrite

---

## Phase overview

| Phase | Theme | ADRs | Implementation |
|-------|-------|------|----------------|
| **V2.0 — Foundation** | Ops maturity, QA, deferred V1 gaps | ADR-004–008 | ✅ **Complete** — [V2_FOUNDATION_COMPLETION_RECORD.md](./V2_FOUNDATION_COMPLETION_RECORD.md) |
| **V2.1 — Intelligence** | Slate UI, simulation, providers, ownership | ADR-010–018 | **Authorized** — [V2_1_IMPLEMENTATION_GATE.md](./V2_1_IMPLEMENTATION_GATE.md) |
| **V2.2 — Platform** | FanDuel, multi-platform (Amendment 002) | TBD | Not started |
| **V2.3 — Sport** | NBA/MLB/NHL plugins (Amendment 003) | TBD | Not started |
| **V2.4 — Advanced** | Contest, bankroll, late swap, AI (Amendment 004) | TBD | Not started |

Cross-cutting: [ADR-009 — Prisma Migration Policy](./ADR-009-PRISMA_MIGRATION_POLICY.md)

---

## Implementation sequencing

```text
V2.0 Foundation (ADR-004..008)
  → Opus ADR package review ✅
  → Phase 2A documentation revisions ✅
  → Gate open ✅
  → Implement V2.0 (branch v2/v2.0-foundation) ✅
  → Certify V2.0 ✅
  → Foundation completion review ✅
        ↓
V2.1 Intelligence (ADR-010..018)
  → Planning package ✅
  → Opus ADR review ✅ (Approve with revisions)
  → Phase 2A revisions ✅
  → Gate open ✅ (V2-CC-002)
  → Implement V2.1 (branch v2/v2.1-intelligence) ← current
  → Implement V2.1 (branch v2/v2.1-intelligence)
  → Certify V2.1
        ↓
    ┌───┴───┐
    ▼       ▼
V2.2      V2.4
Platform  Advanced
(Amend 002) (Amend 004)
    ↓
V2.3 Sport (Amend 003)
```

Detail: [V2_DEPENDENCY_MAP.md](./V2_DEPENDENCY_MAP.md)

---

## Phase V2.0 — Foundation

| ID | Capability | ADR | Rationale |
|----|------------|-----|-----------|
| V2.0-1 | External telemetry export | [ADR-004](./ADR-004-V2_0_1_TELEMETRY_EXPORT.md) | Prod APM without changing V1 observability |
| V2.0-2 | Read-only smoke mode | [ADR-005](./ADR-005-V2_0_2_READONLY_SMOKE.md) | RC risk — smoke writes to DATABASE_URL |
| V2.0-3 | Backup retention / prune | [ADR-006](./ADR-006-V2_0_3_BACKUP_RETENTION.md) | RC risk — manual backup pruning |
| V2.0-4 | Deployment supervisor guide | [ADR-007](./ADR-007-V2_0_4_DEPLOYMENT_SUPERVISOR.md) | RC risk — no systemd/pm2/docker docs |
| V2.0-5 | Browser E2E (Playwright) | [ADR-008](./ADR-008-V2_0_5_BROWSER_E2E.md) | Task 10 deferral — browser certification |

**Recommended impl order:** V2.0-2 → V2.0-3 → V2.0-4 → V2.0-1 → V2.0-5

---

## Phase V2.1 — Intelligence depth

| ID | Capability | ADR | Rationale |
|----|------------|-----|-----------|
| V2.1-1 | Slate Intelligence live integration | [ADR-010](./ADR-010-V2_1_1_SLATE_INTELLIGENCE.md) | Task 10 placeholder → real engine output |
| V2.1-2 | Header pipeline status wiring | [ADR-011](./ADR-011-V2_1_2_HEADER_PIPELINE_STATUS.md) | Task 10 deferred UX |
| V2.1-3 | Full GPP field simulation | [ADR-012](./ADR-012-V2_1_3_GPP_FIELD_SIMULATION.md) | Percentile vs field — backlog |
| V2.1-4 | NFL injury API connector | [ADR-013](./ADR-013-V2_1_4_INJURY_CONNECTOR.md) | Licensed injury feed |
| V2.1-5 | Vegas odds connector | [ADR-014](./ADR-014-V2_1_5_VEGAS_ODDS_CONNECTOR.md) | Market domain enrichment |
| V2.1-6 | Weather API connector | [ADR-015](./ADR-015-V2_1_6_WEATHER_CONNECTOR.md) | Outdoor game conditions |
| V2.1-7 | Projection intelligence calibration | [ADR-016](./ADR-016-V2_1_7_PROJECTION_CALIBRATION.md) | Rule-based calibration |
| V2.1-8 | Multi-lineup exposure management | [ADR-017](./ADR-017-V2_1_8_MULTI_LINEUP_EXPOSURE.md) | Portfolio optimization depth |
| V2.1-9 | Ownership prediction (baseline) | [ADR-018](./ADR-018-V2_1_9_OWNERSHIP_PREDICTION.md) | GPP field + leverage foundation |

**Recommended impl order:** V2.1-2 → V2.1-1 → V2.1-4 → V2.1-5 → V2.1-6 → V2.1-3 → V2.1-7 → V2.1-8 → V2.1-9

**Gate:** [V2_1_IMPLEMENTATION_GATE.md](./V2_1_IMPLEMENTATION_GATE.md) · [ADR-009](./ADR-009-PRISMA_MIGRATION_POLICY.md) before first schema change

---

## Phase V2.4 — Advanced intelligence (summary)

Mapped from deferred backlog — requires Amendment 004:

| Domain | Capabilities |
|--------|-------------|
| Contest intelligence | V2.4-1 |
| Bankroll management | V2.4-2 |
| Late swap | V2.4-3 |
| Advanced ownership | V2.4-4 |
| Cross-slate portfolio | V2.4-5 |
| AI coaching | V2.4-6 |

Full inventory: [V2_CAPABILITY_BREAKDOWN.md](./V2_CAPABILITY_BREAKDOWN.md)

---

## Explicitly unscheduled (V2.5+)

Background workers (general), automated lineup submission, mobile apps, multi-tenant SaaS, voice interface, sportsbook integration.

---

## Planning success criteria

- [x] V2 architecture overview approved
- [x] Migration strategy signed off
- [x] Risk assessment updated (Task 3)
- [x] Opus planning review complete — [V2_ARCHITECTURE_REVIEW.md](../reviews/V2_ARCHITECTURE_REVIEW.md)
- [x] Phase V2.0 capabilities have ADRs — ADR-004 through ADR-008
- [x] Prisma migration policy ADR — [ADR-009](./ADR-009-PRISMA_MIGRATION_POLICY.md)
- [x] Capability phase mapping complete
- [x] Opus ADR package review complete — [V2_ADR_PACKAGE_REVIEW.md](../reviews/V2_ADR_PACKAGE_REVIEW.md)
- [x] Phase 2A ADR revisions applied (CF-1, CF-2, HP-1–HP-4)
- [x] V2.0 Foundation implemented and certified — [V2_FOUNDATION_COMPLETION_RECORD.md](./V2_FOUNDATION_COMPLETION_RECORD.md)
- [x] Phase V2.1 capabilities have ADRs — ADR-010 through ADR-018
- [x] Opus V2.1 ADR package review complete — [V2_1_ADR_PACKAGE_REVIEW.md](../reviews/V2_1_ADR_PACKAGE_REVIEW.md)
- [x] Phase 2A ADR revisions applied (CF-1, HP-1–HP-4)
- [x] V2.1 implementation gate explicitly opened — [V2_1_IMPLEMENTATION_GATE.md](./V2_1_IMPLEMENTATION_GATE.md)

---

## Exactly one next action

**V2.1-1 — Slate Intelligence (Composer 2.5):** See [V2_1_IMPLEMENTATION_GATE.md](./V2_1_IMPLEMENTATION_GATE.md).
