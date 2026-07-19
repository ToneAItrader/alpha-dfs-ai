# ADR-014 — V2.1-5 Vegas Odds Connector

**Status:** Accepted (Planning — no implementation) · **Implemented:** 2026-07-19  
**Date:** 2026-07-19  
**Capability ID:** V2.1-5  
**Phase:** V2.1 — Intelligence depth  
**Related:** [CONNECTOR_ADR_001.md](./CONNECTOR_ADR_001.md) · [PROVIDER_COMPATIBILITY_MATRIX.md](./PROVIDER_COMPATIBILITY_MATRIX.md)

---

## Context

Vegas lines (spreads, totals, implied team totals) inform slate intelligence scoring environment and confidence indicators. V1 does not ingest market data. V2.1-5 adds an optional P1 connector within DK NFL Classic scope.

---

## Decision

Add **`vegas-odds-feed`** connector implementing `DataConnector`.

### Provider specification

| Attribute | Value |
|-----------|-------|
| Source ID | `vegas-odds-feed` |
| Priority | P1 (degrade) |
| Data | Spread, total, implied team totals per game |
| Auth | API key or file export (`VEGAS_ODDS_EXPORT_PATH`) |
| Normalized target | Game-level merge on slate metadata |
| Rate limit | 30 req/min |

### Integration points

- Adapter under `packages/connectors/src/adapters/`
- Normalizer → game metadata on slate payload
- Confidence panel and Slate Intelligence consume via pipeline — mapper extension only

### DTO impact

Additive optional game fields:

```text
spread?: number
total?: number
impliedHomeTotal?: number
impliedAwayTotal?: number
```

### Constraints

- No sportsbook integration or betting execution (out of product domain)
- Data for analysis only
- File export fallback required for certification

---

## Consequences

### Positive

- Improves scoring environment assessment in slate intelligence
- Ships independently of injury/weather connectors

### Negative

- Odds feed licensing and freshness operator responsibility

---

## Implementation gate requirements

- [x] V2.1 implementation gate open
- [x] Connector tests + seed fixture
- [x] PROVIDER_COMPATIBILITY_MATRIX updated

---

## V1 impact

**None until merge.**
