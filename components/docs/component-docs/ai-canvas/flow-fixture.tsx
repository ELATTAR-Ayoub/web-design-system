"use client";

import type { Edge as FlowEdge, Node as FlowNode, NodeProps as FlowNodeProps } from "@xyflow/react";
import type { ReactNode } from "react";

import { Edge } from "@/components/ai-elements/edge";
import { Node, NodeContent, NodeDescription, NodeFooter, NodeHeader, NodeTitle } from "@/components/ai-elements/node";
import { Toolbar } from "@/components/ai-elements/toolbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Shared fixtures for the seven workflow-graph documentation pages
 * (`ai-canvas`, `ai-node`, `ai-edge`, `ai-connection`, `ai-controls`,
 * `ai-panel`, `ai-toolbar`). They all render the same small plan the
 * AgentWorkspace's "View as workflow" dialog draws, with fixed data: no
 * network, no timers.
 *
 * React Flow lays out into its parent's box, so every specimen sits in
 * `FlowFrame` — a container with a definite height. Without one the graph
 * renders at zero height and nothing shows.
 */

export type StepData = {
  title: string;
  detail: string;
  status: string;
  /** Draw the left (target) handle. */
  target: boolean;
  /** Draw the right (source) handle. */
  source: boolean;
  /** Show the node toolbar even when the node is not selected. */
  toolbar?: boolean;
  [key: string]: unknown;
};

type StepFlowNode = FlowNode<StepData, "step">;

const NODE_SIZE = { width: 240, height: 128 } as const;

function StepNode({ data }: FlowNodeProps<StepFlowNode>) {
  return (
    <Node className="w-60" handles={{ target: data.target, source: data.source }}>
      <NodeHeader>
        <NodeTitle>{data.title}</NodeTitle>
        <NodeDescription>{data.detail}</NodeDescription>
      </NodeHeader>
      <NodeContent>
        <p className="type-small text-muted-foreground">Runs after the step before it finishes.</p>
      </NodeContent>
      <NodeFooter>
        <span className="type-small">{data.status}</span>
      </NodeFooter>
      {data.toolbar && (
        <Toolbar isVisible>
          <Button size="sm" variant="ghost">
            Edit step
          </Button>
          <Button size="sm" variant="ghost">
            Skip step
          </Button>
        </Toolbar>
      )}
    </Node>
  );
}

/** A title-only node, small enough to show one edge per cell of a state grid. */
function MiniNode({ data }: FlowNodeProps<StepFlowNode>) {
  return (
    <Node className="w-28" handles={{ target: data.target, source: data.source }}>
      <NodeHeader>
        <NodeTitle className="type-small">{data.title}</NodeTitle>
      </NodeHeader>
    </Node>
  );
}

export const stepNodeTypes = { step: StepNode };
export const miniNodeTypes = { step: MiniNode };
export const edgeTypes = { animated: Edge.Animated, temporary: Edge.Temporary };

const step = (
  id: string,
  index: number,
  title: string,
  detail: string,
  status: string,
  last: boolean,
  extra: Partial<StepData> = {},
): StepFlowNode => ({
  id,
  type: "step",
  position: { x: index * 300, y: 0 },
  data: { title, detail, status, target: index > 0, source: !last, ...extra },
  draggable: false,
  connectable: false,
  deletable: false,
  measured: NODE_SIZE,
});

/** Three steps: one done, one running, one skipped. */
export function planNodes(extra: Partial<StepData> = {}): StepFlowNode[] {
  return [
    step("fetch", 0, "Fetch the report", "Step 1 of 3", "Done", false, extra),
    step("summarise", 1, "Summarise findings", "Step 2 of 3", "Running", false, extra),
    step("publish", 2, "Publish to the wiki", "Step 3 of 3", "Skipped", true, extra),
  ];
}

/** The edge into the running step travels; the edge into the skipped one is dashed. */
export const planEdges: FlowEdge[] = [
  { id: "fetch->summarise", source: "fetch", target: "summarise", type: "animated" },
  { id: "summarise->publish", source: "summarise", target: "publish", type: "temporary" },
];

/** Two small nodes joined by one edge of the given type. */
export function pairNodes(): StepFlowNode[] {
  const mini = { width: 112, height: 40 } as const;
  return [
    { ...step("a", 0, "From", "", "", false), measured: mini, position: { x: 0, y: 0 } },
    { ...step("b", 1, "To", "", "", true), measured: mini, position: { x: 180, y: 0 } },
  ];
}

export function pairEdges(type: "default" | "animated" | "temporary"): FlowEdge[] {
  return [{ id: `a->b-${type}`, source: "a", target: "b", type }];
}

/** A fixed-height box for React Flow to lay out into. */
export function FlowFrame({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  /** Names the graph for assistive tech. */
  label?: string;
}) {
  return (
    <div
      aria-label={label}
      className={cn("h-80 w-full overflow-hidden rounded-lg border border-border", className)}
      role={label ? "group" : undefined}
    >
      {children}
    </div>
  );
}
