/**
 * The 17-role typography contract, asserted against the source.
 *
 * THE TABLE IS NOT REPEATED HERE. It used to be — a second copy of the
 * approved px pairs, written out in this file — and that copy is exactly what
 * went stale when Flutter 0.0.3 moved the shared scale. The numbers now come
 * from `lib/ds/platform-contract.ts`, the one checked-in specification both
 * platforms are measured against, so a value can be wrong in one place but
 * never in two places differently.
 *
 * Public typography is EXACTLY seventeen names, and every one of them is
 * responsive at BOTH breakpoints. Roles own shape only —
 * `typography-ownership.test.ts` is the other half of that claim.
 *
 * WHAT THIS TEST CAN AND CANNOT PROVE. It reads the source: which token a role
 * spends, and what that token resolves to inside each media context. It is a
 * text read on purpose, because a jsdom stylesheet answers with whatever it
 * managed to parse rather than with what is written. The computed-value proof
 * — that a real browser flips at 767/768 and 1023/1024 — is
 * `e2e/typography.spec.ts`, which is the only place that can measure it.
 */

import { describe, expect, it } from "vitest";

import { TYPE_BREAKPOINTS, TYPOGRAPHY } from "@/lib/ds/platform-contract";

import {
  definedRoles,
  readTokenSteps,
  readTypeset,
  resolveToken,
  rulesFor,
} from "./typography-parse";

const TABLET = `(width >= ${TYPE_BREAKPOINTS.tablet}px)`;
const DESKTOP = `(width >= ${TYPE_BREAKPOINTS.desktop}px)`;

/** The contract states logical pixels; the stylesheet must write them as rem. */
const rem = (px: number) => `${px / 16}rem`;

const typeset = readTypeset();
const tokens = readTokenSteps();

/** The winning declarations for a role, merged in source order. */
function declared(role: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rule of rulesFor(typeset, role)) Object.assign(out, rule.decls);
  return out;
}

describe("the public type scale is exactly seventeen roles", () => {
  it("defines every contract role and nothing else", () => {
    expect(definedRoles(typeset)).toEqual(TYPOGRAPHY.map((r) => r.role).sort());
  });

  it("declares seventeen roles, not sixteen and not eighteen", () => {
    expect(TYPOGRAPHY).toHaveLength(17);
  });
});

describe.each(TYPOGRAPHY.map((r) => [r.role, r] as const))("%s", (role, spec) => {
  const decls = declared(role);

  it("spends a size token rather than a literal", () => {
    expect(decls["font-size"], "font-size").toBe(`var(--text-${role})`);
    expect(decls["line-height"], "line-height").toBe(`var(--leading-${role})`);
  });

  it.each([
    ["phone", "base"],
    ["tablet", "tablet"],
    ["desktop", "desktop"],
  ] as const)("resolves to the contract's %s size and line height", (label, at) => {
    const step = spec[label === "phone" ? "phone" : label];
    expect(resolveToken(decls["font-size"] ?? "", tokens, at), `${label} font-size`).toBe(
      rem(step.sizePx),
    );
    expect(
      resolveToken(decls["line-height"] ?? "", tokens, at),
      `${label} line-height`,
    ).toBe(rem(step.linePx));
  });

  it("carries the contract's weight", () => {
    expect(decls["font-weight"]).toBe(String(spec.weight));
  });

  it(`is set in the ${spec.face} face`, () => {
    expect(decls["font-family"]).toBe(`var(--font-${spec.face})`);
  });

  it("carries the contract's tracking, through a token when it is not normal", () => {
    const written = decls["letter-spacing"] ?? "";
    if (spec.tracking === "normal") {
      expect(written).toBe("normal");
      return;
    }
    // Tracking is one indirection deep, the same as size: a role names a
    // token, tokens.css holds the em value. A literal `em` here would be a
    // hardcoded design value in the file that exists to prevent them.
    expect(written, "must name a token").toMatch(/^var\(--tracking-[a-z0-9-]+\)$/);
    expect(resolveToken(written, tokens, "base"), "resolved tracking").toBe(spec.tracking);
  });

  it("uses tabular figures exactly when the contract asks for them", () => {
    const numeric = decls["font-variant-numeric"] ?? "";
    expect(numeric.includes("tabular-nums")).toBe(spec.tabularFigures);
  });
});

describe("responsiveness is complete and lives in one place", () => {
  it("moves every one of the seventeen roles at both breakpoints", () => {
    for (const spec of TYPOGRAPHY) {
      const size = tokens.get(`--text-${spec.role}`);
      const leading = tokens.get(`--leading-${spec.role}`);
      expect(size, `--text-${spec.role} declared`).toBeDefined();
      expect(leading, `--leading-${spec.role} declared`).toBeDefined();
      expect(size?.tablet, `--text-${spec.role} tablet step`).toBeDefined();
      expect(size?.desktop, `--text-${spec.role} desktop step`).toBeDefined();
      expect(leading?.tablet, `--leading-${spec.role} tablet step`).toBeDefined();
      expect(leading?.desktop, `--leading-${spec.role} desktop step`).toBeDefined();
    }
  });

  it("keeps typeset.css free of media queries entirely", () => {
    // The steps moved to tokens.css so `text-<role>` scales with
    // `.type-<role>`. If a media query reappears here, one of them is being
    // moved without the other.
    expect(new Set(typeset.flatMap((r) => r.media))).toEqual(new Set());
  });

  it("uses only the two breakpoints", () => {
    const conditions = new Set<string>();
    for (const steps of tokens.values()) {
      if (steps.tablet !== undefined) conditions.add(TABLET);
      if (steps.desktop !== undefined) conditions.add(DESKTOP);
    }
    expect([...conditions].sort()).toEqual([DESKTOP, TABLET].sort());
  });

  it("never reaches for clamp()", () => {
    const written = TYPOGRAPHY.flatMap((spec) => [
      tokens.get(`--text-${spec.role}`),
      tokens.get(`--leading-${spec.role}`),
    ])
      .flatMap((steps) => [steps?.base, steps?.tablet, steps?.desktop])
      .filter((v): v is string => typeof v === "string");
    expect(written.filter((v) => v.includes("clamp("))).toEqual([]);
  });

  it("writes every step in rem so text zoom keeps working", () => {
    for (const spec of TYPOGRAPHY) {
      for (const prop of [`--text-${spec.role}`, `--leading-${spec.role}`]) {
        const steps = tokens.get(prop);
        for (const value of [steps?.base, steps?.tablet, steps?.desktop]) {
          if (value === undefined) continue;
          expect(value, `${prop} must be rem`).toMatch(/rem$/);
        }
      }
    }
  });
});

describe("Tailwind's own steps track the roles they alias", () => {
  // `text-sm` and `text-xs` are written into sixty vendored shadcn components.
  // Aliasing them to a role means they inherit that role's three steps; the
  // failure this guards against is an alias frozen at one width while the role
  // it points at moves.
  it.each([
    ["--text-xs", "--text-small"],
    ["--text-sm", "--text-small"],
    ["--text-base", "--text-body"],
    ["--text-lg", "--text-lead"],
  ])("%s follows %s", (alias, role) => {
    expect(tokens.get(alias)?.base).toBe(`var(${role})`);
    for (const at of ["base", "tablet", "desktop"] as const) {
      expect(resolveToken(`var(${alias})`, tokens, at)).toBe(
        resolveToken(`var(${role})`, tokens, at),
      );
    }
  });
});
