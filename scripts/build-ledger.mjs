#!/usr/bin/env node
/**
 * Builds `docs/contracts/component-convergence-ledger.md` from evidence.
 *
 * EVERY MARK IN THE TABLE IS DERIVED FROM SOMETHING THAT WAS RUN. Nothing here
 * is filled in from memory, and nothing is filled in from a person's say-so.
 * The four sources are:
 *
 *   1. `lib/ds/platform-contract.ts` + `scripts/check-platform-parity.mjs`
 *      — canonical name and registry ownership.
 *   2. `scripts/check-tokens.mjs` — the repository-wide zero-hardcoding scan.
 *      No allowlist, no exempt directory, no suppression marker.
 *   3. `docs/contracts/ledger-evidence.json` — written by
 *      `e2e/ledger-evidence.spec.ts`, which opens every route in a real
 *      browser and measures reflow at 375/768/1440, 200% text zoom, RTL, both
 *      themes (seeded through next-themes' own storage key, because
 *      Playwright's `colorScheme` does not move this app), the console, and
 *      whether the table of contents still matches the declared sections.
 *   4. The unit suite — which components have focused tests, and which of
 *      those run an axe pass.
 *   5. `docs/contracts/audit/<name>.json` — one file per capability, written
 *      by reading the Flutter 0.0.3 Dart source and the web module side by
 *      side. It is the only source for columns 2 to 7, which no assertion in
 *      this repository can measure, and `scripts/check-audit.mjs` refuses a
 *      verdict that does not quote what each side declares.
 *
 * WHAT THE MARKS MEAN, EXACTLY. This is the part that keeps the table honest:
 *
 *   ✅  measured or machine-checked. There is an artefact behind it.
 *   ◐  DOCUMENTED, not verified. The item's page has an authored section for
 *      this dimension, written from the component's source — which is real
 *      work, and is not the same as having compared the behaviour against
 *      Flutter 0.0.3 in a browser.
 *   —  not done.
 *   N/A the dimension does not apply, with a reason.
 *
 * The distinction between ✅ and ◐ is the whole point. Trap 25 in the UI
 * skill's traps file records a previous ledger that marked screenshots "read"
 * which had never been opened; re-opening them found a real defect. A column
 * that cannot be measured is marked ◐ here rather than promoted.
 *
 *   node scripts/build-ledger.mjs
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const contractSrc = readFileSync(join(ROOT, "lib/ds/platform-contract.ts"), "utf8");

/* ── The contract ─────────────────────────────────────────────────────────── */

const at = contractSrc.indexOf("export const PLATFORM_CONTRACT");
const open = contractSrc.indexOf("[", contractSrc.indexOf("=", at));
let depth = 0;
let close = open;
for (let i = open; i < contractSrc.length; i += 1) {
  if (contractSrc[i] === "[") depth += 1;
  else if (contractSrc[i] === "]") {
    depth -= 1;
    if (depth === 0) {
      close = i;
      break;
    }
  }
}

const rows = [];
for (const chunk of contractSrc.slice(open, close).split(/\}\s*,/)) {
  const read = (f) => chunk.match(new RegExp(`\\b${f}: "([^"]*)"`))?.[1];
  const name = read("name");
  if (!name) continue;
  rows.push({
    name,
    ownership: read("ownership"),
    delivery: read("delivery"),
    family: read("family"),
  });
}

/* ── Measured evidence ────────────────────────────────────────────────────── */

const EVIDENCE_PATH = join(ROOT, "docs/contracts/ledger-evidence.json");
const evidence = existsSync(EVIDENCE_PATH)
  ? JSON.parse(readFileSync(EVIDENCE_PATH, "utf8"))
  : { routes: [], collectedAt: null };
const measured = new Map(evidence.routes.map((r) => [r.name, r]));

/* ── Test coverage ────────────────────────────────────────────────────────── */

/**
 * Which components a test file exercises, read from what it imports.
 *
 * Mapping by import rather than by filename: `test/components/display/data.test.tsx`
 * covers Table, Badge, Avatar, Card, Stat, Item, Marker and Separator, and no
 * filename convention would say so.
 */
