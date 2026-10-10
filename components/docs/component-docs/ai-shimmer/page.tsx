/**
 * Authored documentation page for `ai-shimmer`.
 *
 * Every live specimen renders the real `Shimmer` from
 * `components/ai-elements/shimmer.tsx` in `shimmer-specimen.tsx`.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";
import { ShimmerExamples, ShimmerPreview, ShimmerStateGrid } from "./shimmer-specimen";

export const spec: ComponentDocSpec = {
  name: "ai-shimmer",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "Text with a light sweeping across it, used for a label that says work is happening.",
      label: "Shimmer",
      render: <ShimmerPreview />,
      source: `import { Shimmer } from "@/components/ai-elements/shimmer";

<Shimmer className="type-small">Thinking…</Shimmer>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It needs the anim-shimmer-text utility in styles/motion.css and no other package.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        'children must be a plain string. Shimmer renders a p by default; pass as="span" to use it inside a line of text or a button label. Set the type role with className, since Shimmer sets none. Do not pass duration or spread; both are kept only so older call sites type-check, and they do nothing.',
      language: "tsx",
      code: `import { Shimmer } from "@/components/ai-elements/shimmer";

<Shimmer as="span" className="type-small">
  Working…
</Shimmer>

// Inside another component's label:
<ChainOfThoughtHeader>
  {working ? <Shimmer as="span">Working…</Shimmer> : "Worked through 3 steps"}
</ChainOfThoughtHeader>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "Shimmer is one state. It is a label that is on while work is on, and absent otherwise.",
      blocks: [
        { body: <ShimmerStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>loading</strong>: the only state it has. A gradient from the muted foreground to the agent colour sweeps across the text
                (<code className="type-code">anim-shimmer-text</code>), forever, until the caller unmounts it. <strong>rest</strong>: N/A, there is
                no still version; to stop it, render ordinary text instead. <strong>hover</strong>, <strong>focus-visible</strong> and{" "}
                <strong>pressed</strong>: N/A, it is not interactive. <strong>disabled</strong>: N/A for the same reason.{" "}
                <strong>success</strong> and <strong>error</strong>: N/A, it reports nothing; swap it for the result. <strong>empty</strong>: an
                empty string renders an empty element with no visible text. The text is transparent and painted by the gradient, so empty means
                nothing visible.
              </p>
            </Note>
          ),
        },
      ],
    },
    {
      kind: "showcase",
      id: "examples",
      title: "Examples",
      description: "As a span inside a sentence, and as a heading.",
      label: "Elements",
      render: <ShimmerExamples />,
      source: `<p className="type-body">
  The agent is <Shimmer as="span">reading the order form</Shimmer> now.
</p>

<Shimmer as="h3" className="type-h4">Preparing your summary</Shimmer>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/shimmer.tsx.",
      blocks: [
        {
          label: "Shimmer",
          anchor: "api-shimmer",
          body: (
            <Meta
              items={[
                { k: "children", v: "string, required. Not a ReactNode: the text is the only thing painted." },
                { k: "as?", v: 'ElementType, default "p". The element to render.' },
                { k: "className?", v: 'string. Merged after "anim-shimmer-text inline-block".' },
                { k: "duration?", v: "number. Deprecated and unused: timing comes from the --duration-shimmer-text token." },
                { k: "spread?", v: "number. Deprecated and unused." },
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
      description: "The text is real text, so a screen reader reads it normally. The motion is the part to care about.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Semantics", v: "A p, span or whatever as names. It has no role, no aria-live and no aria-busy, so a screen reader does not announce that work started or stopped. Put the status text in a real live region if it must be announced; the workspace shows it inside its own status rows." },
                { k: "Contrast", v: "The sweep runs from --muted-foreground through --agent and back, in the system's own tokens (the gradient is defined in styles/motion.css). The agent colour is the fill shade rather than an -ink shade, so check the pair you place it on if it carries small text." },
                { k: "Keyboard", v: "Not interactive, no tab stop." },
                { k: "Motion", v: "It is a CSS animation (anim-shimmer-text, timed by --duration-shimmer-text on --ease-move), so the blanket prefers-reduced-motion rule in styles/motion.css stops it. The vendored version it replaces was driven by JavaScript and ignored that preference." },
              ]}
            />
          ),
        },
      ],
    },
    {
      kind: "disclosure",
      id: "why",
      title: "Why this exists",
      blocks: [
        {
          body: (
            <Note tone="action">
              <p>
                A shimmer says &quot;still going&quot; without a spinner taking space. The AgentWorkspace uses it in three places: the chain-of-thought
                header shows &quot;Working…&quot; in{" "}
                <code className="type-code">components/agent/workspace/workspace-reply.tsx</code>; a running step&apos;s title in{" "}
                <code className="type-code">components/agent/workspace/run-inline.tsx</code>; and the composer&apos;s status line in{" "}
                <code className="type-code">components/agent/workspace/workspace-composer.tsx</code>. Inside the vendored Reasoning, the trigger
                uses it for &quot;Thinking...&quot;.
              </p>
              <p className="mt-3">
                The vendored change is the whole implementation. The upstream component ran a framer-motion background-position tween sized by
                the text length and an arbitrary duration prop, both invisible to check:tokens and exempt from prefers-reduced-motion. The system
                already had this effect as the anim-shimmer-text CSS utility, so Shimmer now only applies it, and duration and spread are kept as
                accepted, unused props so existing call sites still type-check. It also builds the element with createElement, because TypeScript
                narrows a bare ElementType used as a JSX tag to never.
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
      blocks: [{ body: <SourceMeta sourcePath={meta.sourcePath} exports={meta.exports} /> }],
    },
  ],
};
