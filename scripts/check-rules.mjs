#!/usr/bin/env node
// Front-end rules: typography, colour, motion and components come from the system, never hard-coded.
// `npm run check:rules` prints every violation; test/rules/*.test.ts fail on their own category.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ts = require(path.join(ROOT, "node_modules", "typescript"));

const SOURCE_DIRS = ["app", "components", "lib", "hooks"];


function listFiles() {
  const walk = (dir) =>
    fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((entry) => {
      const rel = `${dir}/${entry.name}`;
      if (entry.isDirectory()) return entry.name === "node_modules" ? [] : walk(rel);
      return /\.(tsx?|css)$/.test(entry.name) ? [rel] : [];
    });
  return SOURCE_DIRS.flatMap(walk);
}

function typeRoles() {
  const css = fs.readFileSync(path.join(ROOT, "styles", "typeset.css"), "utf8");
  return new Set([...css.matchAll(/\.type-([a-z0-9-]+)\s*[,{]/g)].map((m) => m[1]));
}

// ── class-string rules ──────────────────────────────────────────────────────
const CLASS_RULES = {
  typography: [
    [/(?<![\w-])text-(?:xs|sm|base|lg|xl|[2-9]xl)(?![\w-])/g, "stock text size — use a .type-* role"],
    [/(?<![\w-])text-\[(?!CanvasText\]|Canvas\])[^\]]*\]/g, "arbitrary text size — use a .type-* role"],
    [/(?<![\w-])font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)(?![\w-])/g, "stock font weight — the .type-* role carries the weight"],
    [/(?<![\w-])font-(?:mono|sans|serif)(?![\w-])/g, "font family — the .type-* role carries the face"],
    [/(?<![\w-])font-\[[^\]]*\]/g, "arbitrary font — use a .type-* role"],
    [/(?<![\w-])tracking-[\w[\]().-]+/g, "letter-spacing — the .type-* role carries the tracking"],
    [/(?<![\w-])leading-[\w[\]().-]+/g, "line-height — the .type-* role carries the leading"],
    [/(?<![\w-:])(?:uppercase|lowercase|capitalize)(?![\w-])/g, "text-transform — not part of any .type-* role"],
  ],
  colour: [
    [/(?<![\w-])(?:bg|text|border|ring|from|via|to|fill|stroke|shadow|outline|decoration|divide|accent|caret|placeholder|inset-ring)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}(?:\/\d+)?(?![\w-])/g, "Tailwind stock palette — use a semantic colour token"],
    [/(?<![\w-])(?:bg|text|border|ring|from|via|to|fill|stroke|outline|decoration|divide|accent|caret|placeholder)-(?:white|black)(?:\/\d+)?(?![\w-])/g, "literal white/black — use a semantic colour token"],
    [/(?<![\w-])(?:bg|text|border|ring|from|via|to|fill|stroke|shadow|outline|decoration|divide|accent|caret|placeholder)-\[(?![^\]]*var\(--)[^\]]*(?:#|rgba?\(|hsla?\(|oklch\(|oklab\(|color-mix\()[^\]]*\]/g, "arbitrary colour — use a semantic colour token"],
  ],
  motion: [
    [/(?<![\w-])duration-(?:\d+|\[[^\]]*\])(?![\w-])/g, "stock/arbitrary duration — use duration-fast|normal|slow|… from motion.css"],
    [/(?<![\w-])delay-(?:\d+|\[[^\]]*\])(?![\w-])/g, "stock/arbitrary delay — use a motion token"],
    [/(?<![\w-])ease-(?:linear|in|out|in-out|\[[^\]]*\])(?![\w-])/g, "stock/arbitrary easing — use ease-enter|exit|move|standard|… from motion.css"],
    [/(?<![\w-])animate-(?:spin|ping|pulse|bounce|\[[^\]]*\])(?![\w-])/g, "stock animation — use an anim-* utility from motion.css"],
  ],
};

