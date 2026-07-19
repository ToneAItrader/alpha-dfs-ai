import type { EngineRegistry } from "@alpha-dfs/shared";
import {
  createEngineRegistry,
  type EngineRegistryMode,
} from "@/lib/backend/engines/create-engine-registry";

export type BackendDependencies = {
  engines: EngineRegistry;
};

let cachedDependencies: BackendDependencies | null = null;

function resolveEngineMode(): EngineRegistryMode {
  const mode = process.env.ENGINE_REGISTRY_MODE;
  if (mode === "stub") return "stub";
  return "real";
}

/** Dependency injection container — real engines by default; stub via ENGINE_REGISTRY_MODE=stub. */
export function getBackendDependencies(): BackendDependencies {
  if (!cachedDependencies) {
    cachedDependencies = {
      engines: createEngineRegistry(resolveEngineMode()),
    };
  }
  return cachedDependencies;
}

/** Test helper — inject custom engine registry. */
export function setBackendDependencies(deps: BackendDependencies): void {
  cachedDependencies = deps;
}

export function resetBackendDependencies(): void {
  cachedDependencies = null;
}
