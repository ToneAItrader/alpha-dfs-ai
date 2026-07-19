# Alpha DFS AI — Data Model

**Status:** Phase 1 — Architecture contract only  
**Version:** 1.0  
**Date:** 2026-07-18  
**Parent:** [ARCHITECTURE.md](./ARCHITECTURE.md)

> Canonical schemas for all Alpha DFS AI entities.  
> No database migrations or Prisma models until Phase 6 authorization.

---

## Design principles

1. **Every record traces to evidence** — source, capturedAt, reliability required on derived artifacts.
2. **Slates are the temporal anchor** — projections, salaries, ownership, and lineups are slate-scoped.
3. **Players are stable; roles change** — one Player entity; slate-specific context in junction records.
4. **Scores are versioned** — formula changes create new score versions, not silent overwrites.
5. **Learning is append-only** — refinement history preserved for audit.
6. **v1 constants only** — `sport` = `nfl`, `platform` = `draftkings`, `slateType` = `classic`. No extensibility framework ([Amendment 001](./architecture/AMENDMENT_001_SCOPE_LOCK.md)).

---

## Common fields

All derived artifacts (scores, projections, lineups) include:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Stable identifier |
| `version` | SemVer | Yes | Artifact version |
| `evidenceSource` | Object | Yes | `{ type, ref, capturedAt, reliability }` |
| `confidence` | Float 0–1 | Yes | Composite confidence |
| `validationStatus` | Enum | Yes | `draft` · `validated` · `superseded` |
| `createdAt` | ISO8601 | Yes | Creation timestamp |
| `updatedAt` | ISO8601 | Yes | Last update |

---

## Entity relationship diagram

```text
┌──────────┐       ┌──────────────┐       ┌──────────┐
│  Player  │──────►│ CollegeStats │       │ DraftClass│
└────┬─────┘       └──────────────┘       └────┬─────┘
     │                                          │
     ├──────────────────► NFLStats ◄─────────────┘
     │
     ├──────────────────► GameLogs
     │
     ├──────────────────► DepthCharts
     │
     └──────────────────► SlatePlayer ──────► Slate
                              │                  │
                              ├── Salaries         ├── Contests
                              ├── Projections      ├── Weather
                              ├── Ownership        └── Results
                              ├── PlayerScores
                              └── LineupSlots ◄── Lineups

┌──────────────┐       ┌─────────────────┐
│LearningMemory│◄─────│ SlateResults    │
└──────────────┘       └─────────────────┘
```

---

## Core entities

### Player

Stable identity across seasons.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `sport` | Literal | `nfl` (v1 only) |
| `externalIds` | JSON | `{ draftKings, nfl, pfr, ... }` |
| `firstName` | String | |
| `lastName` | String | |
| `position` | Enum | `QB` · `RB` · `WR` · `TE` · `DST` · `K` |
| `teamId` | UUID → Team | Current team |
| `birthDate` | Date | Age curve input |
| `college` | String | |
| `draftYear` | Int | Nullable for undrafted |
| `draftRound` | Int | Nullable |
| `draftPick` | Int | Nullable |
| `isRookie` | Boolean | Computed per season |
| `status` | Enum | `active` · `injured` · `retired` · `inactive` |
| `createdAt` | ISO8601 | |
| `updatedAt` | ISO8601 | |

---

### Team

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `sport` | Enum | `nfl` |
| `abbreviation` | String | e.g. `KC` |
| `name` | String | |
| `conference` | String | AFC/NFC |
| `division` | String | |

---

### CollegeStats

Season-level college production.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `playerId` | UUID → Player | |
| `season` | Int | |
| `school` | String | |
| `conference` | String | |
| `gamesPlayed` | Int | |
| `stats` | JSONB | Position-specific stats |
| `advancedMetrics` | JSONB | EPA, success rate, etc. |
| `strengthOfSchedule` | Float | |
| `conferenceQuality` | Float | |
| `evidenceSource` | Object | |
| `createdAt` | ISO8601 | |

---

### NFLStats

