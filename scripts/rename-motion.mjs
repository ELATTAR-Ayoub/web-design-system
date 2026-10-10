#!/usr/bin/env node
/**
 * The one-pass anchored rename — Motion Vocabulary Parity, Task 3.
 *
 * Reads `lib/motion-names.ts` (the single source of truth for `before` →
 * `name`) and rewrites every call site in one pass: ONE regex built from
 * every retired identifier, anchored with `(?<![\w-])` / `(?![\w-])` so
 * `anim-shimmer` cannot also rewrite `anim-shimmer-text` and `--ease-out`
 * cannot also rewrite `--ease-out-flex` (trap 10).
 *
 * `--dry-run` prints `file:line: before → after` for every change without
 * writing. Without it, the script applies the changes and still prints the
 * same lines.
 *
 * What it does NOT touch, on purpose:
 *   - `//` line comments, `/* *\/` block comments, and backtick-fenced spans
 *     in `.md` files — prose is swept by hand afterward (trap 24), because a
 *     mechanical rename inside a sentence can leave it grammatically intact
 *     and technically false.
 *   - `node_modules`, `.next`, `public` — build output and vendored code.
 *   - the plan and history documents, dated before this plan; global
 *     constraints forbid renaming them.
 *   - `lib/motion-names.ts` itself — its whole job is to record the `before`
 *     names.
 *   - `CHANGELOG.md` — the one place the global constraints allow retired
 *     names to still appear, as a migration record.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep, extname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");

const DRY_RUN = process.argv.includes("--dry-run");

/* ── Roots walked, and what is excluded within them ───────────────────── */

const ROOTS = ["app", "components", "lib", "hooks", "test", "e2e", "scripts", "styles", ".claude"];

const EXCLUDED_DIRS = new Set(["node_modules", ".next", "public"]);

/** Absolute-relative paths (POSIX-joined) never touched, whole file. */
const EXCLUDED_FILES = new Set([
  "lib/motion-names.ts",
  "CHANGELOG.md",
]);

/** A directory prefix never touched, whole subtree — history. */
const EXCLUDED_PREFIXES = ["docs/superpowers/"];

function toPosix(rel) {
  return rel.split(sep).join("/");
}

function isExcluded(relPosix) {
  if (EXCLUDED_FILES.has(relPosix)) return true;
  return EXCLUDED_PREFIXES.some((p) => relPosix.startsWith(p));
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (EXCLUDED_DIRS.has(entry)) continue;
    // Dotdirs are walked deliberately for `.claude` (passed as a ROOT itself)
    // but skipped everywhere else Node's own hidden dirs might appear.
    if (entry.startsWith(".") && entry !== ".claude") continue;
    const full = join(dir, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(full, out);
    else if (/\.(tsx?|jsx?|css|md|mdx)$/.test(full)) out.push(full);
  }
  return out;
}

/* ── Build the rename map from lib/motion-names.ts ─────────────────────── */

const motionNamesUrl = pathToFileURL(join(ROOT, "lib", "motion-names.ts")).href;
const { DURATION_TOKENS, EASE_TOKENS, MOTION_UTILITIES, MOTION_KEYFRAMES, MOTION_MERGES } = await import(
  motionNamesUrl
);

/**
 * Tailwind class spellings whose `before` should NOT also migrate as a bare
 * class (stripped of the leading `--`) — the three easing repoints. These
 * stay as Tailwind vocabulary, repointed onto the new tokens in Task 2's
 * stylesheet edit rather than renamed at call sites (controller decision).
 */
const CLASS_FORM_EXCLUDED = new Set(["ease-out", "ease-in", "ease-in-out"]);

/** name → replacement, longest key first so a longer identifier that shares
 * a prefix with a shorter one is tried first (belt-and-suspenders alongside
 * the anchors below, which already prevent partial-word collisions). */
const renameMap = new Map();

function addPair(before, after) {
  if (!before) return;
  renameMap.set(before, after);
}

for (const entry of [...DURATION_TOKENS, ...EASE_TOKENS]) {
  if (!entry.before) continue;
  // The `--custom-property` form.
  addPair(entry.before, entry.name);
  // The Tailwind class form (no leading `--`), except the three repoints
  // that stay as Tailwind's own vocabulary.
  const classBefore = entry.before.replace(/^--/, "");
  if (!CLASS_FORM_EXCLUDED.has(classBefore)) {
    addPair(classBefore, entry.name.replace(/^--/, ""));
  }
}

