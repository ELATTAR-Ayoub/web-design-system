#!/usr/bin/env node
/**
 * Builds `docs/contracts/documentation-parity-ledger.md`.
 *
 * A SECOND LEDGER, AND A DIFFERENT QUESTION. `component-convergence-ledger.md`
 * asks whether the web COMPONENT matches Flutter 0.0.3. This one asks whether
 * the web PAGE does: the shell it renders in, where it sits in the rail, what
 * its outline says, whether the opening specimen is real, whether every
 * showcase offers its source, whether the installation instruction is true, and
 * whether a person has actually looked at it.
 *
 * NO ROW IS COMPLETE FROM ROUTE EXISTENCE ALONE, which is the failure mode this
 * file is built against: a hundred generated shells, every route resolving,
 * `docs:validate` green, and not one page that a reader would call documented.
 *
 * Two sources, and both are things that were run:
 *
 *   1. `docs/contracts/ledger-evidence.json` — written by
 *      `e2e/ledger-evidence.spec.ts`, which opens every route in a real browser
 *      and records the shell as it actually rendered: the header's
 *      destinations, the appearance control, the breadcrumb, the derived
 *      eyebrow, the rail's groups and which row is selected, which of the three
 *      responsive shapes appear at 375 / 768 / 1100 / 1440 / 1920, how many
 *      live specimens the page has and how many of them offer a Code view, how
 *      tall the first stage is and how much is in it.
 *   2. The page's own spec, read from source — its section map, and which of
 *      the ten required sections it declares.
 *
 * WHAT IS NOT DERIVED. The visual-review column cannot be: "does this page look
 * right in light mode at 1440" is not a measurement. It is recorded in
 * `docs/contracts/docs-visual-review.json`, one entry per route, naming who
 * looked and at what. A route with no entry reads `—`, not `✅`, and the
 * summary counts it as outstanding.
 *
 *   node scripts/build-docs-ledger.mjs
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const DOCS = join(ROOT, "components/docs/component-docs");

const YES = "✅";
const PARTIAL = "◐";
const NO = "—";

/* ── Sources ──────────────────────────────────────────────────────────────── */