Season-level or rolling NFL aggregates.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `playerId` | UUID → Player | |
| `season` | Int | |
| `weeks` | Int[] | Weeks included |
| `stats` | JSONB | Position-specific |
| `advancedMetrics` | JSONB | Target share, air yards, etc. |
| `snapPct` | Float | Average snap percentage |
| `evidenceSource` | Object | |
| `createdAt` | ISO8601 | |

---

### DraftClass

Draft capital and landing spot context.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `playerId` | UUID → Player | |
| `year` | Int | |
| `round` | Int | |
| `pick` | Int | Overall |
| `teamId` | UUID → Team | Drafting team |
| `draftCapitalScore` | Float | Computed |
| `landingSpotScore` | Float | Team/opportunity context |
| `combineMetrics` | JSONB | 40, vertical, bench, etc. |
| `rasScore` | Float | Relative Athletic Score |
| `evidenceSource` | Object | |
| `createdAt` | ISO8601 | |

---

### GameLog

Per-game NFL performance.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `playerId` | UUID → Player | |
| `gameId` | UUID → Game | |
| `season` | Int | |
| `week` | Int | |
| `stats` | JSONB | |
| `fantasyPoints` | Float | DraftKings scoring |
| `snapCount` | Int | |
| `snapPct` | Float | |
| `evidenceSource` | Object | |
| `createdAt` | ISO8601 | |

---

### Game

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `season` | Int | |
| `week` | Int | |
| `homeTeamId` | UUID → Team | |
| `awayTeamId` | UUID → Team | |
| `gameTime` | ISO8601 | |
| `vegasTotal` | Float | |
| `vegasSpread` | Float | |
| `impliedHomeTotal` | Float | |
| `impliedAwayTotal` | Float | |
| `isDome` | Boolean | |
| `status` | Enum | `scheduled` · `in_progress` · `final` |

---

### DepthChart

Team depth and role assignment.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `playerId` | UUID → Player | |
| `teamId` | UUID → Team | |
| `season` | Int | |
| `week` | Int | |
| `position` | String | Depth chart position |
| `depthOrder` | Int | 1 = starter |
| `role` | Enum | `starter` · `rotational` · `backup` · `inactive` |
| `evidenceSource` | Object | |
| `capturedAt` | ISO8601 | |

---

### Weather

Game-environment conditions.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `gameId` | UUID → Game | |
| `temperature` | Float | Fahrenheit |
| `windSpeed` | Float | mph |
| `precipitation` | Float | inches/hr or probability |
| `conditions` | String | `clear` · `rain` · `snow` · `dome` |
| `fantasyImpact` | Float | Computed adjustment factor |
| `evidenceSource` | Object | |
| `capturedAt` | ISO8601 | |

---

### InjuryReport

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `playerId` | UUID → Player | |
| `season` | Int | |
| `week` | Int | |
| `status` | Enum | `out` · `doubtful` · `questionable` · `probable` · `healthy` |
| `practiceParticipation` | Enum | `DNP` · `limited` · `full` |
| `description` | String | Injury description |
| `evidenceSource` | Object | |
| `capturedAt` | ISO8601 | |

---

## Slate-scoped entities

### Slate

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `sport` | Literal | `nfl` (v1 only) |
| `platform` | Literal | `draftkings` (v1 only) |
| `slateType` | Literal | `classic` (v1 only) |
| `name` | String | e.g. `Main` · `Turbo` |
| `week` | Int | NFL week |
| `season` | Int | |
| `salaryCap` | Int | Default 50000 |
| `lockTime` | ISO8601 | |
| `status` | Enum | `upcoming` · `open` · `locked` · `complete` |
| `gameIds` | UUID[] | Games on slate |
| `createdAt` | ISO8601 | |

---

### SlatePlayer

Junction: player on a specific slate with salary and eligibility.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `slateId` | UUID → Slate | |
| `playerId` | UUID → Player | |
| `salary` | Int | DraftKings salary |
| `rosterPosition` | String | `QB` · `RB` · `WR` · `TE` · `FLEX` · `DST` |
| `gameId` | UUID → Game | |
| `isActive` | Boolean | Available on slate |
| `ownershipActual` | Float | Post-slate actual ownership |
| `fantasyPointsActual` | Float | Post-slate actual points |

---

### PlayerScore

