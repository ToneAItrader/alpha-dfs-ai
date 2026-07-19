# Configuration Checklist — Version 1

**Task:** 11.8

---

## Required

| Variable | Validation |
|----------|------------|
| `DATABASE_URL` | Set; SQLite path writable |

## Live mode (default)

| Variable | Validation |
|----------|------------|
| `DRAFTKINGS_EXPORT_PATH` **or** `DRAFTKINGS_API_URL` + `DRAFTKINGS_API_KEY` | P0 configured; file readable if file mode |
| `PROJECTION_EXPORT_PATH` **or** `PROJECTION_API_URL` + `PROJECTION_API_KEY` | P1 recommended |

## Consistency rules

- API URL without API key → **blocker**
- `CONNECTOR_MODE=seed` in production → **blocker**
- `ENGINE_REGISTRY_MODE=stub` in production → **blocker**
- `ALPHA_DFS_ALLOW_SEED_FALLBACK=true` in production → **blocker**

## Optional (defaults documented in `.env.example`)

| Variable | Default |
|----------|---------|
| `PIPELINE_TIMEOUT_MS` | 120000 |
| `CONNECTOR_TIMEOUT_MS` | 15000 |
| `FRESHNESS_THRESHOLD_MS` | 86400000 |
| `METRICS_RETENTION_COUNT` | 500 |

## Validation commands

```bash
npm run certify:deploy    # Config only (no DB)
npm run certify:startup   # Config + DB + engines (use absolute DATABASE_URL)
```

**Note:** For `certify:startup`, use an absolute `DATABASE_URL` path (e.g. `file:/path/to/dev.db`) and ensure the database file exists (`npm run db:setup`).

**Reference:** [PROVIDER_COMPATIBILITY_MATRIX.md](../architecture/PROVIDER_COMPATIBILITY_MATRIX.md)
