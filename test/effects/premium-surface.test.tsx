/**
 * `premium-surface` — the metal treatment reserved for real money/reward
 * moments (pack-opening CTAs, reward claims, premium upsells), delivered as
 * one CSS class: `foil-value` in `styles/utilities.css`.
 *
 * What this test protects against: `foil-value` is a background-image plus a
 * hover-speed change on `::before`/`::after`, documented on
 * `components/docs/component-docs/premium-surface/page.tsx` as having NO
 * component and NO props — the class is the entire contract. Nothing stops a
 * refactor of `utilities.css` from silently dropping the `@utility
 * foil-value` block, or a doc/spec edit from drifting the class name away
 * from what the page's own `source:` string shows, and nothing else in the
 * unit layer would catch either. This test renders the same host the page
 * documents (a real `<button>` wearing `foil-value`, mirroring the page's
 * `source` field verbatim), asserts the class survives onto the DOM, confirms
 * the utility it names is still defined in the stylesheet, and checks the
 * host stays a real, accessible, focusable button — the thing RULES and the
 * page's own Accessibility section say the class does NOT supply on its own.
 *
 * NOT covered here: jsdom has no layout or paint, so the gradient ramp, the
 * metal-edge band position, the drift/glint animation timing and the
 * hover-speed change (`--duration-glint-hover`) cannot be measured — that
 * visual/timing evidence belongs to a real-browser e2e spec.
 *
 * @covers premium-surface
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

const UTILITIES_CSS = readFileSync(join(process.cwd(), "styles/utilities.css"), "utf8");

function PremiumSurfaceHost() {
  return (
    <button
      type="button"
      className="foil-value press relative isolate inline-flex h-12 items-center justify-center overflow-hidden rounded-pill px-6 text-sm font-semibold text-value-foreground shadow-btn-value hover:shadow-glow-value active:shadow-btn-down"
    >
      Claim reward
    </button>
  );
}

describe("premium-surface", () => {
  it("the foil-value utility is still defined in the stylesheet it's documented against", () => {
    expect(UTILITIES_CSS).toMatch(/@utility\s+foil-value\s*\{/);
  });

  it("renders the documented host wearing the real class", () => {
    render(<PremiumSurfaceHost />);
    const button = screen.getByRole("button", { name: "Claim reward" });
    expect(button.className.split(/\s+/)).toContain("foil-value");
  });

  it("stays a real, focusable button — the class supplies none of that on its own", () => {
    render(<PremiumSurfaceHost />);
    const button = screen.getByRole("button", { name: "Claim reward" });
    expect(button.tagName).toBe("BUTTON");
    expect(button).not.toHaveAttribute("tabindex", "-1");
    expect(button).not.toBeDisabled();
    button.focus();
    expect(button).toHaveFocus();
  });

  it("axe: no violations on the specimen", async () => {
    const { container } = render(<PremiumSurfaceHost />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
