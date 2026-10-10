# Changelog

This file records what actually changed in the web design system, newest
first. Versions are git tags (`v0.2.0`) with a GitHub release. It does not
claim deployment: a tag says what the code is, not where it runs.

## Unreleased

### Added
- The project is released under the MIT licence (`LICENSE`). `THIRD_PARTY_NOTICES.md` credits every vendored source, and `components/ai-elements/` carries the full Apache-2.0 text beside its `NOTICE.md`.
- `docs/known-issues.md` records the dependency advisories that are known and accepted.

### Changed
- `ModelSelectorLogo` draws a local monogram. Pass your own logo through `src`; nothing is fetched from another host.
- Next.js is pinned to 16.4.0.
- The shadcn CLI is a devDependency.
- Next.js anonymous telemetry is switched off for `dev`, `build` and `start` through `scripts/next.mjs`.
- The sample images were replaced.
- The agent workspace's web-preview demo loads a page served by the app instead of an external address.

### Removed
- The per-provider `OpenIn` components. Use `OpenInLink` and the `openIn` prop.
- `Persona`. Use `VoiceOrb`.
- The earlier image-refinement frame component. Use `GeneratedImage`.
- The retired showcase page and the game-style theme experiment.

## 0.2.0 — 2026-10-03

The first tagged version. Everything since the 2026-09-04 shadcn-parity
migration.

### Added — GeneratedImage (original)
- `GeneratedImage` (`components/agent/parts/generated-image.tsx`, original): the frame a tool-generated image appears in. It holds the image's place in the reply, shows progress as clarity (heavily blurred while queued or generating, lightly blurred while refining, sharp when complete), names the stage in a small pill that leaves after Done, and offers Retry on a failure — on the system's tokens, utilities and Button.
- The AgentWorkspace draws every image a tool is making in one, from the first stage it reports to the finished picture, with Retry on a failure. The mock's Tools conversation generates a 4:3 dusk landscape to show it.

### Fixed
- Navigation Menu: the caret under the open item follows it again. `anim-enter` / `anim-exit` fill `both` and ended on `transform: none`, which outranked Radix's inline position, so it sat under the first item whatever was open.
- Removed five dependencies nothing imported: `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`, `motion`.

### Changed — the agent family is the AgentWorkspace
- `AgentWorkspace` (`components/agent/agent-workspace.tsx`, composed from Vercel AI Elements in `components/ai-elements/`, Apache-2.0, `NOTICE.md`) is now the whole agent family. The guide is `docs/agent-workspace.md`, which replaces `docs/agent-console.md`.
- Removed: the AgentConsole system — `AgentConsole`, `AgentLauncher`, `PromptBar`, the console's message, markdown, card, chip and palette parts, the Matrix and Matrix Loader, the voice orb, `VoicePill`, the Voice Indicator and its pickers, `useDictation`, and the console's third-party-derived parts (`GlideSelect`, `ThoughtLine`, `StatusMark`, `CallChip`, `SwipeRow`, `BellToggle`, and the console's image frame, since replaced by `GeneratedImage` — see Added). The OD1 "site-only" rule goes with them.
- `EffortSlider` and `SparkField` are original code (`components/agent/parts/`).
- Kept: the transport contract and run model (`components/agent/core/*`), the animated avatar (`components/agent/avatar/*`), the browser speech adapter (`components/agent/voice/speech.ts`) and the mock transport, which now plays seven conversations.
- The registry ships the `agent-workspace` block in place of `agent-console`.
- The docs code viewer moved to `components/ds/code-block.tsx`. The Bubble, Message and Message Scroller pages compare themselves with AI Message and AI Conversation (section ids `vs-ai-message`, `vs-ai-conversation`) instead of the deleted console.

### Changed — motion vocabulary is now fourteen names
- 54 keyframes → 11 system keyframes (+7 surface timelines that were never motion vocabulary).
- `press` is the one click feel (scale 0.9). `click-spring`, `press-spring`, `press-key`, `btn-spring`, `lift` retired.
- Every overlay opens on `anim-open` / `anim-close`; `tw-animate-css` removed. Sheet (and so the mobile Sidebar) keeps its edge slide as component-owned motion in `components/ui/sheet.css`.
- Avatar cube keyframes live with the avatar; the docs site's intro lives with the docs site. Neither ships in `source-foundation`.

### Typography: exactly 17 public roles

Public typography was cut down to exactly 17 roles, each owning shape only —
family, size, line height, weight, tracking — never color, case, or product
meaning:

`display` · `h1` · `h2` · `h3` · `h4` · `lead` · `body` · `small` · `nav` ·
`badge` · `code` · `identifier` · `number-sm` · `number-base` · `number-md` ·
`number-lg` · `number-xl`.

Fonts: Inter for words, Geist Mono for code and numerics. The Redaction font
and the `accent` role were removed completely; uppercase transforms were
removed system-wide (case now belongs to the component that needs it, never
to a type role). Breakpoints are 768px and 1024px only.

Retired role → replacement:

| Retired | Replacement | Notes |
|---|---|---|
| `accent` | `display` or the correct heading | Redaction font removed |
| `nav-sm` | `nav` | |
| `caption` | `small` | Muted ink only where component semantics require it |
| `label` | `body` or `small` | Weight/case/tracking belong to the label component |
| `section` | `small` | Case/tracking belong to the section-header component |
| `wordmark` | `nav` | Brand treatment belongs to the wordmark component |
| `serial` | `identifier` | Case/tracking belong to the serial-bearing component |
| `micro` | `small` | Removed uses unreadable at 14px |
| `tag` | `badge` | Case/tracking belong to Badge/the owning chip |
| `chip` | `badge` | |
| `num-xs`, `num-sm` | `number-sm` | |
| `num` | `number-base` | |
| `num-md` | `number-md` | |
| `num-lg` | `number-lg` | |
| `num-xl` | `number-xl` | |

Breaking: any consumer still spending a retired class name (`.type-accent`,
`.type-label`, `.type-num`, etc.) will fail `check:refs` and render nothing
sized — these classes no longer exist in `styles/typeset.css`. Owner-visible
size identity changes as part of this pass: `text-xs` 12→14 (kbd, chart
ticks, menu shortcuts), `text-sm` 13→14, `text-base` 15→16, `text-lg` 17→18,
`nav` 13.5→16, `micro` 10.5→14.

### Canonical stylesheet boundaries

The system's definition now lives in exactly four files, imported in order by
`app/globals.css` (which holds nothing else):

- `styles/tokens.css` — colour, radius, shadow, spacing
- `styles/typeset.css` — the 17 type roles
- `styles/motion.css` — durations, easing, named animations
- `styles/utilities.css` — sanctioned effect utilities

`npm run check:tokens` fails the build on any hardcoded colour, type size,
tracking, radius, duration or easing literal anywhere outside those four
files, including vendored shadcn components. `npm run check:refs` fails on
any class or `var()` reference that resolves to nothing. Both guards ran
clean across every source file in this migration's final gate (see the
release report for the exact file count).

