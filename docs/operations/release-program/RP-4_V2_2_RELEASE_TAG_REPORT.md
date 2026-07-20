# RP-4 — Release Tag Report

**Program:** Release Program RP-4  
**Date:** 2026-07-19  
**Executor:** Composer 2.5  
**Status:** ✅ Complete

---

## Tag summary

| Field | Value |
|-------|-------|
| Tag name | `v2.2.0` |
| Tag type | Annotated |
| Points to | `c409f759bb255709768853571b7116cd7d7e6e10` |
| Merge commit (short) | `c409f75` |
| Prior release tag | `v2.1.0` @ `dd52641` |

---

## Tag message

```text
Alpha DFS AI v2.2.0 — Alternative Data Intelligence Platform

Release Candidate. ADI disabled by default.
M4–M8 certified. 353 tests pass.
```

---

## Verification

| Check | Result |
|-------|--------|
| Tag exists locally | ✅ `git tag -l v2.2.0` |
| Tag → merge commit | ✅ `git rev-parse v2.2.0^{commit}` = `c409f75` |
| Working tree | Clean after tag (pre RP docs commit) |
| Version references in release notes | ✅ `v2.2.0` |

---

## Push instructions (when remote configured)

```bash
git push origin main
git push origin v2.2.0
```

---

## Next step

RP-5: Publish GitHub Release using tag `v2.2.0`.