function readJson(relative, fallback) {
  const path = join(ROOT, relative);
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

const evidence = readJson("docs/contracts/ledger-evidence.json", {
  routes: [],
  collectedAt: null,
});
const measured = new Map(evidence.routes.map((route) => [route.name, route]));

const visual = readJson("docs/contracts/docs-visual-review.json", { reviews: {} });
const reviews = visual.reviews ?? {};

/* ── Each page's own declaration ──────────────────────────────────────────── */

/**
 * The ten sections plan §6.3 asks every page to carry where applicable.
 *
 * An inapplicable one is omitted honestly and the reason belongs in the
 * component ledger — so a missing section is `—` here rather than a failure,
 * and the summary reports how many pages carry all ten rather than pretending
 * the number should be 105.
 */
const REQUIRED_SECTIONS = [
  "preview",
  "installation",
  "usage",
  "api",
  "states",
  "accessibility",
  "keyboard",
  "responsive",
  "source",
];

function pageFacts(name) {
  const path = join(DOCS, name, "page.tsx");
  if (!existsSync(path)) return null;
  const source = readFileSync(path, "utf8");

  const sections = [...source.matchAll(/\bid:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
  const kinds = [...source.matchAll(/\bkind:\s*"([a-z]+)"/g)].map((m) => m[1]);

  // Sections the page declares it does not have, and why. `N/A` with a stated
  // reason is a different answer from `—`, and the whole point of the field.
  const omitted = {};
  const omittedAt = source.indexOf("omitted: {");
  if (omittedAt !== -1) {
    const close = source.indexOf("},", omittedAt);
    const body = close === -1 ? "" : source.slice(omittedAt + "omitted: {".length, close);
    // Key and string may sit on different lines — Prettier wraps a long reason
    // as `states:` on one line and the quoted text on the next, and a parser
    // that read line by line missed every one of those, reporting an honest
    // omission as an absence on some forty pages.
    for (const entry of body.matchAll(/([a-z][a-z0-9-]*):\s*"((?:[^"\\]|\\.)*)"/g)) {
      omitted[entry[1]] = entry[2];
    }
  }

  return {
    sections,
    omitted,
    kinds,
    /** The FIRST declared section's kind — the opening specimen's shape. */
    firstKind: kinds[0] ?? null,
    /** Authored rather than left as the generated baseline. */
    authored: !source.slice(0, 400).includes("@generated-baseline"),
    /** Every live specimen that ships its source. */
    showcases: kinds.filter((kind) => kind === "showcase" || kind === "effect").length,
    sources: (source.match(/\n\s+source:/g) ?? []).length,
  };
}

/* ── Grading ──────────────────────────────────────────────────────────────── */

/** The rail's groups, as every page must render them. */
const EXPECTED_RAIL = ["Sections", "Foundations", "Components", "Effects", "Agent", "Charts"];
const EXPECTED_DESTINATIONS = ["Documentation", "Components", "Charts", "Agent"];
const EXPECTED_APPEARANCE = ["Light", "System", "Dark"];

const sameList = (a, b) =>
  Array.isArray(a) && a.length === b.length && a.every((value, i) => value === b[i]);

/**
 * The responsive contract, as three shapes.
 *
 * Below `lg`: article alone. `lg` to `xl`: left rail plus the anchor strip.
 * `xl` and up: both rails, no strip. Measured at five widths so each band has a
 * witness on both sides of its boundary.
 */
function shapesVerdict(shapes) {
  if (!Array.isArray(shapes) || shapes.length < 5) return NO;
  const at = (width) => shapes.find((shape) => shape.width === width);
  const narrow = [at(375), at(768)];
  const middle = at(1100);
  const wide = [at(1440), at(1920)];
  const ok =
    narrow.every((shape) => shape && !shape.rail && !shape.toc && shape.strip) &&
    middle &&
    middle.rail &&
    !middle.toc &&
    middle.strip &&
    wide.every((shape) => shape && shape.rail && shape.toc && !shape.strip);
  return ok ? YES : PARTIAL;
}

const COLUMNS = [
  "Flutter route reviewed",
  "Web route",
  "Shell / header",
  "Left-rail placement",
  "Right-rail / TOC",
  "Section map",
  "First preview",
  "All Preview/Code controls",
  "Installation modes",
  "API coverage",
  "States",
  "Accessibility",
  "Keyboard",
  "Responsive / RTL / theme / motion",
  "Source and tests",
  "Visual review",
];

function gradeRow(name, contract) {
  const page = pageFacts(name);
  const ev = measured.get(name);
  const shell = ev?.shell;
  const review = reviews[name];

  if (!page) return null;

  const has = (id) => page.sections.includes(id);
  /** Declared present, declared absent with a reason, or simply missing. */
  const cell = (id) => (has(id) ? YES : page.omitted[id] ? "N/A" : NO);

  // 1. The Flutter side of this capability was read, dimension by dimension.
  //    That is the convergence audit; this column reports whether it exists.
  const auditPath = join(ROOT, "docs/contracts/audit", `${name}.json`);
  const flutterReviewed = existsSync(auditPath) ? YES : NO;

  // 2. The route responded and rendered a heading.
  const webRoute = ev?.status === "ok" && ev.heading ? YES : NO;

  // 3. The shell: four destinations, search, three appearance options, and a
  //    breadcrumb that actually has a trail.
  const shellOk =
    shell &&
    sameList(shell.destinations, EXPECTED_DESTINATIONS) &&
    shell.hasSearch &&
    sameList(shell.appearanceOptions, EXPECTED_APPEARANCE) &&
    shell.breadcrumb.length >= 2 &&
    Boolean(shell.eyebrow);

  // 4. The rail has the same six groups here as everywhere, and this page's own
  //    row is the selected one.
  const railOk = shell && sameList(shell.railGroups, EXPECTED_RAIL) && Boolean(shell.railSelected);

  // 5. The outline matched the declared sections when the page was measured.
  const tocOk = ev?.tocMatchesSections === true;

  // 6. Section map: what the page declares, against the ten.
  // Accounted for = present, or absent with a reason a reader could disagree
  // with. A page that says "no API Reference, because this is a CSS utility
  // with no JavaScript surface" has answered the question; one that is simply
  // missing the section has not.
  const accountedFor = REQUIRED_SECTIONS.filter(
    (id) => has(id) || page.omitted[id],
  ).length;
  const sectionMap =
    accountedFor === REQUIRED_SECTIONS.length ? YES : accountedFor >= 5 ? PARTIAL : NO;

  // 7. The first preview is a live specimen — not a snippet, not a disclosure —
  //    and its stage holds something.
  //    A page may declare it has no surface to preview (`omitted.preview`) —
  //    two hooks, four stylesheets, a validation library — and that is `N/A`,
  //    the same honest answer the other declared omissions get.
  const firstPreview =
    page.firstKind === "showcase" || page.firstKind === "effect"
      ? shell?.firstPreview && shell.firstPreview.elements >= 3
        ? YES
        : PARTIAL
      : page.omitted.preview
        ? "N/A"
        : NO;

  // 8. Every live specimen offers its source. Measured, not counted from the
  //    file: a `source` key that renders nothing would still match a regex.
  //    A page that declares it has nothing to preview has nothing to offer a
  //    Code view for either — `N/A`, the same answer column 7 gives it.
  const controls =
    shell && shell.showcases > 0
      ? shell.previewCodeControls >= shell.showcases
        ? YES
        : PARTIAL
      : page.omitted.preview
        ? "N/A"
        : NO;

  // 9. The installation section exists and its text is derived from the
  //    contract — `InstallBlock` is the only thing that may print one.
  const install = shell?.hasInstall ? YES : has("installation") ? PARTIAL : NO;

  const api = cell("api");
  const states = cell("states");
  const accessibility = cell("accessibility");
  const keyboard = cell("keyboard");

  // 14. Measured in the browser: no sideways scroll at any of four widths, none
  //     at 200% zoom, none under RTL, and both themes verified as applied.
  const responsive =
    ev &&
    ev.widths.length >= 4 &&
    ev.widths.every((w) => !w.overflows) &&
    ev.zoom200Overflows === false &&
    ev.rtlOverflows === false &&
    ev.themes.every((t) => t.applied)
      ? YES
      : ev
        ? PARTIAL
        : NO;

  const sourceAndTests = cell("source");

  // 16. Not derivable. See this file's header.
  const visualReview = review ? YES : NO;

  const cells = [
    flutterReviewed,
    webRoute,
    shellOk ? YES : shell ? PARTIAL : NO,
    railOk ? YES : shell ? PARTIAL : NO,
    tocOk ? YES : ev ? PARTIAL : NO,
    sectionMap,
    firstPreview,
    controls,
    install,
    api,
    states,
    accessibility,
    keyboard,
    responsive,
    sourceAndTests,
    visualReview,
  ];

  return { name, family: contract.family, cells, shapes: shapesVerdict(shell?.shapes) };
}

/* ── Contract rows ────────────────────────────────────────────────────────── */

function contractRows() {
  const src = readFileSync(join(ROOT, "lib/ds/platform-contract.ts"), "utf8");
  const at = src.indexOf("export const PLATFORM_CONTRACT");
  const open = src.indexOf("[", src.indexOf("=", at));
  let depth = 0;
  let close = open;
  for (let i = open; i < src.length; i += 1) {
    if (src[i] === "[") depth += 1;
    else if (src[i] === "]") {
      depth -= 1;
      if (depth === 0) {
        close = i;
        break;
      }
    }
  }
  const rows = [];
  for (const chunk of src.slice(open, close).split(/\}\s*,/)) {
    const read = (field) =>
      chunk.match(new RegExp(String.raw`\b${field}: "([^"]*)"`))?.[1];
    const name = read("name");
    if (!name) continue;
    rows.push({ name, title: read("title"), family: read("family") });
  }
  return rows;
}

