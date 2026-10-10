# Flutter 0.0.3 -> Web Convergence Audit

**Audit date:** 2026-09-10  
**Flutter authority:** `D:\DESIGN\Design-System-2026-8\flutter-design-system`  
**Flutter snapshot:** package/registry `0.0.3`, commit `7c17ecdd9eb1db1025aa47de224b67d81844b32c`  
**Web target:** `D:\DESIGN\Design-System-2026-8\design-system`

This audit supersedes every comparison made before Flutter `0.0.3`. It was
rebuilt from the current Flutter source, generated registry, inventory, public
barrel, tests, and foundation files; it does not carry forward the old plan's
component counts, ownership assumptions, or typography values.

## Executive finding

The two libraries still share the same visual foundation, but the web library
is not yet on the current Flutter architecture and behavior contract.

- Colour, layout dimensions, spacing, radii, core elevation, icon semantics,
  and shared motion values are substantially aligned.
- Web naming is behind five clean Flutter renames.
- Web typography is behind all 17 roles. Flutter now gives every role phone,
  tablet, and desktop values and uses a materially smaller scale than the old
  web plan.
- Flutter introduced a coherent disabled/recovery model and form-error reveal
  behavior that the web library does not yet have.
- Many apparent Flutter-only components already exist on web as CSS, browser,
  Zod, or React Hook Form capabilities. They must be mapped and documented, not
  recreated as fake React components.
- Flutter agent pieces are dependency-classified registry items. Only
  `agent-console` is the complete block. The former plan's requirement to make
  every agent part independently installable was incorrect.
- The web-only public `site` family has no Flutter counterpart and is product or
  documentation composition, not reusable design-system vocabulary.

## Evidence baseline

### Flutter

- Generated registry: 100 items — 98 components, 1 block, 1 foundation.
- Ownership inventory: 69 installable owners, 29 dependency-classified items,
  and 3 bundled source files.
- Generated registry source hash check: 116 files checked, 0 failures.
- Test inventory: 219 Dart test files and approximately 3,172 `test` or
  `testWidgets` declarations.
- The Flutter test suite was not executed during this read-only audit.
- The only observed Flutter worktree entry was an untracked `.tmp/` directory.

### Web

- Root registry: 76 items — 67 UI, 5 blocks, 3 hooks, 1 style.
- `npm run verify:fast`: passed.
- Token scan: 251 files clean.
- Reference scan: 251 files clean.
- Typecheck: passed.
- Lint: 0 errors, 6 warnings.
- Unit tests: 53 files passed; 1,211 tests passed and 1 skipped.
- The previously observed Calendar timeout does not reproduce on this baseline.
- JSDOM emitted non-failing canvas, pseudo-style, and `scrollTo` limitations.

## Registry and naming comparison

There are 60 exact shared item names, 40 Flutter-only names, and 16 web-only
names. Raw set difference overstates the real gap because Flutter's registry
models dependencies and platform adapters as items while web often gets the
same behavior from CSS or JavaScript packages.

### Required clean renames

| Current web | Current Flutter/shared name | Finding |
|---|---|---|
| `nav-user` | `user-menu` | Same public role; web is stale. |
| `sliding-indicator` | `active-indicator` | Same behavior; Flutter name describes intent. |
| `sonner` | `toaster` | Sonner is a web dependency, not the public component name. |
| `radio-group` item | `radio` | Compound React exports may remain; registry capability should be `radio`. |
| `foundation` | `source-foundation` | Registry source name is stale on web. |

`icon` and `icon-swap` already exist in web source. They are merely bundled
inside the current web foundation entry instead of receiving Flutter-equivalent
registry ownership.

### Intentional platform mappings

These are not missing React components:

| Flutter item | Correct web equivalent |
|---|---|
| `validation-rule` | Zod 4 + React Hook Form validation behavior. |
| `safe-area` | CSS `env(safe-area-inset-*)` utilities. |
| `keyframes` | Named keyframes in `styles/motion.css`. |
| `press` | CSS interaction utilities and native pointer/keyboard semantics. |
| `hover-builder` | CSS hover/media-query behavior unless runtime state is genuinely required. |
| `action-feedback` | Existing tokenized sheen/bloom/press utilities plus a small API only if composition needs one. |
| `voice` | Browser speech/microphone service modules, not a visual component. |

