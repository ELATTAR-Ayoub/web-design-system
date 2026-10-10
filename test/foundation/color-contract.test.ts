/**
 * The colour contract, as source shape.
 *
 * This is the half of RULES §1 a build can check without a browser: that every
 * semantic role EXISTS in both theme blocks, that the `-ink` contract is
 * complete, that no raw state hue is spent as `color:`, and that no colour
 * token is named for a hue rather than for its role.
 *
 * It deliberately does NOT check contrast. A ratio is a rendered property of a
 * pair of resolved colours, and half of them are `color-mix(in oklab, …)`,
 * which cannot be parsed as RGB (trap 7) — that measurement belongs to the
 * browser, to `useContrast` on `/design-system/colors`, and to the rasterising
 * probe in the task report. What lives here is presence and naming, which is
 * exactly what silently rots when a theme block is edited on one side only.
 *
 * The counterpart platform is `flutter-design-system`, whose `ThemeTokens`
 * carries the same roles under Dart names. The mapping is written down in
 * `docs/contracts/flutter-web-foundation-parity.md`; neither platform consumes
 * the other's implementation, so this test asserts the WEB side of that table
 * rather than reading Dart.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

function read(rel: string): string {
  return readFileSync(join(ROOT, ...rel.split("/")), "utf8");
}

/** Comment bodies blanked, newlines kept, so prose about a token is not a token. */
function stripComments(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
}

const TOKENS = stripComments(read("styles/tokens.css"));

/** The body of the first rule whose selector list matches `selector`. */
function block(source: string, selector: RegExp): string {
  const open = new RegExp(`(^|\\})\\s*(${selector.source})\\s*\\{`, "m");
  const m = open.exec(source);
  if (!m) return "";
  let depth = 1;
  let i = m.index + m[0].length;
  for (; i < source.length && depth > 0; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") depth--;
  }
  return source.slice(m.index + m[0].length, i - 1);
}

