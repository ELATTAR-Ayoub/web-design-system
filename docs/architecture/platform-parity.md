# Platform parity — how the web system tracks Flutter

**Authority:** Flutter `0.0.3` / `7c17ecdd9eb1db1025aa47de224b67d81844b32c`

Two libraries, one vocabulary, two native implementations. This document says
what "parity" means here, what it deliberately does not mean, and which
mechanism keeps each promise.

## The rule that shapes everything else

**Mirror ownership semantics, not item count.**

Flutter's registry has 100 items. The web registry has 73. That is not a gap to
close — it is the correct answer, and closing it would mean fabricating files.
Flutter models several things as registry items that the web already has, better,
from somewhere else:

| Flutter item | Web delivery | Why not a component |
|---|---|---|
| `validation-rule` | Zod 4 + React Hook Form | The project already has both. A wrapper would add a file with no behaviour in it. |
| `safe-area` | `env(safe-area-inset-*)` utilities | A CSS capability. There is nothing for a component to do. |
| `keyframes`, `press`, `glass`, `surface`, `premium-surface`, `media-scrim`, `ambient-pattern`, `background-effect`, `feedback-surface`, `action-feedback`, `hover-builder` | Classes and tokens under `styles/`, shipped by `source-foundation` | Zero-runtime CSS is first class. A `.tsx` that forwards `className` and `children` is not a component. |
| `voice` | Browser speech and microphone modules | A browser API, not a visual component. |

A capability with no `.tsx` file is still documented, still named, still
findable at its own route. It just tells the truth about how it arrives.

### The fifth answer: composition

Two Flutter items turned out to be neither a component nor a CSS class, but a
capability this system **already has, spread across pieces that compose**. Both
decisions were made on measurement, not taste:

| Flutter item | Web equivalent | The evidence |
|---|---|---|
| `selection-control` | `Field` + `Checkbox` / `Radio` / `Switch` | `Field` already exports `FieldLabel`, `FieldTitle`, `FieldDescription`, `FieldError`, `FieldSet`, `FieldLegend` and `FieldGroup` — exactly the row anatomy `SelectionControl` centralises. The three controls are 65–77 lines each because they render only the control. |
| `menu` | `DropdownMenu` / `ContextMenu` / `Menubar` | Comparing every class string of 80+ characters across the three files finds **zero** shared by all three, and zero shared even by the closest pair. There is no common body to hoist; there are three similar components, each tuned. |

Building either would give the system a second way to do something it already
does once — and in the menu's case, hoisting a "shared" body would mean changing
three working, separately-tested components to share something they do not.
Both are documented under their shared names, and their pages name the
components to compose. `scripts/check-platform-parity.mjs` fails if either ever
appears as a registry item.

## What is actually shared

**Names.** The canonical kebab-case name is the registry item, the documentation
slug, the route segment and the contract key. One name, four uses, no mapping
table.

**Ownership.** 75 installable owners, 29 dependency items, one block
(`agent-workspace`), one foundation (`source-foundation`) — the same shape as
Flutter's inventory. Agent sub-parts are dependencies of the block, not eleven
separately advertised products.

**Typography.** All seventeen roles, at all three widths, exactly. This is the
one place where a number is copied rather than translated, and
`test/foundation/typography-contract.test.ts` asserts every one of them against
`lib/ds/platform-contract.ts`.

**Behaviour contracts.** Disabled reason and recovery, form error reveal, the
agent workspace's public surface. Same intent, same states, browser-native
mechanism.

## What is deliberately web-only

`direction`, `label`, `prose`, `reveal-bloom`, `use-latest`, `use-mobile`,
`use-reduced-motion`. Seven platform capabilities with no Flutter counterpart
and no need for one. They are listed as `origin: "web-only"` in the contract so
they are visible as exceptions rather than looking like drift.

`reveal-bloom` is the newest, and it arrived by being un-hidden rather than
built: the two radial glows `bloom-action` and `bloom-value` had been documented
under `background-effect`, which is Flutter's name for the page atmosphere. Two
unrelated things under one slug, and the contract green because it compares
names. The per-capability audit compared what each side's source does; the
atmosphere kept Flutter's name and the glows got their own.

## The five mechanisms that keep this true

**1. `lib/ds/platform-contract.ts` — the specification.**
Names, ownership, delivery, family, the typography matrix, the renames, the
removals. It is a specification, not a presentation source: nothing reads it at
render time, and a number in it is an assertion target. It is the checked-in
record of what the pinned Flutter snapshot said, which is why the parity check
does not need a copy of the Flutter repository to run.

**2. `scripts/check-platform-parity.mjs` — the drift detector.**
Fails on a stale name, a removed item that still ships, an unresolvable or
self-referential registry dependency, generated output that disagrees with the
authored catalog, a documentation entry with no contract row, a type role that
lost a breakpoint step, a media query reappearing in `typeset.css`, and a
renderer-specific name leaking out of the agent barrel.

