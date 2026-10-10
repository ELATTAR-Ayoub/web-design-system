"use client";

import { Canvas } from "@/components/ai-elements/canvas";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { edgeTypes, FlowFrame, planEdges, planNodes, stepNodeTypes } from "../ai-canvas/flow-fixture";

/**
 * The Preview: the toolbar forced visible (`isVisible`) on every node so it
 * can be seen without selecting one. In the product it shows for the selected
 * node only.
 */
export function ToolbarPreview() {
  return (
    <Panel label="Toolbar" note="forced visible here; the workflow dialog shows it for the selected node only">
      <FlowFrame className="h-96" label="Nodes with a toolbar">
        <Canvas edges={planEdges} edgeTypes={edgeTypes} nodes={planNodes({ toolbar: true })} nodeTypes={stepNodeTypes} nodesConnectable={false} nodesDraggable={false} />
      </FlowFrame>
    </Panel>
  );
}

/** Hidden versus shown. */
export function ToolbarStateGrid() {
  return (
    <StateGrid cols={2}>
      <StateCell label="hidden" note="no node selected: nothing renders (the default)">
        <FlowFrame className="h-56" label="Toolbar hidden">
          <Canvas edges={[]} nodes={planNodes().slice(0, 1)} nodeTypes={stepNodeTypes} nodesConnectable={false} nodesDraggable={false} />
        </FlowFrame>
      </StateCell>
      <StateCell label="visible" note="isVisible, or the node is selected">
        <FlowFrame className="h-56" label="Toolbar visible">
          <Canvas edges={[]} nodes={planNodes({ toolbar: true }).slice(0, 1)} nodeTypes={stepNodeTypes} nodesConnectable={false} nodesDraggable={false} />
        </FlowFrame>
      </StateCell>
    </StateGrid>
  );
}
