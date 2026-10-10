import { AvatarMatrix, AvatarPlayground } from "./avatar-specimen";
import { AgentAvatar } from "@/components/agent";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Code, Meta, Note, StateCell, StateGrid } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "agent-avatar",
  omitted: {
    keyboard: "AgentAvatar is role=\"img\" and takes no pointer or keyboard input, per the States note above — there is no key it responds to and no place in the tab sequence it occupies.",
  },
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "The default face: an isometric cube scene per agent state, and the status line beside it names the state in words. Rule 2 of the seven — blue acts, lime values — is why every scene is lit from --agent-cube-accent, which points at the blue ramp by default. Press a state below the cube to see it — all twenty are wired, not a sample of them.",
      label: "AgentAvatar",
      render: <AvatarPlayground />,
      source: `import { useState } from "react";
import { AgentAvatar, AGENT_STATES, AGENT_STATE_LABEL, type AgentState } from "@/components/agent";
import { Button } from "@/components/ui/button";

function AvatarPlayground() {
  const [state, setState] = useState<AgentState>("thinking");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-5 rounded-lg border border-border bg-background p-6">
        <AgentAvatar state={state} size="xl" />
        <p className="type-body text-foreground" role="status">{AGENT_STATE_LABEL[state]}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {AGENT_STATES.map((s) => (
          <Button key={s} size="sm" variant={s === state ? "default" : "outline"} onClick={() => setState(s)}>
            {s}
          </Button>
        ))}
      </div>
    </div>
  );
}`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Installed with the agent workspace — there is no
          avatar-only install.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "AgentAvatar is one implementation of AvatarRenderer. Render it directly wherever a small, stateful face is useful outside the full workspace — the workspace itself takes an avatar prop and defaults to this one.",
      language: "tsx",
      code: `import { AgentAvatar } from "@/components/agent";

export function WorkingIndicator() {
  return <AgentAvatar state="thinking" size="lg" accent="var(--agent)" />;
}`,
    },
    {
      kind: "showcase",
      id: "variants",
      title: "Variants",
      description:
        "The accent is a prop, so one avatar set serves several products. Any CSS colour works — a token, a hex, a color-mix. The accent's top and right faces are mixed from that one value in oklab, so re-pointing a single line recolours all twenty scenes correctly — three lit faces, not three unrelated colours.",
      label: "accent",
      render: (
        <StateGrid cols={4}>
          <StateCell label="var(--agent)" note="the default">
            <AgentAvatar state="calling_tools" size="lg" />
          </StateCell>
          <StateCell label="var(--color-value)" note="values, not actions">
            <AgentAvatar state="calling_tools" size="lg" accent="var(--color-value)" />
          </StateCell>
          <StateCell label="var(--color-success)" note="a different product">
            <AgentAvatar state="calling_tools" size="lg" accent="var(--color-success)" />
          </StateCell>
          <StateCell label="var(--color-info)" note="a different product">
            <AgentAvatar state="calling_tools" size="lg" accent="var(--color-info)" />
          </StateCell>
        </StateGrid>
      ),
      source: `<AgentAvatar state="calling_tools" size="lg" accent="var(--color-success)" />`,
    },
    {
      kind: "showcase",
      id: "sizes",
      title: "Sizes",
      description:
        "Four scales. The scene sizes itself within the box rather than being transform-scaled, so strokes stay one pixel wide at every size.",
      label: "size",
      render: (
        <StateGrid cols={4}>
          <StateCell label="sm" note="32px · inline, beside a chip">
            <AgentAvatar state="thinking" size="sm" />
          </StateCell>
          <StateCell label="md" note="48px · workspace header">
            <AgentAvatar state="thinking" size="md" />
          </StateCell>
          <StateCell label="lg" note="80px · welcome card">
            <AgentAvatar state="thinking" size="lg" />
          </StateCell>
          <StateCell label="xl" note="128px · empty state, hero">
            <AgentAvatar state="thinking" size="xl" />
          </StateCell>
        </StateGrid>
      ),
      source: `<AgentAvatar state="thinking" size="sm" />
<AgentAvatar state="thinking" size="md" />
<AgentAvatar state="thinking" size="lg" />
<AgentAvatar state="thinking" size="xl" />`,
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description:
        "The face alone, at the size and state a welcome card or an empty state reaches for — present participles with an ellipsis for anything ongoing, bare words for the three resting states, so a glance at the text alone tells a reader whether to wait.",
      label: "AgentAvatar",
      render: <AgentAvatar state="thinking" size="lg" />,
      source: `<AgentAvatar state="thinking" size="lg" />`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description:
        "AvatarRendererProps, read from components/agent/avatar/types.ts. The workspace never imports a specific avatar — it takes an AvatarRenderer and calls it, which is what makes the face genuinely swappable.",
      blocks: [
        {
          label: "AgentAvatar",
          body: (
            <Meta
              items={[
                { k: "state", v: "AgentState — required. Which of the twenty to draw. See States below." },
                { k: "size?", v: '"sm" | "md" | "lg" | "xl", default "md" — a renderer may ignore this.' },
                { k: "accent?", v: 'string, default "var(--agent)" — any CSS colour, passed through to --agent-cube-accent.' },
                { k: "speed?", v: "number, default 1 — multiplier; every duration in the set divides by it." },
                { k: "className?", v: "string" },
              ]}
            />
          ),
        },
        {
          label: "AvatarRenderer",
          body: (
            <p className="type-small max-w-2xl text-muted-foreground">
              <code className="type-code">type AvatarRenderer = (props: AvatarRendererProps) =&gt; React.ReactNode</code>{" "}
              — the seam a different face satisfies: a mascot, a video, a Lottie
              or a photograph is one module implementing this signature, passed
              as <code className="type-code">AgentWorkspace</code>&rsquo;s{" "}
              <code className="type-code">avatar</code> prop. Nothing in the
              state machine, the transcript or the transport moves.
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
        "Twenty states, taken from the avatar handoff's enum so the vocabulary and the artwork can never drift apart. The list is deliberately closed: a caller who needs a state that is not here is describing something the avatar cannot draw, and silently falling back to a generic \"working\" is how a status indicator starts lying.",
      blocks: [
        { body: <AvatarMatrix /> },
        {
          body: (
            <Note tone="action" title="No interaction states">
              <p>
                AgentAvatar is decorative (<code className="type-code">role=&quot;img&quot;</code>)
                and takes no pointer or keyboard input, so{" "}
                <strong>hover</strong>, <strong>focus-visible</strong>,{" "}
                <strong>pressed</strong>, <strong>disabled</strong> and{" "}
                <strong>empty</strong> are all N/A: there is no control to
                focus or press, and the component always renders one of the
                twenty states above, never nothing. <strong>loading</strong>{" "}
                and <strong>success</strong> are likewise N/A on the avatar
                itself — those facts are what the twenty states already
                encode (<code className="type-code">thinking</code>,{" "}
                <code className="type-code">done</code>, and so on), not a
                second axis layered on top.
              </p>
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
        "Decorative but not silent: the cube reports what it is doing.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role and name", v: 'role="img" aria-label={AGENT_STATE_LABEL[state]} — the accessible name changes with the state, so a screen reader hears "Thinking" or "Calling tools" rather than silence.' },
              ]}
            />
          ),
        },
        {
          label: "Reduced motion",
          body: (
            <Note tone="value" title="Why the blanket rule is not enough">
              The global reduced-motion rule collapses every animation to
              0.01ms and one iteration, which for most things is a freeze at
              the final keyframe. But the <code className="type-code">appear</code>{" "}
              and <code className="type-code">drop</code> scenes deliberately{" "}
              <em>end</em> at opacity 0 — cubes arrive one by one and then
              hard-cut back, Game Boy logo style — so the blanket rule would
              freeze half these scenes to nothing at all. The handoff&rsquo;s
              instruction is to fall back to the static cube layout, so that
              is stated explicitly in <code className="type-code">globals.css</code>{" "}
              rather than inherited: no animation, everything visible, no
              transforms.
            </Note>
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "responsive",
      title: "Responsive",
      blocks: [
        {
          body: (
            <p className="type-small text-muted-foreground">
              Sized entirely by the <Code>size</Code> prop&rsquo;s four fixed
              scales, in pixels — there is no breakpoint-driven layout of its
              own for a caller to account for, and the cube scene sizes
              itself within that box rather than being transform-scaled, so
              strokes stay one pixel wide regardless of viewport. A surface
              that places the avatar smaller on a narrow screen passes a
              smaller <Code>size</Code>, the same way any other prop-driven
              dimension would. This page measured no overflow at 375, 768,
              1440 or 1920px, no overflow under 200% text-only zoom, and no
              RTL overflow — the avatar has no directional artwork to mirror.
            </p>
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
