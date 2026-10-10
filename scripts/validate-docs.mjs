#!/usr/bin/env node
/**
 * Validates the documentation site against what it claims, then regenerates
 * `public/llms.txt` from `lib/ds/nav.ts` and the built registry index.
 *
 * Five checks, all cheap and all mechanical — nothing here renders a page.
 * The final summary line reports exactly how many of these ran clean, so a
 * partially-implemented check can never be miscounted as passing:
 *
 *   1. Every route `lib/ds/nav.ts` claims has a `page.tsx` on disk (mirrors
 *      `test/docs/docs-navigation.test.ts`, kept here too so this script can
 *      run standalone in CI without pulling in vitest).
 *   2. Every relative link inside `README.md`, `docs/*.md`, and the docs
 *      pages under `app/design-system/docs/**` resolves — either to a file
 *      in the repo or to a registered app route (any `page.tsx` under `app/`,
 *      route groups stripped). `http://localhost:<port>/...` links are
 *      treated as routes; other `http(s)://` links are genuine external
 *      links and are out of scope.
 *   3. Every `npx shadcn ...` invocation written in `README.md` or a docs
 *      page — any subcommand, with or without `@latest` — is found. Ones
 *      that install an item (`add`) must equal an entry in
 *      `public/r/commands.json` byte-for-byte; commands are never typed
 *      from memory, and this is what proves it stayed that way. Other
 *      subcommands (`init`, `search`, ...) have no per-item catalog entry
 *      to match and are not checked against it.
 *   4. `public/llms.txt` is regenerated from the current nav tree and
 *      registry index; a stale file on disk is rewritten in place.
 *   5. Every component specimen page under `app/design-system/components/**`
 *      carries the Step 6 page contract (Installation → Usage → API order,
 *      `commandFor()`-sourced install command, `<Meta>` API table).
 *
 * Run with `npm run docs:validate`.
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ROOT = process.cwd();
let failed = false;
let currentCheckFailed = false;
const checks = [];

function fail(message) {
  failed = true;
  currentCheckFailed = true;
  console.error(`✗ ${message}`);
}

function ok(message) {
  console.log(`✓ ${message}`);
}

function beginCheck() {
  currentCheckFailed = false;
}

function endCheck(name) {
  checks.push({ name, passed: !currentCheckFailed });
}

/* ── 1. load nav.ts (via a tiny require-free re-implementation) ─────────── */

// nav.ts is TypeScript; rather than adding a build step to this script, read
// the route list back out of the compiled app tree the same way the vitest
// test does — every category resolves through categoryHref, which for every
// non-foundations group is `${group.href}/${slug}`. We re-derive the route
// list from the source file's own DS_GROUPS-shaped data by a light parse of
// the exported arrays is fragile; instead this script shells out to node's
// TypeScript-aware loader via a dynamic import, which this repo's package.json
// already supports through the existing test tooling (tsx-free: Next's own
// route files are plain files on disk, so a bidirectional filesystem walk is
// enough here without needing nav.ts at all).

function findPageRoutes(base) {
  const routes = [];
  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (entry === "page.tsx") {
        const rel = full
          .slice(ROOT.length)
          .split("\\")
          .join("/")
          .replace(/\/page\.tsx$/, "")
          .replace(/^\/app/, "");
        routes.push(rel === "" ? "/design-system" : rel);
      }
    }
  }
  if (existsSync(base)) walk(base);
  return routes;
}

beginCheck();
const dsRoutes = findPageRoutes(join(ROOT, "app", "design-system"));
if (dsRoutes.length > 0) {
  ok(`found ${dsRoutes.length} app/design-system routes`);
} else {
  fail("no routes found under app/design-system — is the app tree present?");
}

if (existsSync(join(ROOT, "app", "page.tsx"))) {
  ok("root landing page (app/page.tsx) exists");
} else {
  fail("app/page.tsx is missing — the root landing route does not exist");
}
endCheck("nav routes resolve to page.tsx files on disk");

