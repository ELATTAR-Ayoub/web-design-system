# elattar-uiux-design

A Claude Code plugin with one skill that designs, builds and reviews UI/UX with Elattar's design system in any project: rules, page patterns, runnable checks and evals.

## Install

```
/plugin marketplace add ELATTAR-Ayoub/web-design-system
/plugin install elattar-uiux-design@elattar
```

## Requirements

- Node 22 or newer (the checks use Node built-ins only; the self-tests use a quoted glob with `node --test`, which needs Node 21 or newer)
- A shadcn project with the Elattar foundation installed
- Playwright for the browser checks; the skill offers to install it

## Commands

The skill itself is invoked as `/elattar-uiux-design`, or loads on its own when you ask for UI work. Four commands cover the rest:

| Command | Use it to | Changes files |
|---|---|---|
| `/elattar-uiux-design:setup` | install the commit hook, CI workflow and config; shows the plan first, writes only after you say yes | only on your yes |
| `/elattar-uiux-design:check` | run the fast static checks on the files you changed (`--all` for the whole project) | no |
| `/elattar-uiux-design:check-full` | fast checks plus the browser checks on the changed routes; needs the app running (`--all --all-routes` for everything) | no |
| `/elattar-uiux-design:review <route>` | screenshot a page in both themes and sizes and judge it against every rule | no, unless you ask |

Individual checks stay reachable by asking in chat ("check contrast").

## What the skill does

When you ask for a page, screen, component, form, dashboard, styling, theming, states, motion, copy or a UI review, it:

1. detects the project and inventories what already exists
2. picks a page pattern when you gave no design information
3. asks before adding any new value to the system
4. designs against the rules, then builds on the tokens
5. runs the checks and reviews the result
6. documents the work and reports honestly what was and was not verified

## Run the checks by hand

```
node <skill dir>/checks/run.mjs fast
node <skill dir>/checks/run.mjs full
node --test "<skill dir>/checks/test/*.test.mjs"
```

`<skill dir>` is `skills/elattar-uiux-design` inside the installed plugin.

## After every edit

A hook runs after each Edit, Write or MultiEdit and flags invalid component props and variants right away: a variant value the component's `cva()` does not define (`Button size="md"`), an unknown prop name (with a "did you mean"), a value outside a literal-union prop, and TypeScript's own errors on the component's JSX. `install` can also wire the same rule into your ESLint config as `elattar/valid-variant`.

## Real apps

- Pages behind sign-in: set `"auth": { "storageState": "<path to a Playwright storage state file>" }` in `elattar-ui.config.json`; a route that redirects is otherwise reported as unreachable, never measured.
- `runtime-errors <route>` reports console errors, uncaught exceptions and the framework's error overlay; run it, and the project's production build, before review.
- Dynamic routes (`[id]`, `[locale]`) are not visited automatically: list the real URLs in `routes` in the same file.
- Git Bash on Windows rewrites a bare `/route` argument; the checks undo it for the usual Git install, and `MSYS_NO_PATHCONV=1` (or `--route=/x`) covers any other layout.
