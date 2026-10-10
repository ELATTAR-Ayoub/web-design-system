/**
 * `surface` — the MACHINE elevation ladder: a family of `--shadow-*` tokens
 * in `styles/tokens.css` (pressed / btn / btn-primary / btn-value / btn-down
 * / chip / key / key-down), each generating a `shadow-*` Tailwind utility.
 * `components/docs/component-docs/surface/page.tsx` is explicit that this is
 * not a component but a token ladder every base control (Input, Select,
 * Slider, Switch, Checkbox, Radio, Button) is built from, and that depth
 * alone must never be the only signal a control is interactive or changed
 * state.
 *
 * What this test protects against: a rename or removal of any `--shadow-*`
 * token in `tokens.css` silently breaking every control built on it, with
 * nothing in the unit layer to notice — these tokens have no importer to
 * type-check against, only a Tailwind class name that either resolves or
 * silently does nothing. This test renders the same four-panel specimen the
 * page documents (pressed / btn / btn-primary / a chip pairing
 * `shadow-chip`), asserts each `shadow-*` class lands on its host, and
 * confirms the token each utility reads still exists in `tokens.css`.
 *
 * NOT covered here: jsdom has no layout or paint, so the actual offsets, blur
 * radii, and per-theme ink swap (the whole point of the page's Effect
 * section — "only the ink changes per theme") cannot be measured — that
 * visual evidence is covered by `e2e/ledger-evidence.spec.ts`.
 *
 * @covers surface
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";

const TOKENS_CSS = readFileSync(join(process.cwd(), "styles/tokens.css"), "utf8");

const SHADOW_TOKENS = [
  "--shadow-pressed",
  "--shadow-btn",
  "--shadow-btn-primary",
  "--shadow-btn-value",
  "--shadow-btn-down",
  "--shadow-chip",
  "--shadow-key",
  "--shadow-key-down",
] as const;

function SurfaceHost() {
  return (
    <>
      <div className="flex h-16 w-28 items-center justify-center rounded-lg border border-input bg-card shadow-pressed">
        <span className="type-badge text-muted-foreground">pressed</span>
      </div>
      <div className="flex h-16 w-28 items-center justify-center rounded-lg border border-input bg-card shadow-btn">
        <span className="type-badge text-muted-foreground">btn</span>
      </div>
      <div className="flex h-16 w-28 items-center justify-center rounded-lg border border-transparent bg-primary shadow-btn-primary">
        <span className="type-badge text-primary-foreground">btn-primary</span>
      </div>
      <div className="ramp-chip flex h-16 w-28 items-center justify-center rounded-pill bg-value/12 shadow-chip">
        <span className="type-badge text-value-ink">chip</span>
      </div>
    </>
  );
}

describe("surface", () => {
  it.each(SHADOW_TOKENS)("the %s token is still defined in tokens.css", (token) => {
    expect(TOKENS_CSS).toMatch(new RegExp(`${token.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}:`));
  });

  it("each documented shadow class lands on its host", () => {
    const { container } = render(<SurfaceHost />);
    expect(container.querySelector(".shadow-pressed")).toBeInTheDocument();
    expect(container.querySelector(".shadow-btn")).toBeInTheDocument();
    expect(container.querySelector(".shadow-btn-primary")).toBeInTheDocument();
    expect(container.querySelector(".shadow-chip")).toBeInTheDocument();
  });

  it("labels the physical read of each panel, so depth is never the only signal", () => {
    const { getByText } = render(<SurfaceHost />);
    expect(getByText("pressed")).toBeInTheDocument();
    expect(getByText("btn")).toBeInTheDocument();
    expect(getByText("btn-primary")).toBeInTheDocument();
    expect(getByText("chip")).toBeInTheDocument();
  });

  it("axe: no violations across all four panels", async () => {
    const { container } = render(<SurfaceHost />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
