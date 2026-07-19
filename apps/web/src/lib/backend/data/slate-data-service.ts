import { createSlateRepository, getPrismaClient, type SlateRepository } from "@alpha-dfs/database";
import { getDataOperationsService } from "@/lib/backend/operations/data-operations-service";

export type SlateDataService = {
  slateRepository: SlateRepository;
  ensureReady(): Promise<{ slateId: string; slateLabel: string }>;
  refreshAndEnsureReady(runId?: string): Promise<{ slateId: string; slateLabel: string; degraded: boolean }>;
};

let cachedService: SlateDataService | null = null;

export function getSlateDataService(): SlateDataService {
  if (!cachedService) {
    const client = getPrismaClient();
    const slateRepository = createSlateRepository(client);
    const operations = getDataOperationsService();

    cachedService = {
      slateRepository,
      async ensureReady() {
        const result = await operations.refreshAndEnsureReady();
        return { slateId: result.slateId, slateLabel: result.slateLabel };
      },
      refreshAndEnsureReady(runId?: string) {
        return operations.refreshAndEnsureReady(runId);
      },
    };
  }

  return cachedService;
}

export function resetSlateDataService(): void {
  cachedService = null;
}