/* ── Render ───────────────────────────────────────────────────────────────── */

function main() {
  const rows = contractRows()
    .map((row) => gradeRow(row.name, row))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));

  // `N/A` counts as satisfied. It is not a gap — it is a section the page
  // declares it cannot have, with the reason written in the page's `omitted`
  // map (a CSS utility has no API; a gradient has no keyboard). Counting it as
  // a shortfall would mean a stylesheet capability could never be complete
  // however honestly it was documented, which is the wrong incentive.
  const complete = rows.filter((row) => row.cells.every((cell) => cell === YES || cell === "N/A")).length;
  const reviewed = rows.filter((row) => row.cells[15] === YES).length;
  const shapesOk = rows.filter((row) => row.shapes === YES).length;

  const md = `# Documentation parity ledger

**Flutter authority:** \`0.0.3\` / \`7c17ecdd9eb1db1025aa47de224b67d81844b32c\`
**Evidence collected:** ${evidence.collectedAt ?? "not yet — run `npx playwright test e2e/ledger-evidence.spec.ts`"}
**Regenerate:** \`node scripts/build-docs-ledger.mjs\`

A different question from \`component-convergence-ledger.md\`. That one asks
whether the web COMPONENT matches Flutter 0.0.3. This one asks whether the web
PAGE does: the shell it renders in, where it sits in the rail, what its outline
says, whether the opening specimen is real, whether every showcase offers its
source, whether the installation instruction is true, and whether a person has
actually looked at it.

**No row is complete from route existence alone.** That is the failure this
table is built against: a hundred generated shells, every route resolving,
\`docs:validate\` green, and not one page a reader would call documented.

## Where each column comes from

Columns 3, 4, 5, 7, 8, 9 and 14 are **measured in a browser** by
\`e2e/ledger-evidence.spec.ts\`, which opens every route and records the shell as
it actually rendered — the header's four destinations, the appearance control's
three options, the breadcrumb, the derived eyebrow, the rail's six groups and
which row is selected, how many live specimens the page has and how many offer a
Code view, the first stage's height and contents, and which of the three
responsive shapes appear at 375, 768, 1100, 1440 and 1920.

Columns 6, 10, 11, 12, 13 and 15 are read from the page's own spec. Column 1 is
whether a per-capability audit file exists for it.

Column 16, **visual review, is not derived and cannot be.** "Does this page look
right in light mode at 1440" is not a measurement. It is recorded in
\`docs/contracts/docs-visual-review.json\`, one entry per route naming what was
looked at. A route with no entry reads \`${NO}\`.

## Status

- **${rows.length}** documented capabilities.
- **${shapesOk}** render all three responsive shapes correctly — article alone below \`lg\`, left rail plus anchor strip from \`lg\` to \`xl\`, both rails above \`xl\`.
- **${reviewed}** carry a recorded visual review.
- **${complete}** rows are ${YES} on every column.

| | |
|---|---|
| ${YES} | Measured, or declared and present. |
| ${PARTIAL} | Partly — the page has the thing but not in the shape the contract asks for. |
| ${NO} | Absent, or never looked at. |

## Columns

${COLUMNS.map((label, i) => `${i + 1}. ${label}`).join("\n")}

| Item | Family | ${COLUMNS.map((_, i) => i + 1).join(" | ")} |
| --- | --- | ${COLUMNS.map(() => ":-:").join(" | ")} |
${rows.map((row) => `| \`${row.name}\` | ${row.family} | ${row.cells.join(" | ")} |`).join("\n")}
`;

  writeFileSync(join(ROOT, "docs/contracts/documentation-parity-ledger.md"), md);
  console.log(
    `✓ docs ledger — ${rows.length} rows · ${shapesOk} responsive-correct · ${reviewed} visually reviewed · ${complete} fully ${YES}`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
