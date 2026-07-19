# Provider Compatibility Matrix

**Status:** Task 11.5 — Live Data Provider Integration  
**Date:** 2026-07-18  
**Parent:** [CONNECTOR_ADR_001.md](./CONNECTOR_ADR_001.md)

---

## v1 live providers

| Provider | Source ID | Priority | Data supplied | Auth method | Rate limit | Refresh cadence | Normalized target |
|----------|-----------|----------|---------------|-------------|------------|-----------------|-------------------|
| DraftKings Classic Export | `draftkings-slate` | P0 | Slate pool, salaries, positions, teams, games | File path (`DRAFTKINGS_EXPORT_PATH`) or API key (`DRAFTKINGS_API_URL` + `DRAFTKINGS_API_KEY`) | 10 req/min (API) | Per Analyze Slate | `SlateConnectorPayload` |
| Projection Feed | `projection-feed` | P1 | Projections, floor, ceiling, ownership | API key (`PROJECTION_API_URL` + `PROJECTION_API_KEY`) or file (`PROJECTION_EXPORT_PATH`) | 30 req/min (API) | Per Analyze Slate | Partial `SlateConnectorPayload.players[]` |
| NFL Injury Feed | `nfl-injury-feed` | P1 | Injury designation, practice status, game status | API key (`INJURY_API_URL` + `INJURY_API_KEY`) or file (`INJURY_EXPORT_PATH`) | 30 req/min (API) | Per Analyze Slate | Partial `SlateConnectorPayload.players[]` |
| Vegas Odds Feed | `vegas-odds-feed` | P1 | Spread, total, implied team totals, line movement | API key (`VEGAS_ODDS_API_URL` + `VEGAS_ODDS_API_KEY`) or file (`VEGAS_ODDS_EXPORT_PATH`) | 30 req/min (API) | Per Analyze Slate | Partial `SlateConnectorPayload.games[]` |
| Weather Feed | `weather-feed` | P2 | Temperature, wind, precipitation probability, dome flag | API key (`WEATHER_API_URL` + `WEATHER_API_KEY`) or file (`WEATHER_EXPORT_PATH`) | 15 req/min (API) | Per Analyze Slate | Partial `SlateConnectorPayload.games[]` |

---

## DraftKings — `draftkings-slate`

| Attribute | Detail |
|-----------|--------|
| **Supported data** | Player IDs, names, salaries, roster positions, team/opponent abbreviations, slate metadata |
| **Authentication** | File export (preferred v1) · REST API bearer token (optional) |
| **Rate limits** | File: none · API: 10 requests/minute (configurable) |
| **Refresh cadence** | On-demand per analysis run |
| **Data quality** | 100% slate pool required — P0 fail-closed if incomplete |
| **Mapping** | `DraftKingsExportRecord` → `SlateConnectorPayload` via `normalizeDraftKingsExport()` |
| **Fallback** | `CONNECTOR_MODE=seed` for dev/test without credentials |

---

## Projection Feed — `projection-feed`

| Attribute | Detail |
|-----------|--------|
| **Supported data** | Projected points, floor, ceiling, ownership % |
| **Authentication** | API key header · JSON file export |
| **Rate limits** | API: 30 requests/minute (configurable) |
| **Refresh cadence** | On-demand per analysis run |
| **Data quality** | Missing projections degrade confidence — P1 degrade mode |
| **Mapping** | `ProjectionFeedRecord[]` → player merge fields via `normalizeProjectionFeed()` |
| **Fallback** | P1 failure → refresh continues with `degraded: true` |

---

## NFL Injury Feed — `nfl-injury-feed` (V2.1-4)

| Attribute | Detail |
|-----------|--------|
| **Supported data** | Injury designation, practice status, game status |
| **Authentication** | API key header · JSON file export |
| **Rate limits** | API: 30 requests/minute (configurable) |
| **Refresh cadence** | On-demand per analysis run |
| **Data quality** | Missing injury data degrades refresh — P1 degrade mode |
| **Mapping** | `InjuryFeedRecord[]` → player merge fields via `normalizeInjuryFeed()` |
| **Fallback** | P1 failure → refresh continues with `degraded: true` |
| **Fixture** | `packages/connectors/fixtures/injury-export.json` |

---

## Vegas Odds Feed — `vegas-odds-feed` (V2.1-5)

