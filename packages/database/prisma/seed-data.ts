/** Canonical v1 seed slate — DraftKings NFL Classic Week 1. */
export type SeedSlatePlayer = {
  externalId: string;
  name: string;
  position: string;
  team: string;
  opponent: string;
  salary: number;
  projection: number;
  floor: number;
  ceiling: number;
  injuryStatus: "healthy" | "questionable" | "doubtful" | "out" | "unknown";
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

export const SEED_SLATE = {
  name: "DraftKings NFL Classic — Week 1",
  week: 1,
  season: 2026,
} as const;

export const SEED_TEAMS = [
  { abbreviation: "BUF", name: "Buffalo Bills" },
  { abbreviation: "KC", name: "Kansas City Chiefs" },
  { abbreviation: "DAL", name: "Dallas Cowboys" },
  { abbreviation: "PHI", name: "Philadelphia Eagles" },
  { abbreviation: "MIA", name: "Miami Dolphins" },
  { abbreviation: "NYJ", name: "New York Jets" },
  { abbreviation: "SF", name: "San Francisco 49ers" },
  { abbreviation: "SEA", name: "Seattle Seahawks" },
  { abbreviation: "CIN", name: "Cincinnati Bengals" },
  { abbreviation: "BAL", name: "Baltimore Ravens" },
] as const;

export const SEED_GAMES = [
  { home: "BUF", away: "KC" },
  { home: "DAL", away: "PHI" },
  { home: "MIA", away: "NYJ" },
  { home: "SF", away: "SEA" },
  { home: "CIN", away: "BAL" },
] as const;

export const SEED_PLAYERS: SeedSlatePlayer[] = [
  { externalId: "p1", name: "Player One", position: "QB", team: "BUF", opponent: "KC", salary: 7200, projection: 18.5, floor: 14.2, ceiling: 24.8, injuryStatus: "healthy", ownershipProjected: 12, domains: { statistical: true, injury: true, expert: true, market: true, weather: true, community: true } },
  { externalId: "p2", name: "Player Two", position: "RB", team: "DAL", opponent: "PHI", salary: 7600, projection: 19.5, floor: 12.0, ceiling: 28.0, injuryStatus: "healthy", ownershipProjected: 15, domains: { statistical: true, injury: true, expert: true, market: true, weather: true, community: false } },
  { externalId: "p3", name: "Player Three", position: "WR", team: "MIA", opponent: "NYJ", salary: 8000, projection: 20.5, floor: 11.5, ceiling: 30.2, injuryStatus: "questionable", ownershipProjected: 18, domains: { statistical: true, injury: true, expert: true, market: true, weather: false, community: true } },
  { externalId: "p4", name: "Player Four", position: "TE", team: "SF", opponent: "SEA", salary: 8400, projection: 21.5, floor: 10.0, ceiling: 32.0, injuryStatus: "healthy", ownershipProjected: 10, domains: { statistical: true, injury: true, expert: false, market: true, weather: true, community: false } },
  { externalId: "p5", name: "Player Five", position: "WR", team: "CIN", opponent: "BAL", salary: 8800, projection: 22.5, floor: 9.5, ceiling: 34.0, injuryStatus: "healthy", ownershipProjected: 14, domains: { statistical: true, injury: true, expert: true, market: false, weather: true, community: false } },
  { externalId: "p6", name: "Player Six", position: "QB", team: "KC", opponent: "BUF", salary: 7000, projection: 17.8, floor: 13.5, ceiling: 23.0, injuryStatus: "healthy", ownershipProjected: 8, domains: { statistical: true, injury: true, expert: true, market: true, weather: true, community: false } },
  { externalId: "p7", name: "Player Seven", position: "RB", team: "PHI", opponent: "DAL", salary: 6800, projection: 16.2, floor: 10.5, ceiling: 24.0, injuryStatus: "healthy", ownershipProjected: 11, domains: { statistical: true, injury: true, expert: true, market: true, weather: true, community: false } },
  { externalId: "p8", name: "Player Eight", position: "RB", team: "MIA", opponent: "NYJ", salary: 6200, projection: 14.8, floor: 9.0, ceiling: 22.5, injuryStatus: "healthy", ownershipProjected: 9, domains: { statistical: true, injury: true, expert: false, market: true, weather: true, community: false } },
  { externalId: "p9", name: "Player Nine", position: "WR", team: "SF", opponent: "SEA", salary: 5900, projection: 13.5, floor: 8.0, ceiling: 21.0, injuryStatus: "healthy", ownershipProjected: 7, domains: { statistical: true, injury: true, expert: true, market: true, weather: true, community: false } },
  { externalId: "p10", name: "Player Ten", position: "WR", team: "DAL", opponent: "PHI", salary: 5600, projection: 12.8, floor: 7.5, ceiling: 20.0, injuryStatus: "healthy", ownershipProjected: 6, domains: { statistical: true, injury: true, expert: true, market: false, weather: true, community: false } },
  { externalId: "p11", name: "Player Eleven", position: "TE", team: "BUF", opponent: "KC", salary: 4800, projection: 11.2, floor: 6.5, ceiling: 17.5, injuryStatus: "healthy", ownershipProjected: 5, domains: { statistical: true, injury: true, expert: false, market: true, weather: true, community: false } },
  { externalId: "p12", name: "Player Twelve", position: "WR", team: "CIN", opponent: "BAL", salary: 5200, projection: 12.0, floor: 7.0, ceiling: 19.5, injuryStatus: "healthy", ownershipProjected: 4, domains: { statistical: true, injury: true, expert: true, market: true, weather: true, community: false } },
  { externalId: "p13", name: "Player Thirteen", position: "RB", team: "SF", opponent: "SEA", salary: 5400, projection: 12.5, floor: 7.2, ceiling: 20.5, injuryStatus: "healthy", ownershipProjected: 5, domains: { statistical: true, injury: true, expert: true, market: true, weather: true, community: false } },
  { externalId: "p14", name: "Bills DST", position: "DST", team: "BUF", opponent: "KC", salary: 3200, projection: 8.5, floor: 4.0, ceiling: 14.0, injuryStatus: "healthy", ownershipProjected: 8, domains: { statistical: true, injury: false, expert: false, market: true, weather: true, community: false } },
  { externalId: "p15", name: "Chiefs DST", position: "DST", team: "KC", opponent: "BUF", salary: 3000, projection: 7.8, floor: 3.5, ceiling: 13.0, injuryStatus: "healthy", ownershipProjected: 6, domains: { statistical: true, injury: false, expert: false, market: true, weather: true, community: false } },
];