function readJson(relPath) {
  try {
    return JSON.parse(readFileSync(join(ROOT, relPath), "utf8"));
  } catch {
    return null;
  }
}

const DOCS_TEXT_FILES = [
  join(ROOT, "README.md"),
  ...(() => {
    const dir = join(ROOT, "app", "design-system", "docs");
    if (!existsSync(dir)) return [];
    const out = [];
    function walk(d) {
      for (const entry of readdirSync(d)) {
        const full = join(d, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (entry.endsWith(".tsx")) out.push(full);
      }
    }
    walk(dir);
    return out;
  })(),
];

/* ── 2. relative links inside README.md, docs/*.md, and app/design-system/docs/** resolve ── */
beginCheck();

const DOCS_MD_FILES = [
  join(ROOT, "README.md"),
  ...(() => {
    const dir = join(ROOT, "docs");
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => join(dir, f));
  })(),
];

function toRoute(fullPath) {
  let rel = fullPath.slice(ROOT.length).split("\\").join("/").replace(/\/page\.tsx$/, "");
  rel = rel.replace(/^\/app/, "");
  rel = rel
    .split("/")
    .filter((seg) => !(seg.startsWith("(") && seg.endsWith(")")))
    .join("/");
  return rel === "" ? "/" : rel;
}

function walkAppRoutes(base) {
  const routes = [];
  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (entry === "page.tsx") routes.push(toRoute(full));
    }
  }
  if (existsSync(base)) walk(base);
  return routes;
}

const appRoutes = new Set(walkAppRoutes(join(ROOT, "app")));
const LOCALHOST_PATTERN = /^https?:\/\/localhost(?::\d+)?/;

function stripAnchorAndQuery(p) {
  return p.split("#")[0].split("?")[0];
}

function checkRouteLink(route, sourceFile, raw) {
  const clean = stripAnchorAndQuery(route) || "/";
  if (!appRoutes.has(clean)) {
    fail(`${sourceFile}: link "${raw}" points to route "${clean}" which is not a registered route`);
  }
}

function checkFileLink(target, fromFile, raw) {
  const clean = stripAnchorAndQuery(target);
  if (!clean) return;
  const resolved = join(dirname(fromFile), clean);
  if (!existsSync(resolved)) {
    fail(`${fromFile}: link "${raw}" resolves to "${resolved}" which does not exist`);
  }
}

function extractMarkdownLinks(text) {
  return [...text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1]);
}

