# Alpha DFS AI — Web Application

DraftKings NFL Classic analysis UI (`apps/web`).

**Release readiness:** [docs/FRONTEND_RELEASE_READINESS.md](../../docs/FRONTEND_RELEASE_READINESS.md)

---

## Architecture (Task 10.10)

```text
Backend DTO → Mapper → ViewModel → Presentation Components
```

| Layer | Path |
|-------|------|
| DTOs | `src/types/dto/analysis-responses.dto.ts` |
| Mappers | `src/lib/mappers/` |
| ViewModels | `src/types/*-view-model.ts` |
| Provider | `src/providers/analysis-provider.ts` |
| Stub backend | `src/lib/backend/stub-analysis-service.ts` |
| API routes | `src/app/api/pipeline/` |

Presentation components **must not** import DTOs or backend modules (enforced by `presentation-boundary.test.ts`).

---

## Task 10 status

| Task | Status |
|------|--------|
| 10.1 Application Shell | **Complete** |
| 10.2 Dashboard | **Complete** |
| 10.3 Slate Intelligence Panel | **Complete** — V2.1-1 live (sections 1–3, 8); V2.1-4 live (section 4) |
| 10.4 Portfolio Readiness | **Complete** |
| 10.5 Recommended Portfolio | **Complete** |
| 10.6 Player Evidence Viewer | **Complete** |
| 10.7 Portfolio Health Dashboard | **Complete** |
| 10.8 Simulation Results | **Complete** |
| 10.9 Confidence Indicators | **Complete** |
| 10.10 UI Integration | **Complete** |
| 10.11 Frontend Testing & Validation | **Certified** |
| 10.12 UX & Architecture Review | **Complete** — [review](../../docs/reviews/TASK_10_12_UX_ARCHITECTURE_REVIEW.md) |
| 10.13 Documentation & Release Readiness | **Complete** |

---

## Run locally

```bash
npm install
npm run dev --workspace=@alpha-dfs/web
```

Open [http://localhost:3001/dashboard](http://localhost:3001/dashboard)

---

## Test & build

```bash
npm run test --workspace=@alpha-dfs/web    # 163 tests
npm run build --workspace=@alpha-dfs/web
```

---

## Pages

| Route | Provider-backed | ViewModel |
|-------|-----------------|-----------|
| `/dashboard` | Yes | Dashboard display data |
| `/slate-intelligence` | Yes | `SlateIntelligenceViewModel` |
| `/portfolio-readiness` | Yes | `PortfolioReadinessViewModel` |
| `/player-evidence` | Yes | `PlayerEvidenceViewModel` |
| `/recommended-portfolio` | Yes | `RecommendedPortfolioViewModel` |
| `/portfolio-health` | Yes | `PortfolioHealthViewModel` |
| `/simulation` | Yes | `SimulationResultsViewModel` |
| `/confidence` | Yes | `ConfidenceIndicatorsViewModel` |
| `/settings` | No (shell) | — |

---

## Testing (Task 10.11)

| Area | Test location |
|------|---------------|
| Mapper edge cases | `src/lib/mappers/mapper-edge-cases.test.ts` |
| API routes | `src/app/api/pipeline/pipeline.routes.test.ts` |
| Analysis provider | `src/providers/analysis-provider.test.ts` |
| Integrated panels | `src/test/integration/integrated-panels.validation.test.tsx` |
| Presentation boundary | `src/test/architecture/presentation-boundary.test.ts` |
| Accessibility | `src/test/validation/accessibility.validation.test.tsx` |
| Responsive smoke | `src/test/validation/responsive.validation.test.tsx` |
| DTO fixtures | `src/test/fixtures/analysis-dto-fixtures.ts` |

---

## ViewModels & panels

| Feature | ViewModel | Panel |
|---------|-----------|-------|
| Slate Intelligence | `slate-intelligence-view-model.ts` | `SlateIntelligencePanel` (sections 1–4, 8 live) |
| Portfolio Readiness | `portfolio-readiness-view-model.ts` | `PortfolioReadinessPanel` |
| Player Evidence | `player-evidence-view-model.ts` | `PlayerEvidencePanel` |
| Recommended Portfolio | `recommended-portfolio-view-model.ts` | `RecommendedPortfolioPanel` |
| Portfolio Health | `portfolio-health-view-model.ts` | `PortfolioHealthPanel` |
| Simulation Results | `simulation-results-view-model.ts` | `SimulationResultsPanel` |
| Confidence Indicators | `confidence-indicators-view-model.ts` | `ConfidenceIndicatorsPanel` |

Placeholder configs in `src/config/*-placeholders.ts` — used as panel test defaults and fallbacks.

---

## Shared UI

| Component | Path |
|-----------|------|
| Layout | `src/components/layout/` |
| `Card`, `SummaryCard`, `DetailGrid`, `SectionHeading` | `src/components/ui/` |
| `ConfidenceBadge`, `ConfidenceCard`, `ConfidenceSummary`, `ConfidenceMetric` | `src/components/ui/confidence/` |
| `LineupCard`, `PlayerEvidenceCard`, `Checklist` | `src/components/ui/` |
| Display formatters (no business logic) | `src/lib/format-display.ts` |

---

## Deferred (approved)

See [FRONTEND_RELEASE_READINESS.md § Deferred Work](../../docs/FRONTEND_RELEASE_READINESS.md#4-deferred-work).

Key items before Task 11: ~~Slate Intelligence integration~~ ✅ V2.1-1, Header status wiring ✅ V2.1-2, idle empty states.

---

## Related docs

- [FRONTEND_RELEASE_READINESS.md](../../docs/FRONTEND_RELEASE_READINESS.md)
- [TASK_10_FRONTEND_DIRECTIVE.md](../../docs/TASK_10_FRONTEND_DIRECTIVE.md)
- [PROJECT_CHARTER.md](../../PROJECT_CHARTER.md)