`direction`, `label`, `prose`, `use-latest`, `use-mobile`, and
`use-reduced-motion` are legitimate web-only platform capabilities. They should
remain explicit exceptions. `use-replay-on-state-change` should become private
to `ContentChange` unless an independent consumer use case is demonstrated.

### Site family

`site-chrome`, `site-layout`, `site-reading-nav`, and `site-sections` are web
application compositions. Flutter has no product/site family, and the web
repository rules explicitly say there is no product family inside `ui/`.
Documentation furniture should live under `components/docs/`; examples should
live under showcases. These four entries should leave the public registry.

## Registry ownership correction

The Flutter registry does not say “100 independently installable public
components.” Its current model is:

- **69 installable owners:** the component capabilities intended as direct
  install targets.
- **29 dependency items:** sources pulled by owners or blocks, including all
  agent sub-parts and several compound internals.
- **1 block:** `agent-console`.
- **1 foundation:** `source-foundation`.

The web registry should reproduce this ownership meaning, not merely reproduce
the count. In particular, the agent dependency items should be addressable by
the registry resolver but should not be advertised as 11 separate top-level
products.

## Typography: current Flutter authority

Breakpoints are phone `<768`, tablet `768-1023`, and desktop `>=1024`. Values
are logical/CSS pixels; web implementation must use `rem` for zoom support.

| Role | Phone | Tablet | Desktop | Weight | Tracking | Face |
|---|---:|---:|---:|---:|---:|---|
| `display` | 36/40 | 42/44 | 48/48 | 600 | -0.03em | Inter |
| `h1` | 30/36 | 32/38 | 36/40 | 700 | -0.02em | Inter |
| `h2` | 26/32 | 28/34 | 30/36 | 650 | -0.015em | Inter |
| `h3` | 20/28 | 22/30 | 24/32 | 600 | -0.01em | Inter |
| `h4` | 18/24 | 19/26 | 20/28 | 600 | normal | Inter |
| `lead` | 18/28 | 19/28 | 20/28 | 400 | normal | Inter |
| `body` | 14/20 | 15/22 | 16/24 | 400 | normal | Inter |
| `small` | 12/16 | 13/18 | 14/20 | 400 | normal | Inter |
| `nav` | 12/16 | 13/18 | 14/18 | 500 | normal | Inter |
| `badge` | 10/14 | 11/14 | 12/16 | 600 | normal | Inter |
| `code` | 12/18 | 13/18 | 14/20 | 400 | normal | Geist Mono |
| `identifier` | 12/18 | 13/18 | 14/20 | 400 | -0.01em | Geist Mono |
| `number-sm` | 12/16 | 13/18 | 14/20 | 600 | -0.01em | Geist Mono |
| `number-base` | 14/20 | 15/22 | 16/24 | 600 | -0.01em | Geist Mono |
| `number-md` | 20/28 | 22/30 | 24/32 | 600 | -0.01em | Geist Mono |
| `number-lg` | 30/36 | 32/38 | 36/40 | 600 | -0.01em | Geist Mono |
| `number-xl` | 36/40 | 42/44 | 48/48 | 600 | -0.02em | Geist Mono |

Flutter has already implemented this matrix. Web still carries the older,
larger values and only makes nine roles responsive. The web migration must copy
the table exactly; it must not modify Flutter typography or revive the scale
from the superseded 2026-09-08 plan.

## Foundation comparison

### Aligned

- Semantic light/dark colour roles and action/value/state ramps.
- Shell `1680`, content `1080`, page `1200`, prose `720`, rail `240`, article
  `640`, sidebar `256`, collapsed sidebar `48`, mobile sidebar `288`.
- Radius scale `2, 6, 10, 12, 16, 20, 24, 32, 999`.
- Minimum target size `44`.
- Foundation breakpoints `640, 768, 1024, 1280`.
- Shared motion durations and core curves have no value drift.
- Curated Lucide semantic icon names are aligned; Flutter draws native paths
  while web uses Lucide React, which is the correct platform difference.

