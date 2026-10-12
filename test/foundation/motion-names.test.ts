/**
 * The motion-vocabulary contract.
 *
 * `lib/motion-names.ts` is the map; this is what holds `styles/*.css` and
 * every source file to it.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, sep } from "node:path";
import { expect, it } from "vitest";
import {
  DURATION_TOKENS,
  EASE_TOKENS,
  MOTION_UTILITIES,
  MOTION_KEYFRAMES,
  RETIRED_MOTION_NAMES,
  RETIRED_KEYFRAME_PREFIXES,
} from "@/lib/motion-names";

const css = ["tokens", "typeset", "motion", "utilities"].map((f) => readFileSync(join("styles", `${f}.css`), "utf8")).join("\n");
const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "");
const body = strip(css);

/**
 * `styles/motion.css`'s own `@theme` block, brace-matched exactly the way
 * `test/foundation/token-source.test.ts`'s `themeBlocks` does. The SCALE is
 * what motion.css owns inside this block; a locally scoped variable outside
 * it is a real declaration but not part of the scale, and counting it here
 * would report an unexpected extra token.
 */
const MOTION_CSS = strip(readFileSync(join("styles", "motion.css"), "utf8"));
function themeBlock(text: string): string {
  const m = /@theme\b[^{]*\{/.exec(text);
  if (!m) return "";
  let depth = 1;
  let i = m.index + m[0].length;
  for (; i < text.length && depth > 0; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") depth--;
  }
  return text.slice(m.index + m[0].length, i - 1);
}
const MOTION_THEME = themeBlock(MOTION_CSS);

it("declares no retired motion name", () => {
  for (const n of RETIRED_MOTION_NAMES) expect(body).not.toMatch(new RegExp(`(?<![\\w-])${n.replace(/[-]/g, "\\-")}(?![\\w-])`));
  for (const p of RETIRED_KEYFRAME_PREFIXES) expect(body).not.toMatch(new RegExp(`@keyframes ${p}`));
});

it("declares exactly the mapped tokens, utilities and keyframes", () => {
  const found = (re: RegExp, text: string) => [...text.matchAll(re)].map((m) => m[1]).sort();
  expect(found(/^\s+(--duration-[a-z0-9-]+):/gm, MOTION_THEME)).toEqual(DURATION_TOKENS.map((t) => t.name).sort());
  // The three Tailwind vocabulary repoints (`--ease-in`, `--ease-out`,
  // `--ease-in-out`) are declared in the same `@theme` block, right beside
  // the renamed role tokens they alias onto — they are not in EASE_TOKENS
  // (see that array's own comment) because they are aliases, not roles, so
  // they are added back in by hand here, exactly as that comment says.
  expect(found(/^\s+(--ease-[a-z0-9-]+):/gm, MOTION_THEME)).toEqual(
    [...EASE_TOKENS.map((t) => t.name), "--ease-in", "--ease-out", "--ease-in-out"].sort(),
  );
  expect(found(/@keyframes ([a-z0-9-]+)/g, body)).toEqual(MOTION_KEYFRAMES.map((k) => k.name).sort());
  for (const u of MOTION_UTILITIES) expect(body).toMatch(new RegExp(`@utility ${u.name} `));
});

it("declares no retired --duration-*/--ease-* name outside motion.css's @theme block", () => {
  // A locally scoped variable may live outside the scale's `@theme` block
  // (token-source.test.ts owns that boundary) — this only fails if something
  // OUTSIDE the block names one of the genuinely retired tokens, which
  // `@theme`'s own presence in the same file does not otherwise guard against.
  const outsideTheme = MOTION_THEME ? body.replace(MOTION_THEME, "") : body;
  const found = [...outsideTheme.matchAll(/(?<![\w-])(--(?:duration|ease)-[a-z0-9-]+)\s*:/g)].map(
    (m) => m[1],
  );
  const retired = found.filter((n) => (RETIRED_MOTION_NAMES as readonly string[]).includes(n));
  expect(retired, "retired --duration-*/--ease-* declared outside @theme").toEqual([]);
});

it("no source file uses a retired name", () => {
  const roots = ["app", "components", "lib", "hooks", "test", "e2e", "scripts", "styles"];
  const walk = (d: string): string[] =>
    readdirSync(d, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory()
        ? e.name === "node_modules" || e.name === ".next" || e.name === "public"
          ? []
          : walk(join(d, e.name))
        : [join(d, e.name)],
    );
  const files = roots
    .flatMap(walk)
    .filter(
      (f) =>
        /\.(tsx?|css|mjs|md)$/.test(f) &&
        !f.endsWith("motion-names.ts") &&
        !f.includes("motion-names.test") &&
        // `check-tokens.mjs`'s `retired-motion-name` guard duplicates this
        // same list as plain string literals (it is plain ESM and cannot
        // import the `.ts` map at guard-run time) — that duplication is the
        // rule's whole point, not a live reference to sweep.
        !f.endsWith(join("scripts", "check-tokens.mjs")) &&
        // The avatar owns its own cube-keyframe vocabulary (`lift` / `lift2`
        // in `components/agent/avatar/scenes.ts`), which collides in
        // spelling with the retired `lift` utility this test hunts. It is a
        // component signature, not the shared vocabulary `lift` retired
        // from — exempt the same way `check-tokens.mjs`'s guard is.
        !f.includes(join("components", "agent", "avatar") + sep),
    );
  // Anchored, not a plain `.includes()` — a bare substring check reports
  // `--duration-overlay-enter` as a hit for retired `--duration-overlay` and
  // `anim-shimmer-text` as a hit for retired `anim-shimmer`, which is trap 1
  // from the other side (trap 13): the identifier LOOKS retired and is not,
  // because it is really the tail of a longer, current one. Retired names get
  // both boundaries; retired keyframe prefixes only the leading one, since
  // they are meant to catch any keyframe still carrying a retired prefix.
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
  const NAME_RES = RETIRED_MOTION_NAMES.map(
    (n) => new RegExp(`(?<![\\w-])${escape(n)}(?![\\w-])`),
  );
  const PREFIX_RES = RETIRED_KEYFRAME_PREFIXES.map((p) => new RegExp(`(?<![\\w-])${escape(p)}`));
  const hits = files.flatMap((f) => {
    const s = strip(readFileSync(f, "utf8"));
    return [
      ...RETIRED_MOTION_NAMES.filter((_, i) => NAME_RES[i].test(s)),
      ...RETIRED_KEYFRAME_PREFIXES.filter((_, i) => PREFIX_RES[i].test(s)),
    ].map((n) => `${f}: ${n}`);
  });
  expect(hits).toEqual([]);
});
