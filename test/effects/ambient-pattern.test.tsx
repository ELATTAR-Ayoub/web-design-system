/**
 * Focused test for `ambient-pattern` — `.starfield`, documented at
 * `components/docs/component-docs/ambient-pattern/page.tsx`.
 *
 * The doc page's own header comment records the trap this capability shipped
 * once: the registry item is named `ambient-pattern`, but the CSS class has
 * always been `.starfield`, and the page was deleted once on the mistaken
 * belief that nothing implemented "ambient-pattern" under that name. This test
 * exists partly to keep that mapping honest going forward — it asserts against
 * the real class name, not the capability's title.
 *
 * The page's real host is `Alert`, which mounts the sparkle span itself:
 *
 *   <span data-slot="alert-stars" className="starfield" aria-hidden />
 *
 * — exactly what `components/ui/alert.tsx` renders, and exactly what this test
 * mounts and inspects, rather than inventing a different host.
 *
 * What is proven here: the utility is real CSS, `Alert` mounts `.starfield` as
 * a dedicated, `aria-hidden`, non-interactive child in the DOM shape the page
 * documents, and the tree is axe-clean. NOT COVERED: the sway animation, the
 * two-cluster sparkle rendering, and the reduced-motion freeze-in-place
 * behaviour — all of those need real layout, paint and timers, none of which
 * jsdom provides. That visual behaviour is measured in a real-browser e2e
 * spec against the live Alert and ambient-pattern documentation routes.
 *
 * @covers ambient-pattern
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const UTILITIES_CSS = readFileSync(join(process.cwd(), "styles/utilities.css"), "utf8");

describe("the class the page documents is real", () => {
  it("styles/utilities.css declares a .starfield rule", () => {
    expect(/\.starfield\s*\{/.test(UTILITIES_CSS)).toBe(true);
  });
});

describe("ambient-pattern", () => {
  it("Alert mounts .starfield in the DOM shape the page's source shows", () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Your pack is ready</AlertTitle>
        <AlertDescription>Two clusters of sparkles hang off the right corners.</AlertDescription>
      </Alert>,
    );

    const stars = container.querySelector('[data-slot="alert-stars"]');
    expect(stars).not.toBeNull();
    expect(stars!.className.split(/\s+/)).toContain("starfield");
    // Purely decorative: hidden from assistive tech and out of the tab order.
    expect(stars).toHaveAttribute("aria-hidden");
    expect(stars!.tagName.toLowerCase()).toBe("span");
  });

  it("axe: an Alert wearing the pattern carries no violations", async () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Your pack is ready</AlertTitle>
        <AlertDescription>Two clusters of sparkles hang off the right corners.</AlertDescription>
      </Alert>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
