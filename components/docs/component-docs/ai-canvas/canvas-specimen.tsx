"use client";

import { Canvas } from "@/components/ai-elements/canvas";
import { Connection } from "@/components/ai-elements/connection";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { edgeTypes, FlowFrame, pairEdges, pairNodes, miniNodeTypes, planEdges, planNodes, stepNodeTypes } from "./flow-fixture";

export function CanvasPreview() {
  return (
    <Panel label="Canvas" note="scroll to pan · drag on empty space to select">
      <FlowFrame label="Plan as a workflow graph">
        <Canvas connectionLineComponent={Connection} edges={planEdges} edgeTypes={edgeTypes} nodes={planNodes()} nodeTypes={stepNodeTypes} nodesConnectable={false} nodesDraggable={false} />
      </FlowFrame>
    </Panel>
  );
}

export function CanvasStateGrid() {
  return (
    <StateGrid cols={3}>
      <StateCell label="rest" note="default props">
        <FlowFrame className="h-48" label="Rest">
          <Canvas edges={pairEdges("default")} edgeTypes={edgeTypes} nodes={pairNodes()} nodeTypes={miniNodeTypes} />
        </FlowFrame>
      </StateCell>
      <StateCell label="empty" note="no nodes: the dotted background alone">
        <FlowFrame className="h-48" label="Empty">
          <Canvas edges={[]} nodes={[]} />
        </FlowFrame>
      </StateCell>
      <StateCell label="panOnDrag" note="a caller override of the default">
        <FlowFrame className="h-48" label="Drag to pan">
          <Canvas edges={pairEdges("default")} edgeTypes={edgeTypes} nodes={pairNodes()} nodeTypes={miniNodeTypes} panOnDrag selectionOnDrag={false} />
        </FlowFrame>
      </StateCell>
    </StateGrid>
  );
}
