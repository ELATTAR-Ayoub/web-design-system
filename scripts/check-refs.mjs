#!/usr/bin/env node
/**
 * Fails the build on references that resolve to NOTHING.
 *
 * `check-tokens.mjs` is the opposite guard: it finds values written by hand that
 * should have come from the system. This one finds the mirror-image failure —
 * a class or a custom property that was *named* but never *defined*.
 *
 * Both fail silently in the browser, which is what makes them expensive:
 *
 *   - Tailwind emits nothing for a class it does not recognise. No error, no
 *     warning; the element simply renders without the style.
 *   - CSS discards any declaration containing an undeclared `var()`. The whole
 *     declaration, not just the variable.
 *
 * Two of these shipped here on a green build:
 *
 *   `shadow-btn-gold` was renamed to `shadow-btn-lime` by a prose sweep, but the
 *   token is `--shadow-btn-value`. The premium button and badge had no shadow at
 *   all for weeks.
 *
 *   `.type-label` and `.type-micro` painted with `--color-foreground-subtle`,
 *   a token named in a comment and declared nowhere, so both silently inherited
 *   their colour — and every call site had quietly compensated by writing
 *   `text-muted-foreground` beside the class.
 *
 * Run it in CI and before every commit: `npm run check:refs`.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();

/**
 * `styles` joined this list when the system moved out of `app/globals.css`.
 * It matters twice: the four files there are checked for dead references like
 * anything else, and — because `declaredVars` pools declarations from every
 * scanned file — a `var()` written in a component and declared in
 * `styles/tokens.css` has to still resolve.
 */
const ROOTS = ["app", "components", "lib", "hooks", "styles"];

/**
 * The stylesheets that DEFINE things: `@utility`, `.type-*`, `--color-*`.
 *
 * This used to be `app/globals.css` alone, and was the harvest source rather
 * than the scan source — the difference matters. After the split the entry
 * defines nothing at all; it is four `@import`s. Reading only it would leave
 * every utility and every type class in the codebase looking undefined, which
 * is trap 1 inverted: the guard reporting a whole working system as dead.
 *
 * Concatenated in import order so line-anchored patterns (`^\s*\.type-…`,
 * `^\s{2}--…`) behave exactly as they did against the single file.
 */
const CSS_FILES = [
  join(ROOT, "app", "globals.css"),
  join(ROOT, "styles", "tokens.css"),
  join(ROOT, "styles", "typeset.css"),
  join(ROOT, "styles", "motion.css"),
  join(ROOT, "styles", "utilities.css"),
];

/**
 * Component- and site-owned CSS outside the canonical four files — Motion
 * Vocabulary Parity (plan 2026-09-22) moved the docs site's landing-intro /
 * instrument keyframes here specifically so they never reach a consumer
 * through `source-foundation`. `docs-motion.css` spends them as plain
 * classes, not `@utility` (see the file's own header comment for why), so
 * they need their own harvest below rather than falling out of the
 * `@utility` regex the canonical files use.
 *
 * `avatar.css` is NOT here: the avatar's cube keyframes are all
 * `agent-cube-*`, composed at runtime as template-literal `animation`
 * shorthands (`components/agent/avatar/cube.tsx`), never as a class in any
 * of our own namespaces — the `OURS` regex below only matches `anim`,
 * `glow`, `bloom`, `foil`, `sheen`, `ramp`, `glass`, `press`,
 * `toggle-slide`, `swap-roll`, none of which `agent-cube-*` starts with —
 * so nothing in that file was ever a false `dead-utility` finding to fix.
 */
const COMPONENT_CSS_FILES = [join(ROOT, "components", "docs", "docs-motion.css")];

/**
 * Custom properties this codebase legitimately reads without declaring, because
 * something else declares them at runtime.
 *
 * Keeping this list explicit rather than pattern-matching everything unknown is
 * the point: each entry is a claim that some named system sets the value, and a
 * reader can check that claim. A regex that forgave anything unfamiliar would
 * forgive the two real bugs above.
 */
