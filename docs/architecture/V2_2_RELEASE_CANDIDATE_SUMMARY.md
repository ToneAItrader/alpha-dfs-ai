# V2.2 Release Candidate Summary

**Version:** v2.2.0-rc  
**Date:** 2026-07-19  
**Branch:** `v2/v2.2-adi`  
**Baseline:** V2.1 @ `v2.1.0`

---

## What ships

V2.2 adds a backend-only Alternative Data Intelligence platform:

- **ADI Platform** — connector registry, evidence cache, event bus, orchestrator
- **Seven evidence providers** — news, social, sportsbook, consensus, dfs_content, betting, historical_learning
- **Evidence Fusion Engine** — dedupe, weight, TTL, conflict resolution → `AdiNormalizedEvidenceBundle`
- **Engine integration** — six V2.1 engines consume fused evidence via additive overlays
- **Learning agent** — async post-run (disabled by default)

No UI changes. No breaking V2.1 API changes.

---

## Validation snapshot

| Gate | Result |
|------|--------|
| Workspace tests | 353/353 ✅ |
| Production build | ✅ |
| V2.1 E2E | 11/11 ✅ |
| ADI benchmark | p95 14 ms (≤ 30 s) ✅ |
| Startup cert (seed) | ✅ |
| Architecture audit | ✅ |

---

## Default posture

**ADI is OFF.** Production deploys with `ADI_PLATFORM_ENABLED=false` preserve identical V2.1 behavior. Enable ADI only after operator review and provider credential configuration.

---

## Merge checklist

- [x] M4–M7 certified
- [x] M8 validation complete
- [x] Final certification review published
- [x] Release notes published
- [x] Evidence package published
- [ ] Merge `v2/v2.2-adi` → `main` (release engineering)
- [ ] Tag `v2.2.0`
- [ ] GitHub Release

---

## Risks accepted for RC

| Risk | Mitigation |
|------|------------|
| ADI E2E not in browser suite | INT-1..7 + integration tests |
| Memory soak manual | Monitor in staging before ADI enable |
| Live provider paths unverified in CI | Seed-first; operator live cert |

---

## Documentation index

- [V2_2_M8_VALIDATION_REPORT.md](./V2_2_M8_VALIDATION_REPORT.md) — full validation + dashboard
- [V2_2_FINAL_CERTIFICATION_REVIEW.md](./V2_2_FINAL_CERTIFICATION_REVIEW.md) — independent sign-off
- [V2_2_PROGRAM_COMPLETION_RECORD.md](./V2_2_PROGRAM_COMPLETION_RECORD.md) — program close
- [V2_2_RELEASE_NOTES.md](../operations/releases/V2_2_RELEASE_NOTES.md) — operator release notes
- [V2_2_CERTIFICATION_EVIDENCE_PACKAGE.json](./V2_2_CERTIFICATION_EVIDENCE_PACKAGE.json) — machine-readable evidence