Multi-dimensional score profile for a player on a slate (v2 framework).

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `slatePlayerId` | UUID → SlatePlayer | |
| `formulaVersion` | SemVer | Scoring engine version |
| `statisticalProjectionScore` | Float | 0–100 — **primary foundation** |
| `expertConsensusScore` | Float | 0–100 (EIL) |
| `communitySentimentScore` | Float | 0–100 (EIL) |
| `marketConfidenceScore` | Float | 0–100 (EIL) |
| `rookieOpportunityScore` | Float | 0–100 (rookies; nullable) |
| `ownershipScore` | Float | 0–100 |
| `leverageScore` | Float | 0–100 |
| `riskScore` | Float | 0–100 |
| `confidenceScore` | Float | 0–1 |
| `overallDfsRating` | Float | Composite 0–100 |
| `topContributors` | JSONB | Ranked evidence breakdown for UI |
| `optimizerRationale` | Text | Why optimizer selected this player |
| `lifecycleInputs` | JSONB | College/rookie/veteran/opportunity sub-scores (inputs) |
| `evidenceBundleId` | UUID → EvidenceBundle | |
| `createdAt` | ISO8601 | |

---

### Projection

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `slatePlayerId` | UUID → SlatePlayer | |
| `modelVersion` | SemVer | |
| `projectedPoints` | Float | Mean projection |
| `ceiling` | Float | Upside (e.g. 90th pct) |
| `floor` | Float | Downside (e.g. 10th pct) |
| `ownershipProjected` | Float | 0–1 |
| `leverage` | Float | Projection percentile vs ownership |
| `confidence` | Float | 0–1 |
| `evidenceBundleId` | UUID | |
| `createdAt` | ISO8601 | |

---

### Ownership

Historical and projected ownership record.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `slatePlayerId` | UUID → SlatePlayer | |
| `projectedOwnership` | Float | 0–1 |
| `projectedOwnershipLargeField` | Float | 150-max context |
| `projectedOwnershipSmallField` | Float | SE/3-max context |
| `chalkTier` | Enum | `core` · `popular` · `contrarian` · `punt` |
| `modelVersion` | SemVer | |
| `evidenceBundleId` | UUID | |
| `createdAt` | ISO8601 | |

---

## Lineup entities

### Contest

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `slateId` | UUID → Slate | |
| `name` | String | |
| `contestType` | Enum | `cash` · `single_entry` · `three_max` · `one_fifty_max` (Classic field sizes only) |
| `entryFee` | Float | |
| `fieldSize` | Int | |
| `payoutStructure` | JSONB | |
| `strategyProfileId` | UUID → StrategyProfile | |
| `createdAt` | ISO8601 | |

---

### StrategyProfile

Contest-type strategy configuration.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `contestType` | Enum | |
| `ownershipWeight` | Float | Optimizer objective weight |
| `leverageWeight` | Float | |
| `ceilingWeight` | Float | |
| `floorWeight` | Float | |
| `correlationWeight` | Float | |
| `maxExposurePerPlayer` | Float | 0–1 |
| `stackRules` | JSONB | QB+WR, bring-back, etc. |
| `minUniquePlayers` | Int | Multi-lineup diversity |
| `version` | SemVer | |

---

### Portfolio

Generated portfolio from one analysis run (PIE output).

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `slateId` | UUID → Slate | |
| `analysisRunId` | UUID | |
| `portfolioType` | Enum | `primary` · `hail_mary` |
| `lineupIds` | UUID[] | Ordered by rank |
| `portfolioMetrics` | JSONB | Diversity, exposure, similarity (FR-19) |
| `summary` | JSONB | Portfolio Summary from Agent 17 |
| `createdAt` | ISO8601 | |

---

### Lineup

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `slateId` | UUID → Slate | |
| `contestId` | UUID → Contest | Nullable for generic |
| `portfolioId` | UUID → Portfolio | Nullable |
| `portfolioType` | Enum | `primary` · `hail_mary` |
| `rank` | Int | Rank within portfolio |
| `explainability` | JSONB | FR-18 LineupExplainability |
| `totalSalary` | Int | |
| `projectedPoints` | Float | Sum of player projections |
| `ownershipSum` | Float | Product/sum metric |
| `stacks` | JSONB | Identified stacks |
| `evidenceBundleId` | UUID | |
| `status` | Enum | `generated` · `exported` · `submitted` |
| `createdAt` | ISO8601 | |