const RUNTIME_DECLARED = new Set([
  // The `geist` package writes this onto <html> as the font loads. Inter is
  // NOT here: it is an `@font-face` in styles/tokens.css, so the stylesheet a
  // consumer installs carries its own sans face.
  "--font-geist-mono",
  // Tailwind's own internals and theme helpers.
  "--spacing",
  "--radius",
  "--default-transition-duration",
  // sonner sets these on the live toast as it lays the stack out.
  "--gap",
  "--width",
  "--initial-height",
  "--lift-amount",
  "--toasts-before",
  "--scale",
  "--y",
  "--swipe-amount-x",
  "--swipe-amount-y",
  // Base UI / Radix positioners measure and set these at open time.
  "--anchor-width",
  "--available-width",
  "--available-height",
  "--transform-origin",
  // AI Elements group C1 (code-block.tsx): shiki's `codeToTokens` bakes a
  // per-token dark-mode colour pair into `token.htmlStyle` as these two
  // custom properties, set inline at paint time — shiki declares them, this
  // codebase only reads them.
  "--shiki-dark",
  "--shiki-dark-bg",
]);

/** Prefixes owned by a library that resolves them itself. */
const RUNTIME_PREFIXES = ["--tw-", "--radix-", "--sonner-"];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx?|css)$/.test(full)) out.push(full);
  }
  return out;
}

const files = ROOTS.flatMap((r) => {
  try {
    return walk(join(ROOT, r));
  } catch {
    return [];
  }
});

/**
 * Blank out comment bodies, keeping every newline so line numbers still match.
 *
 * A line-based check ("does this line start with //") is not enough: a CSS or
 * JSDoc block comment's continuation lines often start with prose, and the
 * first draft of this script duly reported nine violations that were all
 * sentences *about* the very bugs it was written to find. Prose describing a
 * dead token is not a use of it.
 */
function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));
}

const css = CSS_FILES.map((f) => readFileSync(f, "utf8")).join("\n");
const sources = files.map((abs) => ({
  rel: relative(ROOT, abs).split("/").join(sep),
  text: stripComments(readFileSync(abs, "utf8")),
}));
const allText = sources.map((s) => s.text).join("\n");

/* ── What the system defines ───────────────────────────────────────────────── */

/** `@utility foo { … }` in the canonical stylesheets. */
const utilities = new Set([...css.matchAll(/@utility\s+([a-z0-9-]+)/g)].map((m) => m[1]));

/**
 * Plain `.foo { … }` classes in the component-owned CSS files above — the
 * avatar's cube keyframes and the docs site's landing-intro / instrument
 * keyframes are real definitions, just not `@utility` ones, so rule 1
 * (dead-utility) would otherwise flag every one of them as unresolved.
 */
