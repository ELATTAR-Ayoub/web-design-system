/**
 * Authored documentation page for `agent-spark-field`.
 *
 * Arming the field needs focus, effort and motion state, so every live render
 * goes through `spark-field-specimen.tsx`.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";
import { SparkFieldSpecimen } from "./spark-field-specimen";

export const spec: ComponentDocSpec = {
  name: "agent-spark-field",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A prompt box set to Max effort. Click into it and the box tints in the agent colour and sparks rise from its floor; type and they speed up and flare on every key. Lower the effort or click away and it stops. With reduced motion it never starts.",
      label: "SparkField",
      render: (
        <Panel label="Spark Field" note="Max effort, focus the box">
          <SparkFieldSpecimen />
        </Panel>
      ),
      source: `import { SparkField, type SparkFieldHandle } from "@/components/agent/parts/spark-field";
import { isMaxEffort } from "@/components/agent/parts/effort-slider";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

const reduce = usePrefersReducedMotion();
const sparks = React.useRef<SparkFieldHandle>(null);
const armed = isMaxEffort(efforts, effort) && focused && !reduce;

<div className="relative isolate overflow-hidden rounded-xl border">
  <SparkField active={armed} ref={sparks} />
  <textarea onChange={() => sparks.current?.bump()} onFocus={…} onBlur={…} />
</div>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Ships with the agent family; there is no spark-field-only install. It is used by the AgentWorkspace composer, and it has no dependency beyond the system&rsquo;s own class utility.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Place SparkField as the first child of the prompt box and make the box relative and isolate: the field fills it behind the content (-z-10) and is clipped by the box's own rounded corners. It draws nothing on its own: the host passes active, and arms it with all three of the same conditions as the product, which are max effort, the prompt focused, and no reduced-motion preference. Hold a ref and call ref.current?.bump() on each keystroke, which speeds the sparks up and flares them. The sparks take the agent colour from the canvas's own text colour, so they follow the theme.",
      language: "tsx",
      code: `const sparks = React.useRef<SparkFieldHandle>(null);
const reduce = usePrefersReducedMotion();
const sparking = isMaxEffort(efforts, effort) && focused && !reduce;

<form className="relative isolate overflow-hidden rounded-xl border">
  <SparkField active={sparking} ref={sparks} />
  <textarea
    onFocus={() => setFocused(true)}
    onBlur={() => setFocused(false)}
    onChange={(e) => {
      setValue(e.currentTarget.value);
      sparks.current?.bump();
    }}
  />
</form>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The field is either off or armed; the cells render the real field behind a real prompt box.",
      blocks: [
        {
          body: (
            <StateGrid cols={2}>
              <StateCell label="rest (not armed)" note="Medium effort: no tint, nothing drawn even when focused">
                <SparkFieldSpecimen initialEffort="Medium" withSlider={false} />
              </StateCell>
              <StateCell label="armed" note="Max effort and focus: click into the box">
                <SparkFieldSpecimen initialEffort="Max" withSlider={false} />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="N/A rows">
              <p>
                <strong>hover</strong>, <strong>focus-visible</strong> and <strong>pressed</strong> do not apply: the field is decoration and takes no pointer events (it is aria-hidden and pointer-events-none); focus belongs to the prompt it sits behind, and focus is one of the conditions that arms it. <strong>disabled</strong> is <code>active</code> false. <strong>loading</strong>, <strong>success</strong>, <strong>error</strong> and <strong>empty</strong> do not apply.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/agent/parts/spark-field.tsx.",
      blocks: [
        {
          label: "SparkField",
          anchor: "api-spark-field",
          body: (
            <Meta
              items={[
                { k: "active", v: "boolean — required. true starts the particle loop and fades the tint in; false stops the loop, clears the canvas and fades the tint out." },
                { k: "ref?", v: "Ref<SparkFieldHandle> — gives the host the imperative handle (React 19 ref prop)." },
                { k: "className?", v: "string — on the tint layer (data-slot=\"spark-tint\"), not on the canvas." },
                { k: "Elements", v: "Two aria-hidden layers, both absolutely placed at the back (-z-10) and rounded to inherit the box's corners: a tint (bg-agent/15, fades with the slow duration token) and a canvas (data-slot=\"spark-field\", text-agent, data-active when armed)." },
                { k: "Loop", v: "While active: 26 sparks are seeded, then one more every 0.14 s up to 30 live, rising and swaying with a twinkle. Typing adds energy that decays over about 0.8 s, which speeds the sparks, enlarges them and widens their glow. The canvas is sized to its box and follows resizes, at a pixel ratio capped at 2." },
              ]}
            />
          ),
        },
        {
          label: "SparkFieldHandle",
          anchor: "api-handle",
          body: (
            <Meta
              items={[
                { k: "bump()", v: "() => void — feed the loop one keystroke: adds energy (capped) and queues one flare. Safe to call when the field is not armed; it does nothing visible until it is." },
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
            <Meta
              items={[
                { k: "Roles and names", v: "Both layers are aria-hidden and carry no text or role. The field conveys nothing the page depends on: max effort is also named in the Effort chip and slider." },
                { k: "Keyboard", v: "Not focusable and takes no pointer events; typing in the prompt behind it is unaffected." },
                { k: "Reduced motion", v: "A canvas loop is JavaScript motion, so the system's CSS rule cannot stop it: the host must not arm it. The rule is that active needs no reduced-motion preference (usePrefersReducedMotion), and the specimen follows it. The tint's fade is a CSS transition and is collapsed by the system rule." },
                { k: "Contrast", v: "Sparks and the tint are drawn behind the text at low opacity (the tint is 15%) and never carry text. Keep the prompt's own text on a token colour." },
                { k: "Glow", v: "The sparks carry a soft shadow blur that widens as the user types. It is on a decoration only, and it is rationed: it runs only at max effort while the box is focused." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "why",
      title: "Why",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              Max effort should feel different from the others, and a sparking box tells the reader the agent is going to think hard before they send. The AgentWorkspace composer (<code>components/agent/workspace/workspace-composer.tsx</code>) arms it when the Effort chip is at its last level, the message is focused and motion is not reduced, and calls <code>bump()</code> on each keystroke. It is original to this system and ships with the agent family, with the colours taken from the agent token and the timing from the system&rsquo;s duration tokens.
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
