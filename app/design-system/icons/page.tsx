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
import { Button } from "@/components/ui/button";
import {
  Icon,
  ICON_SIZES,
  ICON_TONES,
  type IconSize,
  type IconTone,
} from "@/components/ui/icon";
import { ICON_COUNT, ICON_GROUPS } from "@/lib/ds/icons";
import { findCategory } from "@/lib/ds/nav";
import { Heart, PackageOpen, Search, Trash2 } from "lucide-react";

const { category } = findCategory("foundations", "icons");

const sizeUse: Record<IconSize, string> = {
  xs: "Pips and inline markers inside badges.",
  sm: "Beside 13px text. Inside badges and chips. Small buttons.",
  md: "The default. Inside standard buttons, rows, inputs.",
  lg: "Navigation items, large buttons, stat tiles.",
  xl: "Empty states, feature panels, section headers.",
  "2xl": "Reveal moments, rarity glyphs on cards.",
  "3xl": "Hero and error illustrations.",
};

const toneUse: Record<IconTone, string> = {
  default: "Primary text weight.",
  muted: "Beside body copy. Most common.",
  subtle: "Metadata and decorative affordances.",
  action: "Interactive, selected, active.",
  value: "Reward, premium, ranking — worth.",
  success: "Confirmed, cleared, live, gained.",
  warning: "Pending, needs attention.",
  error: "Failed, destructive.",
  info: "Neutral notice, explainer.",
  inherit: "Takes the parent colour — the default inside buttons.",
};

