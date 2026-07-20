# RP-7 — Live Certification Plan (V2.2)

**Program:** Release Program RP-7  
**Date:** 2026-07-19  
**Version:** v2.2.0 → Production Ready (ADI)  
**Scope:** Planning only — do not enable production features  
**Prerequisite:** RP-3 merge complete · tag `v2.2.0` · RP-6 operational package reviewed

---

## 1. Objective

Define the controlled path from **Release Candidate** (ADI disabled) to **Production Ready** (ADI validated with live providers). This plan does not authorize production ADI enablement — it defines the gates, phases, and exit criteria.

---

## 2. Current state

| Classification | Status |
|----------------|--------|
| Development Complete | ✅ |
| Release Candidate | ✅ `v2.2.0` on `main` |
| Production Ready (V2.1 path, ADI off) | ✅ Same as V2.1 with additive code dormant |
| Production Ready (ADI enabled) | ❌ Not certified |

---

## 3. Live certification phases

```text
Phase 0: RC deployed (ADI off)
    ↓
Phase 1: Credential verification
    ↓
Phase 2: Live provider validation (staging)
    ↓
Phase 3: Shadow mode (ADI fetch, no engine consumption)
    ↓
Phase 4: Canary rollout (one provider → production)
    ↓
Phase 5: Incremental provider enablement
    ↓
Phase 6: Full ADI production enablement
    ↓
Exit: Production Ready (ADI)
```

---

## 4. Phase 0 — RC deployment (ADI off)

**Goal:** Confirm V2.2 with ADI disabled matches V2.1 production behavior.

| Step | Action | Success criteria |
|------|--------|------------------|
| 0.1 | Deploy `v2.2.0` to staging | Startup cert pass |
| 0.2 | Verify all ADI flags false | Env audit |
| 0.3 | Run full analyze cycle | Complete status |
| 0.4 | Compare outputs to V2.1 baseline | No regression |
| 0.5 | Promote to production (ADI off) | Smoke pass |

**Exit gate:** 48h stable operation with ADI off.

---

## 5. Phase 1 — Credential verification

**Goal:** Validate live provider credentials without enabling ADI platform.

| Step | Action | Success criteria |
|------|--------|------------------|
| 1.1 | Audit `.env` / secrets manager | All required vars documented |
| 1.2 | DraftKings P0 live test | Refresh succeeds |
| 1.3 | Per-provider credential test | Manual or script probe |
| 1.4 | Document credential rotation procedure | Runbook updated |

**Exit gate:** All seven ADI providers have verified live credentials OR documented intentional deferral.

---

## 6. Phase 2 — Live provider validation (staging)

**Goal:** Each provider fetch succeeds live in staging with ADI platform enabled.

| Step | Action | Success criteria |
|------|--------|------------------|
| 2.1 | `ADI_PLATFORM_ENABLED=true` in staging | Platform bootstraps |
| 2.2 | Enable one provider | Fetch metrics increment |
| 2.3 | Validate normalized packages | Schema validation pass |
| 2.4 | Validate fusion output | Bundle non-empty for matched slate |
| 2.5 | Repeat for all 7 providers | Each passes individually |

**Exit gate:** All enabled providers return valid packages on staging slate.

---

## 7. Phase 3 — Shadow mode

**Goal:** ADI fetch + fusion run; engine consumption verified without production traffic impact.

| Configuration | Value |
|---------------|-------|
| Environment | Staging |
| `ADI_PLATFORM_ENABLED` | `true` |
| Providers | All validated in Phase 2 |
| Engine overlays | Active |
| Production traffic | None |

| Step | Action | Success criteria |
|------|--------|------------------|
| 3.1 | Run 10 consecutive analyze cycles | All complete |
| 3.2 | Memory observation | ≤ 50 MB growth (manual) |
| 3.3 | Fusion p95 | ≤ 30 s |
| 3.4 | Compare ADI off vs on outputs | Document deltas |
| 3.5 | Review degradation notes | Expected partials only |

