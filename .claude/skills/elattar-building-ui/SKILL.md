---
name: elattar-building-ui
description: Build, change, document, or review UI in Elattar's Design System. Use for pages, screens, components, forms, dashboards, profiles, styling, theming, interaction states, feedback, responsive behavior, design-system documentation, and UI reviews—including requests such as "add a component", "build the settings page", "make this look right", or "fix light mode". Follow the repository's token, accessibility, state, documentation, and verification contracts before shipping.
---

# Build UI in Elattar's Design System

Follow this workflow in order. Treat a green build as the floor: it cannot
prove that references resolve, both themes work, every state exists, or
actions give feedback. Scan
[`references/traps.md`](references/traps.md) for the failures a green build
has actually hidden here before you start.

## 1. Detect the project

Read `components.json` at the repo root.

- **Present:** it names the installed `style`, the alias map (`components`,
  `ui`, `lib`, `hooks`, `utils`), and — in this repo — a `registries` block
  (`@elattar` and `@elattar-blocks`) pointing at the local registry server.
  This is how the CLI resolves a namespaced item.
- **Absent:** this is not an initialized shadcn project. Tell the user to run
  the documented init command (`npx shadcn@latest init`, or the project's own
  installation doc at `/design-system/docs/installation`) before adding
  anything — do not hand-write `components.json` or guess an alias map.

Read `RULES.md` next — it is authoritative for colour, typography, spacing,
radius, elevation, motion, components, accessibility, content, and release
verification — and `AGENTS.md`, including its Next.js version warning. When
touching `components/agent/*`, also read `docs/agent-workspace.md` and
`lib/agent/mock-transport.ts`. When uncertain about a Next.js API, read the
matching guide under `node_modules/next/dist/docs/` before coding.

Keep three system principles in view:

- Name tokens by role, never by hue.
- Use semantic `-ink` foregrounds instead of a ramp endpoint.
- Measure rendered behavior instead of asserting it from source.

## 2. Inspect the inventory before inventing

Compare what the request needs against what is already installed:

