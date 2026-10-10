#!/usr/bin/env node
/**
 * Fails the build when the web system drifts from the checked-in parity
 * contract.
 *
 * `lib/ds/platform-contract.ts` is the specification: names, ownership,
 * delivery, families, the typography matrix, and the clean renames. This script
 * compares the things that can drift away from it — the authored registry, the
 * generated registry output, the documentation catalog, the stylesheets, and
 * the public agent barrel — and reports every difference at once.
 *
 * IT DOES NOT READ THE FLUTTER REPOSITORY. CI has no copy of it, and a check
 * that only runs on one machine is not a check. The contract is the checked-in
 * record of what the pinned Flutter snapshot said; refreshing it against a
 * local Flutter checkout is a separate, deliberate act.
 *
 *   node scripts/check-platform-parity.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const problems = [];
const notes = [];

function fail(area, message) {
  problems.push({ area, message });
}

/* ── Read the contract without a TypeScript loader ────────────────────────── */

/**
 * The contract is TypeScript, and this is a plain Node script.
 *
 * Rather than add a transpiler to the guard's own dependency chain — a guard
 * that needs a build step is a guard that can be broken by the build — the few
 * literal tables it needs are parsed out of the source text. Every one of them
 * is a plain array of object literals with no computed values, which
 * `lib/ds/platform-contract.ts` states as a requirement of its own shape.
 */
const contractSrc = readFileSync(join(ROOT, "lib/ds/platform-contract.ts"), "utf8");

function block(name) {
  const at = contractSrc.indexOf(`export const ${name}`);
  if (at < 0) throw new Error(`platform-contract.ts has no ${name}`);
  // From the `=`, not from the declaration: `readonly ContractEntry[]` puts a
  // `[` in the TYPE annotation, and starting the scan at the declaration found
  // that empty pair instead of the array. It parsed as zero entries and every
  // check downstream reported the whole catalog as unknown.
  const assign = contractSrc.indexOf("=", at);
  const open = contractSrc.indexOf("[", assign);
  let depth = 0;
  for (let i = open; i < contractSrc.length; i += 1) {
    if (contractSrc[i] === "[") depth += 1;
    else if (contractSrc[i] === "]") {
      depth -= 1;
      if (depth === 0) return contractSrc.slice(open, i + 1);
    }
  }
  throw new Error(`platform-contract.ts: ${name} is unterminated`);
}

function records(name, fields) {
  const text = block(name);
  const out = [];
  for (const chunk of text.split(/\}\s*,/)) {
    const row = {};
    let any = false;
    for (const field of fields) {
      const m = chunk.match(new RegExp(`\\b${field}:\\s*("([^"]*)"|null|true|false|[-\\d.]+)`));
      if (m) {
        row[field] = m[2] ?? (m[1] === "null" ? null : m[1] === "true" ? true : m[1] === "false" ? false : Number(m[1]));
        any = true;
      }
    }
    if (any) out.push(row);
  }
  return out;
}

const CONTRACT = records("PLATFORM_CONTRACT", [
  "name",
  "title",
  "family",
  "ownership",
  "delivery",
  "origin",
]);
const RENAMES = records("RENAMES", ["from", "to", "kind"]);
const REMOVED = [...block("REMOVED_ITEMS").matchAll(/"([^"]+)"/g)].map((m) => m[1]);

if (CONTRACT.length === 0) fail("contract", "PLATFORM_CONTRACT parsed as empty");

/* ── The authored registry ────────────────────────────────────────────────── */

const registry = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8"));
const registryNames = new Set(registry.items.map((i) => i.name));

for (const rename of RENAMES) {
  if (rename.kind !== "item") continue;
  if (registryNames.has(rename.from)) {
    fail("renames", `registry.json still ships the old item "${rename.from}" — it must be "${rename.to}", with no alias`);
  }
  if (!registryNames.has(rename.to)) {
    fail("renames", `registry.json has no item "${rename.to}"`);
  }
}

for (const removed of REMOVED) {
  if (registryNames.has(removed)) {
    fail("removals", `registry.json still ships "${removed}", which the contract removes outright`);
  }
}

/**
 * Every advertised item must be in the registry.
 *
 * The reverse is NOT an error while the migration is in flight: a registry item
 * the contract has not yet classified is reported as a note so it is visible
 * without failing a build over ordering.
 */
