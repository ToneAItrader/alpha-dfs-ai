import {
  createAnalysisRunContext,
  PIPELINE_PHASE_ORDER,
  type AnalysisRunContext,
  type BackendError,
  type EngineOutputs,
  type EngineRegistry,
  type PipelineExecutionResult,
  type PipelinePhase,
} from "@alpha-dfs/shared";
import {
  classifyFailure,
  getCorrelationContext,
  getOperationalConfig,
  incrementCounter,
  recordHistogram,
  recordTrace,
  structuredLog,
  withTimeout,
} from "@alpha-dfs/observability";
import { getAdiPlatform, isAdiPlatformEnabled, resetAdiPlatform } from "@alpha-dfs/adi-platform";
import { ensureAdiProvidersRegistered, resetAdiBootstrap } from "@/lib/backend/adi-bootstrap";
import { assembleAnalysisBundle } from "@/lib/backend/dto-assembler";
import { setCachedAnalysisBundle } from "@/lib/backend/analysis-cache";
import type { AnalysisBundleResponseDto } from "@/types/dto/analysis-responses.dto";

export type PipelineExecutionManager = {
  execute(
    runId: string,
    engines: EngineRegistry,
    options?: { slateId?: string; slateLabel?: string },
  ): Promise<{
    result: PipelineExecutionResult;
    bundle: AnalysisBundleResponseDto;
  }>;
};

const PHASE_ENGINE_MAP: Record<PipelinePhase, string> = {
  slate_analysis: "slate_analysis",
  slate_intelligence: "slate_intelligence",
  injury_intelligence: "injury_intelligence",
  vegas_intelligence: "vegas_intelligence",
  weather_intelligence: "weather_intelligence",
  ownership_intelligence: "ownership_intelligence",
  projection_calibration: "projection_calibration",
  player_analysis: "player_analysis",
  confidence: "confidence",
  portfolio: "portfolio",
  simulation: "simulation",
  readiness: "readiness",
};

async function runPhase(
  phase: PipelinePhase,
  context: AnalysisRunContext,
  engines: EngineRegistry,
  outputs: Partial<EngineOutputs>,
): Promise<{ ok: true; durationMs: number } | { ok: false; error: BackendError; durationMs: number }> {
  const phaseContext: AnalysisRunContext = {
    ...context,
    priorOutputs: { ...outputs },
  };
  const correlation = getCorrelationContext();
  const started = Date.now();
  const engineId = PHASE_ENGINE_MAP[phase];

  const finish = (result: { ok: true } | { ok: false; error: BackendError }) => {
    const durationMs = Date.now() - started;
    recordHistogram("pipeline.phase.duration_ms", durationMs, { phase, engine_id: engineId });
    recordHistogram("engine.execution.duration_ms", durationMs, { engine_id: engineId });
    recordTrace({
      component: "engine",
      name: phase,
      startedAt: new Date(started).toISOString(),
      durationMs,
      status: result.ok ? "ok" : "error",
      correlationId: correlation?.correlationId,
      runId: correlation?.runId ?? context.runId,
      failureClass: result.ok ? undefined : classifyFailure(result.error.message),
      metadata: { phase, engineId },
    });
    return { ...result, durationMs };
  };

  switch (phase) {
    case "slate_analysis": {
      const result = await engines.slateAnalysis.analyze(phaseContext);
      if (!result.ok) return finish(result);
      outputs.slate = result.data;
      return finish({ ok: true });
    }
    case "slate_intelligence": {
      const result = await engines.slateIntelligence.analyze(phaseContext);
      if (!result.ok) return finish(result);
      outputs.slateIntelligence = result.data;
      return finish({ ok: true });
    }
    case "injury_intelligence": {
      const result = await engines.injuryIntelligence.analyze(phaseContext);
      if (!result.ok) return finish(result);
      outputs.injuryIntelligence = result.data;
      return finish({ ok: true });
    }
    case "vegas_intelligence": {
      const result = await engines.vegasIntelligence.analyze(phaseContext);
      if (!result.ok) return finish(result);
      outputs.vegasIntelligence = result.data;
      return finish({ ok: true });
    }
    case "weather_intelligence": {
      const result = await engines.weatherIntelligence.analyze(phaseContext);
      if (!result.ok) return finish(result);
      outputs.weatherIntelligence = result.data;
      return finish({ ok: true });
    }
    case "ownership_intelligence": {
      const result = await engines.ownershipIntelligence.analyze(phaseContext);
      if (!result.ok) return finish(result);
      outputs.ownershipIntelligence = result.data;
      return finish({ ok: true });
    }
    case "projection_calibration": {
      const result = await engines.projectionCalibration.calibrate(phaseContext);
      if (!result.ok) return finish(result);
      outputs.projectionCalibration = result.data;
      return finish({ ok: true });
    }
    case "player_analysis": {
      const result = await engines.playerAnalysis.analyze(phaseContext);
      if (!result.ok) return finish(result);
      outputs.playerAnalysis = result.data;
      return finish({ ok: true });
    }
    case "confidence": {
      const result = await engines.confidence.evaluate(phaseContext);
      if (!result.ok) return finish(result);
      outputs.confidence = result.data;
      return finish({ ok: true });
    }
    case "portfolio": {
      const result = await engines.portfolio.build(phaseContext);
      if (!result.ok) return finish(result);
      outputs.portfolio = result.data;
      return finish({ ok: true });
    }
    case "simulation": {
      const result = await engines.simulation.simulate(phaseContext);
      if (!result.ok) return finish(result);
      outputs.simulation = result.data;
      return finish({ ok: true });
    }
    case "readiness":
      return finish({ ok: true });
    default:
      return finish({
        ok: false,
        error: { code: "UNKNOWN_PHASE", message: `Unknown pipeline phase: ${phase}` },
      });
  }
}

