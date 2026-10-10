#!/usr/bin/env node
/**
 * Shared helpers for the shadcn-compatible registry.
 *
 * Used by `generate-registry.mjs` (writes `registry.json`) and by
 * `build-registry.mjs` / the vitest schema test (validate it). Keeping this
 * logic in one module means "what does this file import" is answered the
 * same way everywhere instead of three slightly different regexes drifting
 * apart.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

// Node builtins + runtime globals that never need a `dependencies` entry and
// are never `@/`-aliased. `react`/`react-dom`/`next` are assumed present in
// any Next.js consumer, so the registry does not declare them either — that
// matches how shadcn's own registry treats framework peers.
const IMPLICIT_PACKAGES = new Set([
  "react",
  "react-dom",
  "react/jsx-runtime",
  "next",
]);

const NODE_BUILTIN_PREFIX = /^node:/;

/** Extract every static/dynamic import specifier referenced by a file. */
export function listImportSpecifiers(absPath) {
  const text = fs.readFileSync(absPath, "utf8");
  const specifiers = new Set();
  const patterns = [
    /import\s+(?:type\s+)?(?:[\s\S]*?)\s+from\s+["']([^"']+)["']/g,
    /import\s*["']([^"']+)["']/g,
    /export\s+(?:type\s+)?(?:\*|\{[\s\S]*?\})\s+from\s+["']([^"']+)["']/g,
    /\bimport\(\s*["']([^"']+)["']\s*\)/g,
    /\brequire\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const re of patterns) {
    for (const m of text.matchAll(re)) specifiers.add(m[1]);
  }
  return [...specifiers];
}

/** Root npm package name for an external specifier (`@scope/pkg/sub` -> `@scope/pkg`). */
export function packageRootName(specifier) {
  if (specifier.startsWith("@")) {
    const [scope, name] = specifier.split("/");
    return `${scope}/${name}`;
  }
  return specifier.split("/")[0];
}

export function isRelative(specifier) {
  return specifier.startsWith(".");
}

export function isAlias(specifier) {
  return specifier.startsWith("@/");
}

export function isImplicit(specifier) {
  if (NODE_BUILTIN_PREFIX.test(specifier)) return true;
  return IMPLICIT_PACKAGES.has(packageRootName(specifier));
}

/** `@/components/ui/button` -> absolute path, trying .tsx/.ts/.mjs and /index.*. */
export function resolveAliasPath(specifier, repoRoot = REPO_ROOT) {
  const rel = specifier.slice(2); // strip "@/"
  const base = path.join(repoRoot, rel);
  const candidates = [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    `${base}.mjs`,
    path.join(base, "index.tsx"),
    path.join(base, "index.ts"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return null;
}

/** Repo-root-relative POSIX path, for storing in registry.json. */
export function toRepoRelative(absPath, repoRoot = REPO_ROOT) {
  return path.relative(repoRoot, absPath).split(path.sep).join("/");
}
