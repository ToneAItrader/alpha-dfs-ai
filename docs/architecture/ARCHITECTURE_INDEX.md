# Alpha DFS AI — Documentation Index

**Updated:** 2026-07-19  
**Workflow:** [DUAL_TRACK_WORKFLOW.md](../operations/DUAL_TRACK_WORKFLOW.md) — dual-track (V1 maintenance + V2 planning)

---

## Dual-track workflow

Development splits after RC validation. Linear Task 11.x numbering is retired for new work assignment.

| Workstream | Focus | Governance | Implementation |
|------------|-------|------------|----------------|
| **A — V1 Maintenance** | Production support, bug fixes, connector reliability | [V1_MAINTENANCE_GOVERNANCE.md](../operations/V1_MAINTENANCE_GOVERNANCE.md) | Approved changes only |
| **B — V2 Program** | Advanced DFS capabilities, architecture, ADRs | [V2_PLANNING_GOVERNANCE.md](./V2_PLANNING_GOVERNANCE.md) | **V2.1 authorized** — branch `v2/v2.1-intelligence` |

Models: [MODEL_ASSIGNMENT.md](../operations/MODEL_ASSIGNMENT.md)

---

## Scope and governance

| Doc | Purpose |
|-----|---------|
| [DUAL_TRACK_WORKFLOW.md](../operations/DUAL_TRACK_WORKFLOW.md) | **Dual-track index + Cursor agent prompt** |
| [V1_MAINTENANCE_GOVERNANCE.md](../operations/V1_MAINTENANCE_GOVERNANCE.md) | **V1 change control — feature frozen** |
| [V2_PLANNING_GOVERNANCE.md](./V2_PLANNING_GOVERNANCE.md) | **V2 planning rules — V2.1 complete** |
| [ADR-000-REPOSITORY_GOVERNANCE.md](./ADR-000-REPOSITORY_GOVERNANCE.md) | **Repository governance — branch, merge, release** |
| [MODEL_ASSIGNMENT.md](../operations/MODEL_ASSIGNMENT.md) | Cursor model assignments |
| [AMENDMENT_001_SCOPE_LOCK.md](./AMENDMENT_001_SCOPE_LOCK.md) | **v1 scope lock** — DraftKings · NFL · Classic |
| [RC_VALIDATION_REPORT.md](../operations/RC_VALIDATION_REPORT.md) | **Release candidate validation** |
| [BACKLOG.md](../BACKLOG.md) | Deferred v2 scope |
| [CURSOR_IMPLEMENTATION_PROTOCOL.md](../CURSOR_IMPLEMENTATION_PROTOCOL.md) | Implementation SOP (historical tasks) |
| [PROJECT_CHARTER.md](../../PROJECT_CHARTER.md) | Phase 1 build instructions |

---

## Version 2 planning (Workstream B)

| Doc | Purpose |
|-----|---------|
| [TASK_3_PLANNING_PACKAGE.md](./TASK_3_PLANNING_PACKAGE.md) | **Task 3 — planning package complete** |
| [V2_IMPLEMENTATION_GATE.md](./V2_IMPLEMENTATION_GATE.md) | **Implementation gate — OPEN (V2.0 complete)** |
| [V2_1_IMPLEMENTATION_GATE.md](./V2_1_IMPLEMENTATION_GATE.md) | **V2.1 gate — CLOSED (V2-CC-002)** |
| [V2_1_PLANNING_PACKAGE.md](./V2_1_PLANNING_PACKAGE.md) | V2.1 planning package — complete |
| [V2_FOUNDATION_COMPLETION_RECORD.md](./V2_FOUNDATION_COMPLETION_RECORD.md) | **V2.0 Foundation completion record** |
| [reviews/V2_ADR_PACKAGE_REVIEW.md](../reviews/V2_ADR_PACKAGE_REVIEW.md) | V2.0 ADR package review |
| [reviews/V2_1_ADR_PACKAGE_REVIEW.md](../reviews/V2_1_ADR_PACKAGE_REVIEW.md) | V2.1 ADR review — Approved (Phase 2A complete) |
| [V2_PROGRAM.md](./V2_PROGRAM.md) | V2 program overview |
| [V2_ROADMAP.md](./V2_ROADMAP.md) | Phased roadmap (V2.0 → V2.4) |
| [V2_CAPABILITY_BREAKDOWN.md](./V2_CAPABILITY_BREAKDOWN.md) | Capability inventory + backlog mapping |
| [V2_DEPENDENCY_MAP.md](./V2_DEPENDENCY_MAP.md) | Phase and capability dependencies |
| [V2_MIGRATION_STRATEGY.md](./V2_MIGRATION_STRATEGY.md) | V1 → V2 migration |
| [V2_RISK_ASSESSMENT.md](./V2_RISK_ASSESSMENT.md) | Risk register |
| [V2_ARCHITECTURE_OVERVIEW.md](./V2_ARCHITECTURE_OVERVIEW.md) | Architecture overview |
| [reviews/V2_ARCHITECTURE_REVIEW.md](../reviews/V2_ARCHITECTURE_REVIEW.md) | Task 2 — planning review |

### ADR index

