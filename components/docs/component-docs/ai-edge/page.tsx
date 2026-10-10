/**
 * Authored documentation page for `ai-edge`.
 *
 * Live specimens render the real `Edge.Animated` and `Edge.Temporary` from
 * `components/ai-elements/edge.tsx` and live in `edge-specimen.tsx`.
 */

import { EdgePreview, EdgeStateGrid } from "./edge-specimen";
import { SourceMeta } from "@/components/docs/component-page/sections";
import type { ComponentDocSpec } from "@/components/docs/component-page/types";
import { Meta, Note } from "@/components/ds/kit";

import { meta } from "./meta";

export const spec: ComponentDocSpec = {
  name: "ai-edge",
  sections: [
    {
      kind: "showcase",
      id: "preview",
      title: "Preview",
      description:
        "The edge into the running step travels (a dot rides a bezier); the edge into the skipped step is the dashed alternate path. A plain edge uses React Flow's own default type.",
      label: "Edge",
      render: <EdgePreview />,
      source: `import { Edge } from "@/components/ai-elements/edge";

const edgeTypes = { animated: Edge.Animated, temporary: Edge.Temporary };

const edges = [
  { id: "a->b", source: "a", target: "b", type: "animated" },
  { id: "b->c", source: "b", target: "c", type: "temporary" },
];`,
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
        "Edge is an object of two edge components, not a component itself. Register them in edgeTypes on the Canvas, then pick one per edge with its type field. Animated reads the two nodes' handle positions, so it expects the Node component's right-hand source handle and left-hand target handle; an edge between nodes that have neither draws from the flow origin (0, 0).",
      language: "tsx",
      code: `import { Canvas } from "@/components/ai-elements/canvas";
import { Edge } from "@/components/ai-elements/edge";

const edgeTypes = { animated: Edge.Animated, temporary: Edge.Temporary };

// The workflow dialog: the edge into the running step travels,
// the edge into a skipped step is dashed, the rest are plain.
const type = step.status === "running" ? "animated" : step.status === "skipped" ? "temporary" : "default";

<Canvas edges={edges} edgeTypes={edgeTypes} nodes={nodes} nodeTypes={nodeTypes} />`,
    },
    {
      kind: "disclosure",
      id: "states",
      title: "States",
      description: "The two types are the two visual states a connection can be in: live and tentative. A plain edge is shown for comparison.",
      blocks: [
        { body: <EdgeStateGrid /> },
        {
          body: (
            <Note tone="action" title="Every state, classified">
              <p>
                <strong>rest</strong>: the default type, a bezier on the border colour.{" "}
                <strong>loading</strong>: <code className="type-code">Edge.Animated</code> — a bezier plus a dot in the action-ink colour that rides the path every two seconds, for work that is in flight.{" "}
                <strong>pending / alternate</strong>: <code className="type-code">Edge.Temporary</code> — a dashed (5, 5) stroke in the ring colour, for a path that is not taken or not confirmed.{" "}
                <strong>hover</strong>, <strong>focus-visible</strong>, <strong>pressed</strong>: N/A in the edge components — React Flow makes an edge focusable and selectable through its wrapper and draws the selected stroke (ring colour, via xy-tokens); the edges here add nothing to it.{" "}
                <strong>success</strong>, <strong>error</strong>: N/A — an edge says nothing about the outcome of its target; the node footer does, in words.{" "}
                <strong>disabled</strong>: N/A — a fixed edge is made with <code className="type-code">deletable</code> and <code className="type-code">reconnectable</code> false on the edge object.{" "}
                <strong>empty</strong>: Animated draws nothing until both of its nodes exist in the store; before that it returns null.
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
      description: "The three edge types side by side between the same two nodes.",
      label: "Edge types",
      render: <EdgeStateGrid />,
      source: `const edge = (type: "default" | "animated" | "temporary") => ({
  id: \`a->b-\${type}\`,
  source: "a",
  target: "b",
  type,
});`,
    },
    {
      kind: "disclosure",
      id: "api",
      title: "API Reference",
      description: "Read from components/ai-elements/edge.tsx. Both parts are React Flow edge components and receive React Flow's EdgeProps.",
      blocks: [
        {
          label: "Edge.Temporary",
          body: (
            <Meta
              items={[
                { k: "id", v: "string, from EdgeProps — the BaseEdge id." },
                { k: "sourceX / sourceY / targetX / targetY", v: "number, from EdgeProps — the endpoints of the path." },
                { k: "sourcePosition / targetPosition", v: "Position, from EdgeProps — which side of each node the path leaves and enters." },
                { k: "style?", v: "CSSProperties, from EdgeProps — merged LAST, so it can override the default stroke and dash array." },
                { k: "Path", v: "getSimpleBezierPath; class stroke-1 stroke-ring; inline stroke var(--color-ring) and strokeDasharray 5, 5." },
              ]}
            />
          ),
        },
        {
          label: "Edge.Animated",
          body: (
            <Meta
              items={[
                { k: "id, source, target", v: "string, from EdgeProps — source and target are node ids, looked up with useInternalNode; the edge renders null if either node is missing." },
                { k: "markerEnd?", v: "string, from EdgeProps — passed to BaseEdge." },
                { k: "style?", v: "CSSProperties, from EdgeProps — passed to BaseEdge." },
                { k: "Path", v: "getBezierPath from the source's right-hand handle to the target's left-hand handle (handles looked up by position, with a small offset so the arrowhead shows). A circle of radius 4 filled with var(--color-action-ink) follows it with animateMotion for 2s, repeating." },
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
      description: "The role and the keyboard belong to the wrapper React Flow draws around an edge.",
      blocks: [
        {
          body: (
            <Meta
              items={[
                { k: "Roles and names", v: 'React Flow wraps each edge as role="group" (focusable) or role="img" with aria-roledescription="edge", named "Edge from <source> to <target>" unless the edge object sets ariaLabel — set one that uses the step titles, not the ids.' },
                { k: "Keyboard", v: "A focusable edge is a tab stop; Enter or Space selects it; Backspace or Delete removes it unless the Canvas or the edge forbids it." },
                { k: "Not colour alone", v: "Animated and Temporary differ by motion and by dash, not only by colour, and the node footer carries the status in words, so the edge is never the only signal." },
                { k: "Colour", v: "The stroke is the ring colour (Temporary) or the border colour (default); the dot is action-ink, which differs per theme, because a mark with no foreground of its own is judged like text." },
                { k: "Motion", v: "Animated's dot is a SMIL animation that repeats forever and does not read prefers-reduced-motion. Where that matters, give the edge the default type instead; the running state is still announced by the node footer." },
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
              draws an edge between each consecutive pair of steps and picks the type
              from the step the edge enters: running travels, skipped is dashed. Two
              vendored changes. <strong>Temporary&apos;s stroke is set inline</strong>:
              <code className="type-code"> stroke-ring</code> lives in a utilities layer and
              lost to xyflow&apos;s unlayered edge-path rule, which painted its hard-coded
              grey. <strong>Animated&apos;s dot</strong> was <code className="type-code">var(--primary)</code>;
              it is action-ink now, because a mark with no foreground of its own is on the
              same contract as text.
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
