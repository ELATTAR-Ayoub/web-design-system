/**
 * `reveal-bloom` — the two static radial-glow utilities meant to sit behind a
 * surface for a reveal stage or an opening moment: `bloom-action` and
 * `bloom-value` in `styles/utilities.css`. Web-only (no Flutter counterpart),
 * and deliberately distinct from `feedback-surface`'s animated
 * `bloom-cosmic` and from the page-atmosphere glow (Flutter's
 * `background-effect`) — the per-capability audit is what separated these
 * three after they were found sharing one slug.
 *
 * What this test protects against: `components/docs/component-docs/reveal-bloom/page.tsx`
 * documents this as decoration that must NEVER be the only signal a surface
 * is selected or active, and its DOM shape as a purely decorative sibling
 * (`absolute inset-0`, no text of its own) layered behind real foreground
 * content inside a `relative overflow-hidden` host. A regression where the
 * glow div swallows or hides the foreground content, or where the
 * `@utility bloom-action`/`bloom-value` blocks are renamed out from under the
 * page, would not be caught anywhere else in the unit layer. This test
 * renders the same two-panel specimen the page documents, asserts each class
 * is present on its own layer while the foreground text stays in the
 * accessible tree, and confirms both utilities still exist in the
 * stylesheet.
 *
 * NOT covered here: jsdom has no layout or paint, so the actual gradient
 * geometry (`ellipse 70% 60% at 50% 30%`) and the mixed colour stops cannot
 * be measured — that is covered by `e2e/ledger-evidence.spec.ts`, which
 * gathers each capability's rendered evidence from a real browser.
 *
 * @covers reveal-bloom
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

const UTILITIES_CSS = readFileSync(join(process.cwd(), "styles/utilities.css"), "utf8");

function RevealBloomHost() {
  return (
    <>
      <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-xl border border-border bg-background">
        <div className="bloom-action absolute inset-0" />
        <p className="type-badge relative text-muted-foreground">bloom-action</p>
      </div>
      <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-xl border border-border bg-background">
        <div className="bloom-value absolute inset-0" />
        <p className="type-badge relative text-muted-foreground">bloom-value</p>
      </div>
    </>
  );
}

describe("reveal-bloom", () => {
  it.each(["bloom-action", "bloom-value"])("the %s utility is still defined in utilities.css", (cls) => {
    expect(UTILITIES_CSS).toMatch(new RegExp(`@utility\\s+${cls}\\s*\\{`));
  });

  it("both glow layers wear their class, behind real foreground content", () => {
    const { container } = render(<RevealBloomHost />);

    const actionGlow = container.querySelector(".bloom-action");
    const valueGlow = container.querySelector(".bloom-value");
    expect(actionGlow).toBeInTheDocument();
    expect(valueGlow).toBeInTheDocument();

    // The glow is a decorative, empty sibling — not the content itself.
    expect(actionGlow?.textContent).toBe("");
    expect(valueGlow?.textContent).toBe("");

    // The real content it sits behind is still reachable.
    expect(screen.getByText("bloom-action")).toBeInTheDocument();
    expect(screen.getByText("bloom-value")).toBeInTheDocument();
  });

  it("axe: no violations on either panel", async () => {
    const { container } = render(<RevealBloomHost />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
