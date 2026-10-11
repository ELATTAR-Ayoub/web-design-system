/**
 * Focused test for the `media-scrim` capability.
 *
 * `media-scrim` in `styles/utilities.css` is a bottom-up gradient ramp (transparent through the upper
 * half, rising to a readable edge) applied to the element that covers a
 * photograph or video so composed copy stays legible without an opaque card
 * under it. `components/docs/component-docs/media-scrim/page.tsx` records
 * that this once had no web utility and no page — so the risk this test
 * protects against is regression back to that state: the utility being renamed, dropped, or losing the `color`
 * declaration that sets `--media-foreground` for the composed title, any one
 * of which would leave a caller's white copy silently unreadable against a
 * bright photograph with nothing in a type system to catch it.
 *
 * The page does not export its `ScrimSpecimen` function (only `spec` is
 * exported from `component-docs/media-scrim/page.tsx`), so this test rebuilds
 * the minimal host from the page's own `source` string field — the figure /
 * img / figcaption shape the page documents, with the figcaption wearing
 * `media-scrim` exactly as shown.
 *
 * NOT COVERED HERE: jsdom does not paint, so the actual rendered gradient
 * (its stops, its `color-mix()` alphas, and the resulting contrast of white
 * text against the composited image) cannot be asserted here — that is a
 * Playwright/visual claim, and the page's own Responsive section records it
 * was measured manually at four widths and 200% zoom. No e2e spec currently
 * exercises `media-scrim` (checked `e2e/batch4.spec.ts`; it does not
 * reference it), so the composited-contrast
 * claim is unverified beyond this class/structure check until one is
 * written.
 *
 * @covers media-scrim
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";

/**
 * The real specimen from
 * `components/docs/component-docs/media-scrim/page.tsx`'s `source` field,
 * reproduced verbatim (that function is not exported from the page module).
 */
function ScrimSpecimen() {
  return (
    <figure className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element -- the specimen
          under test is a CSS utility on a plain image, as the page ships it. */}
      <img
        src="/imgs/sample-photo.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <figcaption className="media-scrim absolute inset-0 flex flex-col justify-end p-6">
        <p className="type-h3">Eclipse Vault</p>
        <p className="type-small opacity-90">12 cards · opens in 2 days</p>
      </figcaption>
    </figure>
  );
}

const UTILITIES_CSS = readFileSync(
  join(process.cwd(), "styles/utilities.css"),
  "utf8",
);

describe("media-scrim: the utility is real and sets both the ramp and the foreground", () => {
  it("is defined as an @utility in styles/utilities.css", () => {
    const match = UTILITIES_CSS.match(/@utility media-scrim\s*\{([^}]*)\}/);
    expect(match, "@utility media-scrim not found in styles/utilities.css").not.toBeNull();
    // The ramp: a linear-gradient background.
    expect(match?.[1]).toMatch(/background-image:\s*linear-gradient/);
    // The theme-independent ink pair, so composed copy never lands foreground-on-foreground.
    expect(match?.[1]).toMatch(/color:\s*var\(--media-foreground\)/);
  });
});

describe("media-scrim: the documented specimen wears the class on the covering element", () => {
  it("figcaption, not the img, carries media-scrim", () => {
    const { container } = render(<ScrimSpecimen />);
    const figure = container.querySelector("figure");
    expect(figure).toBeInTheDocument();

    const img = figure?.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img?.className ?? "").not.toMatch(/\bmedia-scrim\b/);

    const caption = figure?.querySelector("figcaption");
    expect(caption).toBeInTheDocument();
    expect(caption?.className).toMatch(/\bmedia-scrim\b/);
  });

  it("the composed title and subtitle live inside the scrim", () => {
    const { getByText } = render(<ScrimSpecimen />);
    expect(getByText("Eclipse Vault").closest(".media-scrim")).not.toBeNull();
    expect(getByText(/12 cards/).closest(".media-scrim")).not.toBeNull();
  });

  it("axe: the specimen composed over the image", async () => {
    const { container } = render(<ScrimSpecimen />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