| Attribute | Detail |
|-----------|--------|
| **Supported data** | Spread, total, implied home/away totals, line movement |
| **Authentication** | API key header · JSON file export |
| **Rate limits** | API: 30 requests/minute (configurable) |
| **Refresh cadence** | On-demand per analysis run |
| **Data quality** | Missing market data degrades refresh — P1 degrade mode |
| **Mapping** | `VegasOddsFeedRecord[]` → game merge fields via `normalizeVegasOddsFeed()` |
| **Fallback** | P1 failure → refresh continues with `degraded: true` |
| **Fixture** | `packages/connectors/fixtures/vegas-odds-export.json` |
| **Runtime cache** | Merged game market data stored in `slate-market-cache` (no schema migration) |

---

## Weather Feed — `weather-feed` (V2.1-6)

| Attribute | Detail |
|-----------|--------|
| **Supported data** | Temperature, wind speed, precipitation probability, dome flag |
| **Authentication** | API key header · JSON file export |
| **Rate limits** | API: 15 requests/minute (configurable) |
| **Refresh cadence** | On-demand per analysis run |
| **Data quality** | Optional P2 enrichment — absence does not block refresh |
| **Mapping** | `WeatherFeedRecord[]` → game merge fields via `normalizeWeatherFeed()` |
| **Fallback** | P2 failure → refresh continues; no degrade unless `CONNECTOR_P2_VISIBILITY=1` |
| **Fixture** | `packages/connectors/fixtures/weather-export.json` |
| **Retry** | Single attempt (P2 tier) |

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DRAFTKINGS_EXPORT_PATH` | P0 (file mode) | Absolute path to DK Classic JSON export |
| `DRAFTKINGS_API_URL` | P0 (API mode) | DraftKings-compatible slate API base URL |
| `DRAFTKINGS_API_KEY` | With API URL | Bearer token for slate API |
| `PROJECTION_EXPORT_PATH` | P1 (file mode) | Path to projection JSON export |
| `PROJECTION_API_URL` | P1 (API mode) | Projection API base URL |
| `PROJECTION_API_KEY` | With API URL | API key for projection feed |
| `INJURY_EXPORT_PATH` | P1 (file mode) | Path to injury JSON export |
| `INJURY_API_URL` | P1 (API mode) | NFL injury API base URL |
| `INJURY_API_KEY` | With API URL | API key for injury feed |
| `VEGAS_ODDS_EXPORT_PATH` | P1 (file mode) | Path to Vegas odds JSON export |
| `VEGAS_ODDS_API_URL` | P1 (API mode) | Vegas odds API base URL |
| `VEGAS_ODDS_API_KEY` | With API URL | API key for Vegas odds feed |
| `WEATHER_EXPORT_PATH` | P2 (file mode) | Path to weather JSON export |
| `WEATHER_API_URL` | P2 (API mode) | Weather API base URL |
| `WEATHER_API_KEY` | With API URL | API key for weather feed |
| `CONNECTOR_P2_VISIBILITY` | No | Set to `1` to mark refresh degraded on P2 failure |
| `CONNECTOR_MODE` | No | `live` (default) or `seed` for seed-backed connectors |

---

## Credential precedence

1. **DraftKings P0:** export file → API → error (fail-closed)
2. **Projection P1:** export file → API → error (degraded refresh)
3. **Injury P1:** export file → API → error (degraded refresh)
4. **Vegas P1:** export file → API → error (degraded refresh)
5. **Weather P2:** export file → API → silent skip (degrade only if `CONNECTOR_P2_VISIBILITY=1`)

---

## Future providers (V2.1+)

| Provider | Data | Notes |
|----------|------|-------|
| _None remaining in V2.1 provider layer_ | — | V2.1-7+ are engine extensions |

All future providers implement `DataConnector` and map to existing normalized models.

---

## How to add a provider (checklist)

1. Implement `DataConnector` adapter under `packages/connectors/src/adapters/`.
2. Add normalizer mapping to `SlateConnectorPayload` or partial player merge fields.
3. Register in `create-connector-registry.ts` for the appropriate mode (`live` / `seed`).
4. Add credential env vars to `.env.example` and this matrix.
5. Register a rate-limit bucket in `packages/connectors/src/http/provider-http-client.ts` (`limiterForProvider` map).
6. Confirm observability labels: `connector.fetch.*` uses `source_id`; `provider.http.*` uses `provider_id`.
7. Add fixture JSON under `packages/connectors/fixtures/` for seed-mode testing.
8. Add unit/integration tests covering success, failure, and degrade paths.
