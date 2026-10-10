"use client";

import { Canvas } from "@/components/ai-elements/canvas";
import { Panel, StateCell, StateGrid } from "@/components/ds/kit";

import { edgeTypes, FlowFrame, miniNodeTypes, pairEdges, pairNodes, planEdges, planNodes, stepNodeTypes } from "../ai-canvas/flow-fixture";

const NOTES = {
  default: "React Flow's own bezier, coloured by xy-tokens",
  animated: "Edge.Animated: a bezier plus a travelling dot",
  temporary: "Edge.Temporary: a dashed stroke in the ring colour",
} as const;

export function EdgePreview() {
  return (
    <Panel label="Edge" note="Edge.Animated into the running step · Edge.Temporary into the skipped one">
      <FlowFrame label="Animated and temporary edges">
        <Canvas edges={planEdges} edgeTypes={edgeTypes} nodes={planNodes()} nodeTypes={stepNodeTypes} nodesConnectable={false} nodesDraggable={false} />
      </FlowFrame>
    </Panel>
  );
}

export function EdgeStateGrid() {
  return (
    <StateGrid cols={3}>
      {(["default", "animated", "temporary"] as const).map((type) => (
        <StateCell key={type} label={type} note={NOTES[type]}>
          <FlowFrame className="h-40" label={`${type} edge`}>
            <Canvas edges={pairEdges(type)} edgeTypes={edgeTypes} nodes={pairNodes()} nodeTypes={miniNodeTypes} nodesConnectable={false} nodesDraggable={false} />
          </FlowFrame>
        </StateCell>
      ))}
    </StateGrid>
  );
}
