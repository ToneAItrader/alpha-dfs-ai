import { createDraftKingsLiveConnector } from "./adapters/draftkings-live-connector";
import { createInjuryLiveConnector } from "./adapters/injury-live-connector";
import { createProjectionLiveConnector } from "./adapters/projection-live-connector";
import { createVegasOddsLiveConnector } from "./adapters/vegas-odds-live-connector";
import { createWeatherLiveConnector } from "./adapters/weather-live-connector";
import {
  createDraftKingsSlateConnector,
  createInjuryFeedConnector,
  createProjectionFeedConnector,
  createVegasOddsFeedConnector,
  createWeatherFeedConnector,
} from "./adapters/seed-connectors";
import type { ConnectorRegistry, DataConnector } from "./types";

export type ConnectorRegistryMode = "live" | "seed";

function resolveConnectorMode(mode?: ConnectorRegistryMode): ConnectorRegistryMode {
  if (mode) return mode;
  return process.env.CONNECTOR_MODE === "seed" ? "seed" : "live";
}

export function createLiveConnectorRegistry(): ConnectorRegistry {
  return createConnectorRegistry([
    createDraftKingsLiveConnector(),
    createProjectionLiveConnector(),
    createInjuryLiveConnector(),
    createVegasOddsLiveConnector(),
    createWeatherLiveConnector(),
  ]);
}

export function createSeedConnectorRegistry(): ConnectorRegistry {
  return createConnectorRegistry([
    createDraftKingsSlateConnector(),
    createProjectionFeedConnector(),
    createInjuryFeedConnector(),
    createVegasOddsFeedConnector(),
    createWeatherFeedConnector(),
  ]);
}

export function createConnectorRegistry(connectors?: DataConnector[]): ConnectorRegistry {
  const list =
    connectors ??
    (resolveConnectorMode() === "seed"
      ? [
          createDraftKingsSlateConnector(),
          createProjectionFeedConnector(),
          createInjuryFeedConnector(),
          createVegasOddsFeedConnector(),
          createWeatherFeedConnector(),
        ]
      : [
          createDraftKingsLiveConnector(),
          createProjectionLiveConnector(),
          createInjuryLiveConnector(),
          createVegasOddsLiveConnector(),
          createWeatherLiveConnector(),
        ]);

  return {
    connectors: list,
    getById(sourceId: string) {
      return list.find((connector) => connector.sourceId === sourceId);
    },
  };
}

export function createConnectorRegistryForMode(
  mode: ConnectorRegistryMode = resolveConnectorMode(),
): ConnectorRegistry {
  return mode === "seed" ? createSeedConnectorRegistry() : createLiveConnectorRegistry();
}
