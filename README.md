# Alpha DFS AI

**Status:** Version 1 — **Release candidate validated** — dual-track workflow active  
**Workstreams:** [V1 Maintenance](./docs/operations/V1_MAINTENANCE_GOVERNANCE.md) (feature frozen) · [V2 Program](./docs/architecture/V2_PLANNING_GOVERNANCE.md) (V2.1 implementation authorized)  
**SOP:** [Dual-Track Workflow](./docs/operations/DUAL_TRACK_WORKFLOW.md) · [Cursor Implementation Protocol](./docs/CURSOR_IMPLEMENTATION_PROTOCOL.md)  
**Charter:** [PROJECT_CHARTER.md](./PROJECT_CHARTER.md) · **Scope lock:** [Amendment 001](./docs/architecture/AMENDMENT_001_SCOPE_LOCK.md)

---

## Version 1 scope

| Dimension | Value |
|-----------|-------|
| **Platform** | DraftKings |
| **Sport** | NFL |
| **Contest** | Classic Salary Cap |

---

## Platform status (Tasks 11.1–11.9)

| Area | Status |
|------|--------|
| Backend pipeline | Complete — real engines, live connectors |
| Observability | Complete — metrics, traces, diagnostics |
| Release certification | Complete — startup, deploy, smoke, backup |
| Frontend | Complete (Task 10) — frozen DTO → Mapper → ViewModel → Presentation |

**Operator guide:** [PRODUCTION_OPERATIONS_GUIDE.md](./docs/operations/PRODUCTION_OPERATIONS_GUIDE.md)

---

## Deployment commands

```bash
export DATABASE_URL="file:/absolute/path/to/production.db"
export DRAFTKINGS_EXPORT_PATH="/path/to/draftkings-export.json"
export PROJECTION_EXPORT_PATH="/path/to/projection-export.json"
export INJURY_EXPORT_PATH="/path/to/injury-export.json"
export VEGAS_ODDS_EXPORT_PATH="/path/to/vegas-odds-export.json"
export WEATHER_EXPORT_PATH="/path/to/weather-export.json"

npm run deploy          # Full deployment automation
npm run deploy:verify   # Production readiness gate
npm run certify         # Full workspace test certification
npm run certify:e2e     # Browser E2E (V2.0-5 — optional; uses isolated test DB)
npm run e2e:install     # Install Playwright Chromium (first-time E2E setup)
npm run deploy:backup   # Database backup
npm run deploy:backup:prune              # Retention dry-run (V2.0-3)
npm run deploy:backup:prune -- --execute # Retention execute
npm run deploy:rollback -- backups/<file>.db
npm run deploy:smoke    # Pipeline smoke — full mode (writes to DATABASE_URL)
SMOKE_MODE=readonly npm run deploy:smoke  # Read-only smoke — no DB writes (V2.0-2)
```

---

## Run locally

```bash
npm install
cp .env.example apps/web/.env.local   # configure DATABASE_URL + provider paths
npm run db:setup
npm run dev
npm test --workspaces --if-present
npm run build
```

Open [http://localhost:3001/dashboard](http://localhost:3001/dashboard)

---

## Key documents

| Doc | Purpose |
|-----|---------|
| [DUAL_TRACK_WORKFLOW.md](./docs/operations/DUAL_TRACK_WORKFLOW.md) | **Dual-track workflow + Cursor agent prompt** |
| [GOVERNANCE_MILESTONE.md](./docs/operations/GOVERNANCE_MILESTONE.md) | **Governance milestone — approved** |
| [PRODUCTION_READINESS_VALIDATION.md](./docs/operations/PRODUCTION_READINESS_VALIDATION.md) | Task 1 — production validation (pass) |
| [TASK_3_PLANNING_PACKAGE.md](./docs/architecture/TASK_3_PLANNING_PACKAGE.md) | Task 3 — V2 planning package (complete) |
| [V2_1_PLANNING_PACKAGE.md](./docs/architecture/V2_1_PLANNING_PACKAGE.md) | V2.1 planning package |
| [V2_FOUNDATION_COMPLETION_RECORD.md](./docs/architecture/V2_FOUNDATION_COMPLETION_RECORD.md) | V2.0 Foundation completion record |
| [V2_1_IMPLEMENTATION_GATE.md](./docs/architecture/V2_1_IMPLEMENTATION_GATE.md) | V2.1 implementation gate (OPEN) |
| [V1_MAINTENANCE_GOVERNANCE.md](./docs/operations/V1_MAINTENANCE_GOVERNANCE.md) | V1 change control (feature frozen) |
| [V2_PLANNING_GOVERNANCE.md](./docs/architecture/V2_PLANNING_GOVERNANCE.md) | V2 program governance |
| [MODEL_ASSIGNMENT.md](./docs/operations/MODEL_ASSIGNMENT.md) | Cursor model assignments by workstream |
| [PRODUCTION_OPERATIONS_GUIDE.md](./docs/operations/PRODUCTION_OPERATIONS_GUIDE.md) | **Production operator reference** |
| [DEPLOYMENT_GUIDE.md](./docs/operations/DEPLOYMENT_GUIDE.md) | Deployment steps |
| [RELEASE_CERTIFICATION_SPEC.md](./docs/operations/RELEASE_CERTIFICATION_SPEC.md) | Release acceptance criteria |
| [RC_VALIDATION_REPORT.md](./docs/operations/RC_VALIDATION_REPORT.md) | Release candidate validation |

---

## Workflow

```text
Workstream A (V1): Maintain → Fix → Certify → Deploy
Workstream B (V2): Plan → Review → Gate → Implement → Certify → Next phase

Analyze Slate → Refresh → Engine Pipeline → Reports → Stop
```

Manual-run only. No background workers. See [DUAL_TRACK_WORKFLOW.md](./docs/operations/DUAL_TRACK_WORKFLOW.md).
