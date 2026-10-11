import {
  Code,
  DoDont,
  DsPageHeader,
  DsSection,
  Meta,
  Note,
  PageFootNav,
  Panel,
} from "@/components/ds/kit";
import { SpacingStep, TokenValue } from "@/components/ds/token-swatch";
import { findCategory } from "@/lib/ds/nav";

const { category } = findCategory("foundations", "spacing");

const spacing = [
  { px: 4, cls: "1", use: "Icon-to-label inside a badge. Pip gaps." },
  { px: 8, cls: "2", use: "Between related controls. Chip gaps." },
  { px: 12, cls: "3", use: "Inside compact rows. Grid gutters on mobile." },
  { px: 16, cls: "4", use: "Default card padding. Standard grid gutter." },
  { px: 24, cls: "6", use: "Card padding on desktop. Between cards in a grid." },
  { px: 32, cls: "8", use: "Between modules inside a section." },
  { px: 40, cls: "10", use: "Section inner spacing." },
  { px: 48, cls: "12", use: "Between page sections." },
  { px: 64, cls: "16", use: "Between major page sections." },
  { px: 80, cls: "20", use: "Above and below a hero. The largest step." },
];

const radii = [
  { name: "xs", token: "--radius-xs", use: "Tips and swatches only — a tooltip arrow, a chart legend key. Nothing with content in it should be this sharp." },
  { name: "sm", token: "--radius-sm", use: "Badges, pips, small chips, inline code." },
  { name: "md", token: "--radius-md", use: "Buttons, inputs, rows, dropdown items. The default, and what --radius resolves to." },
  { name: "lg", token: "--radius-lg", use: "Cards, pack cards, collectible tiles, panels." },
  { name: "xl", token: "--radius-xl", use: "Large cards, dialogs, feature panels." },
  { name: "2xl", token: "--radius-2xl", use: "Promotional panels, pack stage." },
  { name: "3xl", token: "--radius-3xl", use: "The landing hero panel. The container ladder's last normal step." },
  { name: "4xl", token: "--radius-4xl", use: "The soft slab. One shape only: a full-width panel on a narrow column, where the card IS the content. Never beside lg cards in a grid." },
  { name: "pill", token: "--radius-pill", use: "Controls — buttons, inputs, badges, chips, avatars, the live indicator." },
];

const elevation = [
  {
    token: "--shadow-e1",
    cls: "shadow-e1",
    use: "Resting rows, chips, table headers. Barely there.",
  },
  {
    token: "--shadow-e2",
    cls: "shadow-e2",
    use: "Cards and pack cards at rest.",
  },
  {
    token: "--shadow-e3",
    cls: "shadow-e3",
    use: "Hovered cards, popovers, dropdowns, sticky bars.",
  },
  {
    token: "--shadow-e4",
    cls: "shadow-e4",
    use: "Dialogs, drawers, the pack-opening stage.",
  },
];

