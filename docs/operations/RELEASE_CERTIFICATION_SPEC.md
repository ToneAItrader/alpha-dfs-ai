# Release Certification Specification — Version 1

**Status:** Accepted  
**Date:** 2026-07-18  
**Task:** 11.8 — Release Readiness & Operational Certification  
**Scope:** DraftKings · NFL · Classic Salary Cap

---

## Purpose

Define authoritative acceptance criteria for Alpha DFS AI Version 1 release. All certification gates must pass before production deployment.

---

## Mandatory deployment prerequisites

| Prerequisite | Requirement |
|--------------|-------------|
| Node.js | ≥ 20 |
| Database | SQLite file path writable (`DATABASE_URL`) |
| Build | `npm run build` succeeds |
| Tests | Full regression suite passes |
| Provider P0 | DraftKings credentials configured (live mode) |
| Provider P1 | Projection credentials configured (recommended) |

---

## Required environment variables

| Variable | Required | When |
|----------|----------|------|
| `DATABASE_URL` | **Yes** | Always |
| `DRAFTKINGS_EXPORT_PATH` or `DRAFTKINGS_API_URL` + `DRAFTKINGS_API_KEY` | **Yes** | `CONNECTOR_MODE=live` (default) |
| `PROJECTION_EXPORT_PATH` or `PROJECTION_API_URL` + `PROJECTION_API_KEY` | Recommended | Live mode (degraded without) |
| `CONNECTOR_MODE` | No | Default `live`; `seed` for dev only |
| `ENGINE_REGISTRY_MODE` | No | Default `real` |

Production **must not** set `ALPHA_DFS_ALLOW_SEED_FALLBACK=true` or `CONNECTOR_MODE=seed`.

---

## Health and readiness acceptance criteria

| Endpoint | Pass criteria |
|----------|---------------|
| `GET /api/health/startup` | `ok: true` — no blocker checks |
| `GET /api/health` | `status` ≠ `unhealthy` |
| `GET /api/health/ready` | `ready: true` after initial data refresh |
| `GET /api/health/metrics` | Returns metrics snapshot |
| `GET /api/health/diagnostics` | Returns traces, logs, circuits |

---

## Regression pass requirements

| Suite | Minimum |
|-------|---------|
| `@alpha-dfs/observability` | All tests pass |
| `@alpha-dfs/connectors` | All tests pass |
| `@alpha-dfs/web` | All tests pass (including architecture boundary tests) |
| Production build | `next build` succeeds |

Run: `npm run certify` (all workspace test suites via `npm test --workspaces --if-present`)

### Optional V2.0 browser E2E gate

Browser E2E is **not** part of the mandatory V1 certification gate. Enable explicitly for V2.0 Foundation validation:

| Setting | Value |
|---------|-------|
| Command | `CERTIFY_E2E=1 npm run certify` |
| Standalone | `npm run certify:e2e` (from repo root) |
| Test DB | `ALPHA_DFS_TEST_DB=true` + isolated `e2e-test.db` |
| Connector mode | `seed` (fixture paths — no live credentials) |
| Browser | Chromium only |

First-time setup: `npm run e2e:install`. See [ADR-008](../architecture/ADR-008-V2_0_5_BROWSER_E2E.md).

---

## Rollback strategy

1. Stop application process
2. Restore previous build artifact (`.next` + `node_modules` lockfile)
3. Restore previous `DATABASE_URL` database file if schema changed
4. Verify `GET /api/health/startup` and `GET /api/health/ready`
5. Re-run `npm run certify:deploy` before re-enabling traffic

No database migrations in v1 — SQLite file is the rollback unit.

---

## Release sign-off checklist

- [ ] Startup validation passes (`npm run certify:startup`)
- [ ] Deployment config validation passes (`npm run certify:deploy`)
- [ ] Full test suite passes (`npm test`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Provider credentials verified for target environment
- [ ] Seed fallback disabled in production
- [ ] Health/readiness endpoints verified post-deploy
- [ ] End-to-end Analyze Slate completes successfully
- [ ] DTO → Mapper → ViewModel contract unchanged
- [ ] Release notes and operational checklists reviewed

**Sign-off roles:** Engineering (implementation) · Operations (deployment) · Architecture (Opus review)

---

## Certification artifacts

| Artifact | Location |
|----------|----------|
| Release checklist | `docs/operations/RELEASE_CHECKLIST.md` |
| Deployment checklist | `docs/operations/DEPLOYMENT_CHECKLIST.md` |
| Configuration checklist | `docs/operations/CONFIGURATION_CHECKLIST.md` |
| Operational readiness | `docs/operations/OPERATIONAL_READINESS_SUMMARY.md` |
| Task 11.7 remediation | `docs/architecture/TASK_11_7_REMEDIATION.md` |
