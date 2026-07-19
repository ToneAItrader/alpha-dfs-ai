# Deployment Guide — Version 1

**Task:** 11.9

---

## Overview

Alpha DFS AI v1 deploys as a single Next.js application with SQLite persistence. No container orchestration is required for v1; a Node.js host with writable storage is sufficient.

**Process supervision:** [DEPLOYMENT_SUPERVISOR_GUIDE.md](./DEPLOYMENT_SUPERVISOR_GUIDE.md) — systemd, pm2, Docker Compose (V2.0-4)

---

## Pre-deployment

1. Review [PRODUCTION_OPERATIONS_GUIDE.md](./PRODUCTION_OPERATIONS_GUIDE.md)
2. Configure environment per [CONFIGURATION_CHECKLIST.md](./CONFIGURATION_CHECKLIST.md)
3. Ensure Node.js ≥ 20
4. Create writable directories for database and backups
5. Configure process supervisor per [DEPLOYMENT_SUPERVISOR_GUIDE.md](./DEPLOYMENT_SUPERVISOR_GUIDE.md)

---

## Automated deployment

```bash
export DATABASE_URL="file:/absolute/path/to/production.db"
export DRAFTKINGS_EXPORT_PATH="/absolute/path/to/draftkings-export.json"
export PROJECTION_EXPORT_PATH="/absolute/path/to/projection-export.json"
export NODE_ENV=production

npm run deploy
```

The deploy script executes:
1. Pre-deploy database backup
2. `npm ci`
3. `certify:deploy`
4. `db:setup` (skip with `SKIP_DB_SETUP=1` on subsequent deploys)
5. `npm run build`
6. `certify:startup`
7. `deploy:smoke` (full mode — writes to `DATABASE_URL`)

For production hosts where smoke must not mutate slate data:

```bash
SMOKE_MODE=readonly npm run deploy:smoke
```

Read-only mode validates deployment config, startup, connector fetch, and engine registry **without** refresh or analyze pipeline writes. Use full smoke in staging for end-to-end validation.

---

## Manual deployment

```bash
npm ci
npm run deploy:backup
npm run certify:deploy
npm run db:setup          # first deploy only
npm run build
npm run start --workspace=@alpha-dfs/web &
npm run certify:startup
npm run deploy:smoke              # full mode (staging)
# Production-safe verification (no DB writes):
SMOKE_MODE=readonly npm run deploy:smoke
```

Optional HTTP verification against running server:

```bash
DEPLOY_BASE_URL=http://localhost:3001 npm run deploy:smoke
DEPLOY_BASE_URL=http://localhost:3001 SMOKE_MODE=readonly npm run deploy:smoke
```

### Backup retention (optional)

```bash
npm run deploy:backup:prune              # dry-run
npm run deploy:backup:prune -- --execute # delete candidates
```

Post-deploy prune: `PRUNE_BACKUPS=1 npm run deploy`

---

## Production readiness verification

```bash
npm run deploy:verify
```

Includes: config validation, backup directory check, startup validation, smoke test, backup procedure test.

Full regression (optional):

```bash
FULL_CERTIFY=1 npm run deploy:verify
```

---

## Post-deployment

1. Verify health endpoints (see Production Operations Guide)
2. Run manual Analyze Slate from dashboard
3. Archive backup path and deployment timestamp
4. Complete [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) sign-off

---

## Troubleshooting

| Issue | Action |
|-------|--------|
| `certify:startup` DB error | Use absolute `DATABASE_URL`; run `db:push` |
| Provider not configured | Check export paths or API credentials |
| Smoke test validation fail | Run `POST /api/pipeline/refresh` manually; check diagnostics |
| Build fails | Run `npm run lint`; check TypeScript errors |
