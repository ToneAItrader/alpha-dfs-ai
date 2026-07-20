# Operations Program — V2.2 Rollout

**Status:** Post-release operations — no new feature development  
**Release:** v2.2.0 (Release Candidate)  
**Prerequisite:** RP-1 through RP-7 complete  
**Date:** 2026-07-19

---

## Program objective

Validate, deploy, and operate V2.2 safely. Progress from Release Candidate to Production Ready through measured operational evidence — not new capabilities.

**Governance split:**
- **Composer 2.5** — Execute operational tasks, deployment, validation, evidence collection
- **GPT-5.5** — Independent certification, go/no-go decisions, planning

---

## Phase map

```text
OP-1  GitHub Publication          ← current
OP-2  Staging Certification
OP-3  Live Provider Certification
OP-4  Operational Review          (GPT-5.5)
OP-5  Shadow Mode
OP-6  Shadow Mode Review          (GPT-5.5)
OP-7  Canary Rollout
OP-8  Production Readiness        (GPT-5.5)
```

**Foundation:** [RP-7 Live Certification Plan](../release-program/RP-7_V2_2_LIVE_CERTIFICATION_PLAN.md) · [RP-6 Operational Readiness Package](../release-program/RP-6_V2_2_OPERATIONAL_READINESS_PACKAGE.md)

---

## Phase index

| Program | Task | Model | Report | Status |
|---------|------|-------|--------|--------|
| OP-1 | GitHub Publication | Composer 2.5 | [OP-1_GITHUB_PUBLICATION_REPORT.md](./OP-1_GITHUB_PUBLICATION_REPORT.md) | ⚠️ Pending remote |
| OP-2 | Staging Certification | Composer 2.5 | — | ⏳ Not started |
| OP-3 | Provider Certification | Composer 2.5 | — | ⏳ Not started |
| OP-4 | Operational Review | GPT-5.5 | — | ⏳ Not started |
| OP-5 | Shadow Mode | Composer 2.5 | — | ⏳ Not started |
| OP-6 | Shadow Mode Review | GPT-5.5 | — | ⏳ Not started |
| OP-7 | Canary Rollout | Composer 2.5 | — | ⏳ Not started |
| OP-8 | Production Readiness | GPT-5.5 | — | ⏳ Not started |

---

## Non-negotiables

| Rule | Detail |
|------|--------|
| No feature development | Operational validation only |
| ADI default off | Until OP-8 certifies Production Ready |
| Evidence-driven | Every phase produces a report |
| Rollback ready | `ADI_PLATFORM_ENABLED=false` at all times until OP-7+ |

---

## OP-2 preview (next after OP-1)

Deploy `v2.2.0` to staging with:

- `ADI_PLATFORM_ENABLED=false`
- Production-equivalent config where practical
- Validate: startup, health, dashboard, database, logging

See [RP-7 Phase 0](../release-program/RP-7_V2_2_LIVE_CERTIFICATION_PLAN.md#4-phase-0--rc-deployment-adi-off).

---

## V2.3 planning (deferred)

Do not begin V2.3 planning until OP-8 completes. Candidate areas (architecture/prioritization only):

- Enhanced observability
- Additional providers
- Learning and strategy evaluation
- Performance optimization
- Operational tooling

---

## Exactly one next action

**Complete OP-1:** Configure GitHub remote and run `./scripts/release/publish-github-release.sh <url>`.
