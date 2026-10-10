/**
 * The canonical stylesheet boundaries.
 *
 * `app/globals.css` is the entry point `components.json` names, and nothing
 * more: it imports Tailwind, the two vendored stylesheets, and the four files
 * under `styles/` that ARE the system. Each of those four owns exactly one
 * thing, and this test is what keeps the ownership from silently drifting back
 * into one 3700-line file.
 *
 *   styles/tokens.css     @font-face, @custom-variant dark, @theme static,
 *                         @theme inline, the :root/.light/.dark semantic
 *                         blocks, @layer base
 *   styles/typeset.css    every `.type-*` rule and the .prose flow
 *   styles/motion.css     every @keyframes, the duration and easing tokens,
 *                         the motion utilities, both reduced-motion blocks
 *   styles/utilities.css  the remaining sanctioned utilities and surfaces
 *
 * THE OWNERSHIP RULE FOR CUSTOM PROPERTIES, stated precisely because the loose
 * version ("--* only in tokens.css") is wrong: a `@utility` or a component rule
 * may declare a local scoped variable — `--bloom-1`, `--star-glow-size` — and
 * that is not a token. What tokens.css owns is the DECLARING CONTEXT: there is
 * no `@theme` block and no `:root` / `.light` / `.dark` selector block anywhere
 * but tokens.css. The two exceptions the motion split needs are named
 * explicitly below.
 *
 * This is a source-shape test. It cannot prove a class resolves — only the
 * built stylesheet can, and that check belongs to the build. What it proves is
 * that the definition lives where the next reader will look for it.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** Vitest runs from the repository root; these paths are the contract. */
const ROOT = process.cwd();

const ENTRY = "app/globals.css";
const TOKENS = "styles/tokens.css";
const TYPESET = "styles/typeset.css";
const MOTION = "styles/motion.css";
const UTILITIES = "styles/utilities.css";

const OWNED = [TOKENS, TYPESET, MOTION, UTILITIES];
const ALL = [ENTRY, ...OWNED];

function read(rel: string): string {
  return readFileSync(join(ROOT, ...rel.split("/")), "utf8");
}

/** Comment bodies blanked, newlines kept, so prose about a rule is not a rule. */
function stripComments(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
}

const source = new Map<string, string>(ALL.map((rel) => [rel, stripComments(read(rel))]));

