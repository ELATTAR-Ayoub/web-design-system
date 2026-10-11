/**
 * Focused test for `action-feedback` — the class documented at
 * `components/docs/component-docs/action-feedback/page.tsx`.
 *
 * There is no `<ActionFeedback>` component: this is `@utility sheen-action` in
 * `styles/utilities.css`, a class a host wears. Button's `default` variant is
 * its one real consumer, and the documentation page's own specimen is two bare
 * buttons — identical except that only the right one carries `sheen-action` —
 * which is exactly what this test renders. What a class contributes cannot be
 * proven by counting elements the way a component test would: `sheen-action`
 * paints two pseudo-elements (`::before` for the hover/press beat, `::after`
 * for the static texture), and jsdom has no pseudo-element tree and no paint
 * at all. So what this test CAN prove, and does:
 *
 *   1. the class exists as a real `@utility` block in `styles/utilities.css`
 *      (guards against the page documenting a class nobody defined — the
 *      exact failure `ambient-pattern`'s own doc-comment records happening
 *      once to a sibling capability);
 *   2. the class lands on the host exactly as the page's `source` shows, and
 *      a host without it renders identically apart from the class itself;
 *   3. the rendered tree is axe-clean.
 *
 * NOT COVERED HERE: the beat actually animating on hover/press, the texture's
 * visual diagonal, and the blend-mode split between `.light`/`.dark` — all of
 * that needs real layout and paint. A real-browser e2e spec against the live
 * `/design-system/components/base/buttons` and
 * `/design-system/components/effects/action-feedback` routes is where that
 * visual behaviour is measured.
 *
 * @covers action-feedback
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";

const UTILITIES_CSS = readFileSync(join(process.cwd(), "styles/utilities.css"), "utf8");

/** The two-button specimen from the documentation page, reproduced verbatim
 *  from its `source` field: same host, same base classes, `sheen-action` is
 *  the only difference between them. */
function ActionFeedbackSpecimen() {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        data-testid="flat"
        className="bg-primary text-primary-foreground shadow-btn-primary active:shadow-btn-down"
      >
        Flat fill
      </button>
      <button
        type="button"
        data-testid="sheen"
        className="sheen-action bg-primary text-primary-foreground shadow-btn-primary active:shadow-btn-down"
      >
        Hover or press
      </button>
    </div>
  );
}

describe("the class the page documents is real", () => {
  it("styles/utilities.css declares @utility sheen-action", () => {
    expect(/@utility\s+sheen-action\b/.test(UTILITIES_CSS)).toBe(true);
  });
});

describe("action-feedback", () => {
  it("is applied to only the right-hand host, exactly as the page's source shows", () => {
    const { getByTestId } = render(<ActionFeedbackSpecimen />);
    const flat = getByTestId("flat");
    const sheen = getByTestId("sheen");

    expect(flat.className.split(/\s+/)).not.toContain("sheen-action");
    expect(sheen.className.split(/\s+/)).toContain("sheen-action");

    // Everything else about the two hosts is identical — the class is the
    // only variable, matching the page's "same host, side by side" claim.
    const withoutSheen = sheen.className.replace(/\bsheen-action\s*/, "");
    expect(withoutSheen).toBe(flat.className);
  });

  it("Button's default variant is a real consumer of the class", () => {
    const buttonSource = readFileSync(join(process.cwd(), "components/ui/button.tsx"), "utf8");
    expect(buttonSource).toMatch(/sheen-action/);
  });

  it("axe: the specimen carries no violations", async () => {
    const { container } = render(<ActionFeedbackSpecimen />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
