# Elattar's Design System — Rules

Every rule for building UI in this codebase, in one file. If you are an agent or
a developer touching this project, read this before writing a line.

Live proof of all of it: `npm run dev` → `/design-system`.
Enforcement: `npm run verify`.

---

## 0. The one rule everything else serves

**Nothing is hardcoded. Everything comes from the system.**

No hex, no `rgba()`, no `text-[13px]`, no `tracking-[0.1em]`, no
`rounded-[14px]`, no `duration-[220ms]` — anywhere except the single file listed
in §6. Colour, typography, radius, spacing and motion all come from tokens.

`npm run check:tokens` fails the build on any violation.

---

## 1. Colour

### The whole system

| Group | Tokens |
|---|---|
| Monochrome (zinc) | `--background` · `--card` · `--muted` · `--accent` · `--foreground` · `--muted-foreground` |
| Action ×3 + ink | `--color-action-bright` · `--color-action` (fill) · `--color-action-dark` · `--color-action-ink` (text, per theme) |
| Value ×3 + ink | `--color-value-bright` · `--color-value` · `--color-value-dark` · `--color-value-ink` (text, per theme) |
| State ×4 + ink | `--color-success` · `--color-warning` · `--color-info` · `--destructive`, each with a `-ink` shade that flips per theme |

That is the complete list. Nothing else exists.

**The two brand ramps are named for their role, not their hue.** `action` is a
blue today and `value` is a lime; they have been purple-and-gold, and they have
been wine-and-amethyst and come back. Not one component knew or had to change on
any of those moves. A component that writes `bg-action` survives a rebrand. A
component that writes `bg-purple` becomes a lie the moment the brand moves —
which has now happened three times, and is why the names are what they are.

**The neutral is zinc, and it is a grey that sits under the blue.** `--background`,
`--card`, `--muted` and `--accent` are neutral steps; all the chroma on a page
belongs to the two ramps and the four state hues, which is what makes the 70/20/10
balance readable at a glance. A brand *can* put chroma in the neutral — this system
has shipped that — but then every surface pair has to be re-measured rather than
carried over, and `--muted-foreground` is the one that breaks first.

**The page has a light source.** `body` carries one wide off-centre radial lift
over `--background` (`--page-glow`), fixed to the viewport. It is a foundation,
not decoration: a flat zinc-950 fill reads as black paint, and the same fill
under the glow reads as a deep room. It fades to `transparent`, so the vignette
is the *absence* of the glow rather than a second dark gradient — which is what
stops it going muddy.

### Rules

1. **One vocabulary, and it is shadcn's.** The page is `--background`, a
   container is `--card`, a fill is `--muted`, a hover surface is `--accent`,
   text is `--foreground` / `--muted-foreground`, hairlines are `--border` /
   `--input`. Never invent a parallel name for a value that already has one.
2. **Action acts, value pays.** Action = interaction: buttons, selection,
   active nav, focus, the agent. Value = worth: balances, rewards, rankings,
   premium actions. Never swap them. In prose, call them what they
   look like — blue and lime. In code, call them what they mean.
3. **Only `-ink` may carry text, and it is a different shade in each theme.**
   This is the rule that makes two themes possible without forking a component.

   | Theme | `--color-action-ink` resolves to | Fails in that theme |
   |---|---|---|
   | Dark | `--color-action-bright` | the mid and dark shades |
   | Light | `--color-action-dark` | the bright and mid shades |

   So `text-action-ink` is the only action text utility and `text-value-ink` the
   only value one. **Never write `text-action-bright`** — it is legible on
   near-black and illegible on white, and a component cannot know which surface
   it is on. The mid shade fills a button and takes `text-primary-foreground` on
   top. `--ring` takes whichever end clears 3:1 in that theme. The colours page
   measures every one of these live and re-measures when you flip the theme.

   **The four state colours are on the same contract**, and they are the half of
   this rule that kept being missed, because `destructive` is a real token so
   `text-destructive` compiles and `check:refs` resolves it. It is still wrong:
   `--destructive` is one red in both themes and is too weak as copy on a
   near-black page, and `--color-warning` / `--color-info` were chosen against a
   near-black surface and measure 1.67:1 and 1.81:1 on white. Write `text-destructive-ink`,
   `text-success-ink`, `text-warning-ink`, `text-info-ink`. The swap costs
   nothing either way — each `-ink` **is** its raw token in the theme that token
   was chosen for, and improves the other — so no legitimate exception is known,
   and none is currently claimed.

   **A MARK WITH NO FOREGROUND OF ITS OWN IS ON THE SAME CONTRACT AS TEXT.**
   A button may be as dark as it likes because it brings its own label; a
   progress fill, a slider range and a 2px tab rule bring nothing, so the only
   thing that makes them visible is their contrast with `--muted`.

   On blue and lime `--primary` measures **3.25:1** on dark `--muted` and
   **4.17:1** on light — it clears the 3:1 non-text minimum, and on dark it
   clears it by a quarter of a point. `--action-ink` measures **8.05:1** and
   **9.62:1** on the same pairs. Those three still name `bg-action-ink`, and
   `Progress`' state tones still name `bg-success-ink` / `-warning-ink` /
   `-destructive-ink`, for a reason worth stating plainly:

   **This rule was written on a brand where the margin was gone.** The same
   components on the wine palette measured `--primary` at **1.63:1** — a
   progress bar you could not see — and nothing in the build said so. A quarter
   of a point of headroom is not a design decision, it is the distance to the
   next rebrand. `-ink` is what makes the components survive that move, and it
   costs nothing here: raw `--color-success` on the light theme's `--muted` is
   **2.31:1** and fails outright today, while `bg-success-ink` is 4.99:1.

   It is not a widening of what `-ink` means, it is what `-ink` always meant —
   *the end of this ramp that reads on this theme's surface*. The filled `Tabs`
   pill and the checked `Checkbox` keep `bg-primary`, because they carry a
   foreground and are judged on that pairing instead.

   **`--chart-1..5` are on this rule too, and it reordered them.** A chart line
   is a 2px stroke with no foreground of its own. The original ordering ran down
   each ramp and put two deep shades on a dark card; on blue and lime one of the
   five failed outright, and on the wine palette three did — `--color-action`
   2.01:1, `--color-action-dark` 1.44:1, `--color-value-dark` 1.69:1 — which is
   when it was finally measured. Each chart token now names the end of its ramp
   that reads in this theme, with the two state hues that clear it filling the
   tail rather than a third unreadable deep shade. The ordering is kept on blue
   and lime because it is a legibility fix, not a brand choice. Re-measured
   here: all twenty pairs fall between **4.58:1 and 17.04:1** on `--card` and
   `--background`, against a 3:1 floor.

   Fills, borders, rings and blooms otherwise keep the raw token:
   `bg-destructive/12` and `[--bloom-1:var(--color-success)]` are correct. Only
   the foreground is the offence — and it has two spellings, because this system writes CSS as well as
   classes. `check:tokens`' `state-colour-as-text` fails the build on both:

   | Spelling | Where the rule runs |
   |---|---|
   | `text-destructive` and friends | everywhere except `app/globals.css`, which is skipped along with every literal rule |
   | `color: var(--color-warning)`, and the brand `-bright` / `-dark` ends | **everywhere, `globals.css` included** — that is the only file the declaration form occurs in, and it was breaking the rule five times when the rule was written |

   **What it still cannot see: `fill:` and `stroke:`.** A chart bar filled
   `var(--color-success)` is correct and a glyph filled the same is not, and
   nothing in the declaration tells them apart. Those are read by eye and by
   measurement, not by the guard.
4. **Money out is not red.** Red means error. A purchase or withdrawal renders
   in plain text with a sign and an outgoing arrow. Money *in* takes the **value
   ramp** — it is worth, which is what that ramp means — and not `success`,
   because §1.5 keeps a completed sale from looking like a valuable one in the
   same row. A `Stat` delta is the one exception and uses `success-ink`: it
   reports a direction rather than an amount, and colouring a rising latency
   figure with the value ramp would read as money.
   The same holds for any figure that can fall: a metric moving the wrong way
   is not an error either, so a `Stat` delta pointing down is plain text and
   never `--destructive`. See §5, *A delta is a shape before it is a hue*.

   **But a figure OUTSIDE ITS BAND is not a direction of travel, and it may be
   red.** These are two different claims and the rule above only forbids the
   first. "Revenue fell 4%" is news. "You slept 5h 23m against an 8h need" is a
   condition the product is telling you to act on, and red is what that means.
   The test is whether the reading would still be flagged if it had not moved at
   all: if yes, it is a band and `destructive` is available; if the flag exists
   only because of the change, it is a delta and red is wrong. A metric card
   should encode this as three named levels rather than a free `tone` prop,
   precisely so no call site can colour an arrow crimson.
5. **A state colour must not collide with a brand ramp.** A live constraint,
   not a principle. The working clearance is about **40°**: `warning` and the old
   lime value ramp were forty degrees apart and that was judged enough.

   Two of the four sit where they do because of the action ramp, not in spite of
   it. `info` was blue 400; once `action` became blue, an informational alert and
   the brand were the same colour, so a notice read as a promotion — it is cyan.
   `success` was green 400, a few degrees off lime, so a completed action and a
   valuable one were confusable in the same row — it is a deeper emerald.
   `warning` (amber) has not moved through three brands and does not need to:
   forty degrees off lime is the working clearance, and it is 143° off blue.

   **`destructive` is clear of the brand on this palette, and that is a property
   of the palette rather than of the rule.** Blue is 158° off crimson, so §1.5
   holds for free here. It did not always: on the wine brand the action ramp and
   the error hue shared a hue family with nowhere for red to go, and the
   separation had to be bought with chroma and lightness instead. If the brand
   ever moves back into the reds, that reasoning has to be rebuilt — and §7's
   two-non-colour-signals rule stops being a formality and starts being the
   thing holding the meaning up.
6. **Never use Tailwind's stock `blue-*`, `lime-*` or `purple-*` scales.** All
   three namespaces are cleared in `globals.css` precisely so they cannot resolve
   to an off-brand colour beside the real one — blue and lime because they are
   the brand, purple because it was the brand two moves ago and a stray
   `bg-purple-500` would read as a survivor of it. (`check:tokens`'
   `stock-palette` rule rejects every Tailwind hue regardless; the clears are the
   second lock. If you rebrand, move the clears to whatever the new hues are.)
7. **Two themes, and dark is the default.** Light and dark are both complete —
   every token, every shadow, every textured effect. `next-themes` sets `.dark`
   on `<html>`; `:root` is light. Dark is what a first-time visitor sees,
   because it is the mode this system was drawn in.

### What light mode actually costs

Light is not dark with the numbers flipped. Three things genuinely change rather
than invert, and all three are handled in `globals.css` — no component carries a
`dark:` variant for any of them:

