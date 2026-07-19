# Dual-Track Workflow — Alpha DFS AI

**Status:** Active  
**Effective:** 2026-07-19  
**Supersedes:** Linear Task 11.x numbering for new work assignment

---

## Summary

Version 1 has completed Release Candidate validation. Development splits into two parallel workstreams that must not be mixed:

| Workstream | Focus | Implementation |
|------------|-------|----------------|
| **A — V1 Maintenance** | Stable production DFS platform, Class A/B fixes | **Allowed** (approved changes only) |
| **B — V2 Planning** | Advanced DFS capabilities, architecture, ADRs | **V2.0 authorized** — branch `v2/v2.0-foundation` |

---

## Workstream A — Version 1 Maintenance

**Governance:** [V1_MAINTENANCE_GOVERNANCE.md](./V1_MAINTENANCE_GOVERNANCE.md)  
**RC baseline:** [RC_VALIDATION_REPORT.md](./RC_VALIDATION_REPORT.md)

**Status:** Feature frozen · DraftKings · NFL · Classic Salary Cap

Objectives:

- Maintain a stable, production-ready DFS platform.
- Fix production bugs, connector reliability, projection accuracy, and optimizer defects.
- Preserve frozen architecture: `DTO → Mapper → ViewModel → Presentation`.
- Maintain deployment, certification, and operational documentation.

---

## Workstream B — Version 2 Planning

**Governance:** [V2_PLANNING_GOVERNANCE.md](../architecture/V2_PLANNING_GOVERNANCE.md)  
**Program index:** [V2_PROGRAM.md](../architecture/V2_PROGRAM.md)

**Status:** V2.0 implementation authorized — [V2_IMPLEMENTATION_GATE.md](../architecture/V2_IMPLEMENTATION_GATE.md)

Future capability examples (not authorized):

- Advanced Projection Intelligence
- Multi-lineup portfolio optimization
- Ownership prediction
- Contest Intelligence
- Late Swap Intelligence
- Bankroll Management
- Simulation engine improvements
- Multi-sport expansion (NBA, MLB, NHL, etc.)
- AI coaching and lineup explanations

---

## Model assignment summary

| Workstream | Phase | Model |
|------------|-------|-------|
| **V1** | Change assessment & governance | GPT-5.5 |
| **V1** | Bug fixes & connector maintenance | Composer 2.5 |
| **V1** | Regression & certification | Composer 2.5 |
| **V1** | Major production incident review | Claude Opus 4.1 |
| **V1** | Documentation & change records | GPT-5.5 |
| **V2** | Architecture & roadmap | GPT-5.5 |
| **V2** | Independent architecture review | Claude Opus 4.1 |
| **V2** | Implementation (post-gate) | Composer 2.5 |
| **V2** | Validation & testing | Composer 2.5 |
| **V2** | ADRs & technical documentation | GPT-5.5 |

Full detail: [MODEL_ASSIGNMENT.md](./MODEL_ASSIGNMENT.md)

---

## Cursor agent prompt

Paste at the start of a Cursor session:

```text
Alpha DFS AI Governance

The repository now operates under two workstreams.

====================================================
WORKSTREAM A — VERSION 1 MAINTENANCE
====================================================

Status:
Feature Frozen

Purpose:
Maintain a stable, production-ready Alpha DFS AI platform.

Allowed Work:
- Bug fixes
- DraftKings connector reliability
- Projection corrections
- Optimizer corrections
- Performance improvements
- Observability
- Operational tooling
- Documentation
- Security updates

Not Allowed:
- New DFS features
- New sports
- New contest types
- New optimization algorithms
- UI redesign
- API contract changes
- Database schema changes
- Architectural restructuring

Workflow:
1. Classify the request.
   → GPT-5.5
2. Verify it complies with V1 governance.
   → GPT-5.5
3. Implement approved fixes.
   → Composer 2.5
4. Execute regression, certification, and deployment verification.
   → Composer 2.5
5. If architectural or operational risk is identified,
   request an independent review.
   → Claude Opus 4.1

Governance: docs/operations/V1_MAINTENANCE_GOVERNANCE.md

====================================================
WORKSTREAM B — VERSION 2 PLANNING
====================================================

Status:
Planning Only

Purpose:
Define future Alpha DFS AI capabilities.

Workflow:
1. Review existing planning documents.
   → Claude Opus 4.1
2. Refine architecture, ADRs, roadmap, and implementation sequence.
   → GPT-5.5
3. Do not implement until governance approval.
4. Implement approved architecture.
   → Composer 2.5
5. Validate implementation.
   → Composer 2.5

Governance: docs/architecture/V2_PLANNING_GOVERNANCE.md
```

---

## Branch strategy

| Branch / line | Purpose |
|---------------|---------|
| `main` | V1 production line — maintenance only |
| `v2/*` | V2 planning and (when approved) implementation |

Do not mix V2 features into V1 maintenance PRs.

---

## Related documents

| Document | Purpose |
|----------|---------|
| [V1_MAINTENANCE_GOVERNANCE.md](./V1_MAINTENANCE_GOVERNANCE.md) | V1 change control |
| [V2_PLANNING_GOVERNANCE.md](../architecture/V2_PLANNING_GOVERNANCE.md) | V2 planning rules |
| [MODEL_ASSIGNMENT.md](./MODEL_ASSIGNMENT.md) | Model ownership by task type |
| [AMENDMENT_001_SCOPE_LOCK.md](../architecture/AMENDMENT_001_SCOPE_LOCK.md) | V1 scope lock |
