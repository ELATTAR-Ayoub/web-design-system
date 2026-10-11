import { Button } from "@/components/ui/button";
import { Code, Meta, Note, Row } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";

import { meta } from "./meta";

function ActionFeedbackSpecimen() {
  return (
    <Row>
      <Button variant="secondary" aria-label="Same host, without sheen-action">
        Flat fill
      </Button>
      <Button className="sheen-action">Hover or press</Button>
    </Row>
  );
}

export const spec: ComponentDocSpec = {
  name: "action-feedback",
  omitted: {
    api: "A CSS class has no constructor and no props to pass — sheen-action is applied, not configured. What it does to a host is documented in Classes above, which is this capability's real API surface.",
    keyboard: "sheen-action never intercepts focus or a key event — it paints two pseudo-elements on whatever host already has its own keyboard contract, most often Button's. There is no keyboard behaviour to add on top of the host's own.",
    responsive: "The ramp and the two pseudo-elements are sized off the host's own box (100% width and height, position: relative/absolute), so the effect simply follows whatever size the host renders at — there is nothing here that reflows, zooms or mirrors independently of the host it is painted onto.",
  },
  sections: [
    {
      kind: "effect",
      id: "preview",
      title: "Effect",
      description:
        "The same host, side by side, with and without the class — the left is a secondary Button with a flat fill, and the right is the default Button, which wears sheen-action. The moulded ramp and the static diagonal texture are what the class contributes even at rest; hover or press the right button for the beat. The default Button variant is the real consumer of this class.",
      appliedAs: "sheen-action",
      render: <ActionFeedbackSpecimen />,
      source: `<Button variant="secondary">Flat fill</Button>
<Button className="sheen-action">Hover or press</Button>`,
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
        "sheen-action sets position: relative and paints its own ::before (the beat) and ::after (the static texture) — the host only needs a background colour to ramp against and overflow-hidden so neither pseudo-element bleeds past a rounded corner.",
      language: "tsx",
      code: `<Button className="sheen-action">Confirm</Button>`,
    },
    {
      kind: "disclosure",
      id: "classes",
      title: "Classes",
      description:
        "One class, three parts. The ramp is the element's own background-image; the beat and the texture are the two pseudo-elements sheen-action declares.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "sheen-action",
                  v: "A soft light–dark–light gradient in the action ramp (the element's own background-image), a static diagonal texture on ::after, and a hover/press beat on ::before — an ellipse that expands from centre on color-action-bright, blended with screen in dark mode and multiply in light mode.",
                },
                {
                  k: "Hover",
                  v: (
                    <>
                      <Code>::before</Code> runs <Code>action-beat</Code> on{" "}
                      <Code>--duration-beat-hover</Code> (2600ms), repeating — a
                      double thump, then rest, then repeat.
                    </>
                  ),
                },
                {
                  k: "Press",
                  v: (
                    <>
                      <Code>:active::before</Code> runs the same keyframes once, on{" "}
                      <Code>--duration-beat-press</Code> (620ms) — a single hard
                      beat rather than the hover rhythm.
                    </>
                  ),
                },
                {
                  k: "Tokens read",
                  v: "color-action-bright, color-action, color-action-dark for the ramp and beat; the light/dark blend-mode split lives in the unlayered block at the bottom of utilities.css, keyed off .light and .dark.",
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
              Purely decorative — the beat carries no information a sighted user
              does not already get from the label and the host&rsquo;s own
              hover/focus/active styling. It never gates comprehension: nothing
              about what the control does or whether it is enabled depends on
              seeing the animation.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description:
        "The effect draws two states of its own on top of whatever the host is already doing — a resting ramp and texture, and a beat that fires on hover and on press. Everything else in a full interaction matrix belongs to the host, not to the class.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                {
                  k: "rest",
                  v: "The ramp (the element's own background-image) and the static diagonal texture on ::after are visible even with no interaction — see the left/right comparison in the Effect specimen above.",
                },
                {
                  k: "hover",
                  v: "::before runs the action-beat keyframes on --duration-beat-hover (2600ms), repeating — a double thump, then rest, then repeat. Hover the right button in the Effect specimen to see it.",
                },
                {
                  k: "press (:active)",
                  v: "::before runs the same keyframes once, on the shorter --duration-beat-press (620ms) — a single hard beat rather than the hover rhythm. Click and hold the right button in the Effect specimen.",
                },
                {
                  k: "focus-visible / disabled / loading / success / error / empty",
                  v: "N/A — sheen-action contributes no focus ring, no disabled treatment and no async states of its own; those belong entirely to the host element (most often Button, audited on its own page) and are unaffected by whether this class is present.",
                },
              ]}
            />
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
            <Note tone="action" title="Documented in motion.css's vanishing-keyframe ledger">
              <p>
                <Code>action-beat</Code> is listed as DECORATIVE: the blanket{" "}
                <Code>prefers-reduced-motion</Code> rule collapses it to{" "}
                <Code>animation-duration: 0.01ms</Code> and one iteration, which
                freezes it at its own resting state — the ellipse ends at{" "}
                <Code>opacity: 0</Code>, the same as before any hover. Nothing
                disappears that was carrying information; the button is simply a
                textured surface with no beat, which is what it already looks
                like for most of every cycle.
              </p>
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