const advertised = CONTRACT.filter(
  (e) =>
    ["installable", "block", "foundation"].includes(e.ownership) &&
    ["react", "css-native"].includes(e.delivery),
);

for (const item of registry.items) {
  const entry = CONTRACT.find((e) => e.name === item.name);
  if (!entry) {
    notes.push(`registry item "${item.name}" has no contract entry`);
    continue;
  }
  if (
    entry.delivery === "package-native" ||
    entry.delivery === "browser-native" ||
    entry.delivery === "composition"
  ) {
    fail(
      "ownership",
      `"${item.name}" is ${entry.delivery} in the contract but ships as a registry item — a package, browser or composition capability must not become a fake component`,
    );
  }
}

/* ── Registry dependency namespacing ──────────────────────────────────────── */

for (const item of registry.items) {
  for (const dep of item.registryDependencies ?? []) {
    if (!dep.startsWith("@elattar")) {
      fail(
        "namespace",
        `"${item.name}" declares a bare registry dependency "${dep}" — the shadcn CLI resolves bare names against the DEFAULT registry, not this one`,
      );
    }
    const bare = dep.replace(/^@elattar(-blocks)?\//, "");
    if (bare === item.name) {
      fail("namespace", `"${item.name}" depends on itself`);
    }
    if (!registryNames.has(bare)) {
      fail("namespace", `"${item.name}" depends on "${dep}", which is not an item in this registry`);
    }
  }
}

/* ── There is exactly one authored catalog ────────────────────────────────── */

/**
 * `registry/**` was a per-item mirror of `registry.json`, generated beside it
 * and read by nothing. It is deleted, and this is what stops it returning: a
 * second copy of the catalog is a second thing that can go stale, and that one
 * did — five renamed items left five orphans behind that no build step noticed.
 */
if (existsSync(join(ROOT, "registry"))) {
  fail(
    "catalog",
    "registry/ exists again — registry.json is the sole authored catalog and public/r/** the sole generated output",
  );
}

/* ── Generated output agrees with the authored catalog ────────────────────── */

const OUT = join(ROOT, "public/r");
const OUT_INDEX = join(OUT, "index.json");
const OUT_COMMANDS = join(OUT, "commands.json");

// Both files, not just the directory. A build killed part-way leaves `public/r`
// full of item files and no index — which crashed this guard with an ENOENT
// stack trace instead of the one-line diagnosis the reader needed. A checker
// that throws on a half-built artefact is a checker that fails to check.
if (!existsSync(OUT) || !existsSync(OUT_INDEX) || !existsSync(OUT_COMMANDS)) {
  fail(
    "generated",
    "public/r is missing or incomplete (no index.json/commands.json) — run `npm run registry:build`",
  );
} else {
  const index = JSON.parse(readFileSync(join(OUT, "index.json"), "utf8"));
  const built = new Set(index.items.map((i) => i.name));
  for (const name of registryNames) {
    if (!built.has(name)) {
      fail("generated", `"${name}" is in registry.json but not in public/r/index.json — regenerate`);
    }
  }
  for (const name of built) {
    if (!registryNames.has(name)) {
      fail("generated", `public/r/index.json ships "${name}", which registry.json no longer declares — regenerate`);
    }
  }
  const commands = JSON.parse(readFileSync(join(OUT, "commands.json"), "utf8"));
  for (const entry of advertised) {
    if (registryNames.has(entry.name) && !commands[entry.name]) {
      fail("generated", `"${entry.name}" is advertised but has no generated install command`);
    }
  }
}

/* ── The documentation catalog ────────────────────────────────────────────── */

const catalogPath = join(ROOT, "lib/ds/docs/catalog.ts");
if (!existsSync(catalogPath)) {
  fail("docs", "lib/ds/docs/catalog.ts is missing");
} else {
  const catalogSrc = readFileSync(catalogPath, "utf8");
  const documented = new Set(
    [...catalogSrc.matchAll(/component-docs\/([a-z0-9-]+)\/meta/g)].map((m) => m[1]),
  );
  for (const entry of CONTRACT) {
    if (!documented.has(entry.name)) {
      // Reported, not failed, while pages are still being written: this is the
      // migration's own progress metric, and the ledger is where it is tracked.
      notes.push(`no documentation page yet for "${entry.name}" (${entry.delivery}, ${entry.ownership})`);
      continue;
    }
    const metaPath = join(ROOT, "components/docs/component-docs", entry.name, "meta.ts");
    const pagePath = join(ROOT, "components/docs/component-docs", entry.name, "page.tsx");
    if (!existsSync(metaPath)) fail("docs", `"${entry.name}" is in the catalog but has no meta.ts`);
    if (!existsSync(pagePath)) fail("docs", `"${entry.name}" is in the catalog but has no page.tsx`);
    if (existsSync(metaPath)) {
      const meta = readFileSync(metaPath, "utf8");
      if (/description:\s*\n?\s*""/.test(meta)) {
        notes.push(`"${entry.name}" has no authored description`);
      }
    }
  }
  for (const name of documented) {
    if (!CONTRACT.some((e) => e.name === name)) {
      fail("docs", `the catalog documents "${name}", which is not in the contract`);
    }
  }
}

/* ── Typography ───────────────────────────────────────────────────────────── */

/**
 * The stylesheet must declare a size and a leading token for every role, at all
 * three widths. The VALUES are asserted by
 * `test/foundation/typography-contract.test.ts`, which has a real CSS parser;
 * this only catches a role that lost a step entirely.
 */
const TYPE_ROLES = [...block("TYPOGRAPHY").matchAll(/role:\s*"([^"]+)"/g)].map((m) => m[1]);
if (TYPE_ROLES.length !== 17) {
  fail("typography", `the contract declares ${TYPE_ROLES.length} type roles; there must be exactly 17`);
}
const tokensCss = readFileSync(join(ROOT, "styles/tokens.css"), "utf8");
for (const role of TYPE_ROLES) {
  for (const prop of [`--text-${role}`, `--leading-${role}`]) {
    const declared = (tokensCss.match(new RegExp(`${prop}\\s*:`, "g")) ?? []).length;
    if (declared < 3) {
      fail(
        "typography",
        `${prop} is declared ${declared} time(s) in styles/tokens.css — every role needs a phone, tablet and desktop step`,
      );
    }
  }
}

const typesetCss = readFileSync(join(ROOT, "styles/typeset.css"), "utf8");
if (typesetCss.includes("@media")) {
  fail(
    "typography",
    "styles/typeset.css declares a media query — the responsive steps belong to the tokens, or `text-<role>` stops tracking `.type-<role>`",
  );
}

/* ── The public agent barrel ──────────────────────────────────────────────── */

const barrel = join(ROOT, "components/agent/index.ts");
if (existsSync(barrel)) {
  const src = readFileSync(barrel, "utf8");

  /**
   * The names this barrel actually PUBLISHES.
   *
   * `CubeAvatar as AgentAvatar` publishes `AgentAvatar`; the renderer's own
   * symbol on the left is the implementation, and naming it there is the
   * correct way to keep it private. An earlier version of this check tested for
   * the substring and failed on the very line that fixes the problem — and on
   * the comment explaining why. Comments are stripped for the same reason: this
   * file has to be able to discuss the names it does not export.
   */
  const withoutComments = src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  const published = new Set();
  for (const m of withoutComments.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}/g)) {
    for (const part of m[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (name) published.add(name.replace(/^type\s+/, ""));
    }
  }

  for (const leaked of ["CubeScene", "OrbState", "CubeAvatar", "Orb", "Cube", "Scene"]) {
    if (published.has(leaked)) {
      fail(
        "agent",
        `components/agent/index.ts publishes "${leaked}" — renderer-specific names stay private; the public vocabulary is AgentAvatar`,
      );
    }
  }
  for (const required of ["AgentAvatar", "AgentWorkspace"]) {
    if (!published.has(required)) {
      fail("agent", `components/agent/index.ts does not publish "${required}"`);
    }
  }
}

/* ── Report ───────────────────────────────────────────────────────────────── */

for (const note of notes) console.log(`  · ${note}`);
if (notes.length) console.log(`  ${notes.length} note(s) — outstanding migration work, not failures.\n`);

if (problems.length === 0) {
  console.log(
    `✓ check:parity — ${CONTRACT.length} contract entries, ${registry.items.length} registry items. No drift.`,
  );
  process.exit(0);
}

console.error(`✗ check:parity — ${problems.length} problem(s):\n`);
for (const p of problems) console.error(`  [${p.area}] ${p.message}`);
console.error(
  "\nThe contract in lib/ds/platform-contract.ts is the specification. Fix the source, " +
    "or change the contract deliberately — never to make this pass.",
);
process.exit(1);
