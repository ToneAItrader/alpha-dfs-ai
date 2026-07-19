# ADR-015 — V2.1-6 Weather API Connector

**Status:** Accepted (Planning — Phase 2A revised) · **Implemented:** 2026-07-19  
**Date:** 2026-07-19 · **Revised:** 2026-07-19 (Phase 2A — HP-4)  
**Capability ID:** V2.1-6  
**Phase:** V2.1 — Intelligence depth  
**Related:** [CONNECTOR_ADR_001.md](./CONNECTOR_ADR_001.md) · [PROVIDER_COMPATIBILITY_MATRIX.md](./PROVIDER_COMPATIBILITY_MATRIX.md)

---

## Context

Weather conditions affect outdoor NFL games and slate volatility assessment. V2.1-6 adds an optional P2 connector — lowest priority among V2.1 data providers.

---

## Decision

Add **`weather-feed`** connector implementing `DataConnector`.

### Provider specification

| Attribute | Value |
|-----------|-------|
| Source ID | `weather-feed` |
| Priority | **P2** — optional enrichment per [CONNECTOR_ADR_001.md](./CONNECTOR_ADR_001.md) §P2 tier |
| Data | Temperature, wind, precipitation probability per outdoor game |
| Auth | API key or file export (`WEATHER_EXPORT_PATH`) |
| Normalized target | Game-level weather domain on slate metadata |
| Rate limit | 15 req/min |

### P2 behavior (HP-4)

Per CONNECTOR_ADR_001 P2 tier:

- Refresh and analyze **proceed normally** when weather data absent
- P2 failure does **not** set `degraded: true` unless operator enables `CONNECTOR_P2_VISIBILITY=1`
- No retry beyond single attempt (optional enrichment)

### Integration points

- Same connector registry pattern as ADR-013/014
- Slate Intelligence engine uses weather factor count
- Seed fixture for dev/E2E

### DTO impact

Additive optional game fields:

```text
temperature?: number
windMph?: number
precipitationProbability?: number
isDome?: boolean
```

### Constraints

- Optional capability — may defer within V2.1 if provider licensing unavailable
- No UI panel changes beyond existing Slate Intelligence factor display

---

## Consequences

### Positive

- Completes external intelligence layer for NFL Classic slates

### Negative

- Lower ROI vs injury/odds — correctly sequenced last among providers

---

## Implementation gate requirements

- [x] V2.1 implementation gate open
- [x] Connector tests + seed fixture
- [x] May ship after V2.1-4/5 without blocking phase completion

---

## V1 impact

**None until merge.**
