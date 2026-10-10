import { Meta, Note } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";

function PullRow({ name, rarity }: { name: string; rarity: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-background/40 px-4 py-3">
      <span className="type-small text-foreground">{name}</span>
      <span className="type-badge text-muted-foreground">{rarity}</span>
    </div>
  );
}

function GlassSpecimen() {
  return (
    <div className="aurora-brand relative isolate h-72 w-full overflow-x-hidden overflow-y-auto rounded-2xl">
      {/* glass-panel-deep pinned to the top of the scroll container: this is what
          "in front of the page" means — it stays put while the pulls beneath it
          move. Scroll the list to see it stay sharp over changing content. */}
      <div className="glass-panel-deep sticky inset-x-4 top-4 z-10 mx-4 mt-4 flex h-14 items-center justify-between rounded-xl px-5">
        <span className="type-small text-foreground">Eclipse Vault — pulls</span>
        <span className="glass-control flex h-8 items-center rounded-pill px-3">
          <span className="type-badge text-foreground">9 total</span>
        </span>
      </div>
      <div className="flex flex-col gap-2 p-4 pt-4">
        <PullRow name="Ashen Warden" rarity="Rare" />
        <PullRow name="Copper Sprite" rarity="Common" />
        <PullRow name="Verdant Oracle" rarity="Uncommon" />
        <PullRow name="Glasswing Duelist" rarity="Rare" />
        <PullRow name="Riftbound Chorus" rarity="Legendary" />
        <PullRow name="Tidal Cur" rarity="Common" />
        <PullRow name="Hollow Cartographer" rarity="Uncommon" />
        <PullRow name="Ember Custodian" rarity="Rare" />
        <PullRow name="Static Choir" rarity="Common" />
      </div>
      {/* glass-panel (shallower elevation, in-context rather than page-scale)
          floats at the bottom of the same scroll — scroll to the end to see
          both panels holding their blur over different parts of the list. */}
      <div className="glass-panel sticky inset-x-4 bottom-4 z-10 mx-4 mb-4 flex h-12 items-center justify-center overflow-hidden rounded-xl">
        <span className="type-badge text-foreground">glass-panel</span>
      </div>
    </div>
  );
}

export const spec: ComponentDocSpec = {
  name: "glass",
  omitted: {
    api: "glass-panel, glass-panel-deep and glass-control are CSS classes applied directly to a host element — there is no component, hook or prop surface behind them, so there is no API to document beyond the class names themselves.",
    states: "The three classes are static declarations with no interactive or async behaviour of their own; any hover, focus, pressed or loading state on a control wearing one of them belongs to that control and is documented on its own page.",
    keyboard: "glass-panel, glass-panel-deep and glass-control render no focusable element — they add a fill, blur and rim to whatever host is already there, so there is no keyboard behaviour to add or intercept.",
    responsive: "None of the three classes carry a breakpoint or container query of their own — a glass surface reflows exactly as its host element does, and nothing about the fill, blur or rim changes across widths, 200% zoom or RTL.",
  },
  sections: [
    {
      kind: "effect",
      id: "preview",
      title: "Effect",
      description:
        "A pull list scrolling inside an aurora-brand scene, with a glass-panel-deep toolbar pinned to the top and a glass-panel pinned to the bottom — scroll the list to watch the rows move underneath both while the glass itself stays sharp and in place. glass-control tints the pill count inside the toolbar. glass-control skips the blur entirely; a 24px blur behind a 44px control samples almost nothing but its own footprint.",
      appliedAs: "glass-panel · glass-panel-deep · glass-control",
      render: <GlassSpecimen />,
      source: `{/* aurora-brand (or any busy background) is what glass is FOR — over a flat
    fill any of the three classes below is just a tinted rectangle. sticky
    positions the panels within the scroll container itself, which is what
    keeps them in front of the list as it moves. */}
<div className="aurora-brand relative h-72 overflow-y-auto rounded-2xl">
  <div className="glass-panel-deep sticky top-4 z-10 mx-4 mt-4 rounded-xl px-5">
    Eclipse Vault — pulls
    <span className="glass-control rounded-pill px-3">9 total</span>
  </div>
  <div className="flex flex-col gap-2 p-4">{/* the pull rows */}</div>
  <div className="glass-panel sticky bottom-4 z-10 mx-4 mb-4 overflow-hidden rounded-xl">
    glass-panel
  </div>
</div>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "glass-panel and glass-panel-deep do not set overflow: hidden themselves, so a panel that needs to clip a bloom overhang or a badge that breaks its edge must add it at the call site.",
      language: "tsx",
      code: `<div className="glass-panel-deep overflow-hidden rounded-2xl p-8">
  {/* page-scale surface: a command palette, a hero card */}
</div>

<div className="glass-control rounded-pill px-4 py-2">
  {/* control-scale tint: a pill over media, a floating toolbar button */}
</div>`,
    },
    {
      kind: "disclosure",
      id: "classes",
      title: "Classes",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "glass-panel",
                  v: "backdrop-blur-xl backdrop-saturate-150, a card-coloured fill held back with color-mix(in oklab, var(--card) 74%, transparent), a --rim-strong top highlight and a foreground-tinted hairline rim, at --shadow-e2.",
                },
                {
                  k: "glass-panel-deep",
                  v: "Identical fill and rim to glass-panel, at --shadow-e4 instead of e2 — for a surface the size of the page, where e2's ambient depth would look welded down. Stacking a shadow-* utility on either glass class does not work; the elevation is fixed inside the utility for exactly this reason.",
                },
                {
                  k: "glass-control",
                  v: "No blur, no ambient shadow — a color-mix(in oklab, var(--foreground) 7%, transparent) fill with the same rim-strong top highlight and a lighter foreground hairline, sized for a 40–56px control.",
                },
                {
                  k: "Tokens read",
                  v: "--card, --foreground, --rim-strong, plus --shadow-e2 / --shadow-e4 for the two panel variants.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      blocks: [
        {
          body: (
            <p className="type-body text-muted-foreground">
              A translucent fill lowers contrast against whatever sits behind
              it, so text on any glass surface must be checked against the
              actual composited background, not against --card alone — measure
              the rendered pixel, not the token.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "reduced-motion",
      title: "Reduced motion",
      blocks: [
        {
          body: (
            <Note tone="action">
              Not applicable. None of the three classes animate — the blur,
              fill and rim are static declarations.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        {
          body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} />,
        },
      ],
    },
  ],
};
