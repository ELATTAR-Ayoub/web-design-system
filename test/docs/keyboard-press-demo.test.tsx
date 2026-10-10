/**
 * `PressKeyboardDemo` (components/docs/component-docs/press/keyboard-press-demo.tsx)
 * — the host half of the press capability's keyboard path. `press` answers
 * `[data-pressed]` beside `:active` (styles/motion.css); this demo is the
 * script CSS cannot be: `keydown`/`keyup` on Space and Enter setting and
 * clearing the attribute, `blur` clearing it.
 *
 * jsdom has no `:active` and no real transform/paint pipeline, so what this
 * test pins is the state machine — `data-pressed` appears exactly while a
 * key is held and never for an unrelated key — not the rendered squash
 * itself.
 *
 * @covers press
 */

import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { PressKeyboardDemo } from "@/components/docs/component-docs/press/keyboard-press-demo";

describe("PressKeyboardDemo", () => {
  it("is not pressed at rest", () => {
    render(<PressKeyboardDemo />);
    const button = screen.getByRole("button", { name: "press, keyboard-driven" });
    expect(button).not.toHaveAttribute("data-pressed");
  });

  it("sets data-pressed while Space is held, and clears it on release", () => {
    render(<PressKeyboardDemo />);
    const button = screen.getByRole("button", { name: "press, keyboard-driven" });
    button.focus();

    fireEvent.keyDown(button, { key: " " });
    expect(button).toHaveAttribute("data-pressed", "true");

    fireEvent.keyUp(button, { key: " " });
    expect(button).not.toHaveAttribute("data-pressed");
  });

  it("sets data-pressed for Enter too", () => {
    render(<PressKeyboardDemo />);
    const button = screen.getByRole("button", { name: "press, keyboard-driven" });
    button.focus();

    fireEvent.keyDown(button, { key: "Enter" });
    expect(button).toHaveAttribute("data-pressed", "true");
    fireEvent.keyUp(button, { key: "Enter" });
    expect(button).not.toHaveAttribute("data-pressed");
  });

  it("ignores unrelated keys", () => {
    render(<PressKeyboardDemo />);
    const button = screen.getByRole("button", { name: "press, keyboard-driven" });
    button.focus();

    fireEvent.keyDown(button, { key: "Tab" });
    expect(button).not.toHaveAttribute("data-pressed");
  });

  it("clears the pressed state on blur, so it cannot get stuck", () => {
    render(<PressKeyboardDemo />);
    const button = screen.getByRole("button", { name: "press, keyboard-driven" });
    button.focus();
    fireEvent.keyDown(button, { key: " " });
    expect(button).toHaveAttribute("data-pressed", "true");

    fireEvent.blur(button);
    expect(button).not.toHaveAttribute("data-pressed");
  });

  it("axe: no violations", async () => {
    const { container } = render(<PressKeyboardDemo />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
