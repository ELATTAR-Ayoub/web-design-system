#!/usr/bin/env node
/**
 * Validates the per-capability audit evidence under `docs/contracts/audit/`.
 *
 * WHAT THIS EXISTS TO PREVENT. `docs/contracts/component-convergence-ledger.md`
 * carries six columns — anatomy, API, states, disabled, interaction, semantics
 * — that no assertion in this repository can measure. They can only be filled
 * in by a person opening the Flutter widget and the web module side by side.
 * That is exactly the shape of work that gets marked done from memory: trap 25
 * records a ledger whose "read the screenshot" column was ticked for
 * screenshots nobody had opened, and re-opening them found a real defect.
 *
 * So the evidence is checked in as data, one file per capability, and this
 * script refuses to let a row claim a verdict without carrying the extract it
 * was read from. A dimension must quote what the Flutter source declares and
 * what the web source declares, in enough characters that "looks fine" cannot
 * pass. Anything other than a clean match must say why in prose.
 *
 * IT DOES NOT READ THE FLUTTER REPOSITORY, deliberately. CI has no checkout of
 * it, and the plan forbids depending on an absolute path to one. What CI can
 * check is that the recorded snapshot is the pinned one, that a file exists for
 * every contract row, and that no field is a placeholder — the audit's output
 * is the artefact, not the join that produced it.
 *
 *   node scripts/check-audit.mjs
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const AUDIT_DIR = join(ROOT, "docs/contracts/audit");
const SNAPSHOT = "7c17ecdd9eb1db1025aa47de224b67d81844b32c";

/** The six ledger columns that only a person reading both sources can fill. */
export const DIMENSIONS = /** @type {const} */ ([
  "anatomy",
  "api",
  "states",
  "disabled",
  "interaction",
  "semantics",
]);

/**
 * `match` — the web does what the Flutter widget does.
 * `platform-difference` — it deliberately does not, and the note says why the
 *   web mechanism is the right answer here (a native `<dialog>`, a CSS class, a
 *   browser API). This is a pass: parity is of semantics, not of code.
 * `flutter-behind` — the divergence runs the other way: the web has the
 *   capability and Flutter does not, or Flutter's own doc comment records it as
 *   "not ported". A pass for THIS ledger, which measures the web's convergence
 *   onto Flutter's vocabulary and not the reverse — but kept as its own verdict
 *   rather than folded into `platform-difference`, because "we are ahead" and
 *   "we chose a different mechanism" are different claims and blurring them is
 *   how a shortfall gets reclassified into a pass.
 * `gap` — the web is missing something Flutter has, or the web is broken. NOT
 *   a pass.
 * `n/a` — the dimension does not apply, and the note says why (a hook has no
 *   anatomy; a CSS class has no disabled state).
 */
const VERDICTS = new Set(["match", "platform-difference", "flutter-behind", "gap", "n/a"]);

/** Long enough that a real extract passes and "ok"/"same"/"verified" does not. */
const MIN_EVIDENCE = 40;

const PLACEHOLDER =
  /^\s*(tbd|todo|n\/?a|none|ok|fine|same|matches?|verified|checked|see above|as above)\s*[.!]?\s*$/i;

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
    const read = (f) => chunk.match(new RegExp(String.raw`\b${f}: "([^"]*)"`))?.[1];
    const name = read("name");
    if (!name) continue;
    rows.push({ name, origin: read("origin"), delivery: read("delivery") });
  }
  return rows;
}

/* ── Validation ───────────────────────────────────────────────────────────── */

/**
 * @param {string} name
 * @param {unknown} raw
 * @param {{origin?: string}} row
 * @returns {string[]} problems, empty when the file is sound
 */
export function validateAudit(name, raw, row) {
  const problems = [];
  const fail = (m) => problems.push(`${name}: ${m}`);

  if (typeof raw !== "object" || raw === null) {
    fail("is not an object");
    return problems;
  }
  const audit = /** @type {Record<string, any>} */ (raw);

  if (audit.name !== name) fail(`declares name "${audit.name}" in ${name}.json`);
  if (audit.flutterSnapshot !== SNAPSHOT) {
    fail(`records snapshot "${audit.flutterSnapshot}", not the pinned ${SNAPSHOT}`);
  }

  const webOnly = row.origin === "web-only";
  const flutterSources = audit.flutterSources;
  if (!Array.isArray(flutterSources)) fail("has no flutterSources array");
  else if (!flutterSources.length && !webOnly) {
    fail("names no Flutter source, and is not origin: web-only");
  } else if (flutterSources.length && webOnly) {
    fail("is origin: web-only but names a Flutter source");
  }

  if (!Array.isArray(audit.webSources) || !audit.webSources.length) {
    fail("names no web source — say which file or stylesheet was read");
  }

  const dims = audit.dimensions;
  if (typeof dims !== "object" || dims === null) {
    fail("has no dimensions object");
    return problems;
  }

  for (const dim of DIMENSIONS) {
    const d = dims[dim];
    if (typeof d !== "object" || d === null) {
      fail(`is missing dimension "${dim}"`);
      continue;
    }
    if (!VERDICTS.has(d.verdict)) {
      fail(`dimension "${dim}" has verdict "${d.verdict}" (expected one of ${[...VERDICTS].join(", ")})`);
    }
    for (const side of ["flutter", "web"]) {
      const text = d[side];
      if (typeof text !== "string" || text.trim().length < MIN_EVIDENCE) {
        fail(
          `dimension "${dim}" has no ${side} evidence — quote what the ${side} source actually declares (at least ${MIN_EVIDENCE} characters)`,
        );
      } else if (PLACEHOLDER.test(text)) {
        fail(`dimension "${dim}" has placeholder ${side} evidence: "${text.trim()}"`);
      }
    }
    if (d.verdict !== "match" && (typeof d.note !== "string" || d.note.trim().length < MIN_EVIDENCE)) {
      fail(`dimension "${dim}" is "${d.verdict}" without a note explaining why`);
    }
  }

  return problems;
}

/* ── CLI ──────────────────────────────────────────────────────────────────── */

function main() {
  const rows = contractRows();
  const problems = [];

  if (!existsSync(AUDIT_DIR)) {
    console.error(`✗ check:audit — ${AUDIT_DIR} does not exist.`);
    process.exit(1);
  }

  const files = new Set(
    readdirSync(AUDIT_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, "")),
  );

  let gaps = 0;
  for (const row of rows) {
    if (!files.has(row.name)) {
      problems.push(`${row.name}: no audit file — every contract row must be read individually`);
      continue;
    }
    files.delete(row.name);
    let raw;
    try {
      raw = JSON.parse(readFileSync(join(AUDIT_DIR, `${row.name}.json`), "utf8"));
    } catch (error) {
      problems.push(`${row.name}: unreadable — ${error.message}`);
      continue;
    }
    problems.push(...validateAudit(row.name, raw, row));
    for (const dim of DIMENSIONS) {
      if (raw?.dimensions?.[dim]?.verdict === "gap") gaps += 1;
    }
  }

  for (const orphan of files) {
    problems.push(`${orphan}: audit file with no contract row — a stale name`);
  }

  if (problems.length) {
    console.error(`✗ check:audit — ${problems.length} problem(s):\n`);
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }

  console.log(
    `✓ check:audit — ${rows.length} capabilities audited against Flutter ${SNAPSHOT.slice(0, 7)}` +
      (gaps ? ` · ${gaps} open gap(s) recorded` : " · no open gaps"),
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
