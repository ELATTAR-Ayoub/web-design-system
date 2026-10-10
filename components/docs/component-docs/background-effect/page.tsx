import { Meta, Note } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";

function AtmosphereSpecimen() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="relative h-48 overflow-hidden rounded-xl border border-border bg-background">
        <p className="type-badge absolute top-4 left-4 text-muted-foreground">flat fill</p>
      </div>
      <div
        className="relative h-48 overflow-hidden rounded-xl border border-border bg-background"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 62% 34%, var(--page-glow) 0%, transparent 64%)",
        }}
      >
        <p className="type-badge absolute top-4 left-4 text-muted-foreground">
          with the atmosphere
        </p>
      </div>
    </div>
  );
}

export const spec: ComponentDocSpec = {
  name: "background-effect",
  omitted: {
    api: "There is no API and no class to apply: the atmosphere is one rule on `body`, and a second element wearing it would be a second horizon. The only knob is the `--page-glow` token, per theme.",
    states:
      "The atmosphere never changes — RULES §4 allows exactly two perpetual motions on a page and this is neither, so there is no hover, focus, loading or reduced-motion branch to describe.",
    keyboard:
      "A page background is never focusable and intercepts nothing; there is no keyboard behaviour.",
  },
  sections: [
    {
      kind: "effect",
      id: "preview",
      title: "Effect",
      description:
        "The same fill, flat and under the atmosphere. The real one is already behind this page — the panel on the right reproduces it at the same geometry so the two can be compared side by side. On light the raise is deliberately faint (a cool near-white over white); switch to dark to see the room.",
      label: "Flat, and lifted",
      appliedAs: "body { background-image: radial-gradient(…, var(--page-glow) …) }",
      render: <AtmosphereSpecimen />,
      source: `/* styles/tokens.css — the only place this rule lives */
body {
  background-image: radial-gradient(
    120% 90% at 62% 34%,
    var(--page-glow) 0%,
    transparent 64%
  );
  background-attachment: fixed;
  background-repeat: no-repeat;
}`,
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
        "Nothing to apply. The atmosphere arrives with the foundation stylesheet and paints behind every page. To rebrand it, move the token.",
      language: "css",
      code: `:root { --page-glow: hsl(240 30% 98%); }
.dark { --page-glow: hsl(240 8% 10%); }`,
    },
    {
      kind: "disclosure",
      id: "classes",
      title: "The rule",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "120% 90% at 62% 34%",
                  v: "A wide ellipse, off-centre and above the fold, so the raise reads as a light source rather than as a vignette.",
                },
                {
                  k: "--page-glow → transparent 64%",
                  v: "One stop, fading into the background colour well before the edge. On light the glow is a cool near-white; on dark it is a lifted zinc.",
                },
                {
                  k: "background-attachment: fixed",
                  v: "The horizon does not scroll with the page. A glow that moved with the content would read as a stain on it.",
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
            <Note tone="action" title="It does not participate">
              The atmosphere is below every surface and carries no content, so it
              is announced by nothing and contrasted against nothing directly — every
              text-on-surface pair in the system is measured against the surface,
              not the page. Under forced colours the user agent removes the gradient
              and the flat fill remains, which is the correct outcome.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              Percentages of the viewport, fixed attachment, no breakpoint: the
              ellipse scales with the window at every width and every zoom level.
              Nothing mirrors under RTL — a light source has no reading direction.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [{ body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> }],
    },
  ],
};