### Gaps

- Flutter defines 27 additional semantic durations. Web should add the ones
  used by shared behavior—overlay exit, expand/collapse, drawers, delayed
  overlays, menu timing, toast timing, attachment timing, copy confirmation,
  and related interactions—rather than placing raw milliseconds in components.
- Disabled opacity is inconsistent inside web (`0.45` and `0.50` both appear).
  Flutter `0.0.3` defines `0.50`. Web should standardize on the shared token.
- Flutter and web both include a curated Sparkles glyph while the web authoring
  skill broadly forbids sparkle decoration. Keep the glyph only for its
  documented reveal/reward semantic use; update guidance so availability is not
  confused with permission for generic decoration.

## New behavior gaps introduced by Flutter 0.0.3

### Disabled and recovery

Flutter now provides a system-wide `Disabled` contract with:

- `disabledReason`;
- optional disabled activation callbacks;
- stable widget structure;
- pointer blocking and unavailable cursor;
- reason presentation;
- a shared 0.50 fade;
- use across roughly 28 controls and agent/voice surfaces.

Web currently has scattered native disabled, `aria-disabled`, pointer-event,
cursor, and `opacity-45`/`opacity-50` implementations. It has no shared reason
or recovery contract. Web needs a browser-native equivalent that preserves
real `disabled` semantics on form controls while allowing a surrounding reason
surface to be focused or activated when explanation is necessary. A disabled
control itself must never be made falsely interactive.

### Form error reveal

Flutter `Form.revealFirstError()` validates, reveals messages, scrolls the first
invalid field into view, and focuses it after failed submit. Web uses React Hook
Form but has no design-system-level, tested contract for the equivalent flow.
This behavior should be added to the web Form abstraction using RHF's native
error/focus facilities and standards-based scrolling.

### Agent console

Flutter's current public console adds or clarifies:

- `onDownload` forwarding;
- pinned-scroll tolerance;
- mobile keyboard inset behavior;
- denied/unavailable/error microphone reasons;
- a disabled reason while connecting;
- current persona, model, command, tool, feature, render, approval, header,
  phase, height, voice, accent, and speed contracts.

Web already has valuable browser-specific capabilities (`speech`, `readImage`,
and `className`) and should keep them. It must add the shared download and
recovery behavior, then verify scroll pinning, viewport/keyboard response,
microphone failure semantics, history, and feature-switch parity. Internal
names such as Cube and Orb may remain private renderer names but must not define
the cross-platform public vocabulary.

## Required outcome

The migration is not a component-count exercise. It is complete when:

1. Shared public names and registry ownership match Flutter `0.0.3`.
2. All 17 web typography roles match the Flutter matrix at both boundaries.
3. Shared behavior—including disabled reasons, form error recovery, and agent
   recovery—has browser-native equivalents.
4. CSS, HTML, Zod, RHF, and browser APIs remain the implementation for the
   capabilities they handle best.
5. Web-only exceptions are explicit and tested.
6. The site family is no longer sold as public design-system inventory.
7. Registry generation, documentation, and parity checks make future drift
   visible.

### Zero-hardcoding contract

Flutter `0.0.3`'s token discipline is part of the parity target. No web
component, documentation page, showcase page, route, or example may hardcode a
design value. This includes:

- colour values or arbitrary colour utilities;
- font size, line height, weight, tracking, or font family;
- spacing, dimensions that belong to the system scale, radius, border width,
  shadow, blur, or opacity;
- animation names, keyframes, durations, delays, easing curves, springs, or
  transition timing;
- one-off Tailwind arbitrary values that bypass the design-system vocabulary.

The only authored locations allowed to define these values are
`styles/tokens.css`, `styles/typeset.css`, `styles/motion.css`, and
`styles/utilities.css`, according to their documented ownership. Components and
pages may consume semantic tokens/classes only. There is no hardcoding
allowlist, no file exemption, and no suppression mechanism. Runtime-computed
values such as measured chart coordinates are data, not authored design values;
every authored fallback, dimension, colour, type value, or motion value must
still resolve through the system contract.

