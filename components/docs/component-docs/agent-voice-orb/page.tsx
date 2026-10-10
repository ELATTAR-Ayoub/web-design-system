/**
 * Authored documentation page for `agent-voice-orb`.
 *
 * The orb is driven by a state prop, so the switcher lives in
 * `voice-orb-specimen.tsx`; the States grid renders the real orb directly.
 */

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
        "Pick a state. Listening is a solid disc that fades down and back; thinking is a faint disc with a dot inside a turning arc; speaking is three bars that blink out of step. With reduced motion the three shapes still differ; only the movement stops.",
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
          Ships with the agent family; there is no voice-orb-only install. It is used by the AgentWorkspace header, and it has no dependency beyond the system&rsquo;s own class utility.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Render VoiceOrb while voice is active and hand it the state. It draws at size-8 unless you pass a className. It fetches nothing and needs no canvas or WebGL: it is a few spans and the agent colour, so it follows the theme. To let it leave gracefully, mount it through usePresence and keep the last state on screen while it plays its exit.",
      language: "tsx",
      code: `// "idle" is the orb's absence, not one of its states.
const active = voiceState !== "idle";
const presence = usePresence(active);
const [shown, setShown] = React.useState<VoiceOrbState>("listening");
if (active && shown !== voiceState) setShown(voiceState);

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
      description: "The three states are the component's input; each cell renders the real orb in one of them.",
      blocks: [
        {
          body: (
            <StateGrid cols={3}>
              <StateCell label="listening" note="Solid disc, fading down and back">
                <VoiceOrb className="size-16" state="listening" />
              </StateCell>
              <StateCell label="thinking" note="Faint disc, dot, turning arc">
                <VoiceOrb className="size-16" state="thinking" />
              </StateCell>
              <StateCell label="speaking" note="Faint disc, three bars blinking out of step">
                <VoiceOrb className="size-16" state="speaking" />
              </StateCell>
            </StateGrid>
          ),
        },
        {
          body: (
            <Note tone="action" title="N/A rows">
              <p>
                <strong>hover</strong>, <strong>focus-visible</strong> and <strong>pressed</strong> do not apply: an orb is a picture, not a control. <strong>idle</strong> is the orb not being rendered. <strong>disabled</strong>, <strong>loading</strong>, <strong>success</strong>, <strong>error</strong> and <strong>empty</strong> do not apply.
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
                { k: "state", v: "VoiceOrbState — required. \"listening\", \"thinking\" or \"speaking\"." },
                { k: "className?", v: "string — on the root. Size it here (size-8 by default); the layers fill it." },
                { k: "...props", v: "React.ComponentProps<\"div\"> — the rest goes to the root element." },
                { k: "VoiceOrbState", v: "The state union, exported as a type: the composer's VoiceState without \"idle\"." },
                { k: "Elements", v: "The root (data-slot=\"voice-orb\", data-state, role=\"img\", aria-label=\"Voice: <state>\") is clipped to a circle and holds aria-hidden layers that depend on the state. listening: a solid disc (bg-agent, anim-pulse, fading to 75% and back) with a bg-background dot. thinking: a faint disc (bg-agent/15), a turning arc (anim-spin, border-t-agent) and a bg-agent dot. speaking: a faint disc and three bg-agent bars (anim-caret, each started a third of a cycle after the last)." },
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
                { k: "Roles and names", v: "One image with the name \"Voice: listening\", \"Voice: thinking\" or \"Voice: speaking\"; the layers inside are hidden from assistive technology. The name changes with the state, so a screen reader that re-reads the image hears the change." },
                { k: "Keyboard", v: "Not focusable and takes no pointer events of its own." },
                { k: "Reduced motion", v: "The fade, the spin and the blink are CSS animations, so the system's reduced-motion rule stops them. The states stay distinguishable without movement: listening is a solid disc, thinking has the arc, speaking has the three bars." },
                { k: "Contrast", v: "The orb is a mark with no text. It takes the agent colour, which is the lifted end of the action ramp in dark and the deep end in light, so it reads on either surface." },
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
              Voice needs a face that shows whether the agent is listening, thinking or talking. The AgentWorkspace header (<code>components/agent/workspace/workspace-header.tsx</code>) mounts it only while voice is active and keeps the last state on screen while it leaves. It is original to this system, drawn from the agent token and the system&rsquo;s motion utilities, and it makes no network request.
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
