import type { PrismaClient } from "@prisma/client";

export type SourceResultRecord = {
  sourceId: string;
  priority: string;
  ok: boolean;
  capturedAt: string;
  recordCount: number;
  durationMs: number;
  attempts: number;
  error?: string;
  degraded?: boolean;
};

export type RefreshRunRecord = {
  id: string;
  runId: string | null;
  slateId: string | null;
  status: string;
  degraded: boolean;
  sourceResults: SourceResultRecord[];
  errors: string | null;
  startedAt: Date;
  completedAt: Date | null;
};

export function createRefreshRepository(client: PrismaClient) {
  return {
    async createRun(runId?: string): Promise<string> {
      const run = await client.dataRefreshRun.create({
        data: { runId: runId ?? null, status: "running" },
      });
      return run.id;
    },

    async completeRun(
      id: string,
      input: {
        slateId?: string;
        status: "complete" | "failed" | "degraded";
        degraded: boolean;
        sourceResults: SourceResultRecord[];
        errors?: string[];
      },
    ): Promise<void> {
      await client.dataRefreshRun.update({
        where: { id },
        data: {
          slateId: input.slateId ?? null,
          status: input.status,
          degraded: input.degraded,
          sourceResults: JSON.stringify(input.sourceResults),
          errors: input.errors?.join("; ") ?? null,
          completedAt: new Date(),
        },
      });
    },

    async upsertSourceStatus(result: SourceResultRecord): Promise<void> {
      await client.dataSourceStatus.upsert({
        where: { sourceId: result.sourceId },
        create: {
          sourceId: result.sourceId,
          priority: result.priority,
          status: result.ok ? "healthy" : result.degraded ? "degraded" : "unavailable",
          lastSuccessAt: result.ok ? new Date(result.capturedAt) : null,
          lastAttemptAt: new Date(),
          lastError: result.error ?? null,
          recordCount: result.recordCount,
        },
        update: {
          priority: result.priority,
          status: result.ok ? "healthy" : result.degraded ? "degraded" : "unavailable",
          lastSuccessAt: result.ok ? new Date(result.capturedAt) : undefined,
          lastAttemptAt: new Date(),
          lastError: result.error ?? null,
          recordCount: result.recordCount,
        },
      });
    },

    async getLatestRun(): Promise<RefreshRunRecord | null> {
      const run = await client.dataRefreshRun.findFirst({
        orderBy: { startedAt: "desc" },
      });
      if (!run) return null;

      return {
        id: run.id,
        runId: run.runId,
        slateId: run.slateId,
        status: run.status,
        degraded: run.degraded,
        sourceResults: JSON.parse(run.sourceResults) as SourceResultRecord[],
        errors: run.errors,
        startedAt: run.startedAt,
        completedAt: run.completedAt,
      };
    },

    async getSourceStatuses() {
      return client.dataSourceStatus.findMany({ orderBy: { sourceId: "asc" } });
    },
  };
}

export type RefreshRepository = ReturnType<typeof createRefreshRepository>;
