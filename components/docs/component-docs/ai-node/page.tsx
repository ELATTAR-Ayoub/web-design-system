/**
 * Authored documentation page for `ai-node`.
 *
 * Live specimens render the real `Node` parts from
 * `components/ai-elements/node.tsx` and live in `node-specimen.tsx`.
 */

import { NodePreview, NodeStateGrid } from "./node-specimen";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-node",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "One step node used three times in a graph. The first has no target handle and the last no source handle, so a handle is drawn only where an edge can attach.",
      label: "Node",
      render: <NodePreview />,
      source: `import { Node, NodeContent, NodeDescription, NodeFooter, NodeHeader, NodeTitle } from "@/components/ai-elements/node";

function StepNode({ data }: NodeProps) {
  return (
    <Node className="w-60" handles={{ target: data.index > 0, source: data.index < data.total - 1 }}>
      <NodeHeader>
        <NodeTitle>{data.title}</NodeTitle>
        <NodeDescription>{\`Step \${data.index + 1} of \${data.total}\`}</NodeDescription>
      </NodeHeader>
      <NodeContent>{data.detail}</NodeContent>
      <NodeFooter>{data.status}</NodeFooter>
    </Node>
  );
}`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It is built on the system&apos;s own <code className="type-code">Card</code> and on <code className="type-code">@xyflow/react</code>&apos;s <code className="type-code">Handle</code>.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Node is a custom node TYPE body: register a component that returns it in nodeTypes, and React Flow renders it once per node. handles is required and says which of the two handles to draw. Compose the parts as you would a Card: header, content and footer are all optional. Set a width on Node (w-60 in the workspace); the default is w-sm. Inside the node, wrap anything that takes a pointer (a form, a field) in the nodrag and nopan classes so using it does not drag the node or pan the view.",
      language: "tsx",
      code: `import { Node, NodeAction, NodeContent, NodeDescription, NodeFooter, NodeHeader, NodeTitle } from "@/components/ai-elements/node";

const nodeTypes = {
  step: ({ data }: NodeProps<StepNode>) => (
    <Node className="w-60" handles={{ target: true, source: true }}>
      <NodeHeader>
        <NodeTitle>{data.step.title}</NodeTitle>
        <NodeDescription>Step 2 of 4</NodeDescription>
        <NodeAction>{/* a control pinned top-right */}</NodeAction>
      </NodeHeader>
      <NodeContent>
        <p className="type-small text-muted-foreground">{data.step.detail}</p>
      </NodeContent>
      <NodeFooter className="justify-between gap-2">
        <span className="type-small">Running</span>
      </NodeFooter>
    </Node>
  ),
};`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "A node is a card; it has no interactive states of its own. Selection and dragging are React Flow's, applied to the wrapper around it.",
      blocks: [
        { body: <NodeStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: a bordered card; the header and footer sit on the secondary surface with a hairline between them and the body.{" "}
                <strong>hover</strong>, <strong>pressed</strong>: N/A — the node is not a control. In the workflow dialog a click selects it, and that selection is React Flow&apos;s (it outlines the wrapper through xy-tokens), not Node&apos;s.{" "}
                <strong>focus-visible</strong>: the focusable element is React Flow&apos;s node wrapper (tabIndex 0), not Node itself; the controls inside it keep their own rings.{" "}
                <strong>loading</strong>, <strong>success</strong>, <strong>error</strong>: N/A in the node — a step&apos;s status is content, written by the caller into the footer, with a status mark and a word, never a colour alone.{" "}
                <strong>disabled</strong>: N/A — a locked node is made on the node object (<code className="type-code">draggable</code>, <code className="type-code">connectable</code>, <code className="type-code">deletable</code> false), as the workflow dialog does.{" "}
                <strong>empty</strong>: every part is optional; a body-only node keeps its rounded corners because the radius sits on the card.
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
      description: "Read from components/ai-elements/node.tsx. Every part takes the props of the Card part it wraps (ComponentProps), plus className.",
      blocks: [
        {
          label: "Node",
          body: (
            <Meta
              items={[
                { k: "handles", v: "{ target: boolean; source: boolean }, required — target draws a left-hand Handle (type target), source a right-hand one (type source)." },
                { k: "className?", v: "string — merged after node-container relative size-full h-auto w-sm gap-0 rounded-md p-0. Pass a width here." },
                { k: "children?", v: "ReactNode — the parts below, in order." },
                { k: "…rest", v: "The props of Card (size?: default or sm, and any div attribute)." },
              ]}
            />
          ),
        },
        {
          label: "NodeHeader",
          body: <Meta items={[{ k: "className?", v: "string — merged after gap-0.5 rounded-t-md border-b bg-secondary p-3!" }, { k: "…rest", v: "The props of CardHeader." }]} />,
        },
        {
          label: "NodeTitle",
          body: <Meta items={[{ k: "asChild?", v: "boolean, default false — render the child (for example an h3) instead of a div." }, { k: "…rest", v: "The props of CardTitle." }]} />,
        },
        {
          label: "NodeDescription",
          body: <Meta items={[{ k: "…rest", v: "The props of CardDescription, passed through unchanged." }]} />,
        },
        {
          label: "NodeAction",
          body: <Meta items={[{ k: "…rest", v: "The props of CardAction — pins its children to the header's top-right." }]} />,
        },
        {
          label: "NodeContent",
          body: <Meta items={[{ k: "className?", v: "string — merged after p-3." }, { k: "…rest", v: "The props of CardContent." }]} />,
        },
        {
          label: "NodeFooter",
          body: <Meta items={[{ k: "className?", v: "string — merged after rounded-b-md border-t bg-secondary p-3!" }, { k: "…rest", v: "The props of CardFooter." }]} />,
        },
        {
          label: "Exported types",
          body: <Meta items={[{ k: "NodeProps, NodeHeaderProps, NodeTitleProps, NodeDescriptionProps, NodeActionProps, NodeContentProps, NodeFooterProps", v: "ComponentProps of the part each wraps; NodeProps adds handles." }]} />,
        },
      ],
    },
    {
      kind: "disclosure",
      id: "accessibility",
      title: "Accessibility",
      description: "The wrapper React Flow draws around a node carries the role and the keyboard; Node is the content inside it.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: 'React Flow gives the node wrapper role="group" and aria-roledescription="node", and makes it focusable. It has no name unless the node object carries ariaLabel — so set one when the title alone does not say what the node is. NodeTitle is a div by default; pass asChild with an h3 where a heading level helps.' },
                { k: "Keyboard", v: "Tab reaches each node; Enter or Space selects it; arrow keys move a draggable node. Controls inside a node (a field, a button) are ordinary tab stops after the wrapper." },
                { k: "Handles", v: "Handles are pointer targets with no keyboard path, and are small by xyflow's design. A graph that has to be edited should not rely on dragging between them alone; the workflow dialog sets connectable false and offers an Edit step button on the node toolbar instead." },
                { k: "Target size", v: "A button inside a node follows the usual rule — a 32px Button sm only beside other small controls, as in the node toolbar; a lone icon button is 40px or more." },
                { k: "Colour and status", v: "Text sits on card or secondary surfaces with foreground and muted-foreground roles. Never signal a step's status by colour alone: pair the footer's mark with a word." },
                { k: "Motion", v: "Node has none. React Flow moves the wrapper when it is dragged or the view changes." },
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
              Each step of a run&apos;s plan is a node in the workflow dialog
              (<code className="type-code">components/agent/workspace/workflow-dialog.tsx</code>):
              the title and &ldquo;Step n of N&rdquo; in the header, the detail in the
              body, the status and duration in the footer. Node is a Card with the
              handles React Flow needs, so it reads as the same surface as every
              other card. It was vendored without changes to its markup — only the
              Card underneath it was restyled; the handles&apos; colours come from
              xy-tokens on the Canvas.
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
