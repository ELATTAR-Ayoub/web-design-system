/**
 * Authored documentation page for `ai-connection`.
 *
 * `Connection` is a render function React Flow calls during a live drag, so
 * the specimens freeze it into a bare svg and also mount a live graph
 * (`connection-specimen.tsx`).
 */

import { ConnectionPreview, ConnectionStateGrid } from "./connection-specimen";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-connection",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "The line React Flow draws while a connection is being dragged from one handle toward another: a bezier in the ring colour ending in a small dot. The first panel freezes it; in the second, drag from the right-hand handle of the From node.",
      label: "Connection",
      render: <ConnectionPreview />,
      source: `import { Canvas } from "@/components/ai-elements/canvas";
import { Connection } from "@/components/ai-elements/connection";

<Canvas connectionLineComponent={Connection} edges={edges} nodes={nodes} nodeTypes={nodeTypes} />`,
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
        "Connection is passed to the Canvas as connectionLineComponent, not rendered by hand. React Flow mounts it only while the pointer is dragging out of a handle, and gives it the start and end coordinates. A graph that cannot be connected (nodesConnectable false, as in the workflow dialog) never shows it, but the dialog passes it anyway so the line is on-system if connecting is ever turned on.",
      language: "tsx",
      code: `import { Canvas } from "@/components/ai-elements/canvas";
import { Connection } from "@/components/ai-elements/connection";

<Canvas
  connectionLineComponent={Connection}
  edges={edges}
  nodes={nodes}
  nodeTypes={nodeTypes}
  nodesConnectable={false}
/>`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "There is exactly one state: a drag is live. The line has no resting state because React Flow does not mount it otherwise.",
      blocks: [
        { body: <ConnectionStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: nothing is rendered — React Flow mounts the component only while a drag out of a handle is in progress.{" "}
                <strong>active (dragging)</strong>: a 1px bezier in the ring colour whose control points sit half way across, ending in a 3px dot (action-ink fill, ring stroke) at the pointer. The line follows the pointer on every frame; there is no easing.{" "}
                <strong>hover</strong>, <strong>focus-visible</strong>, <strong>pressed</strong>: N/A — the line is a drawing, not a control; the handle being dragged from is React Flow&apos;s.{" "}
                <strong>loading</strong>, <strong>success</strong>, <strong>error</strong>: N/A — it does not know whether the drop will be accepted; validity is the Canvas&apos;s isValidConnection, and the handle under the pointer reports it.{" "}
                <strong>disabled</strong>: N/A — a graph that cannot be connected simply never starts a drag.{" "}
                <strong>empty</strong>: N/A.
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
      description: "Read from components/ai-elements/connection.tsx. Connection is typed ConnectionLineComponent, a function of React Flow's ConnectionLineComponentProps; it reads four of them.",
      blocks: [
        {
          label: "Connection",
          body: (
            <Meta
              items={[
                { k: "fromX / fromY", v: "number — where the drag started, at the source handle." },
                { k: "toX / toY", v: "number — the pointer, or the handle it has snapped to." },
                { k: "Path", v: "M from C (from + half the horizontal distance, fromY) (the same x, toY) to — a horizontal-tangent cubic bezier. The path carries the class animated, which xyflow's stylesheet turns into a marching dash." },
                { k: "Stroke", v: "var(--color-ring), 1px, no fill." },
                { k: "End dot", v: "A circle of radius 3 at the end, fill var(--color-action-ink), stroke var(--color-ring)." },
                { k: "Other props", v: "Everything else React Flow passes (connection state, handles, nodes, positions) is ignored." },
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
      description: "A connection line is feedback for a pointer drag. It has no role and takes no focus.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: "None — it is a decorative drawing inside React Flow's connection-line svg, which is hidden from assistive tech." },
                { k: "Keyboard", v: "There is no keyboard path through a drag. Where connecting is a real feature, offer another way to make the link, such as a menu on the node, and use connectOnClick if click-to-connect fits." },
                { k: "Colour", v: "Ring colour on the canvas background, and an action-ink dot, which differs per theme. The line is not the only signal: the target handle highlights when a drop would be valid." },
                { k: "Motion", v: "The path follows the pointer with no animation of its own; the animated class's marching dash is a CSS animation in xyflow's stylesheet." },
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
              hands it to its Canvas so that an in-progress link is drawn in the
              system&apos;s colours rather than xyflow&apos;s default grey. Vendored change:
              the end dot&apos;s hard-coded <code className="type-code">#fff</code> fill
              (banned outside the style files) is now{" "}
              <code className="type-code">var(--color-action-ink)</code> — the same reasoning as the
              travelling dot in Edge.Animated: a mark with no foreground of its own is
              judged like text.
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
