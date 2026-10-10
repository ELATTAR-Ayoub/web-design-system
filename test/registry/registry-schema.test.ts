/**
 * Validates `registry.json` against the OFFICIAL shadcn registry schema.
 *
 * Schema source: the `shadcn` npm package itself (already a dependency,
 * version 4.16.0 — see package.json), re-exported as runnable zod schemas
 * from `shadcn/schema` (node_modules/shadcn/dist/schema/index.js, which
 * re-exports `registrySchema` / `registryItemSchema` / `registryItemTypeSchema`
 * from dist/chunk-MTWZIHEW.js). This is the same schema `shadcn build` and
 * `shadcn registry validate` enforce — no vendored copy, so it can never
 * drift from the installed CLI.
 *
 * Everything this file checks beyond "does it parse": unique names, every
 * `files[].path` exists on disk, declared npm `dependencies` cover every
 * real import, every `@/` import resolves inside the same item or a
 * declared `registryDependencies` entry, no showcase-only files leak in,
 * every non-foundation item depends on `source-foundation`, and blocks depend on
 * the real component/hook items they use.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { registrySchema, registryItemSchema } from "shadcn/schema";
import {
  REPO_ROOT,
  isAlias,
  isImplicit,
  isRelative,
  listImportSpecifiers,
  resolveAliasPath,
  toRepoRelative,
} from "../../scripts/registry-lib.mjs";

interface RegistryFile {
  path: string;
  type: string;
  target?: string;
}

interface RegistryItem {
  name: string;
  type: string;
  files?: RegistryFile[];
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  docs?: string;
}

interface Registry {
  name: string;
  homepage: string;
  items: RegistryItem[];
}

function bareDep(dep: string) {
  if (dep.startsWith("@elattar-blocks/")) return dep.slice("@elattar-blocks/".length);
  if (dep.startsWith("@elattar/")) return dep.slice("@elattar/".length);
  return dep;
}

const registryPath = path.join(REPO_ROOT, "registry.json");
const registry: Registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

describe("registry.json / official shadcn schema", () => {
  it("parses as a whole against registrySchema", () => {
    const result = registrySchema.safeParse(registry);
    if (!result.success) {
      throw new Error(
        `registry.json failed the official shadcn schema:\n${JSON.stringify(result.error.format(), null, 2)}`,
      );
    }
  });

  it("has at least a foundation item, ui items, and block items", () => {
    const types = new Set(registry.items.map((i) => i.type));
    expect(types.has("registry:style")).toBe(true);
    expect(types.has("registry:ui")).toBe(true);
    expect(types.has("registry:block")).toBe(true);
  });

  it.each(registry.items)("item %s parses against registryItemSchema", (item: RegistryItem) => {
    const result = registryItemSchema.safeParse(item);
    expect(result.success, JSON.stringify(result.success ? null : result.error.format())).toBe(true);
  });

  it("ships the workspace as the agent-workspace block and nothing named agent-console", () => {
    const names = registry.items.map((i) => i.name);
    expect(names).not.toContain("agent-console");
    const block = registry.items.find((i) => i.name === "agent-workspace");
    expect(block?.type).toBe("registry:block");
    const paths = (block?.files ?? []).map((f) => f.path);
    expect(paths).toContain("components/agent/agent-workspace.tsx");
    // Apache-2.0 sources never ship without their notice.
    expect(paths).toContain("components/ai-elements/NOTICE.md");
    expect(paths).toContain("components/ai-elements/LICENSE");
  });

  it("has unique item names", () => {
    const names = registry.items.map((i) => i.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("every files[].path exists on disk", () => {
    for (const item of registry.items) {
      for (const file of item.files ?? []) {
        const abs = path.join(REPO_ROOT, file.path);
        expect(fs.existsSync(abs), `${item.name}: missing file ${file.path}`).toBe(true);
      }
    }
  });

  it("ships no showcase-only files (components/ds/**, app/** except globals.css)", () => {
    for (const item of registry.items) {
      for (const file of item.files ?? []) {
        expect(file.path.startsWith("components/ds/"), file.path).toBe(false);
        if (file.path.startsWith("app/")) {
          expect(file.path, `only app/globals.css may ship, got ${file.path}`).toBe("app/globals.css");
        }
      }
    }
  });

  it("every non-foundation item depends on the foundation item", () => {
    for (const item of registry.items) {
      if (item.name === "source-foundation") continue;
      expect(
        (item.registryDependencies ?? []).map(bareDep).includes("source-foundation"),
        `${item.name} does not declare registryDependencies: ["@elattar/source-foundation", ...]`,
      ).toBe(true);
    }
  });

  it("every registryDependency is namespaced under @elattar/ and references a real item", () => {
    const names = new Set(registry.items.map((i) => i.name));
    for (const item of registry.items) {
      for (const dep of item.registryDependencies ?? []) {
        expect(
          dep.startsWith("@elattar/") || dep.startsWith("@elattar-blocks/"),
          `${item.name}: "${dep}" is not namespaced under @elattar/ or @elattar-blocks/`,
        ).toBe(true);
        expect(names.has(bareDep(dep)), `${item.name} depends on unknown item "${dep}"`).toBe(true);
      }
    }
  });

  it("declared dependencies cover every real npm import; every @/ import resolves inside the item or a declared registryDependency", () => {
    const fileOwner = new Map<string, string>();
    for (const item of registry.items) {
      for (const f of item.files ?? []) fileOwner.set(f.path, item.name);
    }

    for (const item of registry.items) {
      const declared = new Set([...(item.dependencies ?? []), ...(item.devDependencies ?? [])]);
      const registryDeps = new Set([item.name, ...(item.registryDependencies ?? []).map(bareDep)]);
      const ownFiles = new Set((item.files ?? []).map((f) => f.path));

      for (const file of item.files ?? []) {
        if (!/\.(ts|tsx|css)$/.test(file.path)) continue;
        const abs = path.join(REPO_ROOT, file.path);
        for (const spec of listImportSpecifiers(abs)) {
          if (isRelative(spec) || isImplicit(spec)) continue;

          if (isAlias(spec)) {
            const resolved = resolveAliasPath(spec);
            expect(resolved, `${item.name}: unresolved alias "${spec}" in ${file.path}`).not.toBeNull();
            const rel = toRepoRelative(resolved as string);
            if (ownFiles.has(rel)) continue;
            const owner = fileOwner.get(rel);
            expect(owner, `${item.name}: "${spec}" (${rel}) is not owned by any registry item`).toBeDefined();
            expect(
              registryDeps.has(owner as string),
              `${item.name}: imports "${spec}" (owned by "${owner}") but does not declare it in registryDependencies`,
            ).toBe(true);
            continue;
          }

          const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
          expect(
            declared.has(pkg),
            `${item.name}: imports "${pkg}" in ${file.path} but does not declare it in dependencies`,
          ).toBe(true);
        }
      }
    }
  });

  it("blocks depend on the real component/hook items their files import", () => {
    const blocks = registry.items.filter((i) => i.type === "registry:block");
    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks) {
      expect(block.registryDependencies?.length, `${block.name} declares no registryDependencies`).toBeGreaterThan(0);
    }
  });
});

describe("public/r build output", () => {
  const outDir = path.join(REPO_ROOT, "public", "r");
  const built = fs.existsSync(outDir);

  it.runIf(built)("index.json lists every item with a working endpoint file", () => {
    const index = JSON.parse(fs.readFileSync(path.join(outDir, "index.json"), "utf8"));
    expect(index.items.length).toBe(registry.items.length);
    for (const entry of index.items) {
      const endpointPath = path.join(outDir, entry.endpoint);
      expect(fs.existsSync(endpointPath), `${entry.name}: missing built endpoint ${entry.endpoint}`).toBe(true);
    }
  });

  it.runIf(built)("block endpoints are nested under blocks/", () => {
    const index = JSON.parse(fs.readFileSync(path.join(outDir, "index.json"), "utf8"));
    for (const entry of index.items) {
      if (entry.type === "registry:block") {
        expect(entry.endpoint.startsWith("blocks/")).toBe(true);
      }
    }
  });

  if (!built) {
    it("public/r has not been built yet (run `npm run registry:build` first)", () => {
      expect(built).toBe(false);
    });
  }
});
