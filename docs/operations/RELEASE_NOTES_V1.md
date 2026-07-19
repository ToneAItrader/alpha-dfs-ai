# Release Notes — Alpha DFS AI Version 1

**Date:** 2026-07-18  
**Scope:** DraftKings · NFL · Classic Salary Cap  
**Tasks:** 11.1–11.9 complete

---

## Summary

Version 1 delivers a manual-run DFS analysis platform with real engine pipeline, live provider integration, operational observability, and production deployment tooling.

---

## Platform capabilities

- **Analyze Slate** — manual trigger; refresh → 6 engine phases → reports
- **Live data** — DraftKings P0 + Projection P1 via file export or API
- **Portfolio intelligence** — lineup generation with simulation and confidence
- **Operational health** — startup, health, readiness, metrics, diagnostics endpoints
- **Release certification** — automated deploy, backup, smoke, and verify scripts

---

## Architecture (frozen)

```text
DTO → Mapper → ViewModel → Presentation
```

Backend packages: connectors, database, engines, observability. Frontend presentation layer unchanged from Task 10.

---

## Deployment commands

| Command | Purpose |
|---------|---------|
| `npm run deploy` | Full deployment automation |
| `npm run deploy:verify` | Production readiness verification |
| `npm run deploy:backup` | Database backup |
| `npm run deploy:rollback -- <file>` | Database restore |
| `npm run deploy:smoke` | Pipeline smoke test |
| `npm run certify` | Full test suite certification |

---

## Breaking changes

None — initial v1 release.

---

## Known limitations

- Manual-run only (no background workers)
- SQLite single-instance persistence
- In-process observability (no external APM)
- Slate Intelligence panel remains placeholder (Task 10 deferral)

---

## Upgrade / rollback

See [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md). Database rollback = restore backup file.

---

## Documentation index

- [PRODUCTION_OPERATIONS_GUIDE.md](./PRODUCTION_OPERATIONS_GUIDE.md)
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- [RELEASE_CERTIFICATION_SPEC.md](./RELEASE_CERTIFICATION_SPEC.md)
- [OPERATIONAL_READINESS_SUMMARY.md](./OPERATIONAL_READINESS_SUMMARY.md)
