# Alpha DFS AI — V2.2 Release Notes

**Version:** v2.2.0  
**Release type:** Release Candidate  
**Date:** 2026-07-19  
**Branch:** `main` (merged from `v2/v2.2-adi`)  
**Baseline:** V2.1 @ tag `v2.1.0` (`dd52641`)  
**Merge commit:** `c409f75` · tag `v2.2.0`

---

## Summary

V2.2 delivers the **Alternative Data Intelligence (ADI) Platform** — a backend-only evidence layer that fetches, fuses, and routes normalized evidence to existing V2.1 engines. All five implementation milestones (M4–M7) are complete. M8 validation confirms release readiness with ADI **disabled by default**, preserving byte-identical V2.1 behavior.

**Classification:** Development Complete · **Release Candidate**

---

## Capabilities

| ID | Capability | ADR |
|----|------------|-----|
| V2.2-1 | ADI Platform infrastructure | ADR-019 |
| V2.2-2 | Evidence Fusion Engine | ADR-020 |
| V2.2-3 | Connector Framework (7 providers) | ADR-021 |
| V2.2-4 | Agent Orchestration + Learning agent | ADR-022 |
| V2.2-5 | Engine integration (6 engines) | Engineering Plan M7 |

---

## Feature flags (defaults)

| Flag | Default | Purpose |
|------|---------|---------|
| `ADI_PLATFORM_ENABLED` | `false` | Master switch — V2.1 behavior when off |
| `ADI_FUSION_ENABLED` | `true` | Fusion when platform enabled |
| `ADI_LEARNING_ENABLED` | `false` | Post-run learning agent |
| `ADI_PROVIDER_*_ENABLED` | `false` | Per-provider toggles (7 providers) |

---

## Verification

| Check | Result |
|-------|--------|
| Workspace regression | **353/353** passed |
| Web unit tests | **186/186** passed |
| Browser E2E (V2.1 suite) | **11/11** passed (`CI=1 CONNECTOR_MODE=seed`) |
| ADI E2E (E2E-ADI-1..5) | **Not implemented** — covered by integration tests |
| Production build | Pass |
| ADI pipeline benchmark | p95 **14 ms** (gate ≤ 30 s) |
| Startup certification | Pass with `CONNECTOR_MODE=seed` |
| Operational certification | Pass |

---

## Upgrade from V2.1

1. Merge `v2/v2.2-adi` → `main` and tag `v2.2.0`
2. Run `npm run db:generate && npm run db:push` (no breaking schema changes for V2.1 path)
3. **Do not enable ADI flags** until operator readiness review
4. Existing V2.1 env vars unchanged; `CONNECTOR_MODE=live` still required for live startup

---

## Production prerequisites

Before enabling ADI in production:

1. Configure live provider credentials per `.env.example`
2. Enable providers individually via `ADI_PROVIDER_*_ENABLED`
3. Set `ADI_PLATFORM_ENABLED=true` only after seed/staging validation
4. Run `npm run deploy:verify` and `SMOKE_MODE=readonly npm run deploy:smoke`
5. Live startup validation requires DraftKings P0 configuration (`CONNECTOR_MODE=live`)

---

## Known limitations

- ADI disabled by default — no behavioral change until explicitly enabled
- No ADI UI surfaces (by design — backend-only per ADR-019)
- Five ADI-specific Playwright tests (E2E-ADI-1..5) deferred — INT-1..7 and architecture tests provide coverage
- 10-run memory leak soak not automated in `certify:startup` (manual observation only)
- Learning agent observability-only when enabled (`ADI_LEARNING_ENABLED=false` default)
- Live ADI provider paths require operator credential configuration

---

## Documentation

- M8 validation: [V2_2_M8_VALIDATION_REPORT.md](../../architecture/V2_2_M8_VALIDATION_REPORT.md)
- Final certification: [V2_2_FINAL_CERTIFICATION_REVIEW.md](../../architecture/V2_2_FINAL_CERTIFICATION_REVIEW.md)
- Program completion: [V2_2_PROGRAM_COMPLETION_RECORD.md](../../architecture/V2_2_PROGRAM_COMPLETION_RECORD.md)
- Implementation gate: [V2_2_IMPLEMENTATION_GATE.md](../../architecture/V2_2_IMPLEMENTATION_GATE.md)
