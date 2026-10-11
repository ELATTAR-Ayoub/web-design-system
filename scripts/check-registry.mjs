#!/usr/bin/env node
/**
 * Fails when the registry, its generated output, the docs catalogue, the type
 * roles or the agent barrel drift from `lib/ds/platform-contract.ts`.
 *
 *   node scripts/check-registry.mjs
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const problems = [];
const fail = (area, message) => problems.push({ area, message });
const read = (path) => readFileSync(join(ROOT, path), "utf8");

const contractSrc = read("lib/ds/platform-contract.ts");

// The tables are plain literals, so they are read from the source without a TypeScript loader.
function block(name) {
  const at = contractSrc.indexOf(`export const ${name}`);
  if (at < 0) throw new Error(`platform-contract.ts has no ${name}`);
  const open = contractSrc.indexOf("[", contractSrc.indexOf("=", at));
  let depth = 0;
  for (let i = open; i < contractSrc.length; i += 1) {
    if (contractSrc[i] === "[") depth += 1;
    else if (contractSrc[i] === "]" && --depth === 0) return contractSrc.slice(open, i + 1);
  }
  throw new Error(`platform-contract.ts: ${name} is unterminated`);
}

function records(name, fields) {
  const out = [];
  for (const chunk of block(name).split(/\}\s*,/)) {
    const row = {};
    for (const field of fields) {
      const m = chunk.match(new RegExp(`\\b${field}:\\s*"([^"]*)"`));
      if (m) row[field] = m[1];
    }
    if (Object.keys(row).length) out.push(row);
  }
  return out;
}

const CONTRACT = records("PLATFORM_CONTRACT", ["name", "ownership", "delivery"]);
const RENAMES = records("RENAMES", ["from", "to", "kind"]);
const REMOVED = [...block("REMOVED_ITEMS").matchAll(/"([^"]+)"/g)].map((m) => m[1]);
if (CONTRACT.length === 0) fail("contract", "PLATFORM_CONTRACT parsed as empty");

/* ── The authored registry ── */

const registry = JSON.parse(read("registry.json"));
const registryNames = new Set(registry.items.map((i) => i.name));

for (const rename of RENAMES) {
  if (rename.kind !== "item") continue;
  if (registryNames.has(rename.from)) fail("renames", `registry.json still ships the old item "${rename.from}" — it is "${rename.to}", with no alias`);
  if (!registryNames.has(rename.to)) fail("renames", `registry.json has no item "${rename.to}"`);
}
for (const removed of REMOVED) {
  if (registryNames.has(removed)) fail("removals", `registry.json still ships "${removed}", which the contract removes`);
}

