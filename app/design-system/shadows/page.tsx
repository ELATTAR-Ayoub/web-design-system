import {
  Code,
  DoDont,
  DsPageHeader,
  DsSection,
  Note,
  PageFootNav,
  Panel,
} from "@/components/ds/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findCategory } from "@/lib/ds/nav";

const { category } = findCategory("foundations", "shadows");

/**
 * The shadow system.
 *
 * Every specimen here is the real token — nothing is redrawn for the page — so
 * changing a shadow in globals.css changes this page with it.
 */

const ambient = [
  { token: "--shadow-e1", cls: "shadow-e1", use: "Resting rows, chips, table headers. Barely there." },
  { token: "--shadow-e2", cls: "shadow-e2", use: "Cards and pack cards at rest." },
  { token: "--shadow-e3", cls: "shadow-e3", use: "Hovered cards, popovers, dropdowns, sticky bars." },
  { token: "--shadow-e4", cls: "shadow-e4", use: "Dialogs, drawers, the pack-opening stage." },
];

const machine = [
  {
    token: "--shadow-btn",
    cls: "shadow-btn",
    use: "Secondary, outline and destructive buttons. An inner top highlight and inner bottom shade make the surface read as a physical key.",
  },
  {
    token: "--shadow-btn-primary",
    cls: "shadow-btn-primary",
    use: "The primary button. Same depth plus a blue cast beneath it.",
  },
  {
    token: "--shadow-btn-value",
    cls: "shadow-btn-value",
    use: "The premium button. Lime cast, for money and reward actions.",
  },
  {
    token: "--shadow-btn-down",
    cls: "shadow-btn-down",
    use: "Any button while pressed. The surface sinks into its socket instead of merely dimming.",
  },
  {
    token: "--shadow-key",
    cls: "shadow-key",
    use: "A raised key with a visible side wall. Used by the press utility.",
  },
  {
    token: "--shadow-key-down",
    cls: "shadow-key-down",
    use: "The same key, travelled 3px down into its socket.",
  },
  {
    token: "--shadow-pressed",
    cls: "shadow-pressed",
    use: "A sunken socket. Every input, textarea and input group sits in one.",
  },
  {
    token: "--shadow-chip",
    cls: "shadow-chip",
    use: "Badge and chip depth. Lighter than a button, but not flat.",
  },
];