for (const entry of [...MOTION_UTILITIES, ...MOTION_KEYFRAMES]) {
  if (!entry.before) continue;
  addPair(entry.before, entry.name);
}

for (const { before, name } of MOTION_MERGES) addPair(before, name);

// Retired keyframe names → their replacement, for the docs pages that quote them.
for (const [before, name] of [
  ["ds-fade-up", "ds-enter"], ["ds-entrance", "ds-enter"], ["ds-spring-entrance", "ds-enter"],
  ["ds-reveal", "ds-enter"], ["ds-swap-in", "ds-enter"], ["ds-row-in", "ds-enter"],
  ["ds-panel-in", "ds-enter"], ["ds-fade-in", "ds-enter"], ["ds-confirm-in", "ds-enter"],
  ["ds-blur-in", "ds-enter"], ["ds-row-out", "ds-exit"], ["ds-confirm-out", "ds-exit"],
  ["ds-blur-out", "ds-exit"], ["ds-state-change", "ds-change"], ["ds-collapse", "ds-expand"],
  ["check-draw", "ds-change"], ["dash-draw", "ds-change"], ["dot-pop", "ds-change"],
  ["ds-loading-shimmer", "ds-shimmer"], ["ds-live-pulse", "ds-pulse"],
]) addPair(before, name);

const sortedBefores = [...renameMap.keys()].sort((a, b) => b.length - a.length);

/** Escape a literal for use inside a RegExp. */
function reEscape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// One regex, anchored so a match can never be a substring of a longer
// identifier that happens to start or end with it.
const ONE_PASS_RE = new RegExp(
  `(?<![\\w-])(${sortedBefores.map(reEscape).join("|")})(?![\\w-])`,
  "g",
);

/* ── Comment / fenced-span masking ─────────────────────────────────────── */

/**
 * Split a line into segments, each marked as rewritable or not.
 *
 * Handles, per line:
 *   - `//` line comments (from the first unquoted `//` to end of line) — the
 *     rest of the line is masked.
 *   - `/* … *\/` block comments — tracked as multi-line state across calls.
 *   - Backtick-fenced spans inside `.md` files — masked between a line
 *     starting a fenced code block (``` ) or an inline backtick span.
 *
 * This is intentionally simple rather than a full tokenizer: it is a
 * best-effort mask matching the brief's own scope ("excludes `//` comments,
 * `/* *\/` blocks and backtick spans in `.md`"), not a general-purpose
 * source parser.
 */
