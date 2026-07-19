import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "@/components/layout/Sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
  }) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

describe("Sidebar", () => {
  it("renders primary navigation links", () => {
    render(<Sidebar />);

    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: "Recommended Portfolio" })).toHaveAttribute(
      "href",
      "/recommended-portfolio",
    );
  });

  it("marks the active route", () => {
    render(<Sidebar />);

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Slate Intelligence" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("shows v1 scope label", () => {
    render(<Sidebar />);

    expect(screen.getByText("DraftKings · NFL · Classic")).toBeInTheDocument();
  });
});

describe("Sidebar mobile callback", () => {
  it("calls onNavigate when a link is clicked", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    render(<Sidebar onNavigate={onNavigate} />);
    await user.click(screen.getByRole("link", { name: "Settings" }));

    expect(onNavigate).toHaveBeenCalledOnce();
  });
});
