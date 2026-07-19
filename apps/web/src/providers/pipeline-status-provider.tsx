"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchPipelineDisplayStatus } from "@/lib/client/fetch-pipeline-status";
import type { PipelineDisplayStatus } from "@/lib/mappers/pipeline-status-mapper";

type PipelineStatusContextValue = {
  analysisStatus: PipelineDisplayStatus;
  refreshPipelineStatus: () => Promise<void>;
  notifyAnalyzing: () => void;
};

const PipelineStatusContext = createContext<PipelineStatusContextValue | null>(null);

export function PipelineStatusProvider({ children }: { children: ReactNode }) {
  const [analysisStatus, setAnalysisStatus] = useState<PipelineDisplayStatus>("idle");

  const refreshPipelineStatus = useCallback(async () => {
    try {
      const status = await fetchPipelineDisplayStatus();
      setAnalysisStatus(status);
    } catch {
      setAnalysisStatus("idle");
    }
  }, []);

  const notifyAnalyzing = useCallback(() => {
    setAnalysisStatus("analyzing");
  }, []);

  useEffect(() => {
    void refreshPipelineStatus();
  }, [refreshPipelineStatus]);

  const value = useMemo(
    () => ({
      analysisStatus,
      refreshPipelineStatus,
      notifyAnalyzing,
    }),
    [analysisStatus, refreshPipelineStatus, notifyAnalyzing],
  );

  return (
    <PipelineStatusContext.Provider value={value}>{children}</PipelineStatusContext.Provider>
  );
}

export function usePipelineStatus(): PipelineStatusContextValue {
  const context = useContext(PipelineStatusContext);
  if (!context) {
    throw new Error("usePipelineStatus must be used within PipelineStatusProvider");
  }
  return context;
}
