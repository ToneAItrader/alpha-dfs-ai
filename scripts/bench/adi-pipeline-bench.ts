#!/usr/bin/env npx tsx
/**
 * ADI pipeline benchmark (M6) — seed-mode fetch + fusion timing.
 * Gate: fetch + fusion p95 ≤ 30s in seed mode.
 */
import { performance } from "node:perf_hooks";
import { registerEvidenceProviders } from "@alpha-dfs/adi-providers";
import { createConnectorManager, createSourceRegistry } from "@alpha-dfs/adi-platform";
import { fuseEvidence } from "@alpha-dfs/evidence-fusion";

process.env.ADI_PROVIDER_NEWS_ENABLED = "true";
process.env.ADI_PROVIDER_SOCIAL_ENABLED = "true";
process.env.ADI_PROVIDER_SPORTSBOOK_ENABLED = "true";
process.env.ADI_PROVIDER_CONSENSUS_ENABLED = "true";
process.env.ADI_PROVIDER_DFS_CONTENT_ENABLED = "true";
process.env.ADI_PROVIDER_BETTING_ENABLED = "true";
process.env.ADI_PROVIDER_HISTORICAL_LEARNING_ENABLED = "true";

const iterations = Number(process.env.ADI_BENCH_ITERATIONS ?? 5);
const p95GateMs = 30_000;

const context = {
  runId: "bench-run",
  slateId: "bench-slate",
  players: [
    { slatePlayerId: "sp-1", name: "Patrick Mahomes", team: "KC" },
    { slatePlayerId: "sp-2", name: "Travis Kelce", team: "KC" },
  ],
  games: [{ gameKey: "KC-BUF", homeTeam: "KC", awayTeam: "BUF" }],
};

const registry = createSourceRegistry();
const manager = createConnectorManager(registry);
registerEvidenceProviders(manager);

const durations: number[] = [];

async function main(): Promise<void> {
  for (let index = 0; index < iterations; index += 1) {
    const started = performance.now();
    const packages = await manager.fetchAll(context);
    fuseEvidence({
      packages,
      registry,
      context: { runId: context.runId, slateId: context.slateId },
    });
    durations.push(performance.now() - started);
  }

  durations.sort((a, b) => a - b);
  const p95Index = Math.min(durations.length - 1, Math.ceil(durations.length * 0.95) - 1);
  const p95 = durations[p95Index] ?? durations[durations.length - 1] ?? 0;

  console.log(
    JSON.stringify(
      {
        iterations,
        durationsMs: durations.map((value) => Math.round(value)),
        p95Ms: Math.round(p95),
        gateMs: p95GateMs,
        pass: p95 <= p95GateMs,
      },
      null,
      2,
    ),
  );

  if (p95 > p95GateMs) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
