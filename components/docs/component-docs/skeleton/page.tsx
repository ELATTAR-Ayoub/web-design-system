/**
 * Authored documentation page for `skeleton`.
 *
 * Replaces the generated baseline. Migrated from the old `base/feedback`
 * category page (`app/design-system/components/base/feedback/page.tsx`, since deleted).
 * Every specimen below renders the real `Skeleton` from
 * `components/ui/skeleton.tsx` — nothing here is a styled div standing in
 * for a placeholder. Prop rows in API Reference come straight from that
 * file's signature; nothing is invented.
 *
 * The Preview section renders `SkeletonShowcase` (`./skeleton-showcase.tsx`),
 * a client companion (per `references/traps.md` #29) that owns a
 * loaded/loading toggle: "Load" swaps the skeleton for the real card it
 * stands in for, in the same wrapper at the same footprint, so the reader
 * sees the promised no-layout-jump swap happen rather than reading about it.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { Skeleton } from "@/components/ui/skeleton";
import { Meta, Note, Panel, Row, StateCell, StateGrid } from "@/components/ds/kit";

import { SkeletonShowcase } from "./skeleton-showcase";
import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "skeleton",
  omitted: {
    keyboard:
      "Skeleton is not focusable and not a control — nothing about it appears in tab order or responds to a key, so there is no keyboard behaviour to document.",
    responsive:
      "Skeleton has no built-in breakpoint behaviour of its own — it is exactly as wide and tall as the classes a caller gives it, at every viewport. Documenting a responsive behaviour here would describe the caller's layout, not this component.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A skeleton must match the footprint of what it replaces. Press Load to watch the swap happen: the same card, same wrapper, same size — one spring on the arriving content, not a layout jump and not two animations layered on top of each other.",
      label: "Load a pack card",
      render: <SkeletonShowcase />,
      source: `const [loaded, setLoaded] = useState(false);

<div aria-busy={!loaded} className="rounded-lg border border-border bg-card p-4">
  {loaded ? (
    <div className="anim-enter">{/* real card content */}</div>
  ) : (
    <div className="anim-enter">
      <Skeleton className="mb-4 h-32 w-full rounded-md" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-2.5 h-4 w-40" />
    </div>
  )}
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
        "Size it with Tailwind classes to match the real content's geometry. Put aria-busy on the container that is waiting — Skeleton itself is aria-hidden, because a shimmering rectangle has no text to announce.",
      language: "tsx",
      code: `import { Skeleton } from "@/components/ui/skeleton";

export function PackCardSkeleton() {
  return (
    <div aria-busy="true" className="rounded-lg border border-border bg-card p-4">
      <Skeleton className="mb-4 h-32 w-full rounded-md" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-2.5 h-4 w-40" />
    </div>
  );
}`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "A skeleton is not one reusable block — each component that loads gets a skeleton shaped like itself. The shimmer animation is shared; the geometry is not.",
      label: "Shaped like their real content",
      render: (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel label="Pack card skeleton">
            <div className="rounded-lg border border-border bg-card p-4">
              <Skeleton className="mb-4 h-32 w-full rounded-md" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-2.5 h-4 w-40" />
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-5 w-20 rounded-pill" />
                <Skeleton className="h-5 w-16 rounded-pill" />
              </div>
              <Skeleton className="mt-4 h-6 w-20" />
              <Skeleton className="mt-4 h-10 w-full rounded-md" />
            </div>
          </Panel>

          <Panel label="Live pull row skeleton">
            <div className="space-y-px overflow-hidden rounded-lg border border-border">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 bg-card px-4 py-3">
                  <Skeleton className="size-8 rounded-pill" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="mt-2 h-3.5 w-36" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      ),
      source: `<div className="rounded-lg border border-border bg-card p-4">
  <Skeleton className="mb-4 h-32 w-full rounded-md" />
  <Skeleton className="h-3 w-24" />
  <Skeleton className="mt-2.5 h-4 w-40" />
  <div className="mt-4 flex gap-2">
    <Skeleton className="h-5 w-20 rounded-pill" />
    <Skeleton className="h-5 w-16 rounded-pill" />
  </div>
  <Skeleton className="mt-4 h-6 w-20" />
  <Skeleton className="mt-4 h-10 w-full rounded-md" />
</div>`,
    },
    {
      kind: "showcase",
      id: "inline",
      title: "Inline placeholders",
      description:
        "Standing in for words inside a sentence needs as=\"span\" — a <div> inside a <p> is invalid HTML that every guard in this repo passes.",
      label: "as=\"span\", inside running text",
      render: (
        <Row>
          <p className="type-body max-w-prose">
            Standing in for words inside a sentence needs{" "}
            <code className="type-code">as=&quot;span&quot;</code> — like{" "}
            <Skeleton as="span" className="h-3.5 w-28 align-middle" /> here —
            because a <code className="type-code">&lt;div&gt;</code> inside a{" "}
            <code className="type-code">&lt;p&gt;</code> is invalid HTML that
            every guard in this repo passes.
          </p>
        </Row>
      ),
      source: `<p>
  Standing in for words needs <Skeleton as="span" className="h-3.5 w-28 align-middle" /> here.
</p>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      blocks: [
        {
          label: "Skeleton",
          body: (
            <Meta
              items={[
                {
                  k: "as",
                  v: '"div" | "span". Default: "div". "span" renders inline-block so it keeps document width/height while sitting in text flow — use it for a placeholder standing in for words inside a <p>, a <label>, or a heading.',
                },
                {
                  k: "...props",
                  v: "Every other native element attribute (className, style, etc.), forwarded directly. Size it with Tailwind classes to match the real content's geometry — there is no size prop.",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description:
        "Skeleton is not a control and has exactly one visual state — the shimmer is always running (or held per reduced-motion, see Accessibility). The interaction states below are N/A for the same reason Alert's are: it reports nothing and is never operated.",
      blocks: [
        {
          body: (
            <StateGrid cols={4}>
              <StateCell label="rest" note="Always shimmering">
                <Skeleton className="h-4 w-20" />
              </StateCell>
              <StateCell label="loading" note="Skeleton IS the loading state">
                <Skeleton className="h-4 w-20" />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="error" title="The common mistake">
              Do not build one <code className="type-code">SkeletonCard</code>{" "}
              and use it everywhere. Each component that loads gets a
              skeleton shaped like <em>itself</em>. The shimmer animation is
              shared; the geometry is not.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description:
        "Skeleton is always aria-hidden — the waiting state belongs to the container it sits inside, not to the placeholder itself.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Role",
                  v: "None. Skeleton always renders aria-hidden=\"true\" (skeleton.tsx) — a shimmering rectangle has no text to announce, and announcing an empty node would be worse than saying nothing.",
                },
                {
                  k: "Where the waiting state actually lives",
                  v: "On the container that is waiting: put aria-busy=\"true\" there, or a live region that reports the outcome once content arrives (see Usage). Skeleton's own aria-hidden is overridable through the prop spread for the rare case where the placeholder is the only thing on the page and something has to announce it.",
                },
                {
                  k: "Reduced motion",
                  v: "The shimmer is driven by the shared anim-shimmer utility in styles/motion.css, which the reduced-motion blanket rule slows to a near-zero duration — the placeholder still shows its shape and geometry, it simply stops animating.",
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

/* Variants and Sizes are omitted for this item (see the `omitted` map above
 * for Keyboard and Responsive, which are required sections):
 *
 * - Variants: Skeleton has no variant prop — its only shape lever is `as`,
 *   documented under API Reference and demonstrated in "Inline placeholders".
 *   A separate Variants section would repeat that one prop under a heading
 *   that implies more than one axis exists.
 * - Sizes: there is no size prop. A skeleton is sized entirely by the
 *   Tailwind classes a caller passes, to match whatever it stands in for —
 *   the Examples section demonstrates that directly rather than through a
 *   fixed size ladder that does not exist in the source.
 */
