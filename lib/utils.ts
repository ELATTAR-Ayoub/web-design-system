import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge has to be taught our theme, or it silently deletes classes.
 *
 * `text-*` is ambiguous: it can mean font size or text colour. tailwind-merge
 * resolves that from its built-in list of Tailwind's default sizes. Our scale
 * lives in the `--text-*` theme namespace (`text-body`, `text-number-sm`, …), and
 * without registering it here tailwind-merge assumes anything it does not
 * recognise is a COLOUR — so it treats `text-number-sm` and `text-background` as
 * the same group and drops the earlier one.
 *
 * That is not hypothetical. It shipped: the premium button's `emphasis="caps"`
 * variant added `text-number-sm`, which silently removed `text-background`, and the
 * lime CTA lost its dark label and rendered near-white on lime.
 *
 * Every custom `--text-*` key must be listed below — one per role in the
 * seventeen-role contract. If you add a type size to `styles/tokens.css`, add
 * it here too (trap 4).
 */
const FONT_SIZES = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "lead",
  "body",
  "small",
  "nav",
  "badge",
  "code",
  "identifier",
  "number-sm",
  "number-base",
  "number-md",
  "number-lg",
  "number-xl",
] as const

/**
 * `shadow-*` is ambiguous in exactly the same way, and it bit us the same way.
 *
 * tailwind-merge splits `shadow-*` into two groups: a SIZE group it knows
 * (`shadow-sm`, `shadow-lg`, `shadow-none`, …) and a COLOUR group for anything
 * it does not. Our elevation scale is all "anything it does not" —
 * `shadow-pressed`, `shadow-e3`, `shadow-btn` — so every one of them was filed
 * as a colour. A colour and a size do not conflict, so
 * `cn("shadow-pressed", "shadow-none")` kept BOTH and the later `shadow-none`
 * never won.
 *
 * That shipped, and it is why inputs looked detached from their own containers.
 * `InputGroupInput` sets `shadow-none` precisely so the sunken socket is drawn
 * once, by the group, around the whole control. Instead the inner `<input>`
 * kept `shadow-pressed` and drew a second recess inside the first — a field
 * floating in a field, with the addon icons stranded outside it on the group's
 * surface. Registering the scale here fixes the group, the textarea, and every
 * future component that tries to turn one of our shadows off.
 *
 * Every custom `--shadow-*` key must be listed below. If you add an elevation
 * to `globals.css`, add it here too.
 */
const SHADOWS = [
  "e1",
  "e2",
  "e3",
  "e4",
  "key",
  "key-down",
  "pressed",
  "btn",
  "btn-primary",
  "btn-value",
  "btn-down",
  "chip",
  "glow-action",
  "glow-value",
] as const

/**
 * `rounded-*` is the third one, and it bit us the same way as the first two.
 *
 * tailwind-merge knows Tailwind's own radius names — `rounded-lg`, `rounded-xl`
 * — and files anything else, including our `rounded-pill`, into a different
 * group. Two different groups do not conflict, so `cn("rounded-pill",
 * "rounded-lg")` kept BOTH and the winner was decided by stylesheet order
 * rather than by the author.
 *
 * That shipped: `Button` is `rounded-pill`, and the sidebar's rows — which are
 * Buttons — asked for `rounded-lg`, because a 240px full-width pill is a
 * lozenge rather than a row. The override was simply ignored, silently, with
 * every guard green: `check:tokens` sees a token, `check:refs` sees a declared
 * one, and the class was right there in the DOM doing nothing.
 *
 * Every custom `--radius-*` key must be listed below.
 */
const RADII = ["pill"] as const

export const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...FONT_SIZES] }],
      shadow: [{ shadow: [...SHADOWS] }],
      rounded: [{ rounded: [...RADII] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
