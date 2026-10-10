/**
 * Focused test for `feedback-surface` — `bloom-cosmic` plus `.starfield`,
 * documented at `components/docs/component-docs/feedback-surface/page.tsx`.
 *
 * The doc page's header comment is explicit about how this differs from its
 * sibling `background-effect`: that one is a single static glow on `body`;
 * this is two drifting radial pseudo-element layers plus a sparkle overlay,
 * animated and per-type-coloured through `--bloom-1` / `--bloom-2`, mounted on
 * a real surface rather than the page itself. There is no component — `Alert`
 * and sonner's `.cn-toast` are its two real hosts — so this test renders the
 * page's own specimen shape verbatim from its `source`:
 *
 *   <div className="bloom-cosmic ..."><span className="starfield" aria-hidden />…</div>
 *
 * and separately confirms `Alert` (`components/ui/alert.tsx`), one of the two
 * named real hosts, composes the same two pieces itself.
 *
 * What is provable in jsdom: both utilities exist as real CSS, the specimen's
 * DOM carries `bloom-cosmic` on the surface and a decorative `.starfield` span
 * as its sibling exactly as documented, and the tree is axe-clean. NOT
 * COVERED: the two gradients actually drifting, the light/dark blend-mode
 * split, and the hover swell — all of that needs real paint, which jsdom does
 * not provide. `e2e/ledger-evidence.spec.ts` opens the live Alert and toast
 * routes in a real browser and is where that visual behaviour is measured.
 *
 * @covers feedback-surface
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const UTILITIES_CSS = readFileSync(join(process.cwd(), "styles/utilities.css"), "utf8");

/** The specimen from the documentation page's `source`, reproduced verbatim. */
function FeedbackSurfaceSpecimen() {
  return (
    <div className="bloom-cosmic relative w-full max-w-sm rounded-xl border border-border bg-popover p-5 shadow-e3">
      <span className="starfield" aria-hidden />
      <p className="type-small relative text-foreground">Pack opened — 3 rare cards inside.</p>
    </div>
  );
}

describe("the classes the page documents are real", () => {
  it("styles/utilities.css declares @utility bloom-cosmic", () => {
    expect(/@utility\s+bloom-cosmic\b/.test(UTILITIES_CSS)).toBe(true);
  });

  it("styles/utilities.css declares a .starfield rule", () => {
    expect(/\.starfield\s*\{/.test(UTILITIES_CSS)).toBe(true);
  });
});

describe("feedback-surface", () => {
  it("the specimen mounts bloom-cosmic on the surface and .starfield as its sibling", () => {
    const { container } = render(<FeedbackSurfaceSpecimen />);

    const surface = container.firstElementChild as HTMLElement;
    expect(surface.className.split(/\s+/)).toContain("bloom-cosmic");

    const stars = surface.querySelector(":scope > .starfield");
    expect(stars, "the .starfield span must be a direct child of the bloom-cosmic surface").not.toBeNull();
    expect(stars).toHaveAttribute("aria-hidden");
  });

  it("Alert, one of the two named real hosts, composes the same two pieces", () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Pack opened</AlertTitle>
        <AlertDescription>3 rare cards inside.</AlertDescription>
      </Alert>,
    );

    const alert = container.querySelector('[data-slot="alert"]');
    expect(alert?.className).toMatch(/\bbloom-cosmic\b/);
    expect(container.querySelector('[data-slot="alert-stars"].starfield')).not.toBeNull();
  });

  it("axe: the specimen carries no violations", async () => {
    const { container } = render(<FeedbackSurfaceSpecimen />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