- **`components/ui/`** — the base chassis (shadcn on Radix). See the full
  vocabulary in
  [`references/component-contracts.md`](references/component-contracts.md#public-component-vocabulary).
- **`components/agent/*`** — the product-agnostic AI chat surface.
- **`components/docs/*`** — the documentation site's own furniture: the page
  kit every component page renders through, the per-item metadata and specs,
  and the chrome the shell needs. It is PRIVATE.
  There is no public `site` family any more — its four registry blocks were
  product composition rather than reusable vocabulary, and they were removed.
  Nothing under `components/docs/` is a registry item, and nothing there
  should become one.
- The per-item routes under `app/design-system/components/<name>` and the
  registry index (`registry.json`, or `public/r/index.json` once built) —
  the same list this skill's references enumerate. Every catalog item has its
  own route; the broad category pages are indexes and galleries only.

For charts, sidebars, compound controls, transcript Markdown, native
scrollbars, constrained buttons, or new base components, read
[`references/component-contracts.md`](references/component-contracts.md)
before editing.

Keep generic shapes in `components/ui/`. Put product meaning — money,
scarcity, chance, or progression — in a product family beside `ui/`, never
inside it. Wrap a base component for product use instead of forking it.

## 3. Choose the existing component, install if missing

Prefer a component already present in `components/ui/`. If the request needs
one that is not installed, use the real, currently-supported shadcn CLI
subcommands — verify every flag against `--help` before documenting it; do
not invent one. As of `shadcn@4.16.0`:

| Command | Use |
|---|---|
| `npx shadcn info` | Print the resolved project config (style, aliases, registries) — confirms `components.json` was read correctly. |
| `npx shadcn search [registries...] -q <query> -t <type>` | Search configured registries (defaults to every registry in `components.json`) by name or item type (`ui`, `block`, `hook`). |
| `npx shadcn view <items...>` | Print an item's file contents before installing it. |
| `npx shadcn add [components...] -y -o` | Install. Accepts a bare registry item name, a namespaced reference (`@elattar/button`), or a raw URL. `--dry-run` previews without writing; `--diff [path]` / `--view [path]` inspect one file first. |
| `npx shadcn add <component> --diff` | The current way to see what a re-install would change — `npx shadcn diff` still exists but is **deprecated**; do not document it as the primary path. |
| `npx shadcn build [registry] -o <dir>` | Only relevant when changing the registry itself (`registry.json` → `public/r/`), not when consuming it. |

**The exact install command for every item in this repo's own registry is
generated, never hand-typed.** `public/r/commands.json` (built by
`npm run registry:build`, i.e. `node scripts/build-registry.mjs`) maps each
item name to the precise string that was actually run against a live
registry server during the Task 8 consumer rehearsal, for example:

```bash
npx shadcn@latest add http://127.0.0.1:3200/r/button.json
```

The same item also resolves through the namespaced alias `components.json`
declares:

```bash
npx shadcn add @elattar/button
```

Use the namespaced form for day-to-day work inside this repo (it needs no
server address); use the `commands.json` URL form when documenting an install
step for an external consumer, or when quoting a command verbatim in a
specimen — copy it from `public/r/commands.json`, never retype it. Registry
dependencies are namespaced too (`@elattar/foundation`, not bare
`foundation`) — see `references/component-contracts.md` if you are editing
the registry rather than consuming it.

## 4. Compose product UI outside `components/ui/`

Do not register a new `components/ui/` module in a barrel or registry; none
exists. Add the composition to a product family beside `ui/`
(`components/agent/*`, or a new sibling — ask where a genuinely new family
lives and what it is called; `components/docs/*` is the documentation site's
own furniture and is not a home for product UI) and wire it up in
`lib/ds/nav.ts` in step 6.

## 5. Resolve decisions that change the result

Ask only for choices that cannot be inferred safely:

- Where a new product family lives and what it is called.
- Which genuinely different variant the user means.
- Whether asynchronous sections reveal together or progressively, when both
  are plausible and materially different.

If no answer is available, choose the conservative option and report it: keep
a shape generic, and use one calm reveal rather than a stagger.

## 6. Build on the token layer

Use only tokens and named utilities defined by the system. The system is
**four files under `styles/`** — `tokens.css`, `typeset.css`, `motion.css`,
`utilities.css` — each owning one axis; `app/globals.css` is the entry point
that `@import`s them in that order and holds nothing else. Never describe
`app/globals.css` itself as the source of truth for a token, a type role, a
duration, or a utility — it is the importer, not the owner.

| Axis | Owner file | Use |
|---|---|---|
| Colour | `styles/tokens.css` | semantic roles such as `bg-action`, `bg-card`, `text-value-ink` |
| Typography | `styles/typeset.css` | one complete `.type-*` role — the public set is exactly 17: `display`, `h1`, `h2`, `h3`, `h4`, `lead`, `body`, `small`, `nav`, `badge`, `code`, `identifier`, `number-sm`, `number-base`, `number-md`, `number-lg`, `number-xl`. Faces are Inter (`--font-sans`, words) and Geist Mono (`--font-mono`, code/identifiers/figures) only. Breakpoints are 768px and 1024px; introduce no third one. |
| Spacing and radius | `styles/tokens.css` | the repository scale, including `--size-target-min` (44×44px, the interactive-target floor) |
| Motion | `styles/motion.css` | `duration-*`, `ease-*`, and named `anim-*` utilities |
| Icons | — | `Icon` or `IconSwap` with an explicit tone and accessible name |
| Shadows | `styles/tokens.css` | the shared elevation or machine-shadow ladder |
| Sanctioned utilities | `styles/utilities.css` | scroll-fade, shimmer, and the other named one-off utilities |

Never use the Lucide `Sparkles` icon. Choose a glyph that names the action or
object literally; a generic sparkle obscures meaning and makes unrelated
features look artificially special.

Do not add raw colour, font-size, tracking, radius, duration, easing,
spacing, or shadow values anywhere outside those four `styles/*.css` files.
Add a missing token there instead of using an arbitrary literal. This is
enforced: `npm run check:tokens` fails the build on any violation.

Declare the spacing relationship on the element that owns a vertical text
stack. Do not assume card padding or a distant grid gap separates nested
label, value, helper, caption, or error text.

Use one interaction utility per element. Compose different gestures on
wrapper and child elements rather than stacking transition-owning utilities.

## 7. Draw the complete state model

Before implementation, classify every state:

`rest · hover · focus-visible · pressed · loading · success · error · disabled · empty`

Read [`references/state-inventory.md`](references/state-inventory.md) for the
state obligations, skeleton rules, injectable failure seams, and feedback
component selection.

Mark an inapplicable state `N/A` with a reason. Do not invent asynchronous
states for a synchronous component. For real failure paths, expose an
injectable effect so the specimen can exercise success, failure, and delay
using the real component. Every interactive target is at least 44×44 CSS
pixels (`--size-target-min`) unless the control is inline text with an
equivalent accessible target — the 44px hit-target row pitch inside grouped
controls (checkbox/radio rows, the switch row) is a **parked owner decision**
in `docs/audits/web-component-audit.md`, not yet settled system-wide; do not
assume it is closed.

## 8. Document before verification

Ship documentation in the same change:

1. Update `lib/ds/nav.ts` first. Add a component to the existing category's
   `contents`; create a category only for a genuinely new family.
2. Render every supported state on the owning live specimen page under
   `app/design-system/components/**`. Use `components/ds/kit.tsx` instead of
   hand-rolling documentation furniture.
3. Feed `DsPageHeader` from `findCategory()` so navigation and page metadata
   cannot drift.
4. Add a reasoned rule to `RULES.md` only when the work establishes a
   reusable rule. Add or strengthen a guard when the rule is mechanically
   checkable.

Use the route returned by `categoryHref`: foundations live directly under
`app/design-system/`; base and agent categories live under their respective
`components` branches. The public documentation site itself lives under
`/design-system/docs/introduction`, `/design-system/docs/installation`,
`/design-system/docs/theming`, `/design-system/docs/typeset`,
`/design-system/docs/cli`, `/design-system/docs/registry`,
`/design-system/docs/skills`, and `/design-system/docs/changelog` — read the
relevant one before writing prose that duplicates or contradicts it.

## 9. Verify the change

While iterating, run:

```bash
npm run verify:fast
```

(`check:tokens → check:refs → check:parity → check:audit → typecheck → lint
→ test:unit`.) It is fast
enough to run after every meaningful edit, but it cannot prove a browser
behavior, a registry artifact, or a documentation route resolves.

Before claiming the work done, run the full gate:

```bash
npm run verify:full
```

(`verify:fast → registry:build → registry:validate → docs:validate → build → test:e2e`.)
This is what actually rebuilds the registry, validates the docs routes exist
and are wired into `lib/ds/nav.ts`, produces a production build, and drives
the browser suite. Neither gate substitutes for the manual checks below —
they prove the code compiles and the automated assertions hold, not that a
human would call the result correct:

1. Open the live specimen in both themes; inspect light mode deliberately.
2. Inspect the narrowest supported viewport and a normal desktop viewport.
3. Check focus-visible, keyboard behavior, reduced motion, loading, empty,
   failure, and disabled states that apply.
4. Measure contrast for new foreground/surface pairs.
5. Read the browser error log after a fresh navigation and confirm there is
   no hydration error or page overflow.

Read [`references/verify.md`](references/verify.md) for computed-style
timing, mixed-colour rasterization, guard testing, and reduced-motion
techniques — including why the **built stylesheet, not a grep of
`globals.css`, is the only authority on whether a class resolves**. Scan
[`references/traps.md`](references/traps.md) for relevant known failures
before sign-off; always read traps 1, 2, and 9, then select others by
heading.

When adding a guard, inject a violation, confirm the guard fails, remove the
violation, and confirm it passes.

## 10. Report evidence honestly

Lead with the result. Distinguish what was visually inspected from what was
measured or structurally verified. Name any check that could not be
completed. Never claim a contrast ratio that was not computed.

## Reference routing

- [`references/component-contracts.md`](references/component-contracts.md):
  read for charts, sidebars, compound controls, constrained buttons, native
  scrollbars, transcript code highlighting, base-component registration, or
  the full public component vocabulary.
- [`references/state-inventory.md`](references/state-inventory.md): read when
  a component has interaction, loading, success, failure, disabled, or empty
  behavior.
- [`references/traps.md`](references/traps.md): scan before implementation
  and sign-off; read the entries relevant to the touched code.
- [`references/verify.md`](references/verify.md): read when measuring
  rendered styles, contrast, motion, hydration, or a new guard.
