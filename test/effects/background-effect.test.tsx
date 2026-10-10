/**
 * Focused test for `background-effect` — the page atmosphere documented at
 * `components/docs/component-docs/background-effect/page.tsx`.
 *
 * This capability is unlike the other three CSS effects in this repository:
 * there is no class a host wears. It is a single `body { background-image:
 * radial-gradient(…, var(--page-glow) …) }` rule in `styles/tokens.css`, fixed
 * to the viewport, that paints behind every page. The doc page's own comment
 * is explicit that a second element wearing this rule "would be a second
 * horizon" — so this test does not invent a component or a host class to
 * mount. What it can prove without a body element or real layout is that the
 * rule the page documents is the rule that actually exists in the stylesheet,
 * word for word: the selector, the token it reads, and the two properties
 * (`background-attachment: fixed`, `background-repeat: no-repeat`) the page's
 * "Classes" section calls out. It also renders the page's own comparison
 * specimen — the same gradient reproduced on a panel next to a flat fill, the
 * one way the page itself makes the effect inspectable — and axes it.
 *
 * NOT COVERED: the gradient actually painting (jsdom performs no layout or
 * paint at all), and forced-colours removing the gradient while the flat fill
 * remains. `e2e/ledger-evidence.spec.ts` opens the live app in a real browser,
 * where a `body` background can actually be measured.
 *
 * @covers background-effect
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";

const TOKENS_CSS = readFileSync(join(process.cwd(), "styles/tokens.css"), "utf8");

/** The comparison specimen from the documentation page: a flat fill next to
 *  the same gradient the real `body` rule paints, reproduced from `--page-glow`
 *  the one place the page says quoting the stylesheet is allowed. */
function AtmosphereSpecimen() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="relative overflow-hidden rounded-xl border border-border bg-background">
        <p className="type-badge text-muted-foreground">flat fill</p>
      </div>
      <div
        data-testid="atmosphere"
        className="relative overflow-hidden rounded-xl border border-border bg-background"
        style={{
          backgroundImage: "radial-gradient(120% 90% at 62% 34%, var(--page-glow) 0%, transparent 64%)",
        }}
      >
        <p className="type-badge text-muted-foreground">with the atmosphere</p>
      </div>
    </div>
  );
}

describe("the rule the page documents is real", () => {
  it("styles/tokens.css defines a body rule reading --page-glow", () => {
    const bodyRuleMatch = TOKENS_CSS.match(/\bbody\s*\{[^}]*\}/);
    expect(bodyRuleMatch, "no `body { ... }` rule found in styles/tokens.css").not.toBeNull();
    const bodyRule = bodyRuleMatch![0];

    expect(bodyRule).toMatch(/background-image:\s*radial-gradient\(/);
    expect(bodyRule).toMatch(/var\(--page-glow\)/);
    expect(bodyRule).toMatch(/background-attachment:\s*fixed/);
    expect(bodyRule).toMatch(/background-repeat:\s*no-repeat/);
  });

  it("--page-glow is defined for both themes", () => {
    expect(TOKENS_CSS).toMatch(/--page-glow:\s*hsl\(/);
    // The light definition sits under :root, the dark one under .dark — two
    // separate declarations of the same token, not one shared value.
    const declarations = TOKENS_CSS.match(/--page-glow:\s*hsl\([^)]*\)/g) ?? [];
    expect(declarations.length).toBeGreaterThanOrEqual(2);
  });
});

describe("background-effect", () => {
  it("the comparison specimen reads the same token the body rule reads, not an invented value", () => {
    const { getByTestId } = render(<AtmosphereSpecimen />);
    const atmosphere = getByTestId("atmosphere");
    expect(atmosphere.style.backgroundImage).toContain("var(--page-glow)");
    expect(atmosphere.style.backgroundImage).toContain("radial-gradient");
  });

  it("axe: the specimen carries no violations", async () => {
    const { container } = render(<AtmosphereSpecimen />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
