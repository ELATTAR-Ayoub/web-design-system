#!/usr/bin/env node
/**
 * Writes `registry.json` (the source catalog) from `registry-manifest.mjs`.
 *
 * The manifest says which files belong to which item. This script parses
 * every one of those files' real imports and fills in `dependencies` (npm
 * packages) and `registryDependencies` (other items in this catalog)
 * automatically, so the two never drift from what the code actually
 * imports. Re-run after adding/removing a file from an item, or after
 * changing an item's imports:
 *
 *   node scripts/generate-registry.mjs
 */
import fs from "node:fs";
import path from "node:path";
import {
  REPO_ROOT,
  listImportSpecifiers,
  packageRootName,
  isRelative,
  isAlias,
  isImplicit,
  resolveAliasPath,
  toRepoRelative,
} from "./registry-lib.mjs";
import {
  ITEMS,
  REGISTRY_NAME,
  REGISTRY_HOMEPAGE,
  FOUNDATION_ITEM_NAME,
  FOUNDATION_OWNED_REPO_PATHS,
} from "./registry-manifest.mjs";

// repo-relative file path -> owning item name
const fileOwner = new Map();
for (const item of ITEMS) {
  for (const f of item.files) fileOwner.set(f.path, item.name);
}

const DEV_ONLY_PACKAGES = new Set(["tailwindcss"]);

function computeItemDeps(item) {
  const npmDeps = new Set(item.dependencies ?? []);
  const devDeps = new Set(item.devDependencies ?? []);
  const registryDeps = new Set(item.registryDependencies ?? []);
  const ownFiles = new Set(item.files.map((f) => f.path));

  for (const file of item.files) {
    const abs = path.join(REPO_ROOT, file.path);
    if (!fs.existsSync(abs)) {
      throw new Error(`${item.name}: declared file does not exist: ${file.path}`);
    }
    for (const spec of listImportSpecifiers(abs)) {
      if (isRelative(spec)) continue; // internal to the item by construction
      if (isImplicit(spec)) continue; // react/react-dom/next/node builtins
      if (isAlias(spec)) {
        const resolved = resolveAliasPath(spec);
        if (!resolved) {
          throw new Error(
            `${item.name}: unresolved alias "${spec}" imported from ${file.path}`,
          );
        }
        const rel = toRepoRelative(resolved);
        if (ownFiles.has(rel) || FOUNDATION_OWNED_REPO_PATHS.has(rel)) {
          if (item.name !== FOUNDATION_ITEM_NAME) registryDeps.add(FOUNDATION_ITEM_NAME);
          continue;
        }
        const owner = fileOwner.get(rel);
        if (!owner) {
          throw new Error(
            `${item.name}: "${spec}" (${rel}) is not owned by any registry item`,
          );
        }
        if (owner !== item.name) registryDeps.add(owner);
        continue;
      }
      const pkg = packageRootName(spec);
      if (DEV_ONLY_PACKAGES.has(pkg)) devDeps.add(pkg);
      else npmDeps.add(pkg);
    }
    if (item.name !== FOUNDATION_ITEM_NAME) registryDeps.add(FOUNDATION_ITEM_NAME);
  }

  return {
    dependencies: [...npmDeps].sort(),
    devDependencies: [...devDeps].sort(),
    registryDependencies: [...registryDeps].sort(),
  };
}

const typeByName = new Map(ITEMS.map((i) => [i.name, i.type]));

// `shadcn build` writes block endpoints nested under public/r/blocks/<name>.json
// (see build-registry.mjs), so a dependency on a block needs the
// @elattar-blocks/{name}.json registries entry; everything else (foundation,
// ui, hooks) is flat and uses @elattar/{name}.json.
function namespaceFor(name) {
  return typeByName.get(name) === "registry:block" ? "@elattar-blocks" : "@elattar";
}

const items = ITEMS.map((item) => {
  const { dependencies, devDependencies, registryDependencies } = computeItemDeps(item);
  const out = {
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
  };
  if (dependencies.length) out.dependencies = dependencies;
  if (devDependencies.length) out.devDependencies = devDependencies;
  // Namespaced with the registry's own `@elattar[-blocks]/` prefix: the
  // shadcn CLI resolves a *bare* registryDependencies entry against the
  // DEFAULT (ui.shadcn.com) registry regardless of which registry the item
  // itself came from — confirmed against the real CLI during the Step 6
  // rehearsal, where `button`'s bare foundation dependency 404'd against
  // ui.shadcn.com/r/styles/radix-nova/foundation.json instead of this
  // catalog. Prefixing makes it resolve against components.json's
  // `registries["@elattar"]` / `registries["@elattar-blocks"]` entries instead.
  if (registryDependencies.length) {
    out.registryDependencies = registryDependencies.map((d) => `${namespaceFor(d)}/${d}`);
  }
  out.files = item.files.map((f) => ({
    path: f.path,
    type: f.type,
    ...(f.target ? { target: f.target } : {}),
  }));
  if (item.docs) out.docs = item.docs;
  return out;
});

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: REGISTRY_NAME,
  homepage: REGISTRY_HOMEPAGE,
  items,
};

const outPath = path.join(REPO_ROOT, "registry.json");
fs.writeFileSync(outPath, JSON.stringify(registry, null, 2) + "\n");

// `registry/**` USED TO BE WRITTEN HERE, and is not any more.
//
// It mirrored every item as its own `registry-item.json` on the reasoning that
// a per-item file is human-browsable and individually diffable. In practice it
// was a pure duplicate — all 73 items byte-identical to their `registry.json`
// entry apart from a `$schema` line — read by nothing: not the shadcn CLI
// (whose `include` accepts nested registry.json files, not individual items),
// not `build-registry.mjs`, not the app, not a test. What it actually did was
// give the catalog a second copy that could go stale, and it did: five items
// renamed in `registry.json` left five orphans behind under `registry/ui/`
// that no build step noticed.
//
// `registry.json` is the sole authored catalog and `public/r/**` the sole
// generated output. Two artefacts, one of them derived, and nothing in between.

console.log(`Wrote ${items.length} items to registry.json`);
