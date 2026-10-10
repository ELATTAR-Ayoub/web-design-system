import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";
import { ReasoningPlayground, ReasoningStateGrid } from "./reasoning-specimen";

export const spec: ComponentDocSpec = {
  name: "ai-reasoning",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        'Press "Start thinking": the block opens and the label shimmers. Press "Finish thinking": it counts the seconds, then closes itself a second later.',
      label: "Reasoning",
      render: <ReasoningPlayground />,
      source: `import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";

<Reasoning isStreaming={streaming}>
  <ReasoningTrigger />
  <ReasoningContent>{thought}</ReasoningContent>
</Reasoning>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It uses the system Collapsible and, for the label while streaming, ai-shimmer; its content is rendered by Streamdown.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Drive isStreaming from whether the model is still producing thought. Reasoning opens when it becomes true and, once it has streamed, closes itself one second after it turns false; the time it was true becomes the label, in whole seconds. ReasoningContent takes a string and renders it as Markdown. Pass duration yourself when you already have the real figure, for instance for a message loaded from history.",
      language: "tsx",
      code: `import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";

<Reasoning
  isStreaming={streaming && !hasText}
  duration={finished ? Math.ceil(ms / 1000) : undefined}
>
  <ReasoningTrigger />
  <ReasoningContent>{steps.join("\\n\\n")}</ReasoningContent>
</Reasoning>

// Replace the label:
<ReasoningTrigger
  getThinkingMessage={(isStreaming, duration) =>
    isStreaming ? "Reading the file…" : \`Thought for \${duration ?? "a few"}s\`
  }
/>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "Reasoning has two lives: while streaming and after it. Both are shown below.",
      blocks: [
        { body: <ReasoningStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: closed, labelled &quot;Thought for a few seconds&quot; when no duration is known or &quot;Thought for N
                seconds&quot; when it is (&quot;1 second&quot; for one). <strong>loading</strong>: <code className="type-code">isStreaming</code>.
                The block opens (unless <code className="type-code">{"defaultOpen={false}"}</code> was set), and the label is Shimmer text reading
                &quot;Thinking...&quot;. A duration of 0 also shows it. <strong>success</strong>: streaming ends, the elapsed seconds replace the
                label and, if the block is still open, it closes after one second. This happens once; reopening it by hand is left alone.{" "}
                <strong>hover</strong>: the trigger&apos;s text goes from muted to full foreground. <strong>focus-visible</strong>: the
                trigger&apos;s ring comes from the focus utilities of the underlying Collapsible trigger. <strong>pressed</strong>: no separate
                treatment; the chevron turns 180 degrees when the block opens. <strong>empty</strong>: ReasoningContent with an empty string
                renders an empty block; callers should not mount Reasoning until there is thought to show. <strong>error</strong> and{" "}
                <strong>disabled</strong>: N/A. A thought is text the model produced, so there is nothing to fail, and there is no reason to stop
                the reader opening it.
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
      description: "Read from components/ai-elements/reasoning.tsx.",
      blocks: [
        {
          label: "Reasoning",
          anchor: "api-reasoning",
          body: (
            <Meta
              items={[
                { k: "isStreaming?", v: "boolean, default false. Opens the block, starts the timer, and swaps the label for the shimmer." },
                { k: "open?", v: "boolean. Controlled open state." },
                { k: "defaultOpen?", v: "boolean. Initial open state when uncontrolled. Defaults to isStreaming at mount. Setting it to false also stops the auto-open when streaming starts." },
                { k: "onOpenChange?", v: "(open: boolean) => void." },
                { k: "duration?", v: "number, seconds. Controlled elapsed time. When omitted, Reasoning measures the time isStreaming was true and rounds it up." },
                { k: "…Collapsible props", v: 'Base class: "not-prose mb-4". Add mb-0 when something else spaces it, as the workspace does.' },
              ]}
            />
          ),
        },
        {
          label: "ReasoningTrigger",
          anchor: "api-reasoning-trigger",
          body: (
            <Meta
              items={[
                { k: "getThinkingMessage?", v: "(isStreaming: boolean, duration?: number) => ReactNode. Builds the label." },
                { k: "children?", v: "ReactNode. Replaces the whole row: brain icon, label and chevron." },
                { k: "…CollapsibleTrigger props", v: "Base: a full-width row, type-small, muted, hover:text-foreground, with a 44px hit area added by an after: pseudo-element." },
              ]}
            />
          ),
        },
        {
          label: "ReasoningContent",
          anchor: "api-reasoning-content",
          body: (
            <Meta
              items={[
                { k: "children", v: "string, required. Rendered by Streamdown with the code, math, mermaid and CJK plugins." },
                { k: "…CollapsibleContent props", v: 'Base class: "mt-4 type-small text-muted-foreground outline-none". Opens with anim-expand and closes with anim-collapse, from Collapsible.' },
              ]}
            />
          ),
        },
        {
          label: "useReasoning",
          anchor: "api-use-reasoning",
          body: (
            <Meta
              items={[
                { k: "returns", v: "{ isStreaming, isOpen, setIsOpen, duration }. Throws if used outside Reasoning. For a custom trigger or content." },
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
      description: "A disclosure: one button that shows and hides a region.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Role and state", v: "The trigger is a button with aria-expanded and aria-controls from Radix Collapsible. The content is the controlled region." },
                { k: "Name", v: 'The trigger\'s name is its label text: "Thinking...", "Thought for N seconds" or "Thought for a few seconds". A custom label keeps that job; a custom trigger with only an icon would have no name.' },
                { k: "Keyboard", v: "Tab to the trigger, Enter or Space toggles. The auto-close fires once, one second after streaming ends." },
                { k: "Target size", v: "The label is a single line of small text, about 20px tall. An after: pseudo-element extends the hit area to 44px high without moving the layout." },
                { k: "Motion", v: "The shimmer label is the anim-shimmer-text CSS utility, the chevron turns with transition-transform, and the body opens with anim-expand. All three are CSS, so the blanket prefers-reduced-motion rule in styles/motion.css collapses them." },
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
                A model that thinks before it answers leaves the reader with a pause. Reasoning fills it: show that it is thinking, let the reader
                read the thought if they want to, and then get out of the way. The AgentWorkspace uses it in{" "}
                <code className="type-code">components/agent/workspace/workspace-reply.tsx</code> when a reply has thought and nothing else yet:
                Reasoning is streaming while there is no answer text, its duration comes from the measured time, and its content is the thought
                steps joined with blank lines. Once the reply has steps or text, the thought moves into the ChainOfThought instead.
              </p>
              <p className="mt-3">
                The vendored changes: the trigger gets a 44px hit area through an <code className="type-code">after:</code> pseudo-element,
                because a line of small text is a small target; the label now says &quot;1 second&quot; rather than &quot;1 seconds&quot;; and the
                hand-rolled enter and exit classes on ReasoningContent are gone, because the system Collapsible already animates from the measured
                Radix height and a second animation fought it.
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
