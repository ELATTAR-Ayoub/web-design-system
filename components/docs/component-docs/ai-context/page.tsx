import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { ContextExamples, ContextShowcase, ContextStateGrid } from "./context-specimen";
import { meta } from "./meta";

const SRC = "components/ai-elements/context.tsx";

export const spec: ComponentDocSpec = {
  name: "ai-context",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "The composer's context meter: a percentage and a ring, and on hover a popup with the bar, input, output and price. The panel to the right is the same popup laid out in place.",
      label: "Context",
      render: <ContextShowcase />,
      source: `import {
  Context, ContextCacheUsage, ContextContent, ContextContentBody, ContextContentFooter,
  ContextContentHeader, ContextInputUsage, ContextOutputUsage, ContextReasoningUsage, ContextTrigger,
} from "@/components/ai-elements/context";

<Context usedTokens={54300} maxTokens={200000} modelId="gpt-4o" usage={usage}>
  <ContextTrigger size="sm" />
  <ContextContent>
    <ContextContentHeader />
    <ContextContentBody className="space-y-1.5">
      <ContextInputUsage />
      <ContextOutputUsage />
      <ContextReasoningUsage />
      <ContextCacheUsage />
    </ContextContentBody>
    <ContextContentFooter />
  </ContextContent>
</Context>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It composes the system&apos;s own HoverCard, Button and Progress, and prices usage with the <code className="type-code">tokenlens</code> package (a runtime dependency); the <code className="type-code">LanguageModelUsage</code> type comes from <code className="type-code">ai</code>.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Context takes the numbers and a HoverCard's props. usedTokens and maxTokens drive the percentage, the ring and the bar; usage (a LanguageModelUsage) supplies the per-row counts, and modelId is what tokenlens prices them against. Without a modelId the cost reads $0.00; without usage the input, output, reasoning and cache rows are simply not drawn. Every part reads from Context, so they must be inside it. Any part given children renders them in place of its default.",
      language: "tsx",
      code: `import type { LanguageModelUsage } from "ai";
import {
  Context, ContextCacheUsage, ContextContent, ContextContentBody, ContextContentFooter,
  ContextContentHeader, ContextInputUsage, ContextOutputUsage, ContextReasoningUsage, ContextTrigger,
} from "@/components/ai-elements/context";

function ContextMeter({ usage, usedTokens, maxTokens, modelId }: {
  usage?: LanguageModelUsage; usedTokens: number; maxTokens: number; modelId?: string;
}) {
  return (
    <Context usedTokens={usedTokens} maxTokens={maxTokens} usage={usage} modelId={modelId}>
      <ContextTrigger size="sm" />
      <ContextContent>
        <ContextContentHeader />
        <ContextContentBody className="space-y-1.5">
          <ContextInputUsage />
          <ContextOutputUsage />
          <ContextReasoningUsage />
          <ContextCacheUsage />
        </ContextContentBody>
        <ContextContentFooter />
      </ContextContent>
    </Context>
  );
}`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The meter has no loading or error of its own: it shows what it is given. The popup opens with no delay on hover or focus.",
      blocks: [
        { body: <ContextStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: the trigger is a ghost Button showing the used percentage in type-nav beside a 20px ring; the popup
                is closed. <strong>hover</strong> and <strong>focus-visible</strong>: the trigger takes Button&apos;s hover fill and ring,
                and the HoverCard opens (<code className="type-code">openDelay</code> and{" "}
                <code className="type-code">closeDelay</code> are 0). <strong>pressed</strong>: inherited from Button; pressing does
                nothing of its own. <strong>empty</strong>: zero used tokens reads 0% with an empty ring and bar; rows with a zero count
                are not drawn. <strong>disabled</strong>, <strong>loading</strong>, <strong>success</strong> and{" "}
                <strong>error</strong>: N/A — a read-only meter: it has no action to disable, no fetch to wait on, and no outcome to
                report; a caller that has no usage yet does not render it (the workspace renders it only when usage exists). The ring and
                bar do not change colour near the limit; the figure is the signal.
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
      description: "A part given children renders them instead of its default row.",
      label: "Custom row",
      render: <ContextExamples />,
      source: `<ContextContentBody>
  <ContextInputUsage>
    <p className="type-small text-muted-foreground">Prompt tokens are billed at the input rate.</p>
  </ContextInputUsage>
</ContextContentBody>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: `Read from ${SRC}.`,
      blocks: [
        {
          label: "Context",
          body: (
            <Meta
              items={[
                { k: "usedTokens", v: "number, required — tokens in the window now." },
                { k: "maxTokens", v: "number, required — the window size; used / max is the percentage and the bar's value." },
                { k: "usage?", v: "LanguageModelUsage — inputTokens, outputTokens, reasoningTokens and cachedInputTokens feed the rows and their prices." },
                { k: "modelId?", v: "string — the id tokenlens prices against; absent means every price reads $0.00." },
                { k: "...props", v: "HoverCard props (open, defaultOpen, onOpenChange…). openDelay and closeDelay default to 0." },
              ]}
            />
          ),
        },
        {
          label: "ContextTrigger",
          body: (
            <Meta
              items={[
                { k: "children?", v: "ReactNode — replaces the default percentage and ring; it becomes the HoverCard trigger as is." },
                { k: "...props", v: 'Button props on the default trigger (variant "ghost", type "button"). The ring is an svg with role="img" and the label "Model context usage".' },
              ]}
            />
          ),
        },
        { label: "ContextContent", body: <Meta items={[{ k: "...props", v: "HoverCardContent props. min-w-60, divided, no padding of its own." }]} /> },
        {
          label: "ContextContentHeader",
          body: (
            <Meta
              items={[
                { k: "children?", v: "ReactNode — replaces the default percentage, compact used / max count and the Progress bar." },
                { k: "...props", v: "div props. The bar is the thin Progress, h-1.5 (vendored change)." },
              ]}
            />
          ),
        },
        { label: "ContextContentBody", body: <Meta items={[{ k: "...props", v: "div props. Padded container for the usage rows." }]} /> },
        {
          label: "ContextContentFooter",
          body: (
            <Meta
              items={[
                { k: "children?", v: 'ReactNode — replaces "Total cost" and the dollar figure (input plus output, priced from modelId).' },
                { k: "...props", v: "div props. Secondary-filled band." },
              ]}
            />
          ),
        },
        { label: "ContextInputUsage", body: <Meta items={[{ k: "children?", v: "ReactNode — returned as is in place of the row." }, { k: "...props", v: "div props. Row \"Input\": compact count and its price; renders null when inputTokens is 0 or missing." }]} /> },
        { label: "ContextOutputUsage", body: <Meta items={[{ k: "children?", v: "ReactNode" }, { k: "...props", v: "div props. Row \"Output\"; null at zero." }]} /> },
        { label: "ContextReasoningUsage", body: <Meta items={[{ k: "children?", v: "ReactNode" }, { k: "...props", v: "div props. Row \"Reasoning\"; null at zero." }]} /> },
        { label: "ContextCacheUsage", body: <Meta items={[{ k: "children?", v: "ReactNode" }, { k: "...props", v: "div props. Row \"Cache\" from cachedInputTokens; null at zero." }]} /> },
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
                { k: "Roles and names", v: 'The trigger is a button whose content is the percentage text and a ring svg with role="img" and aria-label "Model context usage", so it is announced as, for example, "54.3% Model context usage". The Progress bar is a progressbar with its value. The popup is plain text rows, readable in order: percentage, used and max, then each row and its price.' },
                { k: "Keyboard", v: "Tab reaches the trigger and the card opens on focus (Radix HoverCard), closing on blur or Escape. Hover-only content is therefore also reachable without a pointer. Touch does not open a HoverCard, so the percentage on the trigger is the figure on a phone." },
                { k: "Target size", v: "The trigger is a Button; the workspace passes size=\"sm\" (32px) because it sits in the composer's toolbar beside other small controls — the one place the system allows 32px." },
                { k: "Colour", v: "Ring and text use currentColor and the muted foreground, so they follow the theme; nothing carries meaning by colour alone." },
                { k: "Motion", v: "The popup uses the system's popover animation. The ring has no animation of its own. Reduced motion collapses the popup transition." },
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
              The AgentWorkspace composer shows it in{" "}
              <code className="type-code">components/agent/workspace/workspace-composer.tsx</code>: the trigger is the composer&apos;s
              context meter (its number hides on narrow widths and the ring stays), and the popup lists input, output, reasoning and cache
              with the price, priced via tokenlens from the model id. The transport&apos;s usage is mapped to these props by{" "}
              <code className="type-code">contextProps</code> in <code className="type-code">reply-model.ts</code>. Vendored change: the
              bar in the popup header is the thin Progress (h-1.5), because the card already states the figure in words.
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
