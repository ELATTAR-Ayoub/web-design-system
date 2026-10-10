/**
 * @covers ai-terminal
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Terminal, TerminalContent } from "@/components/ai-elements/terminal";

describe("Terminal", () => {
  it("renders its default layout (title, output) with no children", () => {
    render(<Terminal output="$ npm run build\nDone." />);
    expect(screen.getByText("Terminal")).toBeInTheDocument();
    expect(screen.getByText(/Done\./)).toBeInTheDocument();
  });

  it("shows the streaming caret only while isStreaming is true", () => {
    const { container, rerender } = render(
      <Terminal isStreaming output="building..." />
    );
    expect(container.querySelector(".anim-caret")).toBeInTheDocument();

    rerender(<Terminal isStreaming={false} output="building..." />);
    expect(container.querySelector(".anim-caret")).not.toBeInTheDocument();
  });

  it("renders the clear button only when onClear is supplied", () => {
    const { rerender } = render(<Terminal output="log" />);
    expect(
      screen.queryByRole("button", { name: "Clear terminal" })
    ).not.toBeInTheDocument();

    const onClear = vi.fn();
    rerender(<Terminal onClear={onClear} output="log" />);
    const clearButton = screen.getByRole("button", { name: "Clear terminal" });
    fireEvent.click(clearButton);
    expect(onClear).toHaveBeenCalled();
  });

  it("copies the accumulated output", async () => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: vi.fn().mockResolvedValue(undefined) }, configurable: true });
    render(<Terminal output="line one" />);

    fireEvent.click(screen.getByRole("button", { name: "Copy output" }));
    await screen.findByRole("button", { name: "Copied" });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("line one");
  });

  it("auto-scrolls to the bottom as output grows, unless autoScroll is off", () => {
    const { container, rerender } = render(
      <Terminal output="a">
        <TerminalContent />
      </Terminal>
    );
    const content = container.querySelector(
      ".max-h-96"
    ) as HTMLDivElement;
    Object.defineProperty(content, "scrollHeight", { value: 500, configurable: true });
    rerender(
      <Terminal output="a\nb\nc">
        <TerminalContent />
      </Terminal>
    );
    expect(content.scrollTop).toBe(500);
  });

  it("header actions keep the small toolbar size (32px), not an inflated target", () => {
    render(<Terminal onClear={() => {}} output="x" />);
    for (const name of ["Copy output", "Clear terminal"]) {
      const button = screen.getByRole("button", { name });
      expect(button).toHaveAttribute("data-size", "icon-sm");
      expect(button.className).not.toContain("size-target-min");
    }
  });

  it("renders ANSI output as theme classes, never inline colours", () => {
    const { container } = render(
      <Terminal output={"\u001b[31mfail\u001b[0m \u001b[1;32mok\u001b[0m"} />
    );
    const red = screen.getByText("fail");
    expect(red).toHaveClass("ansi-red-fg");
    expect(screen.getByText("ok")).toHaveClass("ansi-green-fg", "ansi-bold");
    for (const span of container.querySelectorAll("code span")) {
      expect((span as HTMLElement).style.color).toBe("");
      expect((span as HTMLElement).style.backgroundColor).toBe("");
    }
  });
});
