# Rollback Guide — Version 1

**Task:** 11.9

---

## When to rollback

- Startup validation fails after deploy
- Smoke test fails post-deploy
- Analyze Slate returns persistent 500 errors
- Data corruption suspected after refresh
- Unplanned schema or code regression

---

## Rollback procedure

### 1. Stop traffic

Stop the Next.js process (Ctrl+C, systemd, or platform stop command).

### 2. Restore database

List available backups:

```bash
ls -la backups/
```

Restore:

```bash
npm run deploy:rollback -- backups/alpha-dfs-<timestamp>.db
```

### 3. Restore application artifact (if code changed)

```bash
git checkout <previous-tag-or-commit>
npm ci
npm run build
```

Or restore archived `.next` + `package-lock.json` from previous release.

### 4. Restore configuration (if changed)

Restore previous `.env.local` or platform secret version.

### 5. Validate recovery

```bash
npm run certify:startup
npm run deploy:smoke
```

With running server:

```bash
DEPLOY_BASE_URL=http://localhost:3001 npm run deploy:smoke
```

### 6. Re-enable traffic

Only after startup + smoke pass.

---

## Recovery validation checklist

- [ ] `GET /api/health/startup` → `ok: true`
- [ ] `GET /api/health/ready` → `ready: true`
- [ ] `POST /api/pipeline/analyze` → status `complete`
- [ ] Dashboard panels render correctly

---

## Rollback constraints (v1)

- SQLite file is the sole persistence unit — no point-in-time recovery beyond backups
- Backup frequency = pre-deploy (`npm run deploy:backup`) + manual before risky operations
- No automatic rollback — operator-initiated

---

## Related

- [PRODUCTION_OPERATIONS_GUIDE.md](./PRODUCTION_OPERATIONS_GUIDE.md)
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
