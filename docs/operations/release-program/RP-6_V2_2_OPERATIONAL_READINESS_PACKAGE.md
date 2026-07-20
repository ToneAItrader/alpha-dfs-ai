# RP-6 — Operational Readiness Package (V2.2)

**Program:** Release Program RP-6  
**Date:** 2026-07-19  
**Version:** v2.2.0 (Release Candidate)  
**Scope:** Production operations — no implementation  
**Related:** [PRODUCTION_OPERATIONS_GUIDE.md](../PRODUCTION_OPERATIONS_GUIDE.md) · [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) · [V2_2_RELEASE_NOTES.md](../releases/V2_2_RELEASE_NOTES.md)

---

## 1. Executive summary

V2.2 is a **Release Candidate** with ADI **disabled by default**. Production deployment of V2.2 without ADI flags behaves as V2.1. This package consolidates operational procedures for deploying, monitoring, rolling back, and eventually enabling ADI.

---

## 2. Production checklist (V2.2)

### Pre-deploy

- [ ] Merge verified on `main` @ tag `v2.2.0` (`c409f75`)
- [ ] `CONNECTOR_MODE=live` (not `seed`) in production
- [ ] `ADI_PLATFORM_ENABLED=false` (default — verify explicitly)
- [ ] All `ADI_PROVIDER_*_ENABLED=false` (default)
- [ ] DraftKings P0 credentials configured
- [ ] `DATABASE_URL` absolute path; schema current (`npm run db:push`)
- [ ] `npm run deploy:backup` completed
- [ ] `npm run build` succeeds on deploy host
- [ ] `npm run certify:startup` passes with production env
- [ ] `npm run deploy:verify` passes

### Deploy

- [ ] Stop existing process gracefully
- [ ] Deploy artifact (build + env)
- [ ] `npm run certify:startup`
- [ ] `SMOKE_MODE=readonly npm run deploy:smoke`
- [ ] Manual Analyze Slate completes

### Post-deploy (V2.1 path — ADI off)

- [ ] `GET /api/health/startup` → `ok: true`
- [ ] `GET /api/health/ready` → `ready: true`
- [ ] Dashboard loads at configured port (default **3001**)
- [ ] No ADI metrics unless platform enabled

### ADI enablement (separate gate — RP-7)

- [ ] Do **not** enable ADI until Live Certification Plan complete
- [ ] Enable one provider at a time in staging first

**Reference:** [RELEASE_CHECKLIST.md](../RELEASE_CHECKLIST.md) · [DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md)

---

## 3. Runbook

### Daily operations

| Task | Command / endpoint | Expected |
|------|-------------------|----------|
| Health check | `GET /api/health` | status ≠ `unhealthy` |
| Startup validation | `npm run certify:startup` | `ok: true` |
| Analyze slate | Dashboard → Analyze Slate | Status → Complete |
| Pipeline status | Header / `GET /api/pipeline/status` | Phases complete |

### V2.2-specific (ADI off)

No change from V2.1 daily runbook. ADI platform bootstraps as no-op when `ADI_PLATFORM_ENABLED=false`.

### V2.2-specific (ADI on — staging only until RP-7)

| Task | Verification |
|------|--------------|
| Platform bootstrap | Logs show ADI prepare phase |
| Provider fetch | Metrics `adi.provider.fetch.duration_ms` |
| Fusion | Metrics `adi.fusion.items.*` |
| Engine overlays | Pipeline completes; degradation notes if partial |

### Dev server

```bash
cd /path/to/alpha-dfs-ai
npm run db:setup          # first time
CONNECTOR_MODE=seed npm run dev   # local without live credentials
# Dashboard: http://localhost:3001/dashboard
```

**Port note:** Web app binds **3001** (`next dev -p 3001`). E2E also uses 3001 — ensure port free before tests.

---

## 4. Monitoring plan

### Health endpoints (unchanged)

| Endpoint | Purpose |
|----------|---------|
| `/api/health` | Liveness |
| `/api/health/ready` | Readiness after refresh |
| `/api/health/startup` | Dependency validation |
| `/api/health/diagnostics` | Metrics, traces, logs |
| `/api/health/metrics` | Prometheus-style export |

### V2.2 ADI metrics (when enabled)

| Metric | Meaning |
|--------|---------|
| `adi.provider.fetch.duration_ms` | Provider latency |
| `adi.provider.failure.total` | Provider failures |
| `adi.fusion.items.in/out` | Fusion throughput |
| `adi.fusion.conflicts.total` | Conflict count |

### Alerts (recommended)

| Condition | Severity | Action |
|-----------|----------|--------|
| Startup validation fail | Critical | Do not route traffic; rollback |
| Analyze 500 rate > threshold | High | Check logs; rollback if persistent |
| Provider failure spike (ADI on) | Medium | Degrade expected; check credentials |
| Fusion p95 > 30s | Medium | Performance investigation |

**Reference:** [PRODUCTION_OPERATIONS_GUIDE.md](../PRODUCTION_OPERATIONS_GUIDE.md)