### Component corrections (by batch, `docs/audits/web-component-audit.md`)

- **Batch 1** (buttons, forms, selects/pickers, selection controls — 22
  rows): 15/22 release-ready. RadioGroup's arrow-key selection race
  (Radix roving-focus vs. document-level keydown ordering), Checkbox/
  RadioGroupItem/Switch hit targets short of 44×44 at the current row
  pitch, and Calendar's 28×28 day cell are recorded as owner decisions,
  not fixed in place — re-implementing Radix's roving focus or widening
  hit targets without an owner call on row spacing would fork the
  primitive. Combobox and Command are `blocked(docs)`: several exported
  parts (chips, CommandDialog, etc.) have no specimen yet.
- **Batch 2** (dialogs/overlays, menus — 10 rows): 7/10 release-ready.
  DropdownMenu, ContextMenu and Menubar are `blocked(accessibility)` on
  the same 224×36 menu-row pitch as batch 1's targets — one owner decision
  spans both batches. Fixed in place: an untrue "tooltip captured" claim
  on AlertDialog's truncation-gated tooltip (replaced with a real
  clipped-label Playwright assertion), an unnamed Popover trigger, and a
  viewport-fit guard that ignored the bottom edge and scrollbar width.
- **Batch 3** (disclosure, feedback, data display — 25 rows): 24/25
  release-ready, seventeen corrections (thirteen real defects: a
  filled-forwards accordion animation permanently pinning a panel's open
  height, an `ItemGroup` rendering null/boolean children as empty list
  items, a `Spinner` with `role="status"` and no announced content,
  among others). Tabs is `blocked(accessibility)`: a 70×32 trigger against
  the 44 floor, on the same row-pitch decision.
- **Batch 4** (charts, layout primitives, sidebar — 15 rows): 15/15
  release-ready after this session's screenshot review closed the last
  three rows (IconSwap, Icon, Prose) that were blocked on visual evidence
  no one had actually looked at.
- **Batch 5** (agent console, history, composer, attachments — 34 rows):
  30/34 release-ready. A `setTimeout`-based rename race in one history
  control was replaced with an armed-flag pattern; rows 84/85 (waveform/
  visualiser motion) are honestly `pending(motion, visual)`, not
  `complete` — a behaviour test exists but no test drives the actual CSS
  keyframes. Rows 102/103 (the vendored WebGL orb) stay `blocked` on a
  documented WebGL/RAF limitation, not fixed.
