export type DraftKingsExportPlayer = {
  playerId: string;
  displayName: string;
  position: string;
  teamAbbreviation: string;
  opponentAbbreviation: string;
  salary: number;
  injuryStatus?: string;
};

export type DraftKingsExportRecord = {
  slateName: string;
  week: number;
  season: number;
  sport?: string;
  platform?: string;
  slateType?: string;
  teams: Array<{ abbreviation: string; name: string }>;
  games: Array<{ home: string; away: string }>;
  players: DraftKingsExportPlayer[];
};

export type ProjectionFeedRecord = {
  playerId: string;
  projectedPoints: number;
  floor: number;
  ceiling: number;
  ownershipProjected?: number;
};

export type ProjectionExportRecord = {
  projections: ProjectionFeedRecord[];
};

export type InjuryFeedRecord = {
  playerId: string;
  injuryStatus: string;
  practiceStatus?: string;
  gameStatus?: string;
};

export type InjuryExportRecord = {
  injuries: InjuryFeedRecord[];
};

export type VegasOddsFeedRecord = {
  home: string;
  away: string;
  spread?: number;
  total?: number;
  impliedHomeTotal?: number;
  impliedAwayTotal?: number;
  lineMovement?: number;
};

export type VegasOddsExportRecord = {
  games: VegasOddsFeedRecord[];
};

export type WeatherFeedRecord = {
  home: string;
  away: string;
  temperature?: number;
  windMph?: number;
  precipitationProbability?: number;
  isDome?: boolean;
};

export type WeatherExportRecord = {
  games: WeatherFeedRecord[];
};
