/** The docs site’s Prism code viewer (components/ds/code-block.tsx) — furniture, not a catalog item. */
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { CodeBlock, STYLED_PRISM_TOKEN_CLASSES } from "@/components/ds/code-block";

/** Real TSX, chosen to exercise well past the original six token classes: a
 * comment, an import, an interface (class-name), a numeric literal, a
 * boolean literal, a function declaration, and a JSX tag carrying an
 * attribute name and a string attribute value. */
const TSX_SAMPLE = [
  "// greet a user",
  'import React from "react";',
  "",
  "interface Props {",
  "  name: string;",
  "  active: boolean;",
  "}",
  "",
  "const count = 2;",
  "const flag = true;",
  "",
  "export function Greeting({ name }: Props) {",
  '  return <div className="greet">Hello, {name}!</div>;',
  "}",
].join("\n");

/** Real CSS, chosen to exercise the classes the TSX sample cannot: an
 * at-rule, a selector, a property, and `!important`. */
const CSS_SAMPLE = [
  "@media (min-width: 768px) {",
  "  .card {",
  "    color: red !important;",
  "  }",
  "}",
].join("\n");

/** Every class an element carries besides the always-present "token". */
function typeClasses(el: Element): string[] {
  return [...el.classList].filter((cls) => cls !== "token");
}

describe("CodeBlock: theme-aware highlighting", () => {
  it("carries the code-highlight utility instead of an inline dark theme", () => {
    const { container } = render(<CodeBlock code="const x = 1;" language="ts" />);
    const pre = container.querySelector("pre");
    expect(pre).toHaveClass("code-highlight");
  });

  it("tokens carry only their Prism class, no baked-in inline colour", () => {
    // `useInlineStyles={false}` is what makes the theme swap possible: a
    // token with an inline `style` attribute (what `vscDarkPlus` produced)
    // cannot answer to `.dark` on the page, because its colour was already
    // decided in JS. Asserting there is no `style` attribute on any token is
    // the same claim §1.3 makes about a mark's colour living in one place.
    const { container } = render(<CodeBlock code="const x = 1;\nreturn x;" language="ts" />);
    const tokens = container.querySelectorAll(".token");
    expect(tokens.length).toBeGreaterThan(0);
    tokens.forEach((token) => {
      expect(token).not.toHaveAttribute("style");
    });
  });

  it("renders identically inside a .dark wrapper — the surface follows --muted, not a baked palette", () => {
    const light = render(<CodeBlock code="const x = 1;" language="ts" />);
    const dark = render(
      <div className="dark">
        <CodeBlock code="const x = 1;" language="ts" />
      </div>,
    );
    // Same classes either side of `.dark` — the colour swap happens entirely
    // in the stylesheet (`--code-*` tokens), never in the component.
    expect(light.container.querySelector("pre")?.className).toBe(
      dark.container.querySelector("pre")?.className,
    );
  });

  it("an unrecognised language still shows a working copy button", () => {
    const { getByRole } = render(<CodeBlock code="plain text" />);
    expect(getByRole("button", { name: "Copy code" })).toBeInTheDocument();
  });

  it("a representative set of TSX/JSX token classes are all styled, not just the original six", () => {
    const { container } = render(<CodeBlock code={TSX_SAMPLE} language="tsx" />);
    const styled = new Set<string>(STYLED_PRISM_TOKEN_CLASSES);

    // The classes bug review named that this sample actually triggers:
    // operator, boolean, class-name, tag, attr-name — plus attr-value and
    // number, which a real component/prop sample cannot help but emit too.
    for (const cls of ["operator", "boolean", "class-name", "tag", "attr-name", "attr-value", "number"]) {
      const el = container.querySelector(`.token.${cls}`);
      expect(el, `expected a .token.${cls} in the rendered TSX`).toBeTruthy();
      expect(styled.has(cls as (typeof STYLED_PRISM_TOKEN_CLASSES)[number])).toBe(true);
    }
  });

  it("a representative set of CSS token classes are all styled", () => {
    const { container } = render(<CodeBlock code={CSS_SAMPLE} language="css" />);
    const styled = new Set<string>(STYLED_PRISM_TOKEN_CLASSES);

    // property/selector/atrule/important were named directly in review;
    // CSS is the only registered grammar that actually emits them.
    for (const cls of ["property", "selector", "atrule", "important"]) {
      const el = container.querySelector(`.token.${cls}`);
      expect(el, `expected a .token.${cls} in the rendered CSS`).toBeTruthy();
      expect(styled.has(cls as (typeof STYLED_PRISM_TOKEN_CLASSES)[number])).toBe(true);
    }
  });

  it("every token TSX and CSS actually emit carries at least one styled class", () => {
    // The stricter claim: not just that the classes named in review exist
    // and are styled, but that NOTHING in these two real samples falls
    // through unstyled. A token with none of its classes in the styled set
    // renders in plain inherited foreground — which is exactly how this bug
    // shipped for the ~21 classes the original six missed.
    const styled = new Set<string>(STYLED_PRISM_TOKEN_CLASSES);
    for (const { code, language } of [
      { code: TSX_SAMPLE, language: "tsx" },
      { code: CSS_SAMPLE, language: "css" },
    ]) {
      const { container } = render(<CodeBlock code={code} language={language} />);
      const uncovered: string[] = [];
      container.querySelectorAll(".token").forEach((token) => {
        const classes = typeClasses(token);
        if (!classes.some((cls) => styled.has(cls as (typeof STYLED_PRISM_TOKEN_CLASSES)[number]))) {
          uncovered.push(classes.join(" ") || "(no type class)");
        }
      });
      expect(uncovered, `${language} tokens with no styled class`).toEqual([]);
    }
  });
});
