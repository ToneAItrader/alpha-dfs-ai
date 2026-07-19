# Version 2 Migration Strategy

**Status:** Planning complete — Phase 2A revisions applied  
**Date:** 2026-07-19  
**V1 baseline:** RC-approved build  
**Migration policy:** [ADR-009-PRISMA_MIGRATION_POLICY.md](./ADR-009-PRISMA_MIGRATION_POLICY.md)

---

## Principles

1. **No forced migration** — V1 deployments continue operating during V2 rollout
2. **Additive schema** — database migrations extend, don't destructive-drop V1 tables
3. **DTO versioning** — new fields optional; mappers default sensibly for V1 data
4. **Parallel branches** — V2 development on separate branch until cutover decision
5. **Rollback always available** — same SQLite backup/rollback model until infra changes

---

## Deployment models

### Model A — In-place upgrade (recommended for V2.0–V2.1)

Single instance, same `DATABASE_URL`, same host.

```text
1. npm run deploy:backup
2. Deploy V2 build (backward compatible)
3. npm run db:migrate (V2.1+ only — per [ADR-009](./ADR-009-PRISMA_MIGRATION_POLICY.md); V2.0 has no schema changes)
4. npm run deploy:verify
5. Smoke + manual Analyze Slate (production: `SMOKE_MODE=readonly`; staging: full smoke)
```

Rollback: `deploy:rollback` + previous build artifact.

### Model B — Side-by-side (recommended for V2.2+)

New platform/sport may warrant separate instance:

```text
V1 instance: DK · NFL · Classic (unchanged)
V2 instance: New scope on separate DATABASE_URL
```

No shared database until explicitly designed.

---

## Data migration

| V2 phase | Migration type | Policy |
|----------|----------------|--------|
| V2.0 | **None** — ops tooling only | No schema changes |
| V2.1 | Optional new columns (projections metadata, simulation fields) | [ADR-009](./ADR-009-PRISMA_MIGRATION_POLICY.md) |
| V2.2 | New platform tables or platform_id column | ADR-009 + platform ADR |
| V2.3 | Sport dimension tables | ADR-009 + sport plugin ADR |
| V2.4 | Contest, bankroll, multi-slate tables | ADR-009 + Amendment 004 |

All migrations require:

- Prisma migration script per [ADR-009-PRISMA_MIGRATION_POLICY.md](./ADR-009-PRISMA_MIGRATION_POLICY.md)
- Rollback SQL or backup-before-migrate
- Validation in smoke test (readonly or full)

### First V2.1 migration (V2.1-3 — executed 2026-07-19)

| Field | Value |
|-------|-------|
| Capability | V2.1-3 GPP Field Simulation |
| Migration | `20260719120000_v2_1_simulation_field_metadata` |
| Change | Additive `SimulationRun` table for optional field-metadata persistence |
| Rollback | Restore pre-migrate backup; table is new — no V1 column impact |
| Workflow | `db:migrate` scripts + migration SQL test in `@alpha-dfs/database` |
| Runtime impact | Simulation outputs remain DTO-driven; DB persistence optional per ADR-012 |

---

## Configuration migration

| V1 env var | V2 change |
|------------|-----------|
| `DATABASE_URL` | Unchanged |
| `DRAFTKINGS_*` | Unchanged for DK path |
| `CONNECTOR_MODE` | Unchanged |
| New V2 vars | Documented in V2 ADRs only when implemented |

---

## API compatibility

| Endpoint | V2 policy |
|----------|-----------|
| `/api/pipeline/analyze` | Response additive only |
| `/api/health/*` | Backward compatible |
| New V2 endpoints | New routes only; no breaking changes to V1 routes |

---

## UI migration

- Existing panels consume same ViewModels until mappers extended
- Slate Intelligence: swap placeholder provider → live (no panel rewrite)
- New panels require Mission Control / charter review (outside V2.0 scope)

---

## Cutover checklist (when V2 implementation ships)

- [ ] V1 backup taken
- [ ] V2 ADRs approved
- [ ] Full certify pass on V2 branch
- [ ] RC validation repeated for V2 scope
- [ ] Rollback rehearsed
- [ ] Release notes published
- [ ] V1 maintenance branch tagged

---

## Rollback strategy

Identical to V1 ([ROLLBACK_GUIDE.md](../operations/ROLLBACK_GUIDE.md)):

1. Stop process
2. Restore database backup
3. Restore previous build
4. `certify:startup` + `SMOKE_MODE=readonly npm run deploy:smoke` (or full smoke in staging)

V2 migrations that are irreversible require explicit ADR approval and backup gate.
