import { execFileSync } from "node:child_process";
import { closeSync, openSync, readdirSync, readFileSync, readSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";

const ALLOWED = [":!test/licence/no-third-party.test.ts", ":!docs/superpowers/plans/2026-10-10-licence-cleanup.md", ":!THIRD_PARTY_NOTICES.md", ":!package-lock.json"];

const ROOT = process.cwd();
const WALK_SKIP = new Set(["node_modules", ".next", ".git"]);

/** True when the project is a git work tree; a plain export of the source is not. */
function insideGitWorkTree(): boolean {
  try {
    return execFileSync("git", ["rev-parse", "--is-inside-work-tree"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim() === "true";
  } catch {
    return false;
  }
}

const IN_REPO = insideGitWorkTree();

function isBinary(file: string): boolean {
  const fd = openSync(file, "r");
  try {
    const buf = Buffer.alloc(8000);
    const n = readSync(fd, buf, 0, buf.length, 0);
    return buf.subarray(0, n).includes(0);
  } finally {
    closeSync(fd);
  }
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (WALK_SKIP.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/** The same search as `git grep -l -i -E`, for a tree that has no git metadata. */
function walkHits(pattern: string, excludes: string[]): string[] {
  const re = new RegExp(pattern, "i");
  const prefixes = excludes.map((e) => e.replace(/^:!/, ""));
  return walk(ROOT)
    .map((f) => relative(ROOT, f).split(sep).join("/"))
    .filter((f) => !prefixes.some((p) => f === p || f.startsWith(`${p}/`)))
    .filter((f) => !isBinary(join(ROOT, f)) && re.test(readFileSync(join(ROOT, f), "utf8")));
}

function hits(pattern: string, extraArgs: string[] = []) {
  if (!IN_REPO) return walkHits(pattern, [...ALLOWED, ...extraArgs]);
  try {
    return execFileSync("git", ["grep", "-l", "-i", "-E", pattern, "--", ".", ...ALLOWED, ...extraArgs], { encoding: "utf8" })
      .split("\n").filter(Boolean);
  } catch (e) {
    if ((e as { status?: number }).status === 1) return []; // git grep: no match
    throw e;
  }
}

describe("no third-party material", () => {
  it("no interfere.com clone or its reference theme", () => {
    expect(hits("interfere|theme-reference", [":!docs/superpowers"])).toEqual([]);
  });
  it("no RPG skin", () => {
    expect(hits("rpg-|imgs/rpg|moon court", [":!docs/superpowers"])).toEqual([]);
  });
  it("no built-in third-party chat providers (Task 5)", () => {
    expect(hits("chatgpt\\.com|claude\\.ai/new|cursor\\.com|t3\\.chat|scira\\.ai|v0\\.app", [":!docs/superpowers"])).toEqual([]);
  });
  it("no Pokémon artwork or names (Task 3)", () => {
    expect(hits("pok[eé]mon|silver tempest|sample-pack|sample-card")).toEqual([]);
  });
  it("no Rive persona or Vercel-hosted .riv files (Task 6)", () => {
    expect(hits("@rive-app|vercel-storage\\.com|ai-persona", [":!docs/superpowers"])).toEqual([]);
  });
  it("no React Bits port (Task 7)", () => {
    // docs/superpowers holds plans and history.
    expect(hits("react ?bits|commons clause|refine-?frame", [":!docs/superpowers"])).toEqual([]);
  });
  it("no remote model logos (Task 5)", () => {
    expect(hits("models\\.dev", [":!docs/superpowers"])).toEqual([]);
  });
  it("no Yukirhythm attribution (Tasks 8-9)", () => {
    expect(hits("yuki", [":!docs/superpowers"])).toEqual([]);
  });
});
