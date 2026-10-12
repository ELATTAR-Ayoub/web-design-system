# Corporate-Clean Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development for Phase B (parallel lanes) and superpowers:executing-plans for Phases A, C, D, E, F (sequential — the owner's rule: a lone task runs in the main session, sub-agents only for genuinely parallel work). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Elattar's Design System safe to hand to corporate customers that forbid third-party code: every component is our own code, under one MIT licence held by Ayoub Elattar, with no scraped material, no upstream or old-project names, no outbound network calls and no telemetry — and build guards that keep it that way.

**Architecture:** Work happens on `main` (owner's instruction). Phase A cleans and prepares on `main` directly. Phase B runs five clean-room rewrite lanes plus one name-scrub lane in parallel worktrees branched from `main`; each rewrite is spec-first: one agent writes a behaviour spec and pins behaviour in tests against the current code, the old file is deleted, and a *different* agent implements from the spec and tests without ever seeing the old source. Phase C cherry-picks the lanes back onto `main`, Phase D adds the licence headers and the guards, Phase E swaps in the owner's images, Phase F produces a history-free export branch.

**Tech Stack:** Next 16.2.12, React 19.2.4, Tailwind v4 CSS-first tokens (`styles/*.css`), Radix, shadcn CLI 4.x registry, Vitest + Testing Library (jsdom), Playwright, npm 11.

## Global Constraints

- Branch: `main`. Baseline commit: `87bc16a` (PR #2 merge, the latest on GitHub). Never base work on `feat/agent-workspace` or any `wt/*` branch.
- Licence: **MIT**, `Copyright (c) 2026 Ayoub Elattar`. SPDX header on every source file:
  - JS/TS: `// SPDX-License-Identifier: MIT` + `// Copyright (c) 2026 Ayoub Elattar`
  - CSS: `/* SPDX-License-Identifier: MIT` + `   Copyright (c) 2026 Ayoub Elattar */`
- The one place upstream names may appear: `THIRD_PARTY_NOTICES.md` (shadcn/ui MIT notice, Inter and Geist OFL, the generated dependency table). Plus `package.json` / `package-lock.json` package names.
- Banned everywhere else (enforced by `scripts/check-provenance.mjs`, Task D2): React Bits, ElevenLabs, AI Elements / `ai-elements` / ai-sdk, `Vercel` in prose, Interfere (brand), Yuki / Yukirhythm, Commons Clause, Rive / `.riv`, models.dev, and — inside `components/ app/ lib/ hooks/ styles/ public/ docs/` — ChatGPT, Claude Code, claude.ai, cursor.com, v0.app, t3.chat, scira.
- Kept as ordinary dependencies (owner decision): `shiki`, `@xyflow/react`, `streamdown` (+ `@streamdown/*`), and the existing base stack (React, Next, Radix, Lucide, Recharts, etc.). `shadcn` stays the system's vocabulary and registry tooling; the word is not banned.
- Replaced by our own code (owner decision): `ai` (types only), `tokenlens`, `nanoid`, `use-stick-to-bottom`, `ansi-to-react`, `react-jsx-parser`, `media-chrome`, `@rive-app/react-webgl2`.
- Not rebuilt (owner decision): the old Orb and Matrix — they are already gone from `main` and stay gone.
- Deleted (owner decision): the RPG / "Moon Court" skin. The owner's uncommitted RPG work is already preserved in `git stash` entry `pre-main-switch-2026-10-10`.
- "Same behaviour, same UI": a rewritten component keeps its exported names, props and DOM contract, and its docs preview matches the pre-rewrite screenshot (Task A2). Approved exceptions, and only these: `Persona` (Rive → our `CubeAvatar`), `ModelSelectorLogo` (no remote logo; the consumer supplies the mark), `OpenInChat` (no built-in third-party providers; the consumer supplies them), `Context` (no built-in price catalogue; optional `pricing` prop).
- Repo rules still apply to every line written: `RULES.md`, nothing hardcoded (`npm run check:tokens`), both themes complete, only `-ink` carries text. Any UI work starts by invoking the `elattar-building-ui` skill.
- Sub-agents: `model: "sonnet"` (owner cap: Opus 4.8 or lower). Worktrees are made by hand (never `isolation: "worktree"` — it branches from a stale base). Lane worktrees junction `node_modules` to the main checkout's; **no sub-agent ever runs npm or writes into `node_modules`.**
- Paths below: `REPO=/d/DESIGN/Design-System-2026-8/design-system` (Git Bash), Windows form `D:\DESIGN\Design-System-2026-8\design-system`.

## File map

| Area | Files | Change |
|---|---|---|
| Telemetry | `scripts/next.mjs` (new), `package.json` scripts, `playwright.config.ts`, `playwright.registry.config.ts`, `test/foundation/telemetry.test.ts` (new) | All Next runs go through a wrapper that sets `NEXT_TELEMETRY_DISABLED=1` |
| Deps hygiene | `package.json`, `next.config.ts`, `scripts/stubs/sharp/` (new) | `shadcn` → devDependencies; sharp (LGPL) replaced by an inert local stub; images served unoptimized |
| Scrape / dead weight | `app/showcase/`, `components/interfere/`, `public/interfere*`, `.theme-reference` CSS, `test/docs/theme-reference-scope.test.ts`, `app/rpg-*`, `public/imgs/rpg/`, `docs/rpg-ui-asset-report.md`, `public/specimens/`, `public/textures/`, `docs/superpowers/` (except this plan until D5), `docs/audits/`, `docs/references/motion-rename.md` | Deleted |
| Rename | `components/ai-elements/` → `components/ai/`, `docs/ai-elements/` → `docs/ai/`, `test/components/ai-elements/` → `test/components/ai/` | Folder names carry no upstream product name |
| Own types | `components/ai/types.ts` (new) | Replaces every `from "ai"` import |
| Rewrites | `components/ai/*.tsx` (49), `components/agent/parts/refine-frame.tsx` | Clean-room, Phase B |
| Licence | `LICENSE`, `THIRD_PARTY_NOTICES.md`, `public/fonts/OFL.txt`, `scripts/build-notices.mjs`, `scripts/add-spdx.mjs`, `README.md`, `package.json`, registry `meta`, docs footer + licence page, `public/llms.txt` | MIT everywhere |
| Guards | `scripts/check-provenance.mjs`, `test/foundation/provenance.test.ts`, `e2e/no-outbound.spec.ts` | Wired into `verify` / `verify:fast` |

---

## Phase A — Prepare `main` (main session, sequential)

### Task A1: Baseline and clean-room scaffolding

**Files:**
- Modify: `.gitignore`
- Create (untracked, ignored): `.tmp/baseline.txt`, `.tmp/clean-room/similarity.mjs`

- [ ] **Step 1: Confirm the base**

```bash
cd $REPO && git status --short && git log --oneline -1
```
Expected: clean except `?? .claude/worktrees/`; HEAD `87bc16a`.

- [ ] **Step 2: Ignore scratch output**

Append to `.gitignore`:
```
# scratch
/.tmp/
/test-results/
/debug.log
```

- [ ] **Step 3: Record the pre-existing state**

```bash
npm run verify:fast > .tmp/baseline.txt 2>&1; echo "exit $?" >> .tmp/baseline.txt; tail -20 .tmp/baseline.txt
```
Anything already failing here is not caused by this plan; note it, don't fix it under this plan without telling the owner.

- [ ] **Step 4: Write the similarity checker reviewers use (Phase B)**

`.tmp/clean-room/similarity.mjs`:
```js
// Usage: node .tmp/clean-room/similarity.mjs <old-file> <new-file>
// Prints how many substantive lines of the new file appear verbatim in the old
// one. Substantive = at least 30 characters after collapsing whitespace, and
// not an import, a bare type/interface member, or a comment.
import { readFileSync } from "node:fs";

const norm = (l) => l.replace(/\s+/g, " ").trim();
const substantive = (l) =>
  l.length >= 30 &&
  !/^(import|export \{|export type|\/\/|\/\*|\*)/.test(l) &&
  !/^[A-Za-z_]+\??: [^=]+;$/.test(l);

const [oldPath, newPath] = process.argv.slice(2);
const oldLines = new Set(readFileSync(oldPath, "utf8").split("\n").map(norm));
const newLines = readFileSync(newPath, "utf8").split("\n").map(norm).filter(substantive);
const shared = newLines.filter((l) => oldLines.has(l));
const pct = newLines.length ? (100 * shared.length) / newLines.length : 0;
console.log(`${newPath}: ${shared.length}/${newLines.length} substantive lines shared (${pct.toFixed(1)}%)`);
for (const l of shared) console.log(`  = ${l}`);
process.exit(pct > 10 ? 1 : 0);
```

- [ ] **Step 5: Commit**

```bash
git add .gitignore docs/superpowers/plans/2026-10-10-corporate-clean.md && git commit -m "chore: ignore scratch output; corporate-clean plan"
```

### Task A2: Capture the "same UI" baseline screenshots

**Files:**
- Create: `e2e/clean-room-parity.spec.ts`, `e2e/clean-room-parity.spec.ts-snapshots/*` (temporary, removed in D5)

- [ ] **Step 1: Write the parity spec**

```ts
// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ayoub Elattar
/**
 * Clean-room parity: every rewritten component's docs previews must look the
 * same after the rewrite as before it. Baselines are captured from `main`
 * before Phase B; the spec and its snapshots are removed once the rewrite is
 * merged (Task D5). Persona, the model-selector logo and Open in chat are
 * approved visual changes and are re-baselined deliberately in their lanes.
 */
import { expect, test } from "@playwright/test";

const SLUGS = [
  "ai-agent", "ai-artifact", "ai-attachments", "ai-audio-player", "ai-canvas",
  "ai-chain-of-thought", "ai-checkpoint", "ai-code-block", "ai-commit",
  "ai-confirmation", "ai-connection", "ai-context", "ai-controls",
  "ai-conversation", "ai-edge", "ai-environment-variables", "ai-file-tree",
  "ai-image", "ai-inline-citation", "ai-jsx-preview", "ai-message",
  "ai-mic-selector", "ai-model-selector", "ai-node", "ai-open-in-chat",
  "ai-package-info", "ai-panel", "ai-persona", "ai-plan", "ai-prompt-input",
  "ai-question", "ai-queue", "ai-reasoning", "ai-sandbox", "ai-schema-display",
  "ai-shimmer", "ai-snippet", "ai-sources", "ai-speech-input", "ai-stack-trace",
  "ai-suggestion", "ai-task", "ai-terminal", "ai-test-results", "ai-tool",
  "ai-toolbar", "ai-transcription", "ai-voice-selector", "ai-web-preview",
  "agent-refine-frame",
];

for (const slug of SLUGS) {
  test(`parity: ${slug}`, async ({ page }, testInfo) => {
    test.skip(!["desktop-dark", "desktop-light"].includes(testInfo.project.name));
    await page.goto(`/design-system/components/${slug}`);
    await page.waitForLoadState("networkidle");
    const stages = page.locator('[data-slot="preview-stage"]');
    const count = await stages.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(stages.nth(i)).toHaveScreenshot(`${slug}-${i}.png`, {
        animations: "disabled",
        caret: "hide",
        maxDiffPixelRatio: 0.02,
      });
    }
  });
}
```

- [ ] **Step 2: Build and capture baselines**

```bash
npm run build && PW_PORT=3100 npx playwright test e2e/clean-room-parity.spec.ts --project=desktop-dark --project=desktop-light --update-snapshots
```
Expected: snapshots written under `e2e/clean-room-parity.spec.ts-snapshots/`. If a page is unstable between two runs (live clocks, random IDs), add `mask: [page.locator("<the unstable element>")]` for that slug only and re-capture.

- [ ] **Step 3: Verify they're stable**

```bash
PW_PORT=3100 npx playwright test e2e/clean-room-parity.spec.ts --project=desktop-dark --project=desktop-light
```
Expected: all PASS against their own baseline.

- [ ] **Step 4: Commit**

```bash
git add e2e/clean-room-parity.spec.ts e2e/clean-room-parity.spec.ts-snapshots && git commit -m "test(e2e): parity baselines for the clean-room rewrite"
```

### Task A3: Telemetry off

**Files:**
- Create: `scripts/next.mjs`, `test/foundation/telemetry.test.ts`
- Modify: `package.json` (scripts `dev`, `build`, `start`), `playwright.config.ts`, `playwright.registry.config.ts`

- [ ] **Step 1: Write the failing test**

`test/foundation/telemetry.test.ts`:
```ts
// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ayoub Elattar
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

describe("Next.js telemetry is off", () => {
  it.each(["dev", "build", "start"])("npm run %s goes through scripts/next.mjs", (script) => {
    expect(pkg.scripts[script]).toMatch(/^node scripts\/next\.mjs /);
  });

  it("the wrapper forces NEXT_TELEMETRY_DISABLED", () => {
    expect(readFileSync("scripts/next.mjs", "utf8")).toContain('NEXT_TELEMETRY_DISABLED: "1"');
  });

  it.each(["playwright.config.ts", "playwright.registry.config.ts"])(
    "%s disables it for every server it starts",
    (file) => {
      expect(readFileSync(file, "utf8")).toContain('process.env.NEXT_TELEMETRY_DISABLED = "1"');
    },
  );
});
```

- [ ] **Step 2: Run it — expect FAIL**

```bash
npx vitest run test/foundation/telemetry.test.ts
```
Expected: FAIL (scripts are `next dev` etc.; wrapper missing).

- [ ] **Step 3: Write the wrapper**

`scripts/next.mjs`:
```js
#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ayoub Elattar
/**
 * Runs the Next.js CLI with its anonymous usage reporting switched off.
 *
 * Next reads NEXT_TELEMETRY_DISABLED once, when the CLI starts, before it
 * loads next.config — so the variable has to be in the environment of the
 * process itself. Setting it here, for every `npm run dev|build|start`, works
 * the same on Windows, macOS and Linux without a cross-env dependency.
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const bin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const child = spawn(process.execPath, [bin, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
});
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
```

- [ ] **Step 4: Route the scripts and the test servers through it**

In `package.json`:
```json
"dev": "node scripts/next.mjs dev",
"build": "node scripts/next.mjs build",
"start": "node scripts/next.mjs start",
```
At the top of `playwright.config.ts` and `playwright.registry.config.ts`, after the imports:
```ts
// Every server this config starts inherits this — no usage data leaves the machine.
process.env.NEXT_TELEMETRY_DISABLED = "1";
```

- [ ] **Step 5: Turn it off machine-wide too (covers anyone running `npx next` directly)**

```bash
node node_modules/next/dist/bin/next telemetry disable && node node_modules/next/dist/bin/next telemetry status
```
Expected: `Status: Disabled`.

- [ ] **Step 6: Run the test — expect PASS; smoke the scripts**

```bash
npx vitest run test/foundation/telemetry.test.ts && npm run build
```

- [ ] **Step 7: Commit**

```bash
git add scripts/next.mjs test/foundation/telemetry.test.ts package.json playwright.config.ts playwright.registry.config.ts
git commit -m "chore: Next.js telemetry off for every script and test server"
```

### Task A4: Dependency hygiene — shadcn CLI to dev, sharp out

**Files:**
- Modify: `package.json`, `package-lock.json`, `next.config.ts`
- Create: `scripts/stubs/sharp/package.json`, `scripts/stubs/sharp/index.js`

- [ ] **Step 1: Move the shadcn CLI to devDependencies**

```bash
npm uninstall shadcn && npm install -D shadcn@4.16.0
```
(`@shadcn/react` stays in dependencies — `components/ui/message-scroller.tsx` and `questionnaire.tsx` import it.)

- [ ] **Step 2: Serve images unoptimized**

`next.config.ts`:
```ts
// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ayoub Elattar
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every image in this system is a static asset served as-is, so the image
  // optimiser — and the native image library it would load — never runs.
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 3: Replace sharp (LGPL-3.0 libvips binaries) with an inert local stub**

`scripts/stubs/sharp/package.json`:
```json
{
  "name": "sharp",
  "version": "0.0.0-stub",
  "private": true,
  "license": "MIT",
  "description": "Inert stand-in: images are served unoptimized (next.config.ts), so no image library is installed.",
  "main": "index.js"
}
```
`scripts/stubs/sharp/index.js`:
```js
// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ayoub Elattar
throw new Error("sharp is intentionally not installed: images are served unoptimized (see next.config.ts).");
```
In `package.json` add:
```json
"overrides": { "sharp": "file:./scripts/stubs/sharp" }
```
```bash
npm install && npm ls sharp && node -e "require.resolve('@img/sharp-win32-x64')" ; echo "resolve exit: $?"
```
Expected: `sharp@0.0.0-stub -> .\scripts\stubs\sharp`; the `@img/...` resolve fails (exit 1). **If npm rejects the override**, stop and tell the owner (fallback: keep sharp, document it in THIRD_PARTY_NOTICES as server-side LGPL used unmodified) — do not silently skip.

- [ ] **Step 4: Verify**

```bash
npm run build && PW_PORT=3100 npx playwright test e2e/design-system.spec.ts --project=desktop-dark
```
Expected: build passes; pages with images (aspect-ratio, media-scrim, attachment) render.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json next.config.ts scripts/stubs
git commit -m "chore(deps): shadcn CLI is a dev tool; no LGPL image library — images ship unoptimized"
```

### Task A5: Delete the scrape and everything the design system doesn't need

**Files:** deletions listed per step; modify `styles/utilities.css`, `components/docs/docs-motion.css`, `app/globals.css`, `scripts/build-registry.mjs`, `e2e/*`, `test/*` as `check:refs` / tests demand.

- [ ] **Step 1: Delete**

```bash
git rm -r -q app/showcase components/interfere public/interfere public/interfere-clone.html public/interfere-clone-dark.html \
  app/rpg-asset-report app/rpg-progress-preview public/imgs/rpg docs/rpg-ui-asset-report.md \
  public/specimens public/textures test/docs/theme-reference-scope.test.ts docs/audits docs/references/motion-rename.md
git ls-files docs/superpowers | grep -v "2026-10-10-corporate-clean.md" | xargs git rm -q
```

- [ ] **Step 2: Remove the `.theme-reference` CSS**

In `styles/utilities.css`, delete the whole showcase block: the comment that begins "the Interfere clone's sampled overrides" (near the top) and every rule whose selector starts with `.theme-reference` (the block starting at the comment "Source of every value: the captured stylesheet and bundles in `reference/`…"). In `components/docs/docs-motion.css` delete the `.theme-reference …` rules. In `app/globals.css` delete the comment line about "the showcase-only `.theme-reference` overrides". In `scripts/build-registry.mjs` remove `/^components\/interfere\//` from `FORBIDDEN_PATH_PATTERNS` and the "showcase-only CSS block stripped" logic if it targets `.theme-reference` only.

- [ ] **Step 3: Find every dangling reference**

```bash
git grep -n -E "interfere|theme-reference|imgs/rpg|rpg-|pull-of-the-week|perlin-noise|docs/superpowers|docs/audits|motion-rename" -- . ':!package-lock.json' ':!docs/superpowers/plans/2026-10-10-corporate-clean.md'
npm run check:refs
```
Fix each hit: delete the test case / e2e block that exercised deleted pages (`e2e/design-system.spec.ts`, `e2e/batch4.spec.ts`, `test/foundation/*`, `test/registry/registry-schema.test.ts`), and reword prose in `README.md`, `RULES.md`, `CHANGELOG.md`, `app/design-system/docs/changelog/page.tsx`, `.claude/skills/elattar-building-ui/**` so it no longer mentions them. Where the docs relied on `docs/references/motion-rename.md`, the current names are the only names — drop the pointer.

- [ ] **Step 4: Verify**

```bash
npm run verify:fast
```
Expected: no new failures vs `.tmp/baseline.txt`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: remove the scraped showcase, the RPG experiment and internal working docs"
```

### Task A6: Folder rename — no upstream product name in paths

**Files:** `components/ai-elements/` → `components/ai/`; `docs/ai-elements/` → `docs/ai/`; `test/components/ai-elements/` → `test/components/ai/`; every importer.

- [ ] **Step 1: Move**

```bash
git mv components/ai-elements components/ai && git mv docs/ai-elements docs/ai && git mv test/components/ai-elements test/components/ai
```

- [ ] **Step 2: Rewrite paths**

```bash
git grep -l -E "ai-elements" -- . ':!package-lock.json' ':!docs/superpowers' | xargs sed -i \
  -e 's#@/components/ai-elements/#@/components/ai/#g' \
  -e 's#components/ai-elements/#components/ai/#g' \
  -e 's#docs/ai-elements/#docs/ai/#g' \
  -e 's#test/components/ai-elements/#test/components/ai/#g'
git grep -n "ai-elements" -- . ':!package-lock.json' ':!docs/superpowers'
```
Expected: remaining hits are prose only (the scrub lane removes them). `components/ai/NOTICE.md` stays until Task C2 — the code is still the vendored code until then.

- [ ] **Step 3: Verify and commit**

```bash
npm run typecheck && npm run test:unit && npm run registry:build
git add -A && git commit -m "refactor(ai): components/ai, docs/ai, test/components/ai"
```

### Task A7: Our own message and result types — `ai` package out of the source

**Files:**
- Create: `components/ai/types.ts`
- Modify: every file with `from "ai"` (19 files: `components/ai/*`, `components/agent/workspace/reply-model.ts`, `workspace-settings.tsx`, docs code strings)

- [ ] **Step 1: Write the types**

`components/ai/types.ts`:
```ts
// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ayoub Elattar
/**
 * The message, part and result shapes the agent components render.
 *
 * Structural on purpose: a product whose transport speaks another wire format
 * maps onto these in its transport, and the components never import a
 * transport library. The field names follow the common streaming-chat shape so
 * that mapping is usually the identity.
 */

export type ChatStatus = "submitted" | "streaming" | "ready" | "error";

export type TextUIPart = { type: "text"; text: string; state?: "streaming" | "done" };
export type ReasoningUIPart = { type: "reasoning"; text: string; state?: "streaming" | "done" };
export type FileUIPart = { type: "file"; mediaType: string; filename?: string; url: string };
export type SourceUrlUIPart = { type: "source-url"; sourceId: string; url: string; title?: string };
export type SourceDocumentUIPart = {
  type: "source-document";
  sourceId: string;
  mediaType: string;
  title: string;
  filename?: string;
};
export type StepStartUIPart = { type: "step-start" };

export type ToolState =
  | "input-streaming"
  | "input-available"
  | "approval-requested"
  | "approval-responded"
  | "output-available"
  | "output-error"
  | "output-denied";

export type ToolApproval = { id: string; approved?: boolean; reason?: string };

type ToolPartBase = {
  toolCallId: string;
  state: ToolState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
  approval?: ToolApproval;
};

/** A call to a tool the product registered by name: `type` is `tool-<name>`. */
export type ToolUIPart = ToolPartBase & { type: `tool-${string}` };
/** A call to a tool discovered at run time. */
export type DynamicToolUIPart = ToolPartBase & { type: "dynamic-tool"; toolName: string };

export type UIMessagePart =
  | TextUIPart
  | ReasoningUIPart
  | FileUIPart
  | SourceUrlUIPart
  | SourceDocumentUIPart
  | StepStartUIPart
  | ToolUIPart
  | DynamicToolUIPart;

export type UIMessage = {
  id: string;
  role: "system" | "user" | "assistant";
  parts: UIMessagePart[];
  metadata?: unknown;
};

export type LanguageModelUsage = {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  reasoningTokens?: number;
  cachedInputTokens?: number;
};

export type Tool = { description?: string; inputSchema?: unknown; outputSchema?: unknown };

export type GeneratedImage = { base64: string; uint8Array: Uint8Array; mediaType: string };

export type SpeechResult = {
  audio: { base64: string; uint8Array: Uint8Array; mediaType: string; format?: string };
};

export type TranscriptionSegment = { text: string; startSecond: number; endSecond: number };
export type TranscriptionResult = {
  text: string;
  segments: TranscriptionSegment[];
  language?: string;
  durationInSeconds?: number;
};
```

- [ ] **Step 2: Swap every import**

```bash
git grep -l -E "from ['\"]ai['\"]" -- components app lib | xargs sed -i -E \
  -e "s#from ['\"]ai['\"]#from \"@/components/ai/types\"#g" \
  -e 's#Experimental_GeneratedImage#GeneratedImage#g' \
  -e 's#Experimental_SpeechResult as SpeechResult#SpeechResult#g' \
  -e 's#Experimental_TranscriptionResult as TranscriptionResult#TranscriptionResult#g'
git grep -n -E "from ['\"]ai['\"]" -- components app lib
```
Expected: no hits (docs code strings included — they now show `@/components/ai/types`).

- [ ] **Step 3: Let the compiler finish the types**

```bash
npm run typecheck
```
For each error, add the missing field to `components/ai/types.ts` with the narrowest type the usage needs. Never use `any`.

- [ ] **Step 4: Verify, uninstall, commit**

```bash
npm run test:unit && npm uninstall ai && npm run typecheck
git add -A && git commit -m "refactor(ai): own message and result types; the ai package is gone"
```

### Task A8: Licence files

**Files:**
- Create: `LICENSE`, `THIRD_PARTY_NOTICES.md`, `public/fonts/OFL.txt`, `scripts/build-notices.mjs`
- Modify: `package.json`, `README.md`

- [ ] **Step 1: `LICENSE`**

```
MIT License

Copyright (c) 2026 Ayoub Elattar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 2: `package.json`**

Add `"license": "MIT"` and `"author": "Ayoub Elattar"`. Keep `"private": true` (it prevents an accidental npm publish; it is not a licence statement).

- [ ] **Step 3: `public/fonts/OFL.txt`**

Copy `node_modules/geist/LICENSE.txt` from the line `This Font Software is licensed under the SIL Open Font License, Version 1.1.` to the end (that is the unmodified OFL 1.1 text), and put this line above it:
```
Inter — Copyright (c) 2016 The Inter Project Authors (https://github.com/rsms/inter)
```

- [ ] **Step 4: `THIRD_PARTY_NOTICES.md`**

```markdown
# Third-party notices

Elattar's Design System is MIT-licensed (see `LICENSE`), Copyright (c) 2026
Ayoub Elattar. It contains or depends on the following third-party material,
each under its own permissive licence.

## shadcn/ui — base components

The components in `components/ui/` began from shadcn/ui and have since been
rewritten onto this system's tokens.

MIT License — Copyright (c) 2023 shadcn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Typefaces

- **Inter** (`public/fonts/inter-variable.woff2`) — SIL Open Font License 1.1,
  Copyright (c) 2016 The Inter Project Authors. Full text: `public/fonts/OFL.txt`.
- **Geist Mono** — SIL Open Font License 1.1, delivered by the `geist` npm
  package, which carries its own licence file.

## Build and test tools (not shipped)

`lightningcss` (Tailwind's CSS engine) and `axe-core` (accessibility tests)
are MPL-2.0. They run unmodified during build and test only; nothing from them
is part of the shipped components.

## Runtime dependencies

Generated by `node scripts/build-notices.mjs` from `package-lock.json`. Every
package below is installed from npm with its own licence file.

<!-- deps:start -->
<!-- deps:end -->
```

- [ ] **Step 5: `scripts/build-notices.mjs`**

```js
#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ayoub Elattar
/**
 * Writes the runtime-dependency table into THIRD_PARTY_NOTICES.md, between
 * the deps:start / deps:end markers, from package-lock.json. Dev-only
 * packages are left out: they never reach a consumer.
 */
import { readFileSync, writeFileSync } from "node:fs";

const LEGACY = { format: "MIT" }; // declares its licence only in the old `licenses` array
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
const rows = [];
for (const [path, pkg] of Object.entries(lock.packages)) {
  if (!path || pkg.dev || pkg.link || !path.includes("node_modules/")) continue;
  const name = path.replace(/^.*node_modules\//, "");
  rows.push(`| ${name} | ${pkg.version} | ${pkg.license ?? LEGACY[name] ?? "UNDECLARED"} |`);
}
rows.sort((a, b) => a.localeCompare(b));
const table = ["| Package | Version | Licence |", "|---|---|---|", ...[...new Set(rows)]].join("\n");
const file = "THIRD_PARTY_NOTICES.md";
const text = readFileSync(file, "utf8").replace(
  /<!-- deps:start -->[\s\S]*<!-- deps:end -->/,
  `<!-- deps:start -->\n${table}\n<!-- deps:end -->`,
);
writeFileSync(file, text);
console.log(`THIRD_PARTY_NOTICES.md: ${rows.length} runtime packages`);
```
Add the script `"notices": "node scripts/build-notices.mjs"` to `package.json` and run it.

- [ ] **Step 6: README licence section**

Append to `README.md`:
```markdown
## Licence

MIT — Copyright (c) 2026 Ayoub Elattar. Anyone may use, copy, modify and
distribute this design system, commercially or not, as long as the copyright
and licence notice travel with it. See `LICENSE`; third-party notices are in
`THIRD_PARTY_NOTICES.md`.
```

- [ ] **Step 7: Commit**

```bash
npm run notices && git add LICENSE THIRD_PARTY_NOTICES.md public/fonts/OFL.txt scripts/build-notices.mjs package.json README.md
git commit -m "docs: MIT licence, third-party notices, font licence"
```

---

## Phase B — Clean-room rewrites and name scrub (parallel sub-agents)

### Task B0: Lane worktrees (main session)

- [ ] **Step 1: Create six worktrees from `main`, junction `node_modules`**

```bash
cd $REPO
for L in cc-composer cc-thread cc-run cc-dev cc-canvas cc-scrub; do
  git worktree add .claude/worktrees/$L -b wt/$L main
  cmd //c mklink /J "D:\\DESIGN\\Design-System-2026-8\\design-system\\.claude\\worktrees\\$L\\node_modules" "D:\\DESIGN\\Design-System-2026-8\\design-system\\node_modules"
  mkdir -p .claude/worktrees/$L/.tmp/clean-room && cp .tmp/clean-room/similarity.mjs .claude/worktrees/$L/.tmp/clean-room/
done
git worktree list
```

### Lane ownership (no lane edits another lane's files)

| Lane | Worktree | PW_PORT | Components (`components/ai/<name>.tsx` unless noted) |
|---|---|---|---|
| 1 composer | `cc-composer` | 3101 | prompt-input (drops `nanoid` → `crypto.randomUUID()`), attachments, context (drops `tokenlens`; optional `pricing` prop), model-selector (no remote logo), mic-selector, speech-input, transcription, shimmer, suggestion |
| 2 thread | `cc-thread` | 3102 | message (keeps `streamdown`), reasoning, chain-of-thought, conversation (drops `use-stick-to-bottom` → own `components/ai/use-auto-scroll.ts`), sources, inline-citation, image, agent, artifact, audio-player (drops `media-chrome` → native `<audio>` + our Slider/Button), voice-selector |
| 3 run | `cc-run` | 3103 | tool, task, plan, queue, checkpoint, confirmation, question, stack-trace, test-results, terminal (drops `ansi-to-react` → own `components/ai/ansi.ts`), sandbox |
| 4 dev | `cc-dev` | 3104 | code-block (keeps `shiki`), snippet, schema-display, environment-variables, package-info, commit, file-tree, web-preview, jsx-preview (drops `react-jsx-parser` → own `components/ai/jsx-parse.ts`: a JSX-subset parser rendering only whitelisted components, never evaluating code), open-in-chat (consumer-supplied providers, no built-in brands) |
| 5 canvas | `cc-canvas` | 3105 | canvas, node, edge, connection, controls, panel, toolbar (keep `@xyflow/react`), persona (drops Rive → our `CubeAvatar`), **plus** `components/agent/parts/refine-frame.tsx` and its `refine-frame` utility/keyframes in `styles/utilities.css` / `styles/motion.css` |
| 6 scrub | `cc-scrub` | — | Everything NOT owned above (see Task B6) |

Each rewrite lane also owns, for its components: `test/components/ai/<name>*.test.tsx`, `components/docs/component-docs/ai-<name>/**`, `docs/ai/usage/<name>.md`, `docs/contracts/audit/ai-<name>.json`. Lane 5 also owns `test/components/agent/refine-frame*.test.tsx`, `components/docs/component-docs/agent-refine-frame/**`, `docs/contracts/audit/agent-refine-frame.json`. Lane 1 may edit `components/agent/workspace/workspace-composer.tsx` **only** to adapt to the approved `ModelSelectorLogo` / `Context` changes; Lane 6 does not touch that file.

**Public API rule:** exported names, prop names and types, `data-slot` names and DOM roles stay identical, except the four approved changes in Global Constraints. Consumers in `components/agent/**` must compile unchanged.

### Task B1–B5: Clean-room rewrite — one procedure per lane

Each lane runs three sub-agents in sequence; the five lanes run concurrently. Dispatch with `model: "sonnet"`.

#### Stage 1 — Spec agent (prompt template)

```
You are the SPEC writer for a clean-room rewrite in Elattar's Design System.
Worktree (work ONLY here): D:\DESIGN\Design-System-2026-8\design-system\.claude\worktrees\<LANE>
Components: <list from the lane table>
Never run npm or write into node_modules.

First invoke the `elattar-building-ui` skill and read RULES.md.

For EACH component:
1. Read components/ai/<name>.tsx, its docs page components/docs/component-docs/ai-<name>/, docs/ai/usage/<name>.md, its tests, and every consumer (git grep "components/ai/<name>").
2. Write .tmp/clean-room/specs/<name>.md with these sections, in plain prose and TypeScript signatures only — NO implementation code, NO copied function bodies, NO copied JSX:
   - Public API: every export, with its exact TypeScript prop/return types (the interface is the contract consumers rely on).
   - Anatomy: each part, its element and role, its data-slot name, what it contains.
   - States and transitions, including loading, empty, error, disabled.
   - Interaction: pointer, keyboard (every key), focus order and focus return.
   - Accessibility: roles, accessible names, live regions, reduced-motion behaviour.
   - Visual, per part, in this system's token vocabulary (surface, ink, type role, radius, spacing, motion token names from RULES.md / styles/*.css). Token names are ours and may be listed exactly.
   - Motion: which motion tokens/utilities, when.
   - Dependencies allowed: <lane-specific: e.g. "streamdown only" / "none — write ansi.ts">.
   - Approved change (if this component is one of Persona / ModelSelectorLogo / OpenInChat / Context): describe the new behaviour as decided by the owner.
3. Extend test/components/ai/<name>.test.tsx so EVERY behaviour in the spec is pinned (render, states, keyboard, aria, callbacks). Tests use only the public API. Run `npx vitest run test/components/ai/<name>` — they must PASS against the CURRENT implementation (that proves the spec matches today's behaviour).
4. Commit tests: `git add test && git commit -m "test(ai): pin <name> behaviour before the rewrite"`.
When every component in the lane is done:
5. `git rm` every components/ai/<name>.tsx in the lane (lane 5: also components/agent/parts/refine-frame.tsx), and commit: `chore(ai): retire <names> for the clean-room rewrite`.
6. Report: list of spec files, test counts, commit hashes. Do not write any implementation.
```

#### Stage 2 — Implementer agent (prompt template; a NEW agent, never the spec agent)

```
You are the IMPLEMENTER for a clean-room rewrite in Elattar's Design System.
Worktree (work ONLY here): D:\DESIGN\Design-System-2026-8\design-system\.claude\worktrees\<LANE>
Components: <list>
Never run npm or write into node_modules.

CLEAN-ROOM RULES — breaking any of these voids the work:
- Do NOT read any previous version of the files you are writing: no `git show`, `git log -p`, `git diff`, `git checkout`, `git stash` or blame touching components/ai/** or components/agent/parts/refine-frame.tsx at or before the "retire" commit; no origin/main or main copies; no other worktree under .claude/worktrees; no upstream repository or website; no web search for the component's source.
- Your inputs are ONLY: .tmp/clean-room/specs/<name>.md, the tests in test/components/ai/, RULES.md, styles/*.css, components/ui/**, hooks/**, lib/**, the docs pages and specimens (they show usage), and the consumers in components/agent/**. For kept libraries (streamdown, shiki, @xyflow/react) you may read their own README/type definitions in node_modules.

First invoke the `elattar-building-ui` skill and read RULES.md.

For EACH component (TDD — the tests already exist and currently fail because the file is gone):
1. `npx vitest run test/components/ai/<name>` — confirm FAIL.
2. Write components/ai/<name>.tsx from the spec: first line `"use client";` only if the spec's behaviour needs client state, preceded by the two SPDX header lines:
   // SPDX-License-Identifier: MIT
   // Copyright (c) 2026 Ayoub Elattar
   Then a doc comment describing the component in your own words — no provenance, no "ported/adapted/vendored", no third-party names.
3. Only tokens; `npm run check:tokens` must pass. Both themes. Only -ink carries text.
4. `npx vitest run test/components/ai/<name>` — PASS.
5. Scrub the component's docs page, usage doc and audit json: remove every banned name (React Bits, ElevenLabs, AI Elements, ai-elements, ai-sdk, Vercel, Rive, models.dev, ChatGPT, Claude, Cursor, v0, t3.chat, scira, "vendored", "upstream", "ported"). Describe the component as ours.
6. Commit per component: `feat(ai): <Name> — written for this system`.
When all are done:
7. `npm run typecheck && npm run lint && npm run check:tokens && npm run test:unit`
8. `npm run build && PW_PORT=<port> npx playwright test e2e/clean-room-parity.spec.ts --project=desktop-dark --project=desktop-light -g "<slug1>|<slug2>|..."` — every lane slug must PASS. For an approved-change component only, re-baseline its snapshots with --update-snapshots and say so in the report.
9. Report: files written, test results, parity results, anything the spec left ambiguous and what you chose.
```

#### Stage 3 — Reviewer agent (prompt template; a third agent)

```
You review a clean-room rewrite. Worktree: <path>. Components: <list>. Never run npm.
1. Independence: for each file run
   node .tmp/clean-room/similarity.mjs <(git show main:components/ai/<name>.tsx) components/ai/<name>.tsx
   (lane 5 refine-frame: main:components/agent/parts/refine-frame.tsx). Exit 1 (>10% shared substantive lines) = FAIL; list the shared lines and judge whether each is unavoidable (a token class string, a type signature) or copied logic. Copied logic is a FAIL.
2. Spec compliance: every section of .tmp/clean-room/specs/<name>.md is implemented; public API identical to the spec (except approved changes).
3. Quality: RULES.md (tokens, -ink, type roles, 44px targets, reduced motion), no `any`, no dead code, no banned names (git grep -n -i -E "react ?bits|eleven ?labs|ai[- ]elements|ai-sdk|vercel|\brive\b|models\.dev|yuki|interfere|commons clause|vendored|upstream" -- <lane files>).
4. Re-run: npm run typecheck, npm run test:unit, the lane's parity tests.
Report PASS or a numbered list of required fixes. Fixes go back to a NEW implementer agent with the same clean-room rules.
```

### Task B6: Name scrub lane (one sub-agent, runs concurrently with B1–B5)

Prompt:
```
Worktree (work ONLY here): D:\DESIGN\Design-System-2026-8\design-system\.claude\worktrees\cc-scrub
Never run npm. First invoke `elattar-building-ui` and read RULES.md.

Remove every third-party and old-project name from files NOT owned by the rewrite lanes. You must NOT edit: components/ai/**, components/agent/parts/refine-frame.tsx, components/agent/workspace/workspace-composer.tsx, components/docs/component-docs/ai-*/**, components/docs/component-docs/agent-refine-frame/**, docs/ai/**, docs/contracts/audit/ai-*.json, docs/contracts/audit/agent-refine-frame.json, test/components/ai/**, test/components/agent/refine-frame*, the refine-frame utility in styles/utilities.css and its keyframes in styles/motion.css.

Find them:
git grep -n -i -E "react ?bits|reactbits|eleven ?labs|ai[- ]elements|ai-sdk|\bvercel\b|\brive\b|models\.dev|yuki|commons clause|\binterfere\b|chatgpt|claude code|claude\.ai|cursor\.com|v0\.app|t3\.chat|scira|vendored|ported from|adapted from" -- . ':!package-lock.json' ':!package.json' ':!THIRD_PARTY_NOTICES.md' ':!docs/superpowers'

Rules:
- Yuki/Yukirhythm: keep every component and token (IconSwap, ActiveIndicator, Button feel, Input treatment, the elevation/shadow system, the motion set). Delete only the provenance: "ported from Yukirhythm", "borrowed from Yuki", "Yuki's" → describe the thing as this system's own. RULES.md "Ported from Yukirhythm." line goes.
- Vendor names in prose (RULES.md, README.md, CHANGELOG.md, AGENTS.md, docs/**, app/design-system/** including the agent-workspace "why" page and the changelog page, components/agent/** comments, components/ui/** comments, styles/*.css comments, lib/**, scripts/** comments, e2e/**, test/**, .claude/skills/**): rewrite the sentence so it describes our system without naming the source. "Geist Mono comes from Vercel's official self-hosted geist/font/mono package" → "Geist Mono is self-hosted through the geist package".
- Mock data in lib/agent/** and components/agent/**: replace real product/model names (e.g. Claude, GPT, Gemini) with fictional ones ("Atlas", "Atlas Mini", "Atlas Pro").
- CHANGELOG.md and app/design-system/docs/changelog/page.tsx: keep every entry, reword names out.
- docs/contracts/** (non-lane files) and ledgers: reword; then do NOT hand-edit generated ledgers — Task C3 regenerates them.
- scripts/registry-manifest.mjs: reword the comment "(Apache-2.0, ships with its NOTICE)".
Commit in logical chunks: `docs: describe <area> as this system's own`.
Finish with: npm run typecheck, npm run lint, npm run check:refs, npm run test:unit. Report remaining hits (should be only lane-owned files).
```

### Task B7: Lane review gate (main session)

- [ ] For each lane, read the reviewer's report; send required fixes back to a fresh implementer; repeat until PASS. Lane 6 is reviewed by re-running its grep and the four checks.

---

## Phase C — Integrate on `main` (main session)

### Task C1: Cherry-pick the lanes

- [ ] **Step 1:** In this order — canvas, run, dev, thread, composer, scrub — cherry-pick each lane's commits onto `main`:

```bash
cd $REPO
for L in cc-canvas cc-run cc-dev cc-thread cc-composer cc-scrub; do
  git cherry-pick $(git rev-list --reverse main..wt/$L) || { echo "CONFLICT in $L"; break; }
done
```
On conflict: resolve keeping the lane owner's version for lane-owned files and the scrub lane's wording for comments elsewhere; `git cherry-pick --continue`.

- [ ] **Step 2:** `npm run typecheck && npm run test:unit`

### Task C2: Drop the replaced packages and the old notice

- [ ] **Step 1:**
```bash
git rm components/ai/NOTICE.md
npm uninstall tokenlens nanoid use-stick-to-bottom ansi-to-react react-jsx-parser media-chrome @rive-app/react-webgl2
git grep -n -E "from ['\"](tokenlens|nanoid|use-stick-to-bottom|ansi-to-react|react-jsx-parser|media-chrome|@rive-app)" -- components app lib
```
Expected: no hits. Remove `components/ai/NOTICE.md` from `scripts/registry-manifest.mjs`.

- [ ] **Step 2:** `npm run typecheck && npm run build && npm run notices`
- [ ] **Step 3:** `git add -A && git commit -m "chore(deps): replaced packages out; every agent component is this system's own"`

### Task C3: Regenerate everything generated

- [ ] `npm run registry:build && npm run ledger && npm run docs:validate`
- [ ] `PW_PORT=3100 npx playwright test e2e/clean-room-parity.spec.ts --project=desktop-dark --project=desktop-light` — all PASS on the integrated `main`.
- [ ] `git add -A && git commit -m "chore: registry, ledgers and llms.txt regenerated"`

### Task C4: Remove the lane worktrees

```bash
for L in cc-composer cc-thread cc-run cc-dev cc-canvas cc-scrub; do
  cmd //c rmdir "D:\\DESIGN\\Design-System-2026-8\\design-system\\.claude\\worktrees\\$L\\node_modules"
  git worktree remove .claude/worktrees/$L && git branch -D wt/$L
done
```
(Remove the junction first so the real `node_modules` is never followed.)

---

## Phase D — Licence everywhere, and the guards (main session)

### Task D1: SPDX headers on every source file

**Files:** Create `scripts/add-spdx.mjs`; modify all source files.

- [ ] **Step 1:**
```js
#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ayoub Elattar
/**
 * Prepends the MIT SPDX header to every tracked source file that lacks it.
 * Comments may precede "use client" and @import, so the header always goes
 * first — after a shebang line, if there is one.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const JS = "// SPDX-License-Identifier: MIT\n// Copyright (c) 2026 Ayoub Elattar\n";
const CSS = "/* SPDX-License-Identifier: MIT\n   Copyright (c) 2026 Ayoub Elattar */\n";
const SOURCE = /^((components|app|lib|hooks|styles|scripts|test|e2e)\/.+|[^/]+)\.(tsx?|mjs|js|css)$/;

const files = execFileSync("git", ["ls-files"], { encoding: "utf8" }).split("\n")
  .filter((f) => SOURCE.test(f) && f !== "next-env.d.ts");
let changed = 0;
for (const f of files) {
  const text = readFileSync(f, "utf8");
  if (text.slice(0, 400).includes("SPDX-License-Identifier: MIT")) continue;
  const header = f.endsWith(".css") ? CSS : JS;
  const out = text.startsWith("#!")
    ? text.replace(/^(#![^\n]*\n)/, `$1${header}`)
    : header + text;
  writeFileSync(f, out);
  changed++;
}
console.log(`SPDX header added to ${changed} files`);
```
- [ ] **Step 2:** `node scripts/add-spdx.mjs && npm run typecheck && npm run lint && npm run build`
- [ ] **Step 3:** `git add -A && git commit -m "chore: MIT SPDX header on every source file"`

### Task D2: The provenance guard

**Files:** Create `scripts/check-provenance.mjs`, `test/foundation/provenance.test.ts`; modify `package.json` (`check:provenance`, add to `verify` and `verify:fast` right after `check:tokens`).

- [ ] **Step 1: Failing test**

```ts
// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ayoub Elattar
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("check:provenance", () => {
  it("finds nothing: no upstream names, no disallowed licences, every header, no outside hosts", () => {
    const run = spawnSync(process.execPath, ["scripts/check-provenance.mjs"], { encoding: "utf8" });
    expect(run.stdout + run.stderr).toContain("check:provenance — clean");
    expect(run.status).toBe(0);
  });
});
```
Run: `npx vitest run test/foundation/provenance.test.ts` → FAIL (script missing).

- [ ] **Step 2: The guard**

```js
#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ayoub Elattar
/**
 * check:provenance — fails the build on anything a corporate licence review
 * would stop at:
 *   names    — no upstream product, vendor or old-project name in any file we
 *              ship or document. THIRD_PARTY_NOTICES.md is the one place
 *              upstream names belong.
 *   licences — every production dependency is under a licence on ALLOWED.
 *   headers  — every source file carries the MIT SPDX header.
 *   urls     — no source file reaches an outside host.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
  .split("\n").filter(Boolean);
const findings = [];
const fail = (check, msg) => findings.push(`[${check}] ${msg}`);

/* names */
const NAME_EXEMPT = new Set([
  "THIRD_PARTY_NOTICES.md", "package.json", "package-lock.json", ".gitignore",
  "scripts/check-provenance.mjs", "test/foundation/provenance.test.ts",
]);
const TEXT = /\.(tsx?|mjs|js|css|md|mdx|json|txt|html|svg|ya?ml)$/;
const SHIPPED = /^(components|app|lib|hooks|styles|public|docs)\//;
const NAMES = [
  { re: /react[\s-]?bits/i, what: "React Bits" },
  { re: /eleven\s?labs/i, what: "ElevenLabs" },
  { re: /ai[\s-]elements|ai-sdk\.dev|vercel\/ai\b/i, what: "AI Elements" },
  { re: /\bVercel\b/, what: "Vercel" },
  { re: /\bInterfere\b|interfere(-clone|\.com)/i, what: "Interfere" },
  { re: /\byuki/i, what: "Yuki / Yukirhythm" },
  { re: /commons clause/i, what: "Commons Clause" },
  { re: /\bRive\b|@rive-app|\.riv\b|vercel-storage/, what: "Rive" },
  { re: /models\.dev/i, what: "models.dev" },
  { re: /\bchatgpt\b|claude code|claude\.ai|cursor\.com|v0\.app|t3\.chat|\bscira\b/i, what: "third-party chat product", scope: SHIPPED },
];
for (const f of files) {
  if (NAME_EXEMPT.has(f) || !TEXT.test(f)) continue;
  const lines = readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const n of NAMES) {
      if (n.scope && !n.scope.test(f)) continue;
      if (n.re.test(line)) fail("names", `${f}:${i + 1} names ${n.what}`);
    }
  });
}

/* licences */
const ALLOWED = new Set([
  "MIT", "ISC", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "0BSD", "BlueOak-1.0.0",
  "CC0-1.0", "MIT-0", "Python-2.0", "CC-BY-4.0", "SIL OPEN FONT LICENSE", "OFL-1.1",
  "MIT AND ISC", "(MIT OR CC0-1.0)",
]);
const LEGACY = { format: "MIT" };
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
for (const [path, pkg] of Object.entries(lock.packages)) {
  if (!path || pkg.dev || pkg.link) continue;
  const name = path.replace(/^.*node_modules\//, "");
  const licence = pkg.license ?? LEGACY[name];
  if (!ALLOWED.has(licence)) fail("licences", `${name}@${pkg.version}: ${licence ?? "none declared"}`);
}

/* headers */
const SOURCE = /^((components|app|lib|hooks|styles|scripts|test|e2e)\/.+|[^/]+)\.(tsx?|mjs|js|css)$/;
for (const f of files) {
  if (!SOURCE.test(f) || f === "next-env.d.ts") continue;
  if (!readFileSync(f, "utf8").slice(0, 400).includes("SPDX-License-Identifier: MIT")) {
    fail("headers", `${f} has no MIT SPDX header (run node scripts/add-spdx.mjs)`);
  }
}

/* urls */
const URL_SCOPE = /^(components|app|lib|hooks|styles)\/.+\.(tsx?|css|mjs|js)$/;
const URL_OK = /^https?:\/\/(localhost|127\.0\.0\.1|www\.w3\.org|react\.dev|[a-z0-9.-]*example(\.com|\.org)?)([/:]|$)/;
for (const f of files) {
  if (!URL_SCOPE.test(f)) continue;
  for (const m of readFileSync(f, "utf8").matchAll(/https?:\/\/[^\s"'`)<>]+/g)) {
    if (!URL_OK.test(m[0])) fail("urls", `${f}: ${m[0]}`);
  }
}

if (findings.length) {
  console.error(findings.join("\n"));
  console.error(`\ncheck:provenance — ${findings.length} finding(s)`);
  process.exit(1);
}
console.log("check:provenance — clean");
```

- [ ] **Step 3: Wire and run**

`package.json`: `"check:provenance": "node scripts/check-provenance.mjs"`; insert `npm run check:provenance &&` after `npm run check:tokens &&` in `verify` and `verify:fast`.
```bash
npm run check:provenance
```
Fix every finding at its source (never widen the allowlists to make one pass without telling the owner). Then `npx vitest run test/foundation/provenance.test.ts` → PASS.

- [ ] **Step 4:** `git add -A && git commit -m "build: check:provenance — names, licences, headers and outside hosts are guarded"`

### Task D3: No page reaches an outside host

**Files:** Create `e2e/no-outbound.spec.ts`.

- [ ] **Step 1:**
```ts
// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Ayoub Elattar
/**
 * Crawls every same-origin page from the docs root and fails if any request —
 * script, style, font, image, fetch, socket — goes anywhere but this server.
 */
import { expect, test } from "@playwright/test";

test("no page reaches an outside host", async ({ page, baseURL }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-dark");
  test.setTimeout(900_000);
  const origin = new URL(baseURL!).origin;
  const outside = new Set<string>();
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["http:", "https:", "ws:", "wss:"].includes(url.protocol)) return;
    if (!["127.0.0.1", "localhost"].includes(url.hostname)) outside.add(`${url.origin} ← ${page.url()}`);
  });
  const queue = ["/", "/design-system", "/sidebar-demo"];
  const seen = new Set(queue);
  while (queue.length) {
    const path = queue.shift()!;
    await page.goto(path, { waitUntil: "networkidle" });
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => (a as HTMLAnchorElement).href));
    for (const href of hrefs) {
      const url = new URL(href);
      if (url.origin !== origin || seen.has(url.pathname) || seen.size >= 600) continue;
      seen.add(url.pathname);
      queue.push(url.pathname);
    }
  }
  expect([...outside]).toEqual([]);
});
```
- [ ] **Step 2:** `npm run build && PW_PORT=3100 npx playwright test e2e/no-outbound.spec.ts --project=desktop-dark` → PASS. Any hit: fix the component that made it.
- [ ] **Step 3:** `git add e2e/no-outbound.spec.ts && git commit -m "test(e2e): no page reaches an outside host"`

### Task D4: Licence visible in the registry and on the docs site

**Files:** `scripts/build-registry.mjs` (or wherever `registry.json` items are generated — `scripts/registry-manifest.mjs` / `scripts/generate-registry.mjs`), `test/registry/registry-schema.test.ts`, `components/docs/chrome/site-footer.tsx` consumer in `app/page.tsx` / docs layout, a docs page `app/design-system/docs/license/page.tsx`, `lib/ds/nav.ts`, `public/llms.txt` generator.

- [ ] **Step 1: Failing registry test** — add to `test/registry/registry-schema.test.ts`:
```ts
it("every item declares the MIT licence and its holder", () => {
  for (const item of registry.items) {
    expect(item.meta?.license, item.name).toBe("MIT");
    expect(item.meta?.copyright, item.name).toBe("Copyright (c) 2026 Ayoub Elattar");
  }
});
```
- [ ] **Step 2:** Where items are built, add `meta: { license: "MIT", copyright: "Copyright (c) 2026 Ayoub Elattar" }` to every item; `npm run registry:build && npm run registry:validate` → PASS.
- [ ] **Step 3: Docs site** — pass `legalNote="MIT licensed · Copyright (c) 2026 Ayoub Elattar"` wherever `SiteFooter` renders; add a "License" page under Docs in `lib/ds/nav.ts` whose body states the MIT grant in one paragraph, links `LICENSE` and `THIRD_PARTY_NOTICES.md`, and lists the four guarantees (own code, MIT, no outside requests, no telemetry). Built from existing DS components only (`elattar-building-ui` skill first). Ensure the `public/llms.txt` generator emits a `License: MIT — Copyright (c) 2026 Ayoub Elattar` line; regenerate with `npm run ledger`.
- [ ] **Step 4:** `npm run verify:fast` → PASS; commit `docs: the licence is on every registry item and on the site`.

### Task D5: SBOM, version, final verification

- [ ] **Step 1:** `package.json` script `"sbom": "npm sbom --sbom-format cyclonedx --omit dev > sbom.cdx.json"`; run it; commit `sbom.cdx.json`.
- [ ] **Step 2:** Bump `"version"` to `0.3.0`; add a CHANGELOG entry: "Every component is this system's own code under MIT; no outside requests; no telemetry; provenance guard in the build."
- [ ] **Step 3:** Remove the temporary material: `git rm -r e2e/clean-room-parity.spec.ts e2e/clean-room-parity.spec.ts-snapshots docs/superpowers` (this plan included — `docs/superpowers` must not ship).
- [ ] **Step 4:** `npm run verify:full` → PASS end to end, including `check:provenance`, `e2e/no-outbound.spec.ts` and the registry consumer test.
- [ ] **Step 5:** `git add -A && git commit -m "chore(release): 0.3.0 — corporate-clean"`

---

## Phase E — Owner's images (main session; needs the owner's files)

Two image slots remain after the deletions. The owner drops the files into `D:\DESIGN\Design-System-2026-8\owner-images\`:

| Slot | Replaces | Shape | Used by |
|---|---|---|---|
| card | `public/imgs/sample-card.png` | square, ≥ 800×800 | attachment docs |
| photo | `public/imgs/sample-pack.jpg` | landscape ~3:2, ≥ 1200 wide | aspect-ratio, media-scrim, ai-attachments / ai-chain-of-thought / ai-queue specimens, `test/effects/media-scrim.test.tsx` |

- [ ] **Step 1:** Copy them in under the same paths (convert format if needed so the paths stay), and rename paths only if the owner prefers — then update every reference from the table.
- [ ] **Step 2:** Rewrite each `alt` text to describe the new picture (e.g. today's "A pack of collectible cards").
- [ ] **Step 3:** `npm run verify:fast && npm run build`; commit `docs: specimen images are the owner's own`.