---

### LineupSlot

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `lineupId` | UUID → Lineup | |
| `slatePlayerId` | UUID → SlatePlayer | |
| `rosterSlot` | String | `QB` · `RB1` · `RB2` · `WR1` · `WR2` · `WR3` · `TE` · `FLEX` · `DST` |
| `salary` | Int | Snapshot at generation |
| `projectedPoints` | Float | Snapshot |

---

## Results and learning

### SlateResult

Post-slate outcome record.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `slateId` | UUID → Slate | |
| `lineupId` | UUID → Lineup | Nullable |
| `contestId` | UUID → Contest | Nullable |
| `actualPoints` | Float | |
| `projectedPoints` | Float | At lock |
| `projectionError` | Float | actual − projected |
| `rank` | Int | Nullable |
| `profit` | Float | Nullable |
| `winningScore` | Float | Top score in contest |
| `optimalLineupPoints` | Float | Hindsight optimal |
| `capturedAt` | ISO8601 | |

---

### LearningMemory

Append-only learning artifact.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `slateId` | UUID → Slate | |
| `analysisType` | Enum | `projection_error` · `ownership_error` · `stack_performance` · `value_miss` |
| `findings` | JSONB | Structured analysis |
| `proposedAdjustments` | JSONB | Weight/formula changes |
| `approvalStatus` | Enum | `pending` · `approved` · `rejected` |
| `approvedBy` | String | Nullable |
| `modelVersionBefore` | SemVer | |
| `modelVersionAfter` | SemVer | Nullable |
| `createdAt` | ISO8601 | |

---

### EvidenceBundle

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `artifactType` | Enum | `player_score` · `projection` · `lineup` · `learning` |
| `artifactId` | UUID | |
| `sources` | JSONB[] | `{ type, ref, capturedAt, reliability }` |
| `contributingScores` | JSONB | Sub-score breakdown |
| `reasoningSummary` | Text | Human-readable |
| `agentTrace` | JSONB | Agent execution log |
| `createdAt` | ISO8601 | |

---

### BankrollRecord

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `date` | Date | |
| `startingBalance` | Float | |
| `endingBalance` | Float | |
| `deposits` | Float | |
| `withdrawals` | Float | |
| `entriesPlaced` | Int | |
| `entriesWon` | Int | |
| `roi` | Float | Period ROI |
| `cumulativeRoi` | Float | |
| `exposureByPlayer` | JSONB | |
| `policyViolations` | JSONB[] | |
| `createdAt` | ISO8601 | |

---

---

### SlateIntelligence

Per analysis run — Task 9.2.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `slateId` | UUID → Slate | |
| `analysisRunId` | UUID | |
| `slateGrade` | Float | 0–100 |
| `volatilityScore` | Float | 0–100 |
| `recommendedStrategy` | Enum | `balanced` · `primary_heavy` · `gpp_heavy` · `contrarian` · `stack_aggressive` |
| `confidenceRating` | Float | 0–1 |
| `assessment` | JSONB | Factor breakdown |
| `createdAt` | ISO8601 | |

---

### PredictionConfidence

Per player per run — Task 9.1 PCE.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `slatePlayerId` | UUID | |
| `analysisRunId` | UUID | |
| `confidenceScore` | Float | 0–100 |
| `predictionStability` | Float | 0–100 |
| `dataQualityScore` | Float | 0–100 |
| `varianceRating` | Enum | `low` · `medium` · `high` |
| `reliabilityGrade` | Enum | `A`–`F` |
| `createdAt` | ISO8601 | |

---

### SimulationResult

Per lineup — Task 9.5.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `lineupId` | UUID → Lineup | |
| `analysisRunId` | UUID | |
| `medianPoints` | Float | |
| `percentile90` | Float | |
| `ceiling` | Float | |
| `floor` | Float | |
| `cashRate` | Float | 0–1 |
| `tournamentUpside` | Float | 0–1 |
| `riskMetrics` | JSONB | |
| `upsideMetrics` | JSONB | |
| `stabilityMetrics` | JSONB | |
| `createdAt` | ISO8601 | |

