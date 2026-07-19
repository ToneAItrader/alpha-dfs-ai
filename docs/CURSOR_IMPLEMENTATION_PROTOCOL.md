# Cursor Implementation Protocol (Version 1.0)

**Status:** ACTIVE  
**Version:** 1.0  
**Date:** 2026-07-18  
**Parent:** [PROJECT_CHARTER.md](../PROJECT_CHARTER.md)

> **Standard operating procedure** for every implementation task in Alpha DFS AI — frontend, backend, agents, engines, and future modules.  
> One approved task at a time. Stop after each task and wait for approval.

---

## Governance

Architecture Freeze v1.0 is in effect.

Version 1 scope is locked:

```text
Platform = DraftKings
Sport = NFL
Contest = Classic Salary Cap
```

Cursor shall implement **one approved task at a time**.

No new functionality may be introduced without an approved charter amendment. Deferred scope → [BACKLOG.md](./BACKLOG.md).

---

## Implementation workflow

Every implementation task follows the same lifecycle:

```text
Architecture (if approved change)
        ↓
Implementation
        ↓
Testing
        ↓
Independent Review
        ↓
Documentation
        ↓
Approval
        ↓
Next Task
```

Task-specific directives (e.g. [TASK_10_FRONTEND_DIRECTIVE.md](./TASK_10_FRONTEND_DIRECTIVE.md)) define **what** to build. This protocol defines **how** to execute each task.

---

## Phase 1 — Implementation

**Model:** **Composer 2.5** — TypeScript, React, Next.js, backend wiring, feature implementation

**Objective:** Implement only the approved task.

**Requirements:**

- Stay within the architecture
- Do not refactor unrelated code
- Do not implement future tasks
- Do not introduce new abstractions
- Preserve the DraftKings NFL Classic scope

---

## Phase 2 — Testing

**Model:** **Composer 2.5**

**Objective:** Validate the completed implementation.

**Include:**

- Unit tests
- Integration tests (where applicable)
- Regression tests
- Error handling
- Loading states
- Edge cases

---

## Phase 3 — Independent Review

**Model:** **Claude Opus 4.1** — independent architectural and code quality review

**Objective:** Review the completed implementation independently.

**Evaluate:**

- Code quality
- Architecture compliance
- Maintainability
- UX consistency (for frontend)
- Potential bugs
- Technical debt
- Opportunities to simplify

**Rule:** The reviewer recommends changes but **does not implement them automatically**.

---

## Phase 4 — Documentation

**Model:** **GPT-5.5** — technical writing and documentation consistency

**Objective:** Update project documentation.

**Include:**

- README
- Architecture documentation
- Component or API documentation
- Task status
- Implementation summary
- Known limitations

---

## Phase 5 — Approval

**Objective:** Confirm the task is complete before starting the next one.

**Checklist:**

- [ ] Requirements satisfied
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Review completed
- [ ] No scope changes
- [ ] No architecture violations

**Only after approval** should the next task begin.

---

## Standard Cursor prompt

Use this template for every task:

```text
Execute Task <TASK_ID> only.

Follow the approved architecture.

Do not implement future tasks.

Do not add features outside the approved scope.

Deliver:

1. Implementation Summary
2. Files Created
3. Files Modified
4. Tests Added
5. Documentation Updated
6. Outstanding Risks
7. Architectural Concerns

When complete, stop and wait for approval before proceeding.
```

---

## Model assignments

| Phase | Model | Why |
|-------|-------|-----|
| Architecture updates (when approved) | **GPT-5.5** | Systems thinking and design |
| Feature implementation | **Composer 2.5** | TypeScript, React, Next.js, backend development |
| API integration | **Composer 2.5** | Service integration and state management |
| Database implementation | **Composer 2.5** | Prisma and data layer implementation |
| Testing | **Composer 2.5** | Test generation and validation |
| Independent code review | **Claude Opus 4.1** | Objective review and maintainability assessment |
| Documentation | **GPT-5.5** | Clear, consistent technical documentation |

---

## Task execution order

For every implementation task:

```text
GPT-5.5 (if architecture change is approved)
            ↓
Composer 2.5 (implementation)
            ↓
Composer 2.5 (testing)
            ↓
Claude Opus 4.1 (independent review)
            ↓
GPT-5.5 (documentation)
            ↓
Approval
            ↓
Next Task
```

---

## Mapping to charter tasks

| Charter task | Protocol application |
|--------------|---------------------|
| Task 10 (Frontend) | Each subtask 10.1–10.11: Phases 1–2; 10.12: Phase 3; 10.13: Phase 4 |
| Task 11 (Backend) | One service/module per approved subtask; full protocol per subtask |
| Task 12 (Testing) | Platform-wide validation; follows Phases 2–5 |
| Task 13 (Code Review) | Phase 3 at platform level |
| Task 14 (Documentation) | Phase 4 at platform level |
| Task 15 (Final Validation) | Phase 5 at platform level |

When a task directive defines its own subtask sequence, execute subtasks **one at a time** using this protocol.

---

## Completion report format

Every completed task shall deliver:

1. **Implementation Summary** — what was built and why  
2. **Files Created** — new paths  
3. **Files Modified** — changed paths  
4. **Tests Added** — coverage summary  
5. **Documentation Updated** — doc paths  
6. **Outstanding Risks** — known gaps or follow-ups  
7. **Architectural Concerns** — any freeze or scope questions  

Then **stop** and wait for approval.

---

## Related documents

- [PROJECT_CHARTER.md](../PROJECT_CHARTER.md)
- [TASK_10_FRONTEND_DIRECTIVE.md](./TASK_10_FRONTEND_DIRECTIVE.md)
- [AMENDMENT_001_SCOPE_LOCK.md](./architecture/AMENDMENT_001_SCOPE_LOCK.md)
- [BACKLOG.md](./BACKLOG.md)
- [PHASE_1_5_ENHANCEMENT_CHARTER.md](./PHASE_1_5_ENHANCEMENT_CHARTER.md)
