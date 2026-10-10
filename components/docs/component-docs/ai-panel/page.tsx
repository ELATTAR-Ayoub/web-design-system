import { PanelPreview, PanelStateGrid } from "./panel-specimen";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-panel",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description: "A card pinned to a corner of the canvas. It stays put as the graph scrolls underneath; here it names the goal and the plan version.",
      label: "Panel",
      render: <PanelPreview />,
      source: `import { Canvas } from "@/components/ai-elements/canvas";
import { Panel } from "@/components/ai-elements/panel";

<Canvas edges={edges} nodes={nodes} nodeTypes={nodeTypes}>
  <Panel position="top-left">
    <p className="px-2 py-1 type-small">
      <span className="text-foreground">{run.goal}</span>
      <span className="text-muted-foreground">{\` · Plan v\${run.version}\`}</span>
    </p>
  </Panel>
</Canvas>`,
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
        "Panel is a child of Canvas: it sits in the viewport layer above the graph, not in the pannable one, so it does not move or scale with the nodes. position picks the corner. It is a plain container — put text, a small form or buttons inside. It is not the page's own Panel from the docs furniture, and not a drawer.",
      language: "tsx",
      code: `import { Panel } from "@/components/ai-elements/panel";

<Canvas edges={edges} nodes={nodes} nodeTypes={nodeTypes}>
  <Panel position="top-left">Weekly report · Plan v3</Panel>
  <Panel className="m-0" position="bottom-right">…</Panel>
</Canvas>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The panel is a surface; the four corners are the only variation.",
      blocks: [
        { body: <PanelStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: a card with a border, a 16px margin from the canvas edge and 4px of padding, content clipped to its rounded corners.{" "}
                <strong>hover</strong>, <strong>pressed</strong>, <strong>focus-visible</strong>: N/A on the panel itself — it is not a control; anything interactive inside it has its own states.{" "}
                <strong>loading</strong>, <strong>success</strong>, <strong>error</strong>: N/A — the panel holds whatever the caller puts in it, including its own status.{" "}
                <strong>disabled</strong>: N/A.{" "}
                <strong>empty</strong>: a panel with no children still draws a small bordered box, so do not mount one with nothing in it.
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
      description: "Each of the four corners.",
      label: "Positions",
      render: <PanelStateGrid />,
      source: `<Panel position="top-left">…</Panel>
<Panel position="top-right">…</Panel>
<Panel position="bottom-left">…</Panel>
<Panel position="bottom-right">…</Panel>`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/panel.tsx. Panel takes the props of React Flow's Panel.",
      blocks: [
        {
          label: "Panel",
          body: (
            <Meta
              items={[
                { k: "position?", v: 'PanelPosition — "top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right", "center-left" or "center-right". Default "top-left".' },
                { k: "className?", v: "string — merged after m-4 overflow-hidden rounded-md border bg-card p-1." },
                { k: "children?", v: "ReactNode." },
                { k: "…rest", v: "Any div attribute (HTMLAttributes of HTMLDivElement), passed to React Flow's Panel." },
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
      description: "A container: it carries no role, so what is inside it has to say what it is.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: 'A div with no role. If the content is a region the reader should be able to jump to, add role="region" and an aria-label, or a labelled group; for plain text, as in the workflow dialog, nothing is needed.' },
                { k: "Keyboard", v: "Nothing of its own; interactive children join the tab order after the graph's nodes and edges, in the order React Flow mounts them." },
                { k: "Target size", v: "Controls inside follow the usual rule: icon-only 40px or more; a 32px Button sm only beside other small controls. A button that would be the only control in the panel should be a full-size one." },
                { k: "Colour", v: "Card surface, border and foreground roles, which switch with the theme." },
                { k: "Motion", v: "None." },
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
              The workflow dialog (<code className="type-code">components/agent/workspace/workflow-dialog.tsx</code>)
              uses a top-left Panel to say which goal and plan version the graph shows, so that
              context stays visible however the graph is scrolled. The wrapper only restyles
              xyflow&apos;s Panel as a card on system tokens; it has no vendored behaviour
              changes.
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
