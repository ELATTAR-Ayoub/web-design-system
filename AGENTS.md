<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Elattar's Design System

## Building or changing UI? Invoke the `elattar-building-ui` skill first

It carries the ordered workflow — read, inventory, ask, build, verify, document —
and the completion gate for what a passing build cannot prove: dead references,
untested themes, missing states, actions with no feedback. Every trap it
documents has actually shipped here on a green build.

**Read `RULES.md` before writing any UI.** Every rule for this codebase is in
that one file — colour, typography, spacing, motion, components, accessibility
and content style.

`docs/design-system.md` is the short orientation: where things are, and the
three ideas that explain the rest.

Quick orientation:

- Live reference: `npm run dev` → `/design-system`
- Tokens: `styles/tokens.css` (Tailwind v4 CSS-first `@theme`). The system is
  four files — `styles/tokens.css`, `styles/typeset.css`, `styles/motion.css`,
  `styles/utilities.css` — and `app/globals.css` is the entry that imports them
  in that order and holds nothing else. RULES §6 says which owns what
- Base components: `components/ui/*` — shadcn on Radix, restyled via tokens
  only, plus `icon.tsx` and `icon-swap.tsx`
- Agent workspace: `components/agent/*` — a whole AI chat surface, product-agnostic,
  composed from AI Elements. Read `docs/agent-workspace.md`, then `lib/agent/mock-transport.ts` before
  pointing it at a real agent
- DS tree source of truth: `lib/ds/nav.ts`
- There is no product family. Add yours beside `ui/` and `agent/`, never inside
  `ui/`.

Non-negotiables: nothing is hardcoded · one vocabulary, and it is shadcn's ·
light and dark are both complete · action acts, value pays · the brand ramps are
named for their role, never their hue · only `-ink` carries text, and it differs
per theme · glow is rationed · money out is never red.

**Nothing is hardcoded.** No hex, no `rgba()`, no `text-[13px]`, no
`tracking-[0.1em]`, no `rounded-[14px]`, no `duration-[220ms]` — anywhere except
the four `styles/*.css` files, which are where the system is defined. Colour,
typography, radius, spacing and motion all come from tokens. This is enforced:
`npm run check:tokens` fails the build on any violation.

Before claiming work is done: `npm run verify`
(check:tokens → check:refs → check:parity → check:audit → typecheck → lint →
build).
