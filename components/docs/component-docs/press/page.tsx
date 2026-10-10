/**
 * Documentation page for `press`.
 *
 * Authored, not generated. The one click feel in the system — instant
 * squish in, springy overshoot back out — is a single utility,
 * `@utility press` in `styles/motion.css`, the one press utility that
 * replaced five press/hover variants on 2026-09-22. `Button` carries it built
 * in, and anything else clickable — a badge, a row, a card — takes it as an
 * explicit class. What it does NOT provide — keyboard operation, a
 * real button/link role, a focus ring, the 44px minimum target — is the
 * consumer's job, same as it would be for any div wearing an onClick; that
 * half is stated here so it is not mistaken for something the class
 * supplies for free.
 */

import { Code, Meta, Note, Row } from "@/components/ds/kit";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { meta } from "./meta";
import { PressKeyboardDemo } from "./keyboard-press-demo";

function PressSpecimen() {
  return (
    <Row>
      <Button type="button" variant="outline">
        Button
      </Button>
      <Badge
        variant="outline"
        tabIndex={0}
        role="button"
        className="press cursor-pointer"
      >
        Badge
      </Badge>
      <div
        role="button"
        tabIndex={0}
        className="press flex h-10 w-32 items-center rounded-md border border-border bg-card px-3 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className="type-small text-foreground">Row</span>
      </div>
      <Card
        role="button"
        tabIndex={0}
        className="press w-32 cursor-pointer px-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className="type-small text-foreground">Card</span>
      </Card>
    </Row>
  );
}

export const spec: ComponentDocSpec = {
  name: "press",
  omitted: {
    api: "press is CSS, not a component — it takes no prop. The full contract (what it transitions, the scale, the durations and easing it reads) is already the Classes table above.",
    responsive: "A scale transform on :active has no breakpoint, no text, and nothing that reflows — it does exactly the same squash at 375px as at 1920px, on whatever size the host element already is.",
  },
  sections: [
    {
      kind: "effect",
      id: "preview",
      title: "Effect",
      description:
        "Hold any of these down — every one squashes to the same 0.9 scale. Button carries press built in; the badge, row and card wear it explicitly.",
      appliedAs: "press · press · press · press",
      render: <PressSpecimen />,
      source: `<Button variant="outline">Button</Button>
<Badge variant="outline" className="press cursor-pointer">Badge</Badge>
<div role="button" tabIndex={0} className="press rounded-md border border-border bg-card">Row</div>
<Card role="button" tabIndex={0} className="press cursor-pointer">Card</Card>`,
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
        "The class alone is only the squash. A real target still needs a real element, a focus-visible ring and the 44px minimum target — nothing here is inert markup made clickable by CSS.",
      language: "tsx",
      code: `<button
  type="button"
  onClick={onSelect}
  className="press flex size-11 items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
>
  <Avatar ... />
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
                {
                  k: "press",
                  v: "transition: transform var(--duration-normal) var(--ease-emphasized); :active (or [data-pressed]) scales to 0.9 over --duration-press-in (40ms). The one click feel — button, badge, row and card above all wear the same class.",
                },
                {
                  k: "Tokens read",
                  v: "--duration-normal, --duration-press-in, --ease-emphasized.",
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
      description: "Two states, both driven by the browser's own :active pseudo-class — nothing here is tracked in script.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "rest", v: "The class's base transition sits idle — shown in every specimen above until pressed." },
                { k: "active (pressed)", v: "Scales to 0.9. Fires on :active for a pointer, and on [data-pressed] for a keyboard — the browser never applies :active to a keyboard Space (measured, see Keyboard), so the host sets the attribute while the key is down." },
                { k: "hover / focus-visible", v: "N/A to this class specifically — it defines no :hover rule of its own, and the focus ring in the specimens above is the host element's focus-visible styling, not something press supplies." },
                { k: "disabled / loading / success / error / empty", v: "N/A — a transform on :active has no data and nothing to disable; a disabled host simply never reaches :active because it cannot be activated." },
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
              The class carries none of this on its own — it is purely a
              transform on :active. Use a real <Code>button</Code> or{" "}
              <Code>a</Code> element (never a <Code>div</Code> with an onClick)
              so keyboard activation, the accessible role and the native focus
              behaviour come for free, add a visible focus-visible: ring, and
              keep the target at or above --size-target-min (44px) — extending
              the hit area with padding or an ::after inset rather than
              shrinking the class&rsquo;s effect if the drawn control is smaller.
            </p>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "keyboard",
      title: "Keyboard",
      description:
        "Measured twice, with two answers — which is the finding.",
      blocks: [
        {
          body: (
            <>
              <p className="type-body text-muted-foreground">
                <Code>press</Code>&rsquo;s scale fires on <Code>:active</Code>,
                and whether a keyboard press produces <Code>:active</Code>{" "}
                depends on things the class cannot see. Measured on a focused{" "}
                <Code>{`<button class="press">`}</Code> with Space held: a
                trusted key event from the browser&rsquo;s own input pipeline
                (Playwright over CDP) read <Code>scale(0.9)</Code>; a
                synthetic key event from an automation pane read{" "}
                <Code>none</Code>. And a host that is not a real{" "}
                <Code>{`<button>`}</Code> — an anchor, a{" "}
                <Code>role=&quot;button&quot;</Code> div — gets no keyboard{" "}
                <Code>:active</Code> from any browser. A class that only
                answered <Code>:active</Code> was a pointer convention wearing
                a general name.
              </p>
              <p className="type-body mt-3 text-muted-foreground">
                So the class answers <Code>[data-pressed]</Code> beside{" "}
                <Code>:active</Code>, with the same transform over the same
                tokens. What CSS cannot know is when a key is down — the host
                supplies that: <Code>onKeyDown</Code> / <Code>onKeyUp</Code> for
                Space and Enter set and clear the attribute, and{" "}
                <Code>onBlur</Code> clears it. The button below is exactly that
                and nothing more — it wears <Code>press</Code> and carries the
                three handlers. Try it: Tab to the button, hold Space.
              </p>
              <div className="mt-4">
                <PressKeyboardDemo />
              </div>
            </>
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
              press transitions transform over a fixed duration rather than
              looping — the blanket prefers-reduced-motion rule collapses
              that duration to 0.01ms, so the state change still happens,
              just without the travel. Nothing is lost: the resting and
              pressed states are both still reachable and visually distinct.
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