export default function IconsPage() {
  return (
    <>
      <DsPageHeader
        eyebrow="Sections"
        title={category.title}
        blurb={category.blurb}
        contents={category.contents}
      />

      <DsSection
        id="component"
        title="The Icon component"
        description="Lucide is the source set, but it is never imported straight into a screen. Everything goes through one component, which forces a size, a tone and an accessibility decision on every instance."
      >
        <Panel label="Usage">
          <pre className="type-code scrollbar-thin overflow-x-auto rounded-lg border border-border bg-background p-5 text-muted-foreground">
            {`import { Icon } from "@/components/ui/icon"
import { PackageOpen } from "lucide-react"

// Decorative — adjacent text already says "Open Pack",
// so the glyph is hidden from screen readers.
<Icon icon={PackageOpen} size="md" tone="inherit" />

// Meaningful — icon-only control, so it must be named.
<Icon icon={Heart} size="lg" tone="value" label="Add to favourites" />`}
          </pre>
        </Panel>

        <Meta
          className="mt-4"
          items={[
            { k: "icon", v: "A Lucide icon component. Required." },
            {
              k: "size",
              v: "xs 12 · sm 14 · md 16 · lg 20 · xl 24 · 2xl 32 · 3xl 40. Default md.",
            },
            {
              k: "tone",
              v: "A token colour, or inherit. Default inherit, which is correct inside buttons.",
            },
            {
              k: "label",
              v: "Accessible name. Provide it when the icon carries meaning alone; omit it and the icon is aria-hidden.",
            },
          ]}
        />

        <Note tone="action" title="Stroke scales with the box" className="mt-4">
          Lucide is drawn on a 24px grid for a 2px stroke. Rendered at 12px that
          stroke reads twice as heavy, and at 40px it reads thin. The component
          compensates automatically, so a 12px icon and a 40px icon carry the
          same optical weight.
        </Note>
      </DsSection>

      <DsSection
        id="sizes"
        title="Sizes"
        description="Seven steps. Icons pair with text, so each size exists to sit beside a specific type class."
      >
        <Panel label="The ladder">
          <div className="flex flex-wrap items-end gap-8">
            {(Object.keys(ICON_SIZES) as IconSize[]).map((s) => (
              <div key={s} className="text-center">
                <div className="grid h-14 place-items-center">
                  <Icon icon={PackageOpen} size={s} tone="muted" />
                </div>
                <p className="type-number-sm mt-2 text-action-ink">{s}</p>
                <p className="type-small mt-1 text-muted-foreground">{ICON_SIZES[s]}px</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-border pt-5">
            {(Object.keys(ICON_SIZES) as IconSize[]).map((s) => (
              <p key={s} className="type-small text-muted-foreground">
                <span className="type-number-sm text-muted-foreground">
                  {s} · {ICON_SIZES[s]}px
                </span>{" "}
                — {sizeUse[s]}
              </p>
            ))}
          </div>
        </Panel>
      </DsSection>

      <DsSection
        id="tones"
        title="Tones"
        description="Icons never carry a raw hex. Every tone maps to a token, which keeps icon colour inside the 70/20/10 balance automatically."
      >
        <Panel label="Ten tones">
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(ICON_TONES) as IconTone[]).map((t) => (
              <div key={t} className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-card">
                  <Icon icon={Search} size="lg" tone={t} />
                </span>
                <span className="min-w-0">
                  <span className="type-number-sm block text-action-ink">
                    {t}
                  </span>
                  <span className="type-small block text-muted-foreground">
                    {toneUse[t]}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </DsSection>

      <DsSection
        id="in-context"
        title="Icons in controls"
        description="Inside a button an icon should inherit the button's colour, not assert its own. The one exception is a destructive action, where the error tone is the point."
      >
        <Panel label="Correct pairings">
          <div className="flex flex-wrap gap-3">
            <Button>
              <Icon icon={PackageOpen} size="sm" tone="inherit" />
              Open Pack
            </Button>
            <Button variant="secondary">
              <Icon icon={Heart} size="sm" tone="inherit" />
              Favourite
            </Button>
            <Button variant="outline">
              <Icon icon={Search} size="sm" tone="inherit" />
              Search
            </Button>
            <Button variant="destructive">
              <Icon icon={Trash2} size="sm" tone="inherit" />
              Remove
            </Button>
            <Button variant="ghost" size="icon" aria-label="Add to favourites">
              <Icon icon={Heart} size="md" tone="value" />
            </Button>
          </div>
        </Panel>
      </DsSection>

      <DsSection
        id="set"
        title={`The curated set — ${ICON_COUNT} glyphs`}
        description="Lucide ships well over a thousand icons; shipping all of them guarantees inconsistency. These are the ones the product uses, each pinned to one meaning so the same glyph never means two different things."
      >
        <div className="space-y-4">
          {ICON_GROUPS.map((g) => (
            <Panel
              key={g.id}
              label={g.title}
              note={`${g.icons.length} glyphs`}
            >
              <p className="type-small mb-6 text-muted-foreground">{g.blurb}</p>
              <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                {g.icons.map((entry) => (
                  <div
                    key={entry.name}
                    className="flex items-center gap-3 bg-background p-4"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-card">
                      <Icon icon={entry.icon} size="lg" tone="muted" />
                    </span>
                    <span className="min-w-0">
                      <span className="type-number-sm block truncate text-foreground">
                        {entry.name}
                      </span>
                      <span className="type-small block text-muted-foreground">
                        {entry.use}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      </DsSection>

      <DsSection id="rules" title="Rules">
        <DoDont
          dos={[
            "Import Lucide glyphs through the Icon component so size, tone and labelling are enforced.",
            "Give every icon-only control a label — it becomes the accessible name.",
            "Use tone=\"inherit\" inside buttons so the icon follows the button's state.",
            "Keep one meaning per glyph: Package is always a pack, Layers is always the Stash.",
          ]}
          donts={[
            "Don't render a raw <Icon icon={Search} /> from lucide-react in a screen; go through Icon.",
            "Don't mix icon sets — Lucide only, no Heroicons, no Font Awesome, no emoji as UI.",
            "Don't label a decorative icon; doubling the adjacent text makes screen readers repeat it.",
            "Don't reuse Trash2 or Ban for anything non-destructive.",
          ]}
        />
        <Note className="mt-4">
          The set is defined in <Code>lib/ds/icons.ts</Code>. Adding a glyph means
          adding it there with its single meaning — that file is the whitelist.
        </Note>
      </DsSection>

      <PageFootNav groupId="foundations" slug="icons" />
    </>
  );
}
