/**
 * Authored documentation page for `ai-suggestion`.
 *
 * Every live specimen renders the real parts from
 * `components/ai-elements/suggestion.tsx` in `suggestion-specimen.tsx`.
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";
import { SuggestionExamples, SuggestionPlayground, SuggestionStateGrid } from "./suggestion-specimen";

export const spec: ComponentDocSpec = {
  name: "ai-suggestion",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A row of prompt chips that scrolls sideways when it is too long. Pick one; the panel note shows the text it handed back.",
      label: "Suggestions",
      render: <SuggestionPlayground />,
      source: `import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";

<Suggestions>
  {items.map((s) => (
    <Suggestion key={s} onClick={(text) => send(text)} suggestion={s} />
  ))}
</Suggestions>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It is built on the system Button and ScrollArea. The system also has agent-suggestions, a standalone row with its own group landmark and 44px chips; this one is the AI Elements version the workspace uses.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Suggestions is the row, Suggestion is one chip. A chip sends its suggestion string through onClick; children, when given, change only what is shown, not what is sent. In a place with room, such as an empty thread, pass flex-wrap and justify-center to Suggestions to wrap the chips instead of scrolling them.",
      language: "tsx",
      code: `import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";

<Suggestions className="w-full flex-wrap justify-center">
  {starters.map((s) => (
    <Suggestion key={s} onClick={onSend} suggestion={s} />
  ))}
</Suggestions>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "Every chip is Button variant outline, size sm underneath, so it inherits Button's whole state set.",
      blocks: [
        { body: <SuggestionStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>, <strong>hover</strong>, <strong>focus-visible</strong> and <strong>pressed</strong>: all inherited from
                Button&apos;s outline variant; the chip draws none of them itself. <strong>disabled</strong>: pass{" "}
                <code className="type-code">disabled</code> to a Suggestion, which reaches the Button; there is no row-wide switch, so disable
                each chip when the composer is busy. <strong>empty</strong>: a Suggestions with no children renders an empty row, so do not mount
                it without chips. The workspace guards that with a length check. <strong>loading</strong>, <strong>success</strong> and{" "}
                <strong>error</strong>: N/A. A click calls onClick and returns; the chip has no asynchronous work of its own to report.
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
      description: "Wrapped and centred, the way the workspace shows starter prompts in an empty thread.",
      label: "Wrapped",
      render: <SuggestionExamples />,
      source: `<Suggestions className="w-full flex-wrap justify-center">
  <Suggestion onClick={send} suggestion="Summarise this" />
</Suggestions>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/suggestion.tsx.",
      blocks: [
        {
          label: "Suggestions",
          anchor: "api-suggestions",
          body: (
            <Meta
              items={[
                { k: "className?", v: 'string. Applied to the inner row, not the ScrollArea: "flex w-max flex-nowrap items-center gap-2". Use it to wrap or centre the chips.' },
                { k: "children", v: "The chips." },
                { k: "…ScrollArea props", v: 'Everything else goes to the ScrollArea, whose own class is "w-full overflow-x-auto whitespace-nowrap". The horizontal scrollbar is hidden.' },
              ]}
            />
          ),
        },
        {
          label: "Suggestion",
          anchor: "api-suggestion",
          body: (
            <Meta
              items={[
                { k: "suggestion", v: "string, required. Passed to onClick and shown as the label unless children is given." },
                { k: "onClick?", v: "(suggestion: string) => void. Receives the suggestion string, not the event." },
                { k: "variant?", v: 'Button variant, default "outline".' },
                { k: "size?", v: 'Button size, default "sm" (min-h-8, 32px).' },
                { k: "children?", v: "ReactNode. Replaces the label." },
                { k: "…Button props", v: 'Except onClick. Base class "cursor-pointer px-4"; always type="button".' },
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
      description: "A row of ordinary buttons. The row itself is not a landmark.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: "Each chip is a button named by its visible text (children if given, otherwise the suggestion). The row has no role or name; unlike agent-suggestions, it is not a group. Wrap it in an element with a label if the set needs announcing." },
                { k: "Keyboard", v: "Tab moves through the chips, Enter or Space presses one. In a scrolling row the browser scrolls a focused chip into view." },
                { k: "Target size", v: "The chip is drawn 32px high (Button sm) and its hit area is 44px: an ::after reclaims the missing height (overflow-visible lets it through Button's overflow-hidden), so a row of suggestions meets the floor without looking heavier." },
                { k: "Motion", v: "None of its own. The scrollbar is hidden, so a reader who cannot swipe or use a wheel reaches off-screen chips only by tabbing; prefer wrapping when there is room." },
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
                Most people do not know what to ask. A row of chips turns a blank composer into a choice. The AgentWorkspace uses Suggestions in two
                places: under a finished reply, where the model offers follow-ups, in{" "}
                <code className="type-code">components/agent/workspace/workspace-reply.tsx</code>; and in the empty thread, where the starter
                prompts wrap and centre inside the ConversationEmptyState, in{" "}
                <code className="type-code">components/agent/workspace/workspace-thread.tsx</code>. In both, a chip sends its text as the next
                turn.
              </p>
              <p className="mt-3">
                The vendored change: the chip dropped the stock <code className="type-code">rounded-full</code>, because Button already ships the
                pill radius (RULES section 3, controls are pills), so the arbitrary radius was redundant and off the scale.
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