for (const f of COMPONENT_CSS_FILES) {
  const text = readFileSync(f, "utf8");
  for (const m of text.matchAll(/^\s*\.([a-z0-9-]+)\s*[,{]/gm)) utilities.add(m[1]);
}

/**
 * The type scale: `.type-body { … }` in styles/typeset.css.
 *
 * These are plain classes rather than `@utility`, which is why they needed a
 * rule of their own — and why they went unguarded longest. `type-h5` is the
 * shape of the bug: `type-h1` through `type-h4` exist, the fifth never did, and
 * a component asking for it got no size, no weight and no line-height while
 * both guards stayed green. That is trap 1 happening inside the one class
 * family the rules talk about most.
 */
const typeClasses = new Set(
  [...css.matchAll(/^\s*\.(type-[a-z0-9-]+)\s*(?:,|\{)/gm)].map((m) => m[1]),
);

/** Every `--x:` declaration, wherever it is written. */
const declaredVars = new Set([
  // the canonical stylesheets and any other scanned file
  ...[...allText.matchAll(/(?:^|[;{\s])(--[a-z0-9-]+)\s*:/gm)].map((m) => m[1]),
  // Tailwind arbitrary property syntax in a className: `[--cell-size:…]`
  ...[...allText.matchAll(/\[(--[a-z0-9-]+):/g)].map((m) => m[1]),
  // React style objects: `{ "--skeleton-width": width }`
  ...[...allText.matchAll(/["'](--[a-z0-9-]+)["']\s*:/g)].map((m) => m[1]),
]);

/* ── What the code asks for ────────────────────────────────────────────────── */

const findings = [];

/**
 * A class in one of our own namespaces. Tailwind's built-ins are excluded by
 * listing the namespaces WE own — anything matching these prefixes has to have
 * come from the canonical stylesheets, so an unmatched one is definitionally
 * dead.
 */
/*
 * `(?<![\w-])` is load-bearing. A plain `\b` matches after a hyphen, so
 * `--star-glow-size` contained a "match" for `glow-size` and `value-foil-drift`
 * one for `foil-drift`. Requiring that nothing word-ish OR hyphen-ish precedes
 * the namespace is what makes this find whole class names rather than tails of
 * longer identifiers.
 */
const OURS = /(?<![\w-])(anim|glow|bloom|foil|sheen|ramp|glass|press|toggle-slide|swap-roll)-[a-z0-9-]+/g;
/** Tailwind ships these and they are not ours to define. */
const TAILWIND_OWNED = new Set(["animate-in", "animate-out", "animate-none"]);

/**
 * Colour utilities, and the names that are legitimately not colours.
 *
 * `text-`, `border-`, `ring-`, `fill-` and friends are overloaded — the same
 * prefix carries a size, a width, an alignment or a colour depending on what
 * follows. So rather than guess, this checks a name only when it is not one of
 * the many CSS keywords and scale steps those prefixes also accept. Anything
 * left has to resolve to a `--color-*` key or a shadcn semantic token.
 */
const COLOUR_UTILITY =
  /(?<![\w-])(bg|text|border|ring|fill|stroke|divide|outline|decoration|placeholder|caret|from|via|to)-([a-z][a-z0-9-]*(?:\/[\d.]+)?)/g;

const NON_COLOUR_KEYWORDS = new Set([
  // shared keywords
  "current", "transparent", "inherit", "auto", "none", "initial",
  // text-*: alignment, wrapping, transform, decoration, overflow
  "left", "center", "right", "justify", "start", "end", "wrap", "nowrap",
  "balance", "pretty", "ellipsis", "clip", "top", "middle", "bottom",
  "baseline", "sub", "super", "wrap-normal",
  // border-* / divide-* / outline-*: style and sides
  "solid", "dashed", "dotted", "double", "hidden", "collapse", "separate",
  "x", "y", "s", "e", "t", "r", "b", "l",
  // decoration-*
  "underline", "overline", "line-through", "no-underline", "wavy",
  // from-/via-/to- gradient positions
  "0%", "50%", "100%",
  // our own type scale — text-<size> is a font size, not a colour. One key per
  // role in the nineteen-role contract, plus Tailwind's own steps.
  "display", "h1", "h2", "h3", "h4", "h5", "lead", "body", "small", "nav", "badge", "cta",
  "code", "identifier", "number-sm", "number-base", "number-md", "number-lg",
  "number-xl",
  "xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl",
  // CSS values that appear as bare strings in style objects, e.g.
  // `{ boxSizing: "border-box" }` — a value, not a class.
  "box", "content-box", "padding-box", "border-box",
  // `stroke-*` SVG presentation attributes that are not a colour: an arbitrary
  // `transition-[stroke-dashoffset]` (status-mark.tsx's progress ring) reads
  // exactly like a `stroke-` colour utility to this regex, the same
  // `transition-[font-weight,…]` false positive `FONT_NON_FAMILY` above
  // exists to avoid, just for the `stroke` prefix instead of `font`.
  "dashoffset", "dasharray", "linecap", "linejoin", "miterlimit",
]);

/**
 * Pull the quoted strings from a line that are plausibly class lists.
 *
 * The test is that EVERY whitespace-separated token looks like a utility. That
 * is a stricter filter than it sounds: one capital letter, one word ending in a
 * comma or a full stop, and the string is prose rather than a className. It has
 * to be strict, because hyphenated English — "text-safe", "text-entry",
 * "border-radius" — is indistinguishable from a utility in isolation.
 */
const CLASS_TOKEN = /^[a-z0-9!@*&>[\]:/._-]+$/;

/**
 * A looser token test, used by the type rule ONLY.
 *
 * `CLASS_TOKEN` rejects `(`, `=`, `$` and `,`, which means any string holding a
 * variant like `data-[state=open]:…`, an arbitrary value like
 * `bg-[color-mix(…)]`, or a `${}` interpolation is skipped whole — and that is
 * most of the class strings in the vendored components.
 *
 * Widening it for `type-*` is safe in a way that widening it for the colour
 * rule is not. Tried and rejected: allowing those characters everywhere makes
 * the colour rule read CSS property names out of `transition-[…]` and report
 * `border-color`, and it flags real Tailwind utilities like `bg-clip-padding`.
 * `type-` is a distinctive prefix that does not occur inside arbitrary values,
 * so it can afford the wider net.
 */
const CLASS_TOKEN_LOOSE = /^[a-z0-9!@*&>[\]:/._,()=$%{}-]+$/;

/**
 * Everything `font-*` means that is NOT a family.
 *
 * Tailwind's weight scale, its numeric weight steps, the two `font-variant`
 * shortcuts it ships, and the `font-stretch-*` family (matched by prefix at the
 * call site). Anything else after `font-` has to resolve to a `--font-*` token.
 */
const FONT_NON_FAMILY = new Set([
  "thin", "extralight", "light", "normal", "medium", "semibold", "bold",
  "extrabold", "black",
  "100", "200", "300", "400", "500", "600", "700", "800", "900",
  "stretch",
  // CSS PROPERTY NAMES, not classes. `transition-[font-weight,transform]` and
  // tailwind-merge's own `"font-size"` group key are both indistinguishable
  // from a utility once the string is split into tokens, and both were
  // reported by the first draft of this rule. A `--font-size` token would be a
  // pathological name for a typeface anyway.
  "size", "weight", "family", "style", "variant", "face", "display",
  "kerning", "synthesis", "smoothing", "feature-settings",
  "variation-settings", "optical-sizing",
]);

function classStrings(line, token = CLASS_TOKEN) {
  const out = [];
  for (const m of line.matchAll(/["'`]([^"'`]{2,})["'`]/g)) {
    const body = m[1].trim();
    if (!body) continue;
    const tokens = body.split(/\s+/);
    if (tokens.every((tok) => token.test(tok))) out.push(body);
  }
  return out;
}

/**
 * The motion vocabulary map — Motion Vocabulary Parity.
 *
 * Its `before` fields and `RETIRED_MOTION_NAMES`/`RETIRED_KEYFRAME_PREFIXES`
 * arrays are the migration record: they exist specifically to name utilities
 * that no longer resolve, so rule 1 (dead-utility) would otherwise flag every
 * retired class the map documents. That's not a real dead reference — it's
 * the whole point of the file. Mirrors the same exemption in
 * `check-tokens.mjs`'s `retired-motion-name` guard (`MOTION_NAMES_FILE`),
 * which skips this file for the same reason.
 */
const MOTION_NAMES_FILE = join("lib", "motion-names.ts");

/** Every colour name the theme actually defines. */
const colourNames = new Set([
  // `--color-x: …` in the @theme blocks
  ...[...css.matchAll(/--color-([a-z0-9-]+)\s*:/g)].map((m) => m[1]),
  // shadcn semantic tokens, declared bare in the theme blocks
  ...[...css.matchAll(/^\s{2}(--[a-z0-9-]+)\s*:/gm)].map((m) => m[1].slice(2)),
]);

for (const { rel, text } of sources) {
  const lines = text.split(/\r?\n/);

  lines.forEach((line, i) => {
    const t = line.trim();
    // Prose about a class is not a use of it.
    if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) return;

    // 1. Utilities in our own namespaces.
    // Skip lib/motion-names.ts here: its retired-name strings (`before`
    // fields, `RETIRED_MOTION_NAMES`) are history, not live references — see
    // MOTION_NAMES_FILE above.
    for (const hit of rel === MOTION_NAMES_FILE ? [] : (line.match(OURS) ?? [])) {
      if (TAILWIND_OWNED.has(hit) || utilities.has(hit)) continue;
      // `bloom-1` / `bloom-2` are custom properties, not utilities.
      if (declaredVars.has(`--${hit}`)) continue;
      findings.push({
        file: rel,
        line: i + 1,
        kind: "dead-utility",
        hit,
        msg: `no \`@utility ${hit}\` in the styles/*.css files — Tailwind emits nothing for it`,
        snippet: t.slice(0, 110),
      });
    }

    // 2. The type scale must name a class the stylesheet defines.
    //
    // `text-*` is deliberately whitelisted out of the colour rule below (the
    // prefix carries a size as often as a colour), so until this rule existed
    // nothing was looking at typography at all.
    //
    // Class strings only, for the same reason rule 3 does it — the first draft
    // read whole lines and immediately flagged `.type-num-*` out of a sentence
    // in `RULES.md`'s own guidance. Documentation about a class is not a use
    // of it.
    for (const cls of classStrings(line, CLASS_TOKEN_LOOSE)) {
      // `(?<![\w.-])` also rules out `.type-num-*` written as a CSS selector in
      // documentation — the first draft of this rule flagged one out of a
      // sentence in `RULES.md`.
      for (const hit of cls.match(/(?<![\w.-])type-[a-z0-9-]+/g) ?? []) {
        if (typeClasses.has(hit)) continue;
        // `--type-*` custom properties are not classes.
        if (declaredVars.has(`--${hit}`)) continue;
        findings.push({
          file: rel,
          line: i + 1,
          kind: "dead-type",
          hit,
          msg: `no \`.${hit}\` in styles/typeset.css — the element gets no size, weight or line-height`,
          snippet: t.slice(0, 110),
        });
      }
    }

    // 2b. Font-family utilities must name a real --font-* token.
    //
    // This is trap 1 again, and it shipped again: `--font-heading` was deleted
    // with the seventeen-role contract while seven vendored components still
    // carried `font-heading` on their titles. Tailwind emits nothing for a
    // `font-*` family it cannot resolve — verified by grepping the built
    // stylesheet, which had zero occurrences of it — so seven dialog and card
    // titles were carrying a class that did nothing, on a green build.
    //
    // `font-*` is overloaded exactly like `text-*`: the same prefix carries a
    // weight, a stretch, a style and a family. The weights and the other
    // keywords are listed out so anything left has to be a family.
    for (const cls of classStrings(line, CLASS_TOKEN_LOOSE)) {
      // Whole tokens only, variants stripped. Matching anywhere in the string
      // reads CSS property names out of `transition-[font-weight,…]`.
      for (const token of cls.split(/\s+/)) {
        const bare = token.replace(/^.*:/, "").replace(/^!/, "");
        const m = bare.match(/^font-([a-z0-9][a-z0-9-]*)$/);
        if (!m) continue;
        const hit = bare;
        const key = m[1];
        if (FONT_NON_FAMILY.has(key) || key.startsWith("stretch-")) continue;
        if (declaredVars.has(`--font-${key}`)) continue;
        findings.push({
          file: rel,
          line: i + 1,
          kind: "dead-font",
          hit,
          msg: `no \`--font-${key}\` token in the styles/*.css files — Tailwind emits nothing for it and the element keeps whatever face it inherited`,
          snippet: t.slice(0, 110),
        });
      }
    }

    // 3. Shadows must name a real --shadow-* token.
    for (const hit of line.match(/\bshadow-[a-z0-9-]+/g) ?? []) {
      const key = hit.slice("shadow-".length);
      if (/^(none|sm|md|lg|xl|2xl|inner|initial)$/.test(key)) continue;
      if (declaredVars.has(`--shadow-${key}`)) continue;
      // shadow-<colour>/<alpha> and arbitrary values are check-tokens' problem.
      if (key.includes("[") || key.includes("/")) continue;
      if (declaredVars.has(`--color-${key}`) || /^(foreground|background|border|ring|input|primary|card|popover|muted|accent)$/.test(key)) continue;
      findings.push({
        file: rel,
        line: i + 1,
        kind: "dead-shadow",
        hit,
        msg: `no \`--shadow-${key}\` token — the class resolves to nothing`,
        snippet: t.slice(0, 110),
      });
    }

    // 3. Colour utilities must name a colour the theme defines.
    //
    // This was the gap that let `fill-gold` survive the gold→value rename in
    // `icon-swap-demo.tsx`. `check-tokens` did not flag it — "gold" is not one
    // of Tailwind's stock palette names, so its stock-palette rule never
    // matched — and the first version of THIS script only looked at our own
    // effect namespaces. The heart icon simply stopped being filled.
    //
    // Scanned only inside CLASS STRINGS, never raw source. A first attempt read
    // whole lines and reported fifty violations that were almost all English:
    // "the text-safe end", "every text-entry shape", "text-shadow, so it only
    // works on text". Prose is full of hyphenated words that look exactly like
    // utilities, so the only reliable filter is to check where classes actually
    // live.
    for (const cls of classStrings(line)) {
      for (const m of cls.matchAll(COLOUR_UTILITY)) {
        // `bg-blend-*` and `mix-blend-*` are blend modes, not colours.
        if (/^(bg|mix)-blend-/.test(m[0])) continue;
        let name = m[2].replace(/\/[\d.]+$/, "");
        // A leading side or axis is part of the property, not the colour:
        // border-t-transparent, divide-x-border, border-b-0.
        name = name.replace(/^([trblse]|[xy])-/, "");
        if (colourNames.has(name) || NON_COLOUR_KEYWORDS.has(name)) continue;
        // Width and size utilities share these prefixes: border-2, ring-3.
        if (/^\d/.test(name) || /^[trblxyse]$/.test(name)) continue;
        if (/^\[|^\(/.test(name)) continue;
        findings.push({
          file: rel,
          line: i + 1,
          kind: "dead-colour",
          hit: m[0],
          msg: `no \`--color-${name}\` token and no semantic \`--${name}\` — the class resolves to nothing`,
          snippet: t.slice(0, 110),
        });
      }
    }

    // 4. Every var() must reach a declaration.
    for (const m of line.matchAll(/var\((--[a-z0-9-]+)/g)) {
      const name = m[1];
      if (declaredVars.has(name)) continue;
      if (RUNTIME_DECLARED.has(name)) continue;
      if (RUNTIME_PREFIXES.some((p) => name.startsWith(p))) continue;
      findings.push({
        file: rel,
        line: i + 1,
        kind: "undeclared-var",
        hit: name,
        msg: `\`${name}\` is never declared — the whole declaration is dropped`,
        snippet: t.slice(0, 110),
      });
    }
  });
}

if (findings.length === 0) {
  console.log(
    `✓ check:refs — ${files.length} files clean. Every utility, type class, shadow and var() resolves.`,
  );
  process.exit(0);
}

console.error(`\n✗ check:refs — ${findings.length} reference(s) that resolve to nothing:\n`);
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}  [${f.kind}]  ${f.hit}`);
  console.error(`      ${f.msg}`);
  console.error(`      ${f.snippet}\n`);
}
console.error(
  "These fail SILENTLY in the browser — no error, no warning, the style just\n" +
    "never applies. Either define the thing in the styles/*.css file that owns\n" +
    "it — tokens, typeset, motion or utilities — or fix the name.\n" +
    "If a library declares it at runtime, add it to RUNTIME_DECLARED with a note\n" +
    "saying which library and when.\n",
);
process.exit(1);
