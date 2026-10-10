/**
 * Authored documentation page for `ai-toolbar`.
 *
 * Live specimens render the real `Toolbar` inside step nodes on a real
 * `Canvas` (`toolbar-specimen.tsx`), forced visible with `isVisible` so it can
 * be seen without selecting a node.
 */

import { ToolbarPreview, ToolbarStateGrid } from "./toolbar-specimen";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-toolbar",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A small bar of actions that floats under a node. In the product it appears for the selected node only; the specimen forces it visible on every node so it can be seen.",
      label: "Toolbar",
      render: <ToolbarPreview />,
      source: `import { Node, NodeContent, NodeHeader, NodeTitle } from "@/components/ai-elements/node";
import { Toolbar } from "@/components/ai-elements/toolbar";

<Node handles={{ target: true, source: true }}>
  <NodeHeader>
    <NodeTitle>{step.title}</NodeTitle>
  </NodeHeader>
  <NodeContent>{step.detail}</NodeContent>
  <Toolbar>
    <Button size="sm" variant="ghost">Edit step</Button>
  </Toolbar>
</Node>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It needs <code className="type-code">@xyflow/react</code>.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Toolbar goes INSIDE a node component, as a child of Node. It attaches itself to that node (nodeId is read from context) and shows when the node is selected; pass isVisible to override. It sits below the node (position Bottom) unless you pass another Position. Its children are ordinary controls — in the workspace, a ghost Button sm with an icon and a label.",
      language: "tsx",
      code: `import { Node, NodeContent, NodeHeader, NodeTitle } from "@/components/ai-elements/node";
import { Toolbar } from "@/components/ai-elements/toolbar";
import { Button } from "@/components/ui/button";

function StepNode({ data }: NodeProps<StepFlowNode>) {
  return (
    <Node className="w-60" handles={{ target: true, source: true }}>
      <NodeHeader>
        <NodeTitle>{data.step.title}</NodeTitle>
      </NodeHeader>
      <NodeContent>{data.step.detail}</NodeContent>
      {/* Selected node only: React Flow's default. */}
      <Toolbar>
        <Button onClick={() => startEditing(data.step.id)} size="sm" variant="ghost">
          <Icon icon={PencilIcon} size="sm" tone="inherit" />
          Edit step
        </Button>
      </Toolbar>
    </Node>
  );
}`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The toolbar is either shown or not; the node's selection decides, unless isVisible forces it.",
      blocks: [
        { body: <ToolbarStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest (hidden)</strong>: nothing is rendered while the node is not selected.{" "}
                <strong>visible</strong>: when the node is the only selected one, or isVisible is true — a bordered bar on the background colour, 6px of padding, a 4px gap between items, centred under the node.{" "}
                <strong>hover</strong>, <strong>pressed</strong>, <strong>focus-visible</strong>: N/A on the bar; the buttons inside carry Button&apos;s own states.{" "}
                <strong>loading</strong>, <strong>success</strong>, <strong>error</strong>: N/A — the bar reports nothing; an action that is in flight shows it on its own button.{" "}
                <strong>disabled</strong>: N/A for the bar; disable the buttons inside, or leave the Toolbar out of nodes that cannot be edited (the workflow dialog does this for a plan that is no longer proposed).{" "}
                <strong>empty</strong>: a Toolbar with no children draws an empty bordered box when visible, so do not render one with nothing in it.
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
      description: "Read from components/ai-elements/toolbar.tsx. Toolbar takes the props of React Flow's NodeToolbar.",
      blocks: [
        {
          label: "Toolbar",
          body: (
            <Meta
              items={[
                { k: "isVisible?", v: "boolean — force the toolbar on or off. Unset: shown while the node it belongs to is the only one selected." },
                { k: "position?", v: "Position, default Position.Bottom in this wrapper (React Flow's own default is Top). It is set before the incoming props are spread, so a caller's position wins." },
                { k: "nodeId?", v: "string or string[] — which node(s) it belongs to. Unset: the node it is rendered inside." },
                { k: "offset?", v: "number — gap from the node, in pixels. React Flow's default." },
                { k: "align?", v: '"start", "center" or "end" — alignment along the node\'s edge. React Flow\'s default is center.' },
                { k: "className?", v: "string — merged after flex items-center gap-1 rounded-sm border bg-background p-1.5." },
                { k: "children?", v: "ReactNode — the actions." },
                { k: "…rest", v: "Any div attribute." },
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
      description: "A row of ordinary buttons in a floating container.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: 'A div with no role. Each action is a real button named by its visible text; give an icon-only action an aria-label. If the actions need grouping for a screen reader, add role="toolbar" and an aria-label naming the node it acts on.' },
                { k: "Keyboard", v: "The bar appears when a node is selected, which a keyboard user does with Tab and Enter on the node. Its buttons come after the node in the tab order; arrow-key movement inside the bar is not provided. The bar goes when the node is deselected, so a focused button can disappear — move focus back to the node when an action completes." },
                { k: "Target size", v: "The bar is the one place a 32px Button sm is right: the actions sit side by side in a toolbar. A bar with a single action should use a full-size button." },
                { k: "Colour", v: "Background and border roles; the bar is on the page background rather than the card so it reads as floating above the node." },
                { k: "Motion", v: "None of its own; it appears and disappears with no transition." },
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
              In the workflow dialog (<code className="type-code">components/agent/workspace/workflow-dialog.tsx</code>),
              a plan that is still proposed can be edited: selecting a step node shows a
              toolbar with an Edit step button, which swaps the node body for a title field.
              Using a node toolbar rather than a button in every node keeps ten steps from
              showing ten Edit buttons at once. The wrapper has no vendored behaviour changes;
              it restyles the bar with system tokens and moves it below the node.
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
