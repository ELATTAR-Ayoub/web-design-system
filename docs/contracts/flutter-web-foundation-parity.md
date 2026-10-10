# Flutter ↔ web foundation parity

One semantic foundation, two native implementations.

`elattar-design-system` (this repository) is Next.js, Tailwind v4 and CSS custom
properties. `flutter-design-system` is Dart and Flutter widgets. **Neither
consumes the other.** There is no shared build artefact, no generated token
file, and no runtime bridge: the web reads `styles/tokens.css` and the Flutter
package reads `lib/src/design_system/foundation/*.dart`, and each is the source
of truth on its own platform.

What is shared is the **semantics** — the set of roles, the ladders they are
drawn from, and the names those roles go by. This document is that mapping, and
it is the only place the two are compared. A role missing from one column is a
divergence; a value differing between the columns is a defect unless the last
column says why.

> **How to keep this true.** Read both sources when you change either. The
> contract tests under `test/foundation/` assert the web half — colours,
> geometry, icon sizes and motion — and several of them fail if a token they
> cover is absent from this table. Nothing can assert the Flutter half from
> here, so a change on that side has to be brought back by hand.

---

## 1. Colour — semantic roles

Both platforms resolve these per theme. The web declares them twice in
`styles/tokens.css` (`:root, .light` and `.dark`); Flutter builds two
`ThemeTokens` instances, `ThemeTokens.light` and `ThemeTokens.dark`.

| Semantic role | Web token / utility | Flutter symbol | Differs because |
|---|---|---|---|
| Page surface | `--background` · `bg-background` | `ThemeTokens.background` | — |
| Page text | `--foreground` · `text-foreground` | `ThemeTokens.foreground` | — |
| Container surface | `--card` · `bg-card` | `ThemeTokens.card` | — |
| Container text | `--card-foreground` | `ThemeTokens.cardForeground` | — |
| Overlay surface | `--popover` · `bg-popover` | `ThemeTokens.popover` | — |
| Overlay text | `--popover-foreground` | `ThemeTokens.popoverForeground` | — |
| Quiet fill | `--secondary` · `bg-secondary` | `ThemeTokens.secondary` | — |
| Quiet fill text | `--secondary-foreground` | `ThemeTokens.secondaryForeground` | — |
| Muted fill | `--muted` · `bg-muted` | `ThemeTokens.muted` | — |
| Secondary text | `--muted-foreground` · `text-muted-foreground` | `ThemeTokens.mutedForeground` | — |
| Hover surface | `--accent` · `bg-accent` | `ThemeTokens.accent` | — |
| Hover surface text | `--accent-foreground` | `ThemeTokens.accentForeground` | — |
| Hairline | `--border` · `border-border` | `ThemeTokens.border` | — |
| Field hairline | `--input` · `border-input` | `ThemeTokens.input` | — |
| The page's light source | `--page-glow` | `ThemeTokens.pageGlow` | Web paints it as a fixed `radial-gradient` on `body`; Flutter paints the same two stops through its own painter. Same colour, different renderer. |
| Primary fill | `--primary` · `bg-primary` | `ThemeTokens.primary` | — |
| On-primary text | `--primary-foreground` | `ThemeTokens.primaryForeground` | — |
| Focus ring | `--ring` · `ring-ring` | `ThemeTokens.ring` | — |
| Error fill | `--destructive` | `ThemeTokens.destructive` | — |
| On-error text | `--destructive-foreground` | `ThemeTokens.destructiveForeground` | — |
| Tinted message bubble | `--bubble-tinted` | `ThemeTokens.messageAccent` | Named for the surface on the web and for the component on Flutter. Same derivation: `oklch()` off `--primary`. |
| Tinted bubble, hovered | `--bubble-tinted-hover` | `ThemeTokens.messageAccentHover` | as above |
| Container corner default | `--radius` | `ThemeTokens.radius` | Both resolve to 10px in both themes — numerically the `md` rung. |
| Console dim | `--scrim` | `ThemeTokens.scrim` | — |
| Agent accent | `--agent` · `text-agent` | `ThemeTokens.agentAccent` | — |
| Agent surface | `--agent-muted` · `bg-agent-muted` | `ThemeTokens.agentAccentMuted` | — |
| Avatar cube faces | `--agent-cube-*` (12 keys) | `ThemeTokens.cube` (`AgentCubeTokens`) | Web spends twelve flat custom properties because CSS has no record type; Flutter groups them into one object. Same twelve values. |

