import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";
import { QueueExamples, QueueShowcase, QueueStateGrid } from "./queue-specimen";

const SRC = "components/ai-elements/queue.tsx";

export const spec: ComponentDocSpec = {
  name: "ai-queue",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "Messages waiting to be sent while the agent is busy. Hover or focus a row for move, send now and remove; remove them all and the queue goes away.",
      label: "Queue",
      render: <QueueShowcase />,
      source: `import {
  Queue, QueueItem, QueueItemAction, QueueItemActions, QueueItemContent, QueueItemIndicator,
  QueueSection, QueueSectionContent, QueueSectionLabel, QueueSectionTrigger,
} from "@/components/ai-elements/queue";

<Queue>
  <QueueSection>
    <QueueSectionTrigger>
      <QueueSectionLabel count={messages.length} label="Queued" />
    </QueueSectionTrigger>
    <QueueSectionContent>
      <ul>
        {messages.map((m) => (
          <QueueItem key={m.id}>
            <div className="flex items-center gap-2">
              <QueueItemIndicator />
              <QueueItemContent>{m.text}</QueueItemContent>
              <QueueItemActions>
                <QueueItemAction aria-label="Remove from queue" onClick={() => remove(m.id)}>
                  <Icon icon={Trash2Icon} size="xs" tone="inherit" />
                </QueueItemAction>
              </QueueItemActions>
            </div>
          </QueueItem>
        ))}
      </ul>
    </QueueSectionContent>
  </QueueSection>
</Queue>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It composes the system&apos;s own Button, Collapsible and ScrollArea.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Queue is only the frame. Put a QueueSection (a Collapsible) inside it with a trigger holding a QueueSectionLabel, then a ul of QueueItems. Each QueueItem is an li: an indicator, its content, and a QueueItemActions group of QueueItemAction buttons; attachments go in a QueueItemAttachment row below. Every QueueItemAction needs an aria-label, since its only content is a glyph. For a scrolling list use QueueList, which supplies its own ul.",
      language: "tsx",
      code: `import {
  Queue, QueueItem, QueueItemAction, QueueItemActions, QueueItemAttachment, QueueItemContent,
  QueueItemFile, QueueItemIndicator, QueueSection, QueueSectionContent, QueueSectionLabel,
  QueueSectionTrigger, type QueueMessage,
} from "@/components/ai-elements/queue";

function DockedQueue({ queued }: { queued: QueueMessage[] }) {
  if (queued.length === 0) return null;
  return (
    <Queue className="max-h-40 w-full overflow-y-auto">
      <QueueSection>
        <QueueSectionTrigger>
          <QueueSectionLabel count={queued.length} label="Queued" />
        </QueueSectionTrigger>
        <QueueSectionContent>
          <ul>
            {queued.map((m) => (
              <QueueItem key={m.id}>
                <div className="flex items-center gap-2">
                  <QueueItemIndicator />
                  <QueueItemContent>{m.parts.find((p) => p.type === "text")?.text}</QueueItemContent>
                  <QueueItemActions>
                    <QueueItemAction aria-label="Send now" onClick={() => sendNow(m.id)}>…</QueueItemAction>
                  </QueueItemActions>
                </div>
                <QueueItemAttachment>
                  {m.parts.filter((p) => p.type === "file").map((f) => (
                    <QueueItemFile key={f.filename}>{f.filename}</QueueItemFile>
                  ))}
                </QueueItemAttachment>
              </QueueItem>
            ))}
          </ul>
        </QueueSectionContent>
      </QueueSection>
    </Queue>
  );
}`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The frame has none of its own; state lives on the section fold, the row and its actions.",
      blocks: [
        { body: <QueueStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: rows are muted text with an outlined dot. <strong>hover</strong>: a row fills with muted and
                reveals its actions; a section trigger lightens its fill. <strong>focus-visible</strong>: actions are invisible until the
                row is hovered, so callers add <code className="type-code">focus-visible:opacity-100</code> and{" "}
                <code className="type-code">pointer-coarse:opacity-100</code> (the workspace does) so keyboard and touch can see them.{" "}
                <strong>pressed</strong>: inherited from Button. <strong>disabled</strong>: a QueueItemAction takes{" "}
                <code className="type-code">disabled</code> (the workspace disables Move up on the first row and Move down on the last).{" "}
                <strong>success</strong>: a completed item dims and strikes through via the <code className="type-code">completed</code>{" "}
                prop. <strong>loading</strong> and <strong>error</strong>: N/A — a queued message has no in-flight or failed state; once
                sent it leaves the queue. <strong>empty</strong>: Queue does not draw an empty state; the caller renders nothing when
                nothing is queued, which is what the workspace does.
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
      description: "QueueList with todo-style rows: a completed one and a pending one, inside a scroll area capped at 10rem.",
      label: "Todos",
      render: <QueueExamples />,
      source: `<Queue>
  <QueueList>
    {todos.map((todo) => (
      <QueueItem key={todo.id}>
        <div className="flex items-center gap-2">
          <QueueItemIndicator completed={todo.status === "completed"} />
          <QueueItemContent completed={todo.status === "completed"}>{todo.title}</QueueItemContent>
        </div>
        {todo.description && <QueueItemDescription completed={todo.status === "completed"}>{todo.description}</QueueItemDescription>}
      </QueueItem>
    ))}
  </QueueList>
</Queue>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: `Read from ${SRC}.`,
      blocks: [
        {
          label: "Types",
          body: (
            <Meta
              items={[
                { k: "QueueMessagePart", v: "{ type: string; text?: string; url?: string; filename?: string; mediaType?: string }." },
                { k: "QueueMessage", v: "{ id: string; parts: QueueMessagePart[] }." },
                { k: "QueueTodo", v: '{ id: string; title: string; description?: string; status?: "pending" | "completed" }.' },
              ]}
            />
          ),
        },
        { label: "Queue", body: <Meta items={[{ k: "...props", v: "div props. Frame: rounded-xl, border, background, shadow-e1 (upstream used Tailwind's stock elevation)." }]} /> },
        {
          label: "QueueSection",
          body: (
            <Meta
              items={[
                { k: "defaultOpen?", v: "boolean, default true." },
                { k: "...props", v: "Collapsible props." },
              ]}
            />
          ),
        },
        { label: "QueueSectionTrigger", body: <Meta items={[{ k: "...props", v: "button props, rendered through CollapsibleTrigger asChild. Full-width, type-nav, muted fill." }]} /> },
        {
          label: "QueueSectionLabel",
          body: (
            <Meta
              items={[
                { k: "label", v: "string, required." },
                { k: "count?", v: "number — printed before the label." },
                { k: "icon?", v: "ReactNode — between the chevron and the text." },
                { k: "...props", v: "span props. The chevron rotates -90 degrees when the section is closed." },
              ]}
            />
          ),
        },
        { label: "QueueSectionContent", body: <Meta items={[{ k: "...props", v: "CollapsibleContent props." }]} /> },
        { label: "QueueList", body: <Meta items={[{ k: "...props", v: "ScrollArea props. Wraps children in a ul capped at max-h-40 with right padding for the scrollbar." }]} /> },
        { label: "QueueItem", body: <Meta items={[{ k: "...props", v: "li props. Group for the hover reveal; flex column, type-small." }]} /> },
        {
          label: "QueueItemIndicator",
          body: (
            <Meta
              items={[
                { k: "completed?", v: "boolean, default false — filled and dim when true, outlined otherwise." },
                { k: "...props", v: "span props." },
              ]}
            />
          ),
        },
        {
          label: "QueueItemContent",
          body: (
            <Meta
              items={[
                { k: "completed?", v: "boolean, default false — dim and line-through when true." },
                { k: "...props", v: "span props. Clamped to one line." },
              ]}
            />
          ),
        },
        {
          label: "QueueItemDescription",
          body: (
            <Meta
              items={[
                { k: "completed?", v: "boolean, default false." },
                { k: "...props", v: "div props. Indented to sit under the content." },
              ]}
            />
          ),
        },
        { label: "QueueItemActions", body: <Meta items={[{ k: "...props", v: "div props. A flex gap row for the action buttons." }]} /> },
        { label: "QueueItemAction", body: <Meta items={[{ k: "...props", v: "Button props except variant and size (fixed: ghost, icon). Hidden until the row is hovered; the 40px button is pulled back with -m-2 so the row stays 24px; the child sits in a 24px pill." }]} /> },
        { label: "QueueItemAttachment", body: <Meta items={[{ k: "...props", v: "div props. A wrapping row for the files and images of a message." }]} /> },
        { label: "QueueItemImage", body: <Meta items={[{ k: "...props", v: 'img props. 32px thumbnail; alt defaults to "" (decorative) — pass alt when the image carries meaning.' }]} /> },
        { label: "QueueItemFile", body: <Meta items={[{ k: "children", v: "The file name; truncated at 80px beside a paperclip glyph." }, { k: "...props", v: "span props." }]} /> },
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
                { k: "Roles and names", v: "Items are real li elements in a ul. The section trigger is a button named by its label (for example \"3 Queued\") with aria-expanded from Radix. A QueueItemAction has only a glyph, so it must be given an aria-label; there is no default." },
                { k: "Keyboard", v: "Tab reaches the section trigger and each enabled action; Enter or Space activates. Disabled actions are skipped." },
                { k: "Hidden actions", v: "Actions sit at opacity 0 until hover. They stay focusable, so pair them with focus-visible:opacity-100, and pointer-coarse:opacity-100 for touch, or a keyboard user tabs onto an invisible button." },
                { k: "Target size", v: "Each action is the 40px icon Button inside a 24px visual, with -m-2 restoring the hit area without growing the row — the nested-control pattern from RULES." },
                { k: "Motion", v: "Section content folds on anim-expand/anim-collapse; the chevron and opacity use a transition. Both fall under the prefers-reduced-motion rule." },
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
              The AgentWorkspace docks the Queue above the composer in{" "}
              <code className="type-code">components/agent/workspace/run-inline.tsx</code> (RunQueue), holding only queued messages: the
              plan is not repeated there because it already lives in the reply that owns the run. The rows get Move up, Move down, Send
              now and Remove actions when the transport supports them, and the whole Queue renders nothing when empty. Vendored changes:
              the stock Tailwind shadow became the ladder&apos;s shadow-e1; the invented 100px file-name cap became max-w-20 (80px); and QueueItemAction dropped its raw size
              override for the 40px icon target pulled back with -m-2 (RULES section 7).
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
