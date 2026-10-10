import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Shimmer } from "@/components/ai-elements/shimmer";

describe("Shimmer", () => {
  it("renders its text with the system shimmer utility", () => {
    render(<Shimmer>Thinking...</Shimmer>);
    const el = screen.getByText("Thinking...");
    expect(el.tagName).toBe("P");
    expect(el).toHaveClass("anim-shimmer-text");
  });
  it("honours `as` and className", () => {
    render(
      <Shimmer as="span" className="extra">
        Working
      </Shimmer>,
    );
    const el = screen.getByText("Working");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveClass("extra");
  });
});
