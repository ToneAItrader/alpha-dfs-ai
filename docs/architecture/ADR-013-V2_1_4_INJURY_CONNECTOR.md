# ADR-013 — V2.1-4 NFL Injury API Connector

**Status:** Accepted (Planning — no implementation) · **Implemented:** 2026-07-19  
**Date:** 2026-07-19  
**Capability ID:** V2.1-4  
**Phase:** V2.1 — Intelligence depth  
**Related:** [CONNECTOR_ADR_001.md](./CONNECTOR_ADR_001.md) · [PROVIDER_COMPATIBILITY_MATRIX.md](./PROVIDER_COMPATIBILITY_MATRIX.md)

---

## Context

V1 connectors cover DraftKings slate (P0) and projection feed (P1). Injury status, practice reports, and game-time decisions affect evidence scoring and slate intelligence but require a **licensed NFL injury data source**.

PROVIDER_COMPATIBILITY_MATRIX lists injury API as a future provider. V2.1-4 implements the connector pattern without changing Amendment 001 scope.

---

## Decision

Add **`nfl-injury-feed`** connector implementing `DataConnector` per CONNECTOR_ADR_001.

### Provider specification

| Attribute | Value |
|-----------|-------|
| Source ID | `nfl-injury-feed` |
| Priority | P1 (degrade — refresh continues without injury data) |
| Data | Injury designation, practice status, game status per player |
| Auth | API key (`INJURY_API_URL` + `INJURY_API_KEY`) or file export (`INJURY_EXPORT_PATH`) |
| Normalized target | Partial player merge fields on `SlateConnectorPayload.players[]` |
| Rate limit | 30 req/min (configurable bucket) |

### Integration points

- Register in `create-connector-registry.ts` for `live` and `seed` modes
- Seed fixture: `packages/connectors/fixtures/injury-export.json`
- Merge during refresh — same pattern as projection feed
- Evidence panel and Slate Intelligence engine consume merged fields via existing pipeline

### DTO impact

Additive optional player fields:

```text
injuryStatus?: string
practiceStatus?: string
gameStatus?: string
```

### Constraints

- No UI changes beyond mapper display of existing Evidence panel fields
- Licensed feed required for production live mode — document in deployment guide
- File export fallback for dev/test/certification

---

## Consequences

### Positive

- Enriches evidence and slate intelligence with real injury context
- Independent ship — does not block other V2.1 capabilities

### Negative

- Licensed data cost and ToS compliance operator responsibility

---

## Implementation gate requirements

- [x] V2.1 implementation gate open
- [x] Connector unit tests (success, degrade, file fallback)
- [x] PROVIDER_COMPATIBILITY_MATRIX updated
- [x] `.env.example` documented

---

## V1 impact

**None until merge.** V1 refresh unchanged without connector registered on maintenance line.