- **Shadow ink.** Every elevation routes its colour through `--ink-1..4`,
  `--rim` and `--wall`. Black at 60% is depth on a zinc-950 page and grime on
  paper, so light mode uses a slate-tinted ink at roughly a fifth of the
  opacity. If the neutral ever carries real chroma again, both inks have to be
  tinted to match it: a grey shadow over a chromatic surface desaturates it and
  reads as haze rather than as depth.
- **The rim inverts its job.** On dark, the inner top highlight is white and is
  what makes a button look lit from above. On light there is no light to add, so
  the bottom inner shade does the shaping instead.
- **`mix-blend-mode: screen` becomes `multiply`.** Screen ADDS light — correct
  on near-black, and literally invisible on white. The cosmic bloom and the
  action sheen both flip; the foil does not, because it is its own opaque base.
- **One neutral is not a mirror, and this is where the system's longest-standing
  measurement bug lived.** Under zinc, light mode used zinc 500, and this bullet
  claimed it was "the lightest step clearing AA on both `--background` and
  `--muted`". Measured, that was true of the first and not the second: `#71717a`
  on white is **4.83:1**, and on `--muted` `#f4f4f5` it is **4.40:1** — a miss by
  0.10 on the most repeated foreground/surface pair in the system, since every
  `Panel` label and specimen note sits on exactly it. It was recorded as
  outstanding rather than quietly rounded up, because a rules file that
  overstates its own measurement is the thing §9 exists against.

  **It is closed now, and it stays closed across a rebrand.** The failure was
  found while retuning every neutral for the wine brand, which means it is not a
  wine problem and the fix carries back: light `--muted-foreground` is chosen by
  measurement rather than by mirroring dark, one step deeper than zinc 500.
  Rasterised on the live page, light is **6.04:1** on `--background` and
  **5.50:1** on `--muted`; dark is **13.46:1** and **10.08:1**. All four clear
  AA, which is the first time that has been true of both themes at once.

---

## 2. Typography

**Two faces, and only two.** Inter sets every word; Geist Mono sets code,
identifiers and figures. There is no third face and no accent face — Redaction
and the `.type-accent` role are gone.

Geist Mono comes from Vercel's official self-hosted `geist/font/mono` package,
not the Google Fonts build, so the glyph set and font-feature support are the
canonical ones. Inter is loaded by the `@font-face` in `styles/tokens.css`
rather than by `next/font` in a layout: the stylesheet is what a consumer
installs, so the sans face has to travel with it.

**Public typography is exactly nineteen roles, and every one of them is
responsive.** Phone (below 768) · tablet (768–1023) · desktop (1024 and up),
then weight and tracking. Two breakpoints, and there is no third.

It replaced a larger earlier scale in which nine roles stepped and eight held one
size everywhere. The whole table now steps at both boundaries, and it starts
smaller: a phone is read at a shorter distance than a laptop.

| Role | Phone · Tablet · Desktop | Weight | Tracking | Face |
|---|---|---:|---:|---|
| `.type-display` | 36/40 · 42/44 · 48/48 | 600 | −0.03em | Inter |
| `.type-h1` | 30/36 · 32/38 · 36/40 | 700 | −0.02em | Inter |
| `.type-h2` | 26/32 · 28/34 · 30/36 | 650 | −0.015em | Inter |
| `.type-h3` | 20/28 · 22/30 · 24/32 | 600 | −0.01em | Inter |
| `.type-h4` | 18/24 · 19/26 · 20/28 | 600 | normal | Inter |
| `.type-h5` | 14/20 · 15/22 · 16/24 | 600 | normal | Inter |
| `.type-lead` | 16/20 · 17/22 · 18/24 | 400 | normal | Inter |
| `.type-body` | 14/20 · 15/22 · 16/24 | 400 | normal | Inter |
| `.type-small` | 12/16 · 13/18 · 14/20 | 400 | normal | Inter |
| `.type-nav` | 12/16 · 13/18 · 14/18 | 500 | normal | Inter |
| `.type-badge` | 10/14 · 11/14 · 12/16 | 600 | normal | Inter |
| `.type-cta` | 12/16 · 13/18 · 14/20 | 600 | normal | Inter |
| `.type-code` | 12/18 · 13/18 · 14/20 | 400 | normal | Geist Mono |
| `.type-identifier` | 12/18 · 13/18 · 14/20 | 400 | −0.01em | Geist Mono |
| `.type-number-sm` | 12/16 · 13/18 · 14/20 | 600 | −0.01em | Geist Mono |
| `.type-number-base` | 14/20 · 15/22 · 16/24 | 600 | −0.01em | Geist Mono |
| `.type-number-md` | 20/28 · 22/30 · 24/32 | 600 | −0.01em | Geist Mono |
| `.type-number-lg` | 30/36 · 32/38 · 36/40 | 600 | −0.01em | Geist Mono |
| `.type-number-xl` | 36/40 · 42/44 · 48/48 | 600 | −0.02em | Geist Mono |

The table is not stored here. `lib/ds/platform-contract.ts` holds it as data,
`styles/tokens.css` holds it as values, and
`test/foundation/typography-contract.test.ts` fails the build if the two
disagree. This copy is documentation, and the test is what keeps it honest.

### Rules

1. **A role owns shape only** — family, size, line height, weight, tracking.
   Colour, case, opacity and product meaning belong to the component that
   spends the role. `test/foundation/typography-ownership.test.ts` fails the
   build on a role that sets `color`, `text-transform`, `opacity` or a
   background; `test/foundation/typography-contract.test.ts` fails it on a size
   that is not the table above.