---

## 5. Incident response guide

### Severity classification

| Level | Example | Response |
|-------|---------|----------|
| S1 | Analyze Slate down, data corruption | Immediate rollback |
| S2 | Degraded refresh, partial provider fail | Monitor; ADI degrade expected |
| S3 | Non-critical UI issue | Next maintenance window |

### Response steps

1. **Confirm** — `certify:startup`, health endpoints, recent deploy
2. **Contain** — Stop traffic if S1
3. **Diagnose** — Logs (`correlationId`, `runId`), diagnostics endpoint
4. **Recover** — Rollback (Section 6) or disable ADI flag
5. **Document** — Incident record with timeline

### ADI-specific incidents

| Symptom | Likely cause | Fast fix |
|---------|--------------|----------|
| Pipeline slow after ADI enable | Provider timeout | Disable failing provider flag |
| Partial analysis results | Provider degrade | Expected; check degradation notes |
| Fusion errors | Invalid packages | Disable ADI; rollback if persistent |

**Fast ADI rollback:** Set `ADI_PLATFORM_ENABLED=false` and restart — immediate V2.1 behavior.

---

## 6. Rollback procedure

### Application rollback (V2.2 → V2.1)

```bash
git checkout v2.1.0
npm ci
npm run build
npm run certify:startup
npm run deploy:smoke
```

### ADI-only rollback (stay on V2.2)

```bash
# In .env / secrets:
ADI_PLATFORM_ENABLED=false
# Restart application
npm run certify:startup
```

### Database rollback

```bash
npm run deploy:rollback -- backups/alpha-dfs-<timestamp>.db
npm run certify:startup
```

**Reference:** [ROLLBACK_GUIDE.md](../ROLLBACK_GUIDE.md)

---

## 7. Backup procedure

### Pre-deploy (mandatory)

```bash
npm run deploy:backup
```

Verify backup in `backups/` directory.

### Retention

```bash
npm run deploy:backup:prune   # per retention policy
```

### Recovery validation

After restore: `certify:startup` + smoke test before re-enabling traffic.

---

## 8. Feature-flag activation procedure

**Principle:** Enable incrementally. Never enable all ADI flags simultaneously in production on first rollout.

### Step 0 — Baseline (production default)

```env
ADI_PLATFORM_ENABLED=false
ADI_FUSION_ENABLED=true
ADI_LEARNING_ENABLED=false
ADI_PROVIDER_*_ENABLED=false
```

### Step 1 — Enable platform (staging)

```env
ADI_PLATFORM_ENABLED=true
# All providers still false — empty bundle, V2.1 engine outputs
```

Verify: pipeline completes; no errors.

### Step 2 — Enable one provider (staging)

```env
ADI_PROVIDER_NEWS_ENABLED=true
```

Verify: fetch metrics; fusion produces subjects; analyze completes.

### Step 3 — Repeat per provider

Enable one provider at a time. Validate each before next.

### Step 4 — Learning agent (optional, last)

```env
ADI_LEARNING_ENABLED=true
```

Only after all providers validated. Learning is observability-only in MVP.

### Emergency disable

```env
ADI_PLATFORM_ENABLED=false
```

Restart. No code deploy required.

---

## 9. Live provider activation checklist

Per provider before `ADI_PROVIDER_*_ENABLED=true` in production:

- [ ] Live credentials configured and tested
- [ ] Seed fixture parity validated in staging
- [ ] Rate limits / licensing reviewed
- [ ] Timeout and retry behavior observed
- [ ] Degrade path verified (provider off → analysis still completes)
- [ ] Fusion conflict behavior understood for provider evidence types
- [ ] Operator sign-off recorded

**Providers:** news, social, sportsbook, consensus, dfs_content, betting, historical_learning

**Reference:** [PROVIDER_COMPATIBILITY_MATRIX.md](../../architecture/PROVIDER_COMPATIBILITY_MATRIX.md) · [V2_2_EVIDENCE_PROVIDER_SPECIFICATIONS.md](../../architecture/V2_2_EVIDENCE_PROVIDER_SPECIFICATIONS.md)

---

## 10. Document index

| Document | Purpose |
|----------|---------|
| [V2_2_RELEASE_NOTES.md](../releases/V2_2_RELEASE_NOTES.md) | Release summary |
| [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) | Deploy steps |
| [CONFIGURATION_CHECKLIST.md](../CONFIGURATION_CHECKLIST.md) | Env validation |
| [RELEASE_CERTIFICATION_SPEC.md](../RELEASE_CERTIFICATION_SPEC.md) | Cert requirements |
| [RP-7_V2_2_LIVE_CERTIFICATION_PLAN.md](./RP-7_V2_2_LIVE_CERTIFICATION_PLAN.md) | Path to Production Ready |

---

## Exactly one next action

Execute [RP-7 Live Certification Plan](./RP-7_V2_2_LIVE_CERTIFICATION_PLAN.md) in staging before production ADI enablement.