---

### PlayerEvidenceReport

Task 9.4 — see [EVIDENCE_ENGINE.md](./EVIDENCE_ENGINE.md).

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `slatePlayerId` | UUID | |
| `analysisRunId` | UUID | |
| `report` | JSONB | Full PlayerEvidenceReport schema |
| `createdAt` | ISO8601 | |

---

## External Intelligence Layer (EIL) entities

### ExternalSource

Registered expert or community provider.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `name` | String | e.g. `FantasyPros`, `Reddit` |
| `sourceType` | Enum | `expert` · `community` |
| `connectorType` | Enum | `api` · `rss` · `export` · `manual` |
| `tosStatus` | Enum | `approved` · `pending` · `restricted` |
| `isEnabled` | Boolean | Settings whitelist |
| `reliabilityScore` | Float | 0–1 from Source Performance |
| `createdAt` | ISO8601 | |

---

### ExpertSignal

Normalized expert intelligence per player per analysis run.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `slatePlayerId` | UUID → SlatePlayer | |
| `externalSourceId` | UUID → ExternalSource | |
| `analysisRunId` | UUID | Links to pipeline run |
| `rank` | Int | Nullable |
| `projection` | Float | Nullable |
| `startSit` | Enum | `start` · `sit` · `flex` · `null` |
| `sleeperFlag` | Boolean | |
| `bustFlag` | Boolean | |
| `matchupNotes` | Text | Nullable |
| `confidence` | Float | 0–1 |
| `deltaFromPrior` | JSONB | Rank/projection change |
| `rawArtifactRef` | String | Connector snapshot |
| `capturedAt` | ISO8601 | |

---

### CommunitySignal

Summarized community intelligence per player per analysis run.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `slatePlayerId` | UUID → SlatePlayer | |
| `externalSourceId` | UUID → ExternalSource | |
| `analysisRunId` | UUID | |
| `sentimentScore` | Float | -1 to 1 normalized |
| `trending` | Enum | `up` · `down` · `neutral` |
| `discussionVolume` | Float | Relative index |
| `themes` | JSONB[] | Summarized themes |
| `contrarianFlag` | Boolean | |
| `disclaimer` | String | Always: sentiment, not fact |
| `rawArtifactRef` | String | |
| `capturedAt` | ISO8601 | |

---

### SourcePerformanceRecord

Historical accuracy tracking per source.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | |
| `externalSourceId` | UUID → ExternalSource | |
| `slateId` | UUID → Slate | |
| `signalType` | Enum | `projection` · `ranking` · `sleeper` · `sentiment` |
| `predictedValue` | Float | |
| `actualValue` | Float | |
| `error` | Float | |
| `position` | String | Nullable |
| `playerLifecycle` | Enum | `rookie` · `veteran` · `all` |
| `createdAt` | ISO8601 | |

---

## Indexes (planned)

| Table | Index | Purpose |
|-------|-------|---------|
| `SlatePlayer` | `(slateId, playerId)` | Unique per slate |
| `PlayerScore` | `(slatePlayerId, formulaVersion)` | Version lookup |
| `Projection` | `(slatePlayerId)` | Latest projection |
| `Lineup` | `(slateId, contestId)` | Contest lineups |
| `GameLog` | `(playerId, season, week)` | Trend queries |
| `ExpertSignal` | `(slatePlayerId, analysisRunId)` | Per-run expert data |
| `CommunitySignal` | `(slatePlayerId, analysisRunId)` | Per-run community data |
| `SourcePerformanceRecord` | `(externalSourceId, slateId)` | Accuracy history |

---

## Related documents

- [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) — Package and API design
- [SCORING_ENGINE.md](./SCORING_ENGINE.md) — Score field computation
- [AGENTS.md](./AGENTS.md) — Agent data contracts
- [EXTERNAL_INTELLIGENCE_LAYER.md](./architecture/EXTERNAL_INTELLIGENCE_LAYER.md) — EIL entities and architecture