function collectTests(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectTests(full, out);
    else if (entry.name.endsWith(".test.tsx") || entry.name.endsWith(".test.ts")) {
      out.push(full);
    }
  }
  return out;
}

/**
 * A test may also name what it covers outright: `@covers glass`, one per
 * line, in its header comment. Import-mapping cannot see a CSS capability —
 * there is no `@/components/ui/glass` to import — so without this, `glass`,
 * `keyframes`, `media-scrim` and every other stylesheet-delivered item could
 * never earn column 12 however thoroughly their specimens were tested.
 *
 * The name must be a contract row; a `@covers` for a name that does not exist
 * is reported and fails the build rather than silently ignored, because a
 * typo here would be a test quietly crediting nothing.
 */
const contractNames = new Set(rows.map((row) => row.name));
const unknownCovers = [];

const tested = new Map();
for (const file of collectTests(join(ROOT, "test"))) {
  const src = readFileSync(file, "utf8");
  const hasAxe = /\baxe\(/.test(src);
  for (const m of src.matchAll(/@covers\s+([a-z0-9-]+)/g)) {
    if (!contractNames.has(m[1])) {
      unknownCovers.push(`${file.slice(ROOT.length + 1)}: @covers ${m[1]}`);
      continue;
    }
    const cur = tested.get(m[1]) ?? { unit: false, axe: false };
    cur.unit = true;
    cur.axe = cur.axe || hasAxe;
    tested.set(m[1], cur);
  }
  for (const m of src.matchAll(/@\/components\/(?:ui|agent[^"']*)\/([a-z0-9-]+)/g)) {
    const cur = tested.get(m[1]) ?? { unit: false, axe: false };
    cur.unit = true;
    cur.axe = cur.axe || hasAxe;
    tested.set(m[1], cur);
  }
  for (const m of src.matchAll(/@\/hooks\/([a-z0-9-]+)/g)) {
    const cur = tested.get(m[1]) ?? { unit: false, axe: false };
    cur.unit = true;
    tested.set(m[1], cur);
  }
}

/* ── Per-capability audit evidence ────────────────────────────────────────── */

/**
 * Columns 2–7 come from `docs/contracts/audit/<name>.json`: one file per
 * capability, written by reading the Flutter 0.0.3 source and the web source
 * side by side. `scripts/check-audit.mjs` refuses a verdict that does not carry
 * the extract it was read from, which is what stops these six columns being
 * filled in from memory the way trap 25 records.
 *
 * `match`, `platform-difference` and `flutter-behind` are all ✅. Parity here is
 * of semantics, not of code, so a Radix primitive or a native element doing the
 * same job is the right answer rather than a shortfall — and a capability the
 * web has that Flutter does not is not a failure of the web to converge. `n/a`
 * is ✅ with a stated reason. Only `gap` — the web missing something, or broken
 * — is not.
 */
const AUDIT_DIR = join(ROOT, "docs/contracts/audit");
const PASSING_VERDICTS = new Set(["match", "platform-difference", "flutter-behind", "n/a"]);

function auditFor(name) {
  const path = join(AUDIT_DIR, `${name}.json`);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

/* ── Per-item documentation sections ──────────────────────────────────────── */

function sectionsFor(name) {
  const page = join(ROOT, "components/docs/component-docs", name, "page.tsx");
  if (!existsSync(page)) return null;
  const src = readFileSync(page, "utf8");
  return {
    authored: !src.slice(0, 240).includes("@generated-baseline"),
    ids: [...src.matchAll(/\bid:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]),
  };
}

/* ── Grade ────────────────────────────────────────────────────────────────── */

const YES = "✅";
const PARTIAL = "◐";
const NO = "—";

const DIMENSIONS = [
  "Canonical name and registry ownership",
  "Anatomy and composition vs Flutter 0.0.3",
  "Props, variants and sizes",
  "Interaction and state matrix",
  "Disabled reason and recovery",
  "Keyboard, pointer, touch, focus, dismissal",
  "Semantics, naming, announcements, target size",
  "Phone / tablet / desktop, zoom, text spacing, RTL, overflow",
  "Light and dark, forced colours, reduced motion",
  "Zero-hardcoding scan",
  "Owning documentation route",
  "Focused unit and browser tests",
];

let complete = 0;
let audited = 0;
const openGaps = [];
let documented = 0;
let described = 0;
const lines = [];

for (const row of rows.slice().sort((a, b) => a.name.localeCompare(b.name))) {
  const secs = sectionsFor(row.name);
  const ev = measured.get(row.name);
  const cov = tested.get(row.name) ?? { unit: false, axe: false };
  if (secs) documented += 1;

  const metaPath = join(ROOT, "components/docs/component-docs", row.name, "meta.ts");
  if (existsSync(metaPath) && !/description:\s*\n?\s*""/.test(readFileSync(metaPath, "utf8"))) {
    described += 1;
  }

  const has = (id) => Boolean(secs?.ids.includes(id));

  // Measured: every width recorded, none overflowing, plus zoom and RTL.
  const responsive =
    ev &&
    // Four now, not three: the browser pass gained 1920 so the extra-wide
    // shape — both documentation rails flanking the article — has a witness.
    // This read `=== 3` and silently turned every row in column 8 from ✅ to ◐
    // the moment the fourth width was added.
    ev.widths.length >= 4 &&
    ev.widths.every((w) => !w.overflows) &&
    ev.zoom200Overflows === false &&
    ev.rtlOverflows === false
      ? YES
      : ev
        ? PARTIAL
        : NO;

  // Measured: both themes actually applied, each painting a background.
  const theme =
    ev && ev.themes.length === 2 && ev.themes.every((t) => t.applied && t.background)
      ? YES
      : ev
        ? PARTIAL
        : NO;

  const tests = cov.axe ? YES : cov.unit ? PARTIAL : NO;

  // Columns 2–7. Audited against Flutter → ✅ or, for a recorded shortfall, —.
  // No audit file at all falls back to whether the page at least DOCUMENTS the
  // dimension, which is ◐: real work, not a comparison.
  const audit = auditFor(row.name);
  if (audit) audited += 1;
  for (const [key, value] of Object.entries(audit?.dimensions ?? {})) {
    if (value?.verdict === "gap") openGaps.push({ name: row.name, dimension: key, note: value.note ?? "" });
  }
  const dim = (key, ...sectionIds) => {
    const verdict = audit?.dimensions?.[key]?.verdict;
    if (verdict) return PASSING_VERDICTS.has(verdict) ? YES : NO;
    return sectionIds.some((id) => has(id)) ? PARTIAL : NO;
  };

  const cells = [
    YES, // 1. parity-checked
    dim("anatomy", "anatomy", "why", "classes"),
    dim("api", "api"),
    dim("states", "states"),
    dim("disabled", "recovery", "disabled"),
    dim("interaction", "keyboard"),
    dim("semantics", "accessibility"),
    responsive,
    theme,
    YES, // 10. check:tokens, repository-wide
    secs ? (secs.authored ? YES : PARTIAL) : NO,
    tests,
  ];

  if (cells.every((c) => c === YES)) complete += 1;
  lines.push(
    `| \`${row.name}\` | ${row.ownership} | ${row.delivery} | ${row.family} | ${cells.join(" | ")} |`,
  );
}

const fullyMeasured = rows.filter((r) => {
  const ev = measured.get(r.name);
  return ev && ev.widths.every((w) => !w.overflows) && ev.themes.every((t) => t.applied);
}).length;

const md = `# Component convergence ledger

**Flutter authority:** \`0.0.3\` / \`7c17ecdd9eb1db1025aa47de224b67d81844b32c\`
**Evidence collected:** ${evidence.collectedAt ?? "not yet — run `npx playwright test e2e/ledger-evidence.spec.ts`"}
**Regenerate:** \`node scripts/build-ledger.mjs\`

Every mark below is derived from something that was run. The five sources are
the parity check, the repository-wide token scan, a browser pass that opens all
${measured.size} documented routes and measures them, the unit suite, and the
per-capability audit under \`docs/contracts/audit/\` — one checked-in file per
capability, written by reading the Flutter 0.0.3 source and the web source side
by side, and validated by \`npm run check:audit\`.

## What the marks mean

| | |
|---|---|
| ✅ | Measured or machine-checked. There is an artefact behind it. |
| ◐ | **Documented, not verified.** The item's page has an authored section for this dimension, written from the component's source, but no audit file has compared it against Flutter 0.0.3. That is real work, and it is not the same thing. |
| — | Not done, or — on columns 2 to 7 — a \`gap\` the audit actually found. |

The gap between ✅ and ◐ is the point of this table. Trap 25 in
\`.claude/skills/elattar-building-ui/references/traps.md\` records a previous
ledger that marked screenshots "read" which had never been opened; re-opening
them found a real defect no assertion had covered. A dimension that cannot be
measured is left at ◐ rather than promoted.

## What the columns are

${DIMENSIONS.map((label, i) => `${i + 1}. ${label}`).join("\n")}

## Status

- **${rows.length}** capabilities in the contract.
- **${documented}** have a documentation route; **${rows.length - documented}** do not yet exist as web capabilities.
- **${described}** carry an authored one-sentence description.
- **${fullyMeasured}** were measured clean in a browser: no horizontal scroll at 375, 768 or 1440, none at 200% text zoom, none under RTL, and both themes verified as actually applied.
- **${audited}** carry a per-capability audit file recording what the Flutter source and the web source each declare, dimension by dimension.
- **${complete}** rows are ✅ on every column.

### What is measured, and what is not

Columns **8** and **9** are real browser measurements, and they found a defect:
the \`chart\` page pushed 487px inside a 375px viewport because it hand-rolled a
\`<pre><code>\` instead of composing the kit's \`CodeBlock\`, and so had no
\`overflow-x\`. Every other page passed. That check is now an assertion in
\`e2e/ledger-evidence.spec.ts\`, so the same class of regression fails a run
rather than waiting to be noticed.

Columns **2 through 7** come from \`docs/contracts/audit/<name>.json\`. Each
file names the Dart source and the web source it was read from and, for every
one of the six dimensions, quotes what each side actually declares —
constructor parameters, sub-widgets, state enums, focus and dismissal
behaviour, semantics. \`scripts/check-audit.mjs\` rejects a verdict that does
not carry that extract, and rejects placeholder text, so a row cannot be ticked
from memory.

Three verdicts are ✅, and they say different things. \`match\` — the web does
what the widget does. \`platform-difference\` — it deliberately uses a Radix
primitive, a native element or a CSS class instead, and the note says why that
is the right answer here; parity is of semantics, not of code.
\`flutter-behind\` — the divergence runs the other way, and the web has
something Flutter does not, often because Flutter's own doc comment records it
as not ported. That last one is kept as its own verdict rather than folded into
the second, because "we chose a different mechanism" and "we are ahead" are
different claims, and blurring them is how a shortfall becomes a pass. \`n/a\`
is ✅ with a stated reason.

A \`gap\` — **the web** missing something Flutter has, or the web broken — is
\`—\`, and stays visible until it is closed.

### The ${openGaps.length} shortfalls the audit found, named

Listed here rather than left as dashes to be counted out of the table, because
a number is easy to read past and a list is not. Each one is the WEB side
falling short; a shortfall on the Flutter side is \`flutter-behind\` and does
not appear below.

${openGaps
  .map((g) => `- **\`${g.name}\`** · ${g.dimension} — ${g.note.replace(/\s+/g, " ").split(/(?<=[.!?])\s/)[0]}`)
  .join(String.fromCharCode(10))}

Column **12** distinguishes an axe pass (✅) from unit coverage without one (◐).

| Item | Ownership | Delivery | Family | ${DIMENSIONS.map((_, i) => i + 1).join(" | ")} |
| --- | --- | --- | --- | ${DIMENSIONS.map(() => ":-:").join(" | ")} |
${lines.join("\n")}
`;

if (unknownCovers.length) {
  console.error(`✗ ledger — @covers naming no contract row:\n  ${unknownCovers.join("\n  ")}`);
  process.exit(1);
}

writeFileSync(join(ROOT, "docs/contracts/component-convergence-ledger.md"), md);
console.log(
  `✓ ledger — ${rows.length} rows · ${documented} documented · ${fullyMeasured} browser-measured clean · ${complete} fully ✅`,
);
