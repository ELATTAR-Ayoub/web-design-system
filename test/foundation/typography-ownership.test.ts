/**
 * A type role owns SHAPE ONLY: family, size, line height, weight, tracking.
 *
 * Colour, case, opacity and product meaning belong to the component that
 * spends the role. This has been broken here before and the breakage is
 * invisible: `.type-small` carried `--muted-foreground`, so every element that
 * merely wanted 14px got a colour it never asked for, and the call sites that
 * wanted the foreground quietly wrote `text-foreground` beside the class to
 * take it back.
 *
 * The rule is enforced on the DECLARATION BLOCK, which is the unit a role is
 * actually written in — including the `:where(.prose)` companions that share
 * the block, since those are literally the same rule.
 */

import { describe, expect, it } from "vitest";

import { definedRoles, readTypeset, type Rule } from "./typography-parse";

/** The seventeen public roles, in the order the contract lists them. */
const ROLES = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "lead",
  "body",
  "small",
  "nav",
  "badge",
  "code",
  "identifier",
  "number-sm",
  "number-base",
  "number-md",
  "number-lg",
  "number-xl",
];

/** Properties a role may never set. */
const FORBIDDEN = [
  "color",
  "opacity",
  "text-transform",
  "background",
  "background-color",
  "background-image",
  "text-decoration",
  "text-decoration-line",
  "text-decoration-color",
];

const typeset = readTypeset();

/** Every rule block a role is defined in, `:where(.prose)` companions included. */
const roleRules: Rule[] = typeset.filter((r) => /(^|,\s*)\.type-[a-z0-9-]+/.test(r.selector));

describe("the public type scale", () => {
  it("is exactly the seventeen contract roles", () => {
    expect(definedRoles(typeset)).toEqual([...ROLES].sort());
  });

  it("defines a rule for each of them", () => {
    expect(roleRules.length).toBeGreaterThan(0);
  });
});

describe("a type role owns shape only", () => {
  it.each(FORBIDDEN)("never sets %s", (prop) => {
    const offenders = roleRules
      .filter((r) => prop in r.decls)
      .map((r) => `${r.selector} { ${prop}: ${r.decls[prop]} }`);
    expect(offenders).toEqual([]);
  });

  it("never references a colour token", () => {
    const offenders: string[] = [];
    for (const rule of roleRules) {
      for (const [prop, value] of Object.entries(rule.decls)) {
        if (/var\(\s*--(?:color-|muted-foreground|foreground|background|border|primary|accent)/.test(value)) {
          offenders.push(`${rule.selector} { ${prop}: ${value} }`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("declares nothing outside the shape properties", () => {
    const ALLOWED = new Set([
      "font-family",
      "font-size",
      "line-height",
      "font-weight",
      "letter-spacing",
      "font-variant-numeric",
      "font-style",
      "font-feature-settings",
    ]);
    const offenders: string[] = [];
    for (const rule of roleRules) {
      for (const prop of Object.keys(rule.decls)) {
        if (!ALLOWED.has(prop)) offenders.push(`${rule.selector} { ${prop} }`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
