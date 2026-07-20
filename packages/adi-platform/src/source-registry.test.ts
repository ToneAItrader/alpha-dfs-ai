import { describe, expect, it } from "vitest";
import { createSourceRegistry } from "./source-registry";

describe("source registry", () => {
  it("lists seven default providers", () => {
    const registry = createSourceRegistry();
    expect(registry.listProviders()).toHaveLength(7);
  });

  it("returns provider descriptor by id", () => {
    const registry = createSourceRegistry();
    expect(registry.getProvider("news")?.displayName).toBe("News Intelligence");
  });

  it("returns default weight for known provider", () => {
    const registry = createSourceRegistry();
    expect(registry.getWeight("news")).toBe(0.85);
  });

  it("registers custom providers", () => {
    const registry = createSourceRegistry([]);
    registry.register({
      providerId: "custom",
      displayName: "Custom",
      version: "1.0.0",
      domains: ["news"],
      defaultWeight: 0.5,
      priority: "P2",
    });
    expect(registry.getProvider("custom")?.displayName).toBe("Custom");
  });
});
