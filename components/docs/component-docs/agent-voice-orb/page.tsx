import { VoiceOrb } from "@/components/agent/parts/voice-orb";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note, Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";
import { VoiceOrbSpecimen } from "./voice-orb-specimen";

export const spec: ComponentDocSpec = {
  name: "agent-voice-orb",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A dark glass sphere with a lit body, two reflections turning against each other, a highlight and a rim light. Pick a state: idle breathes slowly, listening sends a ring out, thinking spins its reflections fast, speaking pulses unevenly, asleep dims and slows right down.",
      label: "VoiceOrb",
      render: (
        <Panel label="Voice Orb" note="Switch the state">
          <VoiceOrbSpecimen />
        </Panel>
      ),
      source: `import { VoiceOrb, type VoiceOrbState } from "@/components/agent/parts/voice-orb";

const [state, setState] = React.useState<VoiceOrbState>("listening");

<VoiceOrb className="size-24" state={state} />`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Ships with the agent family; there is no voice-orb-only install. It is used by the AgentWorkspace header. It is plain DOM styled by the <code className="type-code">voice-orb</code> utility in <code className="type-code">styles/utilities.css</code>, which ships with the stylesheet.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Render VoiceOrb and hand it the state. It draws at size-8 unless you pass a className. It fetches nothing and needs no canvas or WebGL. In the AgentWorkspace header it mounts only while voice is active, through usePresence, and keeps the last state on screen while it plays its exit.",
      language: "tsx",
      code: `const presence = usePresence(voiceState !== "idle");
const [shown, setShown] = React.useState<VoiceOrbState>("listening");
if (voiceState !== "idle" && shown !== voiceState) setShown(voiceState);

{presence.mounted ? (
  <div className={presence.className}>
    <VoiceOrb state={shown} />
  </div>
) : null}`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The five states are the component's input; each cell renders the real orb in one of them.",
      blocks: [
        {
          body: (
            <StateGrid cols={3}>
              <StateCell label="idle" note="Breathes slowly, reflections drift">
                <VoiceOrb className="size-16" state="idle" />
              </StateCell>
              <StateCell label="listening" note="A ring ripples out, faster breath">
                <VoiceOrb className="size-16" state="listening" />
              </StateCell>
              <StateCell label="thinking" note="Still body, reflections spin fast">
                <VoiceOrb className="size-16" state="thinking" />
              </StateCell>
              <StateCell label="speaking" note="Uneven pulse, like a voice">
                <VoiceOrb className="size-16" state="speaking" />
              </StateCell>
              <StateCell label="asleep" note="Dimmed, barely moving">
                <VoiceOrb className="size-16" state="asleep" />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="N/A rows">
              <p>
                <strong>hover</strong>, <strong>focus-visible</strong> and <strong>pressed</strong> do not apply: an orb is a picture, not a control. <strong>disabled</strong>, <strong>loading</strong>, <strong>success</strong>, <strong>error</strong> and <strong>empty</strong> do not apply.
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
      description: "Read from components/agent/parts/voice-orb.tsx.",
      blocks: [
        {
          label: "VoiceOrb",
          anchor: "api-voice-orb",
          body: (
            <Meta
              items={[
                { k: "state?", v: "VoiceOrbState — \"idle\" (default), \"listening\", \"thinking\", \"speaking\" or \"asleep\"." },
                { k: "className?", v: "string — on the root. Size it here (size-8 by default); the layers fill it." },
                { k: "...props", v: "React.ComponentProps<\"div\"> — the rest goes to the root element." },
                { k: "Elements", v: "The root (data-slot=\"voice-orb\", data-state, role=\"img\", aria-label=\"Voice: <state>\") holds an aria-hidden halo ring and the clipped body; the body holds two reflection layers (flow, flow-alt) and the shine (highlight, rim light, edge shade). The voice-orb utility sets each state's pace and motion." },
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
                { k: "Roles and names", v: "One image named \"Voice: <state>\"; the layers inside are hidden from assistive technology. The name changes with the state, so a screen reader that re-reads the image hears the change." },
                { k: "Keyboard", v: "Not focusable and takes no pointer events of its own." },
                { k: "Reduced motion", v: "The system's reduced-motion rule stops the motion. Listening keeps a still ring around the orb, speaking stays slightly enlarged and asleep stays dimmed, so the states still read." },
                { k: "Contrast", v: "The orb is a mark with no text. It is a dark glass object in both themes, so it reads on light and dark surfaces alike; its reflections take the agent colour." },
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
              Voice needs a face that shows whether the agent is listening, thinking or talking. The AgentWorkspace header (<code>components/agent/workspace/workspace-header.tsx</code>) mounts it only while voice is active and keeps the last state on screen while it leaves. It is original to this system, built from the system&rsquo;s tokens and motion, and it makes no network request.
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
