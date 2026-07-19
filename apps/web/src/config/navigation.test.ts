import { describe, expect, it } from "vitest";
import { allNavItems, primaryNav } from "@/config/navigation";

describe("navigation config", () => {
  it("defines unique hrefs", () => {
    const hrefs = allNavItems.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("maps primary routes to Task 10 subtasks", () => {
    expect(primaryNav.map((item) => item.taskId)).toEqual([
      "10.2",
      "10.3",
      "10.4",
      "10.5",
      "10.6",
      "10.7",
      "10.8",
    ]);
  });
});
