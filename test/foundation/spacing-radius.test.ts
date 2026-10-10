/**
 * Geometry: the spacing ladder, the corner ladder, the measures, and the floor
 * under every hit target.
 *
 * The counterpart platform states the same geometry in Dart —
 * `flutter-design-system/lib/src/design_system/foundation/spacing.dart` holds
 * `space()`, `Radii`, `LayoutWidths` and `TouchTargets`. Neither side consumes
 * the other; `docs/contracts/flutter-web-foundation-parity.md` is the mapping,
 * and this test asserts the web half of it.
 *
 * The RADIUS values are transcribed here rather than derived, and that is the
 * point of the test: they are the one axis where the two platforms hold the
 * same numbers under the same names, so a silent edit on either side has to
 * show up as a failure somewhere.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

function read(rel: string): string {
  return readFileSync(join(ROOT, ...rel.split("/")), "utf8");
}

function stripComments(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
}

const TOKENS = stripComments(read("styles/tokens.css"));

function value(key: string): string | null {
  const m = new RegExp(`(?:^|[;{])\\s*${key}\\s*:\\s*([^;}]+)`).exec(TOKENS);
  return m ? m[1].trim() : null;
}

/** A CSS length in px. `rem` is resolved at the document's 16px root size. */
function px(raw: string | null): number | null {
  if (raw === null) return null;
  const m = /^(-?[\d.]+)(px|rem)?$/.exec(raw.trim());
  if (!m) return null;
  const n = Number(m[1]);
  return m[2] === "rem" ? n * 16 : n;
}

describe("the spacing ladder", () => {
  /**
   * Tailwind v4's `--spacing` is 0.25rem and this system does not redeclare it,
   * so `gap-6` is 24px and the whole 8-point ladder is expressible as `gap-n`.
   * The assertion is on the INVARIANT rather than on a list of classes: if the
   * base is ever redeclared, every step below silently moves and the ladder in
   * RULES §3 stops being true.
   */
  const LADDER = [4, 8, 12, 16, 24, 32, 40, 48, 64, 80];

  it("leaves the 4px base alone, or declares it as 4px", () => {
    const base = value("--spacing");
    if (base === null) return; // Tailwind's default 0.25rem stands.
    expect(px(base), "--spacing").toBe(4);
  });

  it("expresses every rung of the 8-point ladder as a whole number of base units", () => {
    const base = px(value("--spacing")) ?? 4;
    expect(LADDER.filter((step) => step % base !== 0), "rungs off the base").toEqual([]);
  });

  it("derives --scroll-offset from the header rather than restating it", () => {
    expect(value("--scroll-offset"), "--scroll-offset").toMatch(/--height-site-header/);
  });
});

describe("the corner ladder matches the counterpart platform", () => {
  /** `Radii` in spacing.dart, rung for rung. `xl2/xl3/xl4` are Dart spellings. */
  const RADII: Record<string, number> = {
    "--radius-xs": 2,
    "--radius-sm": 6,
    "--radius-md": 10,
    "--radius-lg": 12,
    "--radius-xl": 16,
    "--radius-2xl": 20,
    "--radius-3xl": 24,
    "--radius-4xl": 32,
    "--radius-pill": 999,
  };

  it("declares every rung", () => {
    expect(Object.keys(RADII).filter((k) => value(k) === null)).toEqual([]);
  });

  it("holds the same number on every rung", () => {
    const wrong = Object.entries(RADII)
      .filter(([k, n]) => px(value(k)) !== n)
      .map(([k, n]) => `${k}: ${value(k)} (expected ${n}px)`);
    expect(wrong).toEqual([]);
  });

  /**
   * `--radius` is the shadcn base every vendored component computes from, and
   * both theme blocks set it. It is numerically the `md` rung; the counterpart
   * platform derives its addon-button corner from that identity, so the two
   * disagreeing here would break an arithmetic relationship rather than a
   * value.
   */
  it("keeps --radius numerically on the md rung in both themes", () => {
    const both = [...TOKENS.matchAll(/(?:^|[;{])\s*--radius\s*:\s*([^;}]+)/g)].map((m) =>
      px(m[1].trim()),
    );
    expect(both.length, "--radius declared per theme").toBe(2);
    expect(new Set(both)).toEqual(new Set([10]));
  });
});

describe("the measures", () => {
  /** `LayoutWidths` and `LayoutHeights`, minus Flutter's own `article` rung. */
  const WIDTHS = [
    "--width-shell",
    "--width-content",
    "--width-page",
    "--width-prose",
    "--width-rail",
    "--width-sidebar",
    "--width-sidebar-mobile",
    "--width-sidebar-icon",
  ];

  it("declares every measure the documentation and the shell are built on", () => {
    expect(WIDTHS.filter((k) => value(k) === null)).toEqual([]);
  });

  it("keeps the collapsed rail on the hit-target floor", () => {
    // 48px: RULES §3 says explicitly that this is the floor from §7 rather
    // than a number that happens to fit an icon.
    expect(px(value("--width-sidebar-icon"))).toBe(48);
  });

  it("keeps the site header a token the scroll offset can read", () => {
    expect(px(value("--height-site-header"))).toBe(64);
  });
});

describe("the minimum interactive target is a token, not a memory", () => {
  /**
   * The global constraint is 44x44 CSS pixels, and the counterpart platform
   * states it as `TouchTargets.minimum`. The web had the number in RULES §7 and
   * in a Flutter file, and nowhere a stylesheet could read it — so a control
   * declaring its own minimum had to write `44px` by hand, which §0 forbids and
   * `check:tokens` would then catch as the symptom of a missing token rather
   * than as the cause.
   */
  it("declares --size-target-min", () => {
    expect(value("--size-target-min"), "--size-target-min").not.toBeNull();
  });

  it("declares it as 44px", () => {
    expect(px(value("--size-target-min"))).toBe(44);
  });
});

describe("the parity document exists and covers geometry", () => {
  const DOC = "docs/contracts/flutter-web-foundation-parity.md";

  it("is written", () => {
    expect(existsSync(join(ROOT, ...DOC.split("/"))), DOC).toBe(true);
  });

  it("maps every radius rung and the target floor", () => {
    if (!existsSync(join(ROOT, ...DOC.split("/")))) return;
    const doc = read(DOC);
    const names = [
      "--radius-xs",
      "--radius-sm",
      "--radius-md",
      "--radius-lg",
      "--radius-xl",
      "--radius-2xl",
      "--radius-3xl",
      "--radius-4xl",
      "--radius-pill",
      "--size-target-min",
    ];
    expect(names.filter((n) => !doc.includes(n)), "geometry tokens absent from the parity doc").toEqual([]);
  });
});
