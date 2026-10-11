import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";
import { TaskExamples, TaskShowcase, TaskStateGrid } from "./task-specimen";

const SRC = "components/ai-elements/task.tsx";

export const spec: ComponentDocSpec = {
  name: "ai-task",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A collapsible list of what the agent did for one piece of work. Press the title row to fold it.",
      label: "Task",
      render: <TaskShowcase />,
      source: `import { Task, TaskContent, TaskItem, TaskItemFile, TaskTrigger } from "@/components/ai-elements/task";

<Task>
  <TaskTrigger title="Found the export code" />
  <TaskContent>
    <TaskItem>Searching for "invoice export"</TaskItem>
    <TaskItem>
      Read <TaskItemFile>export.ts</TaskItemFile>
    </TaskItem>
    <TaskItem>Scanning 12 files</TaskItem>
  </TaskContent>
</Task>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It composes the system&apos;s own Collapsible.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Task is a bare Collapsible: no border or card. TaskTrigger needs a title (it is the accessible name of the default row); pass children to replace the whole row, as the workspace does. TaskContent wraps its children in the left-ruled list, so put TaskItem lines directly inside it. TaskItemFile is an inline chip for a file name inside a TaskItem.",
      language: "tsx",
      code: `import { Task, TaskContent, TaskItem, TaskItemFile, TaskTrigger } from "@/components/ai-elements/task";

<Task defaultOpen>
  <TaskTrigger title="Found the export code" />
  <TaskContent>
    <TaskItem>Searching for "invoice export"</TaskItem>
    <TaskItem>
      <span className="inline-flex items-center gap-1">
        Read <TaskItemFile>export.ts</TaskItemFile>
      </span>
    </TaskItem>
  </TaskContent>
</Task>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "Open or folded. Task has no status of its own; its trigger is a native button.",
      blocks: [
        { body: <TaskStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: open by default (<code className="type-code">defaultOpen</code> is true), muted text.{" "}
                <strong>hover</strong>: the trigger text moves from muted to foreground. <strong>focus-visible</strong>: the system focus
                ring on the trigger button. <strong>pressed</strong>: toggles the content; the chevron turns 180 degrees through{" "}
                <code className="type-code">group-data-[state=open]</code>. <strong>loading</strong>, <strong>success</strong> and{" "}
                <strong>error</strong>: N/A — Task is narration, not a state machine; the workspace puts the run status in a separate{" "}
                <code className="type-code">role=&quot;status&quot;</code> line beside it. <strong>disabled</strong>: N/A — a fold is
                never inert. <strong>empty</strong>: N/A — a Task with no items is a title with nothing under it; the caller should not
                render it.
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
      description: "Children on TaskTrigger replace the default magnifier row entirely.",
      label: "Custom trigger",
      render: <TaskExamples />,
      source: `<Task>
  <TaskTrigger title="Checked the ledger">
    <Button variant="ghost" size="sm" className="h-auto w-full justify-start px-0">
      Checked the ledger · 2 of 3 steps
    </Button>
  </TaskTrigger>
  <TaskContent>
    <TaskItem>Compared 3 totals</TaskItem>
  </TaskContent>
</Task>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: `Read from ${SRC}.`,
      blocks: [
        {
          label: "Task",
          body: (
            <Meta
              items={[
                { k: "defaultOpen?", v: "boolean, default true." },
                { k: "open? / onOpenChange?", v: "Collapsible controlled state." },
                { k: "className?", v: "string" },
                { k: "...props", v: "Collapsible props." },
              ]}
            />
          ),
        },
        {
          label: "TaskTrigger",
          body: (
            <Meta
              items={[
                { k: "title", v: "string, required — the label of the default row." },
                { k: "children?", v: "ReactNode — replaces the default search glyph, title and chevron row." },
                { k: "className?", v: "string — merged with group on the trigger." },
                { k: "...props", v: "CollapsibleTrigger props." },
              ]}
            />
          ),
        },
        {
          label: "TaskContent",
          body: (
            <Meta
              items={[
                { k: "children", v: "The items; wrapped in a left-ruled, spaced list." },
                { k: "className?", v: "string" },
                { k: "...props", v: "CollapsibleContent props." },
              ]}
            />
          ),
        },
        { label: "TaskItem", body: <Meta items={[{ k: "...props", v: "div props. type-small, muted." }]} /> },
        { label: "TaskItemFile", body: <Meta items={[{ k: "...props", v: "div props. An inline chip: bordered, secondary fill, type-identifier." }]} /> },
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
                { k: "Roles and names", v: "The default trigger is a real button whose name is the title; Radix adds aria-expanded and aria-controls. The glyphs are decorative." },
                { k: "Keyboard", v: "Tab reaches the trigger; Enter or Space toggles. Upstream rendered a div here which the keyboard could not reach." },
                { k: "Target size", v: "The line of small text would be a short target, so an after: pseudo-element extends the hit area 12px above and below (44px total) while the visual stays one line." },
                { k: "Motion", v: "CollapsibleContent plays anim-expand/anim-collapse from the measured height; the chevron rotates with a transition. Both collapse under prefers-reduced-motion." },
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
              The AgentWorkspace uses Task for the run&apos;s live step list in{" "}
              <code className="type-code">components/agent/workspace/run-inline.tsx</code> (RunTask): a TaskTrigger with a custom child
              row (a checklist glyph and the goal with &quot;n of m&quot;) next to Pause, Resume and Cancel, a status line, then the
              steps inside TaskContent. Vendored changes: the trigger is a button rather than a div so the keyboard can reach it, with an
              after: hit area to reach 44px; and TaskContent dropped the hand-rolled tw-animate classes because CollapsibleContent
              already animates off the measured height, so the two were fighting.
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
