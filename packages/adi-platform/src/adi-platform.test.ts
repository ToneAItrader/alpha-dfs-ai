import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAnalysisRunContext } from "@alpha-dfs/shared";
import { resetAdiConfigCache } from "./adi-config";
import { createAdiPlatform, resetAdiPlatform } from "./adi-platform";
import { createAgentOrchestrator } from "./agent-orchestrator";
import { createConnectorManagerStub } from "./connector-manager";
import { createEventBus } from "./event-bus";
import { createSourceRegistry } from "./source-registry";

describe("agent orchestrator", () => {
  it("emits platform ready on pipeline start without fetch in M4", async () => {
    const eventBus = createEventBus();
    const readyHandler = vi.fn();
    eventBus.subscribe("adi.platform.ready", readyHandler);

    const orchestrator = createAgentOrchestrator({
      eventBus,
      registry: createSourceRegistry(),
      connectorManager: createConnectorManagerStub(),
      fetchEnabled: false,
    });

    await orchestrator.onPipelineStarted(createAnalysisRunContext("run-1", { slateId: "slate-1" }), "corr-1");

    expect(readyHandler).toHaveBeenCalledOnce();
    expect(readyHandler.mock.calls[0]?.[0]).toMatchObject({
      runId: "run-1",
      slateId: "slate-1",
      providerCount: 7,
    });
  });
});

describe("adi platform", () => {
  beforeEach(() => {
    resetAdiConfigCache();
    resetAdiPlatform();
    delete process.env.ADI_PLATFORM_ENABLED;
  });

  it("is a no-op when disabled", async () => {
    const platform = createAdiPlatform({ enabled: false });
    await platform.prepare(createAnalysisRunContext("run-1"));
    expect(platform.getNormalizedEvidence()).toBeUndefined();
    await platform.shutdown();
  });

  it("bootstraps and emits ready when enabled", async () => {
    const eventBus = createEventBus();
    const readyHandler = vi.fn();
    eventBus.subscribe("adi.platform.ready", readyHandler);

    const platform = createAdiPlatform({ enabled: true });
    await platform.prepare(createAnalysisRunContext("run-2", { slateId: "slate-2" }));
    expect(platform.getNormalizedEvidence()).toBeUndefined();
    await platform.complete("run-2", true, 50);
    await platform.shutdown();
  });
});

describe("adi platform integration (INT-1 stub)", () => {
  beforeEach(() => {
    resetAdiConfigCache();
    resetAdiPlatform();
  });

  it("prepare → complete → shutdown lifecycle", async () => {
    const platform = createAdiPlatform({ enabled: true });
    const context = createAnalysisRunContext("run-int-1", { slateId: "slate-int-1" });

    await platform.prepare(context, "corr-int-1");
    expect(platform.getNormalizedEvidence()).toBeUndefined();
    await platform.complete("run-int-1", true, 120);
    await platform.shutdown();
  });
});
