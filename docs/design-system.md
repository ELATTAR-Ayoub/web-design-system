# Elattar's Design System — Orientation

Short on purpose. [`RULES.md`](../RULES.md) is the law and the `/design-system`
pages are the living proof of every rule in it; this file only tells you where
things are and which three ideas explain the rest.

> This document used to restate the token tables inline. It had drifted — it
> listed `--color-rarity-*` tokens that no longer existed and a `--card` hex that
> no longer matched the stylesheet. Restating a value is how documentation starts
> lying, which is the exact failure the whole system is built to prevent, so the
> tables are gone. Read the tokens where they are defined, or open
> `/design-system/colors`, which measures them out of the live stylesheet.

## Where things are

| Path | What |
|---|---|
| `styles/tokens.css`, `styles/typeset.css`, `styles/motion.css`, `styles/utilities.css` | **The system.** Colour, radius, shadow and spacing tokens; the 19 type roles; durations, easing and named animations; the sanctioned effects. The only files allowed literals. |
| `app/globals.css` | The entry `components.json` names. Imports the four files above, in that order, and holds nothing else. |
| `app/design-system/docs/*` | The rendered guides — introduction, installation, CLI, registry, skills, changelog. Theming and Typeset now use the full foundation pages at `/design-system/colors` and `/design-system/typography`; the former primer URLs redirect there. |
| `components/ui/*` | shadcn primitives on Radix, restyled through tokens only, plus `icon.tsx` and `icon-swap.tsx` |
| `components/agent/*` | A complete AI console — transcript, composer, avatar, voice. Product-agnostic. |
| `components/ds/*` | The documentation site's own chrome: nav, page kit, token swatches, theme toggle, logo |
| `lib/agent/mock-transport.ts` | A working `AgentTransport` with nothing behind it. The reference implementation. |
| `lib/ds/nav.ts` | Single source of truth for the design-system tree, including the `docs` group |
| `scripts/check-tokens.mjs` | The guard. Fails the build on any hardcoded value. |
| `scripts/validate-docs.mjs` | Checks nav/link/command integrity and regenerates `public/llms.txt`. |

## The three ideas

### 1. Roles, not hues

The two brand ramps are `--color-action-*` and `--color-value-*`. Action is the
thing that acts; value is the thing that is worth something. They are blue and
lime today and have been purple-and-gold and wine-and-amethyst, and no component
knew, because no component names a hue.

This is the difference between a rebrand costing five lines and costing seven
hundred. If you take one idea from this system, take this one.

### 2. Ink, not ends

A ramp's text-safe shade is **not the same shade in both themes** — the lifted
end clears AA on near-black and fails on white; the deep end is the reverse.

A component cannot know which surface it is on, so it never chooses. It writes
`text-action-ink`, and the theme block answers. This one indirection is why
light mode landed without adding a `dark:` variant to a single component.

### 3. Measured, not asserted

`/design-system/colors` reads every value out of the live stylesheet and
computes every contrast ratio at runtime, in whichever theme you are looking at.
Nothing on it is typed by hand, so it cannot disagree with the stylesheet — and
when you flip the theme it re-measures, so you can watch the two ends of a ramp
trade places and see one of them fail.

Documentation that restates a value drifts. Documentation that reads the value
cannot.

## Two themes

`next-themes` sets `.dark` on `<html>`; `:root` is light; dark is the default.
Light is not dark inverted — four things genuinely change, all handled in the
`styles/*.css` split so no component carries a variant:

- **Shadow ink** routes through `--ink-1..4`, `--rim`, `--wall`. Black at 60% is
  depth on a zinc-950 page and grime on paper, so light uses a slate-tinted ink
  at roughly a fifth of the opacity.
- **The rim inverts its job** — on dark it is the highlight that makes a button
  look lit; on light the bottom inner shade does the shaping instead.
- **`mix-blend-mode: screen` becomes `multiply`**, at roughly a fifth of the
  alpha. Screen adds light: correct on near-black, invisible on white, and
  multiply at dark mode's opacity is strong enough to eat body copy.
- **`--muted-foreground` is not a mirror.** Chosen by measurement in each theme
  rather than by flipping the other: 13.46:1 / 10.08:1 on dark against
  `--background` / `--muted`, and 6.04:1 / 5.50:1 on light. Zinc 500 missed AA
  on `--muted` by 0.10 for most of this system's life; light sits one step
  deeper than that now.

## Before you claim it works

```bash
npm run verify
```

`registry:build` → `check:tokens` → `check:rules` → `check:provenance` →
`check:refs` → `check:registry` → `typecheck` → `lint` → `build`. All of them, every
time.

**`npx shadcn add` will fail `check:tokens`, and that is deliberate.** Stock
shadcn is not on this spacing scale, this type scale or this motion scale. A
regenerated file quietly reintroduces all three, and a failing build is how you
find out.

The `data-open:`, `data-closed:` and `data-active:` variants in `components/ui/*` only
resolve because `app/globals.css` imports `shadcn/tailwind.css`, which registers them as custom variants.
