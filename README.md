# Elattar's Design System

A token-driven design system in light and dark, built to be lifted into other products — every colour, size, radius and curve comes from a token, enforced at build time.

**→ [`/design-system`](http://localhost:3000/design-system) is the live reference** (`npm run dev` first). **→ [`/design-system/docs/introduction`](http://localhost:3000/design-system/docs/introduction)** is the rendered documentation — start there for the three ideas that explain the rest. **→ Read [`RULES.md`](RULES.md) before writing any UI** — every rule for this codebase is in that one file, and §10 covers taking the system into a new project. **→ [`CHANGELOG.md`](CHANGELOG.md)** records what changed in the current migration, including breaking type-role renames.

Release status: not yet published. `docs/audits/web-component-audit.md` carries the component-by-component release ledger: per-axis evidence, and what is `release`-ready versus `blocked` or `pending`, and why. Accepted dependency advisories and other known limits are in [`docs/known-issues.md`](docs/known-issues.md).

## Install

The system ships as a shadcn-compatible registry — install exactly the files a project needs with the CLI you already have:

```bash
npx shadcn@latest init
```

Then add the foundation item — its exact, copy-pasteable command (read live from the built registry, never typed by hand) is on [`/design-system/docs/installation`](http://localhost:3000/design-system/docs/installation). The foundation installs `styles/tokens.css`, `styles/typeset.css`, `styles/motion.css`, `styles/utilities.css`, `app/globals.css`, `lib/utils.ts` and `components/ui/{icon,icon-swap}.tsx`. Every other item declares it as a registry dependency, so installing any component pulls it in automatically. Every item and its exact install command are listed at [`/design-system/docs/registry`](http://localhost:3000/design-system/docs/registry).

The base URL baked into those commands comes from a single `REGISTRY_URL` environment variable (default `http://127.0.0.1:3200/r` for local dev) — set it to your deployed origin and run `npm run registry:build` to publish a production registry, no code changes needed.

## Your first component

The exact command for any component (e.g. `button`) is on the [Registry](http://localhost:3000/design-system/docs/registry) page. Once installed:

```tsx
import { Button } from "@/components/ui/button";

export function Example() {
  return <Button>Continue</Button>;
}
```

Every base component reads tokens — `bg-card`, not `bg-zinc-900` — so a rebrand is an edit to `styles/tokens.css`, not a sweep through the component tree.

## Architecture

**Nothing is hardcoded.** No hex, no `rgba()`, no `text-[13px]`, no `duration-[220ms]`, no Tailwind stock palette — anywhere except four files under `styles/`, which is where the system is defined: `styles/tokens.css` (colour, radius, shadow, spacing), `styles/typeset.css` (the 17 type roles), `styles/motion.css` (durations, easing, named animations) and `styles/utilities.css` (the sanctioned effects). `app/globals.css` is the entry `components.json` names — it imports the four in that order and holds nothing else.

This is enforced, not aspirational: `npm run check:tokens` fails the build on any hardcoded literal, across every file including the vendored shadcn components. `npm run check:refs` is its mirror — it catches a reference that resolves to **nothing** (an unknown Tailwind class, an undeclared `var()`, a `.type-*` that does not exist), which is otherwise completely silent in a browser.

The exhaustive component ledger and repeatable browser checks are recorded in [`docs/component-certification.md`](docs/component-certification.md).

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind v4 (CSS-first `@theme`) · shadcn/ui on Radix · next-themes · three.js · Lucide

**The two brand ramps are named for their role, not their hue.** `--color-action-*` is the thing that acts — buttons, links, focus, selection, the agent. `--color-value-*` is the thing that is worth something — balances, rewards, rankings, premium actions. They are blue and lime today; they have been other colours, and not one component knew or had to change, because no component names a hue.

**Light and dark are both complete.** Every token, every shadow, every textured effect. `next-themes` sets `.dark` on `<html>`; `:root` is light; dark is the default because it is the mode this system was drawn in. The piece that makes it work is **`--color-action-ink` / `--color-value-ink`**: the text-safe end of a ramp is a *different shade in each theme*, so nothing that renders a glyph ever names an end of the ramp — it writes `text-action-ink` and the theme block answers. **If a colour needs a `dark:` variant, the token is wrong.**

### What's here

| Route | Contents |
|---|---|
| `/design-system` | Hub — foundations index, component families, the hard rules |
| `/design-system/docs/*` | Rendered documentation — introduction, installation, theming, typeset, CLI, registry, skills, changelog |
| `/design-system/colors` | Surfaces, the action and value ramps, text, semantic states, measured contrast ratios in both themes |
| `/design-system/typography` | The two-face system, all 17 type-role specimens, tabular-numeral proof |
| `/design-system/spacing` | 8-point scale, radius ladder, elevation, 12-column grid, breakpoints |
| `/design-system/shadows` | Ambient depth and machine surfaces, and the ink tokens that make both work on either theme |
| `/design-system/motion` | Durations, easing curves and named animations — all running live |
| `/design-system/icons` | The `Icon` component and the curated glyph set, one meaning per glyph |
| `/design-system/components/base` | shadcn primitives restyled through tokens |
| `/design-system/components/agent` | A complete AI console — transcript, composer, avatar, voice |

**Base** is generic chassis any product could use. **Agent** is a complete AI console pointed at a transport you supply — written from scratch, but product-agnostic by construction, so it travels with the system. There is no product family in this repository; add your own beside `ui/` and `agent/`, never inside `ui/`.

## Development commands

```bash
npm install
npm run dev             # localhost:3000 → /design-system
npm run build
npm run typecheck
npm run lint
npm run check:tokens    # literals that should be tokens
npm run check:refs      # token references that resolve to nothing
npm run check:parity    # names, ownership and generated output vs Flutter 0.0.3
npm run check:audit     # the per-capability read, one file per capability
npm run docs:validate   # nav/link/command integrity, regenerates public/llms.txt
npm run verify          # tokens → refs → parity → audit → typecheck → lint → build
```

## Contributing

**[`docs/design-system.md`](docs/design-system.md)** is the short orientation. **[`docs/project-structure.md`](docs/project-structure.md)** lists every folder and what each file does. **[`RULES.md`](RULES.md)** is the law — read it before writing any UI. If you are an agent, `AGENTS.md` is the entry point and it routes to **`.claude/skills/elattar-building-ui`**, a skill that encodes the required workflow: read the law, inventory before inventing, build on the token layer, draw every state, document, verify, and report what you actually measured rather than what you assume.

The hard rules in short:

1. Nothing is hardcoded — the four `styles/*.css` files are the only ones with literals
2. One vocabulary, and it is shadcn's
3. Action acts, value pays — never swapped
4. Only `-ink` carries text, and it differs per theme
5. Inter for words; Geist Mono for code, identifiers and figures
6. Glow is rationed: selected, celebrated, premium, reward
7. Money out is not red — red means error

Before opening a change, run `npm run verify` and `npm run docs:validate`; both are enforced in CI.

## License

MIT — see [LICENSE](LICENSE). Third-party notices: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
