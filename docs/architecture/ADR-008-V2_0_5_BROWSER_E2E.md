# ADR-008 — V2.0-5 Browser E2E Certification (Playwright)

**Status:** Implemented (V2.0-5)  
**Date:** 2026-07-19 · **Revised:** 2026-07-19 (Phase 2A) · **Implemented:** 2026-07-19  
**Capability ID:** V2.0-5  
**Phase:** V2.0 — Foundation  
**Related:** [FRONTEND_RELEASE_READINESS.md](../FRONTEND_RELEASE_READINESS.md) · [V2_ROADMAP.md](./V2_ROADMAP.md)

---

## Context

V1 frontend certification relies on Vitest component/integration tests (145 web tests). There is no browser-level E2E validation of the full user workflow: navigate → dashboard loads → Analyze Slate triggers → panels update.

Task 10 UX architecture review deferred Playwright E2E to post-RC. V2.0-5 adds browser certification without changing production UI behavior.

---

## Decision

Add **Playwright E2E test suite** as a dev/CI certification tool — not a runtime dependency.

### Scope (V2.0-5 MVP)

| Test | Validates |
|------|-----------|
| Dashboard loads | SSR renders idle state; no 500 |
| Navigation | All 8 analysis panels reachable |
| Analyze Slate flow | Button click → API call → status transition (mock or test DB) |
| Error boundary | Failed analysis shows error state, not blank page |

### Out of scope (V2.0-5)

- Visual regression / screenshot diff
- Mobile viewport certification
- Cross-browser matrix (Chromium only for MVP)

### Structure

```text
apps/web/
  playwright.config.ts
  e2e/
    global-setup.ts          # resets + seeds isolated e2e-test.db
    fixtures/test-env.ts     # ALPHA_DFS_TEST_DB env + panel routes
    00-dashboard.spec.ts
    01-navigation.spec.ts
    02-analyze-slate.spec.ts
    03-error-boundary.spec.ts
```

### npm scripts

```bash
npm run e2e:install          # install Chromium (first-time setup)
npm run certify:e2e          # headless Chromium
npm run certify:e2e:ui       # interactive debug
CERTIFY_E2E=1 npm run certify  # include E2E in full certification (optional V2.0 gate)
```

E2E runs against `next dev` or `next start` — **not included in V1 `certify` gate** until explicitly promoted.

### Test database strategy

E2E **must not** run against production `DATABASE_URL`.

| Setting | Value | Purpose |
|---------|-------|---------|
| `ALPHA_DFS_TEST_DB` | `true` | Enables isolated test database path |
| `DATABASE_URL` | Dedicated test SQLite file (e.g. `packages/database/prisma/e2e-test.db`) | Isolated from dev/prod DB |
| `CONNECTOR_MODE` | `seed` or fixture mode | No live DK credentials required |
| `DRAFTKINGS_EXPORT_PATH` | Connector fixture path | Slate data for Analyze flow |
| `PROJECTION_EXPORT_PATH` | Connector fixture path | Projection data for Analyze flow |

**Setup sequence (CI / local):**

Global setup runs automatically before Playwright tests:

```bash
npm run e2e:install          # first time only
CI=1 npm run certify:e2e     # resets e2e-test.db, starts dev server on :3001, runs suite
```

Manual equivalent:

```bash
export ALPHA_DFS_TEST_DB=true
export DATABASE_URL="file:packages/database/prisma/e2e-test.db"
export CONNECTOR_MODE=seed
npm run db:setup
npm run dev                  # port 3001
npm run certify:e2e
```

**Analyze Slate E2E:** Uses fixture connector mode; asserts status transition (idle → running → complete/error) without requiring live API credentials.

### Constraints

- **No Presentation component changes** for E2E hooks unless `data-testid` additions (Class B observability)
- E2E uses seed/fixture connector mode
- Failures block V2.0 phase certification, not V1 maintenance

---

## Consequences

### Positive

- Catches SSR 500 regressions (e.g. cache miss reconstruction)
- Validates full Analyze Slate UX path

### Negative

- Playwright adds devDependency weight (~150MB browsers)
- CI runtime increase (~2–3 min)

---

## Implementation gate requirements

- [x] V2 implementation gate open for Phase V2.0
- [x] E2E passes against fresh DB + fixtures (11 tests, Chromium)
- [x] Document in RELEASE_CERTIFICATION_SPEC.md as optional V2.0 gate

---

## V1 impact

**None until E2E added to certify pipeline.** V1 `npm run certify` unchanged.
