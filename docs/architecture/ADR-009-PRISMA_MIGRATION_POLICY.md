# ADR-009 — Prisma Migration Policy (Version 2)

**Status:** Accepted (Planning — no implementation)  
**Date:** 2026-07-19  
**Phase:** Cross-cutting (all V2 phases with schema changes)  
**Related:** [V2_MIGRATION_STRATEGY.md](./V2_MIGRATION_STRATEGY.md) · [V2_IMPLEMENTATION_GATE.md](./V2_IMPLEMENTATION_GATE.md)

---

## Context

V1 uses `prisma db push` for schema application (`npm run db:setup`). This is appropriate for V1 RC validation but lacks:

- Versioned migration history
- Rollback SQL artifacts
- Audit trail for schema changes

V2.1+ capabilities (simulation metadata, provider fields, platform/sport dimensions) will require schema extensions. This ADR defines migration governance before any V2 schema change is implemented.

---

## Decision

### Migration tooling transition

| Phase | Tool | When |
|-------|------|------|
| V1 (current) | `prisma db push` | Maintenance only — no schema changes |
| V2.0 | No schema changes | Ops tooling only |
| V2.1+ | `prisma migrate dev` / `prisma migrate deploy` | First DTO-adjacent schema extension |

### Principles

1. **Additive only** — new columns/tables; no destructive drops on V1 tables without explicit ADR + backup gate
2. **Backward-compatible reads** — V1 code must not break if V2 columns exist (nullable defaults)
3. **Backup before migrate** — `deploy:backup` mandatory before any production migration
4. **Rollback plan** — every migration includes documented rollback (restore backup or down migration)
5. **Smoke after migrate** — `deploy:smoke` or `SMOKE_MODE=readonly` after migration applied

### Migration workflow (V2.1+)

```text
1. npm run deploy:backup
2. npx prisma migrate deploy   # production
   npx prisma migrate dev      # development
3. npm run certify:startup
4. SMOKE_MODE=readonly npm run deploy:smoke
5. npm test --workspaces --if-present
```

### File location

```text
packages/database/prisma/migrations/
  YYYYMMDDHHMMSS_description/
    migration.sql
```

### Naming convention

`YYYYMMDDHHMMSS_v2_<phase>_<capability>.sql`

Example: `20260719120000_v2_1_simulation_metadata.sql`

### Destructive changes

Require:

- Dedicated ADR amendment to this policy
- Explicit operator sign-off
- Full backup + rollback rehearsal documented

### SQLite constraints

- V1 remains SQLite for V2.0–V2.1
- Evaluate Postgres migration in V2.2 ADR if multi-tenant or concurrent write requirements emerge
- `VACUUM INTO` backup model preserved until storage ADR supersedes

---

## Consequences

### Positive

- Auditable schema evolution
- Clear rollback path for V2 features
- V1 stability protected via additive policy

### Negative

- Migration discipline adds overhead vs `db push`
- SQLite migration limitations (no concurrent ALTER in some cases)

---

## Implementation gate requirements

- [x] First V2.1 capability with schema change references this ADR
- [x] `db:migrate` scripts added to `packages/database/package.json`
- [x] Migration test in database package
- [x] V2_MIGRATION_STRATEGY.md updated with first migration example

---

## V1 impact

**None until V2.1 schema change.** V1 continues `db:push` for maintenance.
