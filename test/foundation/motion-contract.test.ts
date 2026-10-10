/**
 * The motion contract.
 *
 * Three claims, each of which has failed silently in a browser before:
 *
 *  1. Every `--duration-*` / `--ease-*` a component or a stylesheet NAMES is
 *     declared somewhere. CSS drops a whole declaration containing an unresolved
 *     variable, without a word (RULES §9.1), so a typo in a curve name is a
 *     transition that simply stops happening.
 *  2. The scale is written down in the parity document, because the counterpart
 *     platform states the same rhythm as `MotionDurations` / `MotionCurves` and
 *     the two can only be kept honest against a table.
 *  3. Reduced motion resolves to the FINAL frame, and a keyframe that ends at
 *     `opacity: 0` freezes to nothing (RULES §9.4). Every one of those must be
 *     accounted for in writing.
 *
 * What this cannot prove: that an animation actually runs, or that a `@utility`
 * class resolves. Only the built stylesheet and a browser answer those, which is
 * what the Playwright reduced-motion project is for.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

function read(rel: string): string {
  return readFileSync(join(ROOT, ...rel.split("/")), "utf8");
}

function stripComments(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
}

const MOTION_RAW = read("styles/motion.css");
const MOTION = stripComments(MOTION_RAW);

/** Every source file that could name a motion token. */
function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(join(ROOT, dir))) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const rel = `${dir}/${entry}`;
    const stat = statSync(join(ROOT, rel));
    if (stat.isDirectory()) walk(rel, out);
    else if (/\.(css|ts|tsx)$/.test(entry)) out.push(rel);
  }
  return out;
}

const SOURCES = ["app", "components", "hooks", "lib", "styles"].flatMap((d) => walk(d));

