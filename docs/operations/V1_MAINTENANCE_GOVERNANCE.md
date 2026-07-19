# Version 1 Maintenance Governance — Alpha DFS AI

**Status:** Active — Feature Frozen  
**Effective:** 2026-07-19  
**Scope:** DraftKings · NFL · Classic Salary Cap  
**Workstream:** A — Version 1 Maintenance  
**RC baseline:** [RC_VALIDATION_REPORT.md](./RC_VALIDATION_REPORT.md)

---

## Purpose

Version 1 is **feature-frozen** and production-ready. All engineering on the main release line follows strict change control. This document governs Workstream A — maintenance, production support, and approved operational improvements only.

Version 2 planning is a separate workstream. See [V2_PLANNING_GOVERNANCE.md](../architecture/V2_PLANNING_GOVERNANCE.md).

**Architecture (frozen):** `DTO → Mapper → ViewModel → Presentation`

---

## Objective

Maintain a stable, production-ready DFS platform while Version 2 capabilities are planned separately.

---

## Allowed work

| Category | Examples |
|----------|----------|
| Production bug fixes | Pipeline failures, incorrect analysis output, crash recovery |
| Data connector reliability | DraftKings export, projection import, injury data parsing |
| Projection accuracy fixes | Scoring engine corrections within existing model |
| Lineup optimizer fixes | Constraint handling, performance, correctness |
| Performance improvements | Latency, memory — no public behavior change |
| Operational tooling | Backup, certify, smoke, deploy scripts |
| Monitoring & observability | Metrics, diagnostics, structured logs |
| Documentation | Runbooks, release notes, `.env.example` |
| Regression tests | Tests for approved fixes |
| Security updates | Dependency patches, credential handling |

---

## Not allowed

- New DFS features
- New optimization algorithms
- New contest types
- New sports
- UI redesign or new pages
- Architecture changes
- API / DTO / ViewModel contract changes (unless P0 with explicit amendment)
- Database redesign
- Version 2 capabilities on the V1 branch

Requests that fail this list → defer to [V2_PLANNING_GOVERNANCE.md](../architecture/V2_PLANNING_GOVERNANCE.md).

---

## Change classification

| Class | Description | Approval |
|-------|-------------|----------|
| **P0 — Production blocker** | Deploy or analyze broken in production | Immediate fix + post-incident review |
| **P1 — Production degradation** | Degraded mode, stale data, observability gap affecting ops | Approved fix within maintenance window |
| **P2 — Maintenance** | Docs, test gaps, non-behavioral tooling | Maintainer approval |
| **Deferred — V2** | New capability, UI feature, contract change | V2 planning only |

---

## Change request template

Every approved V1 change must document all seven sections:

### 1. Issue Summary

What failed or what operational gap exists? Include reproduction steps and environment.

### 2. Root Cause

Why did it happen? Reference logs, traces, diagnostics, or code path.

### 3. Proposed Fix

Minimal diff scope. Which files change and why. Confirm allowed under V1 governance.

### 4. Risk Assessment

| Risk | Mitigation |
|------|------------|
| Pipeline / optimizer regression | Tests added |
| Connector data integrity | Validation checks |
| Deploy impact | Rollback plan |

### 5. Regression Tests

List new or updated tests. Run full certification before merge.

### 6. Deployment Impact

Does this require `db:setup`, config change, connector path update, or redeploy only?

### 7. Documentation Updates

Which ops docs, runbooks, or `.env.example` entries change?

---

## Release verification (every V1 change)

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

## Model assignment

| Phase | Model | Responsibility |
|-------|-------|----------------|
| Change assessment & governance | GPT-5.5 | Classify V1 vs V2; acceptance criteria |
| Bug fixes & connector maintenance | Composer 2.5 | Focused TypeScript fixes |
| Regression & certification | Composer 2.5 | Tests, smoke, operational validation |
| Major production incident review | Claude Opus 4.1 | Independent root-cause review |
| Documentation & change records | GPT-5.5 | Runbooks, release notes, governance |

Full map: [MODEL_ASSIGNMENT.md](./MODEL_ASSIGNMENT.md)

---

## Branch strategy

| Branch / line | Purpose |
|---------------|---------|
| `main` | V1 production line — change control in force |
| `v2/*` | V2 planning and (when approved) implementation |

Do not mix V2 features into V1 maintenance PRs.

---

## Incident response

1. Capture diagnostics: `GET /api/health/diagnostics`
2. Classify: P0 vs P1 vs defer to V2
3. Fix on V1 line if approved
4. Major incidents: Claude Opus 4.1 review before close
5. Update runbooks if process gap found

---

## Related documents

| Doc | Purpose |
|-----|---------|
| [DUAL_TRACK_WORKFLOW.md](./DUAL_TRACK_WORKFLOW.md) | Dual-track index + Cursor prompt |
| [PRODUCTION_OPERATIONS_GUIDE.md](./PRODUCTION_OPERATIONS_GUIDE.md) | Operator reference |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Deploy steps |
| [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md) | Recovery |
| [RELEASE_CERTIFICATION_SPEC.md](./RELEASE_CERTIFICATION_SPEC.md) | Acceptance criteria |
| [V2_PLANNING_GOVERNANCE.md](../architecture/V2_PLANNING_GOVERNANCE.md) | V2 planning rules |
