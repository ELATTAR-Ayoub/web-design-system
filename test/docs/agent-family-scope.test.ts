/** @covers agent-workspace */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { catalogEntriesIn } from "@/lib/ds/docs/catalog";

const GONE = ["agent-console", "agent-launcher", "agent-composer", "agent-prompt-bar", "agent-matrix", "voice-indicator"];

describe("the agent family is the workspace", () => {
  it("lists no removed page", () => {
    const names = catalogEntriesIn("agent").map((e) => e.meta.name);
    for (const n of GONE) expect(names).not.toContain(n);
    expect(names).toContain("agent-workspace");
    expect(names.filter((n) => n.startsWith("ai-"))).toHaveLength(48);
  });
  it("ships no old console source", () => {
    for (const f of ["components/agent/agent-console.tsx", "components/agent/prompt-bar.tsx", "components/agent/matrix.tsx"]) {
      expect(existsSync(f)).toBe(false);
    }
  });

  it("leaves no live mention of the removed console in current source or docs", () => {
    const FORBIDDEN = /agent-console|AgentConsole|PromptBar/;
    const TEXT = /\.(tsx?|mjs|cjs|js|json|css|md|mdx|txt|yml|yaml)$/;
    const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "test-results"]);
    // Historical records, generated ledgers, and the places that assert the removal.
    const HISTORICAL = [
      "docs/superpowers/",
      "docs/audits/",
      "docs/migrations/",
      "docs/contracts/",
      "lib/ds/platform-contract.ts",
      "test/docs/agent-family-scope.test.ts",
    ];
    const root = process.cwd();
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        if (SKIP_DIRS.has(entry)) continue;
        const full = join(dir, entry);
        const rel = relative(root, full).split(sep).join("/");
        if (HISTORICAL.some((h) => rel === h || rel.startsWith(h))) continue;
        if (statSync(full).isDirectory()) walk(full);
        else if (TEXT.test(entry) && FORBIDDEN.test(readFileSync(full, "utf8"))) hits.push(rel);
      }
    };
    for (const top of ["app", "components", "lib", "hooks", "styles", "scripts", "docs", ".claude/skills"]) {
      if (existsSync(join(root, top))) walk(join(root, top));
    }
    for (const file of ["AGENTS.md", "RULES.md", "README.md"]) {
      if (existsSync(join(root, file)) && FORBIDDEN.test(readFileSync(join(root, file), "utf8"))) hits.push(file);
    }
    expect(hits).toEqual([]);
  });
});
