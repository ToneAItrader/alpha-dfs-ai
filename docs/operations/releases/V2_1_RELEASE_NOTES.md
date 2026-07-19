# Alpha DFS AI — V2.1 Release Notes

**Version:** v2.1.0  
**Release type:** Release Candidate  
**Date:** 2026-07-19  
**Branch:** `main` (merged from `v2/v2.1-intelligence`)  
**Commits:** `f54eb00` (initial) · `11edc8f` (build fixes)

---

## Summary

V2.1 delivers intelligence depth for DraftKings NFL Classic Salary Cap. All nine V2.1 capabilities (ADR-010 through ADR-018) are implemented, tested, and certified. V2.0 foundation capabilities (ADR-004 through ADR-008) are included in this release baseline.

**Classification:** Development Complete · **Release Candidate**

---

## Capabilities

| ID | Capability |
|----|------------|
| V2.1-1 | Slate Intelligence live integration |
| V2.1-2 | Header pipeline status wiring |
| V2.1-3 | Full GPP field simulation |
| V2.1-4 | NFL injury connector |
| V2.1-5 | Vegas odds connector |
| V2.1-6 | Weather connector |
| V2.1-7 | Projection intelligence calibration (flag-gated) |
| V2.1-8 | Multi-lineup exposure management (PIE extension) |
| V2.1-9 | Ownership prediction (baseline) |

---

## Verification

| Check | Result |
|-------|--------|
| Workspace regression | 247 tests passed |
| Browser E2E | 11/11 passed |
| Production build | Pass |
| Startup certification | Pass with `CONNECTOR_MODE=seed` |

---

## Production prerequisites

Before live production deployment:

1. Configure live provider credentials per `.env.example`
2. Set `CONNECTOR_MODE=live` (or file export paths)
3. Run `npm run deploy:backup` before deploy
4. Run `npm run deploy:verify` and `SMOKE_MODE=readonly npm run deploy:smoke`
5. Optional: `PROJECTION_CALIBRATION_ENABLED=true` when calibration is desired

---

## Known limitations

- Projection calibration disabled by default (`PROJECTION_CALIBRATION_ENABLED` unset)
- GPP simulation DB persistence optional (DTO-driven; schema ready)
- V2.2 Alternative Data Intelligence not started (not in scope)
- Live startup validation requires DraftKings P0 configuration

---

## Documentation

- Program completion: [V2_1_PROGRAM_COMPLETION_RECORD.md](../../architecture/V2_1_PROGRAM_COMPLETION_RECORD.md)
- Implementation gate: [V2_1_IMPLEMENTATION_GATE.md](../../architecture/V2_1_IMPLEMENTATION_GATE.md) — CLOSED
- Repository governance: [ADR-000-REPOSITORY_GOVERNANCE.md](../../architecture/ADR-000-REPOSITORY_GOVERNANCE.md)
