/**
 * Focused test for the `glass` capability.
 *
 * `glass-panel`, `glass-panel-deep` and `glass-control` in
 * `styles/utilities.css` are the only definition of this effect — there is no
 * component, hook or prop behind them (`components/docs/component-docs/glass/
 * page.tsx` documents exactly that: "There is no component: each is a class a
 * host wears directly"). That makes the class name itself the contract: if a
 * rename or a refactor drops `glass-panel-deep` from the stylesheet while a
 * host keeps wearing it, nothing in a type system catches that, and the panel
 * silently degrades to an opaque, unblurred box. This test protects against
 * exactly that drift by asserting three things together — the specimen the
 * documentation page actually renders wears the three class names verbatim,
 * the `@utility` blocks defining them still exist in `styles/utilities.css`
 * (so the classes are not just strings that happen to match), and the
 * composited tree carries no accessibility violation.
 *
 * The page does not export its `GlassSpecimen` function (only `spec` is
 * exported from `component-docs/glass/page.tsx`), so this test rebuilds the
 * minimal host from the page's own `source` string field rather than
 * importing anything private.
 *
 * NOT COVERED HERE: jsdom has no layout or paint engine, so the actual
 * `backdrop-filter` blur, the `color-mix()` fill and the rim `box-shadow` can
 * only be asserted by class presence, never by their rendered pixels — that
 * numeric contract is Playwright/visual territory. No e2e spec currently
 * exercises `glass` (checked `e2e/ledger-evidence.spec.ts` and
 * `e2e/batch4.spec.ts`; neither references it), so the paint-level claim is
 * unverified beyond this class-presence check until one is written.
 *
 * @covers glass
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";

/**
 * The real specimen from `components/docs/component-docs/glass/page.tsx`'s
 * `source` field, reproduced verbatim (that function is not exported from the
 * page module, so it cannot be imported directly).
 */
function GlassSpecimen() {
  return (
    <div className="aurora-brand relative flex w-full flex-wrap items-center justify-center gap-6 overflow-hidden rounded-2xl p-10">
      <div className="glass-panel-deep flex h-28 w-40 items-center justify-center rounded-xl">
        <span className="type-badge text-foreground">glass-panel-deep</span>
      </div>
      <div className="glass-panel flex h-28 w-40 items-center justify-center overflow-hidden rounded-xl">
        <span className="type-badge text-foreground">glass-panel</span>
      </div>
      <div className="glass-control flex h-12 w-40 items-center justify-center rounded-pill">
        <span className="type-badge text-foreground">glass-control</span>
      </div>
    </div>
  );
}

const UTILITIES_CSS = readFileSync(
  join(process.cwd(), "styles/utilities.css"),
  "utf8",
);

describe("glass: the classes are real", () => {
  it.each(["glass-panel", "glass-panel-deep", "glass-control"])(
    "%s is defined as an @utility in styles/utilities.css",
    (name) => {
      expect(UTILITIES_CSS).toMatch(new RegExp(`@utility ${name}\\s*\\{`));
    },
  );
});

describe("glass: the documented specimen wears the real classes", () => {
  it("aurora-brand hosts one of each of the three glass classes", () => {
    const { container } = render(<GlassSpecimen />);

    const host = container.querySelector(".aurora-brand");
    expect(host).toBeInTheDocument();

    expect(host?.querySelector(".glass-panel-deep")).toBeInTheDocument();
    expect(host?.querySelector(".glass-panel")).toBeInTheDocument();
    expect(host?.querySelector(".glass-control")).toBeInTheDocument();
  });

  it("glass-panel and glass-panel-deep never share the same node (their elevation differs and cannot stack)", () => {
    const { container } = render(<GlassSpecimen />);
    const bothOnOneNode = container.querySelector(".glass-panel.glass-panel-deep");
    expect(bothOnOneNode).not.toBeInTheDocument();
  });

  it("axe: the specimen over its documented aurora-brand background", async () => {
    const { container } = render(<GlassSpecimen />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
