# Component contracts

Read the section matching the component or pattern being changed.

## Contents

- [Base components](#base-components)
- [Compound controls](#compound-controls)
- [Charts](#charts)
- [Sidebars](#sidebars)
- [Constrained buttons](#constrained-buttons)
- [Native scrollbars](#native-scrollbars)
- [Transcript code](#transcript-code)
- [React Compiler](#react-compiler)
- [Registry item inventory](#registry-item-inventory)

## Base components

Search `components/ui/` and the live specimen before adding anything. Add a
generic visual chassis to `ui/`; move it out when it encodes product meaning.
Extend an existing base component with a variant when the chassis is shared.
Wrap it in a product family when only the composition or meaning changes.

Do not register a new `components/ui/` module in a barrel or registry; none
exists. Update `lib/ds/nav.ts` and its live specimen. Update `lib/utils.ts` only
when adding a `--shadow-*` or `--text-*` token because `tailwind-merge` must be
taught those scales.

Route Lucide glyphs through `Icon` or `IconSwap`. Do not render a second icon
system or use emoji as an interface icon. Preserve the reaction exception:
emoji selected by the user is content, not an icon substitute.

Never use Lucide's `Sparkles` icon. Select the concrete action or object glyph
instead; sparkle is not a substitute for product meaning.

## Compound controls

Reuse the system control instead of redrawing it. When nesting the semantic
control would produce invalid interactive markup, extract and share the
non-interactive visual chassis and mark. The questionnaire's
`radioControlClassName` / `RadioIndicator` and `checkboxControlClassName` /
`CheckboxMark` are the reference pattern.

## Charts

Search `components/ds/charts/` and the charts specimen before drawing marks.
Reuse `UnitActivityChart` or `ConversionFunnelChart` when their data shape fits.
Otherwise compose through `components/ui/chart.tsx`; do not import Recharts
directly into product pages or hand-draw an existing chart shape.

## Sidebars

Preserve the shared anatomy: workspace switcher and optional search in
`SidebarHeader`, grouped navigation in `SidebarContent`, secondary actions in
`SidebarFooter`, `SidebarRail`, `SidebarTrigger`, and tooltips for rows that
survive icon collapse. Replace product content, not the interaction model.

## Constrained buttons

Keep a button `min-w-0 max-w-full`. Put long visible copy in `ButtonLabel` and
repeat the complete label in a tooltip available to pointer and keyboard users.
Do not abbreviate a destructive consequence to make it fit.

## Native scrollbars

Let `html` receive the global browser scrollbar from `app/globals.css`. Add
`scrollbar-thin` to nested native overflow regions on either axis. Use
`ScrollArea` only for a contained application panel that needs a composed rail.
Never hide the only cue that more content is reachable.

## Transcript code

Render fenced code in the docs through `components/ds/code-block.tsx`, and in the
product through the AI Elements `CodeBlock` (`components/ai-elements/code-block.tsx`).
Colour comes from the `--code-*` tokens, never a baked-in theme. Update the live
Transcript → Markdown capability reference whenever the supported language set
changes.

Preserve React-element rendering. Never replace it with injected highlighted
HTML. Let an empty or unknown fence language fall back to plain tokenized code
without failing the surrounding message.

## React Compiler

Do not synchronize mounted state with `setState` in an effect; the repository's
React Compiler lint rejects it. Use `useSyncExternalStore` for browser feature
or mounted-state subscriptions. Follow `hooks/use-mobile.ts` and
`components/ds/theme-toggle.tsx`.

## Registry item inventory

The full public component vocabulary — every `registry:ui` item this system
ships, read from `registry.json`. Adding a base component means adding it
here as well as to `lib/ds/nav.ts`, or this list drifts from what the
registry actually serves.

accordion, active-indicator, alert, alert-dialog, aspect-ratio, attachment,
avatar, badge, breadcrumb, bubble, button, button-group, calendar, card,
carousel, chart, checkbox, collapsible, combobox, command, content-change,
context-menu, dialog, direction, disabled, drawer, dropdown-menu, empty,
field, form, hover-card, input, input-group, input-otp, item, kbd, label,
marker, menubar, message, message-scroller, native-select, navigation-menu,
pagination, popover, progress, prose, questionnaire, radio, resizable,
scroll-area, select, separator, sheet, sidebar, skeleton, slider, spinner,
stat, switch, table, tabs, textarea, toaster, toggle, toggle-group, tooltip,
user-menu.