describe("every motion token a source names is declared", () => {
  /**
   * Declarations are collected from every stylesheet, not only from motion.css'
   * `@theme` — a locally scoped variable is a real declaration even though it
   * generates no utility. What motion.css owns is the SCALE, and
   * `token-source.test.ts` is what asserts that.
   */
  const declarations = new Set<string>();
  for (const rel of SOURCES.filter((r) => r.endsWith(".css"))) {
    for (const m of stripComments(read(rel)).matchAll(
      /(?:^|[;{])\s*(--(?:duration|ease)-[a-z0-9-]+)\s*:/g,
    )) {
      declarations.add(m[1]);
    }
  }

  const references = new Map<string, string[]>();
  for (const rel of SOURCES) {
    for (const m of stripComments(read(rel)).matchAll(
      /var\(\s*(--(?:duration|ease)-[a-z0-9-]+)/g,
    )) {
      references.set(m[1], [...(references.get(m[1]) ?? []), rel]);
    }
  }

  it("collects both sides", () => {
    expect(declarations.size).toBeGreaterThan(0);
    expect(references.size).toBeGreaterThan(0);
  });

  it("resolves every var(--duration-*) and var(--ease-*)", () => {
    const dead = [...references]
      .filter(([name]) => !declarations.has(name))
      .map(([name, files]) => `${name} — named in ${[...new Set(files)].join(", ")}`);
    expect(dead, "motion tokens named but never declared").toEqual([]);
  });

  /**
   * The scale itself lives in motion.css' `@theme static`. A key declared only
   * on a local selector is not part of it and cannot be reached as a
   * `duration-*` / `ease-*` utility.
   */
  it("declares the whole scale inside motion.css' @theme block", () => {
    const theme = /@theme\b[^{]*\{([\s\S]*?)\n\}/.exec(MOTION)?.[1] ?? "";
    const scale = new Set(
      [...theme.matchAll(/(--(?:duration|ease)-[a-z0-9-]+)\s*:/g)].map((m) => m[1]),
    );
    const EXPECTED = [
      "--duration-tick",
      "--duration-fast",
      "--duration-normal",
      "--duration-slow",
      "--duration-overlay-enter",
      "--duration-open",
      "--duration-bloom",
      "--duration-sway",
      "--duration-sway-alt",
      "--ease-emphasized",
      "--ease-enter",
      "--ease-exit",
      "--ease-move",
      "--ease-out-flex",
      "--ease-settle",
      "--ease-standard",
    ];
    expect(EXPECTED.filter((k) => !scale.has(k)), "missing from the scale").toEqual([]);
  });
});

describe("the parity document names the whole motion scale", () => {
  const DOC = "docs/contracts/flutter-web-foundation-parity.md";
  const path = join(ROOT, ...DOC.split("/"));

  it("is written", () => {
    expect(existsSync(path), DOC).toBe(true);
  });

  it("maps every duration and easing token declared in the scale", () => {
    if (!existsSync(path)) return;
    const doc = readFileSync(path, "utf8");
    const theme = /@theme\b[^{]*\{([\s\S]*?)\n\}/.exec(MOTION)?.[1] ?? "";
    const scale = [...theme.matchAll(/(--(?:duration|ease)-[a-z0-9-]+)\s*:/g)].map((m) => m[1]);
    expect(scale.length).toBeGreaterThan(0);
    expect(scale.filter((k) => !doc.includes(k)), "scale keys absent from the parity doc").toEqual([]);
  });
});

describe("reduced motion", () => {
  // The avatar's own block has lived in components/agent/avatar/avatar.css
  // since 2026-09-22 — this file keeps only the system-wide one.
  it("keeps the prefers-reduced-motion block in motion.css", () => {
    expect((MOTION.match(/@media\s*\(prefers-reduced-motion/g) ?? []).length).toBe(1);
  });

  /**
   * The blanket rule collapses an animation to 0.01ms and one iteration, which
   * freezes it at its FINAL frame. That is right for almost everything and
   * catastrophic for a keyframe that finishes invisible: with motion reduced,
   * the element is simply never painted.
   *
   * Three kinds of keyframe legitimately end at `opacity: 0` — an exit (the
   * element is unmounting anyway), a decorative overlay whose resting state IS
   * invisible, and one that is handled explicitly in a reduced-motion block.
   * The rule is not that they must not exist; it is that a reader must be able
   * to find out which kind each one is WITHOUT running a browser. So every one
   * of them has to be named in a `reduced-motion:` annotation in motion.css,
   * beside the keyframe it explains.
   */
  const KEYFRAMES = /@keyframes\s+([\w-]+)\s*\{/g;

  function finalStopEndsHidden(body: string): boolean {
    // The last stop is whichever block's selector list names `to` or `100%`.
    const stops = [...body.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
    const final = stops.filter(([, sel]) => /(^|[\s,])(?:to|100%)(?=$|[\s,])/.test(sel.trim()));
    return final.some(([, , decls]) => /(?:^|[;{\s])opacity\s*:\s*0\s*(?:;|$)/.test(decls));
  }

  const vanishing: string[] = [];
  KEYFRAMES.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = KEYFRAMES.exec(MOTION))) {
    let depth = 1;
    let i = m.index + m[0].length;
    for (; i < MOTION.length && depth > 0; i++) {
      if (MOTION[i] === "{") depth++;
      else if (MOTION[i] === "}") depth--;
    }
    if (finalStopEndsHidden(MOTION.slice(m.index + m[0].length, i - 1))) vanishing.push(m[1]);
  }

  it("finds the keyframes at all", () => {
    // 11 system + 10 surface. A 22nd is a new animation nobody agreed to.
    expect((MOTION.match(/@keyframes/g) ?? []).length).toBe(21);
  });

  /**
   * `reduced-motion: <keyframe> <EXIT|DECORATIVE|HANDLED [.selector]> — why`
   *
   * Parsed out of motion.css' own comments. The grammar is asserted rather than
   * substring-matched, because a classification the test cannot read is a
   * classification the test cannot check.
   */
  const LEDGER = /reduced-motion:\s*([\w-]+)\s+(EXIT|DECORATIVE|HANDLED)((?:\s+\.[\w-]+)?)/g;
  const ledger = new Map<string, { kind: string; selector: string | null }>();
  for (const m of MOTION_RAW.matchAll(LEDGER)) {
    ledger.set(m[1], { kind: m[2], selector: m[3].trim() || null });
  }

  it("accounts in writing for every keyframe that ends invisible", () => {
    expect(
      vanishing.filter((name) => !ledger.has(name)),
      "keyframes ending at opacity: 0 with no reduced-motion ledger entry",
    ).toEqual([]);
  });

  it("gives every HANDLED entry a selector to check", () => {
    const bad = [...ledger].filter(([, v]) => v.kind === "HANDLED" && !v.selector);
    expect(bad.map(([k]) => k), "HANDLED entries with no selector named").toEqual([]);
  });

  /**
   * The check with teeth.
   *
   * An EXIT or DECORATIVE classification is a judgement and the test takes it on
   * trust. HANDLED is a CLAIM ABOUT THIS FILE — "there is an override that keeps
   * this visible" — and a claim about the file can be verified against it. So
   * every HANDLED selector must really appear inside a `prefers-reduced-motion`
   * block, on a rule that really restores a non-zero opacity.
   *
   * Proved to bite: deleting the `.anim-caret` override (or its `opacity: 1`)
   * fails this test while the ledger comment still reads perfectly well, which
   * is exactly the failure a comment-matching test could not see.
   */
  it("backs every HANDLED entry with a real reduced-motion override", () => {
    // The bodies of the `prefers-reduced-motion` at-rules, brace-matched.
    const blocks: string[] = [];
    const open = /@media[^{]*prefers-reduced-motion[^{]*\{/g;
    let a: RegExpExecArray | null;
    while ((a = open.exec(MOTION))) {
      let depth = 1;
      let i = a.index + a[0].length;
      for (; i < MOTION.length && depth > 0; i++) {
        if (MOTION[i] === "{") depth++;
        else if (MOTION[i] === "}") depth--;
      }
      blocks.push(MOTION.slice(a.index + a[0].length, i - 1));
      open.lastIndex = i;
    }
    expect(blocks.length, "prefers-reduced-motion blocks found").toBe(1);

    // Plus the unlayered `.agent-cube-frozen` pair, which is the same override
    // driven by a class instead of the media query. A HANDLED claim is
    // satisfied by either.
    const rules = blocks
      .flatMap((b) => [...b.matchAll(/([^{}]+)\{([^{}]*)\}/g)])
      .map((m) => ({ selector: m[1].trim(), decls: m[2] }));

    const unmet: string[] = [];
    for (const [name, { kind, selector }] of ledger) {
      if (kind !== "HANDLED" || !selector) continue;
      const hit = rules.find(
        (r) =>
          r.selector.includes(selector) &&
          /(?:^|[;{\s])opacity\s*:\s*(?!0\s*(?:;|!|$))[^;]+/.test(r.decls),
      );
      if (!hit) unmet.push(`${name} → ${selector}`);
    }
    expect(
      unmet,
      "HANDLED keyframes whose named selector has no reduced-motion rule restoring opacity",
    ).toEqual([]);
  });
});

describe("no stylesheet outside motion.css owns an animation", () => {
  it("keeps every @keyframes in motion.css", () => {
    /**
     * DEFINING a keyframe is the violation. QUOTING one is not.
     *
     * `components/docs/component-docs/keyframes/page.tsx` and
     * `.../source-foundation/page.tsx` both document the motion system, so both
     * necessarily print the word `@keyframes` inside a code snippet. Flagging
     * them made the page that explains the rule a breach of it — the fourth
     * time in this migration a guard matched text rather than a use.
     *
     * The distinction is the brace: a definition is `@keyframes name {`, and a
     * mention inside a TypeScript string is not followed by an opening block in
     * CSS position. Documentation pages are checked for a definition, never for
     * the word.
     */
    const DEFINES_KEYFRAME = /@keyframes\s+[\w-]+\s*\{/;

    /**
     * Three homes, each with one owner:
     *   styles/motion.css                     the system's 11 + the 7 surface timelines
     *   components/agent/avatar/avatar.css    the avatar's 15 cube signatures — one component's
     *   components/docs/docs-motion.css       this site's landing intro + the motion page's demos
     * The second and third never ship to a consumer through `source-foundation`.
     */
    const ANIMATION_HOMES = new Set([
      "styles/motion.css",
      "components/agent/avatar/avatar.css",
      "components/docs/docs-motion.css",
      // A sheet belongs to an edge and slides from it; the slide is the
      // component's, not the vocabulary's.
      "components/ui/sheet.css",
    ]);
    const strays = SOURCES.filter((rel) => {
      if (ANIMATION_HOMES.has(rel.split("\\").join("/"))) return false;
      const src = stripComments(read(rel));
      return rel.endsWith(".css")
        ? /@keyframes/.test(src)
        : DEFINES_KEYFRAME.test(src);
    }).map((rel) => relative(".", rel));

    expect(
      strays,
      "a keyframe defined outside its home — see ANIMATION_HOMES",
    ).toEqual([]);
  });
});
