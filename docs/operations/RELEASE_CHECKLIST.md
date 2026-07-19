# Release Checklist — Version 1

**Task:** 11.8 · **Scope:** DraftKings · NFL · Classic Salary Cap

---

## Pre-release

- [ ] `npm run certify` passes (all test suites + deployment config)
- [ ] `npm run build` succeeds
- [ ] `npm run certify:startup` passes with production env
- [ ] Opus RC review complete — [RC_VALIDATION_REPORT.md](./RC_VALIDATION_REPORT.md)
- [ ] DTO → Mapper → ViewModel → Presentation contract unchanged
- [ ] No ViewModel or Presentation changes in release diff

## Provider verification

- [ ] DraftKings P0 credentials configured and readable
- [ ] Projection P1 credentials configured (or degraded mode accepted)
- [ ] Manual `POST /api/pipeline/refresh` succeeds
- [ ] Manual Analyze Slate completes end-to-end

## Observability

- [ ] `GET /api/health/startup` returns `ok: true`
- [ ] `GET /api/health` returns status ≠ `unhealthy`
- [ ] `GET /api/health/ready` returns `ready: true` after refresh
- [ ] `GET /api/health/diagnostics` returns metrics, traces, logs

## Post-deploy verification

- [ ] `npm run certify:startup` passes
- [ ] `SMOKE_MODE=readonly npm run deploy:smoke` passes (production — no DB writes)
- [ ] Full `npm run deploy:smoke` passes in staging (end-to-end refresh + analyze)

- [ ] Engineering sign-off
- [ ] Operations sign-off
- [ ] Release notes published

**Spec:** [RELEASE_CERTIFICATION_SPEC.md](./RELEASE_CERTIFICATION_SPEC.md)
