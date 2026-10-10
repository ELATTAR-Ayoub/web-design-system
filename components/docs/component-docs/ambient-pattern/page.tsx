/**
 * Documentation page for `ambient-pattern`.
 *
 * The capability is `.starfield`, and the gap between those two names is worth
 * recording: this page was deleted once, on the grounds that nothing under
 * `styles/` implemented "ambient-pattern". Nothing does — under that name. The
 * class has always been `.starfield`, `components/ui/alert.tsx` has always
 * mounted it, and Flutter's own `ambient_pattern.dart` says so in its first
 * line, citing the web stylesheet as the source it was ported from.
 *
 * The lesson is in the Delivery doc comment in `lib/ds/platform-contract.ts`:
 * a registry item's NAME and a CSS class's NAME are different things, and the
 * Flutter side usually records the mapping.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Note } from "@/components/ds/kit";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { meta } from "./meta";

/** The effect on its real host: Alert mounts the starfield span itself. */
function OnAlert() {
  return (
    <div className="max-w-lg">
      <Alert>
        <AlertTitle>Your pack is ready</AlertTitle>
        <AlertDescription>
          Two clusters of sparkles hang off the right-hand corners, each rocking
          a few degrees on a period long enough that you never catch it moving.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export const spec: ComponentDocSpec = {
  name: "ambient-pattern",
  omitted: {
    api: "A CSS capability has no constructor and no props — .starfield is applied, not configured. What it draws and the selectors it responds to are documented in Classes above, which is this capability's real API surface.",
    states: "Purely decorative and pointer-events: none — it never receives a hover, a press or a focus, and it carries no loading, success, error or disabled concept of its own to be in any of those states about.",
    keyboard: "It is never a tab stop and never intercepts a key event — aria-hidden plus pointer-events: none remove it from both the tab sequence and hit-testing, the same as any other purely decorative layer in this system.",
  },
  sections: [
    {
      kind: "effect",
      id: "preview",
      title: "Preview",
      label: "On an Alert",
      appliedAs: ".starfield",
      description:
        "Thirteen hand-placed sparkles in two anchored clusters — a dense one bottom-right, a thin scatter top-right — over the bloom that feedback-surface paints. The bloom is the corner light; this is the dust in it.",
      render: <OnAlert />,
      source: `{/* Alert mounts it as its own element: bloom already owns both
    of the root's pseudo-elements, so the sparkles need a box. */}
<span data-slot="alert-stars" className="starfield" aria-hidden />`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <Note>
          There is no <Code>ambient-pattern</Code> component and there should not
          be one — the whole capability is a class and two pseudo-elements. The
          registry item is named for the capability; the class is{" "}
          <Code>.starfield</Code>.
        </Note>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Mount .starfield as its own element inside a position: relative (or otherwise positioned) host — Alert already does this for you; a custom host needs the span added by hand.",
      language: "tsx",
      code: `<div className="relative overflow-hidden rounded-lg border border-border bg-card p-4">
  <span data-slot="stars" className="starfield" aria-hidden />
  {/* real content goes above it in paint order */}
</div>`,
    },
    {
      kind: "disclosure",
      id: "classes",
      title: "Classes",
      description:
        "There are no props. A CSS capability is applied, not configured — what varies is the host it is applied to.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: ".starfield",
                  v: (
                    <>
                      The cluster box: <Code>position: absolute</Code>,{" "}
                      <Code>inset: 0</Code>, <Code>pointer-events: none</Code>.
                      Mount it as a child of a positioned host. Its two
                      pseudo-elements carry the sparkles.
                    </>
                  ),
                },
                {
                  k: ".bloom-cosmic [data-content]",
                  v: (
                    <>
                      The same two clusters, reached through a DESCENDANT
                      selector rather than a child one. Sonner owns the live
                      toast&rsquo;s markup and may wrap the content slot, so a{" "}
                      <Code>&gt;</Code> combinator would work on the preview and
                      silently do nothing on the real toast.
                    </>
                  ),
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "anatomy",
      title: "Anatomy",
      blocks: [
        {
          body: (
            <ul className="type-body list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                <strong>Anchored, not tiled.</strong> Both backgrounds are{" "}
                <Code>no-repeat</Code> at their natural size — 260&times;96 for
                the dense cluster, 200&times;64 for the scatter — so a short host
                CLIPS the cluster rather than shrinking it. Which sparkles
                survive is a property of the host&rsquo;s height.
              </li>
              <li>
                <strong>Two drop-shadow passes, not one.</strong> The sparkles
                are alpha in a background image, so a <Code>box-shadow</Code>{" "}
                would trace the pseudo-element&rsquo;s rectangle instead of the
                points. The tight pass is the star&rsquo;s own light; the wide
                dim pass is that light reaching the surface around it. One pass
                alone reads as a blurred copy sitting behind the star.
              </li>
              <li>
                <strong>Three independent properties.</strong> The sway animates{" "}
                <Code>rotate</Code>; hover moves <Code>translate</Code> and{" "}
                <Code>scale</Code>. They are separate longhands that multiply, so
                a cluster can be mid-rotation and mid-nudge at once without
                either cancelling the other.
              </li>
            </ul>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "tokens",
      title: "Tokens",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "--star-glow",
                  v: "The halo colour. Mixed from the bloom ramp on dark; a plain translucent white on light, where a tinted halo reads as a smudge.",
                },
                {
                  k: "--star-glow-size",
                  v: "The tight pass's radius. The wide pass is three times it, computed rather than written twice.",
                },
                {
                  k: "--duration-sway / --duration-sway-alt",
                  v: "44s and 33s. Deliberately coprime-ish so the two clusters never settle into a shared beat — the arrangement is different every time you look.",
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
            <ul className="type-body list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                Purely decorative. The host mounts it{" "}
                <Code>aria-hidden</Code>, and it carries{" "}
                <Code>pointer-events: none</Code> so it never intercepts a click
                meant for the content beneath it.
              </li>
              <li>
                It conveys nothing. Removing it loses no information — which is
                what makes it safe to stop entirely under reduced motion.
              </li>
              <li>
                On Alert it is <Code>position: absolute</Code>, which keeps it
                out of the grid so <Code>grid-cols-[auto_1fr]</Code> never counts
                it as a column.
              </li>
            </ul>
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
            <p className="type-body text-muted-foreground">
              The sway stops. The sparkles stay: they finish at their resting
              arrangement rather than at <Code>opacity: 0</Code>, so with motion
              reduced the decoration is simply still rather than gone. A
              keyframe that ended invisible would vanish entirely when the
              blanket reduced-motion rule collapses it to a single frame — the
              failure this system records as trap 19.
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
        "Both clusters are anchored, no-repeat backgrounds at a fixed natural size — the pattern does not scale with its host, so what changes across widths is how much of it survives, not how big it draws.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "Anchored, not fluid",
                  v: "260×96 for the dense cluster and 200×64 for the scatter, painted at their natural size in every host, at every width — see Anatomy above. There is no responsive scaling step; a wider host does not grow the sparkles.",
                },
                {
                  k: "Host height decides what shows",
                  v: "Because both clusters are no-repeat rather than shrink-to-fit, a host short enough to clip the corner clips the cluster rather than resizing it — which sparkles are visible is a property of the host's own height at whatever width it happens to be rendered.",
                },
                {
                  k: "RTL",
                  v: "The clusters are anchored to the host's physical corners (bottom-right / top-right) rather than logical start/end, so they do not mirror under a right-to-left document — measured with no overflow, but also no flip.",
                },
                {
                  k: "Measured",
                  v: "No overflow at 375, 768, 1440 or 1920px and no overflow under 200% text zoom — the pattern is position: absolute and inset: 0 inside its host, so it never contributes to the host's own box size.",
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
        {
          body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} />,
        },
      ],
    },
  ],
};