function rewriteLine(line, state, isMarkdown) {
  let result = "";
  let i = 0;
  const changes = [];

  while (i < line.length) {
    if (state.inBlockComment) {
      const end = line.indexOf("*/", i);
      if (end === -1) {
        result += line.slice(i);
        i = line.length;
      } else {
        result += line.slice(i, end + 2);
        i = end + 2;
        state.inBlockComment = false;
      }
      continue;
    }

    if (isMarkdown && state.inFence) {
      // Inside a ``` fenced block: mask the whole line unless it's the
      // closing fence.
      if (/^\s*```/.test(line)) {
        state.inFence = false;
        result += line.slice(i);
        i = line.length;
      } else {
        result += line.slice(i);
        i = line.length;
      }
      continue;
    }

    if (isMarkdown && /^\s*```/.test(line) && i === 0) {
      state.inFence = true;
      result += line;
      i = line.length;
      continue;
    }

    const rest = line.slice(i);

    const lineCommentIdx = rest.indexOf("//");
    const blockCommentIdx = rest.indexOf("/*");
    const backtickIdx = isMarkdown ? rest.indexOf("`") : -1;

    // Find the nearest special marker.
    const candidates = [
      { idx: lineCommentIdx, kind: "line" },
      { idx: blockCommentIdx, kind: "block" },
      { idx: backtickIdx, kind: "backtick" },
    ].filter((c) => c.idx !== -1);

    if (candidates.length === 0) {
      // No more masking markers on this line — rewrite the remainder.
      const rewritten = rewriteSegment(rest, changes);
      result += rewritten;
      i = line.length;
      continue;
    }

    candidates.sort((a, b) => a.idx - b.idx);
    const next = candidates[0];

    // Rewrite the plain segment before the marker.
    const plain = rest.slice(0, next.idx);
    result += rewriteSegment(plain, changes);
    i += next.idx;

    if (next.kind === "line") {
      // Rest of the line is a comment — mask verbatim.
      result += line.slice(i);
      i = line.length;
    } else if (next.kind === "block") {
      const end = line.indexOf("*/", i + 2);
      if (end === -1) {
        state.inBlockComment = true;
        result += line.slice(i);
        i = line.length;
      } else {
        result += line.slice(i, end + 2);
        i = end + 2;
      }
    } else {
      // backtick span in a .md file: find the matching closing backtick on
      // the same line.
      const closeIdx = line.indexOf("`", i + 1);
      if (closeIdx === -1) {
        // Unterminated on this line — mask to end of line rather than guess.
        result += line.slice(i);
        i = line.length;
      } else {
        result += line.slice(i, closeIdx + 1);
        i = closeIdx + 1;
      }
    }
  }

  return { line: result, changes };
}

function rewriteSegment(segment, changes) {
  ONE_PASS_RE.lastIndex = 0;
  return segment.replace(ONE_PASS_RE, (match) => {
    const after = renameMap.get(match);
    changes.push({ before: match, after });
    return after;
  });
}

/**
 * The three Tailwind-vocabulary alias declarations in `styles/motion.css`
 * (Task 2): `--ease-in: var(--ease-exit); --ease-out: var(--ease-enter);
 * --ease-in-out: var(--ease-move);`. Their LEFT-HAND side is the permitted
 * alias name and must stay exactly `--ease-in` / `--ease-out` /
 * `--ease-in-out` — global constraints name these as the only aliases
 * allowed. Every other appearance of those three identifiers in the tree is
 * a direct consumer that should point at the role name instead (the same
 * distinction Task 2's own report draws for `--default-transition-timing-
 * function`), so the one-pass regex is right to rewrite them everywhere
 * EXCEPT this exact declaration shape, which is masked whole-line the same
 * way Task 2 masked it before its own sweep.
 */
const EASE_ALIAS_DECLARATION_RE =
  /^\s*--ease-(?:in|out|in-out):\s*var\(--ease-(?:exit|enter|move)\)\s*;?\s*$/;

function isProtectedLine(line) {
  return EASE_ALIAS_DECLARATION_RE.test(line);
}

/* ── Walk, rewrite, report ─────────────────────────────────────────────── */

const files = ROOTS.flatMap((r) => {
  try {
    return walk(join(ROOT, r));
  } catch {
    return [];
  }
});

let totalChanges = 0;
let filesChanged = 0;

for (const abs of files) {
  const rel = toPosix(relative(ROOT, abs));
  if (isExcluded(rel)) continue;

  const original = readFileSync(abs, "utf8");
  const isMarkdown = extname(abs) === ".md" || extname(abs) === ".mdx";
  const lines = original.split(/\r?\n/);
  const state = { inBlockComment: false, inFence: false };

  let fileChanged = false;
  const newLines = lines.map((line, idx) => {
    if (isProtectedLine(line)) return line;
    const { line: rewritten, changes } = rewriteLine(line, state, isMarkdown);
    if (changes.length) {
      fileChanged = true;
      for (const c of changes) {
        totalChanges++;
        console.log(`${rel}:${idx + 1}: ${c.before} → ${c.after}`);
      }
    }
    return rewritten;
  });

  if (fileChanged) {
    filesChanged++;
    if (!DRY_RUN) {
      const eol = original.includes("\r\n") ? "\r\n" : "\n";
      // Preserve trailing newline presence.
      const hadTrailingNewline = /\r?\n$/.test(original);
      let out = newLines.join(eol);
      if (hadTrailingNewline && !out.endsWith(eol)) out += eol;
      writeFileSync(abs, out);
    }
  }
}

console.error(
  `\n${DRY_RUN ? "[dry-run] " : ""}${totalChanges} change(s) across ${filesChanged} file(s).`,
);
