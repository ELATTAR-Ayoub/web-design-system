/**
 * Authored documentation page for `ai-canvas`.
 *
 * Live specimens render the real `Canvas` from
 * `components/ai-elements/canvas.tsx` and live in `canvas-specimen.tsx` (a spec
 * module cannot carry `"use client"`). React Flow needs a parent with a fixed
 * height, so every specimen sits in `FlowFrame` (`flow-fixture.tsx`).
 */

import { CanvasPreview, CanvasStateGrid } from "./canvas-specimen";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-canvas",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "A three-step plan as a graph: one node per step, an animated edge into the running step and a dashed edge into the skipped one. Scroll to pan; dragging on empty space draws a selection box instead of moving the view.",
      label: "Canvas",
      render: <CanvasPreview />,
      source: `import { Canvas } from "@/components/ai-elements/canvas";

<div className="h-80 w-full">
  <Canvas
    edges={edges}
    edgeTypes={edgeTypes}
    nodes={nodes}
    nodeTypes={nodeTypes}
  />
</div>`,
    },
    {
      kind: "install",
      id: "installation",
      title: "Installation",
      notes: (
        <p className="type-small text-muted-foreground">
          Vendored from Vercel AI Elements (Apache-2.0, see components/ai-elements/NOTICE.md) and restyled to the system — not redistributed through the registry. It needs the <code className="type-code">@xyflow/react</code> package and imports xyflow&apos;s own stylesheet itself; the page needs nothing else.
        </p>
      ),
    },
    {
      kind: "snippet",
      id: "usage",
      title: "Usage",
      description:
        "Canvas is React Flow with this system's defaults, so nodes, edges, nodeTypes and edgeTypes are React Flow's own props. Its children render inside the graph: Controls and Panel go here. Give the parent a definite height — React Flow lays out into it and draws nothing in a zero-height box. A read-only graph, like the workflow dialog, turns off dragging, connecting and the delete key.",
      language: "tsx",
      code: `import { Canvas } from "@/components/ai-elements/canvas";
import { Connection } from "@/components/ai-elements/connection";
import { Controls } from "@/components/ai-elements/controls";
import { Edge } from "@/components/ai-elements/edge";
import { Panel } from "@/components/ai-elements/panel";

const nodeTypes = { step: StepNode };
const edgeTypes = { animated: Edge.Animated, temporary: Edge.Temporary };

<div className="h-full min-h-0 w-full">
  <Canvas
    connectionLineComponent={Connection}
    deleteKeyCode={null}
    edges={edges}
    edgeTypes={edgeTypes}
    nodes={nodes}
    nodesConnectable={false}
    nodesDraggable={false}
    nodeTypes={nodeTypes}
  >
    <Controls showInteractive={false} />
    <Panel position="top-left">Weekly report · Plan v3</Panel>
  </Canvas>
</div>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The canvas is a surface. Selection, viewport and node positions are React Flow's own state; Canvas adds none.",
      blocks: [
        { body: <CanvasStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: the dotted background in the sidebar colour with the graph fitted into view (<code className="type-code">fitView</code>).{" "}
                <strong>hover</strong>, <strong>pressed</strong>: N/A on the surface itself — the controls, handles and nodes inside carry their own.{" "}
                <strong>focus-visible</strong>: React Flow makes nodes and edges focusable by default, so Tab walks the graph; the surface is not a control and takes no ring.{" "}
                <strong>loading</strong>, <strong>success</strong>, <strong>error</strong>: N/A — it draws what it is given synchronously and reports nothing; a caller that is still fetching the graph shows its own skeleton instead of mounting the canvas.{" "}
                <strong>disabled</strong>: N/A as a prop — a locked graph is made with <code className="type-code">nodesDraggable</code>, <code className="type-code">nodesConnectable</code> and <code className="type-code">deleteKeyCode=&#123;null&#125;</code>, which the workflow dialog does.{" "}
                <strong>empty</strong>: no nodes draws the background alone; there is no built-in empty message, so a caller with something to say renders it beside the canvas.
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
      description: "Three configurations side by side: the defaults, no nodes, and the one default a caller most often changes.",
      label: "Configurations",
      render: <CanvasStateGrid />,
      source: `{/* rest */}
<Canvas edges={edges} nodes={nodes} nodeTypes={nodeTypes} />

{/* empty */}
<Canvas edges={[]} nodes={[]} />

{/* drag pans the view instead of drawing a selection box */}
<Canvas edges={edges} nodes={nodes} nodeTypes={nodeTypes} panOnDrag selectionOnDrag={false} />`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/canvas.tsx. Canvas takes every ReactFlowProps prop; those below are the ones it sets or adds.",
      blocks: [
        {
          label: "Canvas",
          body: (
            <Meta
              items={[
                { k: "children?", v: "ReactNode — rendered inside the graph after the background. Controls, Panel and other React Flow components go here." },
                { k: "className?", v: "string — merged after xy-tokens, which Canvas always adds." },
                { k: "nodes / edges", v: "React Flow's node and edge arrays. Each node needs an id, a position and a type that exists in nodeTypes." },
                { k: "nodeTypes? / edgeTypes?", v: "Maps from a type name to a component — Node-based components for nodes, Edge.Animated and Edge.Temporary for edges." },
                { k: "connectionLineComponent?", v: "ConnectionLineComponent — pass Connection to draw the in-progress line on the system's colours." },
                { k: "colorMode", v: 'Set by Canvas from the resolved theme: "light" or "dark", or "system" until next-themes has resolved. A caller prop overrides it.' },
                { k: "deleteKeyCode", v: 'Default ["Backspace", "Delete"]. Pass null to make the graph undeletable.' },
                { k: "fitView", v: "Default true — the graph is fitted into view on mount." },
                { k: "panOnDrag", v: "Default false — dragging does not pan." },
                { k: "panOnScroll", v: "Default true — the wheel and trackpad pan, instead of zooming." },
                { k: "selectionOnDrag", v: "Default true — dragging on empty space draws a selection box." },
                { k: "zoomOnDoubleClick", v: "Default false." },
                { k: "…rest", v: "Everything else in ReactFlowProps is passed through, after the defaults above, so any of them can be overridden." },
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
      description: "Accessibility of the graph is React Flow's; what this system adds is the colour and the sizes.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: 'React Flow puts role="application" on its root, role="group" with aria-roledescription="node" on each focusable node (tabIndex 0), and role="group" or "img" with aria-roledescription="edge" and a default name of "Edge from a to b" on each edge. Nodes take their name from their own content, or from an ariaLabel on the node object. Name the graph by wrapping it in a labelled group, as the specimens do, or by an aria-label on the container.' },
                { k: "Keyboard", v: "Tab moves between nodes and edges; Enter or Space selects the focused one; arrow keys move a selected node when it is draggable; Backspace and Delete remove a selected node or edge unless deleteKeyCode is null. Scroll pans; the Controls buttons are the keyboard path to zoom." },
                { k: "Colour", v: "xy-tokens points every colour xyflow draws itself (edge strokes, handles, the selection box, the dotted background) at a role, so contrast follows the theme; colorMode is handed the resolved theme so xyflow's own light/dark class never disagrees with the page." },
                { k: "Target size", v: "Inside the canvas, Controls buttons are held at 44px. The handles on a node are small by xyflow's design; a graph that must be edited by pointer should offer a larger path, such as a toolbar button." },
                { k: "Motion", v: "Panning and zoom animate through React Flow's own transitions. Edge.Animated's travelling dot is a SMIL animation; a graph for a user who prefers reduced motion should use the default edge type." },
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
              The AgentWorkspace&apos;s &ldquo;View as workflow&rdquo; dialog
              (<code className="type-code">components/agent/workspace/workflow-dialog.tsx</code>)
              draws a run&apos;s plan as a graph, and Canvas is its root. Vendored
              changes: <strong>colorMode</strong> is handed the resolved theme,
              because React Flow tags its root with a mode that defaults to
              &ldquo;light&rdquo; — the same class the system&apos;s theme tokens key
              off — and the graph turned light inside a dark page.{" "}
              <strong>xy-tokens</strong> (<code className="type-code">styles/utilities.css</code>)
              puts xyflow&apos;s hard-coded greys on system roles. The panning
              defaults (scroll pans, drag selects) are upstream&apos;s.
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