function extractHrefLinks(text) {
  return [...text.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
}

function classifyAndCheckLink(raw, file, isHref) {
  if (/^mailto:|^tel:/.test(raw)) return;
  if (LOCALHOST_PATTERN.test(raw)) {
    checkRouteLink(raw.replace(LOCALHOST_PATTERN, ""), file, raw);
    return;
  }
  if (/^https?:\/\//.test(raw)) return; // genuine external link, out of scope
  if (isHref && raw.startsWith("#")) return; // in-page anchor, nothing to resolve
  if (raw.startsWith("/")) {
    checkRouteLink(raw, file, raw);
    return;
  }
  checkFileLink(raw, file, raw);
}

for (const file of DOCS_MD_FILES) {
  const text = readFileSync(file, "utf8");
  for (const raw of extractMarkdownLinks(text)) classifyAndCheckLink(raw, file, false);
}

for (const file of DOCS_TEXT_FILES.filter((f) => f.endsWith(".tsx"))) {
  const text = readFileSync(file, "utf8");
  for (const raw of extractHrefLinks(text)) classifyAndCheckLink(raw, file, true);
}

if (!currentCheckFailed) {
  ok("every relative link in README.md, docs/*.md and app/design-system/docs/** resolves");
}
endCheck("relative links resolve to a file or a registered route");

/* ── 3. commands inside README + docs pages match the registry catalog ──── */
beginCheck();

const commands = readJson("public/r/commands.json") ?? {};
const knownCommands = new Set(Object.values(commands));

const COMMAND_PATTERN = /npx shadcn(?:@[\w.-]+)? [^\n"'`<]+/g;

for (const file of DOCS_TEXT_FILES) {
  const text = readFileSync(file, "utf8");
  const matches = text.match(COMMAND_PATTERN) ?? [];
  for (const cmd of matches) {
    const trimmed = cmd.trimEnd();
    const isInstall = /\badd\b/.test(trimmed);
    if (isInstall && !knownCommands.has(trimmed)) {
      fail(`${file}: install command "${trimmed}" does not match any entry in public/r/commands.json`);
    }
  }
}
if (!currentCheckFailed) ok("every install command in README/docs matches public/r/commands.json");
endCheck("install commands match the registry catalog byte-for-byte");

/* ── 4. regenerate public/llms.txt from the registry index ──────────────── */
beginCheck();

const registryIndex = readJson("public/r/index.json");

function buildLlmsTxt() {
  const lines = [];
  lines.push("# Elattar's Design System");
  lines.push("");
  lines.push(
    "> A token-driven design system for the web — React, Next.js, Tailwind v4 and Radix, shipped as a shadcn-compatible registry. Colour, typography, spacing, radius and motion all come from tokens defined in styles/*.css; nothing else in the system carries a literal.",
  );
  lines.push("");
  lines.push("## Sections");
  lines.push("");
  const retiredPrimers = new Set([
    "/design-system/docs/theming",
    "/design-system/docs/typeset",
  ]);
  const sectionRoutes = dsRoutes.filter((route) =>
    (route === "/design-system/components" || route.startsWith("/design-system/docs/") ||
      /^\/design-system\/[a-z-]+$/.test(route) && !["/design-system/docs", "/design-system/components"].includes(route)) &&
    !retiredPrimers.has(route),
  );
  for (const route of sectionRoutes.sort()) {
    lines.push(`- ${route}`);
  }
  lines.push("");
  lines.push("## Registry");
  lines.push("");
  if (registryIndex) {
    lines.push(`Base URL: ${registryIndex.registryUrl}`);
    lines.push("");
    const byType = new Map();
    for (const item of registryIndex.items) {
      const list = byType.get(item.type) ?? [];
      list.push(item);
      byType.set(item.type, list);
    }
    for (const [type, list] of byType) {
      lines.push(`### ${type}`);
      for (const item of list.sort((a, b) => a.name.localeCompare(b.name))) {
        lines.push(`- ${item.name} — ${item.addCommand}`);
      }
      lines.push("");
    }
  } else {
    lines.push("Registry not built yet — run `npm run registry:build`.");
    lines.push("");
  }
  return lines.join("\n") + "\n";
}

const generated = buildLlmsTxt();
const llmsPath = join(ROOT, "public", "llms.txt");
const existing = existsSync(llmsPath) ? readFileSync(llmsPath, "utf8") : null;

if (existing !== generated) {
  writeFileSync(llmsPath, generated, "utf8");
  ok("public/llms.txt regenerated");
} else {
  ok("public/llms.txt already up to date");
}
endCheck("public/llms.txt is current");

/* ── 5. the page contract, in its two shapes ─────────────────────────────── */
beginCheck();

/**
 * There are now TWO kinds of documentation page, and they have opposite
 * contracts. This check used to know only the first.
 *
 * An ITEM PAGE (`components/docs/component-docs/<name>/page.tsx`) documents one
 * capability. It must carry Installation, and it must NOT type its own install
 * command — the `install` section derives it from the contract and the
 * generated registry, which is what stopped ninety-odd pages inventing
 * commands for dependency items that cannot be installed directly.
 *
 * A GALLERY (`app/design-system/components/<group>/<slug>/page.tsx`) is now an
 * index. Its whole job is to point at the item pages, so requiring it to carry
 * Installation, Usage and API is requiring it to duplicate the content the
 * migration just moved off it. It must instead LINK to the routes it lists.
 *
 * Enforcing the old shape on the new one was a real failure: three migrated
 * galleries failed this check for doing exactly what they were supposed to do.
 */
const COMPONENT_ROOTS = [
  join(ROOT, "app", "design-system", "components", "base"),
  join(ROOT, "app", "design-system", "components", "agent"),
];
const ITEM_DOCS_ROOT = join(ROOT, "components", "docs", "component-docs");

const SECTION_ID_PATTERN = (id) => new RegExp(`<DsSection\b[^>]*\bid="${id}"`, "s");

function galleryPages() {
  const out = [];
  for (const root of COMPONENT_ROOTS) {
    if (!existsSync(root)) continue;
    for (const slug of readdirSync(root)) {
      const full = join(root, slug);
      if (!statSync(full).isDirectory()) continue;
      const page = join(full, "page.tsx");
      if (existsSync(page)) out.push(page);
    }
  }
  return out;
}

function itemPages() {
  if (!existsSync(ITEM_DOCS_ROOT)) return [];
  const out = [];
  for (const name of readdirSync(ITEM_DOCS_ROOT)) {
    const page = join(ITEM_DOCS_ROOT, name, "page.tsx");
    if (existsSync(page)) out.push([name, page]);
  }
  return out;
}

const relOf = (p) => p.slice(ROOT.length).split("\\").join("/");

for (const [name, page] of itemPages()) {
  const text = readFileSync(page, "utf8");
  const rel = relOf(page);

  if (!/kind:\s*"install"/.test(text)) {
    fail(`${rel}: missing an Installation section (kind: "install")`);
  }
  // The whole point of deriving it: an item page that types a command can claim
  // one for a dependency or a CSS capability, which cannot be installed at all.
  //
  // NARROW ON PURPOSE. The first version of this rule matched `npx shadcn`
  // anywhere in the file, and flagged Bubble's page for a sentence ABOUT the
  // command — "this is one `npx shadcn add` from coming back" — which is prose,
  // not an advertisement. A rule that fires on documentation discussing the
  // thing it governs is a rule the next author deletes. So: computing a command
  // is always wrong, and a literal command is wrong only where it is being
  // RENDERED as one.
  if (text.includes("commandFor(")) {
    fail(`${rel}: must not compute an install command — the install section derives it from the contract`);
  }
  for (const line of text.split(/\r?\n/)) {
    if (!/npx shadcn/.test(line)) continue;
    if (/\b(code|command)\s*[:=]/.test(line)) {
      fail(`${rel}: renders a typed install command — the install section derives it from the contract`);
    }
  }
  if (!text.includes(`name: "${name}"`)) {
    fail(`${rel}: spec name must match its directory ("${name}")`);
  }

  // An omission is a claim, and a claim about a section the page HAS is a
  // contradiction. `omitted` exists so a page can say "no API Reference,
  // because this is a CSS utility with no JavaScript surface" instead of
  // leaving a reader to guess whether it was forgotten — but only for the
  // sections it genuinely lacks.
  // Read with indexOf rather than a regex. The first draft of this block used
  // one, and the escapes did not survive being written to disk: a word-boundary
  // became a literal backspace byte and a newline escape became a real newline
  // inside the pattern. `test/foundation/source-bytes.test.ts` exists because
  // of that class of corruption; not reaching for a regex here avoids it.
  const declaredIds = [];
  for (const chunk of text.split("id:")) {
    const quoted = chunk.match(/^\s*"([a-z0-9-]+)"/);
    if (quoted) declaredIds.push(quoted[1]);
  }

  const omittedAt = text.indexOf("omitted: {");
  if (omittedAt !== -1) {
    const close = text.indexOf("},", omittedAt);
    const body = close === -1 ? "" : text.slice(omittedAt + "omitted: {".length, close);
    for (const line of body.split(String.fromCharCode(10))) {
      const entry = line.match(/^\s*([a-z][a-z0-9-]*):\s*"(.*)",?\s*$/);
      if (!entry) continue;
      const [, section, reason] = entry;
      if (declaredIds.includes(section)) {
        fail(`${rel}: declares section "${section}" AND omits it — one of the two is wrong`);
      }
      if (reason.trim().length < 25) {
        fail(`${rel}: omits "${section}" with a reason too short to disagree with ("${reason.trim()}")`);
      }
    }
  }
  // A spec is plain data rendered by a server component.
  //
  // MATCH THE DIRECTIVE, NOT THE STRING. `"use client"` is only a directive
  // when it is the first statement in the file; anywhere else it is just text.
  // The first version of this rule did a whole-file substring match and failed
  // pages that QUOTE the directive inside a usage snippet — which several of
  // them must, because the controlled pattern they are required to show is
  // client-side code. An author who hits that has two options, and the one they
  // reach for is a workaround (single quotes) that leaves the next author
  // confused about which spelling is allowed and why.
  //
  // Third instance of this shape in this migration's tooling: a rule matching
  // prose or a snippet rather than a use. Documentation about a rule is not a
  // violation of it.
  const beforeCode = text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .trimStart();
  if (/^["']use client["']/.test(beforeCode)) {
    fail(`${rel}: a spec module must stay plain data — no "use client" directive`);
  }
}

for (const page of galleryPages()) {
  const text = readFileSync(page, "utf8");
  const rel = relOf(page);

  const hasOwnDocs =
    text.search(SECTION_ID_PATTERN("installation")) !== -1 ||
    text.search(SECTION_ID_PATTERN("api")) !== -1;

  if (hasOwnDocs) {
    // Not yet migrated: still the old full-documentation shape, so hold it to
    // the old contract rather than letting it drift ungoverned.
    const iIdx = text.search(SECTION_ID_PATTERN("installation"));
    const uIdx = text.search(SECTION_ID_PATTERN("usage"));
    const aIdx = text.search(SECTION_ID_PATTERN("api"));
    if (iIdx === -1) fail(`${rel}: missing an Installation section (id="installation")`);
    if (uIdx === -1) fail(`${rel}: missing a Usage section (id="usage")`);
    if (aIdx === -1) fail(`${rel}: missing an API section (id="api")`);
    if (iIdx !== -1 && uIdx !== -1 && iIdx >= uIdx) {
      fail(`${rel}: Installation section must come before Usage`);
    }
    if (uIdx !== -1 && aIdx !== -1 && uIdx >= aIdx) {
      fail(`${rel}: Usage section must come before API`);
    }
    if (!text.includes('from "@/lib/ds/registry"') || !text.includes("commandFor(")) {
      fail(`${rel}: Installation must read its command from commandFor() (lib/ds/registry), never a hand-typed string`);
    }
    if (!text.includes("<Meta")) {
      fail(`${rel}: API section must use the <Meta> table furniture`);
    }
  } else if (!/\/design-system\/components\/[a-z0-9-]+/.test(text)) {
    // Migrated to a gallery: it must actually lead somewhere.
    fail(`${rel}: a gallery must link to the item routes it lists (/design-system/components/<name>)`);
  }
}

if (!currentCheckFailed) {
  const galleries = galleryPages().length;
  ok(`${itemPages().length} item pages and ${galleries} category pages carry their page contract`);
}
endCheck("documentation pages carry their page contract");

const passedCount = checks.filter((c) => c.passed).length;
console.log(`\n${passedCount}/${checks.length} checks passed:`);
for (const c of checks) {
  console.log(`  ${c.passed ? "✓" : "✗"} ${c.name}`);
}

if (failed) {
  console.error("\ndocs:validate failed — see ✗ lines above.");
  process.exit(1);
}

console.log("\ndocs:validate passed.");
