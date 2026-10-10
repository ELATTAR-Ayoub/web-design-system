# RULES.md — rationale and history

This file holds the deep history and investigation notes that used to sit
inline in `RULES.md`. `RULES.md` stays enforceable rules with a short
rationale; the "why we found this the hard way" material lives here instead,
linked from the relevant section.

## Dead-reference incidents

`RULES.md` §9's "Dead references" trap keeps the enforceable rule: cross-check
every `shadow-*`, `anim-*` and `var(--*)` you write against its definition,
and confirm in the browser rather than trusting a green `check:tokens`. These
are the two incidents that motivated it.

- **`shadow-btn-lime`** (the token is `--shadow-btn-value`) left the premium
  button with no shadow at all — the class was referenced in a component but
  never defined, so Tailwind silently dropped it.
- **`--color-foreground-subtle`**, named in a comment and declared nowhere,
  made the (now-retired) `.type-label` and `.type-micro` roles silently
  inherit their colour instead of setting it explicitly. Both class names
  predate the typography migration in `global-constraints.md` — `label` and
  `micro` are retired roles now folded into `body`/`small`.

Both passed for weeks because a missing CSS custom property produces no
build error; the declaration containing it is simply dropped.

## §10 "Taking this into another project" — read-the-diff history

`RULES.md` §10 keeps the enforceable half of this: `npx shadcn add` will fail
`check:tokens`, and that is deliberate — sweep any regenerated file back onto
the tokens before committing. What follows is why that check alone is not
enough, and two real incidents that got past it.

> **A failing check is the loud half. Read the diff for the quiet half.** A local
> fix that changes a *selector* rather than a value reverts silently: nothing
> flags its absence, because nothing flagged its presence. Two files in
> `components/ui/` currently carry one.
>
> - **`chart.tsx`** adds `.recharts-cartesian-axis-tick-value` and
>   `.recharts-polar-angle-axis-tick-value`. Stock's
>   `.recharts-cartesian-axis-tick text` matches **nothing** in recharts 3.8 —
>   the `<text>` moved into a sibling `Layer`, and
>   `querySelectorAll('.recharts-cartesian-axis-tick text').length` is **0** on
>   the charts page. So every axis label kept recharts' own fill. Measured by
>   cloning a live tick out of the chart container so our selector stops
>   matching, then rasterising: cartesian `#666` is **3.46:1** on `--background`
>   in dark, polar `#808080` is **3.95:1** in light — each theme failing on one
>   family — against **13.46:1** dark and **4.83:1** light with the fix. No guard
>   can defend this one: only the library's own DOM knows which selectors answer.
> - **`field.tsx`** writes `text-destructive-ink` on `FieldError` and on
>   `fieldVariants`. That one *is* defended, by `state-colour-as-text` (RULES §1.3).
>
> Both are documented in a comment at the site, naming the version they were
> measured against. That comment is the whole defence.

### Known outstanding work

1. **The foil band is a measured number, not a constant.** `foil-value`'s
   darker middle band is 42% of `--color-value-dark` because that is what clears
   AA against the foil's ink *on lime*. It had to drop to 30% on a
   lower-luminance value ramp. Any change to the value ramp has to re-rasterise
   every stop of that gradient — no guard can see it, and the failure looks
   exactly like a design choice.
2. **`--primary-foreground` is pure white in both themes, and dark used to be
   zinc 50.** Zinc 50 on the action fill measures 4.39:1 — a 0.11 miss on the
   most-used control in the system, which stood unmeasured for the whole life of
   the blue brand. Pure white is 4.58:1. It clears AA, and it clears it by less
   than a tenth of a point: any future action fill darker than this one fails
   the pair outright, and §1.3's `bg-action-ink` answer is what the thin marks
   already use for exactly that reason.
3. **The reference screen the hero figures were drawn from uses a proportional
   face; this system uses Geist Mono.** §2 is explicit that numerical
   values are mono and tabular, so a mono `7,234` sets its comma on a full digit
   advance and reads looser than the reference does. That is the type system
   winning over a one-page match, and it is a deliberate deviation rather than an
   oversight.