**Exit gate:** 10-run stability pass; performance within budget.

---

## 8. Phase 4 — Canary rollout

**Goal:** First live ADI provider in production with limited blast radius.

| Step | Action | Success criteria |
|------|--------|------------------|
| 4.1 | Select lowest-risk provider (e.g. `news`) | Operator approval |
| 4.2 | Enable in production: platform + one provider | Monitor 24h |
| 4.3 | Verify analyze completes | No S1 incidents |
| 4.4 | Review ADI metrics | Within thresholds |

**Rollback trigger:** Any S1 incident or persistent analyze failure → `ADI_PLATFORM_ENABLED=false`.

---

## 9. Phase 5 — Incremental provider enablement

**Goal:** Add remaining providers one at a time in production.

| Order (suggested) | Provider | Rationale |
|-----------------|----------|-----------|
| 1 | news | Lowest execution impact |
| 2 | consensus | Projection-adjacent |
| 3 | dfs_content | Content signals |
| 4 | social | Sentiment |
| 5 | sportsbook | Market signals |
| 6 | betting | Higher sensitivity |
| 7 | historical_learning | Learning-adjacent |

**Per provider:** 24–48h observation before next enable.

---

## 10. Phase 6 — Full production enablement

**Goal:** All providers enabled; learning agent decision.

| Step | Action | Success criteria |
|------|--------|------------------|
| 6.1 | All providers enabled | Fetch metrics healthy |
| 6.2 | Evaluate `ADI_LEARNING_ENABLED` | Operator decision |
| 6.3 | 7-day stability window | No S1/S2 incidents |
| 6.4 | Publish Production Ready certification | Sign-off document |

---

## 11. Success criteria (Production Ready — ADI)

| Criterion | Threshold |
|-----------|-----------|
| Live providers | All 7 validated OR documented exceptions |
| Analyze success rate | ≥ 99% over 7 days |
| Fusion p95 | ≤ 30 s |
| Provider degrade | Analysis completes (partial OK) |
| Rollback tested | ADI disable verified < 5 min |
| Incident runbook | Exercised in staging |
| Operator sign-off | Engineering + Operations |

---

## 12. Rollback criteria

Immediate ADI disable (`ADI_PLATFORM_ENABLED=false`) if:

- Analyze Slate failure rate exceeds baseline + 5%
- S1 incident attributed to ADI
- Fusion p95 exceeds budget by > 20% sustained
- Data integrity concern
- Provider credential compromise

Full application rollback to `v2.1.0` if:

- V2.1 regression detected with ADI off
- Unrecoverable schema or code issue

---

## 13. Exit gates summary

| Gate | Phase | Required sign-off |
|------|-------|-------------------|
| G0 | Phase 0 complete | Engineering |
| G1 | Credentials verified | Operations |
| G2 | Staging live providers | Engineering |
| G3 | Shadow mode stable | Engineering + Operations |
| G4 | Canary 24h clean | Operations |
| G5 | All providers enabled | Engineering + Operations |
| G6 | Production Ready (ADI) | Executive / Program owner |

---

## 14. Smoke testing matrix

| Mode | Command | When |
|------|---------|------|
| Readonly | `SMOKE_MODE=readonly npm run deploy:smoke` | Every production deploy |
| Full | `npm run deploy:smoke` | Staging ADI validation |
| Startup | `npm run certify:startup` | Pre/post deploy |
| E2E | `CI=1 CONNECTOR_MODE=seed npm run certify:e2e` | Pre-canary (staging) |

---

## 15. Documentation deliverables (on Production Ready)

When G6 met, publish:

- Live Certification Report
- Updated `V2_2_RELEASE_NOTES.md` classification → Production Ready (ADI)
- Operator ADI enablement record (dates, providers, flags)
- Performance baseline (live p95 metrics)

---

## Exactly one next action

**Phase 0:** Deploy `v2.2.0` to staging with `ADI_PLATFORM_ENABLED=false` and confirm V2.1-equivalent behavior before any live provider work.
