/**
 * A tiny CSS reader for `styles/typeset.css`.
 *
 * Text parsing on purpose: the two typography tests assert what the SOURCE
 * says, and a jsdom stylesheet would answer with whatever it managed to parse
 * rather than with what is written. The browser-level assertion — that the
 * computed size actually flips at 768 and 1024 — lives in `e2e/typography.spec.ts`,
 * which is the only place that can prove it.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Rule = {
  /** The selector list, exactly as written. */
  selector: string;
  /** Enclosing `@media` conditions, outermost first. */
  media: string[];
  /** Declarations in source order, later winning. */
  decls: Record<string, string>;
};

/** Comment bodies blanked, newlines kept, so prose about a rule is not a rule. */
export function stripComments(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
}

function declarations(body: string): Record<string, string> {
  // Nested blocks are rules, not declarations of this one.
  let flat = "";
  let depth = 0;
  for (const ch of body) {
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    else if (depth === 0) flat += ch;
  }
  const out: Record<string, string> = {};
  for (const part of flat.split(";")) {
    const at = part.indexOf(":");
    if (at < 0) continue;
    const prop = part.slice(0, at).trim();
    const value = part.slice(at + 1).trim();
    if (!prop || !value) continue;
    out[prop] = value;
  }
  return out;
}

export function parse(css: string, media: string[] = []): Rule[] {
  const rules: Rule[] = [];
  let head = "";
  let i = 0;
  while (i < css.length) {
    const ch = css[i];
    if (ch === "{") {
      let depth = 1;
      let j = i + 1;
      for (; j < css.length && depth > 0; j++) {
        if (css[j] === "{") depth++;
        else if (css[j] === "}") depth--;
      }
      // A statement at-rule — `@import …;`, `@custom-variant …;` — ends at its
      // semicolon and is not part of the next rule's selector. Without this,
      // the first block after one inherits its text and looks like an at-rule,
      // which is how `tokens.css`'s whole `@theme` block once parsed as
      // nothing at all: `@custom-variant dark (…);` sat between `@font-face`
      // and it, so the selector read `@custom-variant …; :root` and was
      // skipped for starting with `@`.
      const lastStatement = head.lastIndexOf(";");
      const selector = head
        .slice(lastStatement + 1)
        .trim()
        .replace(/\s+/g, " ");
      const body = css.slice(i + 1, j - 1);
      if (selector.startsWith("@media")) {
        rules.push(...parse(body, [...media, selector.slice("@media".length).trim()]));
      } else if (/^@(layer|supports|container)\b/.test(selector)) {
        rules.push(...parse(body, media));
      } else if (!selector.startsWith("@")) {
        rules.push({ selector, media, decls: declarations(body) });
      }
      head = "";
      i = j;
    } else if (ch === "}") {
      head = "";
      i++;
    } else {
      head += ch;
      i++;
    }
  }
  return rules;
}

export function readTypeset(): Rule[] {
  const file = join(process.cwd(), "styles", "typeset.css");
  return parse(stripComments(readFileSync(file, "utf8")));
}

/** One custom property's value at each of the three widths. */
export type TokenSteps = { base: string; tablet?: string; desktop?: string };

const TABLET_QUERY = "(width >= 768px)";
const DESKTOP_QUERY = "(width >= 1024px)";

/**
 * Every custom property `styles/tokens.css` declares, at all three widths.
 *
 * `@theme` is rewritten to `:root` before parsing rather than taught to
 * [parse]: a `@theme` block's declarations are direct children of an at-rule,
 * and [parse] only collects declarations that belong to a selector. Rewriting
 * the head is one line and keeps the parser honest about what it models. The
 * cascade is the same either way — Tailwind emits `@theme` into `:root`, and
 * the two media blocks that follow it in the file win on source order at equal
 * specificity, which is exactly what "later declaration wins" reproduces here.
 */
export function readTokenSteps(): Map<string, TokenSteps> {
  const file = join(process.cwd(), "styles", "tokens.css");
  const css = stripComments(readFileSync(file, "utf8")).replace(
    /@theme[^{]*\{/g,
    ":root{",
  );
  const out = new Map<string, TokenSteps>();
  for (const rule of parse(css)) {
    const at =
      rule.media.length === 0
        ? "base"
        : rule.media.includes(DESKTOP_QUERY)
          ? "desktop"
          : rule.media.includes(TABLET_QUERY)
            ? "tablet"
            : null;
    if (at === null) continue;
    for (const [prop, value] of Object.entries(rule.decls)) {
      if (!prop.startsWith("--")) continue;
      const steps = out.get(prop) ?? { base: "" };
      steps[at] = value;
      out.set(prop, steps);
    }
  }
  return out;
}

/**
 * Resolve `var(--x)` against [steps] at one width, falling back to the base
 * declaration the way the cascade does when a media block does not restate a
 * property.
 */
export function resolveToken(
  value: string,
  steps: Map<string, TokenSteps>,
  at: "base" | "tablet" | "desktop",
  seen = new Set<string>(),
): string {
  const m = value.trim().match(/^var\((--[a-z0-9-]+)\)$/);
  if (!m) return value.trim();
  const name = m[1];
  if (seen.has(name)) return value.trim();
  seen.add(name);
  const step = steps.get(name);
  if (!step) return value.trim();
  const next = step[at] ?? step.base;
  return next ? resolveToken(next, steps, at, seen) : value.trim();
}

/** Every rule whose selector list names `.type-<role>`. */
export function rulesFor(rules: Rule[], role: string): Rule[] {
  const name = new RegExp(`(^|,\\s*)\\.type-${role}(?![\\w-])`);
  return rules.filter((r) => name.test(r.selector));
}

/** Every distinct `.type-*` class the stylesheet defines a rule for. */
export function definedRoles(rules: Rule[]): string[] {
  const out = new Set<string>();
  for (const rule of rules) {
    for (const part of rule.selector.split(",")) {
      const m = part.trim().match(/^\.type-([a-z0-9-]+)$/);
      if (m) out.add(m[1]);
    }
  }
  return [...out].sort();
}
