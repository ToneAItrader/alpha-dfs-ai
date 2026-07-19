# ADR-007 — V2.0-4 Deployment Supervisor Guide

**Status:** Accepted (Implemented — V2.0-4)  
**Date:** 2026-07-19  
**Capability ID:** V2.0-4  
**Phase:** V2.0 — Foundation  
**Related:** [DEPLOYMENT_GUIDE.md](../operations/DEPLOYMENT_GUIDE.md) · [V2_ROADMAP.md](./V2_ROADMAP.md)

---

## Context

V1 deployment is documented as manual `npm run deploy` + `next start`. RC validation noted the absence of process supervisor guidance (systemd, pm2, Docker) as an outstanding operational risk. V1 intentionally deferred supervisor automation to avoid scope creep during RC.

V2.0-4 is **documentation only** — no supervisor code in the application.

---

## Decision

Produce **`docs/operations/DEPLOYMENT_SUPERVISOR_GUIDE.md`** with reference configurations for:

| Supervisor | Use case |
|------------|----------|
| **systemd** | Linux VPS / bare metal (recommended) |
| **pm2** | Node.js-native process management |
| **Docker Compose** | Containerized single-host deployment |

### Guide contents (required sections)

1. Prerequisites (Node 20+, absolute `DATABASE_URL`, env file)
2. Build and deploy sequence (reference existing `deploy.sh`)
3. Supervisor unit file / compose file (copy-paste templates)
4. Health check integration (`GET /api/health/ready`)
5. Restart policy (on-failure, max 3 restarts / 60s)
6. Log rotation (supervisor handles stdout; reference telemetry export ADR-004)
7. Rollback procedure (reference ROLLBACK_GUIDE.md)

### Constraints

- **No application code changes**
- **No new npm dependencies**
- Templates use port 3001 and existing env var names
- Manual-run model preserved — no auto-start analysis

---

## Consequences

### Positive

- Closes RC operational gap without code risk
- Operators can choose supervisor fit for their host

### Negative

- Templates require operator customization (paths, user)

---

## Implementation gate requirements

- [x] V2 implementation gate open for Phase V2.0
- [x] Document reviewed against current deploy.sh order
- [x] Cross-reference from DEPLOYMENT_GUIDE.md

---

## V1 impact

**Documentation only.** No runtime changes.
