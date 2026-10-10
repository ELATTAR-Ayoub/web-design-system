import { Meta, Note, Row } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";

function SurfaceSpecimen() {
  return (
    <Row>
      <div className="flex h-16 w-28 items-center justify-center rounded-lg border border-input bg-card shadow-pressed">
        <span className="type-badge text-muted-foreground">pressed</span>
      </div>
      <div className="flex h-16 w-28 items-center justify-center rounded-lg border border-input bg-card shadow-btn">
        <span className="type-badge text-muted-foreground">btn</span>
      </div>
      <div className="flex h-16 w-28 items-center justify-center rounded-lg border border-transparent bg-primary shadow-btn-primary">
        <span className="type-badge text-primary-foreground">btn-primary</span>
      </div>
      <div className="ramp-chip flex h-16 w-28 items-center justify-center rounded-pill bg-value/12 shadow-chip">
        <span className="type-badge text-value-ink">chip</span>
      </div>
    </Row>
  );
}

export const spec: ComponentDocSpec = {
  name: "surface",
  omitted: {
    api: "Surface is a set of box-shadow utility classes read straight off the ladder in styles/tokens.css, not a component with a props signature — Classes below is the API in the only form this capability has: a class name and the tokens it reads. There is no JavaScript export to table.",
    states: "The ladder has no interaction states of its own to be in — shadow-btn-down IS the pressed state a control's own :active rule swaps to, documented on that control's page (Button, Switch, Checkbox) where it is paired with the element it presses.",
    keyboard: "A box-shadow utility is never focused and never receives a key — keyboard behaviour belongs to whatever control the shadow is applied to, not to the shadow itself.",
    responsive: "Every value in the shadow ladder is a fixed set of offsets and blur radii in styles/tokens.css with no breakpoint or container query attached — the same shadow-btn renders identically at 375px and 1920px. Only the element wearing it can have responsive behaviour.",
  },
  sections: [
    {
      kind: "effect",
      id: "preview",
      title: "Effect",
      description:
        "The geometry is fixed across the ladder; only the ink changes per theme, because a shadow tuned for near-black reads as dirt on white. Pressed is a sunken socket (inset). btn and btn-primary are a raised control with an inner top highlight and an inner bottom shade — the same light-from-above idea at chip scale, paired with ramp-chip's gradient.",
      appliedAs: "shadow-pressed · shadow-btn · shadow-btn-primary · shadow-btn-value · shadow-btn-down · shadow-chip · shadow-key · shadow-key-down",
      render: <SurfaceSpecimen />,
      source: `<div className="rounded-lg border border-input bg-card shadow-pressed">Sunken socket</div>
<div className="rounded-lg border border-input bg-card shadow-btn">Raised control</div>`,
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
        "shadow-pressed is what an Input, Select or Textarea sits in; shadow-btn is what a raised control (the outline Button, a Slider thumb) reads as. Pick the pair for the control's actual physical read, not for emphasis.",
      language: "tsx",
      code: `// A sunken text field
<input className="rounded-pill border border-input bg-card shadow-pressed" />

// A raised, physically pressable control
<button className="rounded-pill border-input bg-card shadow-btn active:shadow-btn-down">
  Action
</button>`,
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
                { k: "shadow-pressed", v: "inset 0 2px 5px, inset 0 1px 2px — the sunken socket every text input and track sits in." },
                { k: "shadow-btn", v: "Inner top highlight + inner bottom shade + two ambient layers — a neutral raised control (outline Button, a knob)." },
                { k: "shadow-btn-primary", v: "Same shape as shadow-btn, cast in the action colour instead of neutral ink — the default Button, a checked Checkbox/Radio/Switch." },
                { k: "shadow-btn-value", v: "Same shape again, cast in the value colour — the premium Button, value-coloured progress." },
                { k: "shadow-btn-down", v: "The pressed state any of the three raised shadows moves to on :active — inset, no ambient layer, reads as sunk rather than lifted." },
                { k: "shadow-chip", v: "The badge-scale version of shadow-btn — a smaller inner highlight/shade pair for a 20px pill, paired with the ramp-chip gradient utility." },
                { k: "shadow-key / shadow-key-down", v: "A side-walled key that travels down into its socket on press — see the press effect page for the utility (press) that animates between them." },
                { k: "Tokens read", v: "--rim, --rim-strong, --ink-1 through --ink-4, --wall, plus --color-action / --color-value for the two coloured variants — every one redefined per theme so the geometry never has to change." },
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
              Depth alone must never be the only signal that a control is
              interactive or that it changed state — a shadow shift is easy to
              miss and invisible under forced-colours modes. Pair a
              shadow-btn-down press or a shadow-pressed focus change with a
              border or text change that survives high-contrast rendering.
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
              Not applicable to the tokens themselves — a box-shadow value has
              no motion of its own. Whichever transition utility a control
              pairs with a shadow swap (press, press, press) is what
              prefers-reduced-motion governs, documented on those effects&rsquo;
              own pages.
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
