export type OwnershipSource = "feed" | "predicted" | "blended";

export type OwnershipPlayerInput = {
  slatePlayerId: string;
  name: string;
  position: string;
  team: string;
  opponent?: string;
  salary: number;
  projection: number;
  feedOwnership?: number;
};

export type OwnershipGameContext = {
  home: string;
  away: string;
  total?: number;
};

export type OwnershipSlateContext = {
  volatilityScore?: number;
  recommendedStrategy?: string;
};

export type OwnershipPredictionInput = {
  players: OwnershipPlayerInput[];
  games?: OwnershipGameContext[];
  slate?: OwnershipSlateContext;
  seed?: number;
};

export type PlayerOwnershipPrediction = {
  slatePlayerId: string;
  name: string;
  predictedOwnership: number;
  ownershipSource: OwnershipSource;
};

export type OwnershipPredictionResult = {
  players: PlayerOwnershipPrediction[];
  averagePredictedOwnership: number;
  chalkPlayerCount: number;
  contrarianPlayerCount: number;
  leverageOpportunities: number;
  ownershipConcentration: number;
  assessment: string;
  factors: string[];
  version: string;
};
