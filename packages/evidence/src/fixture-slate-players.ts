/** Fixture slate player inputs — replaced by database ingest in Task 11.3+. */
export type FixturePlayerInput = {
  slatePlayerId: string;
  name: string;
  position: string;
  team: string;
  opponent: string;
  salary: number;
  projection: number;
  floor: number;
  ceiling: number;
  injuryStatus: "healthy" | "questionable" | "doubtful" | "out" | "unknown";
  domains: {
    statistical: boolean;
    injury: boolean;
    expert: boolean;
    market: boolean;
    weather: boolean;
    community: boolean;
  };
};

export const FIXTURE_SLATE_PLAYERS: FixturePlayerInput[] = [
  {
    slatePlayerId: "p1",
    name: "Player One",
    position: "QB",
    team: "BUF",
    opponent: "KC",
    salary: 7200,
    projection: 18.5,
    floor: 14.2,
    ceiling: 24.8,
    injuryStatus: "healthy",
    domains: { statistical: true, injury: true, expert: true, market: true, weather: true, community: true },
  },
  {
    slatePlayerId: "p2",
    name: "Player Two",
    position: "RB",
    team: "DAL",
    opponent: "PHI",
    salary: 7600,
    projection: 19.5,
    floor: 12.0,
    ceiling: 28.0,
    injuryStatus: "healthy",
    domains: { statistical: true, injury: true, expert: true, market: true, weather: true, community: false },
  },
  {
    slatePlayerId: "p3",
    name: "Player Three",
    position: "WR",
    team: "MIA",
    opponent: "NYJ",
    salary: 8000,
    projection: 20.5,
    floor: 11.5,
    ceiling: 30.2,
    injuryStatus: "questionable",
    domains: { statistical: true, injury: true, expert: true, market: true, weather: false, community: true },
  },
  {
    slatePlayerId: "p4",
    name: "Player Four",
    position: "TE",
    team: "SF",
    opponent: "SEA",
    salary: 8400,
    projection: 21.5,
    floor: 10.0,
    ceiling: 32.0,
    injuryStatus: "healthy",
    domains: { statistical: true, injury: true, expert: false, market: true, weather: true, community: false },
  },
  {
    slatePlayerId: "p5",
    name: "Player Five",
    position: "WR",
    team: "CIN",
    opponent: "BAL",
    salary: 8800,
    projection: 22.5,
    floor: 9.5,
    ceiling: 34.0,
    injuryStatus: "healthy",
    domains: { statistical: true, injury: true, expert: true, market: false, weather: true, community: false },
  },
];
