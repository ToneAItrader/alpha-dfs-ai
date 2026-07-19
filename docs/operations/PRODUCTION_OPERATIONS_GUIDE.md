# Production Operations Guide — Version 1

**Task:** 11.9 · **Scope:** DraftKings · NFL · Classic Salary Cap  
**Status:** Authoritative operator reference

---

## 1. Deployment prerequisites

| Requirement | Detail |
|-------------|--------|
| Node.js | ≥ 20 |
| Database | SQLite file at writable `DATABASE_URL` |
| Providers | DraftKings P0 + Projection P1 (live mode) |
| Build | `npm run build` succeeds |
| Certification | `npm run deploy:verify` passes |

Copy `.env.example` → `.env.local` and configure before first deploy.

---

## 2. Environment variable inventory

### Required

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite path (`file:/absolute/path/to/dev.db`) |

### Live providers (default)

| Variable | Purpose |
|----------|---------|
| `DRAFTKINGS_EXPORT_PATH` or `DRAFTKINGS_API_URL` + `DRAFTKINGS_API_KEY` | P0 slate data |
| `PROJECTION_EXPORT_PATH` or `PROJECTION_API_URL` + `PROJECTION_API_KEY` | P1 projections |

### Operational

| Variable | Default | Purpose |
|----------|---------|---------|
| `CONNECTOR_MODE` | `live` | `seed` for dev only |
| `ENGINE_REGISTRY_MODE` | `real` | `stub` for dev only |
| `NODE_ENV` | `development` | Set `production` in prod |
| `BACKUP_DIR` | `./backups` | Database backup location |
| `BACKUP_RETENTION_COUNT` | `10` | Keep N most recent backups when pruning |
| `BACKUP_RETENTION_DAYS` | `30` | Delete backups older than N days when pruning |
| `PRUNE_BACKUPS` | — | Set `1` on `npm run deploy` to run prune after deploy |
| `DEPLOY_BASE_URL` | — | Optional HTTP smoke target (e.g. `http://localhost:3001`) |
| `FULL_CERTIFY` | — | Set `1` to include full test suite in `deploy:verify` |
| `TELEMETRY_EXPORT_MODE` | `none` | `file` or `otlp` for external export (V2.0-1) |
| `TELEMETRY_EXPORT_PATH` | — | Required when mode=`file` |
| `TELEMETRY_EXPORT_OTLP_ENDPOINT` | — | Required when mode=`otlp` |
| `TELEMETRY_EXPORT_INTERVAL_MS` | `30000` | Export batch interval |

### Production prohibitions

Do **not** set in production:
- `CONNECTOR_MODE=seed`
- `ALPHA_DFS_ALLOW_SEED_FALLBACK=true`
- `ENGINE_REGISTRY_MODE=stub`

---

## 3. Startup sequence

```text
1. Load environment (.env.local or platform env)
2. npm run certify:deploy     → config validation
3. npm run db:setup           → first deploy only
4. npm run build              → production artifact
5. npm run start              → port 3001
6. npm run certify:startup    → dependency validation
7. npm run deploy:smoke       → pipeline smoke test
```

Automated: `npm run deploy` (backup if DB exists → validate → db:setup → build → startup → smoke)

**Supervisor templates:** [DEPLOYMENT_SUPERVISOR_GUIDE.md](./DEPLOYMENT_SUPERVISOR_GUIDE.md)

---

## 4. Health-check interpretation

| Endpoint | Pass | Degraded | Fail |
|----------|------|----------|------|
| `/api/health/startup` | `ok: true` | — | `ok: false` — do not route traffic |
| `/api/health` | `healthy` | `degraded` — investigate providers/freshness | `unhealthy` — DB down |
| `/api/health/ready` | `ready: true` | — | `ready: false` — slate invalid |
| `/api/health/metrics` | Returns snapshot | — | 5xx |
| `/api/health/diagnostics` | Returns traces/logs | — | 5xx |

**Degraded** is acceptable for P1 projection gaps; **unhealthy** or startup failure blocks analysis.

---

## 5. Backup and recovery

### Backup (pre-deploy)

```bash
npm run deploy:backup
```

Creates a consistent snapshot in `backups/` using SQLite `VACUUM INTO` (falls back to file copy). **Stop the application before backup** if not using VACUUM path.

### Retention prune (optional — V2.0-3)

Dry-run (lists deletion candidates):

```bash
npm run deploy:backup:prune
```

Execute prune:

```bash
npm run deploy:backup:prune -- --execute
```

Retention rule: a backup is kept only if it is among the `BACKUP_RETENTION_COUNT` most recent files **and** younger than `BACKUP_RETENTION_DAYS`. The newest backup is **never deleted**. Enable post-deploy prune with `PRUNE_BACKUPS=1 npm run deploy`.

### Restore

```bash
npm run deploy:rollback -- backups/alpha-dfs-<timestamp>.db
npm run certify:startup
npm run deploy:smoke
```

### Configuration backup

Manually archive `.env.local` or platform secret version alongside database backup.

---

## 6. Rollback procedure

1. **Stop** application process
2. **Restore** database: `npm run deploy:rollback -- <backup.db>`
3. **Restore** previous build (git tag / artifact) if code changed
4. **Validate**: `npm run certify:startup`
5. **Smoke**: `npm run deploy:smoke`
6. **Re-enable** traffic

See [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md) for full procedure.

---

## 7. Post-deployment verification

- [ ] `GET /api/health/startup` → 200
- [ ] `POST /api/pipeline/refresh` → 200
- [ ] `POST /api/pipeline/analyze` → 200, status `complete`
- [ ] Dashboard loads; panels render
- [ ] `npm run deploy:verify` passes

---

## 8. Known operational limitations

- **Manual-run only** — no background workers; data refreshes on Analyze Slate
- **SQLite single-file** — no horizontal scaling; backup = file copy
- **In-process telemetry** — metrics/traces in memory; external APM deferred
- **Absolute DATABASE_URL** — required for CLI validation scripts
- **Port 3001** — default dev/production port per `apps/web/package.json`

---

## Related documents

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Step-by-step deploy |
| [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md) | Rollback & recovery |
| [RELEASE_CERTIFICATION_SPEC.md](./RELEASE_CERTIFICATION_SPEC.md) | Acceptance criteria |
| [RELEASE_NOTES_V1.md](./RELEASE_NOTES_V1.md) | Version 1 summary |
