/**
 * The AI skill (`.claude/skills/elattar-building-ui/**`) is documentation an
 * agent reads and acts on. Stale facts in it do not fail a build — nothing
 * imports it — so this is the only gate that catches drift between the skill
 * text and the system it describes: current type roles, real registry
 * install commands (never typed from memory), the actual source
 * directories, the real verification scripts, and the public component
 * vocabulary.
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const SKILL_DIR = path.join(ROOT, ".claude", "skills", "elattar-building-ui");

const SKILL_MD = path.join(SKILL_DIR, "SKILL.md");
const REFERENCES = {
  componentContracts: path.join(SKILL_DIR, "references", "component-contracts.md"),
  stateInventory: path.join(SKILL_DIR, "references", "state-inventory.md"),
  traps: path.join(SKILL_DIR, "references", "traps.md"),
  verify: path.join(SKILL_DIR, "references", "verify.md"),
};

function read(file: string): string {
  return fs.readFileSync(file, "utf8");
}

const skillText = read(SKILL_MD);
const allSkillFiles: Record<string, string> = {
  "SKILL.md": skillText,
  ...Object.fromEntries(
    Object.entries(REFERENCES).map(([key, file]): [string, string] => [key, read(file)]),
  ),
};
const allText = Object.values(allSkillFiles).join("\n");

describe("skill files exist", () => {
  it("SKILL.md and all four references exist", () => {
    expect(fs.existsSync(SKILL_MD)).toBe(true);
    for (const file of Object.values(REFERENCES)) {
      expect(fs.existsSync(file)).toBe(true);
    }
  });
});

describe("the 17 current typography roles are named, no retired role remains", () => {
  const CURRENT_ROLES = [
    "display",
    "h1",
    "h2",
    "h3",
    "h4",
    "lead",
    "body",
    "small",
    "nav",
    "badge",
    "code",
    "identifier",
    "number-sm",
    "number-base",
    "number-md",
    "number-lg",
    "number-xl",
  ];

  it.each(CURRENT_ROLES)("names the %s role somewhere in the skill", (role) => {
    const needle = `type-${role}`;
    expect(allText.includes(needle) || allText.includes(`\`${role}\``)).toBe(true);
  });

  // Retired roles from global-constraints.md's "Retired typography migration"
  // table, plus the removed accent/font. Any of these appearing (outside of a
  // sentence explicitly retiring it) means the skill still teaches a role
  // that no longer exists.
  const RETIRED_ROLES = [
    "type-num-xs",
    "type-num-sm",
    "type-num-md",
    "type-num-lg",
    "type-num-xl",
    "type-num ",
    "type-label",
    "type-caption",
    "type-section",
    "type-micro",
    "type-tag",
    "type-chip",
    "type-serial",
    "type-wordmark",
    "type-nav-sm",
    "type-accent",
  ];

  it.each(RETIRED_ROLES)("never references retired role %s", (retired) => {
    expect(allText).not.toContain(retired);
  });

  it("never mentions Space Grotesk, Redaction, or --font-accent", () => {
    expect(allText).not.toMatch(/space grotesk/i);
    expect(allText).not.toMatch(/redaction/i);
    expect(allText).not.toContain("--font-accent");
  });
});

describe("styles ownership is described correctly", () => {
  it("does not claim app/globals.css is the sole owner of tokens/type/motion/utilities", () => {
    // app/globals.css is the entry point that imports the four styles/*.css
    // files; it must never be described as itself the source of truth.
    expect(allText).not.toMatch(
      /app\/globals\.css[^.\n]{0,80}(only|sole|single)[^.\n]{0,40}(owner|source of truth|definition)/i,
    );
  });

  it("names all four styles/*.css owner files", () => {
    for (const file of ["tokens.css", "typeset.css", "motion.css", "utilities.css"]) {
      expect(allText).toContain(file);
    }
  });
});

describe("registry install commands match the real command source byte-for-byte", () => {
  const commandsPath = path.join(ROOT, "public", "r", "commands.json");
  const built = fs.existsSync(commandsPath);

  it.runIf(built)("every `npx shadcn ... add ...` string in the skill exists in public/r/commands.json", () => {
    const commands: Record<string, string> = JSON.parse(fs.readFileSync(commandsPath, "utf8"));
    const validCommands = new Set(Object.values(commands));

    // Only URL-form `add` commands are checked against commands.json — that
    // file only ever stores the URL form. The `@elattar/<item>` namespaced
    // form is a separate CLI capability (defined by components.json's
    // `registries` map) and is not itself a command.json entry.
    const commandPattern = /npx shadcn(?:@\S+)? add https?:\/\/\S+/g;
    const found = [...allText.matchAll(commandPattern)].map((m) => m[0]);

    expect(found.length).toBeGreaterThan(0);
    for (const command of found) {
      expect(validCommands.has(command)).toBe(true);
    }
  });

  it.runIf(!built)("skips (registry not built) — run npm run registry:build first", () => {
    expect(built).toBe(false);
  });
});

describe("source directories are named", () => {
  const DIRECTORIES = [
    "components/ui",
    "components/agent",
    "components/docs",
    "styles/",
    "lib/ds/nav.ts",
    "docs/audits/web-component-audit.md",
  ];

  it.each(DIRECTORIES)("names %s", (dir) => {
    expect(allText).toContain(dir);
  });
});

describe("verification scripts are named", () => {
  const SCRIPTS = ["verify:fast", "verify:full", "check:tokens", "check:refs", "typecheck"];

  it.each(SCRIPTS)("names the %s script", (script) => {
    expect(allText).toContain(script);
  });
});

describe("public component vocabulary is complete", () => {
  const registryPath = path.join(ROOT, "registry.json");
  const registryExists = fs.existsSync(registryPath);

  it.runIf(registryExists)("every registry:ui item name appears in the skill's inventory/discovery section or a reference", () => {
    const registry = JSON.parse(fs.readFileSync(registryPath, "utf8")) as {
      items: { name: string; type: string }[];
    };
    const uiNames = registry.items.filter((i) => i.type === "registry:ui").map((i) => i.name);
    expect(uiNames.length).toBeGreaterThan(0);

    const missing = uiNames.filter((name) => !allText.includes(name));
    expect(missing, `missing from the skill: ${missing.join(", ")}`).toEqual([]);
  });
});

describe("docs routes are referenced", () => {
  const ROUTES = [
    "/design-system/docs/introduction",
    "/design-system/docs/installation",
    "/design-system/docs/theming",
    "/design-system/docs/typeset",
    "/design-system/docs/cli",
    "/design-system/docs/registry",
    "/design-system/docs/skills",
    "/design-system/docs/changelog",
  ];

  it.each(ROUTES)("references %s", (route) => {
    expect(allText).toContain(route);
  });
});

describe("parked owner decisions are named", () => {
  // These are the `blocked(...)` owner decisions recorded in
  // docs/audits/web-component-audit.md across batches 1-4: the 44px hit-target
  // row pitch and the roving-focus race. The skill must not claim these are
  // settled.
  it("mentions the hit-target / row-pitch owner decision", () => {
    expect(allText).toMatch(/row pitch|hit.?target/i);
  });
});

describe("no untested install claims", () => {
  it("does not use the deprecated `shadcn diff` command as the documented way to check drift", () => {
    // `diff` is deprecated in favor of `add --diff`; the skill's own text
    // (Step 3 / registry discovery) should not present bare `diff` as current.
    const bareDiff = /npx shadcn diff\b(?!\s*(--|\[)?\s*\()/;
    if (bareDiff.test(allText)) {
      expect(allText).toMatch(/deprecated/i);
    }
  });
});

describe("known traps from this migration are documented", () => {
  const trapsText = allSkillFiles.traps;
  const TRAP_MARKERS = [
    /icon.{0,20}swallow/i,
    /role="status"[^]{0,200}(nothing|empty|announce)/i,
    /animation:\s*none[^]{0,80}fill-mode/i,
    /clientWidth/,
    /portall/i,
    /colorScheme[^]{0,120}next-themes/i,
    /-ink/,
    /tailwind content source/i,
    /comment prose/i,
    /ledger[^]{0,80}(evidence|artefact)/i,
  ];

  it.each(TRAP_MARKERS.map((re, i) => [i, re] as const))("traps.md documents trap #%i (%s)", (_i, re) => {
    expect(trapsText).toMatch(re);
  });
});

describe("built-stylesheet authority rule is present", () => {
  it("verify.md or traps.md tells the reader the built CSS, not a grep, is authoritative", () => {
    const combined = allSkillFiles.verify + allSkillFiles.traps;
    expect(combined).toMatch(/built (stylesheet|css)/i);
  });
});
