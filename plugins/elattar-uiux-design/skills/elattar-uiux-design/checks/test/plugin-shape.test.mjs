import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const skillDir = resolve(here, "..", "..");
const pluginDir = resolve(skillDir, "..", "..");
const repoRoot = resolve(pluginDir, "..", "..");
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === "node_modules") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

describe("plugin shape", () => {
  test("hooks/hooks.json runs on-edit.mjs after Edit, Write and MultiEdit through ${CLAUDE_PLUGIN_ROOT}", () => {
    const h = readJson(join(pluginDir, "hooks", "hooks.json"));
    const entry = h.hooks.PostToolUse[0];
    for (const tool of ["Edit", "Write", "MultiEdit"]) assert.ok(new RegExp(`^(?:${entry.matcher})$`).test(tool), tool);
    const cmd = entry.hooks[0].command;
    assert.equal(entry.hooks[0].type, "command");
    assert.ok(cmd.includes("${CLAUDE_PLUGIN_ROOT}"));
    const target = cmd.match(/\$\{CLAUDE_PLUGIN_ROOT\}\/([^"]+)/)[1];
    assert.ok(existsSync(join(pluginDir, target)), `${target} exists`);
  });
  test("plugin.json parses and is named elattar-uiux-design", () => {
    const m = readJson(join(pluginDir, ".claude-plugin", "plugin.json"));
    assert.equal(m.name, "elattar-uiux-design");
    assert.match(m.version, /^\d+\.\d+\.\d+$/);
    assert.ok(m.description);
  });

  test("marketplace.json lists the plugin with an existing source", () => {
    const mk = readJson(join(repoRoot, ".claude-plugin", "marketplace.json"));
    assert.ok(mk.name && mk.owner?.name);
    const entry = mk.plugins.find((p) => p.name === "elattar-uiux-design");
    assert.ok(entry, "plugin not listed");
    assert.ok(existsSync(resolve(repoRoot, entry.source, ".claude-plugin", "plugin.json")));
  });

  test("SKILL.md frontmatter name and description", () => {
    const text = readFileSync(join(skillDir, "SKILL.md"), "utf8");
    const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    assert.ok(fm, "no frontmatter");
    assert.match(fm[1], /^name:\s*elattar-uiux-design\s*$/m);
    assert.match(fm[1], /^description:\s*\S+/m);
  });

  test("SKILL.md has the nine steps and no TODO/TBD", () => {
    const text = readFileSync(join(skillDir, "SKILL.md"), "utf8");
    const heads = [...text.matchAll(/^## (?:\d+\.\s*)?(.+)$/gm)].map((m) => m[1].trim());
    assert.equal(heads.length, 9, heads.join(" | "));
    assert.ok(text.split(/\r?\n/).length <= 150);
    assert.doesNotMatch(text, /\b(TODO|TBD)\b/);
  });

  test("nothing in the plugin references paths outside it", () => {
    const banned = ["../../..", "RULES.md", "scripts/check-", ".claude/skills/"];
    const self = join(here, "plugin-shape.test.mjs");
    for (const f of walk(pluginDir)) {
      if (f === self || !/\.(md|mjs)$/.test(f)) continue;
      const text = readFileSync(f, "utf8");
      for (const b of banned) assert.ok(!text.includes(b), `${f} references ${b}`);
    }
  });

  test("exactly four commands, each with a description that runs checks/run.mjs", () => {
    const dir = join(pluginDir, "commands");
    const files = readdirSync(dir).sort();
    assert.deepEqual(files, ["check-full.md", "check.md", "review.md", "setup.md"]);
    for (const f of files) {
      const text = readFileSync(join(dir, f), "utf8");
      const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      assert.ok(fm, `${f}: no frontmatter`);
      assert.match(fm[1], /^description:\s*\S+/m, `${f}: no description`);
      assert.ok(text.includes("${CLAUDE_PLUGIN_ROOT}/skills/elattar-uiux-design/checks/run.mjs"), `${f}: does not run run.mjs via CLAUDE_PLUGIN_ROOT`);
      if (f !== "setup.md") assert.match(text, /Do not change any file/, `${f}: must say it changes no file`);
    }
  });
});
