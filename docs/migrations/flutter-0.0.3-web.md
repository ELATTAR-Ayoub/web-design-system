# Migrating to the Flutter 0.0.3 shared vocabulary

**Authority:** Flutter `0.0.3` / `7c17ecdd9eb1db1025aa47de224b67d81844b32c`
**Applies to:** the web design system in this repository.

Every change below is a clean break. There are no aliases, no deprecated
re-exports, and no compatibility shims: an old name does not resolve, and that
is deliberate. A shim would let two names for one thing live side by side, which
is the drift this migration exists to remove.

## 1. Renamed registry items and imports

| Old | New | What to change |
|---|---|---|
| `@elattar/nav-user` | `@elattar/user-menu` | Install command, and `@/components/ui/nav-user` → `@/components/ui/user-menu`. |
| `NavUser`, `NavUserItem` | `UserMenu`, `UserMenuItem` | Every import and usage. |
| `@elattar/sliding-indicator` | `@elattar/active-indicator` | Install command, and `@/components/ui/sliding-indicator` → `@/components/ui/active-indicator`. |
| `SlidingIndicator`, `useSlidingIndicator` | `ActiveIndicator`, `useActiveIndicator` | Every import and usage. Behaviour is unchanged — it still measures and follows the active element's layout box. |
| `@elattar/sonner` | `@elattar/toaster` | Install command, and `@/components/ui/sonner` → `@/components/ui/toaster`. |
| `@elattar/radio-group` | `@elattar/radio` | Install command, and `@/components/ui/radio-group` → `@/components/ui/radio`. The compound exports (`RadioGroup`, `RadioGroupItem`) keep their names — those are idiomatic Radix composition, and only the capability was misnamed. |
| `@elattar/foundation` | `@elattar/source-foundation` | Install command, and every `registryDependencies` entry. |

`sonner` remains the underlying npm package. What changed is that the design
system stopped presenting a third-party library's name as its own public
component.

## 2. Renamed agent exports

The agent console's public vocabulary no longer names its renderers. The cube
and the orb are implementations; a caller that imported them was writing against
a rendering decision, which made replacing that decision a breaking change.

| Old | New |
|---|---|
| `CubeAvatar` | `AgentAvatar` |
| `Orb` | `VoiceIndicator` |
| `OrbState` | `VoiceIndicatorState` |
| `Composer` | `AgentComposer` |
| `SlashPalette` | `AgentSlashPalette` |

**Removed from the public barrel entirely:** `CubeScene`, `Cube`, `Scene`,
`sceneFor`, and the cube's per-frame helpers. They are renderer internals. To
supply a different face, implement `AvatarRenderer` — that is the seam, and it
is unchanged.

## 3. Removed items

| Removed | Why | What to do instead |
|---|---|---|
| `@elattar/site-chrome` | Product composition, not reusable vocabulary. Flutter has no site family, and this repository's own rules say there is no product family inside `ui/`. | Compose from base components, or copy the source out of git history. |
| `@elattar/site-layout` | As above. | As above. |
| `@elattar/site-reading-nav` | As above. | As above. |
| `@elattar/site-sections` | As above. | As above. |
| `@elattar/use-replay-on-state-change` | Became private to `ContentChange`. | `import { ContentChange } from "@/components/ui/content-change"`. The lower-level `useReplayOnStateChange` is still exported from that module for the case `ContentChange`'s keyed API does not fit — a Radix-owned `data-state` mutation rather than a value you hold. |

## 4. New items

| New | Delivery | Notes |
|---|---|---|
| `@elattar/disabled` | React (dependency) | The shared disabled reason and recovery contract. Native `disabled` stays native — this wraps a control to explain *why* it is unavailable, reachable by keyboard and touch. Do not wrap every disabled control; most need no reason. |
| `@elattar/content-change` | React | Replays an entrance when keyed content changes, with a reduced-motion path that loses no information. |
| `media-scrim` | CSS (in `source-foundation`) | A bottom-up readability ramp over media, theme-independent. Flutter had it and the web did not; the numbers are `MediaScrimTokens`, copied rather than tuned. |
| `reveal-bloom` | CSS (in `source-foundation`) | Not new code — `bloom-action` and `bloom-value` had shipped for a long time under the `background-effect` page. They are web-only and now carry their own name; `background-effect` is the page atmosphere, as it is on Flutter. |

### 4a. Behaviour added to existing items

Every item-shaped control — `ComboboxItem`, `CommandItem`, the three menus'
items, `RadioGroupItem`, `SelectItem`, `SelectTrigger`, the questionnaire choice,
the agent `WelcomeCard` rows and `MicControl` — takes `disabledReason?: string`.
That is Flutter's shared vocabulary (`Disabled.reason` on every item widget),
routed through `@elattar/disabled`: an always-on `aria-describedby` and a
click/tap-reachable info affordance beside the control, without disturbing the
row's own keyboard semantics. No reason given, no wrapper rendered — the
common case is byte-identical to before.

`ComboboxItem`, `CommandItem`, the combobox trigger and clear button now meet the
44px target floor (`--size-target-min`); the label stays centred at the same
size, only the row grows. `Badge` is flat — no gradient, no shadow — following
Flutter 0.0.3. The alert and toast bloom no longer multiplies in light mode; it
is painted straight at 0.9, following `FeedbackSurface.blendFor`. The `press`
family answers `[data-pressed]` beside `:active` so a host can give keyboard
users the same feel. The tooltip opens on touch. The navigation-menu indicator
travels to the open trigger. The slash palette's `option`s are owned by a
`group` rather than by list items, and its `scrollIntoView` follows the row.

