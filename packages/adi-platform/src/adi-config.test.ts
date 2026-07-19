import { beforeEach, describe, expect, it } from "vitest";
import { resetAdiConfigCache, isAdiPlatformEnabled, isProviderEnabled } from "./adi-config";

describe("adi-config", () => {
  beforeEach(() => {
    resetAdiConfigCache();
    delete process.env.ADI_PLATFORM_ENABLED;
    delete process.env.ADI_PROVIDER_NEWS_ENABLED;
  });

  it("defaults ADI platform to disabled", () => {
    expect(isAdiPlatformEnabled()).toBe(false);
  });

  it("enables ADI platform when env is true", () => {
    process.env.ADI_PLATFORM_ENABLED = "true";
    resetAdiConfigCache();
    expect(isAdiPlatformEnabled()).toBe(true);
  });

  it("defaults providers to disabled", () => {
    expect(isProviderEnabled("news")).toBe(false);
  });

  it("enables provider via ADI_PROVIDER_* flag", () => {
    process.env.ADI_PROVIDER_NEWS_ENABLED = "1";
    expect(isProviderEnabled("news")).toBe(true);
  });
});