### 1.1 The `-ink` contract

RULES §1.3: **only `-ink` may carry text, and it is a different shade in each
theme.** Both platforms implement it as a per-theme resolution, and the Flutter
names end in `Text` where the web names end in `-ink` — the same claim in two
vocabularies.

| Semantic role | Web token / utility | Flutter symbol | Differs because |
|---|---|---|---|
| Action, as text | `--action-ink` / `--color-action-ink` · `text-action-ink` | `ThemeTokens.actionText` | — |
| Value, as text | `--value-ink` / `--color-value-ink` · `text-value-ink` | `ThemeTokens.premiumText` | Flutter names the role `premium`; the web names the ramp `value`. One rename, recorded rather than reconciled — renaming either side would touch every call site on that platform for no semantic gain. |
| Success, as text | `--success-ink` / `--color-success-ink` · `text-success-ink` | `ThemeTokens.successText` | — |
| Warning, as text | `--warning-ink` / `--color-warning-ink` · `text-warning-ink` | `ThemeTokens.warningText` | — |
| Info, as text | `--info-ink` / `--color-info-ink` · `text-info-ink` | `ThemeTokens.infoText` | — |
| Destructive, as text | `--destructive-ink` / `--color-destructive-ink` · `text-destructive-ink` | `ThemeTokens.destructiveText` | — |

The web carries **two** custom properties per role because Tailwind needs a
`--color-*` key to generate the utility, and the `@theme inline` block cannot
also be the per-theme answer. Flutter needs one field. That is a framework
difference, not a semantic one.

### 1.2 The brand ramps — theme-independent

A blue is a blue whichever surface it lands on, so these are declared once on
both platforms. The web puts them in `@theme static`; Flutter puts them on
`Palette`.

| Semantic role | Web token | Flutter symbol | Differs because |
|---|---|---|---|
| Action, lifted end | `--color-action-bright` | `Palette.actionBright` | — |
| Action, the fill | `--color-action` | `Palette.action` | — |
| Action, deep end | `--color-action-dark` | `Palette.actionDark` | — |
| Value, lifted end | `--color-value-bright` | `Palette.valueBright` | — |
| Value, the fill | `--color-value` | `Palette.value` | — |
| Value, deep end | `--color-value-dark` | `Palette.valueDark` | — |
| Ink on the value foil | `--color-value-foreground` | `Palette.valueForeground` | The one foreground that does **not** flip with the theme, on both platforms — the foil is an opaque ramp and is the same lime on paper as on black (trap 3). |
| Success hue | `--color-success` | `Palette.success` | — |
| Warning hue | `--color-warning` | `Palette.warning` | — |
| Info hue | `--color-info` | `Palette.info` | — |
| Success, deep | `--color-success-deep` | `Palette.successDeep` | — |
| Warning, deep | `--color-warning-deep` | `Palette.warningDeep` | — |
| Info, deep | `--color-info-deep` | `Palette.infoDeep` | — |
| Destructive, lifted | `--color-destructive-lifted` | `Palette.destructiveLifted` | — |
| Destructive, deep | `--color-destructive-deep` | `Palette.destructiveDeep` | — |

**Both ramps are named for their role, never their hue**, on both platforms.
`test/foundation/color-contract.test.ts` fails the web build on a `--color-*`
key named for a colour.

### 1.3 Charts, sidebar and atmosphere

