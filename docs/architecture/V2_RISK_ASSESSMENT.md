# Version 2 Risk Assessment

**Status:** Updated — Task 3 complete  
**Date:** 2026-07-19  
**Related:** [V2_DEPENDENCY_MAP.md](./V2_DEPENDENCY_MAP.md) · [V2_IMPLEMENTATION_GATE.md](./V2_IMPLEMENTATION_GATE.md)

---

## Strategic risks

| Risk | Likelihood | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| V2 work destabilizes V1 production | Medium | High | Separate branches; V1 maintenance governance | Engineering |
| Scope creep into V2.2/V2.4 before V2.0 complete | High | Medium | Phased roadmap; implementation gate per phase | Architecture |
| Amendment 001 lifted prematurely | Low | High | Explicit amendment process per phase | Governance |
| Parallel V1/V2 doc drift | Medium | Low | ARCHITECTURE_INDEX maintenance | Documentation |
| ADR package approved without Opus review | Low | High | Gate 3 blocks implementation | Review |

---

## V2.0 risks (ops / QA)

| Risk | Capability | Mitigation |
|------|------------|------------|
| Read-only smoke misses analyze regressions | V2.0-2 | Full smoke remains default; staging uses full mode |
| Backup prune deletes needed backup | V2.0-3 | Dry-run default; never delete most recent |
| OTLP export credential leak | V2.0-1 | Env vars only; deployment guide |
| Playwright CI flakiness | V2.0-5 | Retry policy; seed/fixture mode only |
| Supervisor template mismatch | V2.0-4 | Reference current deploy.sh in guide |

---

## V2.1 risks (intelligence)

| Risk | Mitigation |
|------|------------|
| DTO breaking changes during V2.1 | Additive-only policy; mapper regression tests |
| Provider licensing delays | File export fallback preserved |
| Schema migration failure | ADR-009 backup-before-migrate gate |
| Simulation performance regression | Benchmark gate in V2.1-3 ADR (TBD at impl) |

---

## V2.4 risks (advanced — Amendment 004)

| Risk | Mitigation |
|------|------------|
| Background workers conflict with manual-run charter | Amendment 004 explicit authorization |
| Late swap requires real-time data | Defer until worker ADR approved |
| AI coaching scope creep into execution | Explanations only — no lineup submission |
| Cross-slate complexity | Defer to V2.4-5; lowest priority |

---

## V2.2 / V2.3 risks

| Risk | Phase | Mitigation |
|------|-------|------------|
| Multi-platform normalizer complexity | V2.2 | Platform ADR + compatibility matrix |
| Sport abstraction over-engineering | V2.3 | Plugin ADR; one sport first (NBA) |
| SQLite limits at scale | V2.2+ | Evaluate Postgres in platform ADR |

---

## V1 production risks (ongoing — maintenance track)

From [RC_VALIDATION_REPORT.md](../operations/RC_VALIDATION_REPORT.md):

| Risk | V2 address | Status |
|------|------------|--------|
| Smoke writes to DATABASE_URL | V2.0-2 ADR-005 | Planned |
| No process supervisor | V2.0-4 ADR-007 | Planned |
| Manual backup retention | V2.0-3 ADR-006 | Planned |
| Slate Intelligence placeholder | V2.1-1 | Planned |
| SSR 500 on cache miss | V1 fix applied | ✅ Mitigated |

---

## Dependency risks

| Dependency | Risk if unavailable | Fallback |
|------------|---------------------|----------|
| Licensed injury API | V2.1-4 delayed | File export |
| Licensed odds API | V2.1-5 delayed | Defer |
| OTLP endpoint | V2.0-1 degraded | File export mode |
| Playwright in CI | V2.0-5 not in V1 certify | Optional V2.0 gate only |

---

## Risk acceptance (planning phase)

During V2 planning — no new production risk introduced. Implementation gate requires re-assessment of this document before each phase opens.

---

## Review requirement

Independent Opus review of **ADR package (ADR-004–009)** required before V2.0 implementation gate opens.
