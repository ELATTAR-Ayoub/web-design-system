# The completion gate

`RULES.md` §9 is the gate itself — read it there, once, rather than twice here.
This file holds only the parts that are **operational**: the things §9 requires
that have a technique, a snippet or a known way of going wrong.

## Reading a computed style from a pane that is not displayed

The page is not compositing, so a value read mid-transition can come back
stale — the pre-transition value, or an interpolated one. Read after the
transition would have settled, or trigger the state and read on the next frame.

An agent nearly filed a bug against its own working component this way.

## Measuring a colour that is mixed or blended

`color-mix(in oklab, …)` computes to `oklab()`. `getComputedStyle` hands it back
in that form, and a regex expecting `rgb()` grabs the wrong numbers — which is
why a broken contrast check reports ratios in the millions rather than failing
outright.

Rasterise it. Paint the computed value into a 1×1 canvas and read the pixel:

```js
const c = document.createElement('canvas'); c.width = c.height = 1;
const ctx = c.getContext('2d', { willReadFrequently: true });
ctx.fillStyle = getComputedStyle(el).backgroundColor;  // resolves the mix
ctx.fillRect(0, 0, 1, 1);
const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;   // real sRGB bytes
```

That is how the premium button's worst-case 7.8:1 was established across the
foil's gradient, and it is the method to reach for from a browser probe.

`useContrast` in `components/ds/token-swatch.tsx` is the *other* tool, and it is
not interchangeable: it is a React hook taking **token names**
(`useContrast("--color-action-ink")`), so it only works from inside a rendered
component measuring a token against a surface. Use it when a specimen page
should print a live ratio — it re-measures on theme change, so it cannot go
stale the way a hand-rolled cache did. Use the canvas above for everything else.

## Proving a guard rule works

If you add a rule to `check-tokens.mjs` or `check-refs.mjs`, **inject a
violation, watch the build fail, remove it, watch it pass.** A rule nobody has
seen fail is a rule nobody knows works — and both guards have shipped rules that
silently matched nothing.

Two traps when writing one, both of which have already bitten:

- **Scan class strings, not raw lines.** English is full of hyphenated words
  that look exactly like utilities. A rule reading whole lines flagged fifty
  phrases — "the text-safe end", "every text-entry shape" — and a later one
  flagged `.type-num-*` out of a sentence in `RULES.md` itself.
- **`\b` matches after a hyphen.** `--star-glow-size` contains a "match" for
  `glow-size`. Use `(?<![\w-])` so you match whole names, not tails of longer
  identifiers.

## The built stylesheet is the only authority on whether a class resolves

`grep`ing a source file such as `globals.css` only answers "is this string
written somewhere" — not whether Tailwind actually generated the class, or
whether the declaration that uses it survived (an unresolved `var()` drops
the whole declaration silently; see `references/traps.md` #1 and #13). Build
the app (or run the dev server) and read the class out of the served CSS, or
read `getComputedStyle` on the rendered element, before concluding a class is
live or dead. Treat the built CSS, not a grep of the source, as the ground
truth.

## The one motion escape hatch

If you composed an `animation:` shorthand at runtime, it needs
`allow-dynamic-motion` **with a reason**. That is a different claim from
`allow-hardcoded`: not "this literal is fine" but "this is computed, and here is
why it cannot be a class".

## Reduced motion

Before signing off, also read the browser error log after a fresh navigation.
Hydration mismatches often look correct after React repairs them; locale-sensitive
dates, generated IDs, and theme-dependent server markup are the first suspects.
Separate dependency deprecation warnings from application errors, but record
rather than silently discard them.

The blanket rule collapses animations to one frame, which is correct for most.
Any keyframe that *ends* at `opacity: 0` freezes to nothing and needs its own
handling. Turn it on and look — this one is not detectable any other way.
