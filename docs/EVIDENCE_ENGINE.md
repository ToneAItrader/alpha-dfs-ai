# Alpha DFS AI — Evidence Engine

**Status:** Task 7 — Architecture complete  
**Version:** 1.0  
**Date:** 2026-07-18  
**Parent:** [PROJECT_CHARTER.md](../PROJECT_CHARTER.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)

> Assembles all intelligence into a structured Evidence Package for every player before scoring.  
> The bridge between agent outputs and the Scoring Engine — every recommendation is traceable.

---

## Objective

The Evidence Engine collects outputs from all intelligence agents and deterministic data sources, normalizes them into a **Player Evidence Package**, and assigns an **Evidence Quality Score** before the Scoring Engine runs.

No player enters scoring without a complete Evidence Package (or explicit partial flag with reduced confidence).

---

## Pipeline position

```text
Run Intelligence Agents
        ↓
   EVIDENCE ENGINE  ← this task
        ↓
   Scoring Engine
        ↓
   Portfolio Optimizer
```

The Evidence Engine is a **deterministic assembly layer** — it does not generate new intelligence; it structures, validates, and quality-scores existing agent outputs.

---

## Evidence Package structure

One package per `SlatePlayer` per analysis run:

```typescript
interface PlayerEvidencePackage {
  id: string;
  slatePlayerId: string;
  analysisRunId: string;
  playerId: string;
  capturedAt: ISO8601;

  statistical: StatisticalEvidence;
  college: CollegeEvidence | null;
  rookie: RookieEvidence | null;
  injury: InjuryEvidence;
  expert: ExpertEvidence | null;
  community: CommunityEvidence | null;
  market: MarketEvidence;
  weather: WeatherEvidence | null;

  confidence: number;           // 0–1 composite
  evidenceQualityScore: number; // 0–100
  gaps: EvidenceGap[];          // missing or stale inputs
  evidenceBundleId: string;       // persisted audit record
}
```

---

## Evidence domains

### Statistical evidence

| Field | Source |
|-------|--------|
| NFL stats, usage, snaps | Data Collection + Statistical Intelligence |
| Advanced metrics | NFL stats pipeline |
| Game logs | Database |
| Depth chart / opportunity | Depth chart ingest |
| Vegas implied totals | Betting markets |

### College evidence

| Field | Source |
|-------|--------|
| College stats, SOS, conference | College Intelligence Agent |
| Production trends | College Intelligence Agent |
| Applicability flag | Lifecycle routing (rookies, year-2) |

Null for veterans where college is not applicable.

### Rookie evidence

| Field | Source |
|-------|--------|
| Draft capital, landing spot | Rookie Intelligence Agent |
| Athletic profile | Draft/combine data |
| Opportunity trajectory | Rookie Intelligence Agent |

Null for non-rookies.

### Injury evidence

| Field | Source |
|-------|--------|
| Practice participation | Injury Intelligence Agent |
| Game status designation | Injury reports |
| Risk classification | Injury Intelligence Agent |
| Durability history | NFL stats |

### Expert evidence (EIL)

| Field | Source |
|-------|--------|
| Rankings, projections per source | Expert Intelligence Agent |
| Expert Consensus Score | Expert Intelligence Agent |
| Source agreement / disagreement | Expert Intelligence Agent |
| Projection trend | Expert Intelligence Agent |
| Source reliability weights applied | Source Performance Intelligence |

### Community evidence (EIL)

| Field | Source |
|-------|--------|
| Sentiment score, trending direction | Community Intelligence Agent |
| Theme summaries | Community Intelligence Agent |
| Discussion volume | Community Intelligence Agent |
| Contrarian flags | Community Intelligence Agent |
| Disclaimer | Always: sentiment, not verified fact |

### Market evidence

| Field | Source |
|-------|--------|
| Implied team total | Betting markets |
| Spread, game total | Market Intelligence Agent |
| Line movement | Betting markets |
| Matchup context | Matchup Intelligence Agent |
| Prop signals (if available) | Betting markets |

### Weather evidence

| Field | Source |
|-------|--------|
| Conditions, wind, precipitation | Environment ingest |
| Dome/outdoor | Stadium data |
| Fantasy impact factor | Deterministic formula |

Null for dome games with no impact.

---

## Evidence Quality Score

Deterministic 0–100 score measuring completeness and freshness of the Evidence Package.

