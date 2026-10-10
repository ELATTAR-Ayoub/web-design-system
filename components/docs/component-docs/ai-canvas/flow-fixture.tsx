"use client";

import type { Edge as FlowEdge, Node as FlowNode, NodeProps as FlowNodeProps } from "@xyflow/react";
import type { ReactNode } from "react";

import { Edge } from "@/components/ai-elements/edge";
import { Node, NodeContent, NodeDescription, NodeFooter, NodeHeader, NodeTitle } from "@/components/ai-elements/node";
import { Toolbar } from "@/components/ai-elements/toolbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type StepData = {
  title: string;
  detail: string;
  status: string;
  target: boolean;
  source: boolean;
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

export function planNodes(extra: Partial<StepData> = {}): StepFlowNode[] {
  return [
    step("fetch", 0, "Fetch the report", "Step 1 of 3", "Done", false, extra),
    step("summarise", 1, "Summarise findings", "Step 2 of 3", "Running", false, extra),
    step("publish", 2, "Publish to the wiki", "Step 3 of 3", "Skipped", true, extra),
  ];
}

export const planEdges: FlowEdge[] = [
  { id: "fetch->summarise", source: "fetch", target: "summarise", type: "animated" },
  { id: "summarise->publish", source: "summarise", target: "publish", type: "temporary" },
];

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

export function FlowFrame({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
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