| Semantic role | Web token | Flutter symbol |
|---|---|---|
| Chart marks 1–5 | `--chart-1` … `--chart-5` | `ThemeTokens.chart1` … `chart5` |
| Sidebar surface | `--sidebar` | `ThemeTokens.sidebar` |
| Sidebar text | `--sidebar-foreground` | `ThemeTokens.sidebarForeground` |
| Sidebar primary | `--sidebar-primary` | `ThemeTokens.sidebarPrimary` |
| Sidebar on-primary | `--sidebar-primary-foreground` | `ThemeTokens.sidebarPrimaryForeground` |
| Sidebar hover | `--sidebar-accent` | `ThemeTokens.sidebarAccent` |
| Sidebar hover text | `--sidebar-accent-foreground` | `ThemeTokens.sidebarAccentForeground` |
| Sidebar hairline | `--sidebar-border` | `ThemeTokens.sidebarBorder` |
| Sidebar ring | `--sidebar-ring` | `ThemeTokens.sidebarRing` |
| Bloom identity colour | `--bloom-void` | `ThemeTokens.bloomVoid` |
| Bloom lightness ×, chroma × | `--bloom-l`, `--bloom-c` | `ThemeTokens.bloomL`, `bloomC` |
| Bloom core lift, core chroma × | `--bloom-lift`, `--bloom-hot-c` | `ThemeTokens.bloomLift`, `bloomHotC` |
| Star halo radius | `--star-glow-size` | `ThemeTokens.starGlowSize` |
| Star halo strength | `--star-glow` | `ThemeTokens.starGlowMix` | 

**`--star-glow` is the one row where the two carry different types.** The web
declares a whole colour — flat white at half alpha on dark, and
`color-mix(in oklab, var(--bloom-2) 85%, transparent)` on light, because
`--bloom-2` exists only on the host element. Flutter can only flatten the
**strength** into a theme, and resolves the hue in `AmbientPattern.glowFor`.
Same design, split at a different seam.

---

## 2. Spacing

