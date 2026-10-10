#!/usr/bin/env node
/**
 * Builds the static registry artifacts served at /r/**.
 *
 * A thin wrapper around the official `shadcn build` (shadcn@4.16.0 — this is
 * not a second CLI): it inlines every item's file `content` from disk, then
 * this script re-shapes the flat output shadcn writes into the layout the
 * brief asks for (`blocks/<name>.json` nested, an `index.json`, and a
 * `commands.json` for docs), and runs a set of
 * fast guards shadcn build does not run for us: duplicate output paths,
 * dependency cycles, and unresolved `@/` aliases.
 *
 *   node scripts/build-registry.mjs
 *
 * Reads registry.json, writes public/r/**.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  REPO_ROOT,
  isAlias,
  isRelative,
  isImplicit,
  listImportSpecifiers,
  resolveAliasPath,
  toRepoRelative,
} from "./registry-lib.mjs";
import { REGISTRY_URL } from "./registry-manifest.mjs";

const REGISTRY_JSON = path.join(REPO_ROOT, "registry.json");
// Output directory is env-driven too (REGISTRY_OUT_DIR, or --out <dir> on the
// CLI), defaulting to public/r. This exists so tests can build against a
// throwaway REGISTRY_URL without clobbering the real public/r/** the app and
// other tests read from — see test/registry/docs-commands.test.ts.
const outFlagIndex = process.argv.indexOf("--out");
const OUT_DIR_ARG = outFlagIndex !== -1 ? process.argv[outFlagIndex + 1] : undefined;
const OUT_DIR = path.resolve(
  REPO_ROOT,
  OUT_DIR_ARG ?? process.env.REGISTRY_OUT_DIR ?? path.join("public", "r"),
);

// registryDependencies in registry.json are namespaced ("@elattar/button")
// so the shadcn CLI resolves them against this catalog instead of the
// default ui.shadcn.com registry (see generate-registry.mjs). Strip the
// namespace back off for the guards below, which reason about bare item names.
function bareDep(dep) {
  if (dep.startsWith("@elattar-blocks/")) return dep.slice("@elattar-blocks/".length);
  if (dep.startsWith("@elattar/")) return dep.slice("@elattar/".length);
  return dep;
}

function fail(message) {
  console.error(`\nregistry build failed: ${message}\n`);
  process.exit(1);
}

if (!fs.existsSync(REGISTRY_JSON)) fail("registry.json does not exist");

const registry = JSON.parse(fs.readFileSync(REGISTRY_JSON, "utf8"));
const items = registry.items ?? [];

// ---- Guard 1: unique names ------------------------------------------------
const seenNames = new Set();
for (const item of items) {
  if (seenNames.has(item.name)) fail(`duplicate item name "${item.name}"`);
  seenNames.add(item.name);
}

// ---- Guard 2: every declared file exists on disk --------------------------
for (const item of items) {
  for (const file of item.files ?? []) {
    if (!fs.existsSync(path.join(REPO_ROOT, file.path))) {
      fail(`${item.name}: file does not exist: ${file.path}`);
    }
  }
}

// ---- Guard 3: no duplicate output target paths across the whole catalog ---
const targetOwners = new Map();
for (const item of items) {
  for (const file of item.files ?? []) {
    const target = file.target ?? file.path;
    if (!targetOwners.has(target)) targetOwners.set(target, []);
    targetOwners.get(target).push(item.name);
  }
}
for (const [target, owners] of targetOwners) {
  const distinct = [...new Set(owners)];
  // A shared file (e.g. foundation's icon.tsx also listed by nothing else) is
  // fine when only one item owns it. Multiple *different* items writing the
  // same consumer-side path is the failure this guards against.
  if (distinct.length > 1) {
    fail(`duplicate output path "${target}" claimed by: ${distinct.join(", ")}`);
  }
}

// ---- Guard 4: registryDependencies form a DAG (no cycles) -----------------
const byName = new Map(items.map((i) => [i.name, i]));
function detectCycle() {
  const state = new Map(); // 0=unvisited,1=visiting,2=done
  const stack = [];
  function visit(name) {
    const s = state.get(name) ?? 0;
    if (s === 2) return null;
    if (s === 1) return [...stack, name];
    state.set(name, 1);
    stack.push(name);
    const item = byName.get(name);
    for (const rawDep of item?.registryDependencies ?? []) {
      const dep = bareDep(rawDep);
      if (!byName.has(dep)) fail(`${name}: registryDependency "${rawDep}" does not exist`);
      const cycle = visit(dep);
      if (cycle) return cycle;
    }
    stack.pop();
    state.set(name, 2);
    return null;
  }
  for (const item of items) {
    const cycle = visit(item.name);
    if (cycle) return cycle;
  }
  return null;
}
const cycle = detectCycle();
if (cycle) fail(`dependency cycle: ${cycle.join(" -> ")}`);

// ---- Guard 5: every non-relative, non-@/, non-implicit import is declared;
//      every @/ import resolves to a file the item owns or depends on -------
const fileOwner = new Map();
for (const item of items) {
  for (const f of item.files ?? []) fileOwner.set(f.path, item.name);
}
for (const item of items) {
  const declaredDeps = new Set(item.dependencies ?? []);
  const declaredDevDeps = new Set(item.devDependencies ?? []);
  const registryDeps = new Set([item.name, ...(item.registryDependencies ?? []).map(bareDep)]);
  const ownFiles = new Set((item.files ?? []).map((f) => f.path));
  for (const file of item.files ?? []) {
    const abs = path.join(REPO_ROOT, file.path);
    if (!/\.(ts|tsx|mts|cts|css)$/.test(abs)) continue;
    for (const spec of listImportSpecifiers(abs)) {
      if (isRelative(spec) || isImplicit(spec)) continue;
      if (isAlias(spec)) {
        const resolved = resolveAliasPath(spec);
        if (!resolved) fail(`${item.name}: unresolved alias "${spec}" in ${file.path}`);
        const rel = toRepoRelative(resolved);
        if (ownFiles.has(rel)) continue;
        const owner = fileOwner.get(rel);
        if (!owner) fail(`${item.name}: "${spec}" (${rel}) is not owned by any item`);
        if (!registryDeps.has(owner)) {
          fail(`${item.name}: imports "${spec}" (owned by "${owner}") without declaring it in registryDependencies`);
        }
        continue;
      }
      const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
      if (!declaredDeps.has(pkg) && !declaredDevDeps.has(pkg)) {
        fail(`${item.name}: imports "${pkg}" in ${file.path} without declaring it in dependencies`);
      }
    }
  }
}

// ---- Guard 6: no showcase-only source in the catalog -----------------------
const FORBIDDEN_PATH_PATTERNS = [/^components\/ds\//, /^app\//];
for (const item of items) {
  for (const file of item.files ?? []) {
    if (FORBIDDEN_PATH_PATTERNS.some((re) => re.test(file.path)) && file.path !== "app/globals.css") {
      fail(`${item.name}: showcase-only path shipped in registry: ${file.path}`);
    }
  }
}

console.log(`Validated ${items.length} registry items. Running shadcn build...`);

// ---- Build with the official shadcn CLI ------------------------------------
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// Windows' npx is npx.cmd, which Node can only spawn through a shell. All
// arguments here are script-controlled constants (no user input reaches this
// call), so the shell-injection risk `shell: true` normally carries does not
// apply.
execFileSync("npx", ["shadcn", "build", "registry.json", "-o", OUT_DIR, "-c", REPO_ROOT], {
  cwd: REPO_ROOT,
  stdio: "inherit",
  shell: process.platform === "win32",
});

// `shadcn build` writes public/r/<name>.json for every item flat, plus a
// public/r/registry.json copy of the source. Re-shape into the brief's
// layout: blocks nested under blocks/, an index.json, no stray copy of the
// source registry.json.
const flatRegistryCopy = path.join(OUT_DIR, "registry.json");
if (fs.existsSync(flatRegistryCopy)) fs.rmSync(flatRegistryCopy);

const blocksDir = path.join(OUT_DIR, "blocks");
fs.mkdirSync(blocksDir, { recursive: true });

const indexItems = [];
for (const item of items) {
  const flatPath = path.join(OUT_DIR, `${item.name}.json`);
  if (!fs.existsSync(flatPath)) fail(`shadcn build did not produce ${item.name}.json`);
  const doc = JSON.parse(fs.readFileSync(flatPath, "utf8"));

  let endpoint = `${item.name}.json`;
  if (item.type === "registry:block") {
    endpoint = `blocks/${item.name}.json`;
    fs.writeFileSync(path.join(blocksDir, `${item.name}.json`), JSON.stringify(doc, null, 2) + "\n");
    fs.rmSync(flatPath);
  } else {
    fs.writeFileSync(flatPath, JSON.stringify(doc, null, 2) + "\n");
  }

  indexItems.push({
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    endpoint,
    addCommand: `npx shadcn@latest add ${REGISTRY_URL}/${endpoint}`,
  });
}

const index = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: registry.name,
  homepage: registry.homepage,
  registryUrl: REGISTRY_URL,
  items: indexItems,
};
fs.writeFileSync(path.join(OUT_DIR, "index.json"), JSON.stringify(index, null, 2) + "\n");

// docs-commands.test.ts checks documentation snippets against this file.
const commands = Object.fromEntries(indexItems.map((i) => [i.name, i.addCommand]));
fs.writeFileSync(path.join(OUT_DIR, "commands.json"), JSON.stringify(commands, null, 2) + "\n");

console.log(`Built ${indexItems.length} registry artifacts into public/r/`);
