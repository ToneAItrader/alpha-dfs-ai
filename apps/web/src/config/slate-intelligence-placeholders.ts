/** Static display placeholders for Slate Intelligence Agent output. Task 10.10 replaces with API data. */

export type SlateIntelligencePlaceholderData = {
  summary: {
    slateName: string;
    week: string;
    mainSlateDate: string;
    games: string;
    teams: string;
    totalPlayers: string;
  };
  grade: {
    overallGrade: string;
    confidence: string;
    volatility: string;
    predictability: string;
  };
  recommendedStrategy: {
    primary: string;
    options: string[];
  };
  injuries: {
    majorInjuries: string;
    questionablePlayers: string;
    backupOpportunities: string;
    rookieOpportunities: string;
  };
  weather: {
    wind: string;
    rain: string;
    snow: string;
    temperature: string;
  };
  ownership: {
    chalkPlayers: string;
    contrarianOpportunities: string;
    ownershipConcentration: string;
    leverageOpportunities: string;
  };
  featuredGames: {
    id: string;
    matchup: string;
    vegasTotal: string;
    spread: string;
    expectedPace: string;
  }[];
  intelligenceSummary: string[];
};

export const slateIntelligencePlaceholderData: SlateIntelligencePlaceholderData = {
  summary: {
    slateName: "NFL Main Slate",
    week: "Week — (placeholder)",
    mainSlateDate: "Sunday — (placeholder)",
    games: "—",
    teams: "—",
    totalPlayers: "—",
  },
  grade: {
    overallGrade: "—",
    confidence: "—",
    volatility: "—",
    predictability: "—",
  },
  recommendedStrategy: {
    primary: "Balanced",
    options: [
      "Balanced",
      "Conservative",
      "Aggressive",
      "Tournament Focus",
      "Cash Focus",
    ],
  },
  injuries: {
    majorInjuries: "—",
    questionablePlayers: "—",
    backupOpportunities: "—",
    rookieOpportunities: "—",
  },
  weather: {
    wind: "—",
    rain: "—",
    snow: "—",
    temperature: "—",
  },
  ownership: {
    chalkPlayers: "—",
    contrarianOpportunities: "—",
    ownershipConcentration: "—",
    leverageOpportunities: "—",
  },
  featuredGames: [
    {
      id: "game-1",
      matchup: "BUF @ KC (placeholder)",
      vegasTotal: "—",
      spread: "—",
      expectedPace: "—",
    },
    {
      id: "game-2",
      matchup: "DAL @ PHI (placeholder)",
      vegasTotal: "—",
      spread: "—",
      expectedPace: "—",
    },
    {
      id: "game-3",
      matchup: "SF @ SEA (placeholder)",
      vegasTotal: "—",
      spread: "—",
      expectedPace: "—",
    },
  ],
  intelligenceSummary: [
    "High scoring environment (placeholder)",
    "Strong stacking opportunities (placeholder)",
    "Weather concerns (placeholder)",
    "Rookie value (placeholder)",
    "Elite leverage (placeholder)",
  ],
};