| Factor | Weight |
|--------|--------|
| Required statistical data present | 30% |
| Data freshness (within threshold) | 20% |
| Expert source coverage | 15% |
| Injury data current | 15% |
| Market/weather data present | 10% |
| Community data present (optional boost) | 5% |
| No critical gaps | 5% |

**Thresholds:**

| Score | Classification |
|-------|----------------|
| ≥ 80 | High quality — full confidence |
| 60–79 | Acceptable — minor gaps flagged |
| 40–59 | Degraded — reduced Confidence Score |
| < 40 | Poor — player flagged; may exclude from optimizer |

---

## Confidence score

Composite 0–1 certainty derived from Evidence Quality Score and source agreement:

```text
confidence = f(evidenceQualityScore, expertAgreement, statisticalSampleSize, injuryClarity)
```

Low confidence propagates to Scoring Engine and reduces Overall DFS Rating weight.

---

## Assembly process

```text
1. COLLECT    — Read all agent outputs for slatePlayerId
2. VALIDATE   — Check required fields, freshness timestamps
3. NORMALIZE  — Unified schema, player identity confirmed
4. GAP SCAN   — Identify missing/stale evidence
5. SCORE      — Compute evidenceQualityScore and confidence
6. PERSIST    — Write EvidencePackage + EvidenceBundle
7. EMIT       — Pass to Scoring Engine
```

Runs once per player after intelligence phases complete, before scoring phase.

---

## Explainability output

Evidence Packages feed the UI Evidence Viewer and player explainability cards:

```text
Projection:           18.7 fantasy points (statistical)
Expert consensus:     Strong — 8/10 sources rank WR top 10
Community sentiment:  Positive — high volume, favorable themes
Market confidence:    High — 27.5 implied team total, soft secondary
Weather:              Clear, 8 mph wind — no adjustment
Evidence quality:     92/100 — all primary sources fresh
```

`topContributors` in Scoring Engine output references Evidence Package fields.

---

## Player Evidence Report (Task 9.4)

Structured explainable profile for every **recommended player** (in portfolio or high-rated).

| Field | Source |
|-------|--------|
| Projection | Statistical Projection Score / points |
| Confidence | PCE Confidence Score |
| Value Score | Value calculation |
| Opportunity Score | Opportunity / Rookie Opportunity |
| Matchup Score | Matchup Intelligence (Agent 18) |
| Rookie Score | Rookie Intelligence (if applicable) |
| Expert Consensus Score | EIL Agent 14 |
| Community Sentiment Score | EIL Agent 15 |
| Market Confidence Score | Scoring Engine |
| Ownership Estimate | Ownership Agent |
| Supporting rationale | Evidence bundle narrative |

**Design model:** GPT-5.5 · **UI:** Composer 2.5 (Task 10 — Player Evidence Viewer)

```typescript
interface PlayerEvidenceReport {
  slatePlayerId: string;
  projection: number;
  confidenceScore: number;
  valueScore: number;
  opportunityScore: number;
  matchupScore: number;
  rookieScore: number | null;
  expertConsensusScore: number;
  communitySentimentScore: number;
  marketConfidenceScore: number;
  ownershipEstimate: number;
  supportingRationale: string;
  evidencePackageId: string;
}
```

---

## Failure handling

| Condition | Behavior |
|-----------|----------|
| Missing salaries | Fail-closed — halt pipeline |
| Missing expert sources | Continue; flag gap; reduce expert evidence weight |
| Missing community | Continue; community evidence null |
| Stale injury data | Warn; reduce evidence quality; flag player |
| Player identity mismatch | Fail for that player; log for review |

---

## Package structure (planned)

```text
packages/evidence/
├── src/
│   ├── collect/       # Gather agent outputs
│   ├── validate/      # Freshness and completeness
│   ├── assemble/      # Build Evidence Package
│   ├── quality/       # Evidence Quality Score
│   └── index.ts
└── tests/
```

---

## Related documents

- [PHASE_1_5_ENHANCEMENT_CHARTER.md](./PHASE_1_5_ENHANCEMENT_CHARTER.md)
- [PREDICTION_CONFIDENCE_ENGINE.md](./PREDICTION_CONFIDENCE_ENGINE.md)
- [AGENTS.md](./AGENTS.md) — agent output contracts
- [DATA_MODEL.md](./DATA_MODEL.md) — EvidenceBundle entity
- [EXTERNAL_INTELLIGENCE_LAYER.md](./architecture/EXTERNAL_INTELLIGENCE_LAYER.md) — EIL evidence
