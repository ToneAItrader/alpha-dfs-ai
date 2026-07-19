# Cursor Model Assignment — Alpha DFS AI

**Effective:** 2026-07-19  
**Approved:** [GOVERNANCE_MILESTONE.md](./GOVERNANCE_MILESTONE.md)  
**Context:** V1 feature frozen · V1 Maintenance (Workstream A) · V2 Planning (Workstream B)  
**Index:** [DUAL_TRACK_WORKFLOW.md](./DUAL_TRACK_WORKFLOW.md)

**Rule:** V1 work implements approved maintenance fixes only — **no new DFS capabilities**. V2 work is **planning only** until governance gates are met.

---

## Task model assignments (approved)

| Task | Model | Responsibility |
|------|-------|----------------|
| Review incoming work request | **GPT-5.5** | Classify Workstream A (V1) vs Workstream B (V2); assess scope; verify governance compliance |
| V1 bug fixes | **Composer 2.5** | Targeted fixes for connectors, projections, optimizer, observability, operational tooling |
| Regression testing | **Composer 2.5** | Unit, integration, smoke, and certification tests after approved changes |
| Production deployment verification | **Composer 2.5** | Deployment verification, smoke tests, operational validation |
| Major production incident analysis | **Claude Opus 4.1** | Independent root-cause review; architectural implications; V1 vs V2 classification |
| Governance updates | **GPT-5.5** | Governance docs, change records, release notes, operational procedures |
| Review existing V2 planning documents | **Claude Opus 4.1** | Evaluate architecture; identify risks; recommend improvements before implementation |
| V2 architecture & ADR refinement | **GPT-5.5** | Capability boundaries, interfaces, sequencing, roadmap documentation |
| V2 implementation (after approval) | **Composer 2.5** | Build approved capabilities per reviewed architecture |
| V2 validation | **Composer 2.5** | Integration, regression, performance, acceptance testing |

---

## Task 3 — V2 Roadmap Refinement (complete)

| Task | Model | Deliverable |
|------|-------|-------------|
| Capability mapping | **GPT-5.5** | [V2_CAPABILITY_BREAKDOWN.md](../architecture/V2_CAPABILITY_BREAKDOWN.md) |
| V2.0 ADRs (V2.0-1 → V2.0-5) | **GPT-5.5** | ADR-004 through ADR-008 |
| Prisma migration policy ADR | **GPT-5.5** | [ADR-009](../architecture/ADR-009-PRISMA_MIGRATION_POLICY.md) |
| Governance updates | **GPT-5.5** | Gate, dependencies, risks, roadmap |
| **ADR package review** | **Claude Opus 4.1** | ✅ [V2_ADR_PACKAGE_REVIEW.md](../reviews/V2_ADR_PACKAGE_REVIEW.md) |
| Phase 2A revisions + gate open | **GPT-5.5** | ✅ Complete |
| **V2.0 implementation** | **Composer 2.5** | **Next** — branch `v2/v2.0-foundation` |

Index: [TASK_3_PLANNING_PACKAGE.md](../architecture/TASK_3_PLANNING_PACKAGE.md)

---

### V1 certification commands

```bash
npm test --workspaces --if-present
npm run build
npm run certify:deploy
# If DB or backend touched:
npm run certify:startup
npm run deploy:smoke
```

Production cutover: [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md)

---

## Workstream B — Version 2 Planning

| Task | Model | Why |
|------|-------|-----|
| Architecture & roadmap | **GPT-5.5** | Capability boundaries, ADRs, interfaces, implementation sequence |
| Independent architecture review | **Claude Opus 4.1** | Validate designs before implementation begins |
| Implementation (after approval) | **Composer 2.5** | Build approved capabilities with architectural consistency |
| Validation & testing | **Composer 2.5** | Integration, regression, and performance testing |
| ADRs & technical documentation | **GPT-5.5** | Design documents, implementation guides, roadmap updates |

### V2 workflow phases

| Phase | Model |
|-------|-------|
| Architecture & roadmap | **GPT-5.5** |
| Architecture review | **Claude Opus 4.1** |
| Implementation | **Composer 2.5** |
| Validation | **Composer 2.5** |
| Documentation | **GPT-5.5** |

---

## Long-term model ownership

| Ongoing activity | Model |
|------------------|-------|
| TypeScript fixes, connectors, tests, deploy scripts, smoke certification | **Composer 2.5** |
| Change classification, governance, runbooks, release notes, V2 planning docs | **GPT-5.5** |
| RC validation, major incident review, V2 architecture review | **Claude Opus 4.1** |

| Work type | Share |
|-----------|------:|
| Composer 2.5 | ~60% |
| GPT-5.5 | ~35% |
| Claude Opus 4.1 | ~5% |

---

## Related documents

| Doc | Purpose |
|-----|---------|
| [V1_MAINTENANCE_GOVERNANCE.md](./V1_MAINTENANCE_GOVERNANCE.md) | V1 change control |
| [V2_PLANNING_GOVERNANCE.md](../architecture/V2_PLANNING_GOVERNANCE.md) | V2 planning rules |
| [RC_VALIDATION_REPORT.md](./RC_VALIDATION_REPORT.md) | V1 RC baseline |
