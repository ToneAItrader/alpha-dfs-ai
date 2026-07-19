# ADR-006 — V2.0-3 Backup Retention & Prune Policy

**Status:** Accepted (Implemented — V2.0-3)  
**Date:** 2026-07-19 · **Revised:** 2026-07-19 (Phase 2A)  
**Capability ID:** V2.0-3  
**Phase:** V2.0 — Foundation  
**Related:** [ROLLBACK_GUIDE.md](../operations/ROLLBACK_GUIDE.md) · [V2_ROADMAP.md](./V2_ROADMAP.md)

---

## Context

V1 backup (`deploy:backup`) creates timestamped SQLite files in `backups/` using VACUUM INTO. There is no automated retention policy — operators must manually prune old backups. RC validation identified this as an operational gap.

---

## Decision

Add **`scripts/release/prune-backups.ts`** with configurable retention.

### Retention policy

| Setting | Default | Description |
|---------|---------|-------------|
| `BACKUP_RETENTION_COUNT` | 10 | Keep N most recent backups |
| `BACKUP_RETENTION_DAYS` | 30 | Delete backups older than N days |
| `BACKUP_DIR` | `backups/` | Same as existing backup script |

### Retention rule

A backup is **retained** only if **both** conditions are satisfied:

1. It is among the `BACKUP_RETENTION_COUNT` most recent files (by modification time), **and**
2. Its age is ≤ `BACKUP_RETENTION_DAYS` (days since file mtime)

A backup is a **deletion candidate** if it fails either condition.

**Safety override:** The most recent backup is **never deleted**, regardless of age or count position.

Dry-run output must show which criterion triggered each deletion candidate (count exceeded, age exceeded, or both).

### Script behavior

```bash
npm run deploy:backup:prune   # dry-run by default
npm run deploy:backup:prune -- --execute
```

- Dry-run lists files that would be deleted
- `--execute` performs deletion
- Never deletes the most recent backup regardless of age
- Logs prune actions to stdout (structured JSON)

### Integration

- Optional post-step in `deploy.sh` (disabled by default; enable via `PRUNE_BACKUPS=1`)
- Documented in PRODUCTION_OPERATIONS_GUIDE.md

---

## Consequences

### Positive

- Prevents unbounded disk growth on long-running hosts
- No change to backup format or restore procedure

### Negative

- Operator must configure retention for their deployment size

---

## Implementation gate requirements

- [x] V2 implementation gate open for Phase V2.0
- [x] Unit tests for retention logic (count + age)
- [x] Document in DEPLOYMENT_GUIDE.md

---

## V1 impact

**None until enabled.** Prune is opt-in via script or env flag.
