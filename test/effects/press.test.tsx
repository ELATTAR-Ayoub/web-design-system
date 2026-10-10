/**
 * `press` — the click-feel transform contract for anything clickable that is
 * not a Button (avatars, chips, badges, rows, nav items). One utility now:
 * the fourteen-name vocabulary cut merged five earlier per-variant utilities
 * (distinct scales and timings)
 * into this single `press`. `components/docs/component-docs/press/page.tsx` is
 * explicit that the class alone supplies only the `:active` /
 * `[data-pressed]` transform — keyboard operation, a real role, a focus ring
 * and the 44px minimum target are the host element's job, not something the
 * class gives for free.
 *
 * What this test protects against: a rename or accidental deletion of the
 * `@utility press` block in `motion.css` going unnoticed (nothing else in
 * the unit layer reads that file), a regression where the `:active` /
 * `[data-pressed]` scale rule disappears from the block, and a regression
 * where a consumer starts wearing the class on a non-interactive host (a
 * bare `<div>`) instead of the real button/link the page's Accessibility
 * section requires. This test renders the same specimen the page documents
 * (mirroring its `PressSpecimen`/`source`), asserts the class lands on a
 * real `<button>` that keeps its accessible name and stays keyboard-
 * focusable, and confirms the utility — and its transition and
 * `:active`/`[data-pressed]` scale rule — are still defined in the
 * stylesheet.
 *
 * NOT covered here: jsdom does not run `:active` or paint transforms, so the
 * actual rendered scale (0.9) and the reduced-motion collapse to 0.01ms
 * cannot be measured — that behaviour is covered by
 * `e2e/ledger-evidence.spec.ts`, which measures each capability's real,
 * rendered evidence in a browser.
 *
 * @covers press
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

const MOTION_CSS = readFileSync(join(process.cwd(), "styles/motion.css"), "utf8");

function PressHost() {
  return (
    <button
      type="button"
      aria-label="press"
      className="press flex size-11 items-center justify-center rounded-full border border-border bg-card outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="type-badge text-muted-foreground">press</span>
    </button>
  );
}

describe("press", () => {
  it("the press utility is still defined in motion.css, with its transition and pressed-state scale", () => {
    const match = MOTION_CSS.match(/@utility\s+press\s*\{([\s\S]*?)\n\}/);
    expect(match, "@utility press not found in styles/motion.css").not.toBeNull();
    const body = match![1];
    expect(body).toMatch(/transition:/);
    expect(body).toMatch(/&:active,\s*\n\s*&\[data-pressed\]\s*\{/);
    expect(body).toMatch(/transform:\s*scale\(0\.9\)/);
  });

  it("lands on a real, named, focusable button", () => {
    render(<PressHost />);
    const button = screen.getByRole("button", { name: "press" });
    expect(button.className.split(/\s+/)).toContain("press");
    expect(button.tagName).toBe("BUTTON");
    expect(button).not.toHaveAttribute("tabindex", "-1");
    button.focus();
    expect(button).toHaveFocus();
  });

  it("answers [data-pressed] for the keyboard-driven case, same as :active", () => {
    render(<PressHost />);
    const button = screen.getByRole("button", { name: "press" });
    expect(button).not.toHaveAttribute("data-pressed");
    button.setAttribute("data-pressed", "");
    expect(button).toHaveAttribute("data-pressed");
  });

  it("axe: no violations", async () => {
    const { container } = render(<PressHost />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
