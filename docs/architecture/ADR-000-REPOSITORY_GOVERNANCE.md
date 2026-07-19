# ADR-000 — Repository Governance

**Status:** Accepted  
**Date:** 2026-07-19  
**Phase:** Repository bootstrap (Post V2.1)  
**Related:** [V2_MIGRATION_STRATEGY.md](./V2_MIGRATION_STRATEGY.md) · [V2_PLANNING_GOVERNANCE.md](./V2_PLANNING_GOVERNANCE.md) · [V1_MAINTENANCE_GOVERNANCE.md](../operations/V1_MAINTENANCE_GOVERNANCE.md) · [DUAL_TRACK_WORKFLOW.md](../operations/DUAL_TRACK_WORKFLOW.md)

---

## Context

Alpha DFS AI completed the V2.1 Intelligence program (247 regression tests, 11/11 E2E certification, governance closeout) but the repository had not yet recorded its first commit. Repository bootstrap is a **separate activity** from feature development. Without explicit repository governance, branch strategy, merge policy, and release criteria remain implicit.

This ADR establishes the canonical rules for git workflow, releases, and verification gates before V2.2 planning begins.

---

## Decision

Adopt the following repository governance model for Alpha DFS AI.

### Default branch

| Branch | Role |
|--------|------|
| **`main`** | Integration and release line. Protected. All phase completions merge here after gate close. |
| `v2/v2.x-*` | Phase implementation branches (e.g. `v2/v2.1-intelligence`). Deleted or archived after merge to `main`. |

**Bootstrap sequence:**

1. Initial commit on `v2/v2.1-intelligence` (V2.0 foundation + V2.1 intelligence complete).
2. Create `main` from merge of `v2/v2.1-intelligence`.
3. Tag release `v2.1.0` on `main` after post-merge validation passes.

### Branching strategy

```text
main                          ← integration / release
  └── v2/v2.1-intelligence    ← phase branch (merge then tag)
  └── v2/v2.2-adi             ← future phase (not authorized until gate open)
```

| Rule | Policy |
|------|--------|
| V1 maintenance | Bug fixes on `main` or short-lived `fix/*` branches merging to `main` |
| V2 phase work | Long-lived `v2/v2.x-*` branch per implementation gate |
| Capability work | Optional short-lived `feat/v2.x-capability` branches merging to phase branch |
| Hotfix | `hotfix/*` from `main`, merge back to `main` and active phase branch if applicable |
| Branch lifetime | Phase branches archived after merge; do not accumulate stale `v2/*` branches |

### Merge strategy

| Merge type | When | Method |
|------------|------|--------|
| Phase completion | Gate closed, validation pass | Merge commit (`v2/v2.x-*` → `main`) preserving history |
| Capability | Within active phase | Squash or merge commit to phase branch (author preference: merge commit for audit trail) |
| Hotfix | Production issue | Merge commit to `main`; cherry-pick to active phase branch if needed |

**Prohibited:**

- Force-push to `main`
- Direct commits to `main` for multi-file capability work (use phase branch)
- Merging unauthorized V2.2+ work before implementation gate opens

### Release process

| Step | Requirement |
|------|-------------|
| 1. Gate close | Phase implementation gate marked CLOSED with completion record |
| 2. Validation | Full workspace regression + E2E + production build + smoke |
| 3. Merge | Phase branch → `main` |
| 4. Re-validate | Post-merge regression + E2E on `main` |
| 5. Tag | Annotated git tag (`v2.x.0`) |
| 6. Release notes | Published in `docs/operations/releases/` |
| 7. Governance sync | ADR headers, roadmap, gates updated |

Deployment follows [V2_MIGRATION_STRATEGY.md](./V2_MIGRATION_STRATEGY.md) Model A (in-place upgrade) for V2.0–V2.1 scope.

### Semantic versioning

Format: **`vMAJOR.MINOR.PATCH`**

| Component | Meaning |
|-----------|---------|
| MAJOR | Charter amendment, breaking API/DTO contract, incompatible migration |
| MINOR | Phase completion (V2.1, V2.2, …) or additive capability within phase |
| PATCH | Bug fix, docs-only, non-breaking correction on release line |

**Current target after bootstrap:** `v2.1.0` (V2.0 foundation + V2.1 intelligence).

Monorepo packages use independent `0.x` versions in `package.json`; release tags apply to the **repository**, not individual workspace packages.

### Commit conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <description>

[optional body]

[optional footer: Change-Id, V2-CC-00x]
```

| Type | Use |
|------|-----|
| `feat` | New capability or user-visible behavior |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `test` | Test additions or corrections |
| `chore` | Tooling, deps, non-product changes |
| `refactor` | Code change without behavior change |

**Scope examples:** `v2.1`, `connectors`, `pipeline`, `pie`, `governance`

**Bootstrap commit:** `feat(v2): V2.0 foundation and V2.1 intelligence program complete`

### Review requirements

| Change class | Review |
|--------------|--------|
| V1 maintenance (P0/P1) | Self-review + regression pass; Opus for major incidents |
| V2 phase capability | ADR approved → implement → GPT-5.5 ADR verification before gate advance |
| Material architecture change | Opus independent review before implementation |
| Governance-only | GPT-5.5 sync review |

No capability merges without corresponding ADR and completion record (or inline record for trivial wiring tasks like V2.1-2).

### Testing requirements

All merges to `main` require:

| Check | Command | Threshold |
|-------|---------|-----------|
| Workspace regression | `npm test --workspaces --if-present` | All pass |
| E2E certification | `CI=1 npm run certify:e2e` | All pass |
| Production build | `npm run build` | Success |
| Startup validation | `npm run certify:startup` | Success (release candidates) |
| Smoke (staging) | `npm run deploy:smoke` | Success |

Phase branches must pass regression before merge request to `main`. E2E required at phase gate close and post-merge on `main`.

### Remote configuration

When remote is available:

| Setting | Value |
|---------|-------|
| Default branch | `main` |
| Protected branches | `main` — require validation checks before merge |
| Remote name | `origin` (conventional) |

Until remote exists, validation runs locally and merge reports document evidence.

### Tags

| Tag pattern | Meaning |
|-------------|---------|
| `v2.0.0` | V2.0 foundation complete (included in v2.1.0 bootstrap if not separately tagged) |
| `v2.1.0` | V2.1 intelligence program complete |
| `v2.x.0` | Future phase releases |

Use annotated tags: `git tag -a v2.1.0 -m "V2.1 Intelligence program complete"`.

---

## Consequences

### Positive

- Clear separation between repository bootstrap and feature development
- Repeatable release and merge process for V2.2+ ADI program
- Aligns with existing dual-track workflow and implementation gates

### Negative

- Initial bootstrap creates `main` without separate V1 history (acceptable — V1 RC validated pre-monorepo bootstrap)

---

## Acceptance criteria (bootstrap)

- [ ] Git identity configured locally
- [ ] Initial commit on `v2/v2.1-intelligence`
- [ ] `main` created from validated merge
- [ ] Tag `v2.1.0` applied
- [ ] Post-merge validation report published
- [ ] This ADR referenced in ARCHITECTURE_INDEX

---

## Exactly one next action

**Task 0.1:** Configure git identity and create initial commit on `v2/v2.1-intelligence`. Then proceed to Task 0.3 (bootstrap `main`) per Phase 0 execution plan.
