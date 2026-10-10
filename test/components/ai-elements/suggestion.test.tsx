import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";

describe("Suggestion", () => {
  it("calls onClick with the suggestion text", async () => {
    const onClick = vi.fn();
    render(
      <Suggestions>
        <Suggestion suggestion="Tell me more" onClick={onClick} />
        <Suggestion suggestion="x">Custom label</Suggestion>
      </Suggestions>,
    );
    await userEvent.setup().click(screen.getByRole("button", { name: "Tell me more" }));
    expect(onClick).toHaveBeenCalledWith("Tell me more");
    expect(screen.getByRole("button", { name: "Custom label" })).toBeInTheDocument();
  });
  it("relies on the Button pill, not a stock radius", () => {
    render(<Suggestion suggestion="a" />);
    const b = screen.getByRole("button");
    expect(b).toHaveClass("rounded-pill");
    expect(b).not.toHaveClass("rounded-full");
    // compact pill: Button `sm` (32px), no hit-area override
    expect(b).toHaveClass("min-h-8");
    expect(b.className).not.toContain("size-target-min");
  });
});