| ADR | Capability |
|-----|------------|
| [ADR-003](./ADR-003-V2_PLANNING_KICKOFF.md) | V2 planning kickoff |
| [ADR-004](./ADR-004-V2_0_1_TELEMETRY_EXPORT.md) | V2.0-1 Telemetry export |
| [ADR-005](./ADR-005-V2_0_2_READONLY_SMOKE.md) | V2.0-2 Read-only smoke |
| [ADR-006](./ADR-006-V2_0_3_BACKUP_RETENTION.md) | V2.0-3 Backup retention |
| [ADR-007](./ADR-007-V2_0_4_DEPLOYMENT_SUPERVISOR.md) | V2.0-4 Supervisor guide → [DEPLOYMENT_SUPERVISOR_GUIDE.md](../operations/DEPLOYMENT_SUPERVISOR_GUIDE.md) |
| [ADR-008](./ADR-008-V2_0_5_BROWSER_E2E.md) | V2.0-5 Browser E2E |
| [ADR-009](./ADR-009-PRISMA_MIGRATION_POLICY.md) | Prisma migration policy |
| [ADR-010](./ADR-010-V2_1_1_SLATE_INTELLIGENCE.md) | V2.1-1 Slate Intelligence live |
| [ADR-011](./ADR-011-V2_1_2_HEADER_PIPELINE_STATUS.md) | V2.1-2 Header pipeline status |
| [ADR-012](./ADR-012-V2_1_3_GPP_FIELD_SIMULATION.md) | V2.1-3 GPP field simulation |
| [ADR-013](./ADR-013-V2_1_4_INJURY_CONNECTOR.md) | V2.1-4 Injury connector |
| [ADR-014](./ADR-014-V2_1_5_VEGAS_ODDS_CONNECTOR.md) | V2.1-5 Vegas odds connector |
| [ADR-015](./ADR-015-V2_1_6_WEATHER_CONNECTOR.md) | V2.1-6 Weather connector |
| [ADR-016](./ADR-016-V2_1_7_PROJECTION_CALIBRATION.md) | V2.1-7 Projection calibration |
| [ADR-017](./ADR-017-V2_1_8_MULTI_LINEUP_EXPOSURE.md) | V2.1-8 Multi-lineup exposure |
| [ADR-018](./ADR-018-V2_1_9_OWNERSHIP_PREDICTION.md) | V2.1-9 Ownership prediction |

---

## Version 1 operations (Workstream A)

| Doc | Purpose |
|-----|---------|
| [PRODUCTION_OPERATIONS_GUIDE.md](../operations/PRODUCTION_OPERATIONS_GUIDE.md) | Production operator reference |
| [DEPLOYMENT_GUIDE.md](../operations/DEPLOYMENT_GUIDE.md) | Deployment guide |
| [DEPLOYMENT_SUPERVISOR_GUIDE.md](../operations/DEPLOYMENT_SUPERVISOR_GUIDE.md) | systemd / pm2 / Docker Compose (V2.0-4) |
| [ROLLBACK_GUIDE.md](../operations/ROLLBACK_GUIDE.md) | Rollback guide |
| [RELEASE_CERTIFICATION_SPEC.md](../operations/RELEASE_CERTIFICATION_SPEC.md) | Release acceptance criteria |
| [RELEASE_CHECKLIST.md](../operations/RELEASE_CHECKLIST.md) | Production cutover checklist |
| [RELEASE_NOTES_V1.md](../operations/RELEASE_NOTES_V1.md) | V1 release notes |

---

## Architecture (V1 baseline)

| Doc | Purpose |
|-----|---------|
| [ARCHITECTURE.md](../ARCHITECTURE.md) | System architecture |
| [DATA_MODEL.md](../DATA_MODEL.md) | Data model |
| [CONNECTOR_ADR_001.md](./CONNECTOR_ADR_001.md) | Connector architecture |
| [OBSERVABILITY_ADR_002.md](./OBSERVABILITY_ADR_002.md) | Observability |
| [TASK_11_7_REMEDIATION.md](./TASK_11_7_REMEDIATION.md) | Architecture review remediation |

---

## Engine documentation

| Doc | Purpose |
|-----|---------|
| [SCORING_ENGINE.md](../SCORING_ENGINE.md) | Scoring engine |
| [EVIDENCE_ENGINE.md](../EVIDENCE_ENGINE.md) | Evidence engine |
| [LINEUP_OPTIMIZER.md](../LINEUP_OPTIMIZER.md) | Lineup optimizer |
| [PREDICTION_CONFIDENCE_ENGINE.md](../PREDICTION_CONFIDENCE_ENGINE.md) | Prediction confidence |
| [PORTFOLIO_SIMULATION_ENGINE.md](../PORTFOLIO_SIMULATION_ENGINE.md) | Portfolio simulation |
| [SLATE_INTELLIGENCE.md](./SLATE_INTELLIGENCE.md) | Slate intelligence |
| [PORTFOLIO_INTELLIGENCE_ENGINE.md](./PORTFOLIO_INTELLIGENCE_ENGINE.md) | Portfolio intelligence |
| [EXTERNAL_INTELLIGENCE_LAYER.md](./EXTERNAL_INTELLIGENCE_LAYER.md) | External intelligence layer |
| [DATA_SOURCE_CATALOG.md](../data-sources/DATA_SOURCE_CATALOG.md) | Data sources |

---

## Enhanced pipeline

```text
Slate Intelligence → Agents → Evidence → Scoring → PCE → PIE → Simulation → Reports
```

---

## Gate

**V1 RC validated** — [RC_VALIDATION_REPORT.md](../operations/RC_VALIDATION_REPORT.md)  
**Planning complete** — [TASK_3_PLANNING_PACKAGE.md](./TASK_3_PLANNING_PACKAGE.md)  
**Implementation gate:** ✅ **OPEN** (V2.0 Foundation complete) — [V2_IMPLEMENTATION_GATE.md](./V2_IMPLEMENTATION_GATE.md)  
**Completion record:** [V2_FOUNDATION_COMPLETION_RECORD.md](./V2_FOUNDATION_COMPLETION_RECORD.md)  
**V2.1 gate:** ✅ **OPEN** — [V2_1_IMPLEMENTATION_GATE.md](./V2_1_IMPLEMENTATION_GATE.md) (V2-CC-002)  
**Next:** V2.1-2 implementation on `v2/v2.1-intelligence`
