# Deployment Checklist — Version 1

**Task:** 11.8

---

## Environment setup

1. Copy `.env.example` → `.env.local` (or platform env config)
2. Set `DATABASE_URL` to writable SQLite path
3. Configure DraftKings P0 credentials (file export or API)
4. Configure Projection P1 credentials (recommended)
5. Confirm `CONNECTOR_MODE=live` (default)
6. Confirm `ALPHA_DFS_ALLOW_SEED_FALLBACK` is **not** set in production
7. Confirm `ENGINE_REGISTRY_MODE=real` (default)

## Deploy steps

1. `npm ci`
2. `npm run deploy:backup` (if database exists)
3. `npm run certify:deploy`
4. `npm run db:setup` (first deploy only; applies schema to `DATABASE_URL`)
5. `npm run build`
6. `npm run certify:startup`
7. `npm run deploy:smoke`

Or: `npm run deploy` (automates the above)

## Post-deploy smoke test

1. `GET /api/health/startup` → 200, `ok: true`
2. `POST /api/pipeline/refresh` → 200
3. `POST /api/pipeline/analyze` → 200, status `complete`
4. Load dashboard — panels render with ViewModels

## Rollback

1. Stop process
2. Restore previous build + database file
3. Re-run steps 6–7 above before restoring traffic

**Script:** `npm run certify:deploy`
