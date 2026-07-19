import type { AnalysisRunStatus } from "@/types/shared/confidence";

type AnalysisState = {
  runId: string | null;
  status: AnalysisRunStatus;
  lastAnalysisAt: string | null;
  errorMessage: string | null;
};

const globalStore = globalThis as typeof globalThis & {
  __alphaDfsAnalysisState?: AnalysisState;
};

function getStore(): AnalysisState {
  if (!globalStore.__alphaDfsAnalysisState) {
    globalStore.__alphaDfsAnalysisState = {
      runId: null,
      status: "idle",
      lastAnalysisAt: null,
      errorMessage: null,
    };
  }
  return globalStore.__alphaDfsAnalysisState;
}

export function getAnalysisState(): AnalysisState {
  return { ...getStore() };
}

export function startAnalysisRun(): AnalysisState {
  const store = getStore();
  store.runId = `run-${Date.now()}`;
  store.status = "analyzing";
  store.errorMessage = null;
  return { ...store };
}

export function completeAnalysisRun(): AnalysisState {
  const store = getStore();
  store.status = "complete";
  store.lastAnalysisAt = new Date().toISOString();
  store.errorMessage = null;
  return { ...store };
}

export function failAnalysisRun(errorMessage: string): AnalysisState {
  const store = getStore();
  store.status = "failed";
  store.errorMessage = errorMessage;
  return { ...store };
}

export function resetAnalysisRun(): AnalysisState {
  const store = getStore();
  store.runId = null;
  store.status = "idle";
  store.lastAnalysisAt = null;
  store.errorMessage = null;
  return { ...store };
}

export function isAnalysisComplete(): boolean {
  return getStore().status === "complete";
}
