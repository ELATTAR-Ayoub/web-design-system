/**
 * Documentation page for `reveal-bloom`.
 *
 * Authored, not generated. Two utilities — `bloom-action` and `bloom-value`
 * in `styles/utilities.css` — a static radial glow mixed from the brand's
 * action or value ramp, meant to sit behind a surface for a reveal stage or
 * an opening moment. Distinct from the two-layer, animated bloom a toast or
 * alert wears (that one is `feedback-surface`, `@utility bloom-cosmic`).
 * There is no component: this is a class on a host.
 *
 * THIS PAGE USED TO BE CALLED `background-effect`. That is Flutter's name for
 * the PAGE ATMOSPHERE — the `body` radial gradient reading `--page-glow` — and
 * the per-capability audit found the two platforms documenting two unrelated
 * things under one slug. The atmosphere keeps Flutter's name; these glows,
 * which Flutter does not have, are web-only and get their own.
 */

import { Meta, Note, Row } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";

function RevealBloomSpecimen() {
  return (
    <Row className="w-full">
      <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-xl border border-border bg-background">
        <div className="bloom-action absolute inset-0" />
        <p className="type-badge relative text-muted-foreground">bloom-action</p>
      </div>
      <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-xl border border-border bg-background">
        <div className="bloom-value absolute inset-0" />
        <p className="type-badge relative text-muted-foreground">bloom-value</p>
      </div>
    </Row>
  );
}

export const spec: ComponentDocSpec = {
  name: "reveal-bloom",
  omitted: {
    api: "There is no component and no props — bloom-action and bloom-value are classes on a host element, documented in full under Classes above. A props table for a CSS utility with none would be an empty table.",
    states: "A static radial gradient has no interaction of its own — no hover, focus, loading or disabled state; it is decoration behind whatever content carries the real state.",
    keyboard: "A background class is never focused or reached by Tab — it is applied to a positioned host, not a control.",
    responsive: "The gradient's geometry is expressed as percentages of its host (ellipse 70% 60% at 50% 30%), so it scales with whatever size the host is at any width rather than having a breakpoint of its own to document.",
  },
  sections: [
    {
      kind: "effect",
      id: "preview",
      title: "Effect",
      description:
        "A static radial gradient, mixed from the action or value ramp at 28% / 22% toward transparent, centred above the surface's midline. No component renders this — it is a class on a positioned host, clipped by that host's own overflow.",
      appliedAs: "bloom-action · bloom-value",
      render: <RevealBloomSpecimen />,
      source: `<div className="relative overflow-hidden rounded-xl border border-border bg-background">
  <div className="bloom-action absolute inset-0" />
  <p className="relative">bloom-action</p>
</div>

<div className="relative overflow-hidden rounded-xl border border-border bg-background">
  <div className="bloom-value absolute inset-0" />
  <p className="relative">bloom-value</p>
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
        "The glow is a background-image on the element it is applied to, so give it its own layer behind the real content — an absolutely positioned sibling inside a relative, overflow-hidden host.",
      language: "tsx",
      code: `<div className="relative overflow-hidden">
  <div className="bloom-action pointer-events-none absolute inset-0" />
  <div className="relative">{/* hero content */}</div>
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
                  k: "bloom-action",
                  v: "radial-gradient(ellipse 70% 60% at 50% 30%, color-mix(in oklab, var(--color-action) 28%, transparent), transparent 70%). For interactive / selection reveals.",
                },
                {
                  k: "bloom-value",
                  v: "Same geometry, mixed from var(--color-value) at 22%. For reward / premium reveals.",
                },
                {
                  k: "Tokens read",
                  v: "--color-action or --color-value — the two utilities exist so a rebrand only ever has to move those tokens, not a gradient written by hand at each call site.",
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
              Decorative and static — no motion, no information encoded in the
              glow alone. It must never be the only signal that a surface is
              selected or active; pair it with a real state change on the
              foreground content.
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
              Not applicable. Neither utility animates — both are a single
              static gradient — so nothing here is affected by
              prefers-reduced-motion.
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
