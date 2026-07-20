import { describe, expect, it, vi } from "vitest";
import { createEventBus } from "./event-bus";

describe("event bus", () => {
  it("delivers published events to subscribers", async () => {
    const bus = createEventBus();
    const handler = vi.fn();
    bus.subscribe("adi.platform.ready", handler);

    await bus.publish("adi.platform.ready", {
      schemaVersion: "1.0",
      runId: "run-1",
      slateId: "slate-1",
      providerCount: 7,
    });

    expect(handler).toHaveBeenCalledOnce();
  });

  it("unsubscribes handlers", async () => {
    const bus = createEventBus();
    const handler = vi.fn();
    const unsubscribe = bus.subscribe("adi.platform.ready", handler);
    unsubscribe();

    await bus.publish("adi.platform.ready", {
      schemaVersion: "1.0",
      runId: "run-1",
      slateId: "slate-1",
      providerCount: 7,
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it("supports multiple handlers for one event", async () => {
    const bus = createEventBus();
    const first = vi.fn();
    const second = vi.fn();
    bus.subscribe("pipeline.run.completed", first);
    bus.subscribe("pipeline.run.completed", second);

    await bus.publish("pipeline.run.completed", {
      schemaVersion: "1.0",
      runId: "run-1",
      success: true,
      durationMs: 100,
    });

    expect(first).toHaveBeenCalledOnce();
    expect(second).toHaveBeenCalledOnce();
  });
});
