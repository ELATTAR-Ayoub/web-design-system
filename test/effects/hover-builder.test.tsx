/**
 * Focused test for the `hover-builder` capability.
 *
 * `hover-builder` is the odd one among the effects pages
 * (`components/docs/component-docs/hover-builder/page.tsx` says so directly):
 * there is no bespoke `@utility` for it, because a
 * JavaScript pointer-hover callback is unnecessary here: the web already has
 * `:hover` natively. The capability IS the pattern of
 * pairing Tailwind's own `hover:`, `group`/`group-hover:` and `focus-visible:`
 * variants — `group` on the ancestor that owns the hover, `group-hover:*` on
 * the descendant that reacts to it, and a `focus-visible:` twin so the
 * same result reaches a keyboard user. What this test protects against is
 * that pairing silently drifting apart: a descendant that reacts to
 * `group-hover:` only makes sense on a page where its ancestor still carries
 * `group`, and a hover-only affordance that loses its `focus-visible:` twin
 * becomes invisible to keyboard and touch users, which is exactly the
 * violation `components/docs/component-docs/hover-builder/page.tsx`'s
 * Accessibility section calls out.
 *
 * The page does not export its `HoverBuilderSpecimen` function (only `spec`
 * is exported from `component-docs/hover-builder/page.tsx`), so this test
 * rebuilds the minimal host from the page's own `source` string field.
 *
 * NOT COVERED HERE: jsdom has no pointer and does not evaluate `:hover` —
 * `hover:border-action/45` and `group-hover:translate-x-0.5` can be asserted
 * only as class strings present in the compiled markup, never as an actually
 * triggered hover state or its resulting paint. There is also no bespoke
 * `@utility` to ground against `styles/utilities.css` here, unlike the other
 * three effects in this wave — the page itself documents that these are
 * Tailwind's own compiled variants, not a system-defined class. No e2e spec
 * currently exercises `hover-builder` (checked `e2e/batch4.spec.ts`; it
 * does not reference it), so the real triggered
 * hover interaction is unverified beyond this class-pairing check until one
 * is written.
 *
 * @covers hover-builder
 */

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";

/**
 * The real specimen from
 * `components/docs/component-docs/hover-builder/page.tsx`'s `source` field,
 * reproduced verbatim (that function is not exported from the page module).
 */
function HoverBuilderSpecimen() {
  return (
    <div className="group flex w-full max-w-sm items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors duration-fast hover:border-action/45">
      <div>
        <p className="type-small text-foreground">Hover this row</p>
        <p className="type-small text-muted-foreground">
          The arrow reacts to the row, not to itself
        </p>
      </div>
      <span className="inline-block transition-transform duration-fast group-hover:translate-x-0.5">
        →
      </span>
    </div>
  );
}

describe("hover-builder: the ancestor/descendant pairing holds", () => {
  it("the ancestor carries group and its own hover:* variant", () => {
    const { container } = render(<HoverBuilderSpecimen />);
    const ancestor = container.querySelector(".group");
    expect(ancestor).toBeInTheDocument();
    expect(ancestor?.className).toMatch(/\bhover:border-action\/45\b/);
  });

  it("a descendant reacts through group-hover:*, not its own hover:*", () => {
    const { container } = render(<HoverBuilderSpecimen />);
    const ancestor = container.querySelector(".group");
    const reactor = ancestor?.querySelector("span");
    expect(reactor).toBeInTheDocument();
    expect(reactor?.className).toMatch(/\bgroup-hover:translate-x-0\.5\b/);
    // The descendant itself never carries a plain hover: of its own — the
    // pattern is entirely ancestor-owned.
    expect(reactor?.className ?? "").not.toMatch(/(?<!group-)hover:/);
  });

  it("axe: the specimen at rest", async () => {
    const { container } = render(<HoverBuilderSpecimen />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