If the images have not arrived when D5 is reached, run D5 anyway and come back to E; the existing two images are not third-party-identified but their origin is unrecorded, so E must happen before any customer handover.

---

## Phase F — History-free export (main session; stops for the owner)

`main`'s history still contains the scraped site and the vendored code. Customers get a branch with none of it.

- [ ] **Step 1:**
```bash
cd $REPO
git checkout --orphan release/clean
git commit -m "Elattar's Design System 0.3.0" -m "MIT — Copyright (c) 2026 Ayoub Elattar"
git log --oneline | wc -l   # expect 1
git checkout main
```
- [ ] **Step 2:** Re-run the guard on the export: `git worktree add .tmp/export release/clean && (cd .tmp/export && node scripts/check-provenance.mjs)`; then `git worktree remove .tmp/export`.
- [ ] **Step 3: STOP.** Ask the owner where `release/clean` should be pushed (a new repository for customers) before pushing anything. Do not push `main` either without the owner's go-ahead.

---

## Self-review (done while writing)

- Coverage against the owner's request: scrape and unneeded material (A5); React Bits → ours (RefineFrame, B5 — the other eight are already gone from `main`); unknown origins / Yuki names (B6, guard D2); images (E); licence everywhere (A8, D1, D4); shadcn notice (A8, owner chose one notice file); ElevenLabs Orb/Matrix (owner chose leave gone — already deleted on `main`); AI Elements → ours, same behaviour (A6, A7, B1–B5, parity A2); third-party names out (B1–B6, D2); telemetry off (A3); policy items — shadcn CLI to dev and LGPL sharp out (A4), MPL dev-only tools documented (A8); sub-agents (Phase B); corporate-ready (D2, D3, D5, F).
- Approved behaviour changes are exactly four and listed once, in Global Constraints.
- Component code is intentionally absent from this plan: a clean-room rewrite requires the implementer to work from a spec written after this plan, not from code anyone pasted here.
