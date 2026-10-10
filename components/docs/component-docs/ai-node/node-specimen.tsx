"use client";

import { Canvas } from "@/components/ai-elements/canvas";
import { Node, NodeAction, NodeContent, NodeDescription, NodeFooter, NodeHeader, NodeTitle } from "@/components/ai-elements/node";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";
import { Button } from "@/components/ui/button";

import { edgeTypes, FlowFrame, planEdges, planNodes, stepNodeTypes } from "../ai-canvas/flow-fixture";

/** The Preview: the same node used three times in a graph, with handles only where an edge needs one. */
export function NodePreview() {
  return (
    <Panel label="Node" note="first step: no target handle · last step: no source handle">
      <FlowFrame label="Three workflow nodes">
        <Canvas edges={planEdges} edgeTypes={edgeTypes} nodes={planNodes()} nodeTypes={stepNodeTypes} nodesConnectable={false} nodesDraggable={false} />
      </FlowFrame>
    </Panel>
  );
}

/**
 * Nodes standalone: with both handles off a Node is a plain card, so it needs
 * no React Flow context to render.
 */
export function NodeStateGrid() {
  return (
    <StateGrid cols={3}>
      <StateCell label="rest" note="header · content · footer">
        <Node className="w-full" handles={{ target: false, source: false }}>
          <NodeHeader>
            <NodeTitle>Fetch the report</NodeTitle>
            <NodeDescription>Step 1 of 3</NodeDescription>
          </NodeHeader>
          <NodeContent>
            <p className="type-small text-muted-foreground">Pulls the weekly export.</p>
          </NodeContent>
          <NodeFooter>
            <span className="type-small">Done</span>
          </NodeFooter>
        </Node>
      </StateCell>
      <StateCell label="with action" note="NodeAction pins a control top-right">
        <Node className="w-full" handles={{ target: false, source: false }}>
          <NodeHeader>
            <NodeTitle>Summarise findings</NodeTitle>
            <NodeDescription>Step 2 of 3</NodeDescription>
            <NodeAction>
              <Button size="sm" variant="ghost">
                Edit
              </Button>
            </NodeAction>
          </NodeHeader>
          <NodeContent>
            <p className="type-small text-muted-foreground">Three sections, one paragraph each.</p>
          </NodeContent>
        </Node>
      </StateCell>
      <StateCell label="body only" note="no header or footer: the card keeps its radius">
        <Node className="w-full" handles={{ target: false, source: false }}>
          <NodeContent>
            <p className="type-small">Publish to the wiki</p>
          </NodeContent>
        </Node>
      </StateCell>
    </StateGrid>
  );
}