export function createPipelineExecutionManager(): PipelineExecutionManager {
  return {
    async execute(runId, engines, options) {
      incrementCounter("pipeline.run.total");
      const correlation = getCorrelationContext();
      const pipelineStarted = Date.now();
      structuredLog("info", "pipeline", "pipeline.start", "Pipeline execution started", {
        runId,
        slateId: options?.slateId,
      });

      return withTimeout(
        "pipeline.execute",
        getOperationalConfig().pipelineTimeoutMs,
        async () => {
          const context = createAnalysisRunContext(runId, options);
          const phasesCompleted: PipelinePhase[] = [];
          const outputs: Partial<EngineOutputs> = {};
          const completedAt = new Date().toISOString();
          const adiEnabled = isAdiPlatformEnabled();
          if (adiEnabled) {
            ensureAdiProvidersRegistered();
          }
          const adiPlatform = adiEnabled ? getAdiPlatform() : null;

          try {
            if (adiPlatform) {
              await adiPlatform.prepare(context, correlation?.correlationId ?? runId);
              const adiEvidence = adiPlatform.getNormalizedEvidence();
              if (adiEvidence) {
                outputs.adiEvidence = adiEvidence;
              }
            }

            for (const phase of PIPELINE_PHASE_ORDER) {
              const phaseResult = await runPhase(phase, context, engines, outputs);
              if (!phaseResult.ok) {
                incrementCounter("pipeline.run.failure", { phase });
                recordTrace({
                  component: "pipeline",
                  name: "pipeline.execute",
                  startedAt: new Date(pipelineStarted).toISOString(),
                  durationMs: Date.now() - pipelineStarted,
                  status: "error",
                  correlationId: correlation?.correlationId,
                  runId,
                  failureClass: classifyFailure(phaseResult.error.message),
                  metadata: { failedPhase: phase, phasesCompleted },
                });
                const result: PipelineExecutionResult = {
                  runId,
                  status: "failed",
                  completedAt,
                  phasesCompleted,
                  error: phaseResult.error,
                };
                throw Object.assign(new Error(phaseResult.error.message), {
                  pipelineResult: result,
                });
              }
              if (phase !== "readiness") {
                phasesCompleted.push(phase);
              }
            }

            const bundle = assembleAnalysisBundle(
              context,
              outputs as EngineOutputs,
              completedAt,
              runId,
            );
            setCachedAnalysisBundle(bundle);

            const durationMs = Date.now() - pipelineStarted;
            incrementCounter("pipeline.run.success");
            recordHistogram("pipeline.run.duration_ms", durationMs);
            recordTrace({
              component: "pipeline",
              name: "pipeline.execute",
              startedAt: new Date(pipelineStarted).toISOString(),
              durationMs,
              status: "ok",
              correlationId: correlation?.correlationId,
              runId,
              metadata: { phasesCompleted },
            });
            structuredLog("info", "pipeline", "pipeline.complete", "Pipeline execution complete", {
              runId,
              durationMs,
            });

            if (adiPlatform) {
              await adiPlatform.complete(runId, true, durationMs);
            }

            return {
              result: {
                runId,
                status: "complete",
                completedAt,
                phasesCompleted,
              },
              bundle,
            };
          } catch (error) {
            if (adiPlatform) {
              await adiPlatform.complete(runId, false, Date.now() - pipelineStarted);
            }
            structuredLog("error", "pipeline", "pipeline.failed", "Pipeline execution failed", {
              runId,
              failureClass: classifyFailure(error),
            });
            throw error;
          } finally {
            if (adiPlatform) {
              await adiPlatform.shutdown();
            }
          }
        },
      );
    },
  };
}

let cachedManager: PipelineExecutionManager | null = null;

export function getPipelineExecutionManager(): PipelineExecutionManager {
  if (!cachedManager) {
    cachedManager = createPipelineExecutionManager();
  }
  return cachedManager;
}

export function resetPipelineExecutionManager(): void {
  cachedManager = null;
  resetAdiPlatform();
  resetAdiBootstrap();
}