- **Batch 6** (site chrome, sections, motion specimens — 31 rows): 31/31
  release-ready. `SiteHeader`'s 768–1023px navigation gap was fixed; every
  motion component now has a live specimen instead of a static frame.

### Documentation redesign

The root route (`/`) now presents the design system landing page. A new `/design-system/docs/*` section (Introduction, Installation, Theming,
Typeset, CLI, Registry, Skills, Changelog) was added. All 26 component
specimen pages under `/design-system/components/**` were restructured into a
fixed Installation → Usage → API → Accessibility contract, with every install
command sourced from the generated registry catalog (`commandFor()`) instead
of hand-typed — 71 call sites across all 26 pages, verified byte-for-byte
against `public/r/commands.json` by `npm run docs:validate`.

A real defect surfaced and was fixed during this work: `CodeBlock`'s
recognized-language render branch (used by every `bash` command block,
including the root page's install command) was missing `overflow-x-auto`,
letting a long registry URL push the whole page wider than a 375px viewport.
Fixed in `components/agent/parts/code-block.tsx` — the owning primitive, not
a page-level patch.

### shadcn-compatible registry

76 registry items — 1 foundation, 67 `registry:ui` (66 `components/ui/*` +
`use-replay-on-state-change`), 3 hooks (`use-mobile`, `use-latest`,
`use-reduced-motion`), 5 blocks (`agent-console`, `site-chrome`,
`site-reading-nav`, `site-sections`, `site-layout`) — built with the real
`shadcn build` CLI and validated against `shadcn`'s own zod schema (170
tests). Every `dependencies`/`registryDependencies` entry is derived from
real parsed imports, not hand-typed, so a declared dependency can never
silently drift from what a file actually imports.

Install: `npx shadcn@latest add @elattar/foundation`, then any component or
block by name (exact commands on `/design-system/docs/registry`, generated
from the catalog). A real rehearsal against a fresh `create-next-app`
consumer installed foundation, Button, Dialog, Form, Select, Sidebar, the
`agent-console` block and the `site-chrome` block over HTTP; `tsc --noEmit`
and `next build` both passed in the consumer.

**Dev-only caveat:** the registry base URL baked into `public/r/commands.json`
and `public/llms.txt` today is `http://127.0.0.1:3200/r` — a local static
server this repository starts for rehearsal, not a public host. No install
command on any documentation page will work for an outside consumer until a
production `REGISTRY_URL` (see `scripts/registry-manifest.mjs`) is set and
the registry is actually hosted somewhere reachable. `public/fonts/
inter-variable.woff2` cannot be delivered through a registry item (binary
content does not round-trip through the JSON string `content` field) — the
foundation item's `docs` field documents the one manual copy step instead.

### AI skill update

`.claude/skills/elattar-building-ui/SKILL.md` and its four reference files
(`component-contracts.md`, `traps.md`, `verify.md`, `state-inventory.md`)
were updated to name only current APIs, roles, commands and verification
gates — every retired type role, dead font reference, and superseded
component API was swept out. `test/docs/skill-contract.test.ts` (72 assertions,
71 passing / 1 skipped pending a built registry) guards the skill text
against drift: it fails if a retired role or a stale command reappears.

### Breaking: motion vocabulary renamed to Flutter role names

Every web motion token, utility and keyframe was renamed from a private,
product/feel vocabulary (`jelly`, `pulls-*`, `spring` as a curve
name, `base`) to the role names `flutter-design-system` already uses —
`MotionDurations`, `MotionCurves`, and the `*Motion` widget family. **No value
changed**: every duration, cubic-bezier and keyframe body is byte-identical
before and after this rename; only the name changed. There are no
compatibility aliases for any retired name — the only aliases kept are the
three Tailwind vocabulary repoints `--ease-in`, `--ease-out`, `--ease-in-out`,
which point at the renamed role tokens exactly as `--text-sm` points at
`--text-small`.

**Migration for consumers who copied components out of this repo:**
`node scripts/rename-motion.mjs` — the one-pass anchored rename this project
used on itself, driven by `lib/motion-names.ts`.

**Durations (`--duration-*`)**

| Before | After | Flutter |
|---|---|---|
| `--duration-base` 250ms | `--duration-normal` | `MotionDurations.normal` |
| `--duration-overlay` 320ms | `--duration-overlay-enter` | `MotionDurations.overlayEnter` |
| `--duration-jelly` 420ms | `--duration-open` | `MotionDurations.open` |

