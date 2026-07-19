export type ConnectorPriority = "P0" | "P1" | "P2";

export type ConnectorContext = {
  slateId?: string;
  runId?: string;
  requestedAt: string;
};

export type SlateGamePayload = {
  home: string;
  away: string;
  spread?: number;
  total?: number;
  impliedHomeTotal?: number;
  impliedAwayTotal?: number;
  lineMovement?: number;
  temperature?: number;
  windMph?: number;
  precipitationProbability?: number;
  isDome?: boolean;
};

export type SlatePlayerPayload = {
  externalId: string;
  name: string;
  position: string;
  team: string;
  opponent: string;
  salary: number;
  projection: number;
  floor: number;
  ceiling: number;
  injuryStatus: string;
  practiceStatus?: string;
  gameStatus?: string;
  ownershipProjected: number;
  domains: {
    statistical: boolean;
    injury: boolean;
    expert: boolean;
    market: boolean;
    weather: boolean;
    community: boolean;
  };
};

export type SlateConnectorPayload = {
  slate: {
    name: string;
    week: number;
    season: number;
    sport: string;
    platform: string;
    slateType: string;
  };
  teams: ReadonlyArray<{ abbreviation: string; name: string }>;
  games: ReadonlyArray<SlateGamePayload>;
  players: SlatePlayerPayload[];
};

export type ConnectorFetchResult = {
  sourceId: string;
  priority: ConnectorPriority;
  ok: boolean;
  capturedAt: string;
  recordCount: number;
  durationMs: number;
  attempts: number;
  error?: string;
  degraded?: boolean;
  payload?: Partial<SlateConnectorPayload>;
};

/** Data connector port — fetch and normalize external source data. */
export type DataConnector = {
  sourceId: string;
  priority: ConnectorPriority;
  description: string;
  fetch(context: ConnectorContext): Promise<ConnectorFetchResult>;
};

export type ConnectorRegistry = {
  connectors: DataConnector[];
  getById(sourceId: string): DataConnector | undefined;
};

export type RetryOptions = {
  maxAttempts?: number;
  baseDelayMs?: number;
};

export const DEFAULT_RETRY: Required<RetryOptions> = {
  maxAttempts: 3,
  baseDelayMs: 250,
};