for (const item of registry.items) {
  const entry = CONTRACT.find((e) => e.name === item.name);
  if (entry && ["package-native", "browser-native", "composition"].includes(entry.delivery)) {
    fail("ownership", `"${item.name}" is ${entry.delivery} in the contract but ships as a registry item`);
  }
  for (const dep of item.registryDependencies ?? []) {
    if (!dep.startsWith("@elattar")) {
      fail("namespace", `"${item.name}" declares a bare registry dependency "${dep}" — the CLI resolves bare names against the default registry`);
    }
    const bare = dep.replace(/^@elattar(-blocks)?\//, "");
    if (bare === item.name) fail("namespace", `"${item.name}" depends on itself`);
    else if (!registryNames.has(bare)) fail("namespace", `"${item.name}" depends on "${dep}", which is not in this registry`);
  }
}

if (existsSync(join(ROOT, "registry"))) {
  fail("catalog", "registry/ exists — registry.json is the only authored catalogue and public/r/** the only generated output");
}

/* ── Generated output ── */

const advertised = CONTRACT.filter(
  (e) => ["installable", "block", "foundation"].includes(e.ownership) && ["react", "css-native"].includes(e.delivery),
);
if (!existsSync(join(ROOT, "public/r/index.json")) || !existsSync(join(ROOT, "public/r/commands.json"))) {
  fail("generated", "public/r has no index.json or commands.json — run `npm run registry:build`");
} else {
  const built = new Set(JSON.parse(read("public/r/index.json")).items.map((i) => i.name));
  for (const name of registryNames) if (!built.has(name)) fail("generated", `"${name}" is in registry.json but not in public/r/index.json — regenerate`);
  for (const name of built) if (!registryNames.has(name)) fail("generated", `public/r/index.json ships "${name}", which registry.json no longer declares — regenerate`);
  const commands = JSON.parse(read("public/r/commands.json"));
  for (const entry of advertised) {
    if (registryNames.has(entry.name) && !commands[entry.name]) fail("generated", `"${entry.name}" has no generated install command`);
  }
}

/* ── The docs catalogue ── */

const documented = new Set([...read("lib/ds/docs/catalog.ts").matchAll(/component-docs\/([a-z0-9-]+)\/meta/g)].map((m) => m[1]));
for (const name of documented) {
  if (!CONTRACT.some((e) => e.name === name)) fail("docs", `the catalogue documents "${name}", which is not in the contract`);
  for (const file of ["meta.ts", "page.tsx"]) {
    if (!existsSync(join(ROOT, "components/docs/component-docs", name, file))) fail("docs", `"${name}" is in the catalogue but has no ${file}`);
  }
}

/* ── Type roles ── */

const contractRoles = [...block("TYPOGRAPHY").matchAll(/role:\s*"([^"]+)"/g)].map((m) => m[1]);
const typesetCss = read("styles/typeset.css");
const typesetRoles = new Set([...typesetCss.matchAll(/\.type-([a-z0-9-]+)\s*[,{]/g)].map((m) => m[1]));
for (const role of contractRoles) if (!typesetRoles.has(role)) fail("typography", `the contract declares "${role}", which styles/typeset.css has no .type-${role} for`);
for (const role of typesetRoles) if (!contractRoles.includes(role)) fail("typography", `styles/typeset.css declares .type-${role}, which the contract does not`);

const tokensCss = read("styles/tokens.css");
for (const role of contractRoles) {
  for (const prop of [`--text-${role}`, `--leading-${role}`]) {
    const declared = (tokensCss.match(new RegExp(`${prop}\\s*:`, "g")) ?? []).length;
    if (declared < 3) fail("typography", `${prop} is declared ${declared} time(s) in styles/tokens.css — every role needs a phone, tablet and desktop step`);
  }
}
if (typesetCss.includes("@media")) {
  fail("typography", "styles/typeset.css declares a media query — the responsive steps belong to the tokens");
}

/* ── The agent barrel ── */

const barrel = join(ROOT, "components/agent/index.ts");
if (existsSync(barrel)) {
  const src = readFileSync(barrel, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const published = new Set();
  for (const m of src.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}/g)) {
    for (const part of m[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (name) published.add(name.replace(/^type\s+/, ""));
    }
  }
  for (const leaked of ["CubeScene", "OrbState", "CubeAvatar", "Orb", "Cube", "Scene"]) {
    if (published.has(leaked)) fail("agent", `components/agent/index.ts publishes "${leaked}" — renderer names stay private; the public name is AgentAvatar`);
  }
  for (const required of ["AgentAvatar", "AgentWorkspace"]) {
    if (!published.has(required)) fail("agent", `components/agent/index.ts does not publish "${required}"`);
  }
}

/* ── Report ── */

if (problems.length === 0) {
  console.log(`✓ check:registry — ${CONTRACT.length} contract entries, ${registry.items.length} registry items, ${contractRoles.length} type roles. No drift.`);
  process.exit(0);
}
console.error(`✗ check:registry — ${problems.length} problem(s):\n`);
for (const p of problems) console.error(`  [${p.area}] ${p.message}`);
process.exit(1);
