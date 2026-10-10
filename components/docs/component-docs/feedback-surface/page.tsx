/**
 * Documentation page for `feedback-surface`.
 *
 * Authored, not generated. The iridescent bloom a toast or an Alert wears:
 * two drifting radial fields (`@utility bloom-cosmic` in `styles/utilities.css`)
 * plus a `.starfield` sparkle overlay, both defined there and timed from
 * `styles/motion.css`. Distinct from `background-effect`'s single static
 * glow — this one is two layers, animated, and per-type-coloured through
 * `--bloom-1` / `--bloom-2`. There is no component: `.cn-toast` (sonner) and
 * `Alert` are its two real hosts.
 */

import { Meta, Note, Row } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";

function FeedbackSurfaceSpecimen() {
  return (
    <Row className="w-full">
      <div className="bloom-cosmic relative w-full max-w-sm rounded-xl border border-border bg-popover p-5 shadow-e3">
        <span className="starfield" aria-hidden />
        <p className="type-small relative text-foreground">
          Pack opened — 3 rare cards inside.
        </p>
      </div>
    </Row>
  );
}

export const spec: ComponentDocSpec = {
  name: "feedback-surface",
  omitted: {
    states: "bloom-cosmic and .starfield are decorative CSS applied to a host that already carries its own interaction and async states (a toast's entrance/exit, an Alert's type) — the bloom has nothing of its own to be at rest, hovered, focused, pressed, loading or empty about; it only swells slightly on the host's :hover.",
    keyboard: "Two pseudo-element layers and a sibling span with no interactive role — nothing here is focusable, so there is no key it responds to. Keyboard behaviour on a toast or Alert belongs entirely to their own dismiss controls, documented on those pages.",
    responsive: "The bloom is sized off its host, not off the viewport: overflow: hidden, isolation: isolate and the radial gradients all read the host's own box, so the effect simply fills whatever width and height the toast or Alert resolves to at any breakpoint. There is no breakpoint-specific rule in utilities.css to document separately from the host's own responsive behaviour.",
      api: "There is no API: this is two CSS pseudo-elements on a host that already exists, reached by a class name. The props a reader wants belong to whatever is wearing it.",
},
  sections: [
    {
      kind: "effect",
      id: "preview",
      title: "Effect",
      description:
        "A near-black-to-glass surface reads this as screened light; a paper surface gets the same ramp painted straight, at 0.9, masked to the corner — light no longer multiplies, following Flutter 0.0.3's ruling that a multiplied ramp over white reads as a grey-brown wash. Both fall out of the same declarations, keyed off .light / .dark. Hover swells the bloom; the host supplies overflow-hidden, isolation and a containing block, all of which bloom-cosmic sets for itself.",
      appliedAs: "bloom-cosmic",
      render: <FeedbackSurfaceSpecimen />,
      source: `<div className="bloom-cosmic relative rounded-xl bg-popover p-5 shadow-e3">
  <span className="starfield" aria-hidden />
  <p>Pack opened — 3 rare cards inside.</p>
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
        "Set --bloom-1 / --bloom-2 to pick the pair of hues per surface type — sonner's toast does this per data-type in utilities.css; anything else composing bloom-cosmic sets the same two variables on the host.",
      language: "tsx",
      code: `<div
  className="bloom-cosmic relative rounded-xl bg-popover p-5"
  style={{ "--bloom-1": "var(--color-success)", "--bloom-2": "var(--color-value)" } as React.CSSProperties}
>
  <span className="starfield" aria-hidden />
  {/* content */}
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
                  k: "bloom-cosmic",
                  v: "Two radial-gradient pseudo-elements (::before deep, ::after near) drifting on cosmic-drift-deep / cosmic-drift-near, blended screen at 0.75 in dark mode and painted normal at 0.9 in light mode. Sets overflow: hidden, isolation: isolate and z-index: 1 on direct children by itself.",
                },
                {
                  k: ".starfield",
                  v: "A sibling span carrying two SVG sparkle clusters (::before bottom-right, ::after top-right), each swaying on star-sway / star-sway-alt and nudging on hover.",
                },
                {
                  k: "--bloom-1 / --bloom-2",
                  v: "The only two variables a consumer sets. Defaults to the action ramp; sonner's five data-type rules in utilities.css are the reference for how a new surface type should set its own pair.",
                },
                {
                  k: "Tokens read",
                  v: "--color-action, --color-action-bright, --color-value, --color-success, --color-info, --destructive and their -bright/-dark steps, depending on which pair --bloom-1/--bloom-2 point at.",
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
              Decorative light and sparkle only — the toast or alert&rsquo;s type
              (success, error, …) is still carried by its icon and copy, per
              RULES §7&rsquo;s two-signal rule; the bloom is atmosphere on top of
              that, never the only signal.
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
              Not in motion.css&rsquo;s vanishing-keyframe ledger because none of
              these keyframes end at zero opacity — cosmic-drift-deep,
              cosmic-drift-near, star-sway and star-sway-alt only ever animate
              transform and rotate. The blanket prefers-reduced-motion rule
              collapses them to a single frame and nothing painted disappears;
              the surface is left showing one static arrangement of the bloom
              and the sparkles instead of a drifting one.
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
