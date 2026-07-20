# RP-5 — GitHub Release Report

**Program:** Release Program RP-5  
**Date:** 2026-07-19  
**Executor:** Composer 2.5  
**Status:** ⚠️ **Prepared — not published** (no git remote / GitHub CLI)

---

## Blockers

| Prerequisite | Status |
|--------------|--------|
| Git remote `origin` | ❌ Not configured |
| GitHub CLI (`gh`) | ❌ Not installed |
| Tag `v2.2.0` on local `main` | ✅ Created |

---

## Release payload (ready to publish)

**Tag:** `v2.2.0`  
**Title:** Alpha DFS AI v2.2.0 — Alternative Data Intelligence Platform  
**Classification:** Release Candidate

### Release body (markdown)

Use [V2_2_RELEASE_NOTES.md](../releases/V2_2_RELEASE_NOTES.md) as the primary body.

**Certification summary (attach inline):**

| Check | Result |
|-------|--------|
| Workspace tests | 353/353 |
| E2E (V2.1) | 11/11 |
| Build | Pass |
| ADI benchmark p95 | 14 ms |
| ADI default | **OFF** |

**Known limitations:**

- ADI E2E browser tests (5) not implemented — integration tests cover behavior
- 10-run memory soak not automated
- Live ADI requires operator credential configuration
- Production Ready (ADI enabled) not certified until RP-7 live certification

### Attachments

| File | Path |
|------|------|
| Certification evidence | `docs/architecture/V2_2_CERTIFICATION_EVIDENCE_PACKAGE.json` |
| Release candidate summary | `docs/architecture/V2_2_RELEASE_CANDIDATE_SUMMARY.md` |
| Final certification review | `docs/architecture/V2_2_FINAL_CERTIFICATION_REVIEW.md` |

---

## Manual publish steps

### Option A — GitHub CLI (recommended)

```bash
# Configure remote first
git remote add origin <repository-url>
git push origin main
git push origin v2.2.0

# Install gh, authenticate, then:
gh release create v2.2.0 \
  --title "Alpha DFS AI v2.2.0 — ADI Platform (Release Candidate)" \
  --notes-file docs/operations/releases/V2_2_RELEASE_NOTES.md \
  --attach docs/architecture/V2_2_CERTIFICATION_EVIDENCE_PACKAGE.json \
  --attach docs/architecture/V2_2_RELEASE_CANDIDATE_SUMMARY.md
```

### Option B — GitHub web UI

1. Push `main` and tag `v2.2.0` to remote
2. Repository → Releases → Draft new release
3. Choose tag `v2.2.0`
4. Paste release notes from `V2_2_RELEASE_NOTES.md`
5. Attach evidence JSON and candidate summary
6. Mark as **Release Candidate** (not Latest if v2.1.0 remains production baseline)

---

## Post-publish checklist

- [ ] Release visible on GitHub
- [ ] Tag points to `c409f75`
- [ ] Attachments downloadable
- [ ] Release notes render correctly
- [ ] ADI default-off warning prominent

---

## Next step

RP-6: Operational Readiness Package — production operations documentation.