Every other duration token (`tick`, `fast`, `slow`, `reward`, `bloom`, `sway`,
`sway-alt`) is unchanged. Twenty new tokens were also added, each replacing a
literal previously written by hand inside a `@utility` — `--duration-pop-in`,
`--duration-state-change`, `--duration-spring-up`, `--duration-sign-on`,
`--duration-spin`, `--duration-caret`, `--duration-check-draw`,
`--duration-dash-draw`, `--duration-dot-pop`, `--duration-ratchet`,
`--duration-shimmer`, `--duration-shimmer-text`, `--duration-pulse-live`,
`--duration-press-in`, `--duration-press-spring-up`, `--duration-beat-hover`,
`--duration-beat-press`, `--duration-foil-drift`, `--duration-glint`,
`--duration-cosmic-drift-deep`, `--duration-cosmic-drift-near` — same values,
new names.

**Easings (`--ease-*`)**

| Before | Value | After | Flutter |
|---|---|---|---|
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | `--ease-emphasized` | `MotionCurves.emphasized` |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | `--ease-enter` | `MotionCurves.enter` |
| `--ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | `--ease-exit` | `MotionCurves.exit` |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | `--ease-move` | `MotionCurves.move` |

`--ease-out-flex`, `--ease-settle` and `--ease-standard` are unchanged.
`--ease-in`, `--ease-out` and `--ease-in-out` still exist as Tailwind's own
vocabulary, repointed at the renamed tokens above — the one exception to "no
compatibility aliases."

**Utilities (`@utility anim-*`)**

| Before | After | Flutter |
|---|---|---|
| `anim-jelly-in` | `anim-open` | `OpenMotion` |
| `anim-jelly-out` | `anim-close` | exit half of `OpenMotion` |
| `anim-jelly` | `anim-state-change` | `StateChangeMotion` |
| `anim-spring-up` | `anim-spring-entrance` | `SpringEntranceMotion` |
| `anim-pop-in` | `anim-entrance` | `EntranceMotion` |
| `anim-ratchet` | `anim-discrete-progress` | `DiscreteProgressMotion` |
| `anim-sign-on` | `anim-text-reveal` | `TextRevealMotion` |
| `anim-shimmer` | `anim-loading-shimmer` | `LoadingShimmerMotion` |
| `anim-pulse-live` | `anim-live-pulse` | `LivePulseMotion` |
| `anim-unfold` | `anim-expand` | `expand` |
| `anim-fold` | `anim-collapse` | `collapse` |

Every other utility (`anim-fade-up`, `anim-reveal`, `anim-spin`, `anim-caret`,
`anim-progress-indeterminate`, `anim-check-draw`, `anim-dash-draw`,
`anim-dot-pop`, `anim-panel-in`, `anim-fade-in`, `anim-row-in`, `anim-row-out`,
`anim-swap-in`, `anim-split-in`, `anim-blur-word-in`, `anim-intro-rise`,
`anim-intro-panel`, `anim-intro-glow`, `anim-shimmer-text`, `anim-confirm-in`,
`anim-confirm-out`, `anim-blur-out`, `anim-blur-in`, `slide-pill`,
`swap-roll`, `press`, `click-spring`, `press-spring`, `press-key`, `lift`,
`btn-spring`) is unchanged.

**Keyframes (`@keyframes`)**

| Name before | After |
|---|---|
| Fourteen older keyframes | `ds-*`, one-to-one — the old names are retired in favour of `ds-*` |
| `pulls-*` (21 keyframes) | `ds-*`, one-to-one |

`pulls-pop-in` was deleted outright rather than renamed: no `@utility`
referenced it. Every keyframe outside those two groups (`agent-cube-*`,
`star-sway*`, `cosmic-drift-*`, `value-foil-drift`, `value-glint`,
`action-beat`, `check-draw`, `dash-draw`, `dot-pop`, `ds-sweep`, `ds-travel`)
is unchanged.

Every value was re-verified against `styles/motion.css`. Machine-readable
source: `lib/motion-names.ts`. Flutter parity: `docs/contracts/flutter-web-foundation-parity.md`
§8.

### Verified breaking migrations

Consumers of the previous system will break, by design, on:

- Any class name from the retired-role table above (`check:refs` catches it).
- The uppercase text-transform previously applied by several type roles —
  removed; a component that relied on a role for case must now apply it
  itself.
- `text-xs`/`text-sm`/`text-base`/`text-lg` size identities listed above.
- Any import of the removed Redaction font.
- Any class name from the motion rename above (`anim-jelly-in`, `anim-unfold`,
  `--duration-jelly`, `--ease-spring`, and the rest of the retired names) —
  `check:tokens`' `retired-motion-name` rule catches it.