// ── literal rules for any string, inline style and component CSS ───────────
const COLOUR_LITERAL = /(?:^|[:(,]\s*)#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![\w])|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\(\s*[\d.]/;
const TIMING_LITERAL = /\b\d+(?:\.\d+)?m?s\b|cubic-bezier\(|\b(?:ease|ease-in|ease-out|ease-in-out|linear)\b/;
const NAMED_COLOUR = /^(?:white|black|red|green|blue|yellow|orange|purple|pink|gray|grey|silver|gold|navy|teal|cyan|magenta)$/i;

const STYLE_PROPS = {
  typography: /^(?:fontSize|fontWeight|fontFamily|letterSpacing|lineHeight|textTransform|font)$/,
  colour: /^(?:color|background|backgroundColor|borderColor|borderTopColor|borderBottomColor|borderLeftColor|borderRightColor|outlineColor|fill|stroke|boxShadow|textShadow|caretColor|accentColor)$/,
  motion: /^(?:transition|transitionDuration|transitionTimingFunction|transitionDelay|animation|animationDuration|animationTimingFunction)$/,
};

// Elements the system already provides as components (components/ui defines them).
const RAW_ELEMENTS = {
  button: "Button (or a DS trigger)",
  select: "Select / NativeSelect",
  textarea: "Textarea",
  label: "Label",
  kbd: "Kbd",
  table: "Table",
  hr: "Separator",
  progress: "Progress",
  dialog: "Dialog",
};
const RAW_INPUT_OK = /^(?:file|hidden|range|color)$/;

function scanTs(rel, src, out, roles) {
  const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, rel.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const at = (node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
  const seen = new Set();
  const push = (category, node, found, why, offset = 0) => {
    const key = `${category}:${node.getStart(sf) + offset}:${found}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ category, file: rel, line: at(node), found, why });
  };

  const CLASS_CALLEES = new Set(["cn", "cva", "clsx", "twMerge", "tv"]);
  const CODE_PROPS = new Set(["className", "class", "code", "source", "classes", "classNames"]);

  const classText = (node, joiner = " ") => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
    if (ts.isTemplateExpression(node)) return [node.head.text, ...node.templateSpans.map((s) => s.literal.text)].join(joiner);
    return null;
  };

  const checkClassString = (node, text) => {
    for (const [category, rules] of Object.entries(CLASS_RULES)) {
      for (const [re, why] of rules) for (const m of text.matchAll(re)) push(category, node, m[0], why, m.index);
    }
    for (const m of text.matchAll(/(?<![\w-])type-([a-z0-9-]+)(?![\w-])/g)) {
      if (!roles.has(m[1])) push("typography", node, m[0], "not one of the current .type-* roles", m.index);
    }
  };

  // Strings inside class contexts: className attributes, cn/cva/… calls, and code/source sample props.
  const walkClassContext = (node) => {
    const text = classText(node);
    if (text !== null) checkClassString(node, text);
    ts.forEachChild(node, walkClassContext);
  };

  // Names imported from lucide-react, which outside components/ui render through Icon.
  const lucide = new Set();
  for (const stmt of sf.statements) {
    if (!ts.isImportDeclaration(stmt) || stmt.moduleSpecifier.text !== "lucide-react") continue;
    for (const el of stmt.importClause?.namedBindings?.elements ?? []) lucide.add(el.name.text);
  }

  const visit = (node) => {
    // className / code sample attributes
    if (ts.isJsxAttribute(node) && CODE_PROPS.has(node.name.getText(sf)) && node.initializer) {
      walkClassContext(node.initializer);
    }
    // object properties named like class/code samples: { className: "…" }, { code: `…` }, cva variants
    if (ts.isPropertyAssignment(node) && CODE_PROPS.has(node.name.getText(sf).replace(/["']/g, ""))) {
      walkClassContext(node.initializer);
    }
    if (ts.isCallExpression(node) && CLASS_CALLEES.has(node.expression.getText(sf))) {
      node.arguments.forEach(walkClassContext);
    }

    // inline style={{ … }}
    if (ts.isJsxAttribute(node) && node.name.getText(sf) === "style" && node.initializer && ts.isJsxExpression(node.initializer)) {
      const obj = node.initializer.expression;
      if (obj && ts.isObjectLiteralExpression(obj)) {
        for (const p of obj.properties) {
          if (!ts.isPropertyAssignment(p)) continue;
          const key = p.name.getText(sf).replace(/["']/g, "");
          const value = classText(p.initializer, "--x") ?? (ts.isNumericLiteral(p.initializer) ? p.initializer.text : null);
          if (value === null) continue;
          const v = value.replace(/var\(--[\w-]*\)/g, "");
          if (STYLE_PROPS.typography.test(key) && /[\da-z]/i.test(v) && !/^\s*(?:inherit|normal|none|initial|unset)\s*$/.test(v)) {
            push("typography", p, `${key}: ${value}`, "inline typography — use a .type-* role");
          }
          if (STYLE_PROPS.colour.test(key) && (COLOUR_LITERAL.test(v) || v.trim().split(/\s+/).some((w) => NAMED_COLOUR.test(w)))) {
            push("colour", p, `${key}: ${value}`, "inline colour — use a colour token");
          }
          if (STYLE_PROPS.motion.test(key) && TIMING_LITERAL.test(v)) {
            push("motion", p, `${key}: ${value}`, "inline timing — use var(--duration-*) and var(--ease-*)");
          }
        }
      }
    }

    // colour literals anywhere in code strings (not comments)
    const lit = classText(node);
    const plain = lit === null ? null : lit.replace(/--[\w-]+\s*:\s*[^;}\n]+/g, "");
    if (plain !== null && COLOUR_LITERAL.test(plain) && !/^(?:https?:|data:|\/)/.test(plain)) {
      push("colour", node, plain.match(COLOUR_LITERAL)[0].trim(), "hard-coded colour value — use a colour token");
    }

    // raw elements where the system has a component
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && !rel.startsWith("components/ui/")) {
      const tag = node.tagName.getText(sf);
      const attrs = node.attributes.properties;
      const attr = (name) => attrs.find((a) => ts.isJsxAttribute(a) && a.name.getText(sf) === name);
      const parent = node.parent && ts.isJsxElement(node.parent) ? node.parent.parent : node.parent;
      const parentOpening = parent && ts.isJsxElement(parent) ? parent.openingElement : null;
      const hostedByTrigger = parentOpening?.attributes.properties.some((a) => ts.isJsxAttribute(a) && a.name.getText(sf) === "asChild");
      if (RAW_ELEMENTS[tag] && !hostedByTrigger) {
        push("components", node, `<${tag}>`, `raw <${tag}> — use ${RAW_ELEMENTS[tag]}`);
      }
      // A documented exception sits on the line above: `// allow-direct-icon: <reason>`.
      const lineAbove = sf.text.slice(0, node.getStart(sf)).split("\n").slice(-2).join("\n");
      if (lucide.has(tag) && !lineAbove.includes("allow-direct-icon")) {
        push("components", node, `<${tag}>`, `raw Lucide icon — use <Icon icon={${tag}} />`);
      }
      if (tag === "input" && !hostedByTrigger) {
        const type = attr("type");
        const t = type && type.initializer ? classText(type.initializer) : null;
        if (!t || !RAW_INPUT_OK.test(t)) push("components", node, `<input${t ? ` type="${t}"` : ""}>`, "raw <input> — use Input, Checkbox, RadioGroup, Switch or Slider");
      }
    }

    ts.forEachChild(node, visit);
  };
  visit(sf);
}

function scanCss(rel, src, out) {
  const clean = src.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));
  const lines = clean.split("\n");
  lines.forEach((line, i) => {
    const decl = line.match(/^\s*([\w-]+)\s*:\s*([^;{}]+);?/);
    if (!decl || decl[1].startsWith("--")) return;
    const [, prop, value] = decl;
    const add = (category, why) => out.push({ category, file: rel, line: i + 1, found: `${prop}: ${value.trim()}`, why });
    if (/^(?:font-size|font-weight|font-family|letter-spacing|line-height|text-transform|font)$/.test(prop) && !/var\(--/.test(value) && !/^\s*(?:inherit|normal|none|initial)\s*$/.test(value)) {
      add("typography", "hard-coded typography in CSS — use a .type-* role or var(--text-*)");
    }
    if (/(?:^|-)(?:color|background|fill|stroke|shadow)$|^background$|^border(?:-\w+)?$|^outline$/.test(prop) && (COLOUR_LITERAL.test(value) || value.trim().split(/\s+/).some((w) => NAMED_COLOUR.test(w)))) {
      add("colour", "hard-coded colour in CSS — use a colour token");
    }
    if (/^(?:transition|transition-duration|transition-timing-function|transition-delay|animation|animation-duration|animation-timing-function|animation-delay)$/.test(prop)) {
      const raw = value.replace(/var\(--[\w-]+\)/g, "");
      if (/\b\d+(?:\.\d+)?m?s\b/.test(raw) || /cubic-bezier\(|\b(?:ease|ease-in|ease-out|ease-in-out|linear)\b/.test(raw)) {
        add("motion", "hard-coded timing in CSS — use var(--duration-*) and var(--ease-*)");
      }
    }
  });
}

/** Every violation in the source, grouped later by category. */
export function scanRules() {
  const roles = typeRoles();
  const out = [];
  for (const rel of listFiles()) {
    const src = fs.readFileSync(path.join(ROOT, rel), "utf8");
    if (rel.endsWith(".css")) scanCss(rel, src, out);
    else scanTs(rel, src, out, roles);
  }
  return out;
}

export const CATEGORIES = ["typography", "colour", "motion", "components"];

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const all = scanRules();
  const only = process.argv[2];
  const rows = only ? all.filter((v) => v.category === only) : all;
  for (const category of CATEGORIES) {
    const list = rows.filter((v) => v.category === category);
    if (!list.length) continue;
    console.log(`\n${category} — ${list.length}`);
    for (const v of list) console.log(`  ${v.file}:${v.line}  ${v.found}  — ${v.why}`);
  }
  console.log(rows.length ? `\n✗ check:rules — ${rows.length} violation(s)` : "✓ check:rules — typography, colour, motion and components all come from the system.");
  process.exit(rows.length ? 1 : 0);
}