export default function SpacingPage() {
  return (
    <>
      <DsPageHeader
        eyebrow="Sections"
        title={category.title}
        blurb={category.blurb}
        contents={category.contents}
      />

      <DsSection
        id="scale"
        title="Spacing scale"
        description="An 8-point system with a 4px half-step for tight interior spacing. Tailwind's default 0.25rem unit already matches, so the class number is simply the pixel value divided by four."
      >
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {spacing.map((s) => (
            <div
              key={s.px}
              className="grid items-center gap-4 border-b border-border px-6 py-4 last:border-b-0 sm:grid-cols-[4rem_5rem_1fr] sm:gap-6"
            >
              <SpacingStep steps={Number(s.cls)} />
              <span className="type-number-sm text-action-ink">
                gap-{s.cls}
              </span>
              <span className="flex items-center gap-4">
                <span
                  className="h-3 shrink-0 rounded-sm bg-action"
                  style={{ width: `calc(var(--spacing) * ${s.cls})` }}
                />
                <span className="type-small text-muted-foreground">{s.use}</span>
              </span>
            </div>
          ))}
        </div>
        <Note tone="error" title="The only spacing rule" className="mt-4">
          If a gap is not on this scale, it is wrong. There is no 18px, no 30px
          and no 50px anywhere in the product.
        </Note>
      </DsSection>

      <DsSection
        id="radius"
        title="Radius ladder"
        description="Radius encodes size: the bigger the surface, the softer the corner. This overrides shadcn's computed radius scale with explicit values."
      >
        <Panel label="Nine steps" note="Painted with the token, valued by the browser">
          <div className="flex flex-wrap gap-5">
            {radii.map((r) => (
              <div key={r.name} className="w-36">
                <div
                  className="grid h-24 place-items-center border border-input bg-muted"
                  style={{ borderRadius: `var(${r.token})` }}
                >
                  <TokenValue token={r.token} />
                </div>
                <p className="type-number-sm mt-3 text-action-ink">
                  rounded-{r.name}
                </p>
                <p className="type-small mt-1 text-muted-foreground">{r.use}</p>
              </div>
            ))}
          </div>
        </Panel>
      </DsSection>

      <DsSection
        id="elevation"
        title="Elevation"
        description="Four neutral depth steps, plus two glows that are strictly rationed. On a near-black background a shadow reads as a soft darkening, so depth mostly comes from the surface ladder — shadows only confirm it."
      >
        <Panel label="Neutral depth">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {elevation.map((e) => (
              <div key={e.token}>
                <div
                  className={`grid h-24 place-items-center rounded-lg border border-border bg-card ${e.cls}`}
                >
                  <span className="type-number-sm text-muted-foreground">{e.cls}</span>
                </div>
                <p className="type-number-sm mt-3 text-action-ink">{e.token}</p>
                <p className="type-small mt-1 text-muted-foreground">{e.use}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel label="Rationed glow" note="Selected · rare · premium only" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="glow-action grid h-24 place-items-center rounded-lg border border-action/40 bg-card">
                <span className="type-number-sm text-action-ink">
                  glow-action
                </span>
              </div>
              <p className="type-small mt-3 text-muted-foreground">
                Selected pack, focused primary CTA, active opening stage. Signals{" "}
                <em>this is the thing you chose</em>.
              </p>
            </div>
            <div>
              <div className="glow-value grid h-24 place-items-center rounded-lg border border-value/40 bg-card">
                <span className="type-number-sm text-value-ink">glow-value</span>
              </div>
              <p className="type-small mt-3 text-muted-foreground">
                Legendary or mythic reveal, reward unlock, premium action.
                Signals <em>this is worth something</em>.
              </p>
            </div>
          </div>
        </Panel>
      </DsSection>

      <DsSection
        id="grid"
        title="Grid and content width"
        description="Desktop-first on a 1440px frame. Content is capped so that grids never stretch into unreadable rows on ultrawide displays. Every measure below is a token; this section used to state three of them as prose only, which meant a container had nothing to read and an arbitrary max-width was the only way to obey it."
      >
        <Meta
          items={[
            {
              k: "Design frame",
              v: "1440px wide — the canvas everything is composed against. Not a token: it is the canvas, not a measure anything renders at.",
            },
            {
              k: "--width-shell",
              v: (
                <>
                  <TokenValue token="--width-shell" /> — the outer frame the
                  sidebar and main column share on the documentation site.
                </>
              ),
            },
            {
              k: "--width-page",
              v: (
                <>
                  <TokenValue token="--width-page" /> — the cap for
                  customer-facing pages: FAQ, about, contact, help, legal. This
                  row read 1320px for as long as the section existed, while the
                  token has always resolved to something else; it is measured
                  now rather than remembered.
                </>
              ),
            },
            {
              k: "--width-content",
              v: (
                <>
                  <TokenValue token="--width-content" /> — a documentation
                  column: copy with specimens, panels and tables beside it.
                </>
              ),
            },
            {
              k: "--width-prose",
              v: (
                <>
                  <TokenValue token="--width-prose" /> — a reading column
                  carrying nothing but sentences. See Typography → Prose.
                </>
              ),
            },
            {
              k: "--width-rail",
              v: (
                <>
                  <TokenValue token="--width-rail" /> — a table of contents, an
                  anchor list, an article&rsquo;s metadata column. Not
                  --width-sidebar: that one collapses to an icon rail, which a
                  rail beside prose never does.
                </>
              ),
            },
            {
              k: "--height-site-header",
              v: (
                <>
                  <TokenValue token="--height-site-header" /> — every sticky
                  header. --scroll-offset derives from it, so an anchored
                  heading cannot land underneath one.
                </>
              ),
            },
            {
              k: "Page margin",
              v: "px-6 md:px-8 lg:px-12 — 24px mobile · 32px tablet · 48px desktop. All on the scale above.",
            },
            { k: "Columns", v: "12-column grid on desktop, 24px gutters." },
          ]}
        />

        <Panel label="12 columns · 24px gutters" className="mt-4">
          <div className="grid grid-cols-12 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="grid h-20 place-items-center rounded-sm bg-action/12"
              >
                <span className="type-number-sm text-action-ink">{i + 1}</span>
              </div>
            ))}
          </div>
        </Panel>
      </DsSection>

      <DsSection
        id="breakpoints"
        title="Breakpoints"
        description="Tailwind's stock scale, unmodified, and these are the real numbers rather than an intent. This section described a 1200px desktop boundary that no breakpoint has ever fired at; the values below are the ones every component in this repository is actually written against."
      >
        <Meta
          items={[
            { k: "sm — 640px", v: "The first column split. Two-up state grids, side-by-side panels." },
            { k: "md — 768px", v: "The mobile boundary, and the one the old prose got right. Tables stop becoming card lists; the section spacing steps up." },
            { k: "lg — 1024px", v: "The documentation sidebar appears; page gutters reach 48px." },
            { k: "xl — 1280px", v: "The true desktop layout switch. Four-up grids, full 12 columns." },
            {
              k: "2xl — 1536px",
              v: (
                <>
                  Rarely reached for: --width-page caps at{" "}
                  <TokenValue token="--width-page" />, so most layouts have
                  stopped growing well before here.
                </>
              ),
            },
          ]}
        />
        <Note className="mt-4" title="Why the scale was not overridden">
          The obvious fix for a 1200px intent is a <Code>--breakpoint-xl</Code>{" "}
          override. It was rejected: every one of the sixty-eight base
          components is written against the stock scale, so moving a boundary
          re-flows all of them silently and nothing in the build reports it. The
          prose was wrong, not the scale. Use <Code>xl:</Code> for the desktop
          switch and <Code>md:</Code> for the mobile boundary.
        </Note>
      </DsSection>

      <DsSection
        id="target"
        title="The hit-target floor"
        description="The smallest an interactive target may effectively be. It is a token now rather than a number remembered from the accessibility contract, so a control declaring its own minimum has something to read."
      >
        <Panel
          label="--size-target-min"
          note="Drawn from the token, valued by the browser"
        >
          <div className="flex flex-wrap items-end gap-8">
            <div>
              <div
                className="grid place-items-center rounded-lg border border-input bg-muted"
                style={{
                  width: "var(--size-target-min)",
                  height: "var(--size-target-min)",
                }}
              />
              <TokenValue token="--size-target-min" className="mt-3 block" />
              <p className="type-small mt-1 text-muted-foreground">
                The floor. Anything a finger can hit answers over at least this
                square.
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-border pt-5">
            <p className="type-small text-muted-foreground">
              Spell it{" "}
              <Code>min-h-(--size-target-min)</Code> rather than the equivalent
              step on the spacing scale. Both resolve to the same measurement;
              only one of them says why, and only one of them moves if the floor
              is ever raised.
            </p>
          </div>
        </Panel>
        <Note tone="value" title="A floor on the target, not on the drawing" className="mt-4">
          A control may <em>look</em> smaller and give the area back — a 20px
          checkbox, a dismiss ✕ inside an alert — using negative margin, and
          then it has to be measured rather than assumed. The default{" "}
          <Code>Button</Code> is the system&rsquo;s one stated exception at 40px,
          because it has to sit level with a 40px <Code>Input</Code> and that
          pair is the most common row here; where a control is the primary
          target on a touch surface, reach for <Code>size=&quot;lg&quot;</Code>{" "}
          instead of shrinking the field to match.
        </Note>
      </DsSection>

      <DsSection id="rules" title="Rules">
        <DoDont
          dos={[
            "Pick gaps from the scale — 4, 8, 12, 16, 24, 32, 40, 48, 64, 80.",
            "Let radius follow the ladder: controls are pills, and containers climb lg → xl → 2xl → 3xl as the surface grows.",
            "Use the surface ladder for depth first, and add a shadow only to confirm it.",
            "Ask for a measure by token — --width-page, --width-content, --width-prose — never by number.",
          ]}
          donts={[
            "Don't invent in-between spacing values to make something 'fit'.",
            "Don't put a glow on a resting surface — glow means selected, rare or premium.",
            "Don't let a card and the controls inside it read as one shape; a pill in a 12px card is the ladder doing its job.",
            "Don't write a measure as an arbitrary value; if the token is missing, add it to globals.css rather than working around it.",
          ]}
        />
      </DsSection>

      <PageFootNav groupId="foundations" slug="spacing" />
    </>
  );
}