## 5. Typography — every size changed

All seventeen roles moved to Flutter 0.0.3's scale, and all seventeen are now
responsive at both breakpoints. Eight roles that used to hold one size at every
width now step; every role's phone size is smaller than the size it used to have
everywhere. The full table is in `RULES.md` §2 and, as data, in
`lib/ds/platform-contract.ts`.

**What this means for a consumer:** if you rely on a specific rendered size,
re-measure. `text-xs`, `text-sm`, `text-base` and `text-lg` still alias the
system's roles, but they are now responsive too — `text-sm` is 12px on a phone
and 14px on a desktop, where before it was 14px everywhere.

**If you overrode a size:** you probably no longer need to. The old scale was
large at small widths, which is what most overrides were compensating for.

## 6. Documentation routes

Every capability now has its own route at
`/design-system/components/<canonical-kebab-name>` — the same name as its
registry item. The broad category pages (`/design-system/components/base/forms`
and siblings) survive as indexes and galleries; they are no longer where a
component is documented.

`/design-system/components/site` and every page under it are gone.

## 6a. The documentation shell

The shell was rebuilt to the structure of the live Flutter reference. The
**layout** was copied; none of the content was, and no Dart appears anywhere in
a web page — every specimen mounts the real React component and every code
sample is read from the web source.

- A sticky global header carrying the Elattar mark and exactly four
  destinations: **Documentation, Components, Charts, Agent**. Everything else a
  reader can reach lives in the rail, because listing Introduction and
  Installation beside Documentation puts a section and its own children on the
  same level.
- **Catalog search** at `⌘K`, over `lib/ds/docs/catalog.ts` plus the authored
  section routes. There is no search index: a second, hand-maintained list is
  how a result comes to 404.
- **Light / System / Dark** as a three-way control. A two-way switch cannot
  express "follow the platform".
- **One stable grouped rail**, identical on every route: Sections,
  Foundations, Components, Effects, Agent, Charts. It scrolls independently of
  the article and reveals its selected row without moving the article.
- Breadcrumb, derived family eyebrow, title and the catalog's one description,
  in that order, none of which a page can type.
- **Three shapes, two outlines.** Below `lg`: the article alone, with the
  outline as a horizontal anchor strip. `lg` to `xl`: the left rail joins it.
  `xl` and up: the sticky `ON THIS PAGE` rail replaces the strip and nests one
  level under a section whose blocks declare anchors.
- **One shared Preview/Code control** above one stage, per specimen. Each
  showcase owns its own selection; the code replaces the preview in the same
  frame rather than stacking below it, and is capped and scrollable.

`app/design-system/components/base/**` and the six `agent/*` category pages are
gone. Every capability is documented at its own route; the only survivors are
three deliberate landings — the complete components index, and one each for
Charts and Agent, both derived from the catalog.

### The page after the Preview

A component page opens on its Preview — an interactive showcase of the
component doing its job, in the scene it lives in — on a stage with a floor of
`--height-doc-stage` (640px) that centres its content. The sections run in one
order whatever the page declared (`lib/ds/docs/section-order.ts`): Preview,
Installation, Variants, States, Sizes, Examples, Usage, then the reference
material. Installation, Variants, Sizes, Examples and Usage stand open; States
and the reference sections — API, Accessibility, Keyboard, Responsive, Source —
are **closed** `<details>` the reader opens, the summary being the heading. Find-in-page still reaches the
content and opens the section around a match; a link to `#api` opens that
section; **Expand all** in the anchor strip opens everything and remembers.
`components/docs/component-page/doc-section.tsx` says why it is native and not
a React collapsible. The browser suite sets the expand-all preference through
`playwright.config.ts` so its specs keep reaching into States and Examples;
`e2e/doc-sections.spec.ts` pins the closed default with that preference off.

## 7. Install-command honesty

A documentation page now prints an install command only when one genuinely
exists. Four different answers are possible, and each page gives the true one:

- a **direct install target** prints its real generated command;
- a **dependency** says which owner brings it, and prints nothing to run;
- a **CSS capability** points at `@elattar/source-foundation`, which ships the
  stylesheet that defines it;
- a **package or browser capability** explains that there is nothing to install.

If you scripted against documentation pages to discover install commands, read
`public/r/commands.json` instead. It is generated, and it is the only place a
command is authored.

## 8. Capabilities with no web implementation

None, as of this migration. There were two candidates and both were wrong in
different ways.

**`media-scrim`** genuinely had no implementation for most of the convergence:
Flutter's is a bottom-up gradient over media so overlaid copy stays readable,
and the web's `--scrim` token was a flat panel dim — the same word for a
different capability. The per-capability audit kept the row open until the
web half existed. It now does: `media-scrim` in `styles/utilities.css`, four
theme-independent tokens copied from Flutter's `MediaScrimTokens`, and a page
at `/design-system/components/media-scrim`.

**`ambient-pattern` was briefly recorded as missing. That was wrong.** It is
implemented, as `.starfield`, and `components/ui/alert.tsx` mounts it. It was
declared missing by a search for the item's NAME rather than the class's. If
you are auditing for a missing capability, read the Flutter side's own doc
comment first — most of these were ported from the web, and the Dart file
usually names the class it came from.

## 9. Verifying your own migration

```bash
npm run check:parity
```

It fails on a stale name, an unresolvable registry dependency, an item that
depends on itself, a generated catalog that disagrees with the authored one, a
type role that lost a breakpoint step, and a renderer name leaking out of the
agent barrel.