| Semantic role | Web token / utility | Flutter symbol | Differs because |
|---|---|---|---|
| The base unit | `--spacing` (Tailwind's 0.25rem, never redeclared) | `space(num n)` | Web multiplies in `calc()` inside a utility class; Flutter multiplies in Dart. `gap-6` and `space(6)` are both 24px. |
| The 8-point ladder | `gap-1 … gap-20` → 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80 | `space(1) … space(20)` | Neither platform enumerates the ladder as named constants: it is the base times an integer on both. RULES §3 is the enumeration. |
| Half-steps inside a component | `gap-0.5 / 1.5 / 2.5 / 3.5` → 2 · 6 · 10 · 14 | `space(0.5)` … | `space()` takes `num`, so the fractional steps fall out for free. |
| Hairline width | `border` (1px) | `BorderWidths.hairline` | Web inherits Tailwind's default; Flutter has to name it to draw it. |
| Focus ring stroke | `ring-3` | `BorderWidths.focusRing` | — |
| Focus ring offset | `outline-offset: 2px` (`@layer base`) | `BorderWidths.focusRingOffset` | — |
| Anchored-heading clearance | `--scroll-offset` | `ScrollOffsets.anchoredHeading` | Same arithmetic: header height + one 32px step. |

**Web-only:** `--scroll-offset` is spent by `scroll-padding-block-start` on
`html`, a document-level affordance with no Flutter equivalent — scrolling to an
anchor is a browser behaviour.

---

## 3. Radius

The one axis where both platforms hold the same numbers under the same names.
`test/foundation/spacing-radius.test.ts` asserts every rung.

| Rung | Web token / utility | Flutter symbol | px |
|---|---|---|---:|
| xs | `--radius-xs` · `rounded-xs` | `Radii.xs` | 2 |
| sm | `--radius-sm` · `rounded-sm` | `Radii.sm` | 6 |
| md | `--radius-md` · `rounded-md` | `Radii.md` | 10 |
| lg | `--radius-lg` · `rounded-lg` | `Radii.lg` | 12 |
| xl | `--radius-xl` · `rounded-xl` | `Radii.xl` | 16 |
| 2xl | `--radius-2xl` · `rounded-2xl` | `Radii.xl2` | 20 |
| 3xl | `--radius-3xl` · `rounded-3xl` | `Radii.xl3` | 24 |
| 4xl | `--radius-4xl` · `rounded-4xl` | `Radii.xl4` | 32 |
| pill | `--radius-pill` · `rounded-pill` | `Radii.full` | 999 |

**Differs because:** the Flutter names spell `2xl`/`3xl`/`4xl` as `xl2`/`xl3`/
`xl4` — a Dart identifier cannot begin with a digit. The rename is a language
constraint and must never reach rendered copy.

The addon-button corner, `calc(var(--radius) - 3px)` = 7px, is
`Radii.addonButton` — a derived getter on both sides rather than a rung,
because the relationship is the point.

---

## 4. Measures

| Semantic role | Web token | Flutter symbol | px |
|---|---|---|---:|
| Documentation shell | `--width-shell` | `LayoutWidths.shell` | 1680 |
| Documentation column | `--width-content` | `LayoutWidths.content` | 1080 |
| Customer-facing page cap | `--width-page` | `LayoutWidths.page` | 1200 |
| Plain-prose column | `--width-prose` | `LayoutWidths.prose` | 720 |
| Reading rail | `--width-rail` | `LayoutWidths.rail` | 240 |
| App sidebar | `--width-sidebar` | `LayoutWidths.sidebar` | 256 |
| App sidebar, mobile sheet | `--width-sidebar-mobile` | `LayoutWidths.sidebarMobile` | 288 |
| App sidebar, collapsed rail | `--width-sidebar-icon` | `LayoutWidths.sidebarCollapsed` | 48 |
| Sticky site header | `--height-site-header` | `LayoutHeights.siteHeader` | 64 |

**Differs because.** Flutter carries measures the web does not:

- **Web-only:** none of the layout measures today.
- **Flutter-only:** `LayoutWidths.article` (640) — the documentation article
  column, a measure this repository has never had a token for; `Containers.*`
  and `Blurs.*`, which transcribe Tailwind's stock `--container-*` and
  `--blur-*` ladders because Flutter has no framework defaults to inherit. The
  web simply uses `max-w-sm` / `backdrop-blur-xl` and never names them.

---

## 5. The hit-target floor

| Semantic role | Web token / utility | Flutter symbol | px |
|---|---|---|---:|
| Minimum interactive target | `--size-target-min` · `min-h-(--size-target-min)` | `TouchTargets.minimum` / `TouchTargets.minimumSize` | 44 |

**Added by this task.** The number was stated in RULES §7 and implemented in
Flutter, and the web had no token — so a control declaring its own minimum wrote
`min-h-11`, the right measurement on the 8-point scale saying nothing about why
it was eleven steps. `components/ui/questionnaire.tsx` now names the token at
all seven sites where it declares a target.

**Differs because:** Flutter applies it as a floor on the **hit test** (via
`TapTarget`), leaving layout untouched. The web applies it as `min-height`,
which does affect layout — CSS has no equivalent of expanding a hit region
without expanding the box, short of a pseudo-element or negative margin. RULES
§7 covers the negative-margin case for controls nested inside other controls.

The web's own stated exception stands on both platforms: the default `Button` is
40px so it can sit level with a 40px `Input`.

---

## 6. Elevation

Web shadows are one `--shadow-*` custom property holding the whole box-shadow
list; Flutter models each as a `ShadowStyle` of `ShadowLayer`s, because Flutter
has no box-shadow shorthand and needs inset layers painted separately. **Layer
for layer, the geometry is identical** — the Dart doc comment above each one
quotes the CSS it mirrors.

| Semantic role | Web token / utility | Flutter symbol |
|---|---|---|
| Ambient 1 | `--shadow-e1` · `shadow-e1` | `Shadows.sm` |
| Ambient 2 | `--shadow-e2` · `shadow-e2` | `Shadows.md` |
| Ambient 3 | `--shadow-e3` · `shadow-e3` | `Shadows.lg` |
| Ambient 4 | `--shadow-e4` · `shadow-e4` | `Shadows.xl` |
| Raised key | `--shadow-key` | `Shadows.keyRaised` |
| Key, travelled | `--shadow-key-down` | `Shadows.keyPressed` |
| Sunken socket | `--shadow-pressed` · `shadow-pressed` | `Shadows.inset` |
| Control | `--shadow-btn` · `shadow-btn` | `Shadows.control` |
| Control, action cast | `--shadow-btn-primary` | `Shadows.controlPrimary` |
| Control, value cast | `--shadow-btn-value` | `Shadows.controlPremium` |
| Control, pressed | `--shadow-btn-down` | `Shadows.controlPressed` |
| Chip | `--shadow-chip` · `shadow-chip` | `Shadows.compactControl` |
| Glow, action | `--shadow-glow-action` · `glow-action` | `Shadows.glowAction` |
| Glow, value | `--shadow-glow-value` · `glow-value` | `Shadows.glowValue` |
| Shadow ink 1–4 | `--ink-1` … `--ink-4` | `ThemeTokens.ink1` … `ink4` |
| Inner top highlight | `--rim` | `ThemeTokens.rim` |
| Inner top highlight, strong | `--rim-strong` | `ThemeTokens.rimStrong` |
| Key side wall | `--wall` | `ThemeTokens.wall` |

**Differs because:**

- **Naming.** The web numbers its ambient ladder `e1`–`e4`; Flutter names it
  `sm`–`xl`. Kept as-is on both sides: renaming either would touch every
  consumer for no semantic gain, and the mapping is one line each.
- **Flutter-only:** `Shadows.none`, `overlay`, `popover`, `dataTooltip`,
  `floatingPanel`. Those four are Tailwind's stock `shadow-md` / `shadow-lg` /
  `shadow-xl` / `shadow-sm` transcribed, which the web gets from the framework
  and never names. `Shadows.none` is the absence of elevation given a name so a
  widget can still say which spec it paints.
- **Opacity contracts.** `SurfaceOpacity.glassPanel`, `.disabled`,
  `.navigationGlass` are Flutter constants. The web spends the same numbers as
  Tailwind opacity modifiers (`disabled:opacity-45`, `bg-card/74`) and has no
  token for them. This is a real asymmetry and a candidate for future work on
  the web side; it is recorded here rather than fixed, because turning a
  modifier into a token changes how sixty components spell disabled.

---

## 7. Icons

| Rung | Web key (`ICON_SIZES`) | Flutter member | px |
|---|---|---|---:|
| xs | `xs` | `IconSize.xs` | 12 |
| sm | `sm` | `IconSize.sm` | 14 |
| md — the default | `md` | `IconSize.md` | 16 |
| lg | `lg` | `IconSize.lg` | 20 |
| xl | `xl` | `IconSize.xl` | 24 |
| 2xl | `2xl` | `IconSize.xl2` | 32 |
| 3xl | `3xl` | `IconSize.xl3` | 40 |

Tones map one to one — `default` / `muted` / `subtle` / `action` / `value` /
`success` / `warning` / `info` / `error` / `inherit` — with two renames forced
by Dart: `IconTone.normal` for `default` (a reserved word) and the `xl2`/`xl3`
spellings above. Every tone resolves to a token class on both platforms, and
every state tone resolves to the `-ink` end of its ramp.

**Differs because:** the web renders lucide's React components as `<svg>` and
scales `strokeWidth` with the box; Flutter embeds the path geometry
(`icon_paths.dart`) and strokes it directly. Same ladder, same optical
compensation, different renderer.

---

## 8. Motion — durations, easing, utilities and keyframes

Names on both platforms are chosen for the ROLE a duration, curve, utility or
keyframe plays, never for the feel or for a product this system used to share
code with. The web scale lives in `styles/motion.css`'
`@theme static`; Flutter's durations are `MotionDurations`, its curves
`MotionCurves`, and its animated widgets the `*Motion` family (or the bare
verb, for `expand`/`collapse`). This table — durations, easings, utilities,
then keyframes — is transcribed verbatim from `lib/motion-names.ts`, the single
machine-readable source `test/foundation/motion-names.test.ts` checks it
against.

### Durations (`--duration-*`)

| Web token | Value | Flutter symbol | Note |
|---|---:|---|---|
| `--duration-tick` | 80ms | `MotionDurations.tick` | The machine beat — a press registers in this long. |
| `--duration-fast` | 150ms | `MotionDurations.fast` | |
| `--duration-normal` | 250ms | `MotionDurations.normal` | The default; also what `--default-transition-duration` is repointed at. |
| `--duration-slow` | 400ms | `MotionDurations.slow` | |
| `--duration-overlay-enter` | 320ms | `MotionDurations.overlayEnter` | Anchored overlays — popover, tooltip, select, sheet, drawer, menus. |
| `--duration-open` | 420ms | `MotionDurations.open` | The modal entrance; longer than overlay so `--ease-emphasized`'s overshoot resolves rather than clips. |
| `--duration-bloom` | 1000ms | `MotionDurations.bloom` | Atmosphere, not feedback — an order of magnitude slower than the control scale. |
| `--duration-sway` | 44 000ms | `MotionDurations.sway` | Starfield sway. |
| `--duration-sway-alt` | 33 000ms | `MotionDurations.swayAlt` | Its companion; deliberately not a multiple of the first. |
| `--duration-state-change` | 600ms | `MotionDurations.stateChange` | Named token replacing a literal inside `anim-change`. |
| `--duration-spin` | 900ms | `MotionDurations.spin` | Named token replacing a literal inside `anim-spin`. |
| `--duration-caret` | 1000ms | `MotionDurations.caret` | Named token replacing a literal inside `anim-caret`. |
| `--duration-shimmer` | 1400ms | `MotionDurations.shimmer` | Named token replacing a literal inside `anim-shimmer`. |
| `--duration-shimmer-text` | 2600ms | `MotionDurations.shimmerText` | Named token replacing a literal inside `anim-shimmer-text`. |
| `--duration-pulse-live` | 2000ms | `MotionDurations.pulseLive` | Named token replacing a literal inside `anim-pulse`. |
| `--duration-press-in` | 40ms | `MotionDurations.pressIn` | Named token replacing the `40ms` literal on `press`'s active state. |
| `--duration-beat-hover` | 2600ms | `MotionDurations.beatHover` | Named token for `sheen-action`'s hover beat (`styles/utilities.css`). |
| `--duration-beat-press` | 620ms | `MotionDurations.beatPress` | Named token for `sheen-action`'s press beat. |
| `--duration-foil-drift` | 11 000ms | `MotionDurations.foilDrift` | Named token for `foil-value`'s drift. |
| `--duration-glint` | 5500ms | `MotionDurations.glint` | Named token for `foil-value`'s glint sweep. |
| `--duration-glint-hover` | 2400ms | — (hover speed-up; Flutter has no hover state) | The same sweep, sped up while the surface is hovered. |
| `--duration-cosmic-drift-deep` | 18 000ms | `MotionDurations.cosmicDriftDeep` | Named token for `bloom-cosmic::before`. |
| `--duration-cosmic-drift-near` | 11 000ms | `MotionDurations.cosmicDriftNear` | Named token for `bloom-cosmic::after`. |

**Differs because — the shape of the two scales is genuinely different, and
this is the axis with the most divergence.** The web names the SCALE and lets
every `@utility` spend a token; Flutter names every ANIMATION, so its
`MotionDurations` is a flat list the size of the whole utility set above —
same numbers, different place to keep them, because a Dart file has no
sanctioned-literal concept (RULES §6) the way `styles/motion.css` does.

**Flutter-only behavioural timings:** `drawerOpen` / `drawerClose` 500 (vaul's
own timing, which the web inherits from the library), `tooltipShowDelay` 200,
`hoverCardShowDelay` 700, `hoverCardHideDelay` 300 (Radix defaults on the
web), `attachmentSaving` 1600. These are library defaults on the web and have
to be restated to be reproduced on Flutter.

### Easings (`--ease-*`)

| Web token | cubic-bezier | Flutter symbol | Note |
|---|---|---|---|
| `--ease-emphasized` | 0.34, 1.56, 0.64, 1 | `MotionCurves.emphasized` | THE curve — overshoots then settles. |
| `--ease-enter` | 0.22, 1, 0.36, 1 | `MotionCurves.enter` | Anything arriving; also `--default-transition-timing-function`. |
| `--ease-exit` | 0.7, 0, 0.84, 0 | `MotionCurves.exit` | Anything leaving under its own weight. |
| `--ease-move` | 0.65, 0, 0.35, 1 | `MotionCurves.move` | Anything that loops. |
| `--ease-out-flex` | 0.05, 0.6, 0.4, 0.9 | `MotionCurves.outFlex` | Long travel that must not overshoot. |
| `--ease-settle` | 0.16, 1, 0.3, 1 | `MotionCurves.settle` | Long travel, lands soft. |
| `--ease-standard` | 0.4, 0, 0.2, 1 | `MotionCurves.standard` | The neutral curve. |

**The three Tailwind vocabulary repoints** — `--ease-in: var(--ease-exit)`,
`--ease-out: var(--ease-enter)`, `--ease-in-out: var(--ease-move)` — are
declared beside these in the same `@theme` block, exactly like
`--text-sm: var(--text-small)`. They are Tailwind's own words repointed at
ours, not a role of their own, which is why they carry no separate row above.

**Differs because:** the names are the same claim in two registers — the web
names the *direction* the Tailwind utility already used (`in`, `out`,
`in-out`), Flutter names the *intent* (`enter`, `exit`, `move`). `MotionCurves`
also carries `linear`, `balanced`, `decelerate`, `symmetric` and `vaul` — CSS
keyword curves and one library-specific curve that the web either writes as a
keyword (`linear`, which RULES §4 explicitly permits, since a constant drift
contains no easing to retune) or inherits from the library.

### Utilities (`@utility anim-*`, plus the transition utilities)

Both platforms cut to the same fourteen on 2026-09-22. A web `anim-*`
utility and its Flutter recipe carry the same name: `anim-enter` is
`EnterMotion`, `anim-open` is `OpenMotion`, and so on. The two transitions
are `Press` (scale 0.9) and `ActiveIndicator`.

| Web name | Flutter symbol |
|---|---|
| `anim-enter` | `EnterMotion` |
| `anim-exit` | `ExitMotion` |
| `anim-open` | `OpenMotion` |
| `anim-close` | `CloseMotion` |
| `anim-expand` | `ExpandMotion` |
| `anim-collapse` | `ExpandMotion (reversed)` |
| `anim-change` | `ChangeMotion` |
| `anim-spin` | `SpinMotion` |
| `anim-shimmer` | `ShimmerMotion` |
| `anim-shimmer-text` | `ShimmerMotion (textDuration)` |
| `anim-progress-indeterminate` | `ProgressMotion` |
| `anim-pulse` | `PulseMotion` |
| `anim-caret` | `CaretMotion` |
| `press` | `Press` |
| `toggle-slide` | `ActiveIndicator` |
| `swap-roll` | `SwapRollMotion` |

Every name above is verified against a real Flutter symbol — a `*Motion`
type under `lib/src/components/ui/keyframes.dart` where one exists, a
`MotionDurations` constant where the utility's only counterpart is a
duration, or `—` with a one-line reason when nothing on the Flutter side
corresponds at all. `scripts/verify-flutter-symbols.mjs` checks every one of
these against the Flutter tree; none is invented.

### Keyframes

Flutter drives animation off curves and durations, not named keyframes. The
eleven system keyframes below back the utilities above; the seven surface
keyframes are not motion vocabulary — motion.css still owns their timelines,
but they belong to one surface each (value foil/glint, the action beat, the
cosmic drift pair, the star sway pair) rather than to a shared utility.

| Web name | Flutter symbol |
|---|---|
| `ds-enter` | `EnterMotion` |
| `ds-exit` | `ExitMotion` |
| `ds-open` | `OpenMotion` |
| `ds-close` | `CloseMotion` |
| `ds-expand` | `ExpandMotion` |
| `ds-change` | `ChangeMotion` |
| `ds-spin` | `SpinMotion` |
| `ds-shimmer` | `ShimmerMotion` |
| `ds-progress-indeterminate` | `ProgressMotion` |
| `ds-pulse` | `PulseMotion` |
| `ds-caret` | `CaretMotion` |
| `value-foil-drift` | — (MotionDurations.foilDrift times it) |
| `value-glint` | — (MotionDurations.glint times it) |
| `action-beat` | — (MotionDurations.beatHover / beatPress time it) |
| `cosmic-drift-deep` | — (MotionDurations.cosmicDriftDeep times it) |
| `cosmic-drift-near` | — (MotionDurations.cosmicDriftNear times it) |
| `star-sway` | — (MotionDurations.sway times it) |
| `star-sway-alt` | — (MotionDurations.swayAlt times it) |

The avatar's 15 cube keyframes and the docs site's landing-intro / demo
keyframes (`ds-sweep`, `ds-travel`, …) are not in this table: they moved to
`components/agent/avatar/avatar.css` and `components/docs/docs-motion.css`
respectively — one component's signature and one site's decoration, never
part of the vocabulary a consumer inherits through `source-foundation`.

---

## 9. Reduced motion

Both platforms honour the OS setting globally, and neither allows information to
exist only inside an animation.

| Semantic role | Web | Flutter | Differs because |
|---|---|---|---|
| Global honouring | two `@media (prefers-reduced-motion: reduce)` blocks in `styles/motion.css` | `MediaQuery.disableAnimations` | The web's blanket rule collapses durations to 0.01ms, which freezes each animation at its **final** frame. Flutter skips the controller instead. |
| Keyframes that end invisible | the ledger above the first reduced-motion block in `styles/motion.css`, one `reduced-motion:` line per keyframe | n/a | A CSS keyframe finishing at `opacity: 0` freezes to nothing; a Flutter animation that is never run simply paints its end value, which the widget chooses. The failure mode is web-specific, so the ledger is too. |

`test/foundation/motion-contract.test.ts` fails the build on a keyframe that
ends at zero opacity and is not in that ledger.

---

## 10. Known limitations

Things both platforms inherit, measured rather than assumed. Recorded here
because a parity document that only lists agreements hides the interesting half.

### 10.1 Control boundaries in light mode are below 3:1

Every `bg-card` control — `Button variant="outline"`, `Input`, `Textarea`,
`InputGroup`, `Combobox`, `Checkbox`, `RadioGroup` — is identified in light mode
by a `--input` hairline plus a machine shadow. Rasterised from a real screenshot
of the rendered control (not from the token), the strongest boundary pixel
against the white page measures:

| Control | Strongest boundary pixel vs page | Carried by |
|---|---:|---|
| `Button variant="outline"` | **1.27:1** | `--input` hairline + `shadow-btn` |
| `Input` | **1.44:1** | `--input` hairline + `shadow-pressed` |
| `Checkbox` | **1.44:1** | `--input` hairline + `shadow-pressed` |

**This is below the 3:1 that WCAG 2.1 SC 1.4.11 asks of "visual information
required to identify user interface components".** It is recorded as an
**accepted risk**, not as a pass:

- For `Button variant="outline"` and the filled fields, the boundary is not the
  only identifier — a button carries its label, a populated field carries its
  value, and an empty one carries a placeholder at 6.04:1. The argument that
  these pass is reasonable and is the one the system has been relying on.
- For **`Checkbox` and `RadioGroup` in their unchecked state, the boundary is
  the only thing that says the control is there.** The adjacent label says what
  it would mean; it does not say a box exists to click. That is the weakest case
  in the system and the one an audit would raise first.

The fix, if the owner accepts it, is to deepen light-mode `--input` until the
rendered edge clears 3:1 — a single token, but a visible change to every field,
button and selection control on the light theme, so it is a design decision
rather than a defect fix. **Dark mode is not affected** (the same controls sit on
near-black with a lighter fill).

Flutter inherits the identical hairline and shadow specs (`ThemeTokens.input`,
`Shadows.control` / `Shadows.inset`), so the limitation is shared rather than
platform-specific — which is the reason it is written here and not only in a web
report.

### 10.2 Opacity contracts have no web token

`SurfaceOpacity.glassPanel` (0.74), `.disabled` (0.5) and `.navigationGlass`
(0.56) are Flutter constants. The web spends the same idea as Tailwind opacity
modifiers and has **no token** — and the two platforms disagree on one number:
web `disabled:opacity-45` against Flutter's `0.5`. Recorded rather than
reconciled; turning a modifier into a token changes how sixty components spell
"disabled".

### 10.3 The Flutter half of this document is not asserted by anything

Three tests under `test/foundation/` fail if a web token named in these tables
disappears. Nothing fails if a Dart symbol is renamed. A change on that side has
to be brought back by hand.

---

## 11. Breakpoints

| Rung | Web | Flutter symbol | px |
|---|---|---|---:|
| sm | `sm:` | `Breakpoints.sm` | 640 |
| md | `md:` | `Breakpoints.md` | 768 |
| lg | `lg:` | `Breakpoints.lg` | 1024 |
| xl | `xl:` | `Breakpoints.xl` | 1280 |
| 2xl | `2xl:` | — | 1536 |

**Differs because:** the web never redeclares `--breakpoint-*`, so Tailwind's
stock scale stands and there is no token to point at — the variant prefix *is*
the name. Flutter has no framework default and transcribes the four rungs it
uses. Responsive **typography** changes at 768 and 1024 and nowhere else, on
both platforms (global constraint; RULES §2).
