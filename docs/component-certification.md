# Component-system certification

Audited against `origin/main` on 2026-08-08. This is the reproducible evidence
behind the certification; it is not a claim that visual systems can be proven by
a single build command.

## Scope and result

- **166** source files scanned by both design-system guards.
- **67** base UI modules reviewed individually.
- **26** documentation routes exercised in dark and light themes.
- **0** horizontal-overflow failures on those routes.
- **363** declared `data-slot` names inventoried; closed portal and transient
  states were checked through representative interactions rather than assumed
  from the at-rest DOM.
- Attachment preview, attachment download, questionnaire selection, dialog
  motion/ARIA, Calendar hydration, theme switching, and RTL context were tested
  in the running application.
- `npm run verify` is the final source, reference, type, lint, and production
  build gate.

## Base-module ledger

Every module below was checked for token ownership, shared primitive composition,
variant/state ownership, direct icon forks, and a documentation or compound-use
specimen.

- **Disclosure and overlays:** accordion, alert, alert-dialog, collapsible,
  context-menu, dialog, drawer, dropdown-menu, hover-card, menubar, popover,
  sheet, tooltip.
- **Layout and surfaces:** aspect-ratio, card, carousel, empty, item, resizable,
  scroll-area, separator, sidebar, table.
- **Actions and navigation:** breadcrumb, button, button-group, icon, icon-swap,
  marker, navigation-menu, pagination, sliding-indicator, tabs, toggle,
  toggle-group.
- **Forms:** calendar, checkbox, combobox, command, field, form, input,
  input-group, input-otp, kbd, label, native-select, questionnaire, radio-group,
  select, slider, switch, textarea.
- **Content and feedback:** attachment, avatar, badge, bubble, chart, message,
  message-scroller, progress, skeleton, sonner, spinner, stat.
- **Context and hooks:** direction, use-replay-on-state-change.

`direction` was the only base module with no executable specimen; the Navigation
page now contains an RTL Breadcrumb specimen. `questionnaire`, `chart`,
`icon-swap`, and `sonner` are intentionally exercised through their compound DS
or agent specimens because that is their real integration boundary.

## Shared-source corrections made by this audit

- Attachment media previews when `src` is supplied; `preview={false}` is the
  explicit opt-out. Attachment links download by default; `download={false}` is
  the navigation opt-out.
- Image-led announcements use `DialogContent variant="media"` plus the shared
  `DialogMedia` anatomy slot, preserving the existing Dialog implementation.
- Questionnaire radio and checkbox choices compose the same chassis and marks
  as the base controls while retaining native-input semantics.
- Lucide glyphs route through `Icon`. The documented Recharts custom SVG dot is
  the sole coordinate-space exception and still uses `ICON_SIZES`.
- Space Grotesk owns word styles; Geist Mono owns numerical, serial and code foundations.
- Geist Mono is loaded from Vercel's official self-hosted `geist/font/mono`
  package rather than the Google Fonts build.
- The Typography page renders the foundation classes directly and no longer
  duplicates their metrics as hand-written specimen metadata.
- Unit activity and conversion funnel charts are shared, data-driven chart
  modules with tokenized marks, numerical typography, and the common chart
  ready/loading/empty specimen states.
- Framework font weights, default transition timing, row staggering, swap
  offsets, and first-placement transition suppression resolve from shared
  tokens/utilities.
- Light-theme muted, primary-on-action, and destructive-wash text pairs were
  corrected to AA-safe token pairs.
- Calendar day identifiers and fallback month labels are locale-stable across
  server and client, eliminating the observed hydration mismatch.

## Explicit non-forks

- The hidden input inside `input-otp` intentionally has transparent text and
  caret; the visible slots own the system styling.
- Recharts and Three.js may emit dependency-owned SVG/canvas internals. Their
  visible integration surfaces are tokenized; library geometry is not copied
  into UI primitives.
- Raw semantic elements used as `asChild` targets are not parallel components;
  the owning primitive supplies their states and styling.

## Repeating the certification

1. Run `npm run verify`.
2. Open all design-system routes in both themes and check overflow and runtime
   errors.
3. Exercise portal/transient states (menus, dialogs, drawers, tooltips, preview,
   toasts) instead of counting only the initial DOM.
4. Enable reduced motion at the OS/browser level and inspect any keyframe whose
   final frame hides content.
5. After `npx shadcn add`, review the diff even when both guards pass; selector
   adaptations to third-party DOM cannot be inferred from token checks.