export default function ShadowsPage() {
  return (
    <>
      <DsPageHeader
        eyebrow="Sections"
        title={category.title}
        blurb={category.blurb}
        contents={category.contents}
      />

      <Note tone="action" title="Two families, one idea" className="mb-12">
        Ambient shadows describe how far a surface floats. <strong>Machine</strong>{" "}
        shadows describe whether it can be <em>pressed</em>. That second family is
        what gives the interface its tactility: controls you operate stand proud
        with an inner highlight, and fields you type into are recessed. Get the
        two the wrong way round and everything feels like flat cardboard.
      </Note>

      <DsSection
        id="ambient"
        title="Ambient depth"
        description="Four steps. On a near-black page a shadow reads as a soft darkening, so depth mostly comes from the surface ladder — these only confirm it."
      >
        <Panel label="e1 → e4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ambient.map((s) => (
              <div key={s.token}>
                <div
                  className={`grid h-24 place-items-center rounded-lg border border-border bg-card ${s.cls}`}
                >
                  <span className="type-number-sm text-muted-foreground">
                    {s.cls}
                  </span>
                </div>
                <p className="type-number-sm mt-3 text-action-ink">{s.token}</p>
                <p className="type-small mt-1 leading-snug text-muted-foreground">{s.use}</p>
              </div>
            ))}
          </div>
        </Panel>
      </DsSection>

      <DsSection
        id="machine"
        title="Machine surfaces"
        description="Depth that implies a mechanism. These carry inset highlights and shades, so a control looks like it has a top face and a side wall."
      >
        <Panel label="The machine set">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {machine.map((s) => (
              <div key={s.token}>
                <div
                  className={`grid h-24 place-items-center rounded-pill bg-card ${s.cls}`}
                >
                  <span className="type-number-sm text-muted-foreground">
                    {s.cls}
                  </span>
                </div>
                <p className="type-number-sm mt-3 text-action-ink">{s.token}</p>
                <p className="type-small mt-1 leading-snug text-muted-foreground">{s.use}</p>
              </div>
            ))}
          </div>
        </Panel>
      </DsSection>

      <DsSection
        id="in-use"
        title="Raised against recessed"
        description="The rule in one panel. Press the buttons and focus the field — the button sinks, the field is already sunken and only its ring changes."
      >
        <Panel label="Press and focus these">
          <div className="flex flex-wrap items-center gap-4">
            <Button>Open Pack</Button>
            <Button variant="premium">Deposit Funds</Button>
            <Button variant="secondary">View Hits</Button>
            <Button variant="outline">Filters</Button>
            <Button variant="ghost">Skip</Button>
          </div>
          <div className="mt-6 max-w-sm">
            <Input placeholder="Search packs, cards and sets" />
          </div>
          <p className="type-small mt-6 text-muted-foreground">
            Buttons carry <Code>shadow-btn</Code> or{" "}
            <Code>shadow-btn-primary</Code> and drop to{" "}
            <Code>shadow-btn-down</Code> on <Code>:active</Code>. The input
            carries <Code>shadow-pressed</Code> permanently — it is a socket, and
            it never rises.
          </p>
        </Panel>
      </DsSection>

      <DsSection
        id="glow"
        title="Rationed glow"
        description="Two glows, and they are the scarcest thing in the system. Both derive from the accent tokens, so they follow the palette automatically."
      >
        <Panel label="Selected and celebrated">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="glow-action grid h-24 place-items-center rounded-lg border border-primary/40 bg-card">
                <span className="type-number-sm text-action-ink">
                  glow-action
                </span>
              </div>
              <p className="type-small mt-3 text-muted-foreground">
                Selected pack, focused primary CTA, active opening stage. Says{" "}
                <em>this is the thing you chose</em>.
              </p>
            </div>
            <div>
              <div className="glow-value grid h-24 place-items-center rounded-lg border border-value/40 bg-card">
                <span className="type-number-sm text-value-ink">glow-value</span>
              </div>
              <p className="type-small mt-3 text-muted-foreground">
                Celebrated tiers, reward unlocks, premium actions. Says{" "}
                <em>this is worth something</em>.
              </p>
            </div>
          </div>
        </Panel>
      </DsSection>

      <DsSection
        id="glass"
        title="Glass"
        description="A surface in front of the page rather than cut out of it. Two utilities, one material — the split is scale, not taste."
      >
        <Panel label="glass-panel and glass-control">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="glass-panel grid h-24 place-items-center rounded-4xl">
                <span className="type-number-sm text-foreground">glass-panel</span>
              </div>
              <p className="type-small mt-3 text-muted-foreground">
                Card scale. Translucent <Code>--card</Code>, a backdrop blur, a
                hairline rim of the ink colour and <Code>--shadow-e2</Code>{" "}
                beneath. The page&rsquo;s own light shows through it, which is
                the whole reason to reach for this over <Code>bg-card</Code>.
              </p>
            </div>
            <div>
              <div className="grid h-24 place-items-center rounded-4xl bg-card">
                <span className="glass-control inline-flex h-12 items-center rounded-pill px-4">
                  <span className="type-number-sm text-foreground">
                    glass-control
                  </span>
                </span>
              </div>
              <p className="type-small mt-3 text-muted-foreground">
                Control scale. No blur and no ambient shadow: at 44px there is
                nothing behind it worth blurring, and <Code>e2</Code> under
                something that small reads as grime rather than as depth.
              </p>
            </div>
          </div>
          <Note className="mt-6" title="Neither needs a dark: variant">
            Both mix from <Code>--card</Code> and <Code>--foreground</Code>, so a
            light edge on dark and a dark edge on light fall out of the same
            expression. The top highlight is <Code>--rim-strong</Code> — the same
            token every raised control carries, which is what keeps a glass card
            in the same world as a button.
          </Note>
        </Panel>
      </DsSection>

      <DsSection id="rules" title="Rules">
        <DoDont
          dos={[
            "Use the surface ladder plus a hairline for depth first; add a shadow only to confirm it.",
            "Give anything pressable a machine shadow, and sink it to shadow-btn-down on active.",
            "Keep every field in a sunken shadow-pressed socket.",
            "Reserve the two glows for selection and reward.",
          ]}
          donts={[
            "Don't put an ambient shadow on a control — it will read as floating rather than pressable.",
            "Don't raise an input; recessed is what makes it read as editable.",
            "Don't glow a resting surface, and never glow navigation.",
            "Don't invent a shadow inline — every value is a token.",
          ]}
        />
      </DsSection>

      <PageFootNav groupId="foundations" slug="shadows" />
    </>
  );
}