### Component-by-component enforcement

Passing a repository-wide build does not prove component parity. Every direct
owner, dependency component, block, and shared CSS capability must receive an
individual contract review against Flutter `0.0.3`. For each item, record and
test:

- canonical name and registry ownership;
- purpose and anatomy;
- props, variants, sizes, and composition;
- rest, hover, focus-visible, pressed, selected/open, loading, success, error,
  disabled, empty, and unavailable states, marking only genuinely inapplicable
  states with a reason;
- mouse, keyboard, touch, focus, scroll, dismissal, and recovery behavior;
- accessible name, role, relationships, announcements, focus order, and target
  size;
- phone, tablet, desktop, RTL, text zoom, text spacing, and content overflow;
- light, dark, high-contrast/forced-colour where applicable, and reduced motion;
- exclusive use of tokens and canonical classes, with zero hardcoded design or
  animation values;
- owning documentation and focused unit/browser coverage.

The migration needs a checked-in component ledger. An item is complete only
when every applicable row is verified, not when the component merely renders.

### Documentation parity

Flutter `0.0.3` gives every generated registry item a real documentation route
and a paired metadata/page definition. Its catalog is the single flat source
used by routes, search, navigation, families, and registry documentation links.
It groups entries into four views — Components, Effects, Agent, and Charts —
without creating four competing catalogs.

Web currently groups many components into broad category pages. That is not
documentation parity. The web migration must give every final registry item,
including dependency items, CSS-native effects, foundation delivery, and
package-native mappings, a dedicated searchable route. A dependency page may
explain that it is normally installed through its owner; it must not invent a
direct-install promise.

The web documentation kit must follow Flutter's model:

- metadata: canonical name, title, one description, dependencies, exports,
  source path, family, and navigation visibility;
- declared section types for live showcase, applied effect, install/manual
  instructions, usage snippet, and prose/table disclosure;
- table of contents derived from the declared sections so links and sections
  cannot drift;
- Preview or Effect, Installation, Usage, relevant variants/examples, API
  Reference, States, Accessibility, Keyboard, Responsive, and Source;
- honest omission of an inapplicable section with the reason recorded in the
  component ledger rather than fake examples;
- exact web code, registry command/ownership, and browser behavior rather than
  copied Dart snippets;
- no hardcoded design values in documentation or specimens.

Web-only entries receive the same page quality. Shared pages follow Flutter's
taxonomy and content contract while documenting browser-native implementation
differences explicitly.

### Live documentation-shell finding

A visual review of `https://flutter.elattar.dev` on 2026-09-11 confirms that
route coverage alone is not parity. The current Flutter reference uses one
coherent documentation product:

- a sticky global header with Elattar identity, Documentation, Components,
  Charts, Agent, search, and appearance controls;
- one stable left rail across documentation pages, grouped into Sections,
  Components, Effects, Agent, and Charts, with a visible current item;
- an independently scrollable left rail that preserves its position and reveals
  the selected item after navigation;
- a centered article introduced by breadcrumb, family eyebrow, title, and one
  authoritative description;
- a sticky right rail titled `ON THIS PAGE`, including nested API destinations;
- responsive substitution of the right rail with a horizontal anchor strip
  where three columns no longer fit;
- a `Preview` / `Code` toggle for every live showcase or applied-effect stage;
- an `Installation` section with `CLI` / `Manual` modes;
- real, useful first previews with adequate stage height and code that produces
  the shown result;
- the same documentation components and hierarchy for ordinary components,
  Effects, Agent, and Charts.

The current web work still contains legacy grouped pages under
`app/design-system/components/base/**` and
`app/design-system/components/agent/**`. Those are old documentation, not the
Flutter page model. Their useful content must be migrated into canonical
per-item pages and the obsolete routes/tests must be removed. A legacy category
page must not be retained merely to satisfy an old test.

Documentation parity therefore requires a side-by-side shell and page review,
not only `docs:validate`. Header composition, both rails, responsive changes,
anchor behavior, page hierarchy, toggle behavior, specimen quality, section
depth, and the full Agent/Charts/Effects page sets all need explicit evidence.
