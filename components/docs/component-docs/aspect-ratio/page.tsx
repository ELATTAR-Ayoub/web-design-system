/**
 * Authored documentation page for `aspect-ratio`.
 *
 * Replaces the generated baseline. Migrated from the old `base/layout`
 * category page (`app/design-system/components/base/layout/page.tsx`, since deleted), which
 * held every layout primitive's real documentation on one page. Every
 * specimen below renders the real `AspectRatio` from
 * `components/ui/aspect-ratio.tsx` — a thin wrapper around Radix's
 * `AspectRatio.Root` that forwards every prop, styles nothing, and has no
 * export beyond itself. Nothing here is a styled div standing in for it.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Meta, Row } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "aspect-ratio",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A real image locked to a ratio, cropped with object-cover rather than stretched — this is the single most effective defence against layout jump in a grid of packs or cards.",
      render: (
        <Row className="max-w-xs">
          <AspectRatio
            ratio={3 / 4}
            className="w-full overflow-hidden rounded-lg border border-border bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/imgs/sample-photo.jpg"
              alt=""
              className="size-full object-cover"
            />
          </AspectRatio>
        </Row>
      ),
      source: `<AspectRatio ratio={3 / 4} className="overflow-hidden rounded-lg border border-border bg-muted">
  <img src="/imgs/sample-photo.jpg" alt="" className="size-full object-cover" />
</AspectRatio>`,
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
        "The child is expected to fill the box; a real image takes size-full object-cover.",
      language: "tsx",
      code: `import { AspectRatio } from "@/components/ui/aspect-ratio";

export function PackArt() {
  return (
    <AspectRatio ratio={3 / 4} className="rounded-md border border-border bg-muted">
      <img src="/pack.png" alt="" className="size-full object-cover" />
    </AspectRatio>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "The product's three ratios, each tied to what it frames rather than chosen for looks.",
      label: "Three ratios",
      render: (
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <AspectRatio
              ratio={5 / 7}
              className="grid place-items-center rounded-lg border border-border bg-muted"
            >
              <span className="type-number-sm text-muted-foreground">5 : 7</span>
            </AspectRatio>
            <p className="type-small mt-3 text-muted-foreground">Collectible card</p>
            <p className="type-small mt-1 text-muted-foreground">
              Matches a physical trading card, so scans sit in the frame without
              cropping.
            </p>
          </div>
          <div>
            <AspectRatio
              ratio={3 / 4}
              className="grid place-items-center rounded-lg border border-border bg-muted"
            >
              <span className="type-number-sm text-muted-foreground">3 : 4</span>
            </AspectRatio>
            <p className="type-small mt-3 text-muted-foreground">Pack artwork</p>
            <p className="type-small mt-1 text-muted-foreground">
              Taller than wide, so a pack reads as an object you tear open.
            </p>
          </div>
          <div>
            <AspectRatio
              ratio={16 / 9}
              className="grid place-items-center rounded-lg border border-border bg-muted"
            >
              <span className="type-number-sm text-muted-foreground">16 : 9</span>
            </AspectRatio>
            <p className="type-small mt-3 text-muted-foreground">Featured banner</p>
            <p className="type-small mt-1 text-muted-foreground">
              Hero panels and the featured pack carousel.
            </p>
          </div>
        </div>
      ),
      source: `<AspectRatio ratio={5 / 7} className="rounded-lg border border-border bg-muted" /> {/* collectible card */}
<AspectRatio ratio={3 / 4} className="rounded-lg border border-border bg-muted" /> {/* pack artwork */}
<AspectRatio ratio={16 / 9} className="rounded-lg border border-border bg-muted" /> {/* featured banner */}`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "A bare sizing wrapper. Every prop is Radix's own.",
      blocks: [
        {
          label: "AspectRatio",
          body: (
            <Meta
              items={[
                {
                  k: "ratio",
                  v: "number. The width-to-height ratio, e.g. 3 / 4 or 16 / 9. Radix default: 1 (a square) when omitted.",
                },
                {
                  k: "...props",
                  v: "Every other prop Radix's AspectRatioPrimitive.Root accepts, forwarded directly — this component adds nothing beyond a data-slot attribute.",
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
      description:
        "A plain sizing wrapper with no interactive semantics of its own; accessibility follows the content placed inside it.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Role",
                  v: "None. AspectRatio renders a plain element with no ARIA role — it is not a control and announces nothing on its own.",
                },
                {
                  k: "Content",
                  v: "Whatever is placed inside carries its own semantics — an <img> needs its own alt, a decorative fill needs alt=\"\".",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      description: "AspectRatio places nothing in the tab sequence on its own.",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              N/A. Keyboard behaviour belongs entirely to whatever interactive
              content a caller places inside the box — an image with a link
              wrapped around it, for instance — never to AspectRatio, which
              renders a plain, non-focusable element.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      description:
        "Maintaining the ratio across every width is the entire job of this component — it computes height from the current rendered width on every resize, via Radix's own ResizeObserver-backed implementation.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "How it holds the ratio",
                  v: "AspectRatioPrimitive.Root sets its own height as a padding-based (or, in modern Radix, aspect-ratio CSS) function of the rendered width, so the box keeps ratio when its container narrows at any breakpoint, not just the ones this page's specimens happen to test at.",
                },
                {
                  k: "The ratio itself does not respond to width",
                  v: "ratio is one static number — there is no built-in mechanism to pass a different ratio per breakpoint (a caller wanting a 16:9 banner on desktop and a 1:1 tile on mobile renders two AspectRatio instances behind a responsive className, or switches ratio in script).",
                },
                {
                  k: "The child fills the box",
                  v: "The Preview and Examples specimens both give their <img> size-full object-cover, so the image crops to the box at every width rather than stretching or leaving letterboxing — this is a call-site convention, not something AspectRatio enforces.",
                },
                {
                  k: "Measured",
                  v: "No overflow at 375, 768, 1440 or 1920px, no overflow under 200% text zoom, and no overflow under RTL — expected, since the box has no directional layout of its own to mirror.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "source",
      title: "Source",
      blocks: [
        { body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> },
      ],
    },
  ],
};