**3. `scripts/check-tokens.mjs` — zero hardcoding, with no way out.**
Repository-wide. **No allowlist, no exempt directory, no file exemption, and no
suppression marker** — the `allow-hardcoded` escape hatch was removed, along with
the four uses of it, each of which turned out to be fixable. The argument for
keeping an escape hatch is that an inescapable rule gets deleted instead of
followed; the answer is that deleting this guard is a visible diff, and a
suppression marker is invisible by design.

**4. `docs/contracts/audit/` + `scripts/check-audit.mjs` — the per-capability
read.**
One checked-in JSON per capability, recording what the Flutter 0.0.3 Dart
source declares and what the web source declares, across six dimensions:
anatomy, API, states, disabled, interaction, semantics. These are the ledger
columns no assertion here can measure, and they are exactly the shape of work
that gets ticked from memory — so the validator refuses a verdict that does not
quote the extract it was read from, and refuses placeholder prose. It does
**not** read the Flutter repository: CI has no checkout of one, and the audit's
output is the artefact, not the join that produced it.

**5. `lib/ds/docs/catalog.ts` — one list behind every view.**
Routes, search, the navigation rail, the family views and the `/components`
index all read it. The four families — Components, Effects, Agent, Charts — are
computed from the contract, not authored separately. `lib/ds/nav.ts` derives its
component entries from the catalog rather than restating them, which is what
stops the navigation tree and the component list disagreeing.

## Where a page's facts come from

No documentation page authors its own eyebrow, title, install command, or table
of contents. Each is derived:

| Fact | Source |
|---|---|
| Family eyebrow | the contract's `family` |
| Title | the contract's `title` |
| Hero description | the item's `meta.ts`, read once and reused by nav and search |
| Install instruction | the contract's `ownership` + `delivery`, and `public/r/commands.json` |
| Table of contents | the page's own declared sections, via `tocFor` |
| Exports and source path | read from the module itself |

That list is the answer to a specific failure: ninety-nine pages used to type
their own eyebrow, and between them claimed eight different taxonomies for four
actual families.

## The capability that had no web implementation

`media-scrim` was the last contract row with nothing behind it. Flutter's is a
bottom-up gradient over media so overlaid copy stays readable; the web had a
`--scrim` token and a `bg-scrim` utility, but that is a flat panel dim
(`chat-history.tsx` uses it behind a drawer) — the same word for a different
capability. The audit kept the gap open rather than letting the row close
quietly, and the web half now exists: `media-scrim` in `styles/utilities.css`,
four theme-independent tokens copied from Flutter's `MediaScrimTokens`, and a
documented route.

**And one that was wrongly declared missing.** `ambient-pattern` was deleted on
the grounds that nothing under `styles/` implemented it. Nothing does — *under
that name*. The class is `.starfield`, `components/ui/alert.tsx` has always
mounted it, and Flutter's own `ambient_pattern.dart` says so in its first line,
citing the web stylesheet as the source it was ported from. The search was for
what the item is CALLED, not what the class is NAMED.

The rule that follows: **read the Flutter side's own doc comment before
concluding a capability is absent.** It usually records the web class it was
ported from, because most of this system went the other way first.

## How the ledger's evidence is produced

`docs/contracts/component-convergence-ledger.md` is generated from things that
were run, never from recollection:

| Source | What it establishes |
|---|---|
| `scripts/check-platform-parity.mjs` | canonical name and registry ownership |
| `scripts/check-tokens.mjs` | the zero-hardcoding scan, repository-wide |
| `e2e/ledger-evidence.spec.ts` | every documented route opened in a browser and measured: reflow at 375/768/1440, 200% text zoom, RTL, both themes, the console, and whether the table of contents still matches the declared sections |
| the unit suite | which components have focused tests, and which of those run axe |
| `docs/contracts/audit/<name>.json` | what the Flutter widget and the web module each declare, dimension by dimension |

The browser pass seeds next-themes' own storage key rather than setting
Playwright's `colorScheme`, and then asserts the class landed — because
`ThemeProvider` pins `defaultTheme="dark"`, so `colorScheme` alone measures dark
mode twice at different pixel sizes.

It earned its place immediately: it found the `chart` page pushing 487px inside
a 375px viewport, because that one page hand-rolled a `<pre><code>` instead of
composing the kit's `CodeBlock` and so had no `overflow-x`. The reflow check is
now an assertion rather than a recording.

## What parity does not claim

A green `npm run verify` proves the code compiles, every token resolves, the
catalog and registry agree, and the assertions that exist pass. It does **not**
prove a component's states are complete, that its disabled path explains itself,
that it survives 200% zoom, or that its documentation describes what it actually
does.

Those are read one component at a time, and
`docs/contracts/component-convergence-ledger.md` is where that reading is
recorded — including, honestly, how much of it is still outstanding.
