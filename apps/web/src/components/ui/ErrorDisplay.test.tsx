import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

describe("ErrorDisplay", () => {
  it("renders title and message", () => {
    render(
      <ErrorDisplay title="Load failed" message="Unable to fetch slate data." />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Load failed")).toBeInTheDocument();
    expect(screen.getByText("Unable to fetch slate data.")).toBeInTheDocument();
  });

  it("calls onRetry when try again is clicked", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<ErrorDisplay onRetry={onRetry} />);
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
