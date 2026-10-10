import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";
import { EffortSliderSpecimen } from "./effort-slider-specimen";

export const spec: ComponentDocSpec = {
  name: "agent-effort-slider",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        'A notched track for choosing how long the agent thinks, from "Faster" to "Smarter". Press or drag the track, or focus it and use the arrow keys. At the last level the fill and the thumb take the agent colour.',
      label: "EffortSlider",
      render: (
        <Panel label="Effort Slider">
          <EffortSliderSpecimen />
        </Panel>
      ),
      source: `import { EffortSlider, isMaxEffort } from "@/components/agent/parts/effort-slider";

const efforts = ["Low", "Medium", "High", "Max"];
const [level, setLevel] = React.useState("Medium");

<EffortSlider efforts={efforts} value={level} onValueChange={setLevel} />`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Ships with the agent family; there is no slider-only install. It is used by the AgentWorkspace composer, which puts it in its Effort popover, and it uses only the base Icon.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "EffortSlider is controlled: it shows value and calls onValueChange with the level's name. Levels are strings in order, low to high, and the last one is \"max\": it is the level that arms the host's sparks, so test it with isMaxEffort(efforts, value). Put it in a panel about w-64 wide. Pass onEscape so Escape on the track closes the panel and returns focus to the message box, as the composer does.",
      language: "tsx",
      code: `<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <PromptInputButton aria-label={\`Choose effort, \${effort}\`}>
      <Icon icon={GaugeIcon} size="md" tone="inherit" />
      <span>{effort}</span>
    </PromptInputButton>
  </PopoverTrigger>
  <PopoverContent align="end" aria-label="Effort" className="w-64 p-3.5" side="top">
    <EffortSlider
      efforts={efforts}
      value={effort}
      onValueChange={onEffortChange}
      onEscape={() => setOpen(false)}
    />
  </PopoverContent>
</Popover>

// The host arms its sparks at the last level:
const maxed = isMaxEffort(efforts, effort);`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The track has a rest face for every level and a distinct face at the last one. The cells render the real component.",
      blocks: [
        {
          body: (
            <StateGrid cols={3}>
              <StateCell label="rest" note="a middle level, neutral fill and thumb">
                <EffortSliderSpecimen initial="Medium" />
              </StateCell>
              <StateCell label="minimum" note="the first level; the fill ends at the first notch">
                <EffortSliderSpecimen initial="Low" />
              </StateCell>
              <StateCell label="success (max)" note="the last level: agent-coloured fill and thumb">
                <EffortSliderSpecimen initial="Max" />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="Focus, and N/A rows">
              <p>
                <strong>focus-visible</strong> is a ring on the track, shown for keyboard focus only (Tab to the specimen above). <strong>pressed</strong> is the thumb snapping to the nearest notch under the pointer, and following it while dragging. <strong>hover</strong> changes only the cursor. <strong>disabled</strong> does not apply: render nothing, or disable the chip that opens it, when effort cannot be chosen. <strong>loading</strong> and <strong>error</strong> do not apply: the levels are given, and a change is immediate. <strong>empty</strong>: with no levels there is nothing to draw, and the host hides the chip.
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
      description: "Read from components/agent/parts/effort-slider.tsx.",
      blocks: [
        {
          label: "EffortSlider",
          anchor: "api-effort-slider",
          body: (
            <Meta
              items={[
                { k: "efforts", v: "string[] — required. The level names, low to high; the last is \"max\". One notch per level." },
                { k: "value", v: "string — required. The current level. A value that is not in efforts is treated as the first." },
                { k: "onValueChange", v: "(level: string) => void — required. Called only when the level changes, never with the current one." },
                { k: "onEscape?", v: "() => void — Escape pressed on the track. The host closes its panel and returns focus." },
                { k: "className?", v: "string — on the outer element (data-slot=\"effort-slider\"; data-max is set at the last level)." },
              ]}
            />
          ),
        },
        {
          label: "isMaxEffort",
          anchor: "api-is-max-effort",
          body: (
            <Meta
              items={[
                { k: "isMaxEffort(efforts, value)", v: "boolean — true when there is more than one level and value is the last. One level is never max." },
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
                { k: "Roles and names", v: 'The track is role="slider" named "Effort", over the level index (aria-valuemin 0, aria-valuemax levels minus one, aria-valuenow the index), with aria-valuetext set to the level name so a screen reader says "Medium" and not "1". The heading row repeats the name and the level as text, and a help icon with a tooltip explains that higher effort thinks longer.' },
                { k: "Keyboard", v: "Tab focuses the track. ArrowRight and ArrowUp raise the level, ArrowLeft and ArrowDown lower it, Home goes to the first and End to the last, and Escape calls onEscape. Each key moves one notch and stops at the ends." },
                { k: "Pointer", v: "A primary-button press snaps the thumb to the nearest notch and focuses the track; dragging follows the pointer. Touch is supported (touch-action is disabled on the track so a drag does not scroll)." },
                { k: "Target sizes", v: "The track is 22px tall and the thumb 28px, inside a panel the composer opens from a 32px toolbar chip. It is a single large drag target, and the keyboard steps are an alternative to dragging it." },
                { k: "Colour", v: "The last level uses the agent colour for the fill and thumb. The level is also named in text, so colour is never the only signal." },
                { k: "Motion", v: "The fill and thumb move with a short transition from the system's duration and easing tokens; reduced motion collapses it to a single frame." },
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
              Effort is a choice between speed and care, and a slider with named notches states that trade more clearly than a list. The AgentWorkspace composer (<code>components/agent/workspace/workspace-composer.tsx</code>) opens it from its Effort chip in a popover above the box, and returns focus to the message so the sparks it arms are seen. At the last level, <code>isMaxEffort</code> is what tells the composer to arm <code>SparkField</code>. It is original to this system and ships with the agent family; the track, thumb, tint and motion all come from the system&rsquo;s tokens.
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