/** Every custom property DECLARED (not merely referenced) in a block body. */
function declared(body: string): Set<string> {
  return new Set(
    [...body.matchAll(/(?:^|[;{])\s*(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]),
  );
}

const light = declared(block(TOKENS, /:root\s*,\s*\.light/));
const dark = declared(block(TOKENS, /\.dark/));

/**
 * The semantic roles both themes must answer for.
 *
 * Derived from the Flutter `ThemeTokens` field list, which is the semantic
 * counterpart: every field there that is a THEME-RESOLVED colour has a web
 * custom property here. Platform-only members are excluded by construction —
 * Flutter's `kind` is a mode enum, and the web's `--radius` is a length.
 */
const SEMANTIC_SURFACES = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--border",
  "--input",
  "--page-glow",
  "--primary",
  "--primary-foreground",
  "--ring",
  "--destructive",
  "--destructive-foreground",
  "--sidebar",
  "--sidebar-foreground",
  "--sidebar-primary",
  "--sidebar-primary-foreground",
  "--sidebar-accent",
  "--sidebar-accent-foreground",
  "--sidebar-border",
  "--sidebar-ring",
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
  "--agent",
  "--agent-muted",
  "--scrim",
  "--bubble-tinted",
  "--bubble-tinted-hover",
  "--ink-1",
  "--ink-2",
  "--ink-3",
  "--ink-4",
  "--rim",
  "--rim-strong",
  "--wall",
  "--bloom-void",
];

/**
 * §1.3's contract, in full. Each of these is "the end of this ramp that reads
 * on THIS theme's surface", so each must be answered by both blocks — a role
 * declared in one theme only is the exact failure that made `text-warning`
 * unreadable on white for the life of the light theme.
 */
const INK_ROLES = [
  "--action-ink",
  "--value-ink",
  "--success-ink",
  "--warning-ink",
  "--info-ink",
  "--destructive-ink",
];

describe("both theme blocks answer for every semantic role", () => {
  it("declares the theme blocks at all", () => {
    expect(light.size, ":root/.light declarations").toBeGreaterThan(0);
    expect(dark.size, ".dark declarations").toBeGreaterThan(0);
  });

  it("declares every semantic surface and foreground in :root/.light", () => {
    expect(SEMANTIC_SURFACES.filter((t) => !light.has(t))).toEqual([]);
  });

  it("declares every semantic surface and foreground in .dark", () => {
    expect(SEMANTIC_SURFACES.filter((t) => !dark.has(t))).toEqual([]);
  });

  it("declares every -ink role in both themes", () => {
    expect(INK_ROLES.filter((t) => !light.has(t)), "missing from light").toEqual([]);
    expect(INK_ROLES.filter((t) => !dark.has(t)), "missing from dark").toEqual([]);
  });

  /**
   * The `-ink` roles are only reachable from a component if `@theme inline`
   * publishes them as `--color-*`, which is what turns them into
   * `text-action-ink` and friends. A role declared per theme but never
   * published is a token nothing can name (trap 1, from the declaring side).
   */
  it("publishes every -ink role as a --color-* utility key", () => {
    // `--action-ink` is the per-theme answer; `--color-action-ink` is what
    // makes `text-action-ink` a utility. Both halves or neither.
    const missing = INK_ROLES.map((r) => `--color-${r.replace(/^--/, "")}`).filter(
      (k) => !new RegExp(`${k}\\s*:`).test(TOKENS),
    );
    expect(missing, "-ink roles with no --color-* alias").toEqual([]);
  });
});

describe("action and value are separate namespaces, named for role", () => {
  /**
   * Every `--color-*` key tokens.css declares, minus the three Tailwind scale
   * clears — `--color-blue-*: initial` exists precisely so a stock hue CANNOT
   * resolve, which is the opposite of naming a token for a hue.
   */
  const colourKeys = [...TOKENS.matchAll(/(?:^|[;{])\s*(--color-[a-z0-9-]+|--color-[a-z]+-\*)\s*:\s*([^;}]*)/g)]
    .filter(([, , value]) => value.trim() !== "initial")
    .map(([, key]) => key);

  it("declares colour tokens at all", () => {
    expect(colourKeys.length).toBeGreaterThan(0);
  });

  /**
   * The brand has been purple-and-gold and wine-and-amethyst and is blue-and-lime
   * today. A token named for what it looks like becomes a lie on the next move;
   * a token named for what it means does not (RULES §1).
   */
  it("names no colour token for a hue", () => {
    const HUE =
      /(?:^|-)(?:blue|lime|purple|gold|amber|cyan|emerald|red|green|violet|wine|teal|indigo|orange|pink|yellow|zinc|slate|gray|grey)(?:$|-)/;
    expect(colourKeys.filter((k) => HUE.test(k.replace(/^--color-/, "")))).toEqual([]);
  });

  it("keeps the two ramps in separate namespaces", () => {
    for (const ramp of ["action", "value"]) {
      for (const end of ["bright", "dark"]) {
        expect(
          colourKeys,
          `--color-${ramp}-${end}`,
        ).toContain(`--color-${ramp}-${end}`);
      }
      expect(colourKeys, `--color-${ramp}`).toContain(`--color-${ramp}`);
    }
    // The fill of one ramp is never an alias of the other's.
    const value = /--color-value\s*:\s*([^;}]+)/.exec(TOKENS)?.[1] ?? "";
    expect(value).not.toMatch(/--color-action/);
  });
});

describe("no raw state hue is spent as text", () => {
  /**
   * The declaration half of `check:tokens`' `state-colour-as-text` rule, run
   * over the four canonical stylesheets. It is restated here rather than
   * imported because a test that fails on its own terms says which contract
   * broke; the guard says only that the build is red.
   */
  const RAW_AS_TEXT =
    /(?:^|[;{])\s*(?:-webkit-)?(?:color|fill|stroke)\s*:\s*var\(\s*--(?:color-)?(?:success|warning|info|destructive|action-bright|action-dark|value-bright|value-dark)(?![\w-])/g;

  for (const rel of [
    "styles/tokens.css",
    "styles/typeset.css",
    "styles/motion.css",
    "styles/utilities.css",
  ]) {
    it(`${rel} carries no raw state or ramp-end colour on a text property`, () => {
      const hits = stripComments(read(rel)).match(RAW_AS_TEXT) ?? [];
      expect(hits.map((h) => h.trim())).toEqual([]);
    });
  }
});
