import type { SlateGamePayload } from "@alpha-dfs/connectors";

const cache = new Map<string, SlateGamePayload[]>();

/** Store merged game enrichment data after refresh — no Prisma schema for market/weather fields. */
export function setSlateMarketCache(slateId: string, games: ReadonlyArray<SlateGamePayload>): void {
  cache.set(slateId, games.map((game) => ({ ...game })));
}

export function getSlateMarketCache(slateId: string): SlateGamePayload[] | undefined {
  const games = cache.get(slateId);
  return games ? games.map((game) => ({ ...game })) : undefined;
}

export function clearSlateMarketCache(): void {
  cache.clear();
}
