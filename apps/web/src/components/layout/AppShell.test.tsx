import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "@/components/layout/AppShell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("AppShell", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: "idle",
          currentSlate: "No slate loaded",
          portfolioReadiness: "Pending",
          lastAnalysisAt: "Never",
          runId: null,
        }),
      }),
    );
  });

  it("renders header, sidebar, and main content", async () => {
    render(
      <AppShell>
        <p>Child content</p>
      </AppShell>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("Child content");
    await waitFor(() => {
      expect(screen.getByTestId("header-analysis-status")).toHaveTextContent("Idle");
    });
  });

  it("exposes a main content landmark", () => {
    render(
      <AppShell>
        <div>Page body</div>
      </AppShell>,
    );

    expect(document.getElementById("main-content")).toBeInTheDocument();
  });

  it("opens mobile drawer without leaving page content visible", async () => {
    const user = userEvent.setup();

    render(
      <AppShell>
        <h1>Dashboard</h1>
      </AppShell>,
    );

    const toggle = screen.getByRole("button", { name: "Open navigation menu" });
    await user.click(toggle);

    expect(screen.getByRole("dialog", { name: "Navigation menu" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(document.getElementById("main-content")).toHaveClass("max-lg:invisible");
  });
});
