/**
 * Authored documentation page for `ai-checkpoint`.
 *
 * Live specimens render the real `Checkpoint` from
 * `components/ai-elements/checkpoint.tsx`; they live in
 * `checkpoint-specimen.tsx` (a spec module cannot carry `"use client"`).
 */

import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { CheckpointExamples, CheckpointShowcase, CheckpointStateGrid } from "./checkpoint-specimen";
import { meta } from "./meta";

const SRC = "components/ai-elements/checkpoint.tsx";

export const spec: ComponentDocSpec = {
  name: "ai-checkpoint",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A bookmark, a label and a rule between two turns. Press the label to restore to that point.",
      label: "Checkpoint",
      render: <CheckpointShowcase />,
      source: `import { Checkpoint, CheckpointIcon, CheckpointTrigger } from "@/components/ai-elements/checkpoint";

<Checkpoint>
  <CheckpointIcon />
  <CheckpointTrigger
    aria-label="Restore to before the export change"
    onClick={() => restore(id)}
    tooltip="Restores the workspace and chat to this point"
  >
    Before the export change
  </CheckpointTrigger>
</Checkpoint>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It composes the system&apos;s own Button, Separator and Tooltip.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Checkpoint always appends a Separator after its children, so the marker reads as icon, label, then a rule filling the row. The restore behaviour is yours: put it in onClick on CheckpointTrigger. Give the trigger an aria-label that says what it restores, and a tooltip when the label alone is not enough. A tooltip needs a TooltipProvider above it.",
      language: "tsx",
      code: `import { Checkpoint, CheckpointIcon, CheckpointTrigger } from "@/components/ai-elements/checkpoint";

<Checkpoint>
  <CheckpointIcon />
  <CheckpointTrigger
    aria-label={\`Restore to \${label}\`}
    onClick={onRestore}
    tooltip="Restores workspace and chat to this point"
  >
    {label}
  </CheckpointTrigger>
</Checkpoint>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The marker is stateless; the trigger is a Button variant ghost size sm and inherits its states.",
      blocks: [
        { body: <CheckpointStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: muted bookmark, ghost label, a rule to the edge. <strong>hover</strong>,{" "}
                <strong>focus-visible</strong>, <strong>pressed</strong> and <strong>disabled</strong>: inherited from Button; with{" "}
                <code className="type-code">tooltip</code> set, hover or focus also opens the tooltip below the label.{" "}
                <strong>loading</strong>, <strong>success</strong> and <strong>error</strong>: N/A — the marker only calls{" "}
                <code className="type-code">onClick</code>; the restore itself, its progress and its result belong to the caller (the
                workspace shows a toast). <strong>empty</strong>: N/A — a checkpoint with no label is not a checkpoint; the caller omits
                it.
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
      description: "CheckpointIcon takes children to replace the bookmark; the trigger takes any Button variant.",
      label: "Custom icon",
      render: <CheckpointExamples />,
      source: `<Checkpoint>
  <CheckpointIcon>
    <Icon icon={RotateCcwIcon} size="md" tone="muted" />
  </CheckpointIcon>
  <CheckpointTrigger variant="outline">Undo to here</CheckpointTrigger>
</Checkpoint>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: `Read from ${SRC}.`,
      blocks: [
        { label: "Checkpoint", body: <Meta items={[{ k: "...props", v: "div props. Flex row, muted, overflow hidden; renders its children and then a Separator." }]} /> },
        {
          label: "CheckpointIcon",
          body: (
            <Meta
              items={[
                { k: "children?", v: "ReactNode — when given it is returned as is and replaces the bookmark." },
                { k: "tone?", v: 'Icon tone, default "muted".' },
                { k: "size?", v: 'Icon size word, default "md".' },
                { k: "...props", v: "Icon props except icon (className, strokeWidth and other SVG props forward)." },
              ]}
            />
          ),
        },
        {
          label: "CheckpointTrigger",
          body: (
            <Meta
              items={[
                { k: "tooltip?", v: 'string — wraps the Button in a Tooltip (align "start", side "bottom") when set.' },
                { k: "variant?", v: 'Button variant, default "ghost".' },
                { k: "size?", v: 'Button size, default "sm".' },
                { k: "...props", v: 'Button props; type is always "button".' },
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
                { k: "Roles and names", v: "The trigger is a native button named by its visible label; pass aria-label when the action is more specific than the label (the workspace says \"Restore to <label>\"). The bookmark is a decorative Icon (aria-hidden) and the Separator is decorative." },
                { k: "Keyboard", v: "Tab reaches the trigger; Enter or Space restores. The tooltip opens on keyboard focus as well as on hover." },
                { k: "Target size", v: "The label is Button size sm, 32px tall. That is the toolbar rung and this is a single marker on its own line, so call sites that need a 40px target should pass size=\"default\"." },
                { k: "Motion", v: "None of its own; the tooltip uses the system's tooltip animation, which the reduced-motion rule collapses." },
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
              The AgentWorkspace marks turn boundaries with Checkpoint in{" "}
              <code className="type-code">components/agent/workspace/workspace-thread.tsx</code> (TurnCheckpoints): a bookmark, the
              checkpoint label, and one click to go back, each trigger named &quot;Restore to &lt;label&gt;&quot;. Vendored change:{" "}
              CheckpointIcon takes Icon&apos;s props instead of raw LucideProps, so tone and size come from the ladder (a size word, not
              a pixel number) while strokeWidth and the rest of the SVG props still forward.
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
