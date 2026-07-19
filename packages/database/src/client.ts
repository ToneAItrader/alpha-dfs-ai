import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const globalStore = globalThis as typeof globalThis & {
  __alphaDfsPrisma?: PrismaClient;
};

function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl?.startsWith("file:")) {
    return envUrl;
  }

  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const dbFile = process.env.ALPHA_DFS_TEST_DB === "true" ? "test.db" : "dev.db";
  const dbPath = path.join(moduleDir, "..", "prisma", dbFile);
  return `file:${dbPath}`;
}

export function getPrismaClient(): PrismaClient {
  if (!globalStore.__alphaDfsPrisma) {
    process.env.DATABASE_URL = resolveDatabaseUrl();
    globalStore.__alphaDfsPrisma = new PrismaClient();
  }
  return globalStore.__alphaDfsPrisma;
}

export async function disconnectPrisma(): Promise<void> {
  if (globalStore.__alphaDfsPrisma) {
    await globalStore.__alphaDfsPrisma.$disconnect();
    globalStore.__alphaDfsPrisma = undefined;
  }
}

export type { PrismaClient };