2. **Never hand-roll a size.** Use a role. Each one is also a `--text-*` /
   `--leading-*` token pair (`text-body`, `leading-body`, `text-number-lg`…)
   for a CVA string where a class will not fit — and every `--text-*` key must
   be listed in `lib/utils.ts`, or tailwind-merge files it as a colour and
   silently drops it.

   **The tokens are where the responsiveness lives.** `styles/tokens.css`
   declares each role's phone step, then redefines the same two properties
   under `(width >= 768px)` and `(width >= 1024px)`. `styles/typeset.css`
   contains no sizes and no media queries at all. That is deliberate: Tailwind
   compiles `text-small` to `font-size: var(--text-small)`, so the class and
   the utility read the same property and cannot be moved apart. Writing the
   steps in `typeset.css` instead would scale `.type-small` and leave the
   `text-small` utility frozen at the phone size.

   **Typography comes only from a `.type-*` role.** No Tailwind size step
   (`text-xs`, `text-sm`, `text-base`, `text-lg` and up), weight
   (`font-medium`…), family (`font-sans`, `font-mono`), `tracking-*`,
   `leading-*` or case utility (`uppercase`…) in a component, and no inline
   `fontSize`/`fontWeight`/`letterSpacing`/`lineHeight`. The role carries
   size, line height, weight, tracking and face; pick the role, never compose
   one. `npm run check:rules` (`test/rules/typography.test.ts`) fails the build
   on any of them. Tailwind's four steps stay aliased to ours in
   `styles/tokens.css` only so third-party markup (a library's own classes)
   lands on the scale.

   **A `.type-*` class cannot be reached through a variant.** They live in
   `@layer components`, and Tailwind only generates variants of utilities it
   knows — so `data-[size=md]:type-nav` compiles to nothing at all while every
   guard stays green and the size falls back to inherited. Branch in
   TypeScript instead; `SidebarMenuSubButton` is the worked example.
3. **The floor is the role's own smallest step, not a system-wide number.**
   This rule used to read "14px is the floor", and that stopped being true when
   the shared contract arrived: `small` starts at 12 on a phone and `badge`
   starts at 10. What has not come back is the *furniture ladder* — the five
   sizes that used to run 13, 11.5, 11, 10.5, 10 alongside the real roles. Each
   of those existed because the role above it carried a colour or a case
   somebody did not want, and ownership removed the reason. A small size is
   fine; a size invented to escape a role is not.

   `badge` is the one role that goes below 12, and it is allowed to because a
   badge labels something rather than being a control: its accessible target
   never depends on its type size.
4. **`.type-display` once per screen at most** — hero and reveal moments only.
5. **Tabular numerals everywhere money appears**, so columns align and a live
   figure does not shuffle sideways. The five numeric roles already are.

---

## 3. Spacing, radius, elevation

- **Spacing** — 8-point: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80. This governs
  **layout**: the gap between blocks, the padding of a section, the rhythm of a
  page. If a layout gap is not on the scale, it is wrong.

  **Half-steps (2, 6, 10, 14 — Tailwind's `0.5`, `1.5`, `2.5`, `3.5`) are legal
  inside a component**, and about a hundred places use them: the gap between an
  icon and its label, a chip's vertical padding, the nudge that optically centres
  a glyph. At those sizes the 8-point grid is coarser than the eye, and forcing
  `gap-2` where `gap-1.5` is right makes a chip look loose. The line is scale: if
  you are spacing things a user reads as *separate*, use the scale; if you are
  spacing the parts of one object, half-steps are fine. Anything finer than 2px
  is not a decision, it is a mistake.

  > **Stock shadcn is not on this scale, and it is the single most common source
  > of drift.** It ships menus at `p-1` / `px-1.5 py-1` and tabs at `p-[3px]` /
  > `px-1.5 py-0.5` — 3px, 6px, 2px, none of which exist here. Every menu surface
  > (dropdown, context, menubar, select, command) is retuned to `p-2` container /
  > `px-3 py-2` item / `gap-2`, giving a 36px row. Tabs are a 40px track on a 4px
  > inset with 32px triggers. **Re-run `npx shadcn add` on any of these and the
  > cramped values come straight back** — diff before you commit.
- **Typography stacks declare their rhythm.** Valid type classes do not create
  spacing between themselves. Whenever a label, value, caption, helper or
  status is stacked vertically, the component that owns that relationship must
  declare a tokenized `gap-*` or `space-y-*`; never rely on line-height to
  create visual separation. Card padding can be correct while nested text still
  collides. Repeated stacks belong in the shared composition so one missing gap
  cannot propagate across every page.
- **Native scrollbars use the global rail.** `html` receives the browser
  scrollbar treatment automatically; nested native overflow regions add
  `scrollbar-thin`. Keep both axes identical and token-driven so horizontal
  shelves do not introduce a second control style. Do not hide a scrollbar
  when it is the only visible cue that more content is available. Use
  `ScrollArea` only when a contained application panel needs a composed rail.
- **Pill padding** — a pill's radius is half its height, so a 40px control has a
  20px corner. Content needs **16px** horizontal clearance or it collides with
  the curve; 12px is not enough. Where an addon already provides that clearance,
  the inner control drops to 8px so the two do not stack.
- **Radius** — **controls are pills** (`rounded-pill`): buttons, inputs, input
  groups, badges, chips. Containers use the ladder: `lg` 12 cards · `xl` 16
  dialogs · `2xl` 20 · `3xl` 24. Textarea is the one exception — a pill is wrong
  on a multi-line box, so it takes `lg`.

  **`4xl` 32 is off the end of that ladder on purpose.** It exists for one
  shape — a full-width slab on a narrow column, where the card *is* the content
  rather than a box drawn around it, and 24px still reads as a rectangle with
  the corners taken off. A metric card on a narrow glance column is the case it
  was added for. Do not reach for it on anything sitting in a grid beside `lg`
  cards: two container radii on one screen is drift, not hierarchy.

### The notch is padding, and only at a screen edge

`styles/utilities.css` ships seven `*-safe` classes — `pt-safe`, `pr-safe`,
`pb-safe`, `pl-safe`, `px-safe`, `py-safe`, `p-safe` — each writing the matching
padding longhand from `env(safe-area-inset-*, 0px)`. They carry no token: the number comes from the
device, not from the system, so `env()` is the value and there is nothing for
`check:tokens` to object to.

- **Use them on something that touches the edge of the display** — a fixed
  bottom bar, a full-height drawer, a floating action. Nothing else. Padding a
  component that already sits inside a padded page adds the inset twice, and
  the second copy is invisible on the machine you are building on.
- **Never drop the `, 0px` fallback.** A bare `env(safe-area-inset-bottom)`
  resolves to nothing on a display that reports no inset, and a declaration
  whose value resolves to nothing is discarded — silently, and only on the
  devices you are least likely to be testing on.
- **Do not stack a `*-safe` class with a `p-*` class on the same element.**
  Both write the same longhands, so the later rule wins outright and the inset
  you asked for is simply gone. Put the safe padding on its own wrapper. This
  is not hypothetical: the first draft of the `safe-area` specimen did it and
  measured 0px while its own caption claimed otherwise.

### Shadows — two families

Full page at `/design-system/shadows`.

**Ambient** — how far a surface floats: `shadow-e1` … `shadow-e4`.

**Machine** — whether it can be *pressed*:

| Token | Use |
|---|---|
| `shadow-btn` | Secondary, outline, destructive buttons |
| `shadow-btn-primary` | The primary button, with the action cast under it |
| `shadow-btn-value` | The premium button, value cast |
| `shadow-btn-down` | Any button while `:active` — sinks into its socket |
| `shadow-key` / `shadow-key-down` | A raised key with a side wall, travelling 3px |
| `shadow-pressed` | A sunken socket. Every input sits in one |
| `shadow-chip` | Badge and chip depth — raised, but deliberately *not* pressable |

**The rule:** controls you operate stand **proud** with an inner top highlight;
fields you type into are **recessed**. Get those the wrong way round and the
whole interface reads as flat cardboard.

**Small solid shapes need a ramp too.** A badge with a flat fill next to a button
that has an inner highlight looks like a sticker pasted on. Every filled `Badge`
variant carries `ramp-chip` — light from above, shade at the bottom — plus
`shadow-chip`, which reads as raised but carries no travel, because a badge is a
label and must not invite a click. Unfilled variants (outline, ghost, link) get
neither: there is no surface to light, and a shadow under transparent text is
just dirt.

**The premium button carries value foil** (`foil-value`) — lime today —
built in three parts because real metal has three:

1. **The ramp** — a light–dark–light gradient on the element itself, with a
   darker band across the middle. That band is the *edge* of the metal, and it
   is what separates a foil from a coloured rectangle. **Its depth is a
   per-brand number and has to be re-measured on every rebrand.** It is 42% of
   `--color-value-dark` on lime, where the worst stop measures **7.80:1** against
   the foil's ink and the other three run 12.39, 16.01 and 16.10. The identical
   42% on a far lower-luminance value hue rasterised at **4.11:1** — a premium
   button failing AA across the band through its own middle — and needed 30%
   instead. No guard can see this:
   pull the stops out of the live element's `backgroundImage` and paint each into
   a 1x1 canvas, because they are `color-mix(in oklab, ...)` and cannot be parsed
   as RGB.
2. **The foil** (`::after`) — fine diagonal striations, a broad sheen and a warm
   top-left highlight, drifting on `soft-light` over 11s so it keeps its hue
   rather than bleaching.
3. **The glint** (`::before`) — a narrow bright band on `screen` blend that
   idles ~3.5s, then sweeps across in ~1.6s, then rests. Because it waits, it
   reads as light catching the surface rather than as a loop.

Hover speeds the glint to 2.4s and lifts the foil to full opacity.

**The default button carries the action sheen** (`sheen-action`) — the same
idea, deliberately quieter, because the primary action should be interesting
rather than precious:

1. **The ramp** — a soft light–dark–light gradient in the action ramp, far less
   contrast than the foil.
2. **The texture** (`::after`) — striations and one diagonal sheen, held
   **static**.
3. **The beat** (`::before`) — an ellipse expanding from the centre in a double
   thump: a strong beat, a weaker echo, then rest. **Hover only.** A press fires
   a single hard beat.

> **Why the beat is hover-only.** Default buttons appear many times per screen.
> A permanently animating one would break §4's rule that only the live indicator
> moves forever, and would read as noise. Tying the motion to pointer intent
> means the surface is calm at rest and comes alive exactly when it matters.

It is **CSS, not a canvas, deliberately.** A GPU surface on a 130×40 control
renders at 64×19 — far too few pixels for a noise field to read — and `screen`
blend on value-over-value washes to white and flattens what survives. Reach for
a canvas only where there is room for it to be seen.

**Glow is rationed** — `glow-action` for selected and primary CTA, `glow-value`
for celebrated tiers and reward moments. **Navigation never glows.**

### Glass — a surface in front of the page

`glass-panel` and `glass-control`: a translucent fill, a hairline rim of the ink
colour, and the same `--rim-strong` top highlight every raised control carries.
The fill is `--card` held back, so the page's own light shows through and two
panels over different parts of it glow differently — which is the entire reason
to reach for this instead of `bg-card`. Neither utility needs a `dark:` variant,
because both mix from `--card` and `--foreground`: a light edge on dark and a
dark edge on light falls out of the same expression.

**Two utilities, and the split is scale rather than taste.** The physics of
frosted glass do not scale down. A 24px backdrop blur behind a 44px disc samples
almost nothing but the disc's own footprint and costs a compositor layer to say
so, and `--shadow-e2` under a control that small reads as grime. So the panel
blurs and floats; the control only tints and rims.

**The blur goes through `@apply backdrop-blur-*`, not a hand-written
`backdrop-filter`.** Written by hand as
`backdrop-filter: blur(calc(var(--spacing) * 5))` the declaration was **dropped
entirely** from the compiled stylesheet — no error, no warning, both guards
green, because `check:tokens` looks for values that should have been tokens and
`check:refs` looks for names that resolve to nothing, and this was neither: a
correct, token-derived declaration the CSS transformer would not carry through a
`blur()` it could not statically resolve. It was caught by reading
`getComputedStyle(card).backdropFilter` in the browser and getting `none`. §9.1's
family, from a third direction.

---

## 4. Motion

> **Content bounces; controls click.** Springy motion for things that appear,
> react or reward. Machine motion for things you operate. Never mix them: a
> button that springs feels broken, a reward that clicks feels cheap.

Motion is named for its role; `ease-in` / `ease-out` / `ease-in-out`
are Tailwind's words, repointed at ours.

- Durations: `tick` **80** · `fast` 150 · `normal` **250** · `slow` **400** ·
  `overlay-enter` 320 · `open` **420** · `bloom` **1000**.
  `bloom` is the one atmospheric step — it belongs to light, not to controls.
- Easing: **`--ease-emphasized`** `cubic-bezier(.34,1.56,.64,1)` is THE curve —
  overshoots then settles · `--ease-enter` things that arrive · `--ease-move`
  things that loop · `--ease-out-flex` long travel that must not overshoot.

### The click feel

The asymmetry is the whole thing: **40ms down, 250ms spring back**.

| Utility | Travel | For |
|---|---|---|
| `press` | scale 0.9 | Anything clickable — button, badge, row, card |

`Button` has it built in and needs no explicit class. Everything else
clickable — a badge, a row, a card, an avatar — wears `press` directly.

### Selection travels, it does not blink

A group of options owns **one pill** that physically slides from the old
selection to the new one and lands with a spring squash. Options never own their
own selected background — `useSlidingIndicator` measures the active element and
moves the pill. Applies to `ToggleGroup` and `Tabs`, and to anything like them
you add later: if a group has an active option, the active state travels.

`Tabs` in `line` variant travels too, but as a 2px rule along the edge instead of
a filled pill — pass the bar's classes to `SlidingIndicator`'s `className`. An
underlined tab set that suddenly grew a brand-coloured fill would stop being an
underlined tab set. The rule itself fills `bg-action-ink`, not `bg-primary` —
see §1.3 on marks that carry no foreground of their own.

> **Ordering trap:** an override that cancels a variant's own background must
> come **after** `toggleVariants()` in the `cn()` call. tailwind-merge keeps the
> last class in a group, so putting it first silently loses.

> **Attribute trap:** `useSlidingIndicator` watches exactly one attribute, and
> which one matters. Radix writes `data-state`; a sidebar row writes
> `data-active`. Making the row emit `data-state` to match the default looks
> like the cheap fix and is wrong — a row wrapped in a `CollapsibleTrigger`
> carries `data-state="open"`, so the pill would chase disclosure instead of
> selection. Pass the attribute name instead.

> **Measurement trap:** the pill positions itself from the active element's
> rect, not from `offsetLeft` / `offsetTop`. Those are relative to the nearest
> **positioned** ancestor, which is the container only while nothing in between
> is positioned. That held for Tabs, whose options are direct children, and
> broke silently in the sidebar, where every row sits inside a
> `position: relative` list item. Every row reported `offsetTop: 0` and the pill
> parked at the container's origin — and it *looked* right, because the active
> row happened to be the first row.

### One source of truth for motion

Every keyframe lives in `styles/motion.css` and nowhere else — no page or
component defines its own, and none of the other three canonical stylesheets
may hold one either. Every animation is exposed as a single `.anim-*`
class, and every consumer references that class rather than copying the effect.
The squash used by `IconSwap`, the sliding selection pill and
`useReplayOnStateChange` is one definition, `.anim-change`.

The only motion outside the system is `animate-spin` on the loading spinner — a
plain 360° rotation, not a designed movement. Everything else, including the
skeleton shimmer and every overlay, resolves through `globals.css`.

**Easing must be a `var(--ease-*)` token.** A bare `ease-out` keyword or a raw
`cubic-bezier()` looks identical but silently stops following the motion scale,
so retuning a curve would miss it. `npm run check:tokens` fails on either.
`linear` and `steps()` are fine — a constant drift and a stepped ratchet are
deliberately uneased, and neither contains an easing keyword to match.

### Nothing in the agent family leaves on the frame it was told to

Use `usePresence` (`components/agent/core/use-presence.ts`) for any element in
`components/agent/*` that can be told to go away — a departed approval card, a
collapsed panel's content, a resolved run bar, a dismissed toast-shaped row.
It returns `{ mounted, phase, className }`: render while `mounted` is true, and
`phase` is `"exit"` for exactly one frame before it flips to `false` — long
enough for `anim-exit`/`anim-collapse`/`anim-close` to actually play. The trap
this closes shipped more than once on an otherwise-green build: a parent
reading its own boolean/array state (`open`, `pendingApprovals.length`,
`run.status`) and conditionally rendering `null` the instant that state
changes unmounts the child on the SAME frame the state flipped, before any
exit class has painted a single frame — the element is just gone, no matter
how carefully its own JSX names an `anim-exit` class it never gets time to
run. `usePresence` is what buys that frame: it holds the child mounted through
its own exit animation and only then lets the parent's `null` branch take
over, which is the only way "leaving" is ever actually seen rather than
skipped straight to "left".

### Modal overlays arrive on `anim-open`

**Dialog and Alert Dialog open on `anim-open` and close on `anim-close`,
and nothing else.** Not `zoom-in-95`, not a fade. A modal takes the whole screen
hostage; it should land with the same spring as everything else that arrives.

```
data-open:anim-open  data-closed:anim-close
```

- In: `--duration-open` (420ms) on `--ease-emphasized`. It is longer than
  `overlay-enter` on purpose — `ease-emphasized` spends its last stretch
  settling an overshoot, and at 320ms the bounce is clipped rather than
  resolved.
- Out: `--duration-normal` (250ms) on `--ease-move`. **Leaving is always faster
  than arriving.** The exit is not the entrance reversed: it anticipates upward
  for a beat, then drops away.

Two things this depends on, both easy to break:

- **The keyframes drive `transform` only, never `translate`.** A dialog is
  centred with `-translate-x-1/2 -translate-y-1/2`, which Tailwind v4 emits on
  the standalone `translate` property. Write `translate()` into the keyframes and
  every dialog jumps to the bottom-right corner as it opens.
- **Every `.anim-*` is registered with `@utility`, not `@layer components`.** A
  `@layer components` class cannot take a Tailwind variant, so
  `data-open:anim-open` would compile to nothing at all — no error, no
  animation, just a silent fall off the motion system.

### Disclosure animates its height

**Collapsible and Accordion animate `height`, not opacity** — the panel
physically pushes what is below it out of the way. `anim-expand` runs on
`--ease-emphasized`, so it overshoots its own height by about 10% and settles
back: the same overshoot, applied to a box instead of to a scale. Measured
opening a 164px panel: 16 → 130 → **180** → 164, settled by 395ms.

- `--unfold-h` is the indirection that lets both primitives share one pair of
  keyframes despite exposing differently-named Radix variables. Point it at
  `--radix-collapsible-content-height` or `--radix-accordion-content-height` on
  the content element.
- **`overflow-hidden` is load-bearing.** Without it the overshoot reads as
  content spilling out of the panel rather than the panel breathing.
- This replaces tw-animate-css's `accordion-down` / `accordion-up`, whose
  keyframes live outside `globals.css` and so could never follow a change to the
  motion scale.

### Anchored overlays run on the same scale

Popover, tooltip, select, sheet, drawer and the menus keep their own fade or
directional slide — a panel anchored to a control should not spring in from
nowhere. But they animate through `tw-animate-css`, not our `.anim-*` classes,
and its enter/exit rules read `var(--tw-duration, .15s) var(--tw-ease, ease)`.
Left alone, every one of them would run at 150ms on a plain `ease`, ignoring the
motion scale.

One unlayered rule in `globals.css` bridges them to `--duration-overlay-enter`
and `--ease-enter`. It has to be shaped exactly as it is:

- those variables are `inherits: false`, so they only resolve when set **on the
  animating element**, never from `:root`;
- Tailwind resets them on `*` in `@layer properties`, which outranks
  `@layer base` regardless of source order — so the rule is **unlayered**;
- shadcn applies them through variants, so the DOM class is
  `data-open:animate-in` and a `.animate-in` selector never matches — hence the
  substring attribute selector.

**Never pin `duration-*` on an overlay component.** Eleven of them shipped with
`duration-100`, which silently opted out of the scale.

### Selection controls: recessed socket, raised knob

Checkbox, radio, switch and slider all use the same depth pairing as the
inputs — **the container is recessed, the moving part is raised.** A switch
track is `shadow-pressed` when off and `shadow-btn-primary` when on (lit, with
the action cast beneath); its thumb is `shadow-btn`. A slider track is a sunken
channel filled `bg-action-ink` (§1.3); its thumbs are raised knobs. That opposition is what separates the two
surfaces instead of leaving a flat pill with a flat dot on it.

Sizes are 20px for checkbox, radio and slider thumbs, 44×24 for the switch, and
a 10px slider track — stock's 16/12/4 are too small for primary controls.

**The tick is drawn, not faded.** A hand-authored path carries a dash the length
of itself and animates the offset to zero, so the stroke writes on
(`anim-change`). An icon-library glyph cannot do this, which is why the path
lives in `checkbox.tsx`.

**Every toggle squashes,** in both directions, via `useReplayOnStateChange`.
CSS alone cannot do it: `data-[state=unchecked]:anim-change` fires on
mount for every unchecked control on the page, and `:active` only holds while the
pointer is down so a quick click truncates it. The hook watches `data-state`,
and a MutationObserver never reports initial state — so it is silent on first
paint and fires on every real change.

### Two-state controls use IconSwap

**Every control that alternates between two icons swaps them through
`IconSwap`.** No crossfades, no instant swaps. The icons form a vertical strip:
advancing rolls it up, going back rolls it down, and the arriving icon lands
with a spring squash. Put it *inside* a Button as the child.

A `ToggleGroup` is for **three or more** options. With exactly two, a segmented
control wastes space and reads weaker than it is.

### Timing must be declared in one utility

Tailwind's `transition-*` utilities set `transition-duration` themselves, and
whether a following `duration-*` beats them depends on generated CSS order — it
does not, reliably. Anything whose timing matters declares the whole
`transition` shorthand in a single `@utility`: `press`, `toggle-slide`,
`swap-roll`. Do not hand-assemble `transition-all duration-x ease-y` on an
element and expect it to hold.

### Discrete charts remain charts, not page illustrations

Unit activity and conversion funnels live in `components/ds/charts` as reusable,
data-driven components. Their marks use only `--chart-1` through `--chart-5`
(plus semantic `muted` for a comparison remainder), their measured values use
the `type-number-*` foundation, and their specimens go through `ChartStates` like
every Recharts family. Do not redraw either pattern inside a product page.

### A library that animates in JavaScript reads the tokens, it does not copy them

Recharts takes `animationDuration` as a number and `animationEasing` as a
string, so neither is a class and neither is visible to `check:tokens`.
`components/ds/chart-motion.ts` resolves `--duration-slow` off the live
stylesheet and returns `isAnimationActive` from the media query. **A hardcoded
`800` in a chart prop passes every guard in this repo and is still a violation
of §0 — the guard is the enforcement, not the rule.**

Recharts 3.8 does honour `prefers-reduced-motion` on its own, through the
`isAnimationActive: 'auto'` default — checked in
`animation/JavascriptAnimate.js`, because the plan for that page claimed it did
not. `auto` stops applying the moment a boolean is passed, which every shadcn
chart example does, so the hook decides it once instead. §4.3 is the part that
does not move: recharts interpolates the geometry it draws, so a bar that only
arrives at its value by animating is information living inside an animation.

The easing **curve** could not be threaded through. Recharts types
`animationEasing` as five keywords on every series but `Bar`, so
`--ease-out`'s `cubic-bezier()` value will not typecheck; what is passed is the
keyword `ease-out`, which names the token rather than copying its value. That
limit is written into `chart-motion.ts` and onto
`/design-system/components/chart#animation` rather than papered over with
a cast. When a library will not take a token, say so where the next reader will
look — do not quietly write the literal and let it read as system-derived.

### Springs — motion that has to inherit a gesture

A keyframe cannot catch a thrown finger. The micro-interactions (swipe rows and
toasts, the sling, the dial, the wake slider, the prompt bar's send tile) hand
the pointer's velocity to the animation that follows it, so they animate in
JavaScript through `motion` — and a JavaScript animation reads the scale like
recharts does, it never copies it.

A spring is two tokens in `styles/motion.css`: how long it takes to look
settled, and how much it overshoots. Four roles, and only four:

| Role | Duration · bounce | For |
|---|---|---|
| `control` | 300ms · 0 | a thing you operate settling — critically damped |
| `travel` | 400ms · 0.1 | a thing you threw coming to rest: a snap, a dismiss |
| `content` | 400ms · 0.3 | a thing that arrived or rewarded — the one that bounces |
| `settle` | 500ms · 0.2 | a long, soft landing after a gesture |

`spring("travel", { velocity })` from `lib/motion/spring.ts` is the only way a
component gets one; `duration()` and `ease()` in the same file read the
existing scale for a tween that must run in JavaScript. **A
`{ duration: 0.3, bounce: 0 }` typed into a component passes every guard in
this repo and is still a violation of §0.** JavaScript motion is not covered by
the global reduced-motion rule, so a component that uses it asks
`usePrefersReducedMotion()` and passes `INSTANT` instead. A fifth spring role is
a design decision recorded here, not a convenience.

### Named animations

The vocabulary is eleven keyframes and three transitions. Adding a twelfth
keyframe is a design decision recorded in this file, not a convenience.

`anim-enter` (the one shared arrival — pop, section entrance, panel, reveal,
card-flip, row-in, all merged into one parameterised rise) · `anim-exit` (its
paired departure) · `anim-change` (squash-stretch reward — IconSwap, the
checkbox tick, the radio dot) · `anim-open` / `anim-close` (screen and modal
entrance / exit) · `anim-expand` / `anim-collapse` (disclosure) ·
`anim-spin` (the loading spinner) · `anim-shimmer` (the loading sweep,
including `anim-shimmer-text`) · `anim-progress-indeterminate` (stepped
sweep) · `anim-pulse` (the live indicator's breathing glow) · `anim-caret`
(the OTP caret blink) · `press` (the one click feel, scale 0.9) ·
`toggle-slide` (the travelling selection pill) · `swap-roll` (content
replacing content in the same slot).

All of the `anim-*` names are `@utility`, so all of them take variants —
`data-open:`, `md:`, `group-hover:`. Add new ones the same way; never as a
plain class.

### Rules

1. **Only two things animate forever: the live indicator, and `bloom-cosmic`.**
   The live indicator is a *signal* — it moves because something is happening.
   The bloom is a *texture*: 18s and 11s counter-rotating drifts carrying no
   information. Nothing else earns a perpetual loop, and a new one needs the same
   justification — either it is telling you something, or it is slow enough to be
   weather.
2. **The opening sequence is always skippable**, from the moment it starts.
3. **`prefers-reduced-motion` is honoured globally.** No information may exist
   only inside an animation.
4. **Never flash or strobe.** No named animation in the vocabulary loops a
   flicker; the one that did was demo-only and retired on 2026-09-22.

---

## 5. Components

### Base — `components/ui/*`

Sixty-odd shadcn primitives, restyled **only** through the token layer. No
component was forked to change its look. Run `ls components/ui/` for the count
rather than trusting a number written in prose — this one has already drifted
once.

Deliberate departures from stock:

| Component | Change |
|---|---|
| `Button` | Size ladder 32/40/48/56; added `premium` value-foil variant, `emphasis="caps"`, `loading` |
| `Input` / `Textarea` / `InputGroup` | 40px, 10px radius, `bg-muted` fill |
| `Alert` | Added `success`, `warning`, `info`; one surface, signal in the icon and bloom |
| `Badge` | Added `action`, `premium`, `success`, `warning`, `info` |
| `useIsMobile` | Rewritten on `useSyncExternalStore` |
| `Dialog` / `AlertDialog` / `Sheet` | Three-zone banding; `anim-open` / `-close` |
| `DialogContent variant="media"` | The same Dialog with a full-bleed `DialogMedia` image lead for announcements, news and promotions |
| `AlertDialogAction` | Defaults to `variant="destructive"` |
| `Tabs` | Travelling pill; 40/4/32 geometry instead of 32/3/25 |
| `Progress` | 10px sunken channel — the Slider's track, minus the thumb; `tone` for a reading outside its band (§1.4) |
| `Badge` | `ramp-chip` + `shadow-chip` on every filled variant; pill radius |
| `Avatar` | Fallback and group-count text track the circle's size |
| `Collapsible` / `Accordion` | Height animated on the spring via `anim-expand` |
| Menus, `Select`, `Command` | Retuned onto the 8-point scale |
| `Toaster` | Follows `resolvedTheme`; all styling moved into `.cn-toast` |

`destructive` is a **tint**, not a solid fill. The reason given here for years
was that "white on the destructive red measures 3:1 and fails AA", and that
number was wrong: rasterised on the live page in both themes, pure white on
`--destructive` is **4.83:1** and `--destructive-foreground` (zinc 50) is
**4.63:1**. Both clear AA. The tint is still right — a solid red card recolours
its own body copy and reads as a traffic light beside the other four Alert
variants (§5, *Alert: one surface, five meanings*) — but it is a composition
decision, not a contrast rescue, and stating it as the latter sent readers
looking for a failure that was never there. The live figures are printed on
`/design-system/colors`.

#### Overlays have three zones — except the alert dialog, which has two

**Media Dialog is an anatomy variant, not another modal.** Set
`DialogContent variant="media"` and lead with `DialogMedia`. The variant removes
the chrome bands and lets the image, title, description and actions read as one
editorial card, while retaining Dialog's focus trap, ARIA wiring, dismissal and
motion. Use it for announcements, ads, onboarding news and promotions. Never use
it for destructive confirmation: an image competes with the consequence, which
belongs in an Alert Dialog.

**Dialog and Sheet** read as **header band · body · footer band**. Both bands
bleed to the edge of the panel, sit on `bg-muted/50`, and close with a rule —
`border-b` on the header, `border-t` on the footer. The body is the only lit
surface, because the body is the only thing the user is actually deciding on.

**Alert Dialog bands the footer only.** Its header, title and description sit
directly on the panel — no band, no rule, no card box.

The reason is what the two components *are*. A dialog is a container for a task:
the header names it, the body is the work, the footer closes it, and three zones
make that structure legible at a glance. An alert dialog is not a container for a
task — it is a single question, and the question **is** the content. Banding its
header wraps that one sentence in a box and demotes the most important words on
the screen into a caption for whatever sits beneath them, which is exactly
backwards. The footer keeps its band because the footer is the decision, and the
decision is the only other thing in the panel.

- The close button lands **on** the header band, vertically centred on the title.
  `DialogContent` and `SheetContent` publish `data-close-button`, and the header
  reserves `pr-12` only when there is one — never a blanket right pad. An alert
  dialog has no close button at all: it must be answered, not dismissed.
- `DialogHeader` bleeds with `-mx-4 -mt-4` because `DialogContent` carries the
  padding. `SheetHeader` does not, because `SheetContent` carries none.
  `AlertDialogHeader` bleeds nowhere — it is inset in the content padding like
  body copy, which is what it is.
- **`AlertDialogAction` is destructive by default.** An alert dialog exists for
  the decision that cannot be undone — "Sell all for $2,481.00", "Close my
  account" — so its confirming button should look like one without anyone having
  to remember to say so. Reach for a plain `Dialog` if the action is reversible.

#### Constrained actions and application sidebars

- **Constrained button labels truncate; they never widen their container.** The
  button keeps `min-w-0 max-w-full`, and its words live in `ButtonLabel`, which
  owns the ellipsis. The full label must also be available from a `Tooltip` on
  hover and keyboard focus. `AlertDialogAction` and `AlertDialogCancel` apply
  this automatically because explicit consequence labels are especially likely
  to overflow. Never shorten a consequence merely to make the layout fit.
- **Product sidebars use the complete Sidebar composition, not a private rail.**
  Start from the live sidebar anatomy: workspace switcher and search in
  `SidebarHeader`, grouped navigation in `SidebarContent`, secondary/help items
  in `SidebarFooter`, plus `SidebarRail`, `SidebarTrigger`, and tooltips for icon
  collapse. Product data changes; the anatomy and primitives do not.

#### Which feedback component to reach for

Picking the wrong one is the most common mistake in this area, and the
distinction that matters is **reversible or not**:

| Situation | Component | Why |
|---|---|---|
| Confirming something the user just did | **Toast** | Transient. There is nothing to decide. |
| A task containing a choice | **Dialog** | A container: header names it, body is the work, footer closes it. |
| Irreversible, must be answered not dismissed | **AlertDialog** | Two zones, footer band only. Its action is destructive by default. |
| A persistent condition worth explaining | **Alert** | It stays on the page. |
| Nothing is there yet | **Empty** | And it always offers a way forward. |

**Irreversible → `AlertDialog`; reversible → `Dialog`.** If the action cannot be
undone, it needs an `AlertDialog`. If it can be undone, a plain `Dialog` is enough.

**Every irreversible action asks first — no exceptions.** Delete, remove, clear,
discard, reset, revoke: the control opens an `AlertDialogConfirm` (or a composed
`AlertDialog`), and the action runs only from its confirming button. An undo
toast after the fact does not replace it. `e2e/irreversible.spec.ts` presses every
such control on every docs page and fails when the page changes without a
confirmation, or when Cancel still changes it.

#### Every action needs two signals

The control confirms it **heard** you; the outcome confirms it **worked**. One
without the other leaves a gap — control only reads as "did that do anything?",
outcome only leaves the click feeling dead for as long as the request took.

A share button that copies a link: `IconSwap` rolls the glyph to a check, and a
success toast reports the outcome. **Do not add a second `press`** — `Button`
already carries it, and stacking a second press animation on it is a double
bounce. The interaction utilities in §4 are for surfaces that are *not*
already a Button.

**And ship the failure path.** `navigator.clipboard` rejects on insecure origins
and when permission is denied. A button that silently does nothing is the worst
possible outcome and the one that ships when only the happy path is drawn.

#### Skeletons match the footprint, and swap once

A skeleton must match what replaces it — same height, padding, radius. A generic
grey rectangle where a card will appear is a layout jump, and a layout jump is
worse than the spinner it was meant to avoid. The reliable way to guarantee this
is to render the same component with its content replaced, rather than drawing a
separate "skeleton version" that drifts. Take care where the real content is a
`<p>` or other text element: `Skeleton` renders a `<div>` by default, and a
`<div>` inside a `<p>` is invalid HTML that every guard here passes. Pass
**`as="span"`** where the placeholder stands in for words, and swap the
*wrapper* too where it is the whole block that is loading.

The swap is **one** event: `anim-enter` on the arriving content. It springs
because content replaced content in the same slot. Fading the skeleton out and
then fading the content in animates one thing twice and reads as a glitch.

Use a **skeleton** when you know the shape of what is coming, a **spinner** when
you do not, and **progress** only when you can honestly say how far through you
are.

#### Disabled states are exempt from contrast — but not from being distinct

`disabled:opacity-45` means 45% of the colour, so the default button measures
about 3.2:1 on light and 4.4:1 on dark. **That is fine.** WCAG 2.1 SC 1.4.3
exempts text that is part of an inactive user interface component, so a disabled
control has no contrast requirement at all.

What matters instead: disabled must be clearly **distinguishable from enabled**
— which is the job the opacity does — and the exemption covers the control only.
Helper text, error text or a label beside it is still active and still has to
clear AA. Do not raise the opacity to "fix" a ratio that was never a failure.

#### A delta is a shape before it is a hue

`Stat` renders a figure and, optionally, how it moved. **The direction must be
legible with every colour stripped out**, which §7 already requires of status
and money direction and which trap 11 explains is not satisfied by a coloured
mark of constant shape. So a delta carries it three ways before colour is
considered:

1. the **glyph's shape** — an up arrow, a down arrow, a dash;
2. the **sign** the component writes onto the number — `+`, `−`, or none;
3. a **visually hidden word** — "Up", "Down", "No change".

Colour is the fourth signal and it is deliberately **not a red/green pair**. The
favourable direction is `text-success-ink`; the unfavourable one is plain
`text-foreground`, the same treatment §1.4 gives money leaving a wallet. Red is
error, and revenue falling 4% is news rather than a fault.

**Which direction is favourable is not something a component may assume.**
Churn, refund rate and latency all improve by falling. `Stat` takes
`betterWhen="up" | "down"` for exactly that reason: without it, the default
green-for-rising is a lie the component tells on every metric where up is bad.

The specimen page proves this rather than asserting it — the same three deltas
are rendered a second time under `grayscale`, and they still read.

#### The toast lives in `.cn-toast`, and so does its preview

Sonner ships its own stylesheet — a 13px system font stack, a hardcoded
`rgba(0,0,0,.1)` shadow, its own radius. Every visual decision is overridden in
one `.cn-toast` block in `globals.css`, so a toast is made of the same tokens as
everything else.

- **The selector repeats the class three times.** Sonner's rules are
  `[data-sonner-toast][data-styled="true"]` (0,2,0) injected into `<head>` at
  runtime, so a plain or even doubled `.cn-toast` ties and loses on source order
  — silently, with no error. Three classes is 0,3,0 and clears it.
- **The Toaster reads `resolvedTheme`,** never `theme`. `theme` can be the
  string "system", which sonner understands but then resolves with its own
  matchMedia query rather than ours — so a user on "system" could get sonner's
  light palette under our dark one. `resolvedTheme` is always the concrete
  value `<html>` is actually wearing. It was pinned to `"dark"` while the
  system was dark-only; that stopped being right the moment light mode existed.
- **`ToastPreview` renders the real markup,** minus the `data-sonner-toast`
  attribute that carries sonner's fixed positioning. It is not a mock-up: it
  shares the `.cn-toast` block, so a change moves the preview and the live toast
  together. Verified by measuring both — width, padding, radius, size, colours,
  border, shadow and action button are identical.
- **Colour appears on the glyph and in the bloom.** Everything else stays
  neutral. Success is emerald (§1.4, green marks money in), warning is amber
  (§1.5), error is red, loading is the action blue — and **every one of the five is the
  `-ink` token, never the raw hue.** The glyph is text as far as §1.3 is
  concerned: all five used to name the raw hue and, measured on `--popover` in
  light, success was **2.54:1**, warning **1.67:1**, info **1.81:1** and loading
  **1.85:1** — the one mark that says what kind of thing happened, invisible in
  half the system. They are now 5.48, 5.02, 5.36 and 10.58. The bloom keeps the
  raw hue, because a bloom is light and not a letter.

The bloom itself is `bloom-cosmic` — see below. A toast type sets `--bloom-1`
and `--bloom-2` and nothing else.

#### Alert: one surface, five meanings

**Every Alert variant shares the same background, border and text colour.** What
changes is the icon colour and the two bloom hues — three declarations, nothing
else. Stock shadcn tints the whole card and recolours the copy; that was wrong
here for two reasons. Five differently-tinted cards on one page read as a traffic
light rather than as one component, and body text is the least legible place to
spend a hue (a hue on its own tint especially). Putting the signal in the glyph and
the light keeps every word at full contrast and still tells you what kind of
alert it is from across the room.

#### `bloom-cosmic` — the drifting iridescence

The cosmic texture that lifts a toast or an alert off being a flat rectangle.
A light source entering from the trailing
edge, colour-separated, slowly moving. **One utility, used by Toast and Alert, so
the two can never drift apart.** Set `--bloom-1` (core) and `--bloom-2`
(companion); the geometry is written once.

Four things decide how it looks, and every one of them was learned by getting it
wrong first:

1. **Two layers, counter-rotating at different speeds.** `::before` is the deep
   field — big, dim, 18s. `::after` is the near field — tighter, brighter, 11s,
   lit toward white. Because they never line up, the surface never repeats and
   the eye reads two distances instead of one flat wash. **One layer alone looks
   like a coloured smudge no matter how it is tuned.**

   **The rotation is what sells the movement.** Translate and scale alone read as
   a panel sliding behind a window; rotating a blurred blob field makes the
   colours appear to move *through* each other. Both run `alternate`, so they ease
   to a stop and turn around rather than snapping at the loop point — that soft
   turnaround is the difference between silky and repetitive. Rotation needs
   headroom: the layers overhang far enough that their corners never swing into
   view.
2. **`mix-blend-mode: screen`.** Mixing a colour toward `transparent` over a
   near-black surface only ever gets *darker* — the first version was muddy for
   exactly that reason. Screen adds light. This is the opposite call to the
   premium button (§3), which rejected screen because value-over-value washes to
   white; here it is colour on near-black, which is the case screen is for.
   The corollary bit the second attempt: **under screen a stop mixed toward black
   contributes nothing, so shrinking the core or darkening the bed dims the whole
   bloom** rather than focusing it. Keep the bright half of each gradient wide and
   let it fall to black late.
3. **A radial mask, not a linear one.** A linear fade leaves hard top and bottom
   edges where the light meets the surface, which reads as a coloured rectangle
   however soft. The layers also overhang on three sides so only the falloff is
   ever visible.
4. **The two hues must not overlap.** Thrown to opposite diagonals they read as
   prismatic; stacked on the same spot they collapse into one smudge.

**The brightest point lives in the bottom-right corner and stays there.** Both
layers set `transform-origin` on that corner, so rotation and scale swirl the
field *around* the hot spot instead of carrying it away, and the near layer
translates by only ±3% — a tenth of the deep layer's travel. The corner breathes
and turns; it never wanders off or goes dark. The mask is centred low for the
same reason: the falloff is gentlest around that corner and steepest away from
it.

**Hover swells it.** Pointing at a toast or an alert pushes the light out to
roughly half the surface over a full second, and it recedes just as slowly —
`--duration-bloom`, not a control duration. Two constraints shape how:

- **It must use the standalone `scale` property, never `transform`.** Both layers
  run a `transform` animation, and an animation beats a plain declaration, so a
  `transform: scale()` here is ignored outright. `scale` composes with the
  animated `transform`, letting the drift keep running underneath the growth.
- It grows from `transform-origin`, i.e. the bottom-right, so the hot corner
  stays put and the light reaches inward instead of sliding across.

> **Sonner owns `::before` and `::after` on a live toast.** It sets a fixed
> `height` on both under `[data-swiping]` and `[data-expanded]`. Our selector
> outranks its — but only for properties we actually declare. Omitting `height`
> let sonner pin the near layer to ~15px the instant you hovered the stack, and
> the bloom vanished. Both layers now declare `height: auto` for that reason
> alone. **If a sonner state ever changes the bloom, this is the first thing to
> check: which property did we not declare?**

**Size the layers with a cap, not a bare percentage.** A toast is 356px and an
alert is 742px; the same 86% is 306px on one and 638px on the other, so an
uncapped bloom floods the wider surface and ends up under the text.
`min(86%, 21rem)` keeps it a corner light of roughly fixed physical size.

The utility sets `overflow: hidden` itself — the layers overhang on three sides,
and a host that forgets to clip spills light past its own rounded corner, which
is a silent and ugly failure. It sets no `position`: grid and flex items honour
`z-index` without one, and forcing `position: relative` would break `AlertAction`
and drop the live toast out of sonner's transform-laid stack. The consumer
supplies the containing block.

**It is CSS, not a canvas,** for two independent reasons: sonner builds
the live toast's DOM and offers no slot to mount a canvas into (and
`toast.custom()` would break preview-equals-live), and the textured zone is
~160×72, which the 0.5× blit renders at 80×36 — the same too-few-pixels problem
that sent the premium button to `foil-value`.

#### Sidebar: the contract, and what a rebrand must not break

The largest component in `ui/` — twenty-three exports — and the one most likely
to be regenerated from upstream, which is why its rules are written down rather
than left in the file.

1. **All eight colours are references, not values.** `--sidebar` is
   `var(--card)`, `--sidebar-foreground` is `var(--muted-foreground)`,
   `--sidebar-accent` is `var(--accent)`, `--sidebar-border` is `var(--border)`,
   `--sidebar-ring` is `var(--ring)`, and the two primaries mirror `--primary`.
   Change the system token and the sidebar follows; there is no second edit. To
   make the panel stop matching `--card`, repoint that one line.
2. **`--sidebar-accent` is `--accent`, not `--muted`.** §1.1 gives `--accent`
   exactly one job — a hover surface — and hovering a nav row is that job.
3. **`text-sidebar-foreground` is never dimmed.** It resolves to
   `--muted-foreground`, already the lightest step clearing AA on both
   `--background` and `--muted`. Stock renders group labels at 70% of it, which
   rasterises to 2.76:1 against the 4.5:1 it owes.
4. **Active is fill and colour, never weight.** The size class carries weight
   500 already, so a second weight is typography assembled at the call site —
   and a heavier label is a wider label, so every activation nudged the row.
   `check:tokens` rejects the shape outright now.
5. **The row ladder is 24 / 32 / 48**, and everything inside a row is derived
   from it: the actions and the badge are 24px squares at offsets
   `(row − 24) / 2` — 0, 4, 12. Stock's `sm` row is 28px, which is off the
   8-point scale and forces every offset off it too.
6. **The three widths are tokens** — `--width-sidebar`, `--width-sidebar-icon`,
   `--width-sidebar-mobile` — not string constants in the component.
7. **A `.type-*` class cannot be used through a `data-[…]:` variant.** The type
   scale lives in `@layer components`, and Tailwind only generates variants of
   utilities it knows, so `data-[size=md]:type-nav` emits nothing at all — every
   guard stays green while the size silently falls back to inherited.
   `SidebarMenuSubButton` picks its class in TypeScript for exactly this reason.
8. **`npx shadcn add sidebar` will fail the build**, and that is the point: the
   regenerated file brings back stock's weights and geometry, and
   `composed-typography-call` catches it. Sweep it back onto the scale before
   committing.
9. **Every button in the sidebar is `Button`** — trigger, group action, menu
   action, menu button, sub-button — so they inherit `press`, the focus
   ring, the disabled treatment and the press scale rather than reimplementing a
   subset of each. `SidebarRail` is the deliberate exception: a 16px invisible
   drag strip with no label is not a control, and pill padding plus a focus ring
   would make a resize handle look like one.
10. **Row typography and icons follow `Button`'s ladder**, while sidebar rows
    use natural height and `p-2` at every size. Badges and actions center
    geometrically at 50%.
11. **The menu button defaults to `ghost`; explicit variants stay explicit.**
    `variant="default"` is the real primary Button, `premium` is the real value
    Button, and so on. Never map several public variants back to one treatment.
12. **The selection travels on a quiet system surface.** The menu owns one
    secondary pill; ghost rows never paint an active background. Explicit
    Button variants paint themselves normally above it. Atmospheric bloom is
    reserved for feedback surfaces, not a navigation row that lives all session.
13. **Sidebar variants are the canonical variants.** Menu buttons, sub-buttons,
    group actions and menu actions take every `Button` variant without mapping
    or imitation. Menu badges render `Badge` and take every Badge variant. The
    sidebar owns only placement, collapse behaviour and spacing around them.
14. **`NavUser`'s `icon` is a `ReactNode`, not a `LucideIcon`.** It is a client
    component and the pages using it are server components; a component
    reference is a function, and functions cannot cross the RSC boundary. Pass
    `<BadgeCheck />`, not `BadgeCheck`.
15. **The breathing room belongs to the primitives.** Header and footer use
    `p-3`, groups use `p-3`, and menus use `gap-1`. Row padding is equal on
    both axes at every size: 8px. Do not
    compensate with one-off specimen wrappers.
16. **The footer pins itself.** `SidebarFooter` carries `mt-auto`, so utilities
    and account controls remain at the panel floor even when a caller omits an
    explicit flex-growing `SidebarContent`.
17. **A collapsible group has three honest zones.** `SidebarCollapsibleGroup`
    renders the title, a divider-line disclosure trigger, and an independent
    group action. Only the line toggles `CollapsibleContent`; the action never
    doubles as disclosure. The open/close motion comes from the canonical
    `Collapsible` primitive and its shared `anim-expand` / `anim-collapse` pair.

### Product — wherever you put it

**There is no product family in this repo, and that is the delivered state.**
Several shipped here while the system was being drawn — cloud operations,
back-office, creator campaigns, personal health — and every one of them was
removed, which is the instruction §10 gives anyone lifting this system somewhere
new. Yours goes beside `ui/` and `agent/`, never inside `ui/`.

The shape a product family takes: **stateless** — the page owns selection — and
**composing** base components rather than forking them, so a token change still
reaches it.

What those families proved is kept below, because the rules outlived the code.

**Not one visual value belongs to the family.** The cards were `glass-panel` +
`rounded-4xl`, the status chips `Badge`, the bars `Progress` with a `tone`, the
figures `.type-number-xl`. The two things that did not exist — a tone on the bar,
and a `loading` state on `AlertDialogAction` — were added to the base components
rather than reimplemented in the family. Carry the state model in full in the
component's own doc comment: rest, hover, focus-visible, pressed, loading,
success, error, disabled, empty, with a written reason on each N/A.

**Two shells in two route groups is a real answer, not over-engineering.** A
glance surface is one 448px column, the same shape at every width, no chrome —
right when the screen is three cards read in five seconds, and stretching it to
1200px would put a metre of empty space between a number and its bar. Everything
behind it is a console, and a console uses the complete `Sidebar` composition,
which is what makes it responsive for free: on a phone the primitive renders
itself as an off-canvas `Sheet` behind the header's trigger, on a tablet it
collapses to the 48px icon rail with tooltips, on a desktop it is the full 256px
panel. There is no `useIsMobile` and no width branch in any page — the grids are
`sm:grid-cols-2 xl:grid-cols-4` and `lg:grid-cols-2`, so the same tree renders at
every size and nothing can hydrate differently from what the server drew.

**One trap worth writing down, because a green build hides it.** A recharts
`ResponsiveContainer` reports a min-content width, and a flex or grid child
defaults to `min-width: auto` — so a chart panel pins itself open at the width
it first measured and the whole page scrolls sideways on a phone. Measured at
390px: a 438px panel in a 390px viewport. `min-w-0` on the panel and on the
`ChartContainer` is the fix, and nothing but a narrow viewport will tell you.

**And unhappy paths must be reachable through the product, not through a debug
switch.** Syncing a device that is out of range fails because it is out of range;
a twelve-month view is empty because the account is not a year old; deleting
everything is refused while an export is running. Have each view accept its
loader and its writer as optional props defaulting to the real ones, so a
specimen or a test can hand it a failing one and get the genuine error state on
the genuine component. Nothing is random: a view that fails one time in five is a
view whose error state you cannot get back to.

### Agent — `components/agent/*`

The `AgentWorkspace` — history, header with the avatar, the reply thread with its
run inline, and a composer, composed from Vercel AI Elements — pointed at a
transport the product supplies. Hand-written like `unique`, product-agnostic like
`base`, which is why it is neither. See `docs/agent-workspace.md`.

It is the part of this system most likely to be lifted whole, so the boundary is
enforced rather than assumed: **`core/` imports nothing** — not React, not an
SDK, not a component — and the only things the rest reaches for are `cn` and four
`ui/*` primitives.

Four seams, and everything specific arrives through one of them: `transport`
(what it talks to), `avatar` (what it looks like), `speech` (what it sounds like)
and `toolStates` (what its tools mean). `lib/agent/mock-transport.ts` implements
the first one completely and offline; read it before writing a real transport.

The agent is the **action ramp**, because the agent acts (§0). `--agent`
resolves to action-*bright* rather than the fill, since it is read as a
foreground far more often than as a fill and §1 forbids the fill as text. One knob,
`--agent-cube-accent`, recolours all twenty-six avatar scenes.

A transport that also has a **run model** (`core/run.ts` — a plan, effects,
checkpoints, a queue, a handoff) gets the run drawn inline in the reply that
started it. Every control is gated on the matching `TransportCapabilities` flag
AND the method existing, never on one alone — a transport that does not advertise
`plans` gets no plan UI, full stop. The avatar's twenty-six states include six
added for this model (`paused`, `cancelling`, `undoing`, `partial`, `handoff`,
`offline`). See `docs/agent-workspace.md`'s "The run model". AI Elements is
Apache-2.0 (`components/ai-elements/NOTICE.md`); nothing in the family is
site-only, and the registry ships it as the `agent-workspace` block.

Two rules of its own, both about honesty:

1. **Never advertise a capability the transport does not have.** A paperclip that
   means "we sent the filename" must not look like one that means "we sent the
   file" — which is why an `Attachment` carries `delivery` and the transcript
   renders it.
2. **Anything irreversible stops at an approval card**, described in a sentence a
   human can decide on rather than as an action name and a JSON blob.

### Rules

1. **Never fork a base component to make a product one.** Wrap it.
2. **A component leaves `ui/` when it encodes product meaning** — money,
   scarcity, chance, progression — rather than just a shape.
3. **Every product component ships its full state set**, including the unhappy
   ones: sold out, pending, empty, failed.
4. **A compound control reuses the system control; it does not redraw it.** If a
   questionnaire, table or agent surface needs a radio, checkbox, button or
   input inside a larger interaction, compose the shared control or extract its
   visual chassis and mark for both consumers. Copying the same classes into a
   second `<span>` is still a fork: the next size, shadow or animation change
   reaches only one copy. Questionnaire choices therefore share
   `radioControlClassName` / `RadioIndicator` and
   `checkboxControlClassName` / `CheckboxMark` with the base controls while
   retaining the questionnaire package's native input semantics.
5. **Icons only through `Icon`** (`components/ui/icon.tsx`). It forces a size, a
   tone and an accessibility decision. Lucide only — no second icon set, no
   emoji as UI.

   **One carve-out: reactions.** `BubbleReactions` takes emoji, because a
   reaction *is* the emoji — the user picked 🔥 rather than picking "fire", and
   redrawing their choice as a monochrome Lucide stroke changes what they said.
   That is the line: an emoji standing in for an icon is still banned, an emoji
   that is itself the content is not. It stays an exception rather than a
   softening of the rule — the accessible name still carries the meaning
   (`8 reacted with a heart`), so nothing depends on the glyph rendering.
6. **Format currency through one helper**, never inline. A product that formats
   money in nine places formats it nine ways.

---

## 6. Where literals are allowed

One system, split across four files, and only these:

| File | Why |
|---|---|
| `styles/tokens.css` | Faces, the brand ramps, the shadcn semantic mapping, both theme blocks, `@layer base` |
| `styles/typeset.css` | Every `.type-*` role and the `.prose` flow |
| `styles/motion.css` | The duration and easing scale, every `@keyframes`, the motion utilities, both reduced-motion blocks |
| `styles/utilities.css` | The sanctioned effect utilities and surfaces |

`app/globals.css` is the entry `components.json` names and nothing else: the
four imports above, plus the `@source` exclusions. It is still on the guard's
allow-list, but only because two class-shaped rules cannot tell an import
specifier or a documentation comment from a use — it holds no literal of its
own, and `test/foundation/token-source.test.ts` fails the build if it grows a
`@theme`, `@utility`, `@keyframes` or `.type-*` rule.

**The order of the four imports is load-bearing** and the same test asserts it:
tokens → typeset → motion → utilities. Tokens are declared before typeset and
motion read them, and utilities is last because its unlayered rules exist to
win (trap 5).

These four were one file, `app/globals.css`, until the stylesheet boundaries
were established. Before that there were four of a different kind: three held
shader-recipe data — GPU inputs rather than design tokens, which was a
legitimate exception while the product lived here. The product is gone and the exception went with it. Adding a file
back to this list should feel expensive; prefer `allow-hardcoded` on the
specific line, with a reason.

**Nothing else is exempt — including the vendored shadcn components.** They used
to be skipped on the grounds that `npx shadcn add` regenerates them. That
exemption was hiding thirteen real violations in the files a new project
inherits first: Tailwind durations in `sidebar`, `text-[0.8rem]` in `calendar`
and `toggle`, `rounded-[2px]` in `tooltip` and `chart`. The cost of removing it
is that regenerating a component fails the check until it is swept back onto the
tokens, which is the only way to find out that stock values came back.

An arbitrary value that computes from a token — `rounded-[calc(var(--radius)-3px)]`
— passes, because it is still token-driven. So does `rounded-[inherit]`, a
keyword rather than an invented value.

There is no suppression marker and no exempt file: `scripts/check-tokens.mjs`
has an empty `VENDORED_EXEMPT` set and `isAllowed()` returns false. A value that
genuinely cannot come from a token becomes a token, an asset under `public/`, or
a different implementation — never a marker.

### What the guard checks

| Rule | Catches |
|---|---|
| `hex-colour` / `rgb-colour` | `#7c3aed`, `rgba(…)` |
| `arbitrary-font-size` / `-tracking` | `text-[13px]`, `tracking-[0.1em]` |
| `arbitrary-duration` / `-radius` | `duration-[220ms]`, `rounded-[14px]` |
| `stock-palette` | `bg-red-500`, `border-gray-700` — a second colour system |
| `literal-bw` | `text-white`, `bg-black/40` |
| `state-colour-as-text` | `text-destructive`, and `color: var(--color-warning)` — §1.3's `-ink` rule, the one colour rule about a token that *is* ours. The declaration half runs on the `styles/*.css` files too |
| `stock-duration` | `duration-300` — Tailwind's scale, not ours |
| `foreign-animation` | `animate-bounce` — anything not defined in `styles/motion.css` |
| `composed-typography` | `type-small font-semibold` — the weight belongs in the class |
| `composed-typography-call` | the same pair split across one `cn()`/`cva()` call — a base string setting `data-active:font-medium` and a size variant twelve lines below setting `.type-nav`. Only fires on files already using the scale, so unswept vendored components stay silent and a file enrols itself the moment someone sweeps it. Sizes are **not** matched: §2.1 permits the four aliases |
| `arbitrary-easing` / `-ring` | `ease-[cubic-bezier(…)]`, `ring-[3px]` |
| `arbitrary-spacing` / `-shadow` | `p-[3px]`, `shadow-[0_0_4px]` |
| `untokenised-easing` / `-duration` | a raw curve or bare `300ms` in any `animation:` |
| `unverifiable-motion` | an interpolated `animation:` with no `allow-dynamic-motion` |

`check:refs` is the second guard and catches the opposite failure — a class or
`var()` that was named but never defined. Both fail silently in the browser, and
only one of them is about values written by hand.

---

## 7. Accessibility contract

- Focus is always visible and never removed.
- Every text colour clears AA on the background; the colours page **measures**
  this live rather than claiming it.
- Status and money direction each carry **two or more non-colour signals** —
  a glyph and a label, never a hue alone.
- Icon-only controls require `label` (Icon) or `aria-label` (Button).
- Errors ship `aria-invalid` + a written `FieldError` + `aria-describedby`.
- Progress bars carry `role="progressbar"` and a real value label.
- Destructive actions use `AlertDialog` and state the consequence **in the
  button** — "Sell all for $2,481.00", not "Confirm".
- Swipe always has a tap and keyboard fallback.
- **Hit targets ≥ 44px, with one deliberate exception.** The default `Button`
  is 40px, because it has to sit level with a 40px `Input` and the pair is the
  most common row in the system. Where a control is the *primary* target on a
  touch surface, use `size="lg"` (48px) rather than shrinking the input to
  match. Icon-only controls never go below 40px, and anything at 32px
  (`size="sm"`) belongs in a toolbar beside other small controls, never alone
  as the main action.
- **A control nested inside another control** — a dismiss ✕ on an alert, a clear
  ✕ in an input — is exempt from the 40px floor on its *visual* size, but not on
  its *hit* area. Draw it as small as the composition needs and give it back the
  target with negative margin, then measure: `-my-2` and `-my-3` differ by 2px
  and will silently drift from whatever you intended.

---

## 8. Content style

Short, direct, confident. **Open Pack**, **Sell Selected**, **Request
Withdrawal**, **Claim Reward**.

Never: *Proceed*, *Continue Process*, *Execute*, *Submit Action*.

Write the consequence into destructive buttons, and phrase the cancel option as
the safe choice — "Keep my cards", not "Cancel".

---

## 9. Before you claim it works

```bash
npm run verify
```

registry:build → check:tokens → check:rules → check:provenance → check:refs →
check:registry → typecheck → lint → build. All of them, every time.

**That is the floor, not the ceiling.** The guard is good at what it does — no
hardcoded colour, type, spacing, radius, shadow, duration or easing, across
every file in `app`, `components`, `lib` and `hooks` — but there are four
classes of failure it structurally cannot see, and
every one of them has shipped here on a green build.

### 1. Dead references

The guard looks for hardcoded values. It cannot look for references that resolve
to **nothing**, and those fail silently: Tailwind drops unknown classes without
a word, and CSS drops any declaration containing an undeclared variable.

`shadow-btn-lime` (the token is `--shadow-btn-value`) left the premium button
with no shadow at all, and a second incident took a colour reference down the
same way — both passed for weeks. Specifics in
[`docs/references/rules-rationale.md`](docs/references/rules-rationale.md#dead-reference-incidents).

Cross-check every `shadow-*`, `anim-*` and `var(--*)` you wrote against its
definition, and confirm in the browser — if `getComputedStyle` says `none`, the
class does not exist.

#### The built stylesheet is the only authority on whether a class resolves

The two above were dead because **nothing defined them**. The opposite mistake is
now on record too, and it cost more: two pieces of work were planned, briefed and
half-written to "fix" `data-open:` and six `scroll-fade-*` / `scrollbar-*`
utilities that had never been broken. Both were withdrawn. The reason to write
this down is that a *false* dead-reference report is more expensive than a missed
one — it produces a confident sweep through working code.

**`app/globals.css` is not the whole stylesheet.** Its first three lines are
`@import "tailwindcss"`, `@import "tw-animate-css"` and
`@import "shadcn/tailwind.css"`, and the last of those defines things this repo
uses and does not declare:

- Nine `@custom-variant`s. `data-open`, `data-closed`, `data-checked`,
  `data-unchecked` and `data-active` each match **both** the `data-state="…"`
  form Radix emits and a bare `data-*` attribute; `data-disabled` matches the
  bare attribute but not `data-state`; **`data-selected` is narrower than
  either** — it is `&:where([data-selected="true"])` and nothing else, so
  `data-selected:` against a bare `data-selected` attribute is silent;
  `data-horizontal` and `data-vertical` match `data-orientation`. So
  `data-open:anim-open` on a Radix element is not a dead variant — it is the
  shim doing its job.
- The whole `scroll-fade-*` and `shimmer-*` families, and `no-scrollbar`.

Tailwind v4 itself supplies `scrollbar-none`, `scrollbar-gutter-stable` and the
`scrollbar-thumb-*` / `scrollbar-track-*` colours (verified in
`node_modules/tailwindcss`, v4.3.3).

So neither of these answers the question, and both were used to conclude that
working classes were dead:

- **`grep` in `globals.css`** answers "is it defined *here*", which is a
  different question from "does it resolve".
- **compiling a bare `@import "tailwindcss"`** omits the project's own two other
  imports, and will report every shimmed variant and both shadcn families dead.

`check:refs` does not close this either, and is not meant to: it validates the
namespaces **we** own (`anim-*`, `glow-*`, `ramp-*`, `.type-*`, `--color-*`),
which is why it has never had an opinion about `scroll-fade-*`.

The check is the build:

```bash
npm run build && grep -o '[^{}]*<class>[^{}]*{[^}]*}' .next/static/chunks/*.css
```

Emitted means alive. Absent means dead **or never referenced** — a class Tailwind
never saw is not evidence of anything, so put it on an element first, then build,
then grep. State which of the two you established.

Run against the variant that was reported dead, the build answers outright:

```css
.data-open\:anim-open:where([data-state=open]),
.data-open\:anim-open:where([data-open]:not([data-open=false]))
  { animation: ds-open var(--duration-open) var(--ease-emphasized) both }
```

**One qualification, and it cuts the other way: a prose file can put a class in
the bundle.** Tailwind v4 scans every tracked, non-binary, non-gitignored file,
markdown included — so a class *named in a document* is extracted and emitted as
if it had been written on an element. This file's own don't-do-this table was
shipping `.bg-red-500`, `.animate-bounce` and `.duration-300`; a planning note
was shipping the arbitrary `bg-[oklch(from var(--primary) …)]`
that §1 forbids, out of the diff that removed it. `app/globals.css` now carries
`@source not "../**/*.md";` to close that, and the exclusion is what makes
*emitted* mean *referenced from code*. If you reinstate markdown as a source, this
whole check weakens to "someone somewhere typed this string".

### 2. Both themes, in a real browser

Not "it compiles". Open it and flip the toggle. **Light is where the bugs live**,
because this system was drawn in the dark and light was added afterwards. Check
every foreground on every surface, the shadows (light uses slate at a fifth the
opacity), and anything on a blend mode — `screen` is invisible on white.

Screenshot both. It is the cheapest proof there is — **when you can get one**.
A browser pane that is not displayed does not composite, and every screenshot
call against it fails; the same freeze makes a mid-transition computed style
unreliable. That is a normal condition here, not a fault. When you hit it,
substitute **structural proof** — box heights across states, computed colour in
both themes, `getAnimations()` rather than a frozen `opacity`, no horizontal
overflow — and say in your report that you measured rather than looked. Do not
claim a visual check you did not make.

### 3. Contrast, measured rather than eyeballed

Two tools, and they are not interchangeable:

- **`useContrast`** in `components/ds/token-swatch.tsx` is a React **hook** that
  takes **token names** — `useContrast("--color-action-ink")`. It reads the live
  stylesheet and re-measures on theme change, so a specimen page can print a
  ratio that cannot go stale. It cannot be called from a console probe.
- **Rasterising** a 1×1 canvas is what you want from a browser probe, for any
  real element, and it is the *only* way to read a `color-mix()` or a blended or
  opacity-composited colour — those compute to `oklab()` and cannot be parsed as
  RGB. A contrast ratio in the millions means you parsed one as RGB.

**Disabled controls are exempt** — WCAG 2.1 SC 1.4.3 excludes text that is part
of an inactive component, so the default button's ~3.2:1 is expected and is not
a defect to chase. Check instead that disabled reads as clearly different from
enabled, and that any *active* helper or error text beside it still clears AA.

A colour from `color-mix()` or under a blend mode has to be **rasterised** to be
read: it computes to `oklab()`, which cannot be parsed as RGB. Paint it into a
1×1 canvas and read the pixel.

### 4. Reduced motion

Turn it on and look. The blanket rule collapses animations to a single frame,
which is right for most of them — but any keyframe that *ends* at `opacity: 0`
freezes to nothing and needs handling of its own.

### Then report honestly

Distinguish **measured** from **looked at** — both are legitimate, conflating
them is not. Name what you did not check. Never state a contrast ratio you did
not compute: this system's premise is measured-not-asserted, and a confident
wrong number does more damage than an admitted gap.

> Agents: the `elattar-uiux-design` plugin (`plugins/elattar-uiux-design/`)
> carries this gate plus the ordered workflow that leads up to it. Use it before
> building any UI.

---

## 10. Taking this into another project

This system is meant to be lifted. What to change, in order:

1. **The four files under `styles/` are the whole system.** Colour, type,
   radius and shadow live in the `@theme static` block at the top of
   `styles/tokens.css`; motion lives in the `@theme static` block at the top of
   `styles/motion.css`. `styles/typeset.css` holds the type roles and
   `styles/utilities.css` the sanctioned effects. `app/globals.css` is the entry
   that imports the four in that order and holds nothing else — see §6. Rebrand
   by editing token *values* — never by editing components.
2. **Keep the token names.** They are shadcn's, plus a small brand set
   (`--color-action-*`, `--color-value-*`, `--color-success|warning|info`). A
   component reads `bg-card`, not `bg-zinc-900`, so a retheme is one file.
3. **`npm run check:tokens` is the contract.** Nothing is exempt — see §6. Run
   `npm run verify` before claiming anything works.
4. **There is no product family left to delete.** That step is already done —
   `components/ui/*`, `components/agent/*` and the foundations are all generic
   and travel as-is. Add your product's own family beside them and keep it out
   of `ui/`.
5. **The one rule in §0 is the system** — nothing is hardcoded, everything comes
   from a token. Drop it and this stops being a design system and becomes a
   folder of components. (`AGENTS.md` expands it into seven non-negotiables for
   day-to-day work; they are all that rule applied to a different axis.)

> **`npx shadcn add` will fail `check:tokens`.** That is deliberate. Stock shadcn
> is not on this spacing scale, this type scale, or this motion scale, and a
> regenerated file quietly reintroduces all three. Sweep it back onto the tokens
> before committing — §3 lists the values it gets wrong most often.

Two real incidents where a selector-level regression passed every guard, and
the outstanding measured-number decisions that a future rebrand must
re-derive rather than assume, are recorded in
`docs/references/rules-rationale.md` rather than here — that history is worth
keeping but is not itself a rule to enforce.