/** The body of every `@theme …{ … }` block in a stylesheet, brace-matched. */
function themeBlocks(text: string): string[] {
  const out: string[] = [];
  const open = /@theme\b[^{]*\{/g;
  let m: RegExpExecArray | null;
  while ((m = open.exec(text))) {
    let depth = 1;
    let i = m.index + m[0].length;
    for (; i < text.length && depth > 0; i++) {
      if (text[i] === "{") depth++;
      else if (text[i] === "}") depth--;
    }
    out.push(text.slice(m.index + m[0].length, i - 1));
    open.lastIndex = i;
  }
  return out;
}

/** Every file except the named owner. */
function others(owner: string): string[] {
  return ALL.filter((rel) => rel !== owner);
}

describe("app/globals.css is the entry, not the system", () => {
  const entry = source.get(ENTRY)!;

  it("imports each canonical stylesheet exactly once", () => {
    for (const rel of OWNED) {
      const name = rel.replace("styles/", "");
      const hits = entry.match(new RegExp(`@import\\s+["']\\.\\./styles/${name}["']`, "g")) ?? [];
      expect(hits, `@import "../styles/${name}" in ${ENTRY}`).toHaveLength(1);
    }
  });

  it("imports them in the order tokens → typeset → motion → utilities", () => {
    const at = (rel: string) => entry.indexOf(rel.replace("styles/", "../styles/"));
    const positions = OWNED.map(at);
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("keeps the tailwind and shadcn imports ahead of them", () => {
    const first = Math.min(...OWNED.map((rel) => entry.indexOf(rel.replace("styles/", "../styles/"))));
    for (const vendor of ['"tailwindcss"', '"shadcn/tailwind.css"']) {
      const at = entry.indexOf(`@import ${vendor}`);
      expect(at, `@import ${vendor} present`).toBeGreaterThanOrEqual(0);
      expect(at, `@import ${vendor} before the styles/ imports`).toBeLessThan(first);
    }
  });

  it("holds no @theme, @utility, @keyframes or .type-* rule of its own", () => {
    expect(entry.match(/@theme\b/g) ?? [], "@theme").toHaveLength(0);
    expect(entry.match(/@utility\b/g) ?? [], "@utility").toHaveLength(0);
    expect(entry.match(/@keyframes\b/g) ?? [], "@keyframes").toHaveLength(0);
    expect(entry.match(/\.type-[a-z0-9-]+/g) ?? [], ".type-*").toHaveLength(0);
  });
});

describe("styles/tokens.css owns every declaring context", () => {
  it("is the only file with an @theme block", () => {
    // The motion tokens are the one deliberate exception: a second
    // `@theme static` in motion.css, so `--duration-*` and `--ease-*` sit
    // beside the keyframes they time. Tailwind merges the two blocks.
    const allowed = new Set([TOKENS, MOTION]);
    for (const rel of ALL) {
      const hits = source.get(rel)!.match(/@theme\b/g) ?? [];
      if (allowed.has(rel)) continue;
      expect(hits, `@theme in ${rel}`).toHaveLength(0);
    }
    expect((source.get(TOKENS)!.match(/@theme\b/g) ?? []).length).toBeGreaterThan(0);
  });

  it("is the only file with a :root / .light / .dark selector block", () => {
    // `.dark X` and `:root X` are DESCENDANT selectors — a theme-conditional
    // override of some other rule, not a place tokens are declared. Only a
    // block whose selector list is made of the bare theme roots counts.
    const ROOT_BLOCK = /(^|\})\s*((?:(?::root|\.light|\.dark)\s*,\s*)*(?::root|\.light|\.dark))\s*\{/g;
    for (const rel of others(TOKENS)) {
      const text = source.get(rel)!;
      ROOT_BLOCK.lastIndex = 0;
      const hits = [...text.matchAll(ROOT_BLOCK)].map((m) => m[2].trim());
      expect(hits, `bare :root/.light/.dark block in ${rel}`).toEqual([]);
    }
    expect(
      [...source.get(TOKENS)!.matchAll(ROOT_BLOCK)].length,
      "tokens.css declares the theme blocks",
    ).toBeGreaterThan(0);
  });

  it("is the only file with an @font-face or @custom-variant", () => {
    for (const rel of others(TOKENS)) {
      expect(source.get(rel)!.match(/@font-face\b/g) ?? [], `@font-face in ${rel}`).toHaveLength(0);
      expect(
        source.get(rel)!.match(/@custom-variant\b/g) ?? [],
        `@custom-variant in ${rel}`,
      ).toHaveLength(0);
    }
    // One face is loaded here: Inter, the words face. Geist Mono arrives from
    // the `geist` package at runtime, and the second `@font-face` this used to
    // expect was Redaction — the display serif the retired `accent` role
    // needed, removed with that role by the seventeen-role contract.
    expect((source.get(TOKENS)!.match(/@font-face\b/g) ?? []).length).toBe(1);
  });
});

describe("styles/typeset.css owns the type scale", () => {
  /**
   * A role is DEFINED by a rule whose selector begins with `.type-`. A rule
   * that only scopes one under something else is not a definition and is
   * allowed to live with the block it belongs to. Same distinction the theme
   * blocks get above: `:root {` declares, `:root .bloom-cosmic` overrides.
   */
  const DEFINES_TYPE = /(?:^|[{}]|,)\s*\.type-[a-z0-9-]+/g;

  it("is the only file DEFINING a .type-* role", () => {
    for (const rel of others(TYPESET)) {
      const hits = source.get(rel)!.match(DEFINES_TYPE) ?? [];
      expect([...new Set(hits.map((h) => h.trim()))], `.type-* defined in ${rel}`).toEqual([]);
    }
    expect((source.get(TYPESET)!.match(DEFINES_TYPE) ?? []).length).toBeGreaterThan(0);
  });

  /**
   * Every size token has a role that spends it.
   *
   * `styles/tokens.css` declares the size scale as `--text-<name>`; typeset.css
   * is supposed to publish a `.type-<name>` for each. A `--text-*` with no role
   * is a size nothing can reach without writing it by hand, which is the exact
   * pressure that produces an arbitrary font size at a call site — and
   * `check:tokens` would then catch the symptom rather than this cause.
   *
   * (The arbitrary value is deliberately not spelled out, and this paragraph
   * cannot spell it out either. `test/` is scanned by Tailwind like any other
   * tracked directory, so NAMING an arbitrary-value class in a comment emits a
   * rule for it — this comment did exactly that on its first draft, adding 30
   * bytes of dead CSS to the bundle. Same failure the markdown `@source not`
   * in `app/globals.css` exists to prevent, one directory over.)
   *
   * DERIVED FROM THE FILES, never a list: Task 4 rewrites the roles wholesale,
   * and a hardcoded roster would have to be rewritten with them (and would
   * quietly stop meaning anything if it were not).
   *
   * The four Tailwind step aliases are excluded structurally rather than by
   * name. `--text-sm: var(--text-small)` repoints Tailwind's OWN scale at ours;
   * it is an alias, not a role, and §2.1 is explicit that `text-sm` is not a
   * violation. The test for "is this an alias" is its value: a `--text-*` whose
   * value is itself a `var(--text-…)` reference.
   */
  it("publishes a .type-* role for every size token tokens.css declares", () => {
    const SIZE = /(?<![\w-])--text-([a-z0-9-]+)\s*:\s*([^;}]+)/g;
    const roles = new Set(
      [...source.get(TYPESET)!.matchAll(/(?:^|[{}]|,)\s*\.type-([a-z0-9-]+)/g)].map((m) => m[1]),
    );

    const orphans: string[] = [];
    for (const [, name, value] of source.get(TOKENS)!.matchAll(SIZE)) {
      if (/var\(\s*--text-/.test(value)) continue; // a Tailwind step alias
      if (!roles.has(name)) orphans.push(`--text-${name}`);
    }

    expect(roles.size, "typeset.css defines roles at all").toBeGreaterThan(0);
    expect(orphans, "size tokens with no .type-* role").toEqual([]);
  });

  it("leaves no .type-* rule in app/globals.css", () => {
    expect(source.get(ENTRY)!.match(/\.type-[a-z0-9-]+/g) ?? []).toHaveLength(0);
  });
});

describe("styles/motion.css owns time", () => {
  it("is the only file containing @keyframes", () => {
    for (const rel of others(MOTION)) {
      expect(source.get(rel)!.match(/@keyframes\b/g) ?? [], `@keyframes in ${rel}`).toHaveLength(0);
    }
    expect((source.get(MOTION)!.match(/@keyframes\b/g) ?? []).length).toBeGreaterThan(0);
  });

  it("is the only file whose @theme declares a duration or easing key", () => {
    // The SCALE is what motion.css owns — the keys inside an `@theme` block,
    // which are what generate `duration-*` / `ease-*` utilities and land in the
    // emitted `:root`. A locally scoped variable in the same namespace is a
    // different thing: it generates no utility, reaches no other element,
    // and is not the system's motion scale.
    const DECL = /(?<![\w-])--(?:duration|ease)-[a-z0-9-]+\s*:/g;
    for (const rel of ALL) {
      const bodies = themeBlocks(source.get(rel)!);
      const hits = bodies.flatMap((b) => b.match(DECL) ?? []);
      if (rel === MOTION) {
        expect(hits.length, "motion.css declares the scale").toBeGreaterThan(0);
      } else {
        expect([...new Set(hits)], `duration/easing key in an @theme in ${rel}`).toEqual([]);
      }
    }
  });

  /**
   * The `@theme` exception is bounded, not a second tokens.css.
   *
   * motion.css is allowed a `@theme static` block so time is defined beside the
   * keyframes that spend it — and that permission is exactly wide enough for
   * time and no wider. Without this, a colour or a radius could be declared
   * there and every ownership rule above would still pass.
   *
   * `--default-transition-duration` and `--default-transition-timing-function`
   * are in scope: they are Tailwind's own motion defaults, repointed at this
   * scale so a bare `transition-*` utility cannot beat `duration-normal`.
   *
   * `--spring-*` is in scope too: a spring is how long motion takes to settle
   * plus how far it overshoots on the way, which is the same axis as duration
   * and ease, not a new one — RULES §4 records springs as part of the motion
   * scale, and `lib/motion/spring.ts` reads these keys the same way the rest
   * of the system reads `--duration-*` and `--ease-*`.
   */
  it("declares nothing but time inside its @theme block", () => {
    const KEY = /(?<![\w-])(--[a-z0-9-]+)\s*:/g;
    const IN_SCOPE = /^--(?:duration|ease|default-transition|spring)-/;

    const keys = themeBlocks(source.get(MOTION)!).flatMap((b) =>
      [...b.matchAll(KEY)].map((m) => m[1]),
    );

    expect(keys.length, "motion.css @theme declares keys").toBeGreaterThan(0);
    expect(keys.filter((k) => !IN_SCOPE.test(k)), "non-motion key in motion.css @theme").toEqual([]);
  });

  // The avatar owns a second `prefers-reduced-motion` block for its own
  // fifteen cube keyframes, in `components/agent/avatar/avatar.css` — that
  // file is not one of the four canonical stylesheets `ALL`/`others()` walk
  // here, so it never needs excluding from this loop; it simply isn't in
  // scope for a test about `styles/*.css`'s ownership.
  it("owns the prefers-reduced-motion block", () => {
    const RM = /@media\s*\(prefers-reduced-motion/g;
    for (const rel of others(MOTION)) {
      expect(
        source.get(rel)!.match(RM) ?? [],
        `prefers-reduced-motion in ${rel}`,
      ).toHaveLength(0);
    }
    expect((source.get(MOTION)!.match(RM) ?? []).length).toBe(1);
  });
});
